# ADR-0006: Reusable UI composition and route-aware interaction

- **Status:** Accepted
- **Date:** 2026-11-09
- **OpenSpec change:** `launch-sudeo-company-site`

## Context

The first Sudeo implementation had working lazy routes, prerendering, and a dynamic enquiry reducer, but route pages remained flat and shared presentation depended on one aggregate stylesheet. The approved architecture requires `Page` and `MainContent` shells, typed shared primitives, page `model/ui` boundaries, strict dependency direction, visible current-route context, a complete visitor route catalog, and interaction effects that do not weaken accessibility or prerendered content.

## Decision

1. The dependency direction is `app → pages → widgets → shared`. `shared` cannot import upper layers, `widgets` cannot import pages or app, and page slices cannot import other page slices.
2. Every route slice uses `pages/<slice>/model` for real content contracts/selectors and `pages/<slice>/ui` for its lazy page and private components. The slice root `index.ts` is its public API.
3. Every route page renders one `widgets/Page` landmark and composes content through `shared/layouts/MainContent`.
4. Structural layout uses `Container`, `MainContent`, `AppPadding`, `AppGrid`, `Flex`, `HStack`, `VStack`, `Box`, and `Section`. `Container` owns page width and gutters, `MainContent` delegates to it, `Section` owns reusable vertical rhythm through `AppPadding`, and route pages do not recreate those concerns in page CSS. Typography, actions, images, and links use the corresponding shared primitives; every reusable primitive keeps its styles beside its implementation.
5. Stateful widgets own their model and dynamic reducer lifecycle. Shared dynamic-loader infrastructure uses a structural reducer-manager contract instead of importing the application store.
6. The typed route configuration also supplies grouped visitor navigation. The header shows the current destination and an accessible complete route catalog; the mobile menu exposes the same destinations; the footer renders a grouped sitemap. `/success` and `/404` remain routable but are excluded from discovery navigation.
7. Hover, focus-visible, active, pressed, card-elevation, and restrained entrance effects live with their owning primitive, widget, or page component. Primary content is visible before JavaScript and `prefers-reduced-motion: reduce` removes non-essential movement.
8. `scripts/check-architecture.mjs` enforces layer imports, page boundaries, async exports, exactly one route `Page`, an approved shared content shell, the absence of raw page layout containers, structural-spacing ownership, and discovery-route coverage. It runs in the production build.
9. The home hero's orbit and service marquee remain page-owned components. The orbit cycles the `S`, `AI`, `WEB`, `APP`, and `GROW` identities and moves service markers with transform/opacity-only CSS animations. The marquee uses duplicated visual groups for a seamless right-to-left loop, keeps pointer autoscroll active while a label scales, stops and resets when a keyboard focus enters the ticker, and exposes only one semantic set of service links. Reduced-motion mode removes cycling, orbit travel, duplication, and automatic scrolling while preserving a static `S` and all service destinations.
10. The shared header is fixed to the top of every route and uses the opaque `#11130f` shell surface on desktop and mobile. The route catalog and mobile navigation stay anchored beneath it, global scroll padding keeps targets visible, and the skip link remains above the shell in the stacking order.
11. Responsive styling is mobile-first across the application. Unqualified declarations target phones through 450px; tablet enhancements use only `@media (min-width: 451px)` and desktop enhancements use only `@media (min-width: 960px)`. `AppPadding` base props define phone spacing with `tablet*` and `desktop*` overrides, while `AppGrid.columns` defines the phone grid with `tabletColumns` and `desktopColumns`. Named grids are one-column by default. Width-based `max-width` queries and other width breakpoints are rejected by the architecture checker.
12. Product-agnostic presentation is split into focused shared primitives: `Eyebrow`, `Badge`, `Card`/`LinkCard`, and `Prose`, alongside the existing typography, action, image, layout, and spacing APIs. Reusable product compositions belong to widgets: `PageHero`, `DetailHero`, `ServiceCatalog`, `WorkStages`, and `Faq`. Route pages provide data and page-specific composition but do not recreate generic card, eyebrow, badge, action-link, prose, FAQ, service-catalog, stage, or hero systems. Product-aware service routing is therefore owned by `widgets/ServiceCatalog`, not `shared`.
13. Semantic output is part of each reusable API contract. Breadcrumbs render a labelled `nav` containing `ol/li`; explicitly numbered processes render `ol/li`; roles and competencies render `ul/li`; reusable cards expose a caller-selected heading level; and navigation/footer group wrappers do not create unnamed section landmarks. Each generated route retains one `main`, one H1, and a logical heading progression.
14. The initial browser presentation keeps prerendered content in its final geometry. The bootstrap loader remains an out-of-flow overlay and exits through opacity/visibility only. Generic route content does not use load-time translation, scaling, staggered entrance, or geometry-changing animation. `AppImage` requires intrinsic width/height or an explicit aspect ratio, shared shells reserve deterministic header, hero, fallback, and media geometry, and generated route heads include the complete manifest-derived lazy CSS graph before JavaScript runs. Interactive feedback and page-specific decorative motion remain allowed when they do not reposition primary content before interaction.
15. Polymorphic shared primitives and hero widgets preserve the chosen native element's ref type and forward that ref in React 19. Informational surfaces that are not real keyboard targets do not gain focus solely for decoration and do not expose pointer-only movement or emphasis; interaction feedback belongs on links, buttons, or containers with a genuinely focusable descendant and matching focus state.
16. Rendering checks compare the exact ordered and deduplicated manifest CSS graph per route rather than accepting one existing stylesheet. Architecture checks also require the unique `routeManifest.clientEntry` set to match the implementation modules imported by every page `.async.tsx` entry.

