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

### 2. Pre-render declared routes at build time with a React static-rendering entry

The application will separate route composition from browser bootstrapping. A server entry will render each declared static route with React DOM static APIs; a post-build script will inject the route markup and route-specific head metadata into `docs/<route>/index.html`. The browser bundle will hydrate or mount the same route tree. This uses existing React/Vite capabilities and avoids a hosted SSR runtime.

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

Route-level lazy imports must not weaken the existing static HTML contract. The server entry will therefore use React 19 `prerenderToNodeStream` as a resolution pass, await and consume its prelude, and then call `renderToString` after the lazy modules are cached. This avoids the fallback plus browser swap script that the first pass can retain around React Router lazy routes. A fresh Redux store will be created for each static render pass, while the browser uses its application store instance. Generated documents must contain route headings and metadata before client JavaScript executes and must not depend on inline Suspense replacement scripts.

An ADR will record this application composition, dynamic reducer lifecycle, and SSR/lazy-loading compatibility decision.

**Alternatives considered:**
- Keep the monolithic `App.tsx`: rejected because it conflicts with the requested reference architecture and makes route ownership, lazy loading, and reusable boundaries unclear.
- Add lazy wrappers but keep synchronous `renderToString`: rejected because suspended route modules can produce fallback HTML instead of the required route content.
- Use `renderToPipeableStream` for build-time documents: superseded after verification showed that a branded fallback is serialized ahead of hidden route content and requires an inline browser swap script, violating the no-JavaScript content contract.
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

### 10. Use a shared branded Suspense fallback and mirror the proven Pages delivery pattern

The application-level `Suspense` boundary will render a shared `AppLoader` from `shared/ui` rather than `null`. The loader will reuse the visual geometry of the Sudeo logo mark and wordmark without wrapping them in a navigation link. It will occupy a stable content-stage area, use a restrained pulse/orbit treatment built with CSS transforms and opacity, expose `role="status"` with a concise visually hidden loading message, and avoid headings or page-specific copy. A reduced-motion query will remove continuous animation while preserving the static brand state.

The build-time rendering contract will use React 19 `prerenderToNodeStream` to resolve route modules followed by `renderToString` for deterministic final markup. Generated documents therefore contain the resolved page without the loader, hidden replacement segments, or inline Suspense swap scripts. Browser verification will deliberately delay a route chunk or otherwise mount the fallback in a controlled preview so the loading state can be inspected without weakening production static content. ADR-0005 will be updated to record why this static two-pass build supersedes the earlier pipeable-stream implementation for generated files.

Delivery will follow the working `deorditse/tec_drive` Pages shape observed during planning: a public repository, `main` push/workflow dispatch triggers, locked install/build, explicit `actions/configure-pages`, upload of `docs/`, deployment through the `github-pages` environment, and `sudeo.ru` as the environment URL. The existing Sudeo verification steps remain stricter than the reference and will not be removed.

The custom domain is already registered in Pages, but the authoritative REG.RU zone still points the apex to `95.163.244.138`. Production activation therefore requires replacing that record with the four GitHub Pages apex A records used by the working `tec-drive.ru` domain. DNS will be changed only through authenticated owner access, then read back before HTTPS is enabled and verified.

**Alternatives considered:**
- Keep `fallback={null}`: rejected because client navigation can display an unexplained blank content area on a slow chunk.
- Reuse the linked header `Logo` component directly: rejected because a loading indicator must not introduce a misleading navigation control.
- Add a JavaScript animation library: rejected because CSS is sufficient and avoids increasing the route shell bundle.
- Copy the `tec_drive` workflow verbatim and remove Sudeo checks: rejected because the reference proves delivery order, not permission to weaken architecture, lint, prerender, and static-artifact verification.

### 11. Turn the home hero orbit and service strip into reduced-motion-safe continuous compositions

The existing hero orbit remains decorative and page-owned. Its central mark will contain stacked text layers for `S`, `AI`, `WEB`, `APP`, and `GROW`; CSS keyframes will cycle their opacity, scale, and rotation so one identity is legible at a time. The surrounding service markers will travel on independently timed circular paths while the orbit rings breathe and rotate at different speeds. Animation will use transforms and opacity only so it does not reflow the headline or alter the page's semantic reading order.

