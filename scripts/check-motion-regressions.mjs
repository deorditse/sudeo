import { cp, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = path.resolve();
const checker = path.join(root, "scripts/check-motion.mjs");
const sourceLoader = path.join(root, "src/shared/ui/AppLoader/AppLoader.module.scss");
const sourceHero = path.join(root, "src/pages/home/ui/components/HeroOrbit/HeroOrbit.module.scss");
const temporaryRoot = await mkdtemp(path.join(tmpdir(), "sudeo-motion-regressions-"));

const expectFailure = (result, pattern, label) => {
    const output = `${result.stdout}\n${result.stderr}`;
    if (result.status === 0 || !pattern.test(output)) {
        throw new Error(`${label} fixture did not fail as expected.\n${output}`);
    }
};

const runFixture = async (name, target, mutate, expected) => {
    const fixtureRoot = path.join(temporaryRoot, name);
    await cp(path.dirname(sourceLoader), path.join(fixtureRoot, "loader"), { recursive: true });
    await cp(path.dirname(sourceHero), path.join(fixtureRoot, "hero"), { recursive: true });
    const loader = path.join(fixtureRoot, "loader/AppLoader.module.scss");
    const hero = path.join(fixtureRoot, "hero/HeroOrbit.module.scss");
    const fixturePath = target === "loader" ? loader : hero;
    const original = await readFile(fixturePath, "utf8");
    const changed = mutate(original);
    if (changed === original) throw new Error(`${name} fixture mutation did not change its stylesheet`);
    await writeFile(fixturePath, changed);
    const result = spawnSync(process.execPath, [checker], {
        cwd: root,
        encoding: "utf8",
        env: {
            ...process.env,
            SUDEO_APP_LOADER_STYLES: loader,
            SUDEO_HERO_ORBIT_STYLES: hero,
        },
    });
    expectFailure(result, expected, name);
};

const insertBeforeFinalBrace = (source, declaration) => {
    const finalBrace = source.lastIndexOf("}");
    if (finalBrace === -1) return source;
    return `${source.slice(0, finalBrace)}    ${declaration}\n${source.slice(finalBrace)}`;
};

try {
    await runFixture(
        "loader-visibility-transition",
        "loader",
        (source) => source.replace("transition: opacity 180ms ease;", "transition: opacity 180ms ease, visibility 180ms ease;"),
        /transition animates forbidden property: visibility/,
    );
    await runFixture(
        "loader-left-transition",
        "loader",
        (source) => source.replace("transition: opacity 180ms ease;", "transition: left 180ms ease, opacity 180ms ease;"),
        /transition animates forbidden property: left/,
    );
    await runFixture(
        "uppercase-loader-left-transition",
        "loader",
        (source) => source.replace("transition: opacity 180ms ease;", "TRANSITION: left 180ms ease, opacity 180ms ease;"),
        /transition animates forbidden property: left/,
    );
    await runFixture(
        "webkit-loader-left-transition",
        "loader",
        (source) => source.replace("transition: opacity 180ms ease;", "-webkit-transition: left 180ms ease;"),
        /transition animates forbidden property: left/,
    );
    await runFixture(
        "loader-exit-visibility",
        "loader",
        (source) => source.replace("opacity: 0;\n    pointer-events: none;", "opacity: 0;\n    visibility: hidden;\n    pointer-events: none;"),
        /must not mutate visibility/,
    );
    await runFixture(
        "loader-background-animation",
        "loader",
        (source) => source.replace("50% { transform: scale(1.025); }", "50% { transform: scale(1.025); background-color: #11130f; }"),
        /brand-breathe animate forbidden property: background-color/,
    );
    await runFixture(
        "uppercase-loader-background-animation",
        "loader",
        (source) => source.replace("50% { transform: scale(1.025); }", "50% { transform: scale(1.025); BACKGROUND-COLOR: #11130f; }"),
        /brand-breathe animate forbidden property: background-color/,
    );
    await runFixture(
        "loader-height-animation",
        "loader",
        (source) => source.replace("to { transform: scaleY(1); opacity: 1; }", "to { transform: scaleY(1); opacity: 1; height: 30px; }"),
        /mark-rise animate forbidden property: height/,
    );
    await runFixture(
        "hero-border-radius-animation",
        "hero",
        (source) => source.replace("33% { transform:", "33% { border-radius: 50%; transform:"),
        /coreMorph animate forbidden property: border-radius/,
    );
    await runFixture(
        "hero-filter-animation",
        "hero",
        (source) => source.replace("66% { transform:", "66% { filter: blur(1px); transform:"),
        /coreMorph animate forbidden property: filter/,
    );
    await runFixture(
        "comment-shadowing",
        "loader",
        (source) => `/* .viewport { transition: opacity 180ms ease; } */\n${source.replace("transition: opacity 180ms ease;", "transition: opacity 180ms ease, visibility 180ms ease;")}`,
        /transition animates forbidden property: visibility/,
    );
    await runFixture(
        "duplicate-keyframes",
        "loader",
        (source) => `${source}\n@keyframes brand-breathe { 50% { transform: scale(1.01); } }\n`,
        /brand-breathe must exist exactly once; found 2/,
    );
    await runFixture(
        "missing-keyframes",
        "hero",
        (source) => source.replace("@keyframes markerCounterOrbit", "@keyframes removedMarkerCounterOrbit"),
        /markerCounterOrbit must exist exactly once; found 0/,
    );
    await runFixture(
        "quoted-keyframe-decoy",
        "loader",
        (source) => `$decoy: "@keyframes brand-breathe { 50% { transform: scale(1.01); } }";\n${source.replace("@keyframes brand-breathe", "@keyframes removed-brand-breathe")}`,
        /brand-breathe must exist exactly once; found 0/,
    );
    await runFixture(
        "missing-reduced-motion-owner",
        "loader",
        (source) => source.replace("    .brand,\n", ""),
        /reduced-motion rules must disable \.brand animation/,
    );
    await runFixture(
        "detached-reduced-motion-owner",
        "loader",
        (source) => source
            .replace("    .brand,\n", "    .brandRemoved,\n")
            .replace("    .progress i {", "    .brand, .decoy { color: red; }\n    .unrelated { animation: none; }\n\n    .progress i {"),
        /reduced-motion rules must disable \.brand animation/,
    );
    await runFixture(
        "reduced-motion-multiple-animation",
        "loader",
        (source) => source.replace("        animation: none;", "        animation: none 0s, brand-breathe 2.2s ease-in-out infinite;"),
        /reduced-motion rules must disable \.brand animation/,
    );
    await runFixture(
        "reduced-motion-duplicate-override",
        "loader",
        (source) => source.replace("        animation: none;", "        animation: none;\n        animation: brand-breathe 2.2s ease-in-out infinite;"),
        /reduced-motion rules must disable \.brand animation/,
    );
    await runFixture(
        "reduced-motion-specificity-override",
        "loader",
        (source) => source.replace("    .progress i {", "    .stage .brand { animation: brand-breathe 2.2s ease-in-out infinite; }\n\n    .progress i {"),
        /unexpected or ambiguous owner/,
    );
    await runFixture(
        "loader-live-important",
        "loader",
        (source) => source.replace("animation: brand-breathe 2.2s ease-in-out infinite;", "animation: brand-breathe 2.2s ease-in-out infinite !important;"),
        /one unambiguous non-important \.brand animation owner/,
    );
    await runFixture(
        "loader-late-exact-owner",
        "loader",
        (source) => `${source}\n.brand { animation: brand-breathe 2.2s ease-in-out infinite; }\n`,
        /one unambiguous non-important \.brand animation owner/,
    );
    await runFixture(
        "loader-grouped-higher-specificity",
        "loader",
        (source) => `${source}\n.brand, .stage .brand { animation: brand-breathe 2.2s ease-in-out infinite; }\n`,
        /unexpected or ambiguous owner/,
    );
    await runFixture(
        "hero-live-important",
        "hero",
        (source) => source.replace("animation: coreMorph 5s ease-in-out infinite;", "animation: coreMorph 5s ease-in-out infinite !important;"),
        /one unambiguous non-important \.orbitCore animation owner/,
    );
    await runFixture(
        "hero-late-exact-owner",
        "hero",
        (source) => `${source}\n.orbitCore { animation: coreMorph 5s ease-in-out infinite; }\n`,
        /one unambiguous non-important \.orbitCore animation owner/,
    );
    await runFixture(
        "loader-reduced-motion-important",
        "loader",
        (source) => source.replace("        animation: none;", "        animation: none !important;"),
        /reduced-motion rules must disable \.brand animation/,
    );
    await runFixture(
        "hero-reduced-motion-important",
        "hero",
        (source) => source.replace("        animation: none;", "        animation: none !important;"),
        /reduced-motion rules must disable \.orbitCore animation/,
    );
    for (const [name, selector, animation] of [
        ["orbit", ".orbit", "orbit-spin 7s linear infinite"],
        ["orbit-inner", ".orbitInner", "orbit-spin 5s linear infinite reverse"],
        ["logo-mark", ".logoMark i", "mark-rise 1.2s ease-in-out infinite alternate"],
        ["progress", ".progress i", "progress-sweep 1.5s ease-in-out infinite"],
    ]) {
        await runFixture(
            `loader-reduced-${name}-reenabled`,
            "loader",
            (source) => insertBeforeFinalBrace(source, `${selector} { animation: ${animation}; }`),
            /reduced-motion rules must disable/,
        );
    }
    await runFixture(
        "loader-reduced-viewport-transition-reenabled",
        "loader",
        (source) => insertBeforeFinalBrace(source, ".viewport { transition: opacity 180ms ease; }"),
        /reduced-motion rules must disable \.viewport transition/,
    );
    for (const [name, selector, animation] of [
        ["orbit", ".orbit", "orbitDrift 7s ease-in-out infinite"],
        ["orbit-before", ".orbit::before", "ringSpin 18s linear infinite"],
        ["orbit-after", ".orbit::after", "ringBreathe 4.5s ease-in-out infinite"],
        ["identity", ".identity", "identityCycle 10s ease-in-out infinite both"],
        ["marker-track", ".markerTrack", "markerOrbit 18s linear infinite"],
        ["marker", ".marker", "markerCounterOrbit 18s linear infinite"],
    ]) {
        await runFixture(
            `hero-reduced-${name}-reenabled`,
            "hero",
            (source) => insertBeforeFinalBrace(source, `${selector} { animation: ${animation}; }`),
            /reduced-motion rules must disable/,
        );
    }
    console.log("Motion negative fixtures passed: prefixed/case-insensitive paint properties, quoted/comment decoys, duplicate/missing owners, and strict reduced-motion cascade ownership were rejected.");
} finally {
    await rm(temporaryRoot, { recursive: true, force: true });
}
