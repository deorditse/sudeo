import { readFile, readdir, stat } from "node:fs/promises";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = fileURLToPath(new URL("..", import.meta.url));
const srcRoot = join(root, "src");
const failures = new Set();

const addFailure = (failure) => failures.add(failure);
const toRelativePath = (file) => relative(srcRoot, file).split(sep).join("/");

const walk = async (directory, pattern = /\.(ts|tsx)$/) => {
    const entries = (await readdir(directory, { withFileTypes: true }))
        .sort((left, right) => left.name.localeCompare(right.name));
    const files = [];
    for (const entry of entries) {
        const path = join(directory, entry.name);
        if (entry.isDirectory()) files.push(...await walk(path, pattern));
        else if (pattern.test(entry.name)) files.push(path);
    }
    return files;
};

const sourceFiles = await walk(srcRoot);
const importPattern = /from\s+["']([^"']+)["']/g;
const rawLayoutTags = new Set(["div", "section", "article", "header", "aside"]);
const approvedContentShells = new Set(["MainContent", "PageHero"]);
const layoutPrimitiveCategories = new Map([
    ["Page", new Set(["grid", "spacing"])],
    ["MainContent", new Set(["grid", "spacing"])],
    ["Container", new Set(["grid", "spacing"])],
    ["Section", new Set(["grid", "spacing"])],
    ["AppPadding", new Set(["spacing"])],
    ["AppGrid", new Set(["grid"])],
    ["Flex", new Set(["grid"])],
    ["HStack", new Set(["grid"])],
    ["VStack", new Set(["grid"])],
]);
const structuralClassTokens = new Set([
    "actions", "body", "catalog", "column", "columns", "container", "content", "document",
    "facts", "grid", "header", "hero", "layout", "list", "page", "panel", "root", "roles",
    "section", "split", "stages", "wrapper",
]);
const decorativeClassTokens = new Set([
    "answer", "badge", "bubble", "callout", "card", "chip", "glow", "glyph", "icon",
    "illustration", "image", "logo", "marquee", "media", "orbit", "tile", "visual",
]);
const cssClassUsage = new Map();
const cssClassComponents = new Map();

const splitClassTokens = (className) => className
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((token) => token.toLowerCase());

const isStructuralClassName = (className) => {
    const tokens = splitClassTokens(className);
    return tokens.some((token) => structuralClassTokens.has(token))
        && !tokens.some((token) => decorativeClassTokens.has(token));
};

const recordCssClassUsage = (cssFile, className, categories, component) => {
    const key = `${cssFile}\0${className}`;
    const recorded = cssClassUsage.get(key) ?? new Set();
    categories.forEach((category) => recorded.add(category));
    cssClassUsage.set(key, recorded);
    const components = cssClassComponents.get(key) ?? new Set();
    components.add(component);
    cssClassComponents.set(key, components);
};

const getJsxTagName = (node, sourceFile) => node.tagName.getText(sourceFile);

const getStyleImports = (sourceFile, file) => {
    const styleImports = new Map();
    for (const statement of sourceFile.statements) {
        if (!ts.isImportDeclaration(statement) || !ts.isStringLiteral(statement.moduleSpecifier)) continue;
        const modulePath = statement.moduleSpecifier.text;
        if (!modulePath.endsWith(".module.scss") || !statement.importClause) continue;
        const cssFile = resolve(dirname(file), modulePath);
        if (statement.importClause.name) styleImports.set(statement.importClause.name.text, cssFile);
        const bindings = statement.importClause.namedBindings;
        if (bindings && ts.isNamespaceImport(bindings)) styleImports.set(bindings.name.text, cssFile);
    }
    return styleImports;
};

