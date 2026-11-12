import path from "node:path";
import * as sass from "sass";

const loaderPath = path.resolve(process.env.SUDEO_APP_LOADER_STYLES ?? "src/shared/ui/AppLoader/AppLoader.module.scss");
const heroPath = path.resolve(process.env.SUDEO_HERO_ORBIT_STYLES ?? "src/pages/home/ui/components/HeroOrbit/HeroOrbit.module.scss");
const failures = [];
const allowedAnimatedProperties = new Set(["opacity", "transform"]);

const compileStylesheet = (file, label) => {
    try {
        return sass.compile(file, { style: "expanded" }).css;
    } catch (error) {
        throw new Error(`${label} did not compile: ${error instanceof Error ? error.message : String(error)}`);
    }
};

const findBlockEnd = (source, open, label) => {
    let depth = 1;
    let quote = "";
    let escaped = false;
    for (let cursor = open + 1; cursor < source.length; cursor += 1) {
        const character = source[cursor];
        if (quote) {
            if (escaped) escaped = false;
            else if (character === "\\") escaped = true;
            else if (character === quote) quote = "";
            continue;
        }
        if (character === "\"" || character === "'") {
            quote = character;
            continue;
        }
        if (character === "/" && source[cursor + 1] === "*") {
            const close = source.indexOf("*/", cursor + 2);
            if (close === -1) throw new Error(`${label} contains an unterminated comment`);
            cursor = close + 1;
            continue;
        }
        if (character === "{") depth += 1;
        else if (character === "}") depth -= 1;
        if (depth === 0) return cursor;
    }
    throw new Error(`${label} contains an unclosed block`);
};

const parseNodes = (source, label) => {
    const nodes = [];
    let cursor = 0;
    while (cursor < source.length) {
        while (/\s/.test(source[cursor] ?? "")) cursor += 1;
        if (cursor >= source.length) break;
        if (source[cursor] === "/" && source[cursor + 1] === "*") {
            const close = source.indexOf("*/", cursor + 2);
            if (close === -1) throw new Error(`${label} contains an unterminated comment`);
            cursor = close + 2;
            continue;
        }
        const start = cursor;
        let quote = "";
        let escaped = false;
        let parentheses = 0;
        while (cursor < source.length) {
            const character = source[cursor];
            if (quote) {
                if (escaped) escaped = false;
                else if (character === "\\") escaped = true;
                else if (character === quote) quote = "";
                cursor += 1;
                continue;
            }
            if (character === "\"" || character === "'") {
                quote = character;
                cursor += 1;
                continue;
            }
            if (character === "(") parentheses += 1;
            else if (character === ")") parentheses -= 1;
            if (parentheses < 0) throw new Error(`${label} contains unmatched parentheses`);
            if (parentheses === 0 && (character === "{" || character === ";" || character === "}")) break;
            cursor += 1;
        }
        if (quote || parentheses !== 0) throw new Error(`${label} contains an unterminated string or parentheses`);
        const header = source.slice(start, cursor).trim();
        if (source[cursor] === ";") {
            cursor += 1;
            continue;
        }
        if (source[cursor] === "}") throw new Error(`${label} contains an unexpected closing brace`);
        if (source[cursor] !== "{") {
            if (header) throw new Error(`${label} contains a malformed statement: ${header}`);
            break;
        }
        const close = findBlockEnd(source, cursor, label);
        nodes.push({ header, body: source.slice(cursor + 1, close) });
        cursor = close + 1;
    }
    return nodes;
};

const splitTopLevel = (value, delimiter) => {
    const parts = [];
    let start = 0;
    let quote = "";
    let escaped = false;
    let parentheses = 0;
    for (let cursor = 0; cursor < value.length; cursor += 1) {
        const character = value[cursor];
        if (quote) {
            if (escaped) escaped = false;
            else if (character === "\\") escaped = true;
            else if (character === quote) quote = "";
            continue;
        }
        if (character === "\"" || character === "'") {
            quote = character;
            continue;
        }
        if (character === "(") parentheses += 1;
        else if (character === ")") parentheses -= 1;
        else if (character === delimiter && parentheses === 0) {
            parts.push(value.slice(start, cursor).trim());
            start = cursor + 1;
        }
    }
    parts.push(value.slice(start).trim());
    return parts.filter(Boolean);
};

