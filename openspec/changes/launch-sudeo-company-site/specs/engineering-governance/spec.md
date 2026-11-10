# Spec Delta

## Purpose

Defines the repository governance contract for OpenSpec-controlled changes, durable architecture decisions, and consistent instructions for human and automated contributors.

## ADDED Requirements

### Requirement: OpenSpec-first repository changes
Material changes to source code, configuration, documentation, dependencies, architecture, or deployment SHALL be represented by an OpenSpec change and SHALL pass proposal review before apply work begins.

#### Scenario: Contributor proposes a material change
- **WHEN** a contributor intends to modify a governed project area
- **THEN** the contributor creates or updates an OpenSpec change, validates its planning artifacts, and obtains explicit apply approval before implementation

### Requirement: Separate approval gates
Planning, apply, and archive SHALL be treated as separate approval gates. Completing planning artifacts or implementation tasks MUST NOT be interpreted as permission to begin the next gate.

#### Scenario: Planning validation succeeds
- **WHEN** a change has complete and strictly valid proposal, specs, design, and tasks
- **THEN** implementation remains paused until the named change receives explicit apply approval

### Requirement: Architecture decision records
Material technical decisions SHALL be recorded under `docs/adr/` with status, context, decision, alternatives, consequences, and links to the governing OpenSpec change.

#### Scenario: Implementation introduces a material architecture choice
- **WHEN** a decision affects routing, rendering, integrations, security, data handling, hosting, or deployment
- **THEN** an ADR is created or superseded and reviewed as part of the same OpenSpec change

### Requirement: Repository instruction files
The repository SHALL contain root `rules.md` and canonical `AGENTS.md` files describing mandatory workflow, project boundaries, code quality checks, documentation expectations, and safety constraints. Useful guidance SHALL be consolidated in `AGENTS.md`, and a redundant root `AGENT.md` SHALL NOT remain.

#### Scenario: Automated contributor enters the repository
- **WHEN** an agent reads the root instruction files
- **THEN** it receives consistent requirements to inspect context, follow OpenSpec, preserve unrelated work, document architecture, and verify lint/build results

### Requirement: Scope and evidence discipline
Contributors MUST preserve unrelated working-tree changes, MUST NOT claim unverified external state, and SHALL attach verification evidence to completed OpenSpec tasks.

#### Scenario: Repository has pre-existing uncommitted files
- **WHEN** apply work begins in a non-clean working tree
- **THEN** the contributor records the baseline and distinguishes pre-existing files from change-owned edits without deleting or claiming unrelated work

#### Scenario: External deployment dependency is unavailable
- **WHEN** credentials, DNS, hosted services, or repository settings prevent verification
- **THEN** the affected task remains open or explicitly blocked and the contributor reports the exact prerequisite instead of fabricating success

### Requirement: Shared page composition and spacing contract
Every route page SHALL use the common page shell and canonical shared container, padding, grid, stack, section, typography, action, and image primitives for structural composition. Reusable product sections SHALL live in the widgets layer, while product-agnostic layout and spacing primitives SHALL remain in shared. Route and page-section implementations MUST NOT recreate raw layout containers, page gutters, section rhythm, or grid gaps through independent page-owned styling when an approved shared primitive exists.

#### Scenario: Contributor composes a route page
- **WHEN** a route page or page-owned section introduces structural layout, spacing, responsive columns, or a semantic wrapper
- **THEN** it composes the structure through the approved shared primitives and polymorphic semantic output rather than raw layout elements with independently styled spacing

#### Scenario: Contributor creates a reusable product section
- **WHEN** a complete product section is reused across routes or represents a substantial standalone page block
- **THEN** it is owned by the widgets layer and consumes shared primitives without moving product-specific composition into shared

#### Scenario: Architecture validation checks page composition
- **WHEN** the repository architecture checker scans page UI files and their CSS modules
- **THEN** it rejects missing page/container shells, forbidden raw layout containers, and page-owned structural spacing outside documented component-internal exceptions

### Requirement: UI-kit ownership and route-page composition
Generic reusable presentation SHALL be owned by focused shared primitives, and substantial reusable product composition SHALL be owned by widgets. Route pages SHALL compose these public APIs and MUST NOT recreate cross-route typography systems, card surfaces, badges, eyebrows, action-link treatments, prose styling, FAQs, service catalogs, route heroes, or process sections in page-owned code when the pattern is reusable. Genuinely route-specific branded visuals and semantic content structures MAY remain page-owned.

#### Scenario: A presentation pattern repeats across routes
- **WHEN** the same visual behavior or styling contract is used by more than one route without product-specific composition
- **THEN** it is implemented as a focused shared primitive or variant with a public API and colocated styles

#### Scenario: A product section repeats across routes
- **WHEN** a complete service catalog, FAQ, process-stage, or route-hero composition is reused or represents a substantial standalone block
- **THEN** it is owned by the widgets layer and consumes shared primitives without importing page slices

#### Scenario: A route contains unique branded presentation
- **WHEN** a visual such as the home orbit/marquee, demonstration chat, service glyph, case facts/result, article callout, privacy structure, or branded not-found stage is specific to one route contract
- **THEN** it remains local to that page while delegating any repeated generic surface, typography, action, and spacing concerns to the UI kit

#### Scenario: Architecture validation checks UI ownership
- **WHEN** architecture checks scan shared UI, widgets, route pages, and page styles
- **THEN** they reject product-aware components in generic shared UI, route pages bypassing required widget APIs, and duplicated generic presentation that has an approved shared primitive while permitting explicit semantic list markup and documented page-specific visuals

### Requirement: Deterministic lazy-route presentation contracts
Every declared route client entry SHALL correspond to an actual implementation imported by a page `.async.tsx` entry. Generated route documents SHALL contain the exact ordered and deduplicated Vite-manifest CSS graph for that client entry after excluding the global entry graph. Polymorphic shared/widget APIs SHALL preserve native ref support, and non-focusable informational surfaces MUST NOT expose pointer-only feedback that has no keyboard equivalent.

#### Scenario: Static checks validate a generated route
- **WHEN** route HTML and the Vite client manifest are available after the production build
- **THEN** the checker recomputes and exactly compares the expected route stylesheet sequence, rejects missing/duplicate/unrelated/reordered links, and verifies every manifest client entry maps to a lazy page implementation

#### Scenario: Contributor adds polymorphic or informational UI
- **WHEN** a reusable API renders a caller-selected native element or an informational surface receives interaction styling
- **THEN** native refs remain supported and hover feedback is paired with focus from a real interactive/focusable target or is omitted
