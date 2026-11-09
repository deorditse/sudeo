# Design

## Context

See `proposal.md` for motivation. The repository is a React 19 and TypeScript Vite application copied from a logistics landing page. Most product files are currently untracked, the production build writes to `docs/`, no backend/CMS/analytics service is selected, GitHub CLI is unauthenticated, and `sudeo.ru` did not resolve during discovery. GitHub Pages is therefore the repository-controlled target, but production activation has external prerequisites.

## Goals / Non-Goals

**Goals:**
- Build a coherent, accessible, Russian-language marketing site from reusable route, section, and structured-content primitives.
- Generate route-specific HTML suitable for search indexing and direct GitHub Pages requests.
- Keep lead delivery honest and configurable until a production endpoint exists.
- Establish reproducible CI/CD and OpenSpec/ADR governance.
- Preserve a clear migration path to a CMS and server-side lead pipeline.

**Non-Goals:**
- Selecting or implementing a production CMS, CRM, analytics vendor, spam vendor, legal regime, or notification service without owner decisions and credentials.
- Publishing unverified prices, performance claims, client cases, legal entity details, team biographies, or contacts.
- Implementing customer accounts, payments, calculators, public AI chat, or multilingual content.
- Changing DNS or GitHub repository settings without authenticated owner access.

## Decisions

### 1. Keep the existing React/Vite stack and replace the copied product surface incrementally

The implementation will reuse React, TypeScript, React Router, and SCSS modules already locked in the repository. Route pages, reusable sections, structured content, and shared UI will follow the existing `src/pages`, `src/widgets`, and `src/shared` boundaries. Obsolete logistics modules may remain temporarily only when they are no longer reachable; change-owned cleanup will remove clearly copied public branding and dead imports without broad unrelated refactors.

**Alternatives considered:** Rebuild in Next.js or another framework. Rejected for this change because it expands migration scope and deployment complexity before business content, CMS, and backend choices are approved.

### 2. Pre-render declared routes at build time with a small Vite SSR entry

The application will separate route composition from browser bootstrapping. A server entry will render each declared static route with React DOM server APIs; a post-build script will inject the route markup and route-specific head metadata into `docs/<route>/index.html`. The browser bundle will hydrate or mount the same route tree. This uses existing React/Vite capabilities and avoids a hosted SSR runtime.

Generated nested documents satisfy direct GitHub Pages requests without rewrite rules. The route manifest will be the shared source for routing, metadata, sitemap generation, and pre-rendering.

**Alternatives considered:**
- SPA-only rendering: rejected because primary content would require JavaScript and nested direct requests would rely on 404 fallback behavior.
- Hash routing: rejected for canonical URL and SEO quality.
- Framework migration or third-party SSG plugin: deferred to avoid adding a large dependency and framework-level migration before the initial launch.

### 3. Use repository-backed typed content behind an adapter boundary

Approved services, demonstrations, articles, FAQs, contacts, and SEO fields will live in typed content modules. Page components consume selectors/interfaces rather than embedding repeated copy. Documentation will state that editing currently requires repository review and deployment. A future CMS must implement the same content contract plus draft, preview, roles, publication, redirects, and media handling before CMS acceptance criteria can be marked complete.

**Alternatives considered:** Hard-coded page copy, rejected because it duplicates content and obstructs CMS migration. Adding a CMS now, rejected because no product, hosting, authentication, or editorial decisions are approved.

### 4. Treat lead capture as a configurable external contract

The browser form will use one contact field, semantic labels, local validation, pending-state locking, an idempotency key, source metadata, and a configurable `VITE_LEAD_ENDPOINT`. Confirmed success requires a successful documented server response. When the endpoint is absent, submit remains unavailable with a truthful explanation and configured alternative contact.

An ADR will define the required production server contract: HTTPS, server validation, rate limits, spam controls, idempotency, durable queueing, CRM retries, minimal notifications, retention, and deletion. These server behaviors remain blocked follow-up work until infrastructure is selected.

**Alternatives considered:** `mailto:` form delivery, rejected as unreliable and privacy-unfriendly. Client-side direct CRM credentials, rejected because secrets cannot be protected in a static bundle. Fake local success, rejected because it violates the acceptance requirement.

### 5. Deploy the exact generated artifact with GitHub Actions and GitHub Pages

