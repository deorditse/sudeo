import { readFile } from "node:fs/promises";
import path from "node:path";
import { brotliCompressSync, gzipSync } from "node:zlib";
import { pathToFileURL } from "node:url";
import { isJavaScriptAsset, resolveOutputAssetFile, validateManifestEntry } from "./delivery-paths.mjs";

const outputRoot = path.resolve(process.env.SUDEO_OUTPUT_ROOT ?? "docs");
const manifest = JSON.parse(await readFile(path.join(outputRoot, ".vite/manifest.json"), "utf8"));
const serverEntry = path.resolve(process.env.SUDEO_SERVER_ENTRY ?? ".ssr/entry-server.js");
const { routeManifest } = await import(pathToFileURL(serverEntry).href);
const check = process.argv.includes("--check");
const entryBudget = 95 * 1024;
const stylesheetBudget = 8;

const measure = async (asset) => {
    const content = await readFile(await resolveOutputAssetFile(outputRoot, asset));
    return {
        asset,
        rawBytes: content.byteLength,
        gzipBytes: gzipSync(content).byteLength,
        brotliBytes: brotliCompressSync(content).byteLength,
    };
};

const collectJavaScript = (entryKey, visited = new Set()) => {
    if (visited.has(entryKey)) return [];
    visited.add(entryKey);
    const entry = validateManifestEntry(manifest, entryKey);
    if (!isJavaScriptAsset(entry.file)) throw new Error(`Manifest eager entry is not a supported JavaScript asset: ${entryKey} -> ${entry.file}`);
    return [
        entry.file,
        ...(entry.imports ?? []).flatMap((importKey) => collectJavaScript(importKey, visited)),
    ];
};

const indexEntry = validateManifestEntry(manifest, "index.html");
const applicationEntry = await measure(indexEntry.file);
const eagerApplicationAssets = await Promise.all([...new Set(collectJavaScript("index.html"))].map(measure));
const eagerApplication = {
    assets: eagerApplicationAssets,
    rawBytes: eagerApplicationAssets.reduce((total, asset) => total + asset.rawBytes, 0),
    gzipBytes: eagerApplicationAssets.reduce((total, asset) => total + asset.gzipBytes, 0),
    brotliBytes: eagerApplicationAssets.reduce((total, asset) => total + asset.brotliBytes, 0),
};
const routes = [];

for (const route of routeManifest) {
    const htmlPath = route.path === "/" ? path.join(outputRoot, "index.html") : path.join(outputRoot, route.path.slice(1), "index.html");
    const html = await readFile(htmlPath, "utf8");
    const stylesheets = [...html.matchAll(/<link\b([^>]*)>/gi)]
        .filter((match) => /\brel\s*=\s*(["'])stylesheet\1/i.test(match[1]))
        .map((match) => match[1].match(/\bhref\s*=\s*(["'])\/([^"']+\.css)\1/i)?.[2])
        .filter(Boolean);
    const javascript = [...new Set([
        ...collectJavaScript("index.html"),
        ...collectJavaScript(route.clientEntry),
    ])];
    routes.push({
        path: route.path,
        clientEntry: route.clientEntry,
        stylesheetRequests: stylesheets.length,
        stylesheets: await Promise.all(stylesheets.map(measure)),
        javascript: await Promise.all(javascript.map(measure)),
    });
}

const report = {
    budgets: {
        applicationEntryGzipBytes: entryBudget,
        stylesheetRequestsPerRoute: stylesheetBudget,
    },
    applicationEntry,
    eagerApplication,
    routes,
};

if (!check) console.log(JSON.stringify(report, null, 2));

if (check) {
    const failures = [];
    if (eagerApplication.gzipBytes > entryBudget) {
        failures.push(`Eager application JavaScript gzip budget exceeded: ${eagerApplication.gzipBytes} > ${entryBudget}`);
    }
    for (const route of routes) {
        if (route.stylesheetRequests > stylesheetBudget) {
            failures.push(`${route.path}: stylesheet request budget exceeded: ${route.stylesheetRequests} > ${stylesheetBudget}`);
        }
    }
    if (failures.length) {
        console.error(failures.map((failure) => `- ${failure}`).join("\n"));
        process.exit(1);
    }
    console.log(`Delivery budgets passed: ${eagerApplication.gzipBytes}/${entryBudget} eager application gzip bytes across ${eagerApplication.assets.length} asset(s); ${Math.max(...routes.map((route) => route.stylesheetRequests))}/${stylesheetBudget} stylesheet requests.`);
}
