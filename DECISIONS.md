# Decisions — SkillProof MX

## Session close — security and scaffold

- Built the packet before implementation and kept the slice focused on proof and re-entry, not tutoring.
- Removed `xlsx` after `npm audit` reported a high-severity vulnerability with no available fix.
- Tested `exceljs`, then removed it after its dependency tree reported vulnerabilities.
- Selected `fflate` + `fast-xml-parser` to read the minimum XLSX ZIP/XML structures needed by this slice. Final audit: 0 vulnerabilities.
- Files are limited to `.xlsx`, 2 MB, validated before parsing, processed in memory, and not persisted.
- Gemini runs only on the server. A missing or failed API call falls back to an explicitly labeled simulated result.
- Demo data is entirely fictional and denominated in MXN.

## Tomorrow's first move

Run the app locally, upload the completed fictional assessment, record the first mechanical-test result, then deploy version 1.

## Mechanical test decision

- After the first production deployment, a rubric-total mismatch was found: the interface promised 100 possible points while the API capped the result at 90.
- The explanation category now carries 40 points total, matching the visible 30-point interpretation/recommendation category plus 10-point clarity/limits category.
- The correction is documented in `docs/TEST_LOG.md` and will trigger the second production deployment.
- Use Gemini `generateContent` with a required JSON schema and the configured `gemini-3.8-flash` model because the free AI Studio key is not accepted by the Interactions endpoint.
- Persona testing prioritized clearer assessment directions: candidates now see the exact cell groups, know equivalent formulas are accepted, can replace or retry, and understand what “limitation” means.

## Week 12 session close
- Product charter and Week 12 packet committed before core modifications; Week 4 packet archived.
- Found and reproduced false formula-presence credit; replaced it with a bounded arithmetic checker and explicit evidence states.
- Kept unsupported formulas pending. No claim of full Excel support or proof of authorship.
- Added Tailwind, Supabase Google OAuth integration, server-verified bearer sessions, owner-scoped report persistence and RLS SQL. External account setup and isolation tests remain pending.
- Added JSON export and correction/reupload instructions; removed unsupported human-review SLA.
- Preliminary fresh-agent mockup review found fear of permanent rejection; prominent wording corrected. Real screenshot persona pass remains pending.
- Nine tests and production build passed before the final wording update; rerun final build before packaging.
- Managed browser preview failed due to launcher flags incompatible with Next.js; no browser QA or deployment was claimed.
- Local commits only: no existing remote was present in the ZIP. No push or deployment performed.

### Tomorrow's first move
Obtain the actual GitHub repo URL, owned venture domain and account configuration/access for Vercel and Supabase. Integrate on a new branch without force-pushing, configure OAuth/RLS, run A/B isolation tests, then perform and document two actual deployments plus a live screenshot persona retest. Check the overriding Crystal Ball Brief before declaring the milestone complete.

Dependency maintenance: upgraded inherited Next.js to 16.4.3 and Vitest to 5.0.5 after audit findings. Nine tests and the production compilation passed on the updated dependency tree. Live verification remains pending.

Final npm audit: 0 vulnerabilities across production and development dependencies. No production deploy or authenticated browser test is implied by this result.

## Connected-account continuation
- GitHub repository confirmed: valeriakarambuilds-sketch/skillproof-mx. Published six commits to week12-core and opened draft PR #1.
- The original ZIP source matches main; previous repository history is retained.
- Owner selected the paused Supabase project semestre for storage. Restore requested; wait for ACTIVE_HEALTHY before DDL.
- Use the dedicated skillproof_reports table to isolate this feature from existing semester tables.
- Added fictional completed and incorrect workbook fixtures; pinned supabase-js package version.
- Vercel project found, but its team grant is still denied (403). Team consent link supplied; no deployment claimed.

## Live connection session close
- Applied the skillproof_private_evidence_reports migration to the owner-selected semestre project; RLS isolation tests passed with complete rollback of invented fixtures.
- Published preview with Supabase environment configuration; existing Gemini environment variables preserved.
- Google is disabled in Supabase; do not replace the required Google flow with another auth method. Preserve the task with a contextual in-page error until the owner provides provider configuration through their dashboard.
- No custom domain is owned yet. Domain acquisition/assignment and Google credentials are the next external setup actions.
- Next first move: owner enables the Google provider and valid redirect URLs, then verify OAuth, upload, saved report recovery, export and full persona walkthrough before promoting to production.

### Verified final state of this continuation
Live preview retest passed after the provider-unavailable fix; deployment dpl_9RNknHpfVjeFTkGNwdznqQYx8eBS is READY. Database owner-isolation and anonymous-access checks passed with rolled-back fictional data. Google provider configuration and a custom domain remain blockers to the complete milestone. Owner requests step-by-step help creating a Google OAuth client; next move is create/select the SkillProof MX Google Cloud project, then OAuth consent and web client settings. No OAuth client secret should be put in chat or source.

## Session close — persona screenshot review, 2026-10-30
Google setup now completed by owner; successful upload, save, recovery and 86→80→86 correction cycle evidenced by exported reports and owner statements. Fresh synthetic screenshot review found contradictory generic simulated feedback. Clarify heuristic scoring and private retry history, move feedback upward, remove unsupported criticism. No real participant or browser persona clicks claimed. Next first move: verify deployed persona fix with fresh screenshots, then production/domain and final submission artifacts.

## Technical evidence close - 30 October 2026
- Verified remote Week 12 commit history and two READY Vercel preview deployments.
- Re-ran transactional synthetic A/B database RLS check. A own=1, A reading B=0, B own=1, B reading A by known ID=0, B listing A owner=0. All passed. Fixtures rolled back. SQL and returned results committed in docs/evidence.
- Scope: authenticated database role and distinct auth.uid claims, not two Google browser sessions. Do not equate own-report recovery with isolation.
- Next first move: two-session Google/API isolation verification, then owned-domain/public access check and production promotion.
