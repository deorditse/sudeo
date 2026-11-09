# Spec Delta

## Purpose

Defines repeatable quality checks and static deployment behavior for publishing the verified site to GitHub Pages under the custom domain `sudeo.ru`.

## ADDED Requirements

### Requirement: Deterministic quality pipeline
Every pull request and push to the deployment branch SHALL install dependencies from the lockfile and run lint and production build checks on a supported Node.js version.

#### Scenario: Proposed code fails a quality check
- **WHEN** linting or the production build exits unsuccessfully
- **THEN** the workflow fails and no production deployment job runs for that revision

### Requirement: GitHub Pages artifact deployment
A successful push to the configured deployment branch SHALL package the generated static output as a GitHub Pages artifact and deploy it using least-privilege GitHub Actions permissions and concurrency control.

#### Scenario: Main branch build succeeds
- **WHEN** the main-branch workflow completes all quality checks successfully
- **THEN** the exact generated artifact is uploaded and the Pages deployment job publishes that artifact

#### Scenario: New deployment supersedes an older run
- **WHEN** multiple deployment runs overlap
- **THEN** concurrency policy prevents stale artifacts from replacing the newest approved revision

### Requirement: Custom-domain artifact
The production artifact SHALL contain a `CNAME` value of `sudeo.ru`, use root-relative assets appropriate for the apex domain, and document the external GitHub Pages custom-domain and DNS records required for activation.

#### Scenario: Production build is inspected
- **WHEN** the generated artifact is checked before deployment
- **THEN** it contains the exact `sudeo.ru` CNAME and does not retain the copied `tec-drive.ru` domain

### Requirement: External prerequisite honesty
CI/CD documentation MUST distinguish repository-controlled deployment from owner-controlled GitHub settings and DNS. The deployment SHALL NOT be reported operational until Pages configuration, DNS resolution, HTTPS, and a live HTTP response have been verified.

#### Scenario: DNS is not configured
- **WHEN** `sudeo.ru` does not resolve to the intended hosting records
- **THEN** CI may still build and upload artifacts, but delivery status is reported as blocked on DNS rather than successful production launch

### Requirement: Rollback capability
The delivery documentation SHALL define rollback as redeploying a previously verified commit or reverting the deployment branch, and SHALL identify how to confirm the restored artifact.

#### Scenario: Current release must be rolled back
- **WHEN** an operator selects a previously verified commit for restoration
- **THEN** the pipeline can rebuild and deploy that revision and the operator can verify its commit and public content

### Requirement: Static-host route availability
Every declared public route SHALL have a generated file path compatible with direct GitHub Pages requests and refreshes without depending on an origin-server rewrite rule.

#### Scenario: Visitor refreshes a nested route
- **WHEN** a visitor directly requests or refreshes a declared nested route on GitHub Pages
- **THEN** Pages serves the generated route document rather than its generic 404 response