const parseDeclarations = (body, label) => splitTopLevel(body, ";").map((statement) => {
    let quote = "";
    let escaped = false;
    let parentheses = 0;
    for (let cursor = 0; cursor < statement.length; cursor += 1) {
        const character = statement[cursor];
        if (quote) {
            if (escaped) escaped = false;
            else if (character === "\\") escaped = true;
            else if (character === quote) quote = "";
            continue;
        }
        if (character === "\"" || character === "'") {
            quote = character;
            continue;
        }
        if (character === "(") parentheses += 1;
        else if (character === ")") parentheses -= 1;
        else if (character === ":" && parentheses === 0) {
            const property = statement.slice(0, cursor).trim().toLowerCase();
            const value = statement.slice(cursor + 1).trim();
            if (!property || !value) throw new Error(`${label} contains a malformed declaration: ${statement}`);
            return { property, value };
        }
    }
    throw new Error(`${label} contains a malformed declaration: ${statement}`);
});

const selectorList = (header) => splitTopLevel(header, ",").map((selector) => selector.trim());
const normalizeProperty = (property) => property.replace(/^-(?:webkit|moz|ms|o)-/, "");
const animationDeclarations = (declarations) => declarations.filter(({ property }) => {
    const normalized = normalizeProperty(property);
    return normalized === "animation" || normalized === "animation-name";
});
const transitionDeclarations = (declarations) => declarations.filter(({ property }) => {
    const normalized = normalizeProperty(property);
    return normalized === "transition" || normalized === "transition-property";
});
const isAnimationNone = (value) => /^none$/i.test(value.trim());
const isTransitionNone = (value) => /^none$/i.test(value.trim());

