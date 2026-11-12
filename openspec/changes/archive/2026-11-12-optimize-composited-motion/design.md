# Design

## Context

See `proposal.md` for motivation. The supplied Lighthouse 13.5 report was collected in an extension-enabled Chrome profile. Extension resources account for the reported console errors, deprecated API, unminified JavaScript, and most unused JavaScript. Application-owned delivery remains within the existing budgets: `86263` eager transfer bytes, `24409` unused JavaScript bytes, and one stylesheet request.

The report also identifies three application-owned non-composited animations: bootstrap-loader `visibility`, loader-brand `border-color`, and home-orbit-core `border-radius`. The site already requires stable prerendered geometry, opacity-only loader exit, and reduced-motion support.

## Goals / Non-Goals

**Goals:**

- Remove the three application-owned non-composited animation causes while retaining recognizable motion.
- Keep the loader as a fixed overlay outside `#root`, non-interactive during exit, with deterministic removal.
- Preserve no-JavaScript content, hydration, lazy routes, dynamic reducers, geometry, and delivery budgets.
- Distinguish extension and hosting findings from repository-owned remediation.

**Non-Goals:**

- Do not attempt to modify browser extensions or GitHub Pages cache headers.
- Do not remove the consolidated pre-paint stylesheet or defer primary route CSS.
- Do not redesign the loader or home hero, change animation timing, or alter route/content architecture.
- Do not change application JavaScript ownership solely to improve this contaminated report.

## Decisions

### Keep visual motion but limit animated properties to transform and opacity

The loader brand will retain its scale pulse but use a static border color. The hero core will retain rotation and scale while keeping its organic border radius static. This removes paint-affecting interpolation without eliminating the visual identity.

Alternative: remove all automatic motion. Rejected because the supplied diagnostics do not justify removing an established visual system when compositor-safe motion provides the same rendering benefit.

### Remove visibility from the loader transition and exit state

The viewport overlay will transition opacity only. During exit it will have `opacity: 0` and `pointer-events: none`; the existing timer will unmount and remove the host. A transparent fixed element does not affect document flow, and removing `visibility` avoids a discrete non-composited transition that Lighthouse reports.

Alternative: delay a `visibility: hidden` mutation until fade completion. Rejected because host removal already provides the terminal hidden state and a second timer/state boundary adds no user-visible value.

### Add a deterministic motion contract check

The repository check will inspect the relevant stylesheet declarations/keyframes and reject reintroduction of paint/layout/discrete properties into these automatic animations. The check will complement, not replace, clean Lighthouse and browser verification.

Alternative: rely only on Lighthouse. Rejected because Lighthouse is environment-sensitive and extension contamination can obscure repository-owned findings.

### Record provenance rather than chase contaminated category scores

The supplied report will be preserved as evidence: Best Practices `73` is caused by extension console/deprecation/inspector findings; the cache warning is hosting-controlled; the one pre-paint stylesheet is intentional; clean-browser comparison remains the acceptance source.

## Risks / Trade-offs

- **The hero core no longer morphs its outline** → preserve the same static organic shape plus rotation and scale, then compare screenshots at phone and desktop widths.
- **The exiting loader remains in the DOM while transparent** → keep `pointer-events: none`, fixed positioning, and the existing 180 ms removal timer; verify cleanup with lifecycle instrumentation.
- **A textual check could be too narrow** → combine negative fixtures with browser `getAnimations()` inspection and Lighthouse application-owned audit details.
- **Performance scores vary with host contention** → require valid clean-browser evidence and report non-accepted probes instead of hiding them.

## Migration Plan

1. Add the failing deterministic motion fixture/check.
2. Apply the scoped stylesheet changes and ADR/documentation updates.
3. Run architecture, lint, build, negative fixtures, browser lifecycle/geometry/reduced-motion checks, and clean Lighthouse 13.5.
4. Commit, push, verify the exact-SHA workflow/deployment, and read back production.
5. Roll back by reverting the scoped commit if loader cleanup, motion, or geometry regresses.
