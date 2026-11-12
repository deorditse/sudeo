import { cp, mkdtemp, readFile, rm, symlink, writeFile } from "node:fs/promises";
import { randomBytes } from "node:crypto";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { resolveOutputAsset, validateManifestEntry } from "./delivery-paths.mjs";

const sourceRoot = path.resolve("docs");
const serverEntry = path.resolve(".ssr/entry-server.js");
const temporaryRoot = await mkdtemp(path.join(tmpdir(), "sudeo-delivery-regressions-"));

const run = (script, fixtureRoot, args = []) => spawnSync(process.execPath, [path.resolve(script), ...args], {
    cwd: process.cwd(),
    encoding: "utf8",
    env: {
        ...process.env,
        SUDEO_OUTPUT_ROOT: fixtureRoot,
        SUDEO_SERVER_ENTRY: serverEntry,
    },
});

const expectFailure = (result, pattern, label) => {
    const output = `${result.stdout}\n${result.stderr}`;
    if (result.status === 0 || !pattern.test(output)) {
        throw new Error(`${label} fixture did not fail as expected.\n${output}`);
    }
};

try {
    for (const escapedAsset of ["../outside.css", "%2e%2e/outside.css", "/absolute.css", "assets\\outside.css"]) {
        let rejected = false;
        try { resolveOutputAsset(sourceRoot, escapedAsset); }
        catch { rejected = true; }
        if (!rejected) throw new Error(`Escaped asset path was accepted: ${escapedAsset}`);
    }
    const malformedEntries = [
        undefined,
        null,
        { file: null },
        { file: "" },
        { file: "assets/fixture.js", imports: null },
        { file: "assets/fixture.js", imports: {} },
        { file: "assets/fixture.js", imports: [null] },
        { file: "assets/fixture.js", css: null },
        { file: "assets/fixture.js", css: {} },
        { file: "assets/fixture.js", css: [null] },
    ];
    for (const malformedEntry of malformedEntries) {
        let rejected = false;
        try { validateManifestEntry({ fixture: malformedEntry }, "fixture"); }
        catch { rejected = true; }
        if (!rejected) throw new Error(`Malformed manifest entry was accepted: ${JSON.stringify(malformedEntry)}`);
    }

    const oversizedRoot = path.join(temporaryRoot, "oversized-entry");
    await cp(sourceRoot, oversizedRoot, { recursive: true });
    const oversizedManifestPath = path.join(oversizedRoot, ".vite/manifest.json");
    const oversizedManifest = JSON.parse(await readFile(oversizedManifestPath, "utf8"));
    const oversizedAsset = "assets/eager-fixture.mjs";
    await writeFile(path.join(oversizedRoot, oversizedAsset), randomBytes(20 * 1024));
    oversizedManifest["_eager-fixture.mjs"] = { file: oversizedAsset };
    oversizedManifest["index.html"].imports = [
        ...(oversizedManifest["index.html"].imports ?? []),
        "_eager-fixture.mjs",
    ];
    await writeFile(oversizedManifestPath, `${JSON.stringify(oversizedManifest, null, 2)}\n`);
    expectFailure(run("scripts/report-delivery.mjs", oversizedRoot, ["--check"]), /Eager application JavaScript gzip budget exceeded/, "Oversized entry");

    const malformedManifestRoot = path.join(temporaryRoot, "malformed-manifest");
    await cp(sourceRoot, malformedManifestRoot, { recursive: true });
    const malformedManifestPath = path.join(malformedManifestRoot, ".vite/manifest.json");
    const malformedManifest = JSON.parse(await readFile(malformedManifestPath, "utf8"));
    malformedManifest["index.html"].imports = null;
    malformedManifest["index.html"].css = null;
    await writeFile(malformedManifestPath, `${JSON.stringify(malformedManifest, null, 2)}\n`);
    expectFailure(run("scripts/report-delivery.mjs", malformedManifestRoot, ["--check"]), /imports must be an array/, "Malformed report manifest");
    expectFailure(run("scripts/check-site.mjs", malformedManifestRoot), /imports must be an array|css must be an array/, "Malformed site manifest");

    const escapedScriptRoot = path.join(temporaryRoot, "escaped-script");
    await cp(sourceRoot, escapedScriptRoot, { recursive: true });
    const escapedScriptManifestPath = path.join(escapedScriptRoot, ".vite/manifest.json");
    const escapedScriptManifest = JSON.parse(await readFile(escapedScriptManifestPath, "utf8"));
    await writeFile(path.join(temporaryRoot, "outside.js"), "export default 1;\n");
    escapedScriptManifest["index.html"].file = "../outside.js";
    await writeFile(escapedScriptManifestPath, `${JSON.stringify(escapedScriptManifest, null, 2)}\n`);
    expectFailure(run("scripts/report-delivery.mjs", escapedScriptRoot, ["--check"]), /escapes output root/, "Escaped script path");

    const symlinkScriptRoot = path.join(temporaryRoot, "symlink-script");
    await cp(sourceRoot, symlinkScriptRoot, { recursive: true });
    const outsideScriptPath = path.join(temporaryRoot, "outside-symlink.js");
    await writeFile(outsideScriptPath, "export default 1;\n");
    const symlinkScriptAsset = "assets/escape-link.js";
    await symlink(outsideScriptPath, path.join(symlinkScriptRoot, symlinkScriptAsset));
    const symlinkScriptManifestPath = path.join(symlinkScriptRoot, ".vite/manifest.json");
    const symlinkScriptManifest = JSON.parse(await readFile(symlinkScriptManifestPath, "utf8"));
    symlinkScriptManifest["index.html"].file = symlinkScriptAsset;
    await writeFile(symlinkScriptManifestPath, `${JSON.stringify(symlinkScriptManifest, null, 2)}\n`);
    expectFailure(run("scripts/report-delivery.mjs", symlinkScriptRoot, ["--check"]), /physical target escapes output root/, "Symlink script path");

    const requestRoot = path.join(temporaryRoot, "stylesheet-requests");
    await cp(sourceRoot, requestRoot, { recursive: true });
    const requestHtmlPath = path.join(requestRoot, "index.html");
    const requestHtml = await readFile(requestHtmlPath, "utf8");
    const stylesheetHref = requestHtml.match(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+\.css)"/)?.[1];
    if (!stylesheetHref) throw new Error("Generated home page has no stylesheet fixture source");
    const extraLinks = Array.from({ length: 8 }, () => `<link rel="stylesheet" href="${stylesheetHref}" />`).join("");
    await writeFile(requestHtmlPath, requestHtml.replace("</head>", `${extraLinks}</head>`));
    expectFailure(run("scripts/check-site.mjs", requestRoot), /stylesheet request budget exceeded/, "Stylesheet request");

    const escapedStyleRoot = path.join(temporaryRoot, "escaped-style");
    await cp(sourceRoot, escapedStyleRoot, { recursive: true });
    await writeFile(path.join(temporaryRoot, "outside.css"), "body{}\n");
    const escapedStyleHtmlPath = path.join(escapedStyleRoot, "index.html");
    const escapedStyleHtml = await readFile(escapedStyleHtmlPath, "utf8");
    await writeFile(escapedStyleHtmlPath, escapedStyleHtml.replace(/href="\/[^"]+\.css"/, 'href="/../outside.css"'));
    const escapedStyleManifestPath = path.join(escapedStyleRoot, ".vite/manifest.json");
    const escapedStyleManifest = JSON.parse(await readFile(escapedStyleManifestPath, "utf8"));
    escapedStyleManifest["style.css"].file = "../outside.css";
    await writeFile(escapedStyleManifestPath, `${JSON.stringify(escapedStyleManifest, null, 2)}\n`);
    expectFailure(run("scripts/check-site.mjs", escapedStyleRoot), /escapes output root/, "Escaped stylesheet path");

    const symlinkStyleRoot = path.join(temporaryRoot, "symlink-style");
    await cp(sourceRoot, symlinkStyleRoot, { recursive: true });
    const outsideStylePath = path.join(temporaryRoot, "outside-symlink.css");
    await writeFile(outsideStylePath, "body{}\n");
    const symlinkStyleAsset = "assets/escape-link.css";
    await symlink(outsideStylePath, path.join(symlinkStyleRoot, symlinkStyleAsset));
    const symlinkStyleManifestPath = path.join(symlinkStyleRoot, ".vite/manifest.json");
    const symlinkStyleManifest = JSON.parse(await readFile(symlinkStyleManifestPath, "utf8"));
    symlinkStyleManifest["style.css"].file = symlinkStyleAsset;
    await writeFile(symlinkStyleManifestPath, `${JSON.stringify(symlinkStyleManifest, null, 2)}\n`);
    for (const routeHtml of ["index.html", "services/index.html", "404/index.html"]) {
        const routeHtmlPath = path.join(symlinkStyleRoot, routeHtml);
        const routeHtmlContent = await readFile(routeHtmlPath, "utf8");
        await writeFile(routeHtmlPath, routeHtmlContent.replace(/href="\/[^"]+\.css"/, `href="/${symlinkStyleAsset}"`));
    }
    expectFailure(run("scripts/check-site.mjs", symlinkStyleRoot), /physical target escapes output root/, "Symlink stylesheet path");

    const coverageRoot = path.join(temporaryRoot, "stylesheet-coverage");
    await cp(sourceRoot, coverageRoot, { recursive: true });
    const coverageManifestPath = path.join(coverageRoot, ".vite/manifest.json");
    const coverageManifest = JSON.parse(await readFile(coverageManifestPath, "utf8"));
    const routeEntryKey = "src/pages/home/ui/HomePage/HomePage.tsx";
    const firstStyle = "assets/route-first-fixture.css";
    const secondStyle = "assets/route-second-fixture.css";
    const globalStyle = coverageManifest["style.css"].file;
    await cp(path.join(coverageRoot, globalStyle), path.join(coverageRoot, firstStyle));
    await cp(path.join(coverageRoot, globalStyle), path.join(coverageRoot, secondStyle));
    coverageManifest[routeEntryKey].css = [firstStyle, secondStyle];
    await writeFile(coverageManifestPath, `${JSON.stringify(coverageManifest, null, 2)}\n`);
    const coverageHtmlPath = path.join(coverageRoot, "index.html");
    const coverageHtml = await readFile(coverageHtmlPath, "utf8");
    const reversedLinks = `<link rel="stylesheet" href="/${secondStyle}" data-route-style /><link rel="stylesheet" href="/${firstStyle}" data-route-style />`;
    await writeFile(coverageHtmlPath, coverageHtml.replace("</head>", `${reversedLinks}</head>`));
    expectFailure(run("scripts/check-site.mjs", coverageRoot), /route stylesheet graph mismatch/, "Stylesheet coverage");

    console.log("Delivery negative fixtures passed: recursive eager overflow, output-root escapes, excessive stylesheet requests, and true reordered route coverage were rejected.");
} finally {
    await rm(temporaryRoot, { recursive: true, force: true });
}