A workflow will run on pull requests and `main` pushes. Verification uses `npm ci`, lint, and production build. Deployment on successful `main` builds uses official Pages actions with explicit `contents: read`, `pages: write`, and `id-token: write` permissions, an environment URL, and concurrency that prevents stale production replacement.

`public/CNAME` will contain only `sudeo.ru`, ensuring the build artifact carries the custom domain. Documentation will list the GitHub Pages source setting and DNS records to configure, but no deployment will be called live until DNS, HTTPS, and public content are verified.

**Alternatives considered:** Committing generated `docs/` on every build, rejected because it mixes source and artifacts. Docker/Nginx deployment, deferred because no server target or credentials are specified and GitHub Pages matches the static architecture.

### 6. Consolidate agent instructions in `AGENTS.md`

`AGENTS.md` will be the single root agent instruction entry point. It will retain project structure/style guidance and absorb the useful OpenSpec gates, preservation rules, ADR policy, verification requirements, and external-state cautions formerly duplicated in `AGENT.md`. `rules.md` will remain the concise repository-wide mandatory policy. Redundant `AGENT.md` will be removed after its unique guidance is reconciled. Material technical decisions from this change will be copied from the approved design into numbered ADRs in `docs/adr/` during apply.

**Alternatives considered:** Keep both singular and plural instruction files. Rejected because duplicated governance can drift and the repository owner selected `AGENTS.md` as the canonical agent entry point.

### 7. Adopt the `legal-gr` application composition and lazy module boundaries

The implementation will use the inspected `legal-gr` repository as the structural reference without copying its product-specific code. Browser routing will move to `app/routes` and use `useRoutes` with typed `RouteObject[]`. `BrowserRouter`, `StoreProvider`, and other cross-cutting providers will be composed at the application entry point. `App` will own the common `Suspense` boundary and render `AppRouter` inside the shared public layout.

Every route-level page will live in its own `src/pages/<page>/` directory, keep the implementation in `<Page>.tsx`, expose a `lazy(() => import(...))` wrapper from `<Page>.async.tsx`, and publish the lazy component through `index.ts`. Reusable shell, navigation, form presentation, and content primitives will move out of the current monolithic `App.tsx` into `shared/layouts`, `shared/ui`, and `widgets` according to responsibility.

Redux Toolkit and React Redux will provide an application store with a reducer manager. `DynamicModuleLoader` in `shared/lib/components` will inject and remove reducers at feature boundaries. The enquiry form will be the first real dynamic module: its values, validation errors, submission status, and user-visible message will move to a dynamically mounted reducer, while request locking and browser-only side effects remain local where they prevent duplicate network activity. State selectors must tolerate the reducer being absent before the loader effect runs.

Route-level lazy imports must not weaken the existing static HTML contract. The server entry will therefore render through an asynchronous React server stream and resolve all lazy route modules before returning HTML. The prerender script will await each route render. A fresh Redux store will be created for each server render, while the browser uses its application store instance. Generated documents must continue to contain route headings and metadata before client JavaScript executes.

An ADR will record this application composition, dynamic reducer lifecycle, and SSR/lazy-loading compatibility decision.

**Alternatives considered:**
- Keep the monolithic `App.tsx`: rejected because it conflicts with the requested reference architecture and makes route ownership, lazy loading, and reusable boundaries unclear.
- Add lazy wrappers but keep synchronous `renderToString`: rejected because suspended route modules can produce fallback HTML instead of the required route content.
- Add Redux without a real dynamically mounted feature: rejected because an unused infrastructure layer would add complexity without validating the intended lifecycle.

### 8. Enforce page slices and shared UI composition

The supplied `ARCHITECTURE.md` and inspected production-project reference define a stricter target than the first architecture revision. The dependency direction will be `app → pages → widgets → shared`. `shared` must never import `widgets`, `pages`, or `app`; `widgets` must not import pages. Public imports across slices must go through local `index.ts` files and explicit layer aliases.

Every route page will use the following baseline shape:

```text
src/pages/<page>/
├── model/
│   ├── types.ts
│   ├── selectors.ts or content selectors when applicable
│   └── index.ts
├── ui/
│   ├── <Page>/<Page>.tsx
│   ├── <Page>/<Page>.async.tsx
│   ├── <Page>/<Page>.module.scss when page-level styling is needed
│   └── components/<PageSpecificComponent>/...
└── index.ts
```