The service strip will become a seamless marquee composed of two identical presentation groups. The track will start at its natural position and move toward the left, matching the revised right-to-left direction without a visible reset. Each service phrase will be an actual focusable link to its declared service route, so the same scale/emphasis response is available through `:hover` and `:focus-visible`; enlarging one label will use transforms rather than changing track layout.

For `prefers-reduced-motion: reduce`, the center will show the static `S`, orbit paths and marker travel will stop, and the ticker will become a non-animated horizontally scrollable/wrapping service list. The duplicated marquee group will be hidden from assistive technology so service names are not announced twice. No JavaScript timer or animation library will be added.

**Alternatives considered:**
- JavaScript intervals for changing the center label: rejected because CSS provides deterministic decorative timing without hydration state or timer cleanup.
- Animate layout properties such as `left`, `width`, or font size: rejected because they trigger layout work and can make the marquee jump when a label is emphasized.
- Pause the whole marquee on hover: rejected because the requested behavior is continuous autoscroll; only the hovered/focused label is emphasized.
- Keep the ticker decorative with `aria-hidden`: rejected because focus enlargement would otherwise have no keyboard equivalent and the service labels are useful navigation.

### 12. Enforce shared layout and spacing primitives across every route page

The current implementation satisfies the layer direction and uses `Page`, `MainContent`, and `Section`, but an audit found 43 raw page-layout elements, no stack/box usage in route composition, no `Container` or `AppPadding`, and 102 page-owned `padding`, `margin`, or `gap` declarations. The revision therefore separates structural spacing from component-specific visual styling.

`shared/layouts/Container` will own content widths and responsive horizontal gutters. Existing `MainContent` will compose or delegate to `Container` so the previously approved page contract remains valid without maintaining two independent gutter systems. `shared/ui/AppPadding` will expose a finite responsive spacing scale for block, inline, and side-specific padding. `shared/ui/AppGrid` will cover repeated responsive grid composition that cannot be represented honestly by `HStack` or `VStack`. Existing `Flex`, `HStack`, `VStack`, `Box`, and `Section` remain the canonical primitives for flex composition, semantic wrappers, and section tones.

Route page files and page-owned section components will compose structural layout through these primitives, using polymorphic `as` props for semantic `section`, `article`, `header`, `aside`, and list containers. Page CSS modules may retain typography, color, background, decorative geometry, animation, and truly component-internal spacing such as card insets, but they will not define page gutters, section vertical rhythm, grid gaps, or layout-container margins that belong to the shared spacing system.

Reusable product sections that appear across routes remain in the separate `widgets` layer; generic presentation and spacing remain in `shared`. Widgets will not be moved inside `shared`, because that would erase the established `app → pages → widgets → shared` responsibility boundary. `scripts/check-architecture.mjs` will be expanded to reject raw layout containers in page UI composition, route pages missing the required shared shells, and structural page spacing declarations outside approved component-internal exceptions. A cleanup-guaranteed negative fixture will prove each new rule.

**Alternatives considered:**
- Move product widgets under `shared`: rejected because shared primitives must remain product-agnostic and cannot own page-level business composition.
- Replace every local CSS declaration with inline spacing props: rejected because typography, decorative visuals, responsive art direction, and component-internal styling still need colocated CSS modules.
- Force every grid into `HStack`/`VStack`: rejected because responsive two- and four-column layouts are grid semantics and deserve a reusable `AppGrid` primitive.
- Keep `MainContent` and add an unrelated `Container`: rejected because two independent gutter systems would drift; `MainContent` must delegate to the canonical container implementation.

### 13. Show the branded loader during browser bootstrap without hiding prerendered content

The browser entry will create a dedicated bootstrap overlay host outside `#root` and render the existing shared `AppLoader` into it before calling `hydrateRoot` or `createRoot`. The loader will gain a viewport-overlay presentation variant while retaining its existing content-stage variant for route-level `Suspense`. The prerendered route tree inside `#root` will remain present and unchanged behind the overlay, so search engines, no-JavaScript visitors, and hydration continue to receive the complete route document.

A renderless client-readiness component in the shared application tree will signal from an effect after the first React commit. The browser entry will handle that signal idempotently, allow the committed application to paint, apply a short CSS exit transition, unmount the loader root, and remove the temporary host. The lifecycle will not use a fixed artificial minimum delay; visitors will not be blocked longer than application readiness requires. A maximum safety timeout will remove the overlay if the readiness signal is unexpectedly lost, while leaving the intact prerendered content available underneath. Reduced-motion mode will disable both continuous loader animation and the exit transition.

