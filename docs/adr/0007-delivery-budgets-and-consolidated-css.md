# ADR 0007: Delivery budgets and consolidated route CSS

- **Status:** Accepted
- **Date:** 2026-11-12
- **OpenSpec change:** `optimize-lighthouse-delivery`
- **Supersedes:** the route-CSS splitting choice in ADR 0005

## Context

The launch architecture emitted a separate stylesheet for each lazy page, widget, and shared primitive and injected the complete manifest graph before paint. This preserved geometry, but the home route required 14 render-blocking stylesheet requests. The production client entry also followed compatible dependency ranges and resolved React 19.3.1 even though the application contract only requires React 19.1; that increased the initial application entry and Lighthouse-estimated unused JavaScript without adding a Sudeo capability.

Measured production and local build evidence showed that the complete application stylesheet is about 49.5 kB raw and 10.5 kB gzip. It is smaller over gzip than the previous home-route stylesheet graph and replaces 14 requests with one. A React 19.1.0 client build with the current React Router release and Terser multi-pass compression materially reduces the application entry while preserving the existing API and architecture.

## Decision

- Pin `react` and `react-dom` to 19.1.0 so a clean install cannot silently enlarge the delivery runtime through a compatible-range update.
- Keep the current React Router release and existing Redux architecture; do not remove hydration, lazy route modules, or dynamic reducers to satisfy a metric.
- Use Vite's Terser minifier with three compression passes and deterministic package-lock ownership.
- Build one consolidated CSS asset with `cssCodeSplit: false`. Every prerendered route links it in the document template before JavaScript, so no route waits for hydration to discover styling.
- Continue validating the exact manifest-derived route CSS graph when route-specific CSS exists, while accepting an empty route-specific graph only when the template already owns the pre-paint stylesheet.
- Enforce a 95 KiB gzip aggregate budget across the application entry and every recursively imported eager JavaScript asset, plus at most eight stylesheet requests per generated route, so manual chunk redistribution cannot bypass the check.
- Validate the 95 KiB transfer, 32 KiB unused-application-JavaScript, eight render-blocking stylesheet, and four 100-point category budgets against clean Lighthouse JSON evidence.
- Produce a manifest-backed ownership report listing the application entry plus each route's reachable JavaScript and pre-paint stylesheets with raw, gzip, and Brotli sizes.

## Consequences

- Lazy page JavaScript boundaries, static prerendering, hydration, fresh server stores, and `DynamicModuleLoader` behavior remain unchanged.
- A visitor may receive styles for routes they do not visit, but the consolidated compressed payload is small and reduces both request fan-out and the home route's total compressed CSS.
- Route stylesheet ordering no longer depends on many network responses; the complete stylesheet is available before first paint.
- Dependency upgrades that change the runtime payload require an explicit package version change and budget verification.
- If the application stylesheet grows enough that route splitting becomes beneficial again, a later ADR must compare compressed bytes, request count, cache behavior, and geometry before superseding this decision.
