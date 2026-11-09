# ADR-0004: Deploy the generated site with GitHub Pages

- **Status:** Accepted
- **OpenSpec change:** `launch-sudeo-company-site`

## Context

The repository is hosted on GitHub, the site is static, and the requested domain is `sudeo.ru`. No independent server target or credentials were supplied.

## Decision

Use GitHub Actions to install locked dependencies, lint, build, run artifact checks, upload `docs/`, and deploy with official GitHub Pages actions. Store `sudeo.ru` in `public/CNAME`. Use least-privilege permissions and deployment concurrency.

## Alternatives

- Commit generated files after every build: rejected because source and artifacts would be mixed.
- Docker/Nginx hosting: deferred because no server environment or release credentials are defined.
- Third-party hosting: deferred because no provider was selected.

## Consequences

Repository automation can produce and deploy the artifact, but the owner must enable GitHub Pages, configure apex DNS records, and verify HTTPS. Build success is not proof that the public domain is live.
