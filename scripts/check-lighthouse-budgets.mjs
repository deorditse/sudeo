import { readFile } from "node:fs/promises";
import path from "node:path";
import { isJavaScriptAsset, normalizeOutputAsset, validateManifestEntry } from "./delivery-paths.mjs";

const reportFiles = process.argv.slice(2);
if (!reportFiles.length) {
    console.error("Usage: npm run check:lighthouse-budgets -- <report.json> [...report.json]");
    process.exit(1);
}

const entryTransferBudget = 95 * 1024;
const unusedJavaScriptBudget = 32 * 1024;
const stylesheetRequestBudget = 8;
const failures = [];
const results = [];
const manifestPath = path.resolve(process.env.SUDEO_MANIFEST_PATH ?? "docs/.vite/manifest.json");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));

const collectEagerJavaScript = (entryKey, visited = new Set()) => {
    if (visited.has(entryKey)) return [];
    visited.add(entryKey);
    const entry = validateManifestEntry(manifest, entryKey);
    if (!isJavaScriptAsset(entry.file)) throw new Error(`Manifest eager entry is not a supported JavaScript asset: ${entryKey} -> ${entry.file}`);
    return [
        normalizeOutputAsset(entry.file),
        ...(entry.imports ?? []).flatMap((importKey) => collectEagerJavaScript(importKey, visited)),
    ];
};
const eagerAssets = [...new Set(collectEagerJavaScript("index.html"))];

const isApplicationAsset = (url, finalUrl) => {
    try { return new URL(url).origin === new URL(finalUrl).origin; }
    catch { return false; }
};

const requiredItems = (report, auditId, file) => {
    const items = report.audits?.[auditId]?.details?.items;
    if (!Array.isArray(items)) {
        failures.push(`${file}: missing required audit details: ${auditId}`);
        return null;
    }
    return items;
};

const isFiniteNonNegative = (value) => Number.isFinite(value) && value >= 0;

for (const file of reportFiles) {
    const report = JSON.parse(await readFile(file, "utf8"));
    if (Object.prototype.hasOwnProperty.call(report, "runtimeError")) {
        const code = report.runtimeError && typeof report.runtimeError === "object" ? report.runtimeError.code : "malformed runtimeError";
        failures.push(`${file}: invalid Lighthouse run (${code ?? "runtime error"})`);
        continue;
    }
    const finalUrl = report.finalUrl ?? report.finalDisplayedUrl ?? report.requestedUrl;
    try { new URL(finalUrl); }
    catch {
        failures.push(`${file}: final URL is missing or invalid`);
        continue;
    }
    const networkItems = requiredItems(report, "network-requests", file);
    const unusedItems = requiredItems(report, "unused-javascript", file);
    const renderBlockingItems = requiredItems(report, "render-blocking-insight", file);
    if (!networkItems || !unusedItems || !renderBlockingItems) continue;

    for (const item of [...networkItems, ...unusedItems, ...renderBlockingItems]) {
        try { new URL(item.url); }
        catch { failures.push(`${file}: audit item has missing or invalid URL`); }
    }

    let eagerTransferBytes = 0;
    for (const asset of eagerAssets) {
        const matches = networkItems.filter((item) => {
            if (!isApplicationAsset(item.url, finalUrl)) return false;
            try { return decodeURIComponent(new URL(item.url).pathname) === `/${asset}`; }
            catch { return false; }
        });
        if (matches.length !== 1) {
            failures.push(`${file}: expected one network record for eager asset ${asset}, found ${matches.length}`);
            continue;
        }
        if (!isFiniteNonNegative(matches[0].transferSize)) {
            failures.push(`${file}: eager asset ${asset} has invalid transferSize`);
            continue;
        }
        eagerTransferBytes += matches[0].transferSize;
    }
    let unusedJavaScriptBytes = 0;
    for (const item of unusedItems) {
        if (!isFiniteNonNegative(item.wastedBytes)) {
            failures.push(`${file}: unused-javascript item has invalid wastedBytes`);
            continue;
        }
        if (isApplicationAsset(item.url, finalUrl)) unusedJavaScriptBytes += item.wastedBytes;
    }
    const stylesheetRequests = renderBlockingItems
        .filter((item) => isApplicationAsset(item.url, finalUrl) && /\.css(?:$|\?)/.test(item.url))
        .length;
    const categories = {};
    for (const category of ["performance", "accessibility", "best-practices", "seo"]) {
        const score = report.categories?.[category]?.score;
        if (typeof score !== "number" || !Number.isFinite(score) || score < 0 || score > 1) {
            failures.push(`${file}: invalid ${category} category score`);
            continue;
        }
        categories[category] = Math.round(score * 100);
    }

    results.push({ file, finalUrl, eagerTransferBytes, unusedJavaScriptBytes, stylesheetRequests, categories });
    if (eagerTransferBytes > entryTransferBudget) failures.push(`${file}: application eager transfer ${eagerTransferBytes} > ${entryTransferBudget}`);
    if (unusedJavaScriptBytes > unusedJavaScriptBudget) failures.push(`${file}: unused application JavaScript ${unusedJavaScriptBytes} > ${unusedJavaScriptBudget}`);
    if (stylesheetRequests > stylesheetRequestBudget) failures.push(`${file}: render-blocking stylesheets ${stylesheetRequests} > ${stylesheetRequestBudget}`);
    for (const category of ["performance", "accessibility", "best-practices", "seo"]) {
        if (categories[category] !== 100) failures.push(`${file}: ${category} score ${categories[category] ?? "missing"} != 100`);
    }
}

console.log(JSON.stringify({
    budgets: { entryTransferBytes: entryTransferBudget, unusedJavaScriptBytes: unusedJavaScriptBudget, stylesheetRequests: stylesheetRequestBudget },
    results,
}, null, 2));

if (failures.length) {
    console.error(failures.map((failure) => `- ${failure}`).join("\n"));
    process.exit(1);
}
