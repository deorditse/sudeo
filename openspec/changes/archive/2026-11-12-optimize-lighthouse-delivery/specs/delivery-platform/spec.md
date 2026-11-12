# Spec Delta

## ADDED Requirements

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