The generated documents will continue to exclude the loader label, bootstrap host, hidden Suspense replacement segments, and inline `$RC` scripts. Browser verification will cover cold direct loads with cache disabled, hydrated content preservation, one loader status region, overlay cleanup, reduced motion, console/hydration errors, mobile navigation, primary controls, and page-level overflow for every declared route at 360, 390, and 768 pixels. Representative 1024 and 1440 checks remain part of the existing responsive contract.

**Alternatives considered:**
- Replace the prerendered `#root` content with a loader before hydration: rejected because it destroys the SEO/no-JavaScript contract and can create hydration mismatches.
- Serialize the loader into generated HTML above the route content: rejected because the established static-artifact contract intentionally contains only resolved route content and no loading status.
- Hide the application with `display: none` until an arbitrary timeout expires: rejected because it delays usable content, can trap visitors behind a loader, and does not represent actual readiness.
- Build a second bootstrap-only logo animation: rejected because the existing accessible `AppLoader` is the canonical branded loading state and should be reused through an explicit presentation variant.

### 14. Keep the global header fixed on an opaque dark surface

`MainLayout` will make the shared header fixed to the top of the viewport on every route and viewport rather than positioning it only over the first page section. The header and its mobile navigation surface will use the site's established dark shell color instead of depending on the page underneath for contrast. The existing border, white navigation text, lime active/focus state, route catalog, and mobile menu controls will remain visible against that surface.

The fixed header will retain a stable desktop and mobile height, remain above route content but below skip-link/focus escape affordances, and keep the desktop catalog and mobile panel anchored to the header. Global scroll offset will account for the header so hash targets and focused content are not hidden underneath it. The mobile panel will remain viewport-bounded and scrollable without introducing page-level horizontal overflow; opening and closing it will preserve the existing keyboard, touch, Escape, outside-activation, and focus-restoration behavior.

**Alternatives considered:**
- Keep the absolute transparent header only on hero pages: rejected because it disappears during scrolling and produces inconsistent contrast on light route sections.
- Change header colors per route: rejected because route-specific shell styling would duplicate logic and weaken the shared layout contract.
- Use a translucent background that reveals page colors: rejected because the requested dark menu background should remain predictable and readable across all routes.

### 15. Make responsive composition mobile-first at 451px and 960px

All component and layout SCSS will define the phone experience as the unqualified base layer. Tablet enhancements will use only `@media (min-width: 451px)`, and desktop enhancements will use only `@media (min-width: 960px)`. Feature media queries such as `prefers-reduced-motion` remain independent. Existing `max-width: 420/560/760/1100/1240px` responsive overrides will be removed or translated into the two approved ascending breakpoints so the cascade starts from the constrained viewport rather than undoing desktop defaults.

The shared primitives will encode the same direction. `Container`/`MainContent` will start with 18px phone gutters, increase at tablet, and reach the existing desktop width/gutter contract at 960px. `AppPadding` will treat its ordinary spacing props as the mobile baseline and add explicit `tablet*` and `desktop*` overrides; all existing page usages will migrate from desktop-first plus `mobile*` overrides. `AppGrid` will treat `columns` as the mobile baseline and expose `tabletColumns` and `desktopColumns`, with responsive named templates applied only when the relevant wider layout is active. `Section` and `Page` will start with tighter phone rhythm, use moderate tablet rhythm, and preserve the established desktop rhythm.

Typography will also be mobile-first. Shared `AppText` sizes and page-owned headings will begin at phone-safe values, then grow at 451px and 960px. The home hero heading will use a phone size that fits the complete word `Автоматизируем` within a 360px viewport after shared gutters, with no emergency mid-word breaking; its line-height, letter spacing, orbit placement, text width, action spacing, and hero height will be tuned together. Phone body text and section headings will retain readable line-height while large decorative gaps and card padding are reduced.

The architecture checker will reject width-based `max-width` media queries in application SCSS and reject unapproved width breakpoints, while allowing non-width capability queries. Browser validation will cover every public route at 360, 390, 430, 440, and 450px, tablet widths 451 and 768px, and desktop widths 960, 1024, and 1440px. It will check document overflow, clipped text/control geometry, long-word fit, header/menu behavior, section rhythm, and representative visual screenshots. The 430–450px checks reproduce the wide-phone CSS viewport shown in the supplied high-density iOS screenshot, where the previous `15vw` rule enlarged `Автоматизируем` beyond the content width. Browser chrome visible in screenshots is not treated as CSS viewport space.

