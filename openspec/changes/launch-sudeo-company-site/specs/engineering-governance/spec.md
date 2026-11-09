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
