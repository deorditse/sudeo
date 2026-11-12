# Execution evidence

## Baseline

- Working tree before apply: `main` at `71fb38ca18132d4814b6d626f46e9d87029efdf9`; only the approved `optimize-lighthouse-delivery` OpenSpec planning files were untracked.
- Clean production Lighthouse 13.5 home baseline: application entry transfer `100563` bytes, Lighthouse-estimated unused application JavaScript `38652` bytes, and `14` render-blocking application stylesheets.
- Baseline scored categories were Performance `100`, Accessibility `100`, Best Practices `100`, and SEO `100`.
- `chrome-extension://` resources from MetaMask, AdBlock, React DevTools, and similar extensions are harness contamination, not Sudeo assets.
- GitHub Pages cache lifetime is hosting-controlled and is not represented as changed by this repository.

## Ownership analysis and selected boundary

The Vite manifest/module probe showed that the initial entry was dominated by React DOM, React Router, and the global Redux provider. Moving Redux into the enquiry chunk would only redistribute eagerly loaded bytes because the home route renders the enquiry form during hydration. Deferring the complete application or form controller was rejected because it would weaken immediate interaction and hydration correctness.

The lockfile had resolved `react` and `react-dom` `19.3.1` through the declared `^19.1.0` ranges. A read-only build spike pinned the already-supported React API contract to `19.1.0`, kept React Router `7.18.4`, and used Terser multi-pass compression. This reduced the entry without replacing React, routing, Redux Toolkit, hydration, lazy pages, or dynamic reducers. The selected implementation therefore uses a dependency-runtime boundary rather than a cosmetic manual chunk split or a risky provider/widget deferral.

`npm run report:delivery` now derives application entry, route chunk, enquiry/state chunk, and stylesheet ownership from `docs/.vite/manifest.json`, generated HTML, and `.ssr/entry-server.js`, reporting raw, gzip, and Brotli bytes.

## Generated artifact results

After a clean production build:

- application entry: `263144` raw bytes, `85413` gzip bytes, `73768` Brotli bytes;
- application entry gzip budget: `85413 / 97280` bytes;
- consolidated stylesheet: `49540` raw bytes, `10534` gzip bytes, `9121` Brotli bytes;
- pre-paint stylesheets: `1 / 8` on every generated route;
- route-specific lazy JavaScript entries and `EnquiryForm` remain separate manifest chunks;
- generated routes retain complete prerendered content, one `main`, one H1, and no bootstrap-loader or unresolved Suspense replacement artifacts.

A clean local Lighthouse 13.5 home run recorded:

- application entry transfer: `85843` bytes;
- Lighthouse-estimated unused application JavaScript: `29987` bytes;
- application-owned render-blocking stylesheets: `1`;
- Accessibility `100`, Best Practices `100`, SEO `100`;
- Performance `98` locally because FCP/LCP were `1.7 s / 2.1 s`; production category acceptance remains pending exact-SHA deployment evidence.

## Regression enforcement

The normal build now runs deterministic generated-artifact budgets. Cleanup-guaranteed negative fixtures proved that the checks reject:

1. an application entry whose gzip size exceeds 95 KiB;
2. a generated route with more than eight stylesheet requests;
3. a route whose manifest-derived stylesheet coverage is incomplete or reordered.

`npm run check:lighthouse-budgets -- <reports...>` rejects run-level Lighthouse errors and validates entry transfer, unused application JavaScript, render-blocking CSS, and the four scored categories while excluding resources outside the audited origin.

## Browser regression

Browser automation covered `/`, `/services/ai-agents/`, `/cases/knowledge-agent-demo/`, and `/blog/how-to-start-ai-pilot/` at `390`, `768`, and `1440` CSS pixels:

- JavaScript-disabled and hydrated header, H1, first-content, and primary-action rectangles had `0 px` delta in all 12 route/viewport combinations;
- every route retained one `main` and one H1;
- the bootstrap loader was removed after hydration;
- no page error or unhandled rejection was recorded;
- desktop catalog and mobile menu opened, closed on Escape, and restored focus;
- client navigation updated the route and active navigation state;
- FAQ disclosure opened;
- enquiry state updated, the unavailable endpoint kept submit disabled without false success, and dynamic reducer remount reset form state;
- reduced-motion emulation left zero elements with a running non-zero CSS animation.

## Verification commands completed

- `npm run lint`
- `npm run build`
- `npm run check:delivery:negative`
- `openspec validate optimize-lighthouse-delivery --strict`
- `git diff --check`

## Independent review

The fail-closed review cycle reproduced and permanently fixed checker bypasses for recursive eager chunks, missing Lighthouse audits, malformed runtime errors and category scores, lexical and symbolic-link output-root escapes, false stylesheet-order evidence, `.mjs` eager assets, unsupported eager extensions, and malformed Vite manifest fields. Cleanup-guaranteed fixtures now cover these cases in the normal build.

Final independent acceptance returned `passed: true` with no security concerns, logic errors, or suggestions. It reran the complete build/lint/architecture/OpenSpec/diff gates, 39 malformed-manifest probes, physical path containment, Lighthouse provenance checks, and `npm audit --omit=dev --audit-level=high` with zero production vulnerabilities.

Pending delivery evidence: 12 production Lighthouse runs, exact-SHA CI/deployment, production readback, and archive.
