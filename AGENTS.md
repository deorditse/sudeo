# Repository Guidelines

Read `rules.md`, `openspec/config.yaml`, the relevant active change, and accepted decisions in `docs/adr/` before changing the repository.

## Required Workflow

- Every material source, dependency, configuration, documentation, architecture, and deployment change must follow an approved OpenSpec change.
- Planning, apply, and archive are separate approval gates; never infer approval for a later gate.
- Inspect the repository and record the working-tree baseline before apply. Preserve unrelated files and never expose secrets.
- Keep edits scoped to the approved change and attach real verification evidence before marking its tasks complete.
- Add or supersede an ADR for material architecture, security, integration, rendering, or deployment decisions.
- State external blockers plainly; never simulate CRM delivery, CMS capability, analytics consent, DNS, CI success, or production availability.
- The current launch contract is `openspec/changes/launch-sudeo-company-site/`.

## Project Structure & Module Organization

This is a React 19 and TypeScript application built with Vite. Application bootstrap and global styles live in `src/app/`; route-level slices use `src/pages/<page>/{model,ui}`; reusable product sections live in `src/widgets/`; and generic UI/layout/configuration belongs in `src/shared/`. Preserve `app → pages → widgets → shared`, compose every route through `widgets/Page`, `shared/layouts/MainContent`/`Container`, and shared `AppPadding`, `AppGrid`, stack, `Box`, and `Section` primitives instead of raw page layout containers or page-owned structural spacing. Keep route exports lazy through `.async.tsx`. Use the `@app`, `@pages`, `@widgets`, and `@shared` aliases; `@/` remains a compatibility alias. Static files copied without bundling go in `public/`. Production output is generated in `docs/` for static hosting.

Keep feature files close together. A component should normally have its `.tsx` file beside its `.module.scss`, with public exports exposed through a nearby `index.ts` where that pattern already exists.

## Build, Test, and Development Commands

- `npm install` installs the locked dependencies from `package-lock.json`.
- `npm run dev` starts the Vite development server with hot reload.
- `npm run build` type-checks, builds client and SSR entries, pre-renders public routes into `docs/`, and runs artifact checks.
- `npm run check:architecture` verifies FSD imports, page boundaries, lazy exports, route shells, shared structural layout/spacing ownership, and visitor navigation coverage.
- `npm run check:site` verifies generated routes, metadata, crawl controls, domain, and copied-brand exclusions.
- `npm run preview` serves the production bundle locally for verification.
- `npm run lint` runs ESLint across the repository.

Run architecture checks, lint, and build before opening a pull request. There is currently no automated test command configured.

## Coding Style & Naming Conventions

Follow the existing TypeScript style: four-space indentation, double quotes, semicolons, and trailing commas in multiline structures. Use PascalCase for React components and component directories (`MainLayout.tsx`), camelCase for hooks and helpers (`useScreenWidth.ts`), and `*.module.scss` for component-scoped styles. Prefer named exports for reusable modules; retain default exports where established by lazy-loaded pages or application entry points. ESLint is configured in `eslint.config.js` with TypeScript, React Hooks, and React Refresh rules.

## Testing Guidelines

No test runner or coverage threshold is currently defined. When adding tests, first add and document the chosen runner and an `npm test` script. Name tests `*.test.ts` or `*.test.tsx`, colocate unit tests with the code they cover, and place shared setup under `config/`. Focus on routing, responsive navigation, theme behavior, and user-visible page interactions.

## Commit & Pull Request Guidelines

Recent history uses short, imperative summaries such as `deploy` and `Create CNAME`; use a more descriptive equivalent, for example `Fix mobile navigation drawer`. Keep each commit focused. Pull requests should explain the change, list validation commands, link the relevant issue, and include before/after screenshots for visual or responsive UI changes. Note configuration, hosting, or asset changes explicitly.
