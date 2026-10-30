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

## Live continuation after account connections
- Supabase semestre restored to ACTIVE_HEALTHY; created only public.skillproof_reports, with RLS and SELECT/INSERT/DELETE ownership policies. Existing public.test left unchanged.
- Transactional database test: fictional A/B users saw only their own report; B could not insert or delete an A-owned row; anonymous reads denied. All fixture rows and auth records rolled back. This tests database policy enforcement, not Google OAuth.
- Configured Supabase public URL and publishable key as Vercel environment variables for preview and production; no service-role key used.
- Deployment before env configuration: dpl_4wguwwjTaY4fB7NqPYFyo3kC6Fhf, READY, commit 2d9b6dc56844eea2b6b912b4a19828a1cdd378bf.
- Deployment after configuration: dpl_12FX9QLnaFcoWENoNYdRL8y13dvW, READY, same source and updated environment.
- Browser confirmed the UI loads and the Google button navigates to an unsupported-provider error. Public Supabase settings confirm external.google=false.
- Fix: preflight provider availability and show an in-page error preserving the task rather than sending the candidate to a raw JSON error page. Retest and redeploy follow this commit.
- Google OAuth client ID/secret and redirect allowlist still require account configuration. No successful OAuth or authenticated save/reload was claimed.
- Owner confirmed no custom domain is currently owned; the real-domain milestone remains pending. No purchase or protection change performed.
