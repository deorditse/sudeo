# delivery-platform Specification

## Purpose
Defines repeatable quality checks and static deployment behavior for publishing the verified site to GitHub Pages under the custom domain `sudeo.ru`.

## Requirements

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

#### Scenario: Pages workflow prepares the artifact
- **WHEN** a main-branch build passes verification
- **THEN** the workflow explicitly configures GitHub Pages, uploads the generated `docs/` artifact, and deploys it through the `github-pages` environment using the same validated action sequence as the owner’s working `tec_drive` repository

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

#### Scenario: Apex DNS is migrated from the placeholder host
- **WHEN** authenticated REG.RU DNS control is available
- **THEN** the obsolete apex A record `95.163.244.138` is replaced by `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, and `185.199.111.153`, conflicting apex records are removed, and resolution is read back before HTTPS enforcement is claimed

#### Scenario: DNS control is unavailable
- **WHEN** repository access exists but REG.RU credentials or authorization are unavailable
- **THEN** Pages remains deployed, the exact required DNS changes are reported as an owner blocker, and `sudeo.ru` is not claimed live

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

### Requirement: Application-controlled client delivery budgets
The generated production site SHALL keep the representative route's initial application JavaScript transfer at or below 95 KiB, Lighthouse-estimated unused application JavaScript at or below 32 KiB, and render-blocking route stylesheet requests at or below eight, while preserving complete prerendered content, route-level lazy page loading, and stable first-paint geometry.

#### Scenario: Production artifact is measured
- **WHEN** the home page production artifact and a clean Lighthouse 13.5 mobile run are inspected
- **THEN** application-owned initial JavaScript, unused JavaScript, and render-blocking stylesheet counts satisfy the declared budgets without counting browser-extension resources

#### Scenario: Optimization changes route loading
- **WHEN** client boot, chunking, or stylesheet delivery is optimized
- **THEN** every public route still contains its primary content without JavaScript, lazy page entries remain mapped correctly, and JavaScript-disabled and hydrated header, H1, and first-content rectangles remain stable

### Requirement: Performance finding provenance
Performance acceptance evidence SHALL classify Lighthouse findings by provenance and SHALL NOT represent browser-extension resources or immutable GitHub Pages response policy as defects fixed by application code.

#### Scenario: Browser extensions contaminate a report
- **WHEN** an audit item originates from a `chrome-extension://` resource
- **THEN** it is recorded as harness contamination and is excluded from application remediation evidence

#### Scenario: Hosting controls a response policy
- **WHEN** a diagnostic is caused by GitHub Pages cache headers or another owner-inaccessible platform response policy
- **THEN** it is recorded as hosting-controlled and no repository success claim states that the policy was changed

### Requirement: Delivery regression enforcement
Repository verification SHALL deterministically measure the application entry size and route stylesheet request graph from generated artifacts and SHALL fail when the approved budgets or existing exact route-style ordering contract regress.

#### Scenario: Generated entry exceeds its budget
- **WHEN** a production build produces an application entry or route stylesheet graph outside the approved limits
- **THEN** the normal repository quality pipeline fails before deployment

### Requirement: Compositor-friendly automatic motion
Application-owned automatic decorative motion identified by delivery diagnostics SHALL animate only compositor-friendly transform and opacity properties unless a documented rendering requirement proves that another property is necessary. Such motion MUST preserve prerendered geometry and MUST stop under `prefers-reduced-motion: reduce`.

#### Scenario: Clean Lighthouse inspects automatic motion
- **WHEN** a clean Lighthouse 13.5 mobile run inspects the bootstrap loader and home hero decorations
- **THEN** application-owned automatic animations do not report non-composited border color, border radius, visibility, layout, or paint property animation

#### Scenario: Bootstrap loader exits
- **WHEN** the hydrated application signals readiness
- **THEN** the fixed loader fades through opacity, immediately stops intercepting pointer input, leaves the prerendered document geometry unchanged, and is removed after the exit interval

#### Scenario: Visitor prefers reduced motion
- **WHEN** `prefers-reduced-motion: reduce` is active
- **THEN** loader and hero decorative animations are disabled without hiding primary content or changing its reserved geometry
