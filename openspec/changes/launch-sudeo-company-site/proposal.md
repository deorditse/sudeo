# Proposal

## Why

The repository contains a copied logistics landing page that does not represent the planned digital product company or satisfy the supplied technical brief. The project also lacks an explicit engineering workflow, architecture decisions, and a repeatable deployment path for `sudeo.ru`.

## What Changes

- Replace the copied landing content and visual identity with a Russian-language company website for AI agents, web development, mobile applications, and digital marketing.
- Add the first-version public information architecture: home, services overview, four service detail pages, demonstrations/cases, company, blog/article, contacts, legal/privacy, success, and not-found experiences.
- Add responsive, keyboard-accessible navigation and content for the required 360, 390, 768, 1024, and 1440 pixel widths.
- Add honest lead capture behavior with client validation, duplicate-submit protection, clear success/error states, source metadata, and a configurable server endpoint; do not simulate CRM persistence when no backend is configured.
- Add editable-in-code structured content for services, demonstrations, articles, FAQs, contacts, and SEO metadata while documenting a future CMS boundary rather than claiming a CMS exists.
- Add technical SEO assets and metadata, including canonical URLs, title/description management, heading discipline, `robots.txt`, `sitemap.xml`, and no-index handling for service pages.
- Add GitHub Actions CI/CD that installs locked dependencies, lints, builds, uploads the static artifact, and deploys GitHub Pages for `sudeo.ru` after repository Pages and DNS prerequisites are configured.
- Add architecture decision records under `docs/adr/` for static delivery, routing/SEO, lead submission, and CI/CD/domain hosting.
- Keep `AGENTS.md` as the single agent instruction entry point, merge the useful singular-file guidance into it, retain `rules.md` for mandatory repository policy, and remove redundant `AGENT.md`.
- Remove obsolete logistics branding, contacts, metadata, content, and generated artifacts from the source-controlled product surface.
- Refactor the application foundation to follow the proven `legal-gr` composition: route configuration under `app/routes`, application providers under `app/providers`, page modules under `pages`, reusable presentation under `shared`/`widgets`, route-level `*.async.tsx` lazy exports, and Redux reducer injection through `DynamicModuleLoader` for stateful feature modules.
- Enforce a reusable UI composition contract based on the supplied architecture examples: all route pages use the common `MainContent` and `Page` shells, layout is composed with shared stack primitives, typography/actions/images use `AppText`, `AppButton`, and `AppImage`, and every page slice separates `model` from `ui` with page-specific components and logic encapsulated below `ui/components`.
- Enhance the shared shell and page sections with restrained motion and hover/focus feedback, route-aware navigation that visibly identifies the current page, an accessible dropdown containing the visitor-facing route catalog, and a footer sitemap containing all visitor-facing pages while excluding transactional success and not-found destinations.
- Add a reusable branded `Suspense` loader built from the Sudeo mark and wordmark, with an accessible loading announcement, stable layout, and reduced-motion behavior, while preserving fully rendered route HTML during prerender.
- Align the GitHub Pages workflow and custom-domain setup with the verified `deorditse/tec_drive` pattern: explicit Pages configuration, artifact upload/deploy actions, a `github-pages` environment targeting `sudeo.ru`, and the four apex A records required to replace the current REG.RU placeholder destination.
- Make the home hero more active without adding a runtime animation dependency: cycle the central Sudeo orbit label through the service identities, animate the surrounding service markers more visibly, and replace the static service strip with a seamless right-to-left marquee whose individual labels enlarge on hover and keyboard focus.
- Enforce strict reusable page composition: introduce shared `Container`, `AppPadding`, and `AppGrid` primitives alongside `VStack`, `HStack`, `Flex`, `Box`, `Section`, and `MainContent`; migrate all route pages away from raw layout containers and page-owned structural spacing; retain the separate `widgets` layer for reusable product sections; and make architecture validation reject regressions.
- Extend the branded loading experience to the first browser bootstrap without replacing or removing prerendered route content: mount the existing `AppLoader` as a temporary viewport overlay outside the hydrated root, dismiss it only after the React application commits, preserve the static HTML/SEO contract, and re-audit every public route at the required mobile widths.
- Keep the shared header visible while the visitor scrolls and give the desktop/mobile menu shell the same opaque dark surface as the site's dark sections, preserving readable contrast, route state, dropdown positioning, mobile navigation, and unobstructed content.

## Capabilities

### New Capabilities

- `public-company-site`: Public routes, navigation, responsive presentation, service content, demonstrations, company information, articles, contacts, legal content, and honest claims.
- `lead-capture`: Accessible project enquiry forms, validation, submission lifecycle, duplicate protection, source attribution, privacy handling, and failure behavior.
- `content-seo`: Structured site content, per-route metadata, canonical URLs, crawl-control assets, semantic headings, and the documented CMS migration boundary.
- `delivery-platform`: Reproducible lint/build verification, GitHub Pages deployment, custom-domain artifact handling, and documented external DNS/Pages prerequisites.
- `engineering-governance`: OpenSpec-first change control, repository agent/rule documentation, and ADR requirements for material technical decisions.

### Modified Capabilities

None. The initialized OpenSpec project has no canonical capabilities yet.

## Impact

- **Application:** React 19, TypeScript, React Router, Redux Toolkit/React Redux, SCSS modules, application providers/store, strict `app → pages → widgets → shared` dependency boundaries, shared spacing/container/grid/stack/UI primitives, widget-owned reusable product sections, page `model/ui` slices, route composition, branded Suspense and initial-bootstrap loading states, lazy page modules, React static prerendering, dynamically injected form state, an animated home hero orbit/marquee, and static assets under `src/` and `public/`.
- **Build and hosting:** Vite production output, GitHub Actions workflows, GitHub Pages configuration, `CNAME`, `sudeo.ru` DNS prerequisites, and deployment documentation.
- **Documentation:** `docs/adr/`, `rules.md`, consolidated `AGENTS.md`, and README setup/deployment instructions.
- **External boundaries:** A production lead endpoint/CRM, CMS, analytics vendor, legal texts, verified company contacts, DNS records, and GitHub Pages settings require owner decisions or credentials and will be represented as explicit configuration or follow-up work rather than fabricated implementation.
