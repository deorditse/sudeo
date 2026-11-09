# Tasks

## 1. Governance and baseline

- [x] 1.1 Record the pre-apply git status, existing untracked/modified files, current branch, and tool versions in the change execution notes; verify no pre-existing user file is attributed to this change.
- [x] 1.2 Keep root `rules.md`, merge the useful workflow and safety guidance from `AGENT.md` into canonical `AGENTS.md`, remove `AGENT.md`, and verify the remaining two files consistently require OpenSpec approval gates, scoped edits, ADRs, architecture checks, and lint/build evidence.
- [x] 1.3 Create numbered ADRs under `docs/adr/` for static pre-rendering, repository-backed content/CMS boundary, lead-submission boundary, and GitHub Pages/custom-domain delivery; verify each ADR includes status, context, decision, alternatives, consequences, and the change name.
- [x] 1.4 Update project documentation with local development, content editing, configuration gaps, verification, deployment, rollback, and owner-controlled prerequisites; verify commands and file paths match the implemented repository.

## 2. Application foundation and content model

- [x] 2.1 Define a typed route manifest shared by browser routing, pre-rendering, metadata, and sitemap generation; verify it includes every declared public route and marks success/not-found pages non-indexable.
- [x] 2.2 Define typed repository-backed content for the company proposition, client tasks, four services, demonstrations, work stages, competencies, FAQs, articles, contacts, and legal placeholders; verify copied logistics values and unapproved claims are absent.
- [x] 2.3 Build the shared site shell, header, desktop/mobile navigation, footer, buttons, cards, section primitives, breadcrumbs, and focus management; verify keyboard operation and visible focus in local browser checks.
- [x] 2.4 Replace root HTML metadata, favicon/brand assets, color/type tokens, reset behavior, and obsolete copied branding; verify a repository search finds no public `ТЭК ДРАЙВ`, `tec-drive.ru`, or logistics marketing copy in active source/configuration.

## 3. Public pages

- [x] 3.1 Implement the home page sections in the required order and verify all four service cards and primary actions resolve to declared routes or the enquiry section.
- [x] 3.2 Implement the services overview and four service detail pages with scenarios, scope, deliverables, stages, required inputs, evidence, FAQs, cost/timing factors, and enquiry action; verify the AI page additionally covers sources, integrations, controls, handoff, logging, testing, and support.
- [x] 3.3 Implement the demonstrations/cases listing and detail template with explicit demonstration labels and required case fields; verify no fabricated client, metric, date, or permission claim appears.
- [x] 3.4 Implement company, blog listing, article, contacts, privacy/legal placeholder, success, and branded not-found pages; verify each direct route renders its intended main heading and navigation.
- [x] 3.5 Verify responsive layouts at 360, 390, 768, 1024, and 1440 pixels with no horizontal scrolling, clipped text, or obstructed primary controls; capture or record the checked pages and viewport results.

## 4. Enquiry form and privacy-safe events

- [x] 4.1 Implement a reusable enquiry form with name, single contact value, service, and task fields; verify labels, required states, field-level errors, error summary/status announcement, and input preservation.
- [x] 4.2 Implement configurable endpoint submission with client validation, pending-state duplicate prevention, per-attempt idempotency identifier, origin/service/timestamp/UTM metadata, and confirmed-success-only behavior; verify absent endpoint, network failure, validation failure, double activation, and successful mocked response paths.
- [x] 4.3 Add privacy-safe event hooks for service view, contact click, form start, confirmed success, and error without loading a provider by default; verify event payloads contain no contact value or task description.
- [x] 4.4 Document the production server contract and leave CRM queueing, retry, notifications, retention/deletion, server validation, rate limiting, and spam controls explicitly blocked until a backend is selected; verify the UI and README do not claim those capabilities exist.

## 5. Static generation and SEO

- [x] 5.1 Separate browser and server rendering entries and implement build-time rendering from the shared route manifest; verify every declared public route produces a `docs/<route>/index.html` document with its primary content.
- [x] 5.2 Inject route-specific title, description, canonical URL, robots policy, and semantic heading content during generation; verify every indexable document has one H1 and the expected canonical `https://sudeo.ru` URL.
- [x] 5.3 Generate or maintain `robots.txt` and `sitemap.xml` from approved indexable routes; verify success and not-found pages are omitted and all URLs use `https://sudeo.ru`.
- [x] 5.4 Add a static artifact smoke checker for route files, metadata, CNAME, sitemap, robots, and copied-brand exclusions; verify the checker fails on a deliberately missing required artifact and passes on the completed build.
- [x] 5.5 Audit informative/decorative images, link names, landmarks, form associations, heading hierarchy, contrast, and keyboard order; verify findings are resolved or recorded as explicit acceptance blockers.

