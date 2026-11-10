# ADR 0005: Application composition, lazy pages, and dynamic reducers

- **Status:** Accepted
- **OpenSpec change:** `launch-sudeo-company-site`

## Context

The first implementation placed routing, layouts, pages, reusable UI, analytics, and lead form state in one `src/app/App.tsx`. The project must use the established application composition demonstrated by the inspected `legal-gr` repository: explicit application providers and routes, route-owned page modules, lazy page entry points, shared presentation boundaries, and reducer injection for stateful features. Sudeo also pre-renders route HTML, so lazy imports must resolve during server rendering rather than producing fallback-only documents.

## Decision

- Keep application bootstrap and composition under `src/app/`, including `routes`, `providers`, and `store`.
- Define routes as typed React Router `RouteObject[]` and render them through `useRoutes`.
- Place every route-level page in `src/pages/<page>/` with `<Page>.tsx`, `<Page>.async.tsx`, and `index.ts`; public route imports resolve to lazy components.
- Keep reusable page sections in `src/widgets/`, shared layouts in `src/shared/layouts/`, shared primitives in `src/shared/ui/`, and cross-cutting helpers in `src/shared/lib/`.
- Use Redux Toolkit and React Redux with a reducer manager attached to the store.
- Use `DynamicModuleLoader` to add and remove feature reducers. The enquiry form is the first dynamic module and owns values, errors, status, and user-visible messages in its reducer.
- Keep duplicate network-request protection in a local ref because it guards an in-flight browser operation rather than serializable application state.
- Create a fresh Redux store for each server render and use the browser store instance through `StoreProvider`.
- Use React 19 `prerenderToNodeStream` as a build-time resolution pass for route-level lazy modules, consume its prelude, and then render the resolved tree with `renderToString`. This two-pass static build emits the page directly without a serialized Suspense fallback, hidden replacement segment, or browser-only swap script. Each pass creates a fresh Redux store.
- During browser bootstrap, mount the shared `AppLoader` in a temporary React root outside the prerendered `#root`. `App` emits an idempotent readiness event from its first client effect; the browser entry waits for the committed application to paint, fades and unmounts the temporary loader, and removes its host. An eight-second maximum safety timeout performs the same cleanup if the readiness signal is lost. The initial route-level fallback suppresses its duplicate status announcement until the bootstrap overlay exits, while later client navigations retain the normal polite loading status. The route markup inside `#root` is never deleted or replaced.
- Emit the Vite client manifest and keep each route definition's `clientEntry` synchronized with its lazy page implementation. During prerender, recursively resolve that manifest entry's imported chunks and CSS, then inject deduplicated `data-route-style` stylesheet links into the generated route head. This preserves route-level code/CSS splitting while ensuring complete prerendered markup uses the same CSS graph before JavaScript and after hydration.

## Alternatives

- **Keep the monolithic application file:** rejected because route and feature ownership remain unclear and route-level code splitting is impossible.
- **Add `React.lazy` while keeping `renderToString`:** rejected because suspended routes can generate fallback markup instead of indexable page content.
- **Use `renderToPipeableStream` with `onAllReady`:** superseded after a branded fallback exposed that React still serializes the fallback plus hidden resolved content and an inline `$RC` replacement script. That output requires JavaScript to replace the fallback and therefore violates the static no-JavaScript content contract.
- **Use a static Redux store without reducer injection:** rejected because it does not implement the required module lifecycle and would leave `DynamicModuleLoader` as unused infrastructure.
- **Move request locks into Redux:** rejected because promises and request locks are ephemeral, non-serializable browser concerns.
- **Serialize or inject the initial loader inside `#root`:** rejected because it would replace resolved route content, weaken no-JavaScript behavior, or create a hydration mismatch.
- **Rely on JavaScript to discover lazy route CSS:** rejected because complete prerendered markup paints with only the global entry CSS and visibly changes geometry when lazy CSS arrives.
- **Merge all route CSS into the global stylesheet:** rejected because every visitor would download every page's CSS; manifest-derived links keep the initial document stable without abandoning route splitting.

## Consequences

- Client builds emit separate chunks for each route page and the enquiry form widget.
- Static generation remains asynchronous and performs two deterministic renders per route during build, trading small build-time work for complete route content without Suspense replacement runtime markup.
- Features that need isolated state can add typed optional keys to `StateSchema` and mount them through `DynamicModuleLoader`.
- Removing a dynamic feature removes its reducer state by default; long-lived state must explicitly set `removeAfterUnmount={false}` and document why.
- New pages must follow the async entry-point convention and be added to the route configuration and route manifest where applicable.
- The initial loader is a client-only overlay and must remain absent from generated route documents; route-level loading continues to use the same component through the existing `Suspense` boundary.
- Every generated route includes at least one manifest-derived route stylesheet link, and the static-site checker verifies that each referenced asset exists.
