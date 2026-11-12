# Tasks

## 1. Baseline and ownership

- [x] 1.1 Record the clean working-tree baseline, current production SHA, Lighthouse 13.5 home diagnostics, generated manifest entry sizes, route CSS request counts, and extension/hosting-controlled findings in execution evidence; verify the report distinguishes application resources from `chrome-extension://` and GitHub Pages cache policy.
- [x] 1.2 Add a repeatable bundle ownership report for the initial entry, route chunks, enquiry/state code, and route stylesheet graph; verify its totals match generated artifact files and the Lighthouse network records within compression/transfer accounting differences.

## 2. Client JavaScript optimization

- [x] 2.1 Identify the smallest real behavior boundary that removes non-critical code from the initial entry without deferring the entire application; verify the candidate with before/after generated sizes and reject manual chunking that only redistributes eagerly loaded bytes.
- [x] 2.2 Implement the selected client runtime/loading boundary while preserving SSR fresh-store behavior, hydration, route navigation, bootstrap-loader cleanup, dynamic reducer lifecycle, enquiry defaults, validation, failure, success, and remount behavior; verify the home initial application transfer is at most 95 KiB and clean Lighthouse unused application JavaScript is at most 32 KiB.

## 3. Stylesheet delivery optimization

- [x] 3.1 Implement route-style consolidation or an equivalent build/prerender optimization that retains complete pre-paint route styling; verify the home document has at most eight render-blocking route stylesheet requests and no material increase in transferred CSS.
- [x] 3.2 Update manifest/prerender/static validation for the selected CSS delivery shape; verify every route still has exact ordered/deduplicated style coverage, no JavaScript-discovered primary CSS, and identical JavaScript-disabled versus hydrated header/H1/first-content rectangles on representative phone, tablet, and desktop widths.

## 4. Regression enforcement and documentation

- [x] 4.1 Add deterministic entry-size and route-style request budgets to the normal repository checks; verify cleanup-guaranteed negative fixtures fail for an oversized entry, excessive route stylesheet count, and incomplete/reordered route coverage before the clean tree passes.
- [x] 4.2 Add or supersede the client-delivery ADR and update README guidance with the optimization boundary, budgets, clean Lighthouse command, extension contamination rules, and GitHub Pages cache limitation; verify documented commands and generated paths match the repository.

## 5. Acceptance and delivery

- [x] 5.1 Run architecture checks, lint, production build, static checks, strict OpenSpec validation, and `git diff --check`; verify all commands exit successfully and generated documents retain one main/H1 plus the loader/Suspense exclusions.
- [x] 5.2 Run interaction and geometry browser regression for the home, AI service, case detail, and article at representative phone/tablet/desktop widths, with JavaScript disabled, normal hydration, reduced motion, navigation, mobile menu, FAQ, and enquiry lifecycle; verify no change-owned regression or console error.
- [x] 5.3 Record three valid Lighthouse 13.5 mobile runs per representative route; verify no run-level error, all four scored categories remain 100, the declared JS/CSS budgets pass, and extension/hosting-controlled findings are reported separately.
- [x] 5.4 Obtain independent review focused on hydration boundaries, static CSS completeness, budget correctness, and measurement provenance; resolve reproducible blockers and re-run affected gates.
- [x] 5.5 Commit and push the verified implementation, bind CI/deployment evidence to the exact remote SHA, read back production home and nested routes, rerun representative production Lighthouse, and archive the OpenSpec change only after every acceptance criterion is evidenced.