const inspect = (css, owner, expectedKeyframes, governedAnimationOwners, governedTransitionOwners = []) => {
    const rootNodes = parseNodes(css, `${owner} compiled CSS`);
    const keyframes = new Map();
    const reducedMedia = [];
    const styleRules = [];

    const visit = (nodes, context = { reduced: false }) => {
        for (const node of nodes) {
            const keyframeMatch = node.header.match(/^@(?:-webkit-)?keyframes\s+([_a-zA-Z][\w-]*)$/i);
            if (keyframeMatch) {
                const name = keyframeMatch[1];
                const entries = keyframes.get(name) ?? [];
                entries.push(node);
                keyframes.set(name, entries);
                for (const step of parseNodes(node.body, `${owner} ${name} keyframes`)) {
                    for (const { property } of parseDeclarations(step.body, `${owner} ${name} keyframe step`)) {
                        if (!allowedAnimatedProperties.has(property)) failures.push(`${owner} keyframes ${name} animate forbidden property: ${property}`);
                    }
                }
                continue;
            }
            const mediaMatch = node.header.match(/^@media\s+(.+)$/i);
            if (mediaMatch) {
                const reduced = /^\(\s*prefers-reduced-motion\s*:\s*reduce\s*\)$/i.test(mediaMatch[1].trim());
                if (reduced) reducedMedia.push(node);
                visit(parseNodes(node.body, `${owner} media rule`), { reduced: context.reduced || reduced });
                continue;
            }
            if (node.header.startsWith("@")) {
                visit(parseNodes(node.body, `${owner} at-rule`), context);
                continue;
            }
            const declarations = parseDeclarations(node.body, `${owner} rule ${node.header}`);
            styleRules.push({ selectors: selectorList(node.header), declarations, reduced: context.reduced });
            for (const { property, value } of declarations) {
                const normalizedProperty = normalizeProperty(property);
                if (normalizedProperty === "transition-property") {
                    for (const animatedProperty of splitTopLevel(value, ",").map((part) => part.toLowerCase())) {
                        if (animatedProperty === "none") continue;
                        if (!allowedAnimatedProperties.has(animatedProperty)) failures.push(`${owner} transition animates forbidden property: ${animatedProperty}`);
                    }
                }
                if (normalizedProperty === "transition") {
                    for (const segment of splitTopLevel(value, ",")) {
                        const first = segment.trim().split(/\s+/)[0]?.toLowerCase();
                        const animatedProperty = /^(?:[-+]?\d|\.)/.test(first ?? "") ? "all" : first;
                        if (animatedProperty === "none") continue;
                        if (!allowedAnimatedProperties.has(animatedProperty)) failures.push(`${owner} transition animates forbidden property: ${animatedProperty || "<missing>"}`);
                    }
                }
            }
        }
    };

    visit(rootNodes);
    for (const name of expectedKeyframes) {
        const count = keyframes.get(name)?.length ?? 0;
        if (count !== 1) failures.push(`${owner} keyframes ${name} must exist exactly once; found ${count}`);
    }
    for (const name of keyframes.keys()) {
        if (!expectedKeyframes.includes(name)) failures.push(`${owner} contains unexpected automatic keyframes: ${name}`);
    }
    if (reducedMedia.length !== 1) failures.push(`${owner} reduced-motion media query must exist exactly once; found ${reducedMedia.length}`);
    const animationOwnerRules = styleRules
        .map((rule) => ({ ...rule, animations: animationDeclarations(rule.declarations) }))
        .filter((rule) => rule.animations.length > 0);
    for (const rule of animationOwnerRules) {
        const unexpectedSelectors = rule.selectors.filter((selector) => !governedAnimationOwners.includes(selector));
        if (unexpectedSelectors.length) failures.push(`${owner} animation uses unexpected or ambiguous owner: ${unexpectedSelectors.join(", ")}`);
    }
    for (const governedOwner of governedAnimationOwners) {
        const matching = animationOwnerRules.filter((rule) => rule.selectors.includes(governedOwner));
        const reduced = matching.filter((rule) => rule.reduced);
        const active = matching.filter((rule) => !rule.reduced);
        if (reduced.length !== 1 || reduced[0].animations.length !== 1 || !isAnimationNone(reduced[0].animations[0].value)) {
            failures.push(`${owner} reduced-motion rules must disable ${governedOwner} animation`);
        }
        if (active.length !== 1 || active[0].animations.length !== 1 || isAnimationNone(active[0].animations[0].value) || /!important\s*$/i.test(active[0].animations[0].value)) {
            failures.push(`${owner} must have one unambiguous non-important ${governedOwner} animation owner`);
        }
    }
    const transitionOwnerRules = styleRules
        .map((rule) => ({ ...rule, transitions: transitionDeclarations(rule.declarations) }))
        .filter((rule) => rule.transitions.length > 0);
    for (const rule of transitionOwnerRules) {
        const unexpectedSelectors = rule.selectors.filter((selector) => !governedTransitionOwners.includes(selector));
        if (unexpectedSelectors.length) failures.push(`${owner} transition uses unexpected or ambiguous owner: ${unexpectedSelectors.join(", ")}`);
    }
    for (const governedOwner of governedTransitionOwners) {
        const matching = transitionOwnerRules.filter((rule) => rule.selectors.includes(governedOwner));
        const reduced = matching.filter((rule) => rule.reduced);
        const active = matching.filter((rule) => !rule.reduced);
        if (reduced.length !== 1 || reduced[0].transitions.length !== 1 || !isTransitionNone(reduced[0].transitions[0].value)) {
            failures.push(`${owner} reduced-motion rules must disable ${governedOwner} transition`);
        }
        if (active.length !== 1 || active[0].transitions.length !== 1 || isTransitionNone(active[0].transitions[0].value) || /!important\s*$/i.test(active[0].transitions[0].value)) {
            failures.push(`${owner} must have one unambiguous non-important ${governedOwner} transition owner`);
        }
    }
    return styleRules;
};

const loaderCss = compileStylesheet(loaderPath, "Loader stylesheet");
const heroCss = compileStylesheet(heroPath, "Hero stylesheet");
const loaderRules = inspect(
    loaderCss,
    "Loader",
    ["orbit-spin", "brand-breathe", "mark-rise", "progress-sweep"],
    [".orbit", ".orbitInner", ".brand", ".logoMark i", ".progress i"],
    [".viewport"],
);
inspect(
    heroCss,
    "Hero",
    ["orbitDrift", "ringSpin", "ringBreathe", "coreMorph", "identityCycle", "markerOrbit", "markerCounterOrbit"],
    [".orbit", ".orbit::before", ".orbit::after", ".orbitCore", ".identity", ".markerTrack", ".marker"],
);

const loaderExitRules = loaderRules.filter((rule) => rule.selectors.includes(".viewport.exiting"));
if (loaderExitRules.length !== 1) failures.push(`Loader exit selector must exist exactly once; found ${loaderExitRules.length}`);
else if (loaderExitRules[0].declarations.some(({ property }) => property === "visibility")) {
    failures.push("Loader exit must not mutate visibility during the opacity fade");
}

if (failures.length) {
    console.error(`Motion check failed (${failures.length}):`);
    failures.forEach((failure) => console.error(`- ${failure}`));
    process.exit(1);
}

console.log("Motion check passed: compiled loader and hero keyframes/transitions use only transform/opacity with selector-owned reduced-motion coverage.");
