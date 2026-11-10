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

## Alternatives considered

- **Keep one shared stylesheet:** rejected because it couples unrelated routes, widgets, breakpoints, and selector source order.
- **Place product widgets in `shared`:** rejected because it obscures semantics and reverses Feature-Sliced dependency ownership.
- **Create empty page API/reducer files:** rejected because folder compliance without responsibility creates misleading architecture.
- **Use a hover-only page menu:** rejected because keyboard, touch, and mobile visitors need equivalent behavior.
- **Hide SSR content until an intersection observer runs:** rejected because no-JavaScript content, hydration, and accessibility would regress.
- **Let shared dynamic infrastructure import app store types:** rejected because `shared → app` violates the declared dependency direction.
- **Use JavaScript timers or an animation dependency for the hero:** rejected because CSS keyframes provide deterministic decorative motion without hydration state, timer cleanup, or a larger runtime bundle.
- **Keep a transparent absolute header:** rejected because it disappears while scrolling and has inconsistent contrast over light page sections.

## Consequences

### Positive

- Route pages have predictable, reusable composition and one semantic main landmark.
- Styles and responsive behavior have explicit owners.
- The current page and all visitor-facing destinations are discoverable from the shared shell.
- Interaction feedback is consistent and reduced-motion safe.
- Architecture drift fails locally and in CI before production output is accepted.

### Negative

- The page tree contains more small files and public APIs than a monolithic landing page.
- Navigation and route metadata must remain synchronized through the shared route configuration.
- New primitives and variants require restraint to avoid replacing clear semantic markup with unnecessary abstraction; polymorphic `as` output preserves the intended landmarks.
- Fixed-header height and anchor offsets must remain synchronized at desktop and mobile breakpoints.

## Verification

- `npm run check:architecture`
- `npm run lint`
- `npm run build`
- Browser checks for desktop dropdown, mobile catalog, active-route state, Escape/focus restoration, complete footer sitemap, target viewports, reduced motion, and no-JavaScript prerendered content.
- Cleanup-guaranteed negative architecture fixtures for raw page containers, missing shared shells, and page-owned structural spacing.
- Browser checks for right-to-left marquee movement, uninterrupted hover scaling, keyboard focus scaling with a visible stationary label, cycling center identities, static reduced-motion fallback, semantic landmarks, and zero page-level overflow at 360, 390, 768, 1024, and 1440 pixels.
