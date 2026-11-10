# Repository Rules

## Change control

1. All material source, dependency, configuration, documentation, architecture, and deployment changes must use OpenSpec.
2. Planning, apply, and archive are separate approval gates. Never infer approval for a later gate.
3. Run `openspec validate <change> --strict` before requesting apply or archive approval.
4. Mark OpenSpec tasks complete only when the stated verification evidence exists.

## Engineering boundaries

1. Inspect definitions, usages, manifests, and existing conventions before editing.
2. Preserve unrelated working-tree changes and secrets. Never commit, print, or place credentials in client code.
3. Public content must use verified facts. Demonstrations must be labelled; do not invent clients, metrics, prices, dates, legal details, or integrations.
4. Material technical decisions require an ADR under `docs/adr/` linked to the governing OpenSpec change.
5. Keep route pages in `src/pages/`, reusable sections in `src/widgets/`, and shared content/configuration/UI in `src/shared/`.
6. Enforce `app → pages → widgets → shared`; route slices use real `model/ui` boundaries, `widgets/Page`, `shared/layouts/MainContent`/`Container`, `AppPadding`, `AppGrid`, stacks and other shared primitives, public `index.ts` APIs, and `.async.tsx` route exports. Page CSS must not own route gutters, section rhythm, structural grids/gaps, or layout-container margins.
7. Keep interaction feedback accessible: hover states require focus-visible equivalents, current routes use programmatic state, and non-essential motion honors `prefers-reduced-motion` without hiding prerendered content.
8. Keep `routeManifest.clientEntry` aligned with every lazy page implementation. Generated route HTML must link the complete Vite-manifest CSS graph for that entry before JavaScript executes; do not rely on hydration to style prerendered content.
9. Preserve native refs in polymorphic shared/widget APIs. Do not add pointer-only feedback to non-focusable informational content; pair interaction styling with a real keyboard target and an equivalent focus state.

## Quality gates

1. Use the locked dependency graph with `npm ci` in CI.
2. Run `npm run check:architecture`, `npm run lint`, and `npm run build` before declaring implementation complete.
3. Verify generated routes, canonical metadata, sitemap, robots, and `CNAME` with `npm run check:site`.
4. Report external blockers—DNS, GitHub settings, CMS, CRM, analytics, legal copy—separately from repository build success.
5. Do not claim a deployment is live until DNS, HTTPS, the home page, and a nested route are read back successfully.
6. For rendering or lazy-chunk changes, compare JavaScript-disabled and hydrated header/H1/first-section rectangles and require the exact ordered/deduplicated manifest-derived route stylesheet graph to pass.
