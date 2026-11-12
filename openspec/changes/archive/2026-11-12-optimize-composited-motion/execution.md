# Execution evidence

## Supplied Lighthouse report

Source: `sudeo.ru-20261112T175356.html`, Lighthouse `13.5.0`, fetched `2026-11-12T14:53:56.721Z` for `https://sudeo.ru/`.

Category scores:

- Performance: `99`;
- Accessibility: `100`;
- Best Practices: `73`;
- SEO: `100`;
- run-level error: none;
- run warnings: none.

### Provenance classification

Application-owned measurements remain inside the approved delivery contract:

- eager application transfer: `86263 / 97280` bytes;
- application-owned unused JavaScript: `24409 / 32768` bytes;
- render-blocking application stylesheets: `1 / 8`;
- document CLS: `0`.

The report's total estimated unused JavaScript of about `2067 KiB` is dominated by extension content scripts. MetaMask, AdBlock, React DevTools, and other `chrome-extension://` resources also account for the reported console errors, deprecated `FencedFrame` API use, unminified JavaScript, and most Best Practices loss. These are harness contamination and are not application remediation items.

The cache-lifetime warning reports the ten-minute GitHub Pages cache policy for hashed assets. It is hosting-controlled and is not represented as changed by this repository. The one application stylesheet is intentionally render-blocking because it contains complete pre-paint styling and prevents FOUC and geometry shift.

Application-owned remediation is limited to three informative non-composited animation findings:

1. bootstrap-loader `visibility` transition;
2. loader-brand `border-color` animation;
3. home hero-core `border-radius` animation.

## Reproduction and clean comparison

The supplied JSON was extracted from the report and passed through `scripts/check-lighthouse-budgets.mjs`, which confirmed the application-owned budgets above while correctly rejecting the contaminated category scores. Five additional clean Lighthouse 13.5 performance probes with browser extensions disabled recorded CLS `0`, TBT `0 ms`, and Performance `99–100`; no repeatable document geometry defect was found.

A deterministic motion checker was then added. Before the stylesheet correction it failed with exactly four findings: loader visibility transition, loader exit visibility state, loader border animation, and hero border-radius animation.

## Implementation

- Loader viewport transition changed to opacity only.
- Loader exit keeps opacity `0` and `pointer-events: none` until timed host removal, without a visibility mutation.
- Loader brand pulse retains transform scale and static border styling.
- Hero core retains static organic border radius and transform-only rotation/scale motion.
- Reduced-motion rules remain responsible for disabling both automatic effects.
- Cleanup-guaranteed negative fixtures cover every prohibited property and use Node's OS temporary directory so CI does not depend on `TMPDIR`.

## Verification completed before review

- The pre-fix `node scripts/check-motion.mjs` run failed with all four expected property findings; the post-fix run passed.
- `npm run check:motion:negative` and `env -u TMPDIR node scripts/check-motion-regressions.mjs` passed. Fixtures independently reintroduced visibility transition, exit visibility, loader border animation, and hero border-radius animation and were rejected for their intended reasons.
- `npm run lint`, `npm run build`, strict OpenSpec validation, and `git diff --check` passed.
- The production build reported eager application gzip `85416 / 97280` bytes and `1 / 8` stylesheet requests. All static, delivery, Lighthouse-negative, and motion-negative checks passed.
- Browser lifecycle instrumentation at desktop width observed loader animation properties limited to transform/opacity, immediate `pointer-events: none` during exit, timed host removal, stable H1 top `218.390625 px`, no layout shifts, no application errors, one main, and one H1.
- Phone-width inspection reported hero automatic properties limited to transform/opacity, no horizontal overflow, no layout shift, and no application error.
- Reduced-motion emulation reported zero loader and hero animations, one main, one H1, and no horizontal overflow.
- JavaScript-disabled navigation retained the prerendered H1 and one main without a bootstrap-loader host.
- A post-change local Lighthouse 13.5 probe contained no `non-composited-animations` items, TBT `0 ms`, and CLS `0`. It scored Performance `98` because local FCP/LCP were `1.7 s / 2.1 s`; this variable probe is preserved and is not represented as final category acceptance.

## Independent review remediation

The first independent review found that the nominal checker only covered the three originally reported property names and could be bypassed with other paint/layout properties or a commented decoy block. Later reviews found case-insensitive and vendor-prefixed properties, quoted decoys, detached/cascade/important owner overrides, and incomplete reduced-motion owner coverage. The checker now compiles each SCSS module with the same Sass implementation used by the project, then applies a string/comment-aware lexical CSS parser to the effective emitted stylesheet. It:

- enumerates every expected loader and hero keyframe exactly once;
- rejects unexpected, missing, or duplicate automatic keyframe owners;
- allows only `transform` and `opacity` declarations inside every automatic keyframe;
- allows only `transform`, `opacity`, or the disabled value `none` in transitions;
- normalizes supported vendor-prefixed transition and animation properties before validation;
- independently rejects a visibility mutation on the loader exit selector;
- enumerates every loader and hero animation-bearing selector plus the loader viewport transition owner, enforcing exactly one non-important active declaration and exactly one reduced-motion declaration whose complete value is the non-important token `none` for each owner;
- rejects unlisted, multiple-animation, duplicate, detached, later, important, or higher-specificity animation and transition owners;
- rejects Sass compilation failures and malformed emitted CSS structure.

The permanent negative suite now rejects visibility and `left` transitions, uppercase and WebKit-prefixed transition/property spellings, exit visibility, `background-color`, `height`, `border-radius`, and `filter` keyframe declarations, comment and quoted-string shadowing, duplicate/missing keyframes, missing or detached reduced-motion ownership, multiple-animation lists, duplicate overrides, important active and reduced owners, later exact owners, grouped/higher-specificity owners, and reduced-motion re-enablement of every loader/hero animated selector and the loader viewport transition. It passes both normally and with `TMPDIR` unset.

The final independent acceptance review returned `passed: true` with no security or logic blocker after reproducing the permanent fixtures and additional unlisted-owner probes.

Eight current-build clean local Lighthouse 13.5 mobile probes reported no non-composited animation items, CLS `0`, TBT `0`, and `100 / 100 / 100` for Accessibility, Best Practices, and SEO. Their Performance score was consistently `98` because local FCP/LCP remained approximately `1.66 s / 2.12 s`; these runs are retained as valid variable evidence and are not relabeled as accepted category evidence. They loaded the exact current asset graph (`index-CsKfrFGu.js` and `style-CXUIOiG2.css`). Final category acceptance therefore remains pending production measurement.

## Production acceptance

- Implementation commit: `deae8f5e1df81471d021f1813e51d194d583746c`.
- GitHub Actions run `43269950040` completed successfully for that exact SHA; jobs `verify` (`131363518992`) and `deploy` (`131364230204`) both passed.
- Production readback returned HTTP `200` for `/` and `/services/ai-agents/`, with one `<main>`, one `<h1>`, the expected route title, and exact deployed assets `index-CsKfrFGu.js` and `style-CXUIOiG2.css`.
- Clean production Lighthouse `13.5.0` at `2026-11-12T17:37:53.185Z` had no runtime error or warnings, category scores `100 / 100 / 100 / 100`, zero non-composited animation items, CLS `0`, TBT `0 ms`, eager application transfer `86249 / 97280`, unused application JavaScript `29838 / 32768`, and one stylesheet request.
- Production browser QA observed unchanged H1 geometry before and after loader removal, no layout-shift entries or application errors, one main/H1, and no horizontal overflow. Reduced-motion emulation reported zero running animations and eventual loader removal.

All acceptance evidence is complete; the change is ready to archive.
