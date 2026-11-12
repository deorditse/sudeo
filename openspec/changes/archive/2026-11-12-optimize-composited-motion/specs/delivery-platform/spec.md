# Spec Delta

## ADDED Requirements

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
