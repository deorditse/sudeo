import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const temporaryRoot = await mkdtemp(path.join(tmpdir(), "sudeo-lighthouse-regressions-"));
const checker = path.resolve("scripts/check-lighthouse-budgets.mjs");

const run = (reportPath, manifestPath) => spawnSync(process.execPath, [checker, reportPath], {
    cwd: process.cwd(),
    encoding: "utf8",
    env: { ...process.env, SUDEO_MANIFEST_PATH: manifestPath },
});

const expectFailure = (result, pattern, label) => {
    const output = `${result.stdout}\n${result.stderr}`;
    if (result.status === 0 || !pattern.test(output)) throw new Error(`${label} fixture did not fail as expected.\n${output}`);
};

const expectSuccess = (result, label) => {
    if (result.status !== 0) throw new Error(`${label} fixture failed unexpectedly.\n${result.stdout}\n${result.stderr}`);
};

const baseReport = {
    finalUrl: "https://sudeo.ru/",
    categories: {
        performance: { score: 1 },
        accessibility: { score: 1 },
        "best-practices": { score: 1 },
        seo: { score: 1 },
    },
    audits: {
        "network-requests": {
            details: {
                items: [
                    { url: "https://sudeo.ru/assets/index-fixture.js", transferSize: 1000 },
                    { url: "https://sudeo.ru/assets/vendor-fixture.mjs", transferSize: 1000 },
                    { url: "chrome-extension://fixture/large.js", transferSize: 500000 },
                ],
            },
        },
        "unused-javascript": { details: { items: [] } },
        "render-blocking-insight": { details: { items: [] } },
    },
};
const manifest = {
    "index.html": { file: "assets/index-fixture.js", imports: ["_vendor.mjs"] },
    "_vendor.mjs": { file: "assets/vendor-fixture.mjs" },
};

try {
    const manifestPath = path.join(temporaryRoot, "manifest.json");
    await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

    const validPath = path.join(temporaryRoot, "valid.json");
    await writeFile(validPath, `${JSON.stringify(baseReport, null, 2)}\n`);
    expectSuccess(run(validPath, manifestPath), "Wrong-origin exclusion");

    const malformedManifestPath = path.join(temporaryRoot, "malformed-manifest.json");
    const malformedManifest = structuredClone(manifest);
    malformedManifest["index.html"].imports = null;
    await writeFile(malformedManifestPath, `${JSON.stringify(malformedManifest, null, 2)}\n`);
    expectFailure(run(validPath, malformedManifestPath), /imports must be an array/, "Malformed Lighthouse manifest");

    const eagerOverflow = structuredClone(baseReport);
    eagerOverflow.audits["network-requests"].details.items[1].transferSize = 100000;
    const eagerOverflowPath = path.join(temporaryRoot, "eager-overflow.json");
    await writeFile(eagerOverflowPath, `${JSON.stringify(eagerOverflow, null, 2)}\n`);
    expectFailure(run(eagerOverflowPath, manifestPath), /application eager transfer/, "Eager transfer");

    const missingAudits = structuredClone(baseReport);
    delete missingAudits.audits["unused-javascript"];
    delete missingAudits.audits["render-blocking-insight"];
    const missingAuditsPath = path.join(temporaryRoot, "missing-audits.json");
    await writeFile(missingAuditsPath, `${JSON.stringify(missingAudits, null, 2)}\n`);
    expectFailure(run(missingAuditsPath, manifestPath), /missing required audit/, "Missing audits");

    const malformedRuntimeError = structuredClone(baseReport);
    malformedRuntimeError.runtimeError = false;
    const malformedRuntimeErrorPath = path.join(temporaryRoot, "malformed-runtime-error.json");
    await writeFile(malformedRuntimeErrorPath, `${JSON.stringify(malformedRuntimeError, null, 2)}\n`);
    expectFailure(run(malformedRuntimeErrorPath, manifestPath), /runtimeError/, "Malformed runtimeError");

    for (const [label, score] of [["string", "1"], ["boolean", true], ["out-of-range", 1.1]]) {
        const malformedCategory = structuredClone(baseReport);
        malformedCategory.categories.performance.score = score;
        const malformedCategoryPath = path.join(temporaryRoot, `malformed-category-${label}.json`);
        await writeFile(malformedCategoryPath, `${JSON.stringify(malformedCategory, null, 2)}\n`);
        expectFailure(run(malformedCategoryPath, manifestPath), /invalid performance category score/, `Malformed ${label} category score`);
    }

    console.log("Lighthouse negative fixtures passed: eager transfer overflow, missing audits, malformed runtime errors, and malformed category scores were rejected; wrong-origin resources were excluded.");
} finally {
    await rm(temporaryRoot, { recursive: true, force: true });
}