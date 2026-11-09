import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";

const root = path.resolve("docs");
const requiredRoutes = [
    "/", "/services", "/services/ai-agents", "/services/web-development",
    "/services/mobile-apps", "/services/digital-marketing", "/cases",
    "/cases/knowledge-agent-demo", "/about", "/blog",
    "/blog/how-to-start-ai-pilot", "/contacts", "/privacy", "/success", "/404",
];
const failures = [];

const read = async (file) => {
    try { return await readFile(file, "utf8"); }
    catch { failures.push(`Missing file: ${path.relative(process.cwd(), file)}`); return ""; }
};

for (const route of requiredRoutes) {
    const file = route === "/" ? path.join(root, "index.html") : path.join(root, route.slice(1), "index.html");
    const html = await read(file);
    if (!html) continue;
    const h1Count = (html.match(/<h1(?:\s|>)/g) ?? []).length;
    if (h1Count !== 1) failures.push(`${route}: expected one H1, found ${h1Count}`);
    if (!html.includes("<title>")) failures.push(`${route}: missing title`);
    if (!html.includes(`<link rel="canonical" href="https://sudeo.ru${route}"`)) failures.push(`${route}: incorrect canonical`);
    if (!html.includes('<div id="root">') || html.includes('<div id="root"></div>')) failures.push(`${route}: missing pre-rendered markup`);
    if (html.includes("Загружаем страницу")) failures.push(`${route}: contains the client Suspense loader instead of static-only route markup`);
    if (html.includes('id="S:') || html.includes("$RC(")) failures.push(`${route}: contains a browser-dependent Suspense replacement segment`);
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

console.log(`Static site check passed: ${requiredRoutes.length} resolved routes, CNAME, sitemap, robots and brand exclusions.`);
