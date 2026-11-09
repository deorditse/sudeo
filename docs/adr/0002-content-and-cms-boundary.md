# ADR-0002: Use typed repository-backed content before CMS selection

- **Status:** Accepted
- **OpenSpec change:** `launch-sudeo-company-site`

## Context

The brief requires editable services, cases, articles, contacts, images, and SEO fields, but no CMS vendor, hosting model, authentication, roles, or editorial workflow has been selected.

## Decision

Store approved launch content in typed modules separated from page layout. Components consume this content through stable structures so a future CMS adapter can replace the repository source.

## Alternatives

- Hard-code copy in page components: rejected because it duplicates content and obstructs migration.
- Select a CMS during this change: rejected because required business and infrastructure decisions are missing.

## Consequences

Editing the first release requires code review and deployment. Drafts, preview, roles, redirects, and no-code editing remain explicitly unimplemented until a separate OpenSpec change selects and integrates a CMS.
