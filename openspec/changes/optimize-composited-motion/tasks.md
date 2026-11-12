# Tasks

## 1. Evidence and regression contract

- [x] 1.1 Record the supplied Lighthouse 13.5 report's category scores, application-owned budgets, extension-owned findings, GitHub Pages cache warning, and clean-browser comparison in execution evidence; verify every remediation item has an explicit provenance classification.
- [x] 1.2 Add a deterministic compositor-motion check with cleanup-guaranteed negative fixtures for loader visibility/border-color and hero border-radius animation; verify each fixture fails for its intended property and the clean stylesheet contract passes.

## 2. Compositor-safe motion

- [x] 2.1 Change the viewport loader exit to opacity-only motion with immediate pointer pass-through and timed host removal; verify lifecycle instrumentation observes stable root geometry, transparent non-interactive exit, and eventual host cleanup.
- [x] 2.2 Change loader brand and hero core keyframes to transform/opacity-only motion while preserving their static visual styling; verify browser animation inspection reports no application-owned border-color or border-radius animation at phone and desktop widths.
- [x] 2.3 Preserve `prefers-reduced-motion` behavior and no-JavaScript content; verify automatic loader/hero animations stop under reduced motion and primary content remains visible with one main and H1.

## 3. Documentation and acceptance

- [x] 3.1 Add ADR 0008 for compositor-safe decorative motion and update Lighthouse guidance if needed; verify it distinguishes extension contamination, hosting-controlled cache policy, intentional pre-paint CSS, and repository-owned motion.
- [x] 3.2 Run architecture checks, lint, production build, static/delivery/negative checks, strict OpenSpec validation, and `git diff --check`; verify all commands pass and delivery budgets remain within 95 KiB, 32 KiB unused JavaScript, and eight stylesheet requests.
- [ ] 3.3 Run clean Lighthouse 13.5 mobile evidence and browser interaction/geometry checks; verify no application-owned non-composited animation item remains, valid category evidence is recorded without hiding variable probes, and no loader/navigation regression occurs.
- [x] 3.4 Obtain independent review focused on provenance, CSS animation semantics, loader cleanup, deterministic check coverage, and acceptance accuracy; resolve reproducible blockers and rerun affected gates.
- [ ] 3.5 Commit and push the verified change, wait for exact-SHA CI/deployment, read back production home and a nested route, and archive only after every acceptance criterion is evidenced.