**Alternatives considered:**
- Add another `max-width: 420px` patch only to the home H1: rejected because the screenshot exposes the broader desktop-first cascade and oversized mobile rhythm, not one isolated number.
- Allow arbitrary component breakpoints: rejected because the owner explicitly selected one tablet and one desktop threshold and consistent ascending rules are easier to reason about and enforce.
- Break `Автоматизируем` inside the word: rejected because Russian headline readability is better preserved by phone-safe type sizing and width composition.
- Reduce every spacing value globally by the same factor: rejected because controls, readable card insets, and desktop rhythm have different responsibilities; the shared responsive primitives should own intentional values per tier.

### 16. Complete semantic structure and UI-kit ownership without hiding page-specific presentation

The semantic/UI ownership audit found that the route shell, one-main/one-H1 contract, action primitives, form labels, prerendered content, and shared layout composition are sound, but several patterns remain below the approved standard. `/services` skips from H1 to service-card H3 headings; standalone service-detail sections begin with H3 headings; breadcrumbs and numbered process sequences are not exposed as ordered lists; navigation/footer groups use unheaded sectioning elements; and visually grouped roles/competencies lack list semantics.

The UI ownership audit also found product-aware `ServiceCard`, `Faq`, and `PageHero` compositions inside the aggregate `shared/ui/SitePrimitives` module, duplicated work-stage sections on Home/About, near-identical linked catalog cards on Blog/Cases, and repeated eyebrow, badge, card-surface, action-link, and prose styling. Route pages still recreate responsive typography and some component spacing despite having `AppText` and structural spacing primitives.

Product-agnostic presentation will move into focused shared primitives with colocated APIs and styles: `Eyebrow`, `Badge`, a narrowly scoped `Card`/`LinkCard` surface, and `Prose`; generic action-link presentation will become an `AppLink` variant. Substantial cross-route product compositions will move to `widgets`: service catalog/cards, work stages, FAQ, and route/detail hero composition. These widgets will consume shared primitives and content contracts without importing page slices. The existing aggregate `SitePrimitives` module will be reduced to truly atomic shared pieces or removed after all public imports migrate.

Route pages will render semantic ordered/unordered lists through polymorphic primitives or explicit `ol`/`ul` and `li` elements without recreating their layout. Heading levels will describe section hierarchy, including an H2 for service collections and top-level deliverable/input sections. Breadcrumbs will use `nav > ol > li`; navigation/footer groups will either have real headings or use non-sectioning containers. Visible page typography will use `AppText` variants unless the rule is inseparable from a page-specific branded composition; page CSS may retain unique art direction such as the home orbit/marquee, demonstration chat, service glyph, case facts/result, article callout, privacy document structure, and branded 404 stage.

Architecture validation will add deterministic ownership guards rather than banning useful semantic HTML indiscriminately. It will reject product/content imports from generic shared UI, product-aware components remaining in shared, raw route-page heading/paragraph typography where an approved text primitive is required, duplicated generic page-card/eyebrow/badge patterns after migration, and route pages bypassing widget public APIs. Static artifact checks will validate heading progression and the required semantic list/breadcrumb structures on representative generated routes. Cleanup-guaranteed negative fixtures will prove the new rules.

**Alternatives considered:**
- Ban all raw semantic HTML in pages: rejected because `ol`, `ul`, `li`, `details`, and genuinely page-specific semantic structures remain clearer than abstractions that only rename HTML.
- Move every visual section into `shared`: rejected because service catalogs, FAQ blocks, process sections, and route heroes are substantial product composition and belong in `widgets`.
- Generalize the home orbit, marquee, demonstration chat, and branded 404: rejected because they are intentionally route-specific and a generic API would obscure their meaning.
- Keep the aggregate `SitePrimitives` module and document exceptions: rejected because it currently mixes atomic icons/logo/heading helpers with product-aware cards, accordions, and route-level hero composition.

### 17. Keep prerendered geometry stable through bootstrap and hydration