## Alternatives considered

- **Keep one shared stylesheet:** rejected because it couples unrelated routes, widgets, breakpoints, and selector source order.
- **Place product widgets in `shared`:** rejected because it obscures semantics and reverses Feature-Sliced dependency ownership.
- **Create empty page API/reducer files:** rejected because folder compliance without responsibility creates misleading architecture.
- **Use a hover-only page menu:** rejected because keyboard, touch, and mobile visitors need equivalent behavior.
- **Hide SSR content until an intersection observer runs:** rejected because no-JavaScript content, hydration, and accessibility would regress.
- **Let shared dynamic infrastructure import app store types:** rejected because `shared → app` violates the declared dependency direction.
- **Use JavaScript timers or an animation dependency for the hero:** rejected because CSS keyframes provide deterministic decorative motion without hydration state, timer cleanup, or a larger runtime bundle.
- **Keep a transparent absolute header:** rejected because it disappears while scrolling and has inconsistent contrast over light page sections.
- **Keep desktop-first base styles with descending overrides:** rejected because gaps between thresholds caused wide-phone regressions, made shared primitive semantics misleading, and required later rules to undo larger layouts.
- **Keep product-aware cards and route heroes in one aggregate shared module:** rejected because route knowledge is not product-agnostic and the aggregate hid reusable ownership boundaries.
- **Treat transform-only entrance movement as stable because CLS is zero:** rejected because the page still visibly moves when the loader disappears even though transforms do not contribute to Layout Instability scores.
- **Hide prerendered markup until hydration completes:** rejected because it weakens static content, accessibility, no-JavaScript behavior, and search-engine delivery instead of correcting geometry.

## Consequences

### Positive

- Route pages have predictable, reusable composition and one semantic main landmark.
- Styles and responsive behavior have explicit owners.
- The current page and all visitor-facing destinations are discoverable from the shared shell.
- Interaction feedback is consistent and reduced-motion safe.
- Route semantics and heading levels are centralized in APIs that preserve the caller's document outline.
- Prerendered content remains visually stationary while hydration and loader cleanup complete.
- Architecture drift fails locally and in CI before production output is accepted.

### Negative

- The page tree contains more small files and public APIs than a monolithic landing page.
- Navigation and route metadata must remain synchronized through the shared route configuration.
- New primitives and variants require restraint to avoid replacing clear semantic markup with unnecessary abstraction; polymorphic `as` output preserves the intended landmarks.
- Fixed-header height and anchor offsets must remain synchronized at desktop and mobile breakpoints.
- Existing responsive call sites must use explicit phone/tablet/desktop semantics when their layouts differ.
- Future media and downloadable fonts need explicit geometry/metric planning or they can reintroduce initial-load movement.

## Verification

- `npm run check:architecture`
- `npm run lint`
- `npm run build`
- Browser checks for desktop dropdown, mobile catalog, active-route state, Escape/focus restoration, complete footer sitemap, target viewports, reduced motion, and no-JavaScript prerendered content.
- Cleanup-guaranteed negative architecture fixtures for raw page containers, missing shared shells, and page-owned structural spacing.
- Browser checks for right-to-left marquee movement, uninterrupted hover scaling, keyboard focus scaling with a visible stationary label, cycling center identities, static reduced-motion fallback, semantic landmarks, and zero page-level overflow at 360, 390, 430, 440, 450, 451, 768, 960, 1024, and 1440 pixels.
- Cleanup-guaranteed negative architecture fixtures for a width-based `max-width` query and an unapproved width breakpoint.
- Static route checks for one `main`, one H1, semantic breadcrumb/list structures, and the absence of unresolved browser-only Suspense/loader markup.
- Cache-disabled browser checks using `PerformanceObserver` for layout-shift entries and sampled header/H1/primary-action/first-section rectangles before and after bootstrap-loader cleanup.
