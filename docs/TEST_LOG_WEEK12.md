# Week 12 — actual validation log

## Mechanical pass — local
Reproduced: gradeCells({B11:{value:0.2,formula:"=1+1"}}) awarded 2.5 traceability points before the fix. The added regression test failed with expected 0, received 2.5.
Fix: bounded arithmetic recalculation without eval, recursive references, original-source checks and explicit three-state evidence. Cached numeric values no longer override supported formulas. Unsupported formulas remain pending. Correct hardcoded numbers receive accuracy only.
Retest: 9 Vitest cases passed. TypeScript and Next.js production build passed. A final build is run again after the persona wording fix.
An additional parser issue surfaced during the fix: OOXML numeric cells marked t="n" were excluded. Numeric cell handling was corrected and the template-read regression passed.

## Browser and production limitation
Managed preview failed before startup: its launcher appended Vite-style --host and --strictPort arguments, which Next.js does not accept. No live browser screenshots, clicks, mobile checks or production deployments were completed. The app was not altered to work around the preview infrastructure.

## Persona design review — preliminary only
A fresh synthetic-user agent reviewed the generated mockup as Sofia, 23, recent Mexican graduate with basic Excel who fears permanent AI rejection. She did not operate a live app.
Observed: red Contradictorio seemed like permanent rejection; Pendiente did not explain whether to wait or act; retry did not clarify correcting and reuploading; human review seemed promised but unassigned.
Worst confusion: whether a red finding was a correctable workbook issue or a permanent judgment about her.
Fix: prominent result notice says the report evaluates the file and does not decide hiring, explains pending evidence and absence of automatic review requests, and renames retry to Corregir y volver a subir mi Excel. Unsupported five-day review promise removed.
Retest: wording reviewed against the reported confusion; live screenshot walkthrough remains pending and is not claimed as complete.

## Still required
Configured Supabase OAuth/RLS A-B account tests, real-domain checks, 2 actual Vercel deployments, fresh-chat persona test on live screenshots and demo recording.

Dependency maintenance: upgraded inherited Next.js to 16.4.3 and Vitest to 5.0.5 after audit findings. Nine tests and the production compilation passed on the updated dependency tree. Live verification remains pending.

Final npm audit: 0 vulnerabilities across production and development dependencies. No production deploy or authenticated browser test is implied by this result.