Direct-load measurement currently reports a zero browser Layout Instability score on the generated home route, but the page shell intentionally applies a `translateY(14px)` entrance animation to top-level sections. That transform does not count as CLS because it does not reflow layout, yet it still makes the content visibly move when the bootstrap loader disappears. The requested stability contract therefore covers perceived movement as well as the browser's layout-shift metric.

Primary route sections will render in their final position from the first frame. The generic `Page` shell will not apply load-time translation, scaling, delayed entrance, or geometry-changing animation to route content. Interactive hover/focus feedback and page-specific decorative motion may remain because they begin after interaction or do not reposition primary content. The bootstrap loader will continue to cover intact prerendered markup and exit only through opacity/visibility without changing document flow.

Shared shells, heroes, cards, accordions, form status regions, and future media primitives will reserve deterministic geometry before asynchronous state resolves. The fixed header height and route hero/loader dimensions will remain stable across hydration. Images introduced through `AppImage` must provide intrinsic dimensions or an explicit aspect-ratio container so loading cannot move following content. Font use will remain on the current deterministic local/system stack unless a future self-hosted font change defines preload and metric-compatible fallback behavior in a separate approved revision.

Verification will instrument direct loads with `PerformanceObserver` for `layout-shift`, sample stable element rectangles before and after loader cleanup, emulate cache-disabled phone/tablet/desktop loads, and inspect route navigation where a lazy chunk displays `AppLoader`. Acceptance requires no change-owned CLS and no visible translation or resize of the header, H1, primary action, or first content section during bootstrap completion.

The direct no-JavaScript geometry comparison exposed a second root cause after the transform removal: Vite's base document links only the entry stylesheet, while each lazy route owns additional CSS chunks that the browser normally discovers from JavaScript. Prerendered HTML therefore contains complete semantic markup but initially paints it without route/widget CSS; hydration then loads those chunks and changes H1, hero, action, and section geometry even though `PerformanceObserver` still reports zero CLS while the loader overlay is present. The client build will emit a Vite manifest, each route definition will identify its lazy client entry, and the prerender step will recursively collect that entry's CSS plus imported widget/shared CSS and inject deduplicated route stylesheet links into the generated document head. Static and hydrated documents will consequently use the same CSS graph from the first render.

Independent review requires these contracts to be mechanically exact rather than presence-based. Architecture validation will derive the implementation paths exported by every `.async.tsx` page entry and require the unique `routeManifest.clientEntry` set to match them. Static-site validation will recompute the ordered CSS graph for each route from the generated client manifest, remove the global entry graph, and compare the result exactly with the route's `data-route-style` links so omissions, duplicates, reordering, and unrelated assets fail. New polymorphic primitives and heroes will preserve the native rendered element's `ref` contract, while informational surfaces that are not keyboard-focusable will not expose pointer-only hover movement or emphasis. Intrinsic-image validation will reject explicit missing/empty geometry and defer typed JSX spreads to TypeScript instead of treating every spread as an automatic failure.

