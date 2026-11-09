import { readFile, readdir, stat } from "node:fs/promises";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const srcRoot = join(root, "src");
const failures = [];

const walk = async (directory) => {
    const entries = await readdir(directory, { withFileTypes: true });
    const files = [];
    for (const entry of entries) {
        const path = join(directory, entry.name);
        if (entry.isDirectory()) files.push(...await walk(path));
        else if (/\.(ts|tsx)$/.test(entry.name)) files.push(path);
    }
    return files;
};

const sourceFiles = await walk(srcRoot);
const importPattern = /from\s+["']([^"']+)["']/g;

for (const file of sourceFiles) {
    const rel = relative(srcRoot, file).split(sep).join("/");
    const content = await readFile(file, "utf8");
    const imports = [...content.matchAll(importPattern)].map((match) => match[1]);

    if (rel.startsWith("shared/")) {
        const invalid = imports.filter((value) => /^@(?:\/)?(?:app|pages|widgets)\//.test(value));
        if (invalid.length) failures.push(`${rel}: shared imports upper layers: ${invalid.join(", ")}`);
    }

    if (rel.startsWith("widgets/")) {
        const invalid = imports.filter((value) => /^@(?:\/)?(?:app|pages)\//.test(value));
        if (invalid.length) failures.push(`${rel}: widget imports upper layers: ${invalid.join(", ")}`);
    }

    if (rel.startsWith("pages/")) {
        const [, pageSlice] = rel.split("/");
        const invalidApp = imports.filter((value) => /^@(?:\/)?app\//.test(value));
        const crossPage = imports.filter((value) => {
            const match = value.match(/^@(?:\/)?pages\/([^/]+)/);
            return match && match[1] !== pageSlice;
        });
        if (invalidApp.length) failures.push(`${rel}: page imports app layer: ${invalidApp.join(", ")}`);
        if (crossPage.length) failures.push(`${rel}: page imports another page slice: ${crossPage.join(", ")}`);
        if (/\/ui\/[^/]+\/[^/]+Page\.tsx$/.test(`/${rel}`) && /<(button|img)\b/.test(content)) {
            failures.push(`${rel}: route page uses raw button/img instead of shared primitives`);
        }
    }
}

const pagesRoot = join(srcRoot, "pages");
const pageEntries = (await readdir(pagesRoot, { withFileTypes: true })).filter((entry) => entry.isDirectory());
for (const entry of pageEntries) {
    const pageRoot = join(pagesRoot, entry.name);
    for (const required of ["model", "ui"]) {
        try {
            if (!(await stat(join(pageRoot, required))).isDirectory()) throw new Error();
        } catch {
            failures.push(`pages/${entry.name}: missing ${required}/ boundary`);
        }
    }
    const uiFiles = await walk(join(pageRoot, "ui"));
    const asyncFiles = uiFiles.filter((file) => file.endsWith(".async.tsx"));
    if (asyncFiles.length !== 1) failures.push(`pages/${entry.name}: expected one .async.tsx file, found ${asyncFiles.length}`);
    const indexPath = join(pageRoot, "index.ts");
    const indexContent = await readFile(indexPath, "utf8").catch(() => "");
    if (!indexContent.includes(".async")) failures.push(`pages/${entry.name}/index.ts: lazy async export is missing`);
    const modelFiles = await walk(join(pageRoot, "model"));
    if (!modelFiles.some((file) => !file.endsWith("index.ts"))) failures.push(`pages/${entry.name}/model: contains no real model implementation`);
}

const routesSource = await readFile(join(srcRoot, "shared/config/routes.ts"), "utf8");
const manifestPaths = [...routesSource.matchAll(/path:\s*"([^"]+)"/g)].map((match) => match[1]);
const navigationSection = routesSource.slice(routesSource.indexOf("export const navigationGroups"), routesSource.indexOf("export const visitorNavigationItems"));
const navigationPaths = [...navigationSection.matchAll(/path:\s*"([^"]+)"/g)].map((match) => match[1]);
const expectedNavigationPaths = manifestPaths.filter((path) => !["/success", "/404"].includes(path));
for (const path of expectedNavigationPaths) {
    const occurrences = navigationPaths.filter((candidate) => candidate === path).length;
    if (occurrences !== 1) failures.push(`navigationGroups: ${path} must appear exactly once, found ${occurrences}`);
}
for (const path of navigationPaths) {
    if (!manifestPaths.includes(path)) failures.push(`navigationGroups: undeclared route ${path}`);
}

if (failures.length) {
    console.error(`Architecture check failed (${failures.length}):`);
    failures.forEach((failure) => console.error(`- ${failure}`));
    process.exit(1);
}

console.log(`Architecture check passed: ${pageEntries.length} page slices, layer imports, lazy exports, primitives and ${navigationPaths.length} discovery routes.`);