## 6. CI/CD and domain delivery

- [x] 6.1 Add `public/CNAME` containing exactly `sudeo.ru`, remove or replace stale root/generated CNAME values, and verify the production artifact contains the exact domain.
- [x] 6.2 Add a GitHub Actions verification workflow for pull requests and main-branch pushes using locked dependency installation, lint, build, and artifact smoke checks; verify the workflow YAML is syntactically valid and uses a pinned supported Node major.
- [x] 6.3 Add the gated GitHub Pages deployment job with official Pages actions, least-privilege permissions, environment URL, and concurrency control; verify deployment depends on successful verification and only runs for the intended main-branch event.
- [x] 6.4 Document required GitHub Pages settings and apex-domain DNS records, plus HTTPS and direct-route verification commands; verify current unresolved DNS or unauthenticated GitHub access is reported as an external blocker rather than deployment success.
- [ ] 6.5 If authenticated repository access is available, configure/verify Pages and observe the first workflow run; verify the run conclusion, Pages API state, DNS resolution, HTTPS, homepage, and a nested direct route. Otherwise leave this task unchecked with the exact owner actions required.

## 7. Quality and acceptance

- [x] 7.1 Run `npm ci` from the lockfile and verify dependency installation completes without modifying the lockfile unexpectedly.
- [x] 7.2 Run `npm run lint` and resolve change-owned lint errors; verify a zero exit code.
- [x] 7.3 Run the production build and static artifact smoke checker; verify a zero exit code and inspect generated route count, CNAME, sitemap, and robots output.
- [x] 7.4 Serve the generated artifact locally and smoke-test navigation, direct nested routes, mobile menu, FAQ controls, form validation, unavailable-endpoint behavior, and 404 handling; record observed results.
- [ ] 7.5 Run available Lighthouse mobile measurements for the home page, one service page, one demonstration detail, and one article using documented settings; record three runs per page and resolve change-owned regressions or document measured blockers without inventing scores.
- [x] 7.6 Re-run OpenSpec apply instructions, strict validation, status, git diff/status, lint, build, and artifact checks; mark only tasks backed by evidence complete and report external blockers separately before requesting archive approval.

## 8. `legal-gr`-style application architecture revision

- [x] 8.1 Add locked Redux Toolkit and React Redux dependencies, create `app/store` with typed state, store factory, reducer manager, and provider exports, and verify dependency installation and TypeScript compilation succeed.
- [x] 8.2 Create `shared/lib/components/DynamicModuleLoader` with typed reducer registration/removal and lifecycle actions, and verify a dynamically mounted reducer appears while its feature is mounted and is removed according to configuration.
- [x] 8.3 Move application composition to `app/providers`, `app/routes`, and `app/layouts`/`shared/layouts`; implement typed `RouteObject[]`, `useRoutes`, shared `Suspense`, metadata handling, and not-found routing; verify all existing public paths and navigation behavior remain unchanged.
- [x] 8.4 Split every route-level page into `src/pages/<page>/<Page>.tsx`, `<Page>.async.tsx`, and `index.ts`, move reusable sections/UI into `widgets` and `shared`, and verify the production client output contains route-level lazy chunks instead of one monolithic application page module.
- [x] 8.5 Move enquiry form values, errors, status, and message into a real dynamically injected reducer at the form feature boundary while retaining duplicate-request protection and privacy-safe effects; verify validation, unavailable endpoint, delivery failure, success, and remount behavior.
- [x] 8.6 Replace synchronous lazy-incompatible SSR with an awaited React server stream and a fresh store per render; update prerendering to await it and verify every generated route still contains its expected H1/content before JavaScript and hydrates without page fallback markup.
- [x] 8.7 Add an ADR for the adopted application composition, lazy page contract, dynamic reducer lifecycle, and SSR compatibility; update repository documentation and verify paths and architectural guidance match the implementation.
- [x] 8.8 Run lint, production build, artifact checks, direct-route/browser smoke checks, and OpenSpec strict validation; verify existing content, responsive behavior, SEO output, and lead form behavior have no change-owned regressions.

