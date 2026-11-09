# Apply execution notes

## Baseline

- Change: `launch-sudeo-company-site`
- Branch: `main`, tracking `origin/main`
- Baseline commit: `c58777b Initial commit`
- OpenSpec CLI: `1.16.1`
- Package manager: npm with existing `package-lock.json`
- GitHub CLI: installed but not authenticated at apply start
- Domain check at apply start: `sudeo.ru` did not resolve and HTTPS could not be reached

## Pre-existing working tree

Before apply, `README.md` was modified and the copied project files were mostly untracked, including `AGENTS.md`, `CNAME`, `Dockerfile`, `IDEA.md`, `docs/`, `eslint.config.js`, `index.html`, `nginx.conf`, `package*.json`, `public/`, `src/`, TypeScript configs, and `vite.config.ts`. OpenSpec initialization added `.agents/`, `.gitignore`, and `openspec/`.

The approved change replaces the copied public product surface and may edit the listed application/configuration files, but unrelated user content must not be silently claimed, committed, or deleted.

## Verification evidence

- `npm ci` completed and left the `package-lock.json` SHA-256 unchanged.
- `npm run lint` exited successfully.
- `npm run build` exited successfully and pre-rendered 15 routes, 13 indexable.
- `npm run check:site` passed; a negative run with `docs/CNAME` temporarily absent failed as expected.
- Generated output contains `sudeo.ru`, the expected sitemap URLs, and the production robots sitemap declaration.
- Browser checks covered widths 360, 390, 768, 1024, and 1440 on the home, AI service, demonstration detail, and article pages with zero horizontal overflow and exactly one H1.
- Browser checks found no empty action names or unlabelled form controls on the sampled pages.
- Mobile navigation opens to a measured 336px panel; FAQ controls open; direct nested routes retain correct headings, titles, and canonical URLs.
- Form checks covered client validation, absent endpoint, failed endpoint with preserved values, successful mocked acceptance, safe analytics event fields, and rapid double activation producing one POST after the guard fix.
- GitHub Actions workflow YAML passed the repository write-time syntax check; remote execution is not verified because GitHub CLI is unauthenticated.
- Lighthouse CLI is not installed in the environment, so the requested 12 Lighthouse runs remain an explicit acceptance blocker rather than an invented score.
- A later architecture revision was approved after inspecting `/Users/dmitrijdeordice/Developer/Git_all_repositories/Sber/GIGALEGAL/legal-gr/src`. The implementation now uses `app/routes`, `app/providers`, a Redux Toolkit reducer manager, `DynamicModuleLoader`, page-level `*.async.tsx` entry points, shared layouts/UI/widgets, and awaited streaming SSR so lazy pages remain fully pre-rendered.
- The revised client build emits separate chunks for all 12 route-level page modules and the enquiry form widget; the full build still pre-renders 15 routes and passes the static artifact checker.
- Revised browser checks verified lazy direct routes, mobile navigation, zero horizontal overflow at 360 and 1440 pixels, route navigation without runtime errors, form validation, successful mocked submission, and two rapid submissions producing one POST.
- Enquiry form values reset after navigating away and remounting while the service default is restored, confirming the default dynamic reducer removal lifecycle and feature reinitialization.
- JavaScript-disabled production checks confirmed the AI service H1 and canonical URL are present in generated HTML; repository search found no loading-fallback copy in `docs/`.
- Final `npm ci` preserved the updated lockfile hash, lint passed, and the production build emitted 12 page chunks, 15 route documents, and a passing site artifact report.
- The strict UI revision now provides `Page`/`MainContent`, shared stack/text/button/image/link/section primitives, 12 real page `model/ui` slices, local component styles, and app-independent dynamic reducer infrastructure. The obsolete aggregate `src/shared/styles/site.module.scss` was removed after source and responsive checks found no remaining imports or regressions.
- `npm run check:architecture` passes for 12 page slices and 13 discovery routes. A cleanup-guaranteed negative run introduced an upper-layer page import and raw `<button>`; the checker rejected both intended violations, the fixture was removed, and the clean rerun passed.
- `AGENT.md` guidance was consolidated into canonical `AGENTS.md`; `rules.md` remains the mandatory policy file and repository checks confirm the redundant singular file is absent.
- The route-aware header reports the exact current destination, highlights the active top-level route, exposes 13 unique visitor destinations in desktop and mobile catalogs, closes on outside pointer activation or `Escape`, and restores trigger focus after keyboard dismissal. The footer exposes the same 13 discovery destinations and marks the exact current page.
- Final browser regression covered home, AI service, demonstration detail, and article routes at 360, 390, 768, 1024, and 1440 pixels: each had one `main`, an H1, and zero horizontal overflow. Reduced-motion emulation matched and removed page-section animation.
- The final locked install, architecture check, ESLint run, TypeScript/client/SSR production build, prerender, and static site checker exited successfully. Output contains 15 route documents, 13 indexable routes, route-level page chunks, and an H1 in the JavaScript-disabled AI-service document.
- Current external delivery state changed from the initial baseline: DNS now resolves `sudeo.ru` to `95.163.244.138`, but HTTPS returns a TLS handshake failure. GitHub CLI remains unauthenticated before push/deployment verification.
- Commit `9cb2c95a879cb24683d21169bdea49bd19b8701d` was pushed to `origin/main` and read back from the remote ref. The first Actions run (`42679854668`) passed install, lint, build, static verification, and artifact upload, but its deploy job failed because Pages was not enabled.
- With explicit owner approval, repository visibility was changed from private to public because the current GitHub plan rejected private-repository Pages. Pages was then created with `build_type: workflow`, the failed deploy job was rerun, and attempt 2 completed successfully.
- The deployed Pages home and nested AI-service route both return HTTP 200 from `https://deorditse.github.io/sudeo/`. Pages is configured with custom domain `sudeo.ru`, but domain acceptance remains blocked: the apex currently resolves to `95.163.244.138` instead of GitHub Pages addresses and `https://sudeo.ru/` fails the TLS handshake. Task 6.5 therefore remains incomplete until DNS is corrected, the certificate is issued, and both custom-domain routes are read back successfully.
