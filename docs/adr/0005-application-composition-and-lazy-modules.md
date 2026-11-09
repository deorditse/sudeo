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
- Use `renderToPipeableStream` and wait for `onAllReady` so route-level lazy modules are resolved before generated HTML is written.

## Alternatives

- **Keep the monolithic application file:** rejected because route and feature ownership remain unclear and route-level code splitting is impossible.
- **Add `React.lazy` while keeping `renderToString`:** rejected because suspended routes can generate fallback markup instead of indexable page content.
- **Use a static Redux store without reducer injection:** rejected because it does not implement the required module lifecycle and would leave `DynamicModuleLoader` as unused infrastructure.
- **Move request locks into Redux:** rejected because promises and request locks are ephemeral, non-serializable browser concerns.

## Consequences

- Client builds emit separate chunks for each route page and the enquiry form widget.
- Static generation becomes asynchronous but continues to emit complete route content and metadata.
- Features that need isolated state can add typed optional keys to `StateSchema` and mount them through `DynamicModuleLoader`.
- Removing a dynamic feature removes its reducer state by default; long-lived state must explicitly set `removeAfterUnmount={false}` and document why.
- New pages must follow the async entry-point convention and be added to the route configuration and route manifest where applicable.