Static pages still receive a model boundary: their route-specific content types and selectors/view-model builders live in `model` instead of being embedded in JSX. Shared domain data used by several pages may stay behind a shared read-only content contract or move to an `entities` slice only when a real reusable domain entity appears; page-specific behavior must not be pushed into `shared` merely to satisfy folder naming.

`widgets/Page` will provide the common semantic page shell and page-level spacing. `shared/layouts/MainContent` will provide the common content-width and vertical composition boundary used by every page. Generic layout and presentation will be implemented as independent shared primitives with their own public APIs and colocated styles:

- `Flex`, `HStack`, and `VStack` for layout;
- `AppText` for headings, paragraphs, semantic element selection, size, tone, and alignment;
- `AppButton` for button and link actions with variants and loading/disabled behavior;
- `AppImage` for image loading, fallback, error fallback, dimensions, and alt handling;
- small generic primitives such as `Box`, `Section`, `AppLink`, or `Card` only where they remove repeated raw markup without hiding semantics.

Route pages must be declarative composition roots. Repeated cross-page sections belong in `widgets`; page-only sections and their event/state logic belong under the page's `ui/components`; reusable behavior belongs in the page `model` or a shared hook only when it is domain-agnostic. Raw HTML remains allowed inside the implementation of shared primitives and for genuinely semantic elements that have no reusable abstraction, but pages must not recreate buttons, typography systems, image states, or flex/grid layout ad hoc.

The current single `shared/styles/site.module.scss` will be decomposed. Generic primitive styles live beside primitives, widget styles beside widgets, and page-specific styles beside page UI components. Global styles remain limited to reset, tokens, fonts, body/root, accessibility defaults, and truly global element behavior.

Aliases will be added consistently to Vite and TypeScript for `@app`, `@pages`, `@widgets`, and `@shared`, while the existing `@/` alias may remain temporarily for compatibility during migration. An architecture validation script will reject forbidden upward imports, missing page `model/ui` boundaries, route pages without async public exports, and direct raw button/image usage in page composition where an approved primitive exists.

**Alternatives considered:**
- Put all widgets under `shared`: rejected because compositional product blocks are not generic primitives and would invert FSD dependencies.
- Copy the reference UI kit wholesale: rejected because it includes deprecated components and product-specific behavior not needed by Sudeo.
- Keep one large shared stylesheet while only renaming components: rejected because it would preserve coupling and fail component-level encapsulation.
- Create empty `api`, selectors, and reducers for every static page: rejected; required slice boundaries will exist, but files must contain real page contracts rather than placeholder infrastructure.

### 9. Make global navigation route-aware and add progressive motion

The route manifest will remain the source for paths and labels used by routing, metadata, pre-rendering, the header catalog, and the footer sitemap. The desktop header will visibly mark the active top-level destination and expose an accessible dropdown containing the visitor-facing route catalog, including service details and content destinations. Nested routes will activate their parent group as well as identify the exact current destination inside the dropdown. The mobile navigation will expose the same destinations without relying on hover. Transactional success and branded not-found routes remain routable but are excluded from discovery navigation.

Interactive feedback will be implemented at reusable primitive/widget boundaries rather than as scattered page event handlers. Buttons, links, cards, navigation items, accordions, and page-specific interactive surfaces receive consistent hover, focus-visible, active, and pressed feedback. Page and section entrance effects may use CSS transitions and an SSR-safe client enhancement, but primary content must remain visible and usable before JavaScript. Motion must not delay navigation, block input, alter document semantics, or cause layout shift. `prefers-reduced-motion: reduce` disables non-essential movement while preserving state feedback.

The footer will render a grouped sitemap for every visitor-facing declared page. This is distinct from the compact header navigation: the footer favors complete discoverability, while the header favors current-location context and fast route switching.

**Alternatives considered:**
- A hover-only dropdown: rejected because it is inaccessible to keyboard, touch, and mobile users.
- Hand-maintained navigation arrays unrelated to the route manifest: rejected because labels and paths would drift from routing and SEO generation.
- JavaScript-only reveal animations that initially hide prerendered content: rejected because they weaken no-JavaScript content and can create hydration or accessibility failures.

## Risks / Trade-offs

