# ADR 0008: Compositor-safe decorative motion

- **Status:** Accepted
- **Date:** 2026-11-12
- **OpenSpec change:** `optimize-composited-motion`

## Context

A Lighthouse 13.5 report collected in an extension-enabled Chrome profile scored Performance 99 and Best Practices 73. The Best Practices losses, console errors, deprecated API warning, unminified JavaScript, and most unused JavaScript belonged to `chrome-extension://` resources. GitHub Pages cache lifetime remained hosting-controlled, and the application's delivery measurements stayed within ADR 0007 budgets.

The same report identified three application-owned automatic animations that required main-thread paint or discrete-property handling: loader exit `visibility`, loader-brand `border-color`, and hero-core `border-radius`. These properties were not necessary to preserve the visual purpose of the effects.

## Decision

- Automatic decorative motion in the bootstrap loader and home hero uses transform and opacity only unless a later ADR documents why another property is required.
- The loader viewport exits through opacity only, disables pointer input immediately, and remains a fixed out-of-flow overlay until its existing timer removes the host.
- The loader brand keeps its transform pulse with a static border color.
- The hero core keeps its organic static outline while its existing transform rotation and scale continue.
- `prefers-reduced-motion: reduce` continues to disable these animations.
- A deterministic repository check and cleanup-guaranteed negative fixtures reject reintroduction of loader visibility/border animation and hero border-radius animation.
- Lighthouse findings continue to be classified by provenance: extension resources and GitHub Pages response policy are not represented as application fixes.

## Consequences

- The loader fade, hero identity, prerendered geometry, lazy routes, and delivery budgets remain unchanged.
- The hero core no longer interpolates between outline shapes, but retains the same static organic shape, rotation, and scale motion.
- A transparent exiting loader remains in the DOM for at most 180 ms but cannot intercept pointer input and does not participate in document flow.
- Future decorative animation changes must pass both the deterministic motion check and browser reduced-motion/lifecycle verification.
