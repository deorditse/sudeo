import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = path.resolve("docs");
const serverEntry = path.resolve(".ssr/entry-server.js");
const { routeManifest } = await import(pathToFileURL(serverEntry).href);
const clientManifest = JSON.parse(await readFile(path.join(root, ".vite/manifest.json"), "utf8"));
const requiredRoutes = routeManifest.map((route) => route.path);
const failures = [];

const countOpeningTags = (html, tagName) => (html.match(new RegExp(`<${tagName}\\b`, "gi")) ?? []).length;
const stripTags = (value) => value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
const collectCss = (entryKey, visited = new Set()) => {
    if (visited.has(entryKey)) return [];
    visited.add(entryKey);
    const entry = clientManifest[entryKey];
    if (!entry) {
        failures.push(`Client manifest entry is missing: ${entryKey}`);
        return [];
    }
    return [
        ...(entry.imports ?? []).flatMap((importKey) => collectCss(importKey, visited)),
        ...(entry.css ?? []),
    ];
};
const globalCss = new Set(collectCss("index.html"));

const checkHeadingProgression = (route, html) => {
    const headings = [...html.matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1\s*>/gi)]
        .map((match) => ({ level: Number(match[1]), text: stripTags(match[2]) }));
    for (let index = 1; index < headings.length; index += 1) {
        const previous = headings[index - 1];
        const current = headings[index];
        if (current.level <= previous.level + 1) continue;
        failures.push(`${route}: heading level skips from H${previous.level} to H${current.level}${current.text ? ` before “${current.text}”` : ""}`);
    }
};

const checkBreadcrumbs = (route, html) => {
    const markerPattern = /(?:aria-label|class)\s*=\s*(["'])[^"']*(?:хлебн|breadcrumb)[^"']*\1/i;
    const hasBreadcrumbMarker = [...html.matchAll(/<[a-z][\w:-]*\b([^>]*)>/gi)]
        .some((match) => markerPattern.test(match[1]));
    let labelledBreadcrumbNavs = 0;
    for (const match of html.matchAll(/<nav\b([^>]*)>([\s\S]*?)<\/nav\s*>/gi)) {
        const [, attributes, body] = match;
        if (!/aria-label\s*=\s*(["'])[^"']*(?:хлебн|breadcrumb)[^"']*\1/i.test(attributes)) continue;
        labelledBreadcrumbNavs += 1;
        if (!/<ol\b/i.test(body) || !/<li\b/i.test(body)) {
            failures.push(`${route}: breadcrumb navigation must contain an ordered list with list items`);
        }
    }
    if (hasBreadcrumbMarker && labelledBreadcrumbNavs === 0) {
        failures.push(`${route}: breadcrumbs must use a labelled nav landmark`);
    }
};

const read = async (file) => {
    try { return await readFile(file, "utf8"); }
    catch { failures.push(`Missing file: ${path.relative(process.cwd(), file)}`); return ""; }
};

for (const routeDefinition of routeManifest) {
    const route = routeDefinition.path;
    const file = route === "/" ? path.join(root, "index.html") : path.join(root, route.slice(1), "index.html");
    const html = await read(file);
    if (!html) continue;
    const mainCount = countOpeningTags(html, "main");
    const h1Count = countOpeningTags(html, "h1");
    if (mainCount !== 1) failures.push(`${route}: expected one main landmark, found ${mainCount}`);
    if (h1Count !== 1) failures.push(`${route}: expected one H1, found ${h1Count}`);
    checkHeadingProgression(route, html);
    checkBreadcrumbs(route, html);
    if (!html.includes("<title>")) failures.push(`${route}: missing title`);
    if (!html.includes(`<link rel="canonical" href="https://sudeo.ru${route}"`)) failures.push(`${route}: incorrect canonical`);
    if (!html.includes('<div id="root">') || html.includes('<div id="root"></div>')) failures.push(`${route}: missing pre-rendered markup`);
    if (html.includes("Загружаем страницу")) failures.push(`${route}: contains the client Suspense loader instead of static-only route markup`);
    if (html.includes('id="app-bootstrap-loader"')) failures.push(`${route}: contains the client-only bootstrap loader host`);
    if (html.includes('id="S:') || html.includes("$RC(")) failures.push(`${route}: contains a browser-dependent Suspense replacement segment`);
    if (/<!--\$[?!][^>]*-->/.test(html) || /react[.-]?suspense/i.test(html)) {
        failures.push(`${route}: contains unresolved React Suspense boundary artifacts`);
    }
    if (/\bdata-(?:animate|animation|enter|entered|reveal)(?:\s|=)/i.test(html)
        || /class\s*=\s*(["'])[^"']*(?:section|article|page)[-_](?:enter|entry|reveal)[^"']*\1/i.test(html)) {
        failures.push(`${route}: contains generated initial section-entry animation markers`);
    }
    const routeStyleAssets = [...html.matchAll(/<link\b([^>]*)>/gi)]
        .filter((match) => /\bdata-route-style(?:\s|=|\/|$)/i.test(match[1]))
        .map((match) => {
            const href = match[1].match(/\bhref\s*=\s*(["'])\/([^"']+\.css)\1/i);
            return href?.[2] ?? `<invalid:${match[1].trim()}>`;
        });
    const expectedRouteStyles = [...new Set(collectCss(routeDefinition.clientEntry))]
        .filter((asset) => !globalCss.has(asset));
    if (JSON.stringify(routeStyleAssets) !== JSON.stringify(expectedRouteStyles)) {
        failures.push(`${route}: route stylesheet graph mismatch; expected [${expectedRouteStyles.join(", ")}], received [${routeStyleAssets.join(", ")}]`);
    }
    for (const asset of routeStyleAssets) {
        try { await stat(path.join(root, asset)); }
        catch { failures.push(`${route}: route stylesheet does not exist: ${asset}`); }
    }
}

const cname = (await read(path.join(root, "CNAME"))).trim();
if (cname !== "sudeo.ru") failures.push(`CNAME must be exactly sudeo.ru, received: ${cname || "<empty>"}`);
const sitemap = await read(path.join(root, "sitemap.xml"));
const robots = await read(path.join(root, "robots.txt"));
if (!sitemap.includes("https://sudeo.ru/services/ai-agents")) failures.push("sitemap is missing an indexable service route");
if (sitemap.includes("/success") || sitemap.includes("/404")) failures.push("sitemap contains non-indexable routes");
if (!robots.includes("Sitemap: https://sudeo.ru/sitemap.xml")) failures.push("robots.txt has an incorrect sitemap URL");

const collectFiles = async (directory) => {
    const entries = await readdir(directory, { withFileTypes: true });
    const files = [];
    for (const entry of entries) {
        const full = path.join(directory, entry.name);
        if (entry.isDirectory()) files.push(...await collectFiles(full));
        else files.push(full);
    }
    return files;
};

for (const file of await collectFiles(root)) {
    const info = await stat(file);
    if (info.size > 2_000_000 || !/\.(html|js|css|xml|txt|md)$/.test(file)) continue;
    const content = await readFile(file, "utf8");
    if (/ТЭК ДРАЙВ|tec-drive\.ru|Грузоперевоз/i.test(content)) failures.push(`Copied logistics branding found in ${path.relative(root, file)}`);
}

if (failures.length) {
    console.error(failures.map((failure) => `- ${failure}`).join("\n"));
    process.exit(1);
}

console.log(`Static site check passed: ${requiredRoutes.length} resolved routes with one main/H1, logical headings, semantic breadcrumbs, manifest-derived route CSS, no loader/entry artifacts, CNAME, sitemap, robots and brand exclusions.`);