const getClassReferences = (attributes, styleImports) => {
    const references = [];
    const classNameAttribute = attributes.properties.find((property) => (
        ts.isJsxAttribute(property) && property.name.getText() === "className"
    ));
    if (!classNameAttribute?.initializer || !ts.isJsxExpression(classNameAttribute.initializer)) return references;
    const expression = classNameAttribute.initializer.expression;
    if (!expression) return references;

    const visit = (node) => {
        if (
            ts.isPropertyAccessExpression(node)
            && ts.isIdentifier(node.expression)
            && styleImports.has(node.expression.text)
        ) {
            references.push({
                cssFile: styleImports.get(node.expression.text),
                className: node.name.text,
            });
        }
        ts.forEachChild(node, visit);
    };
    visit(expression);
    return references;
};

for (const file of sourceFiles) {
    const rel = toRelativePath(file);
    const content = await readFile(file, "utf8");
    const imports = [...content.matchAll(importPattern)].map((match) => match[1]);

    if (rel.startsWith("shared/")) {
        const invalid = imports.filter((value) => /^@(?:\/)?(?:app|pages|widgets)\//.test(value));
        if (invalid.length) addFailure(`${rel}: shared imports upper layers: ${invalid.join(", ")}`);
    }

    if (rel.startsWith("widgets/")) {
        const invalid = imports.filter((value) => /^@(?:\/)?(?:app|pages)\//.test(value));
        if (invalid.length) addFailure(`${rel}: widget imports upper layers: ${invalid.join(", ")}`);
    }

    if (rel.startsWith("pages/")) {
        const [, pageSlice] = rel.split("/");
        const invalidApp = imports.filter((value) => /^@(?:\/)?app\//.test(value));
        const crossPage = imports.filter((value) => {
            const match = value.match(/^@(?:\/)?pages\/([^/]+)/);
            return match && match[1] !== pageSlice;
        });
        if (invalidApp.length) addFailure(`${rel}: page imports app layer: ${invalidApp.join(", ")}`);
        if (crossPage.length) addFailure(`${rel}: page imports another page slice: ${crossPage.join(", ")}`);
        if (/\/ui\/[^/]+\/[^/]+Page\.tsx$/.test(`/${rel}`) && /<(button|img)\b/.test(content)) {
            addFailure(`${rel}: route page uses raw button/img instead of shared primitives`);
        }
    }

    if (!rel.startsWith("pages/") || !rel.includes("/ui/") || !rel.endsWith(".tsx") || rel.endsWith(".async.tsx")) continue;

    const sourceFile = ts.createSourceFile(file, content, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const styleImports = getStyleImports(sourceFile, file);
    const routePage = /\/ui\/[^/]+Page\/[^/]+Page\.tsx$/.test(`/${rel}`);
    let pageCount = 0;
    let hasApprovedContentShell = false;

    const visitJsx = (node) => {
        if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
            const tagName = getJsxTagName(node, sourceFile);
            const line = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1;
            const classReferences = getClassReferences(node.attributes, styleImports);

            if (routePage && tagName === "Page") pageCount += 1;
            if (routePage && approvedContentShells.has(tagName)) hasApprovedContentShell = true;

            if (rawLayoutTags.has(tagName)) {
                addFailure(`${rel}:${line}: raw <${tagName}> layout container; use Box, AppGrid, AppPadding, or a stack primitive with semantic as`);
                for (const reference of classReferences) {
                    recordCssClassUsage(reference.cssFile, reference.className, new Set(["grid", "spacing"]), `raw:${tagName}`);
                }
            }

            const primitiveCategories = layoutPrimitiveCategories.get(tagName);
            if (primitiveCategories) {
                for (const reference of classReferences) {
                    recordCssClassUsage(reference.cssFile, reference.className, primitiveCategories, tagName);
                }
            } else if (tagName === "Box") {
                for (const reference of classReferences) {
                    if (isStructuralClassName(reference.className)) {
                        recordCssClassUsage(reference.cssFile, reference.className, new Set(["grid", "spacing"]), tagName);
                    }
                }
            }
        }
        ts.forEachChild(node, visitJsx);
    };
    visitJsx(sourceFile);

    if (routePage) {
        const pageImport = imports.includes("@widgets/Page");
        if (!pageImport) addFailure(`${rel}: route page must import Page from @widgets/Page`);
        if (pageCount !== 1) addFailure(`${rel}: route page must render exactly one Page shell, found ${pageCount}`);
        if (!hasApprovedContentShell) {
            addFailure(`${rel}: route page must render MainContent or an approved content shell (${[...approvedContentShells].filter((name) => name !== "MainContent").join(", ")})`);
        }
    }
}

const parseCssRules = (content, offset = 0, atRules = []) => {
    const rules = [];
    let cursor = 0;
    while (cursor < content.length) {
        const open = content.indexOf("{", cursor);
        if (open === -1) break;
        const headerStart = Math.max(content.lastIndexOf("}", open - 1), content.lastIndexOf(";", open - 1)) + 1;
        const header = content.slice(headerStart, open).trim();
        let depth = 1;
        let close = open + 1;
        while (close < content.length && depth > 0) {
            if (content[close] === "{") depth += 1;
            else if (content[close] === "}") depth -= 1;
            close += 1;
        }
        if (depth !== 0) break;
        const body = content.slice(open + 1, close - 1);
        const absoluteOpen = offset + open;
        if (/^@(media|supports|container|layer)\b/.test(header)) {
            rules.push(...parseCssRules(body, absoluteOpen + 1, [...atRules, header]));
        } else if (!/^@/.test(header)) {
            rules.push({ selector: header, body, index: absoluteOpen + 1, atRules });
            if (body.includes("{")) rules.push(...parseCssRules(body, absoluteOpen + 1, atRules));
        }
        cursor = close;
    }
    return rules;
};

const cssFiles = await walk(join(srcRoot, "pages"), /\.module\.scss$/);
for (const file of cssFiles) {
    const rel = toRelativePath(file);
    const rawContent = await readFile(file, "utf8");
    const content = rawContent.replace(/\/\*[\s\S]*?\*\//g, (comment) => " ".repeat(comment.length));
    const rules = parseCssRules(content);

    for (const rule of rules) {
        const declarations = [...rule.body.matchAll(/(?:^|;)\s*([a-z-]+)\s*:\s*([^;{}]+)/g)]
            .map((match) => ({ property: match[1], value: match[2].trim(), index: rule.index + match.index }));
        if (!declarations.length) continue;

        for (const selector of rule.selector.split(",").map((value) => value.trim()).filter(Boolean)) {
            const rightmostPart = selector.split(/[>+~\s]+/).filter(Boolean).at(-1) ?? "";
            const targetClasses = [...rightmostPart.matchAll(/\.([_a-zA-Z]+[\w-]*)/g)].map((match) => match[1]);
            const siblingSectionRhythm = /(?:section|article|header|aside)(?:\.[\w-]+)?\s*\+\s*(?:section|article|header|aside)(?:\.[\w-]+)?(?:[:\[].*)?$/.test(selector);
            const interactiveState = /:(?:active|focus|focus-visible|focus-within|hover)\b/.test(selector);
            const responsiveContext = rule.atRules.some((atRule) => /^@media\b/.test(atRule));
            const reducedMotionContext = rule.atRules.some((atRule) => /prefers-reduced-motion/.test(atRule));

            for (const declaration of declarations) {
                const isGap = declaration.property === "gap"
                    || declaration.property === "row-gap"
                    || declaration.property === "column-gap";
                const isGridTemplate = declaration.property.startsWith("grid-");
                const isGridDisplay = declaration.property === "display" && /^(?:inline-)?grid$/.test(declaration.value);
                const isGrid = isGap || isGridTemplate || isGridDisplay;
                const isSpacing = declaration.property.startsWith("padding") || declaration.property.startsWith("margin");
                if (!isGrid && !isSpacing) continue;
                if (interactiveState || reducedMotionContext) continue;

                const category = isGrid ? "grid" : "spacing";
                const isDecorativeHairlineGap = isGap && /^(?:0|1px)$/.test(declaration.value);
                if (isDecorativeHairlineGap) continue;
                const usedByLayoutPrimitive = targetClasses.some((className) => (
                    cssClassUsage.get(`${file}\0${className}`)?.has(category)
                ));
                const targetComponents = new Set(targetClasses.flatMap((className) => (
                    [...(cssClassComponents.get(`${file}\0${className}`) ?? [])]
                )));
                const approvedGridOverride = targetComponents.has("AppGrid")
                    && (isGridTemplate || (responsiveContext && isGap));
                const responsiveStackGap = responsiveContext
                    && isGap
                    && ["AppGrid", "Flex", "HStack", "VStack"].some((component) => targetComponents.has(component));
                const targetsStructuralClass = targetClasses.some(isStructuralClassName);
                const ownsSiblingRhythm = isSpacing && siblingSectionRhythm;
                if (approvedGridOverride || responsiveStackGap) continue;
                if (!usedByLayoutPrimitive && !targetsStructuralClass && !ownsSiblingRhythm) continue;

                const line = content.slice(0, declaration.index).split("\n").length;
                const owner = targetClasses[0] ? `.${targetClasses[0]}` : selector;
                const primitive = isGrid ? "AppGrid or stack props" : "AppPadding, Section, or stack props";
                addFailure(`${rel}:${line}: ${owner} owns structural ${declaration.property}; use ${primitive}`);
            }
        }
    }
}

const pagesRoot = join(srcRoot, "pages");
const pageEntries = (await readdir(pagesRoot, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .sort((left, right) => left.name.localeCompare(right.name));
for (const entry of pageEntries) {
    const pageRoot = join(pagesRoot, entry.name);
    for (const required of ["model", "ui"]) {
        try {
            if (!(await stat(join(pageRoot, required))).isDirectory()) throw new Error();
        } catch {
            addFailure(`pages/${entry.name}: missing ${required}/ boundary`);
        }
    }
    const uiFiles = await walk(join(pageRoot, "ui"));
    const asyncFiles = uiFiles.filter((file) => file.endsWith(".async.tsx"));
    if (asyncFiles.length !== 1) addFailure(`pages/${entry.name}: expected one .async.tsx file, found ${asyncFiles.length}`);
    const indexPath = join(pageRoot, "index.ts");
    const indexContent = await readFile(indexPath, "utf8").catch(() => "");
    if (!indexContent.includes(".async")) addFailure(`pages/${entry.name}/index.ts: lazy async export is missing`);
    const modelFiles = await walk(join(pageRoot, "model"));
    if (!modelFiles.some((file) => !file.endsWith("index.ts"))) addFailure(`pages/${entry.name}/model: contains no real model implementation`);
}

const routesSource = await readFile(join(srcRoot, "shared/config/routes.ts"), "utf8");
const manifestPaths = [...routesSource.matchAll(/path:\s*"([^"]+)"/g)].map((match) => match[1]);
const navigationSection = routesSource.slice(routesSource.indexOf("export const navigationGroups"), routesSource.indexOf("export const visitorNavigationItems"));
const navigationPaths = [...navigationSection.matchAll(/path:\s*"([^"]+)"/g)].map((match) => match[1]);
const expectedNavigationPaths = manifestPaths.filter((path) => !["/success", "/404"].includes(path));
for (const path of expectedNavigationPaths) {
    const occurrences = navigationPaths.filter((candidate) => candidate === path).length;
    if (occurrences !== 1) addFailure(`navigationGroups: ${path} must appear exactly once, found ${occurrences}`);
}
for (const path of navigationPaths) {
    if (!manifestPaths.includes(path)) addFailure(`navigationGroups: undeclared route ${path}`);
}

const sortedFailures = [...failures].sort((left, right) => left.localeCompare(right));
if (sortedFailures.length) {
    console.error(`Architecture check failed (${sortedFailures.length}):`);
    sortedFailures.forEach((failure) => console.error(`- ${failure}`));
    process.exit(1);
}

console.log(`Architecture check passed: ${pageEntries.length} page slices, layer imports, lazy exports, shared page composition, structural spacing and ${navigationPaths.length} discovery routes.`);
