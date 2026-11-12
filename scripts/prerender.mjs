import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const output = path.resolve("docs");
const serverEntry = path.resolve(".ssr/entry-server.js");
const { render, routeManifest } = await import(pathToFileURL(serverEntry).href);
const template = await readFile(path.join(output, "index.html"), "utf8");
const clientManifest = JSON.parse(await readFile(path.join(output, ".vite/manifest.json"), "utf8"));

const replaceTag = (html, expression, value) => html.replace(expression, value);
const escapeXml = (value) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const collectCss = (entryKey, visited = new Set()) => {
    if (visited.has(entryKey)) return [];
    visited.add(entryKey);
    const entry = clientManifest[entryKey];
    if (!entry) throw new Error(`Client manifest entry is missing: ${entryKey}`);
    const importedCss = (entry.imports ?? []).flatMap((importKey) => collectCss(importKey, visited));
    return [...importedCss, ...(entry.css ?? [])];
};
const templateCss = new Set([...template.matchAll(/<link[^>]+href="\/([^\"]+\.css)"/g)].map((match) => match[1]));

for (const route of routeManifest) {
    const rendered = await render(route.path);
    let html = template.replace('<div id="root"></div>', `<div id="root">${rendered.html}</div>`);
    html = replaceTag(html, /<title>.*?<\/title>/s, `<title>${escapeXml(route.title)}</title>`);
    html = replaceTag(html, /<meta name="description" content=".*?"\s*\/>/s, `<meta name="description" content="${escapeXml(route.description)}" />`);
    html = replaceTag(html, /<meta name="robots" content=".*?"\s*\/>/s, `<meta name="robots" content="${route.indexable ? "index,follow" : "noindex,nofollow"}" />`);
    html = replaceTag(html, /<link rel="canonical" href=".*?"\s*\/>/s, `<link rel="canonical" href="https://sudeo.ru${route.path}" />`);
    const routeCss = [...new Set(collectCss(route.clientEntry))]
        .filter((asset) => !templateCss.has(asset));
    const routeStyleLinks = routeCss
        .map((asset) => `        <link rel="stylesheet" crossorigin href="/${asset}" data-route-style />`)
        .join("\n");
    if (!templateCss.size && !routeStyleLinks) throw new Error(`No stylesheet graph was resolved for ${route.path}`);
    if (routeStyleLinks) html = html.replace("    </head>", `${routeStyleLinks}\n    </head>`);

    const target = route.path === "/" ? path.join(output, "index.html") : path.join(output, route.path.slice(1), "index.html");
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, html, "utf8");

    if (route.path === "/404") {
        await copyFile(target, path.join(output, "404.html"));
    }
}

const sitemapRoutes = routeManifest.filter((route) => route.indexable && route.sitemap);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapRoutes.map((route) => `  <url><loc>https://sudeo.ru${route.path}</loc></url>`).join("\n")}\n</urlset>\n`;
const robots = "User-agent: *\nAllow: /\n\nSitemap: https://sudeo.ru/sitemap.xml\n";

await writeFile(path.join(output, "sitemap.xml"), sitemap, "utf8");
await writeFile(path.join(output, "robots.txt"), robots, "utf8");
console.log(`Pre-rendered ${routeManifest.length} routes (${sitemapRoutes.length} indexable).`);
