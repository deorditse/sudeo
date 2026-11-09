# ADR-0001: Pre-render public routes during the Vite build

- **Status:** Accepted
- **OpenSpec change:** `launch-sudeo-company-site`

## Context

The site is hosted as static files but must expose primary content without client JavaScript and must support direct requests to nested routes on GitHub Pages.

## Decision

Keep React and Vite. Add a server-rendering entry and a build script that renders every route from one typed route manifest into `docs/<route>/index.html`. The browser bundle mounts the same route tree.

## Alternatives

- SPA-only rendering: rejected because content and nested routes depend on JavaScript/fallback behavior.
- Hash routing: rejected because URLs and canonical metadata are unsuitable for the SEO requirement.
- Framework migration: deferred because it would expand launch scope before content and integration choices are approved.

## Consequences

The build has client, SSR, and pre-render stages. Route definitions must remain centralized, deterministic, and covered by artifact checks.
