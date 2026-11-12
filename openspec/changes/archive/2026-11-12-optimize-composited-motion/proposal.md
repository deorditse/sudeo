# Proposal

## Why

The supplied Lighthouse 13.5 report is heavily contaminated by browser extensions: its 2,067 KiB unused-JavaScript estimate, console errors, deprecated API warning, and most Best Practices losses originate from `chrome-extension://` resources rather than Sudeo. The report still exposes three application-owned non-composited automatic animations that can be made compositor-friendly without changing content, layout, routing, or the approved delivery budgets.

## What Changes

- Preserve the bootstrap loader fade while removing its discrete `visibility` transition and keeping the transparent exiting overlay non-interactive until removal.
- Preserve the loader breathing effect using transform-only motion instead of animating border color.
- Preserve the home hero orbit identity motion while keeping the organic core shape static instead of animating border radii.
- Add deterministic verification that automatic loader and hero motion uses compositor-friendly transform/opacity properties, still honors reduced motion, and does not change first-paint geometry.
- Record the supplied report's extension contamination, GitHub Pages cache limitation, application-owned measurements, and clean-browser comparison as execution evidence.
- Add an ADR for the rendering decision and update the Lighthouse guidance if required by the final implementation.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `delivery-platform`: require application-owned automatic decorative motion identified by Lighthouse to avoid non-composited paint/layout property animation while preserving reduced-motion behavior and stable prerendered geometry.

## Impact

Affected areas are the shared bootstrap loader stylesheet, the home hero orbit stylesheet, delivery/static regression checks, the delivery-platform specification, an ADR, and verification documentation. No dependency, route, API, content, DNS, hosting, analytics, CMS, or lead-delivery change is included.