## 9. Strict reusable UI and page-slice architecture

- [x] 9.1 Add and document `@app`, `@pages`, `@widgets`, and `@shared` aliases in Vite and TypeScript, define the `app → pages → widgets → shared` dependency rules, and verify existing and new imports resolve in TypeScript and production builds.
- [x] 9.2 Implement independent shared primitives `Flex`, `HStack`, `VStack`, `AppText`, `AppButton`, `AppImage`, and any minimal supporting `Box`/`Section`/`AppLink` primitives with public `index.ts` exports and colocated SCSS modules; verify variants, semantic output, refs/HTML props, accessibility names, disabled/loading states, image fallback/error behavior, and SSR-safe initial rendering.
- [x] 9.3 Implement `shared/layouts/MainContent` and `widgets/Page` as the required shells for route content, update `MainLayout` to compose them without duplicate `main` landmarks, and verify skip links, landmarks, content widths, and focus behavior remain correct.
- [x] 9.4 Restructure every route slice to `pages/<page>/{model,ui}` with `<Page>.async.tsx` under `ui`, real page types/selectors/view models under `model`, page-specific sections under `ui/components`, and public exports through `index.ts`; verify all 12 routes keep lazy chunks and no empty placeholder model files are introduced.
- [x] 9.5 Refactor the home, services, service detail, cases, and case detail pages to declarative composition using `Page`, `MainContent`, stacks, text, buttons/links, images, and page/widget components; verify content order, links, service selection, event emission, and generated H1 values remain unchanged.
- [x] 9.6 Refactor about, blog, article, contacts, privacy, success, and not-found pages to the same composition contract; verify route metadata, semantic headings, legal copy, form placement, success behavior, and 404 navigation remain unchanged.
- [x] 9.7 Decompose `shared/styles/site.module.scss` into primitive, layout, widget, and page-owned modules; remove obsolete aggregate styles only after verifying representative 360, 390, 768, 1024, and 1440 pixel layouts have no visual or overflow regressions.
- [x] 9.8 Add an architecture checker for forbidden upward imports, missing page `model/ui` boundaries, missing async/public page exports, and direct page-level raw button/image usage; wire it into lint/build or `check:site` and verify deliberate violations fail.
- [x] 9.9 Add an ADR and update README/agent rules with the UI primitives, page-slice template, ownership rules, alias policy, and exceptions; verify documented examples match real paths and imports.
- [x] 9.10 Run `npm ci`, architecture check, lint, production build, static artifact checks, and browser smoke tests for navigation, lazy loading, responsive layouts, form lifecycle, no-JavaScript prerender, and hydration; verify OpenSpec strict validation and record only evidence-backed completion.

## 10. Route-aware navigation and progressive interaction

- [x] 10.1 Extend the typed route/navigation model with grouped visitor-facing destinations and discovery visibility; verify routing, metadata, sitemap, header dropdown, and footer sitemap use compatible repository-backed paths while success/not-found remain excluded from discovery UI.
- [x] 10.2 Refactor the `MainLayout` header to expose the active top-level and exact nested route, add an accessible dropdown containing all visitor-facing pages, and provide equivalent mobile navigation; verify keyboard, pointer, touch, Escape, outside-click, focus-visible, `aria-current`, and open-state semantics.
- [x] 10.3 Expand the `MainLayout` footer into a grouped sitemap covering all visitor-facing pages and service details; verify every declared discovery destination appears once in an understandable group and every link resolves.
- [x] 10.4 Add reusable hover, focus, active, pressed, card-elevation, and restrained section/page entrance effects at primitive/widget/page-component ownership boundaries; verify no primary content is hidden before JavaScript, no material layout shift is introduced, and `prefers-reduced-motion: reduce` disables non-essential movement.
- [x] 10.5 Run architecture checks, TypeScript, lint, production build, static artifact checks, and browser smoke tests for active route state, dropdown/mobile navigation, footer links, hover/focus parity, reduced motion, no-JavaScript prerender, and 360/390/768/1024/1440 layouts; record evidence before marking tasks complete.
