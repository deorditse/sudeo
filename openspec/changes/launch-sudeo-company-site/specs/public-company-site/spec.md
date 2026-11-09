# Spec Delta

## Purpose

Defines the public Russian-language website experience through which business visitors understand the company, evaluate its four service directions, and contact the team without misleading claims.

## ADDED Requirements

### Requirement: Public information architecture
The site SHALL provide stable public routes for the home page, services overview, AI agents, web development, mobile applications, digital marketing, cases or demonstrations, an individual case template, company information, blog listing, article template, contacts, privacy/legal information, successful submission, and not-found content.

#### Scenario: Visitor opens a public route
- **WHEN** a visitor opens any declared public route directly
- **THEN** the route returns the intended page content with site navigation and footer rather than an unrelated copied page or generic application shell

#### Scenario: Unknown route
- **WHEN** a visitor opens an undeclared route
- **THEN** the site presents a branded not-found experience with a working path back to the home page

### Requirement: Home page content order
The home page SHALL present the company proposition and primary “Обсудить проект” action, client tasks, four service directions, published cases or explicitly marked demonstrations, work process, team/competencies, frequently asked questions, enquiry form, and verified contact section in that order.

#### Scenario: Visitor reviews the home page
- **WHEN** a visitor proceeds from the first screen through the home page
- **THEN** the required sections appear in the specified order and each service direction links to its detail page

### Requirement: Service detail content
Each service detail page SHALL explain the client problem, suitable scenarios, included work, deliverables, stages, required client inputs, related evidence, frequently asked questions, enquiry action, and factors affecting cost and timing without publishing unapproved prices or guarantees.

#### Scenario: Visitor evaluates a service
- **WHEN** a visitor opens one of the four service detail pages
- **THEN** the page contains every required decision-support section and avoids invented fixed prices, delivery dates, or results

#### Scenario: Visitor evaluates AI automation
- **WHEN** a visitor opens the AI agents page
- **THEN** the page additionally explains permitted knowledge sources, integrations, action controls, human handoff, logging, testing, and support boundaries

### Requirement: Honest evidence and company claims
The site MUST distinguish real client cases from demonstrations and MUST NOT present personal team experience, placeholder content, fabricated metrics, or demo work as verified company results.

#### Scenario: No approved client case is available
- **WHEN** content authors publish example work without client publication rights or verified metrics
- **THEN** the item is visibly labelled as a demonstration and describes only factual outputs

### Requirement: Responsive and accessible interaction
The public experience SHALL work without horizontal scrolling, clipped text, or obstructed primary actions at 360, 390, 768, 1024, and 1440 pixel viewport widths. Navigation, controls, accordions, and forms SHALL be operable with a keyboard, expose visible focus, and provide programmatic labels.

#### Scenario: Keyboard visitor navigates the site
- **WHEN** a visitor uses only keyboard controls
- **THEN** every interactive element is reachable in a logical order, focus remains visible, and mobile navigation can be opened and closed without trapping focus

#### Scenario: Visitor uses a target viewport
- **WHEN** the site is rendered at any required acceptance width
- **THEN** content remains readable and primary controls do not overlap or leave the viewport

### Requirement: Contact transparency
The site SHALL display only verified communication channels and SHALL mark unresolved company identity, legal details, or service commitments as pending configuration rather than borrowing values from the copied landing page.

#### Scenario: Required contact data is not configured
- **WHEN** a contact or legal value has not been approved
- **THEN** the public site omits the false value and provides an explicit configuration-safe alternative without exposing copied logistics-company data

### Requirement: Route-aware global navigation
The shared site shell SHALL visibly identify the current visitor-facing page, SHALL provide an accessible route catalog in the header, and SHALL provide a grouped footer sitemap covering every visitor-facing declared route. Transactional success and not-found routes SHALL remain directly routable but SHALL NOT appear as ordinary discovery destinations.

#### Scenario: Visitor identifies the current page
- **WHEN** a visitor opens a top-level or nested declared route
- **THEN** the header exposes the current location programmatically and visually, activates the appropriate parent group for nested routes, and identifies the exact destination in the route catalog

