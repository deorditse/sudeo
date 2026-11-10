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
const scssFiles = await walk(srcRoot, /\.scss$/);
const importPattern = /from\s+["']([^"']+)["']/g;
const widthMediaFeaturePattern = /\b(?:min-|max-)?(?:device-)?width\b/i;
const approvedWidthMediaQueryPattern = /^\(\s*min-width\s*:\s*(?:451|960)px\s*\)$/i;

for (const file of scssFiles) {
    const rel = toRelativePath(file);
    const rawContent = await readFile(file, "utf8");
    const content = rawContent.replace(/\/\*[\s\S]*?\*\//g, (comment) => " ".repeat(comment.length));
    for (const match of content.matchAll(/@media\b([^{}]*)\{/gi)) {
        const query = match[1].replace(/\s+/g, " ").trim();
        if (!widthMediaFeaturePattern.test(query) || approvedWidthMediaQueryPattern.test(query)) continue;
        const line = content.slice(0, match.index).split("\n").length;
        const reason = /\bmax-width\b/i.test(query)
            ? "width-based max-width queries are forbidden; put phone styles in the unqualified base layer"
            : "unapproved width breakpoint; use exactly (min-width: 451px) or (min-width: 960px)";
        addFailure(`${rel}:${line}: @media ${query}: ${reason}`);
    }
}

const rawLayoutTags = new Set(["div", "section", "article", "header", "aside"]);
const approvedContentShells = new Set(["MainContent", "PageHero", "DetailHero"]);
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
const genericPageUiClassPatterns = [
    /^(?:eyebrow|badge|tag|chip)$/i,
    /^(?:linkCard|cardLink|actionLink)$/i,
    /^prose(?:Root|Body|Content)?$/i,
    /^faq(?:List|Item|Question|Answer|Icon)?$/i,
    /^serviceCard(?:Title|Text|Link|Top|Dot)?$/i,
    /^(?:work)?stage(?:s|List|Grid|Item|Card|Number|Title|Text)?$/i,
    /^pageHero(?:Title|Intro|Body|Actions)?$/i,
];
const documentedPageVisuals = new Map([
    ["pages/home/ui/components/HeroOrbit/HeroOrbit.module.scss", /.*/],
    ["pages/home/ui/components/HeroMarquee/HeroMarquee.module.scss", /.*/],
    ["pages/home/ui/HomePage/HomePage.module.scss", /^(?:demo|hero)/],
    ["pages/service/ui/ServicePage/ServicePage.module.scss", /^serviceGlyph/],
    ["pages/case/ui/CasePage/CasePage.module.scss", /^(?:facts?|role|result)/],
    ["pages/article/ui/ArticlePage/ArticlePage.module.scss", /^callout/],
    ["pages/privacy/ui/PrivacyPage/PrivacyPage.module.scss", /.*/],
    ["pages/notFound/ui/components/NotFoundMessage.module.scss", /.*/],
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

    if (/\bSitePrimitives\b/.test(content)) {
        addFailure(`${rel}: aggregate SitePrimitives imports/references are forbidden; use focused shared primitives or widget public APIs`);
    }

    if (rel.startsWith("shared/ui/")) {
        const productImports = imports.filter((value) => (
            /^@(?:\/)?shared\/(?:content|config\/routes)(?:\/|$)/.test(value)
            || /(?:^|\/)(?:content\/siteContent|config\/routes)$/.test(value)
        ));
        if (productImports.length) {
            addFailure(`${rel}: generic shared UI imports product routing/content: ${productImports.join(", ")}`);
        }
        if (/(["'`])\/services(?:\/|\1)/.test(content)) {
            addFailure(`${rel}: generic shared UI contains product-aware /services routing; move service composition to a widget`);
        }
    }

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

    if (rel.endsWith(".tsx")) {
        const jsxSourceFile = ts.createSourceFile(file, content, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
        const visitImages = (node) => {
            const tagName = (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node))
                ? getJsxTagName(node, jsxSourceFile)
                : "";
            if ((tagName === "AppImage" || tagName.endsWith(".AppImage"))) {
                const attributes = new Map(node.attributes.properties
                    .filter(ts.isJsxAttribute)
                    .map((attribute) => [attribute.name.getText(jsxSourceFile), attribute]));
                const hasTypedSpread = node.attributes.properties.some(ts.isJsxSpreadAttribute);
                const hasUsableStringValue = (rawValue) => {
                    const value = rawValue.trim();
                    if (!value || value === "auto") return false;
                    const numericRatio = value.match(/^(?:auto\s+)?([+-]?(?:\d+(?:\.\d*)?|\.\d+))(?:\s*\/\s*([+-]?(?:\d+(?:\.\d*)?|\.\d+)))?$/);
                    return numericRatio
                        ? Number(numericRatio[1]) > 0 && (!numericRatio[2] || Number(numericRatio[2]) > 0)
                        : true;
                };
                const hasUsableValue = (attribute) => {
                    if (!attribute?.initializer) return false;
                    if (ts.isStringLiteral(attribute.initializer)) return hasUsableStringValue(attribute.initializer.text);
                    if (!ts.isJsxExpression(attribute.initializer)) return false;
                    const expression = attribute.initializer.expression;
                    if (!expression) return false;
                    if (ts.isStringLiteral(expression) || ts.isNoSubstitutionTemplateLiteral(expression)) {
                        return hasUsableStringValue(expression.text);
                    }
                    if (ts.isNumericLiteral(expression)) return Number(expression.text) > 0;
                    if (ts.isPrefixUnaryExpression(expression)
                        && (expression.operator === ts.SyntaxKind.MinusToken || expression.operator === ts.SyntaxKind.PlusToken)
                        && ts.isNumericLiteral(expression.operand)) {
                        const value = Number(expression.operand.text) * (expression.operator === ts.SyntaxKind.MinusToken ? -1 : 1);
                        return value > 0;
                    }
                    return !(expression.kind === ts.SyntaxKind.NullKeyword
                        || expression.kind === ts.SyntaxKind.FalseKeyword
                        || (ts.isIdentifier(expression) && expression.text === "undefined"));
                };
                const hasExplicitGeometry = attributes.has("aspectRatio")
                    || attributes.has("width")
                    || attributes.has("height");
                const hasRatio = hasUsableValue(attributes.get("aspectRatio"));
                const hasIntrinsicSize = hasUsableValue(attributes.get("width"))
                    && hasUsableValue(attributes.get("height"));
                if ((hasExplicitGeometry || !hasTypedSpread) && !hasRatio && !hasIntrinsicSize) {
                    const line = jsxSourceFile.getLineAndCharacterOfPosition(node.getStart(jsxSourceFile)).line + 1;
                    addFailure(`${rel}:${line}: AppImage requires both width and height or an explicit aspectRatio`);
                }
            }
            ts.forEachChild(node, visitImages);
        };
        visitImages(jsxSourceFile);
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

    const allowedVisualPattern = documentedPageVisuals.get(rel);
    for (const match of content.matchAll(/\.([_a-zA-Z][\w-]*)/g)) {
        const className = match[1];
        if (!genericPageUiClassPatterns.some((pattern) => pattern.test(className))) continue;
        if (allowedVisualPattern?.test(className)) continue;
        const line = content.slice(0, match.index).split("\n").length;
        addFailure(`${rel}:${line}: .${className} recreates a reusable UI/widget pattern; use the focused shared primitive or widget public API`);
    }

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

const pageShellStyles = join(srcRoot, "widgets/Page/ui/Page/Page.module.scss");
const pageShellContent = await readFile(pageShellStyles, "utf8");
for (const rule of parseCssRules(pageShellContent)) {
    if (!/(?:^|[>+~\s,])(?:section|article)(?=$|[.#:[>+~\s,])/.test(rule.selector)) continue;
    for (const declaration of rule.body.matchAll(/(?:^|;)\s*(transform|animation(?:-[a-z-]+)?)\s*:\s*([^;{}]+)/g)) {
        const line = pageShellContent.slice(0, rule.index + declaration.index).split("\n").length;
        addFailure(`widgets/Page/ui/Page/Page.module.scss:${line}: generic ${declaration[1]} on route section/article content is forbidden; render primary content in its final position`);
    }
}

const pagesRoot = join(srcRoot, "pages");
const lazyImplementationEntries = new Set();
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
    for (const asyncFile of asyncFiles) {
        const asyncContent = await readFile(asyncFile, "utf8");
        const importMatch = asyncContent.match(/\bimport\(\s*["'](.+?)["']\s*\)/);
        if (!importMatch) {
            addFailure(`${toRelativePath(asyncFile)}: lazy implementation import is missing`);
            continue;
        }
        const implementationFile = resolve(dirname(asyncFile), `${importMatch[1]}.tsx`);
        try {
            if (!(await stat(implementationFile)).isFile()) throw new Error();
            lazyImplementationEntries.add(`src/${toRelativePath(implementationFile)}`);
        } catch {
            addFailure(`${toRelativePath(asyncFile)}: lazy implementation does not exist: ${importMatch[1]}.tsx`);
        }
    }
    const indexPath = join(pageRoot, "index.ts");
    const indexContent = await readFile(indexPath, "utf8").catch(() => "");
    if (!indexContent.includes(".async")) addFailure(`pages/${entry.name}/index.ts: lazy async export is missing`);
    const modelFiles = await walk(join(pageRoot, "model"));
    if (!modelFiles.some((file) => !file.endsWith("index.ts"))) addFailure(`pages/${entry.name}/model: contains no real model implementation`);
}

const routesSource = await readFile(join(srcRoot, "shared/config/routes.ts"), "utf8");
const routeManifestSection = routesSource.slice(routesSource.indexOf("export const routeManifest"), routesSource.indexOf("export interface NavigationItem"));
const routesSourceFile = ts.createSourceFile("routes.ts", routesSource, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
const manifestDefinitions = [];
for (const statement of routesSourceFile.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
        if (!ts.isIdentifier(declaration.name) || declaration.name.text !== "routeManifest" || !declaration.initializer) continue;
        const initializer = ts.isAsExpression(declaration.initializer) ? declaration.initializer.expression : declaration.initializer;
        if (!ts.isArrayLiteralExpression(initializer)) continue;
        for (const element of initializer.elements) {
            if (!ts.isObjectLiteralExpression(element)) continue;
            const values = new Map(element.properties.filter(ts.isPropertyAssignment).map((property) => [
                property.name.getText(routesSourceFile).replace(/["']/g, ""),
                ts.isStringLiteral(property.initializer) ? property.initializer.text : undefined,
            ]));
            const pathValue = values.get("path");
            const clientEntryValue = values.get("clientEntry");
            if (pathValue && clientEntryValue) manifestDefinitions.push({ path: pathValue, clientEntry: clientEntryValue });
            else addFailure("routeManifest: every route object requires string path and clientEntry properties");
        }
    }
}
const manifestPaths = manifestDefinitions.map((route) => route.path);
const manifestClientEntries = manifestDefinitions.map((route) => route.clientEntry);
const uniqueManifestClientEntries = new Set(manifestClientEntries);
for (const clientEntry of uniqueManifestClientEntries) {
    if (!lazyImplementationEntries.has(clientEntry)) addFailure(`routeManifest.clientEntry does not match a lazy page implementation: ${clientEntry}`);
}
for (const implementationEntry of lazyImplementationEntries) {
    if (!uniqueManifestClientEntries.has(implementationEntry)) addFailure(`routeManifest is missing lazy page implementation: ${implementationEntry}`);
}
if (manifestClientEntries.length !== manifestPaths.length) {
    addFailure(`routeManifest: expected one clientEntry per route, found ${manifestClientEntries.length} for ${manifestPaths.length} routes`);
}
const manifestEntriesByPath = new Map(manifestDefinitions.map((route) => [route.path, route.clientEntry]));
const publicRoutesSource = await readFile(join(srcRoot, "app/routes/config/public.tsx"), "utf8");
const pageSliceByComponent = new Map([...publicRoutesSource.matchAll(/import\s+\{\s*(\w+)\s*\}\s+from\s+["']@\/pages\/([^"']+)["']/g)]
    .map((match) => [match[1], match[2]]));
const publicRouteComponents = [...publicRoutesSource.matchAll(/\{\s*path:\s*"([^"]+)",\s*element:\s*<(\w+)\s*\/>\s*\}/g)]
    .map((match) => ({ path: match[1], component: match[2] }));
const matchesRoutePattern = (pattern, routePath) => {
    const expression = pattern.split("/").map((part) => part.startsWith(":" ) ? "[^/]+" : part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("/");
    return new RegExp(`^${expression}$`).test(routePath);
};
for (const [routePath, clientEntry] of manifestEntriesByPath) {
    const publicRoute = publicRouteComponents.find((candidate) => candidate.path === routePath)
        ?? publicRouteComponents.find((candidate) => matchesRoutePattern(candidate.path, routePath));
    const pageSlice = publicRoute ? pageSliceByComponent.get(publicRoute.component) : undefined;
    const expectedEntry = pageSlice ? [...lazyImplementationEntries].find((entry) => entry.startsWith(`src/pages/${pageSlice}/`)) : undefined;
    if (!expectedEntry) addFailure(`routeManifest: cannot resolve lazy page implementation for ${routePath}`);
    else if (clientEntry !== expectedEntry) addFailure(`routeManifest: ${routePath} must use ${expectedEntry}, received ${clientEntry}`);
}
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

console.log(`Architecture check passed: ${pageEntries.length} page slices, layer/UI ownership, lazy exports, shared page composition, intrinsic image geometry, stable Page content, structural spacing, approved SCSS breakpoints and ${navigationPaths.length} discovery routes.`);
