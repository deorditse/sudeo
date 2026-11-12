# Design

## Context

See `proposal.md` for motivation. The current production run scores 100 in all Lighthouse categories, but the clean report still transfers about 100 KiB in the initial application entry, estimates 38 KiB as unused, and identifies fourteen render-blocking route CSS requests. Static HTML, exact manifest-derived route CSS, route lazy loading, hydration, bootstrap-loader cleanup, and first-paint geometry are already enforced and cannot be weakened to improve synthetic diagnostics.

The attached DevTools report is additionally contaminated by MetaMask, ad-blocking, translation, and development extensions. GitHub Pages supplies a ten-minute cache policy that the repository cannot override.

## Goals / Non-Goals

**Goals:**

- Reduce repository-controlled initial JavaScript and CSS request fan-out within explicit budgets.
- Preserve complete no-JavaScript route content and interaction behavior after hydration.
- Add deterministic artifact budgets to prevent regression.
- Keep clean Lighthouse evidence separate from extension and hosting noise.

**Non-Goals:**

- Replacing GitHub Pages or adding a CDN only to change cache headers.
- Hiding diagnostics by delaying all JavaScript beyond the audit window while making the site feel unresponsive.
- Removing route CSS from the first paint or accepting a flash of unstyled/layout-shifting content.
- Replacing React, React Router, Redux Toolkit, or the approved lazy-page/dynamic-reducer architecture solely for a synthetic score that is already 100.

## Decisions

### 1. Measure the generated artifact before selecting a loading change

Apply begins with a repeatable bundle ownership report derived from the Vite manifest and a clean Lighthouse JSON. The report separates framework shell, route modules, form/state code, and stylesheet graph. This prevents speculative manual chunking that changes filenames without reducing transferred or evaluated code.

Alternative considered: immediately add `manualChunks`. Rejected because splitting the same eagerly required modules can increase request depth without reducing unused code.

### 2. Remove eager application code only at a real behavior boundary

Code may leave the initial entry only when the initial route does not require it for hydration correctness or immediate interaction. Candidate boundaries include below-the-fold enquiry state/submission code and route-only modules. The implementation must preserve the fresh-store SSR contract, dynamic reducer lifecycle, route hydration, form defaults, and navigation behavior.

Implementation measurement found that moving the globally provided Redux runtime into the enquiry chunk would only redistribute eagerly loaded bytes because the home route hydrates that widget immediately. The actual removable boundary was dependency resolution: compatible ranges had advanced React/React DOM from the required 19.1 API contract to 19.3.1. Pinning 19.1.0 removes unneeded runtime code while preserving every approved application boundary; Terser multi-pass compression then reduces syntax overhead without changing eager ownership.

Alternative considered: delay the complete application import until idle. Rejected as the default because it would postpone all navigation and interaction and could optimize the audit by degrading users. A small bounded post-paint bootstrap is permitted only if interaction readiness and loader behavior remain explicitly verified.

### 3. Reduce CSS request fan-out without removing pre-paint styles

The selected build/prerender strategy may consolidate CSS assets, but generated HTML must still contain the complete ordered and deduplicated style coverage needed by the route before JavaScript. The static checker will validate both coverage and the request-count budget. JavaScript must not become responsible for discovering primary route styles.

Alternative considered: mark route CSS non-blocking. Rejected because it would reintroduce the previously fixed unstyled first paint and geometry changes behind the loader.

### 4. Enforce budgets from build artifacts and validate with Lighthouse

A deterministic repository check will enforce initial entry and route-style budgets from `docs/.vite/manifest.json` and generated HTML. Lighthouse remains acceptance evidence for unused JavaScript, main-thread work, and user-facing metrics, not the only regression gate. Three mobile runs on the home, AI service, case detail, and article routes will be recorded using headless Lighthouse 13.5.

Alternative considered: use a single Lighthouse score threshold. Rejected because a 100 category score can coexist with meaningful diagnostics and synthetic scores fluctuate between runs.

### 5. Record provenance instead of changing unrelated systems

`chrome-extension://` findings are classified as harness contamination. GitHub Pages cache lifetime is classified as hosting-controlled. Neither is included in the code-fix acceptance count. A future CDN migration would require its own OpenSpec change and hosting ADR.

## Risks / Trade-offs

- [Moving state code changes hydration module boundaries] → Compare server/client trees, run form lifecycle tests, and retain a fresh store per server render.
- [CSS consolidation can increase unused bytes on small routes] → Compare route transfer size as well as request count and reject a consolidation that materially increases total CSS bytes or changes geometry.
- [Chunk changes can increase request chains] → Measure dependency depth and request count before and after; keep only changes that improve the declared budgets.
- [Synthetic Lighthouse variability obscures regressions] → Use three runs per route and deterministic artifact checks; record ranges rather than one lucky run.

## Migration Plan

1. Capture the clean baseline and generated bundle ownership report.
2. Implement one optimization boundary at a time, rebuilding and re-measuring after each.
3. Add deterministic budgets and negative fixtures to architecture/site verification.
4. Run full repository gates, no-JavaScript/hydration geometry checks, representative interaction tests, and three Lighthouse runs per route.
5. Obtain independent review, commit, push, verify exact-SHA CI/deployment, and read back production.
6. Roll back by reverting the optimization commit if hydration, interaction readiness, static styling, or measured budgets regress.