#### Scenario: Visitor opens the route catalog
- **WHEN** a keyboard, pointer, or touch visitor opens the header route catalog
- **THEN** all visitor-facing destinations are grouped and reachable, focus order is logical, Escape and outside activation close the catalog, and navigation does not depend on hover alone

#### Scenario: Visitor reviews the footer sitemap
- **WHEN** a visitor reaches the shared footer on any public page
- **THEN** links to every visitor-facing declared route are present with understandable group labels and the current route is not misrepresented

### Requirement: Progressive interaction and motion
The public site SHALL provide consistent hover, focus-visible, active, and pressed feedback for reusable interactive controls and MAY provide restrained page or section entrance motion. Primary content MUST remain visible and usable without client JavaScript, motion MUST NOT cause material layout shift or block navigation, and non-essential movement MUST be disabled when the user requests reduced motion.

#### Scenario: Visitor interacts with a reusable surface
- **WHEN** a visitor hovers, focuses, presses, or activates a navigation item, button, card, link, or accordion
- **THEN** the state change is perceptible without removing the visible focus indicator or changing the control's accessible name

#### Scenario: Visitor requests reduced motion
- **WHEN** `prefers-reduced-motion: reduce` is active
- **THEN** entrance, floating, and decorative movement is removed or reduced while current-page, hover-equivalent focus, expanded, and pressed states remain understandable

#### Scenario: Client JavaScript is unavailable
- **WHEN** a generated route is rendered without executing client JavaScript
- **THEN** all primary text, links, navigation, and page sections remain visible and usable rather than waiting for an animation trigger

### Requirement: Active home hero service composition
The home hero SHALL present a continuously animated Sudeo orbit whose central label cycles through the brand and service identities `S`, `AI`, `WEB`, `APP`, and `GROW`, together with a seamless service marquee moving from right to left. The marquee SHALL include `AI AGENTS`, `WEB DEVELOPMENT`, `MOBILE APPS`, and `DIGITAL MARKETING`, SHALL keep moving while an individual label is hovered, and SHALL enlarge the hovered or keyboard-focused label without causing material layout shift or horizontal page overflow. All continuous decorative movement MUST stop or become a static usable alternative when reduced motion is requested.

#### Scenario: Visitor observes the standard hero motion
- **WHEN** the home page is viewed without a reduced-motion preference
- **THEN** the center identity changes over time, the surrounding markers follow visibly active paths, and the service labels repeat seamlessly while travelling from right to left

#### Scenario: Visitor emphasizes a service label
- **WHEN** a visitor hovers or keyboard-focuses one service label in the marquee
- **THEN** that label visibly enlarges without stopping the marquee, changing its accessible name, obscuring adjacent primary controls, or creating page-level horizontal overflow

#### Scenario: Hero visitor requests reduced motion
- **WHEN** `prefers-reduced-motion: reduce` is active on the home page
- **THEN** the central `S`, service identities, and service destinations remain visible and usable while orbit, cycling, and automatic marquee movement stop

#### Scenario: Hero is rendered without client JavaScript
- **WHEN** the generated home page is opened without executing client JavaScript
- **THEN** the hero proposition, a static central brand state, and readable service destinations are present in the prerendered document

### Requirement: Branded lazy-route loading state
The application SHALL provide a reusable Sudeo-branded fallback for the shared route-level `Suspense` boundary. The fallback SHALL combine the established logo mark and company name, SHALL expose a concise loading status to assistive technology, SHALL avoid introducing an additional page heading, and SHALL disable non-essential motion when reduced motion is requested.

#### Scenario: A lazy route chunk is pending
- **WHEN** client-side navigation suspends while a route module is loading
- **THEN** a stable branded loader is visible within the content area until the route resolves, without replacing the global header/footer or exposing a blank page

#### Scenario: A generated route is prerendered
- **WHEN** the server render resolves a declared lazy route during build
- **THEN** the generated HTML contains the route content rather than the loader fallback

#### Scenario: Loader visitor requests reduced motion
- **WHEN** `prefers-reduced-motion: reduce` is active while the fallback is visible
- **THEN** continuous decorative movement stops while the Sudeo identity and loading status remain understandable