**Alternatives considered:**
- Accept transform-only movement because CLS is zero: rejected because the visitor still perceives the page as jumping when the overlay disappears.
- Hide or remove prerendered content until hydration completes: rejected because it weakens SEO, no-JavaScript access, and the established hydration contract.
- Add a fixed minimum loader duration to mask movement: rejected because it delays usable content without correcting unstable geometry.
- Merge every lazy route stylesheet into the global entry CSS: rejected because it removes route-level CSS splitting and increases every page's initial payload; manifest-driven route links preserve splitting while making prerendered geometry deterministic.
- Accept any one existing route stylesheet as sufficient evidence: rejected because a partial or wrong CSS graph can still pass while recreating the original geometry change.
- Add `tabIndex` to decorative informational cards only to preserve hover movement: rejected because non-interactive content should not create unnecessary keyboard stops; remove pointer-only feedback or use focus from a real descendant control.

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
- **[A Suspense fallback can leak into prerendered HTML]** → Use the React static prerender API, verify generated route H1 content, and reject fallback text, hidden replacement segments, or `$RC` swap scripts in generated documents.
- **[Continuous loader motion can distract visitors]** → Use low-amplitude transform/opacity motion and provide a static reduced-motion state.
- **[Custom-domain Pages can be deployed while DNS still serves another host]** → Treat workflow success and domain launch as separate evidence; verify authoritative A records, HTTPS, home content, and a nested route before closing delivery.
- **[Continuous orbit and marquee motion can distract or consume rendering resources]** → Animate only transforms/opacity, keep timing moderate, stop all continuous motion under reduced-motion preferences, and verify responsive overflow and hover/focus behavior in the browser.
- **[A strict primitive migration can create abstraction noise or visual drift]** → distinguish structural spacing from component-internal styling, migrate route slices in verified batches, preserve semantic `as` output, and compare target viewports before removing old page layout rules.
- **[A bootstrap overlay can remain after hydration or cover usable controls]** → remove it from a post-commit readiness signal with idempotent cleanup, add a maximum safety-timeout cleanup path, and verify host removal and pointer restoration on direct mobile loads.
- **[A second React root can duplicate announcements or leak resources]** → render exactly one status region in the temporary host, unmount that root before removing the host, and keep route-transition loading in the existing application `Suspense` boundary.
- **[A fixed header can cover anchors, focus targets, or mobile content]** → define shared header-height tokens and document scroll offset, keep the mobile panel below the header, and verify anchors, keyboard focus, menus, and primary controls at all acceptance widths.
- **[A global breakpoint inversion can silently alter every route]** → migrate shared primitives first, update all call sites mechanically, enforce the breakpoint contract, and compare every route at phone/tablet/desktop widths before delivery.
- **[Smaller phone spacing can make controls cramped]** → reduce structural section rhythm and decorative gaps while retaining minimum touch targets, form label separation, card insets, and visible focus clearance.
- **[UI-kit completion can over-abstract simple semantic markup]** → extract only demonstrated cross-route presentation or product composition, keep ordered/unordered list markup explicit, and preserve named page-specific visual components locally.
- **[Heading/list corrections can alter visual styling]** → preserve current appearance through polymorphic `as` output and shared variants, then compare generated heading outlines and representative screenshots before deleting page rules.
- **[Moving product blocks across FSD layers can introduce upward imports]** → expose widget public APIs, keep content contracts below pages, and run architecture checks after each ownership batch.
- **[Removing entrance motion can make route transitions feel less animated]** → retain interaction feedback and decorative page-specific motion while prioritizing stable primary content on initial load.
- **[Future images or webfonts can reintroduce layout movement]** → enforce intrinsic media geometry and require a separately verified font-loading strategy before adding downloadable fonts.

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
11. Add the branded Suspense fallback, align the Pages workflow with the proven owner repository, migrate REG.RU apex DNS when authorized, and verify the deployed commit, HTTPS, home page, and a nested route on `sudeo.ru`.
12. Enhance the home hero orbit and right-to-left service marquee, verify pointer/keyboard emphasis, reduced-motion behavior, responsive overflow, static prerender content, and production quality gates before deployment.
13. Add the canonical container/padding/grid primitives, migrate every route page and page-owned section to the strict shared composition contract, strengthen the architecture checker with a negative path, and verify responsive visual parity before deployment.
14. Add the temporary client-bootstrap loader overlay, signal and clean it up after the first application commit, preserve generated route markup, and run a complete mobile direct-load audit before deployment.
15. Make the shared header fixed with an opaque dark site surface, preserve desktop/mobile route navigation behavior, and verify content, anchors, and controls are not obscured at any acceptance viewport.
16. Convert shared primitives and all component styles to the approved mobile-first 451/960 cascade, retune phone typography and spacing, enforce the breakpoint contract, and verify every route before deployment.
17. Correct semantic heading/list/breadcrumb/navigation structures, extract focused shared presentation primitives, move reusable product sections to widgets, migrate route pages away from duplicated generic typography/card patterns, strengthen negative architecture/static checks, and verify all generated routes before deployment.
18. Remove initial-load primary-content movement, preserve deterministic loader/header/hero/media geometry through hydration, measure layout shifts and element rectangles on direct loads and lazy navigation, and verify stable presentation before deployment.

Rollback is a revert or redeployment of the last verified commit. Because the deployment is static, no content database migration is involved in this change.

## Open Questions

- Approved public email, telephone/messenger, company/legal identity, team names, and privacy-controller details are still required before production acceptance.
- The production lead endpoint, CRM, analytics provider, consent model, and CMS remain owner selections; their implementation requires separate OpenSpec changes once selected.
- DNS records and GitHub Pages settings require repository/domain-owner access and must be verified during apply if credentials become available.
