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
4. Reusable layout, typography, actions, images, links, and section surfaces use `Flex`, `HStack`, `VStack`, `AppText`, `AppButton`, `AppImage`, `AppLink`, `Box`, and `Section` with colocated SCSS modules.
5. Stateful widgets own their model and dynamic reducer lifecycle. Shared dynamic-loader infrastructure uses a structural reducer-manager contract instead of importing the application store.
6. The typed route configuration also supplies grouped visitor navigation. The header shows the current destination and an accessible complete route catalog; the mobile menu exposes the same destinations; the footer renders a grouped sitemap. `/success` and `/404` remain routable but are excluded from discovery navigation.
7. Hover, focus-visible, active, pressed, card-elevation, and restrained entrance effects live with their owning primitive, widget, or page component. Primary content is visible before JavaScript and `prefers-reduced-motion: reduce` removes non-essential movement.
8. `scripts/check-architecture.mjs` enforces layer imports, page boundaries, async exports, route-page primitive usage, and discovery-route coverage. It runs in the production build.

## Alternatives considered

- **Keep one shared stylesheet:** rejected because it couples unrelated routes, widgets, breakpoints, and selector source order.
- **Place product widgets in `shared`:** rejected because it obscures semantics and reverses Feature-Sliced dependency ownership.
- **Create empty page API/reducer files:** rejected because folder compliance without responsibility creates misleading architecture.
- **Use a hover-only page menu:** rejected because keyboard, touch, and mobile visitors need equivalent behavior.
- **Hide SSR content until an intersection observer runs:** rejected because no-JavaScript content, hydration, and accessibility would regress.
- **Let shared dynamic infrastructure import app store types:** rejected because `shared → app` violates the declared dependency direction.

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
- New primitives and variants require restraint to avoid replacing clear semantic markup with unnecessary abstraction.

## Verification

- `npm run check:architecture`
- `npm run lint`
- `npm run build`
- Browser checks for desktop dropdown, mobile catalog, active-route state, Escape/focus restoration, complete footer sitemap, target viewports, reduced motion, and no-JavaScript prerendered content.