- **[No production contact/legal data is approved]** → Use clearly configurable content and omit copied values; block launch acceptance until verified values are supplied.
- **[Static pre-render and browser routing can diverge]** → Use one route manifest and the same page component tree in server and browser entries; add artifact smoke checks for every declared path.
- **[React hydration warnings from interactive state]** → Keep initial state deterministic, defer browser-only values to effects, and fail smoke verification on console/build errors where automation permits.
- **[No backend can satisfy CRM queue requirements]** → Keep online submission disabled unless an endpoint is configured; document and leave backend-specific acceptance tasks blocked.
- **[GitHub Pages/DNS are externally controlled]** → Separate build success from live-deployment verification and provide exact owner steps.
- **[Large replacement in a mostly untracked repository]** → Record the apply baseline, edit only approved project files, and avoid deleting unknown user work.
- **[Performance target depends on final assets and third-party scripts]** → Avoid background video and unnecessary dependencies, optimize local assets, and document reproducible Lighthouse measurements as a launch verification step rather than promise an unmeasured score.
- **[Lazy page imports can break prerendered content or hydration]** → Use an async server stream, await every render, create deterministic initial state, and rerun route-content and hydration smoke checks for all declared routes.
- **[Dynamic reducer removal can discard unfinished form input during remounts]** → Mount the reducer at the form widget boundary, preserve it for the lifetime of the mounted form, and explicitly verify navigation/remount behavior and selectors for an absent reducer.
- **[The structural refactor touches most application modules]** → Move code by responsibility without redesigning approved content or visuals, keep route paths and metadata stable, and verify each migration stage with TypeScript, lint, build, and artifact checks.
- **[Over-abstraction can make simple marketing markup harder to understand]** → Introduce primitives only for repeated layout, typography, actions, images, containers, and cards; keep semantic page sections explicit and page-specific components local.
- **[Moving styles can cause visual drift]** → Preserve existing class behavior in small migration batches and compare representative pages at the approved responsive widths before deleting the old shared stylesheet.
- **[Strict page model requirements can create empty boilerplate]** → Put actual page content contracts, selectors, view models, and page-specific constants in `model`; do not create unused API or reducer files.
- **[Motion can create nausea, layout shift, or hidden prerendered content]** → Keep content visible by default, animate transform/opacity only after enhancement, honor reduced-motion preferences, and verify no-JavaScript output and target viewports.
- **[A complete route dropdown can become dense]** → Group destinations by purpose, keep success/not-found routes out of discovery UI, expose exact active-state semantics, and verify keyboard, pointer, touch, and escape behavior.

## Migration Plan

1. Record the pre-apply git baseline and approved configuration gaps.
2. Add governance files and ADRs so subsequent implementation decisions are traceable.
3. Introduce the route/content model, shared shell, pages, forms, metadata, and pre-render pipeline.
4. Replace copied branding and root metadata; add crawl-control and CNAME assets.
5. Add CI verification and Pages deployment workflow.
6. Run lint, build, route-artifact smoke checks, responsive/browser checks available locally, and inspect the generated CNAME/sitemap/robots output.
7. After owner configuration, verify GitHub Pages settings, DNS resolution, HTTPS, direct nested routes, and the public domain.
8. Refactor application composition to the approved `legal-gr`-style boundaries, migrate routes to lazy page modules, add the dynamic store infrastructure, and preserve prerendered route content through async SSR.
9. Introduce the shared UI kit and common page shells, migrate every page to `model/ui/components` slices, decompose styles by ownership, enforce layer imports, and verify the visual/content contract remains unchanged.
10. Add route-aware header state, the accessible visitor-route dropdown, the complete footer sitemap, and reusable progressive motion/hover effects; verify keyboard/touch behavior, reduced-motion behavior, no-JavaScript content, and responsive layouts.

Rollback is a revert or redeployment of the last verified commit. Because the deployment is static, no content database migration is involved in this change.

## Open Questions

- Approved public email, telephone/messenger, company/legal identity, team names, and privacy-controller details are still required before production acceptance.
- The production lead endpoint, CRM, analytics provider, consent model, and CMS remain owner selections; their implementation requires separate OpenSpec changes once selected.
- DNS records and GitHub Pages settings require repository/domain-owner access and must be verified during apply if credentials become available.
