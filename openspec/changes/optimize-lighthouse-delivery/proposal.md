# Proposal

## Why

The clean production Lighthouse run scores 100 in every category, but still reports application-owned diagnostics: about 38 KiB of unused initial JavaScript, a long lazy-module request chain, and fourteen render-blocking route stylesheets. The attached DevTools report also mixes these findings with browser-extension and GitHub Pages cache noise, so optimization must target only measurable repository-controlled work without weakening prerendered HTML or first-paint styling.

## What Changes

- Establish a reproducible clean-profile Lighthouse baseline and classify every finding as application-controlled, browser-extension-controlled, or GitHub Pages-controlled.
- Reduce initial JavaScript transferred and evaluated on representative routes, focusing on code that is not required before interaction.
- Reduce critical request fan-out while preserving the exact complete route stylesheet graph before JavaScript and stable JavaScript-disabled geometry.
- Add deterministic bundle/request budgets to repository checks so regressions fail locally and in CI.
- Re-run three Lighthouse 13.5 mobile measurements per representative route, independent review, exact-SHA deployment verification, and production readback.
- Do not migrate hosting or add a CDN solely to override GitHub Pages' ten-minute cache policy; record that platform limit separately.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `delivery-platform`: Add measurable client-delivery budgets and require clean-harness classification of performance findings without sacrificing static route availability or complete pre-paint route styling.

## Impact

Likely affected areas are the browser bootstrap and provider composition, Vite chunking/build configuration, route CSS manifest/prerender handling, static architecture/site checks, generated `docs/` output, performance documentation, and an ADR if the selected loading strategy changes the client boot or CSS delivery architecture. Dependencies will be added only if the approved implementation cannot measure the bundle deterministically with existing build artifacts.
