# content-seo Specification

## Purpose
Defines structured content and discoverability behavior for public pages while preserving a clear migration boundary to a future editorial content management system.

## Requirements

### Requirement: Structured content source
Services, demonstrations/cases, articles, frequently asked questions, contacts, and route metadata SHALL be represented as structured content separate from page layout code so that a future CMS adapter can replace the initial repository-backed source.

#### Scenario: Content author updates repository-backed content
- **WHEN** an approved content value is changed in its structured source
- **THEN** every page consuming that value renders the update without duplicating the value in unrelated components

### Requirement: Honest CMS boundary
The first version SHALL NOT claim editor roles, drafts, previews, publication workflow, redirects, or no-code editing unless an actual CMS implements and verifies those behaviors. The architecture SHALL document the interface and migration needed to add them.

#### Scenario: CMS has not been selected
- **WHEN** the site is delivered before CMS procurement
- **THEN** repository documentation identifies content editing as a code-reviewed workflow and lists CMS functions as unimplemented follow-up requirements

### Requirement: Pre-rendered public content
Primary public content SHALL be included in the generated HTML for each declared route and MUST remain discoverable without requiring client JavaScript execution. Client JavaScript MAY enhance navigation and interaction after the initial content is available.

#### Scenario: Crawler requests a declared route
- **WHEN** a crawler or user agent requests a generated public route without executing JavaScript
- **THEN** the returned HTML includes the route’s main heading and primary textual content

### Requirement: Per-route metadata
Each indexable public route SHALL have an approved unique title, description, canonical URL, one main heading, and logical heading hierarchy. Article pages SHALL also expose author and publication date when those values are approved.

#### Scenario: Public route is generated
- **WHEN** the build generates an indexable route
- **THEN** its HTML contains route-specific title, description, canonical URL, and exactly one main heading

### Requirement: Crawl control assets
The production artifact SHALL include `robots.txt` and `sitemap.xml` for indexable routes. Success and not-found pages SHALL be excluded from the sitemap and marked against indexing.

#### Scenario: Search crawler reads site controls
- **WHEN** a crawler requests the production crawl-control assets
- **THEN** the assets reference `https://sudeo.ru`, enumerate intended canonical routes, and omit service/status pages not intended for indexing

### Requirement: Semantic images and links
Informative images SHALL have meaningful alternative text, decorative graphics SHALL be hidden from assistive technology, and link text SHALL communicate destination or action without relying solely on color.

#### Scenario: Non-visual visitor reviews a content card
- **WHEN** a card includes an informative image and a destination link
- **THEN** the image has descriptive alternative text and the link has a meaningful accessible name

### Requirement: Analytics event contract
The content layer SHALL expose privacy-safe hooks for service views, contact clicks, form starts, confirmed submissions, and submission errors. Loading any analytics provider SHALL remain configurable until target-market consent and data-processing requirements are approved.

#### Scenario: Analytics provider is absent
- **WHEN** no analytics provider has been configured
- **THEN** the site remains fully usable and does not load placeholder tracking scripts or transmit personal data
