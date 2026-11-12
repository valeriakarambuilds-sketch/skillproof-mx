# Week 14 - mechanical test and deployment evidence

Run date: 12 November 2026. Base: dc86a9c. All calculator values and persona data are fictional/illustrative.

## Before-code evidence
Remote ce81d99f5f0b83a011e322c887222e6caf63af49 committed the Packet and image-generated mockup before the model and UI commits. d9342d2eeb81e00dbfae2efe1d0f9b5589ee7380 added the tested model. 2abded3b591ef3b0a1ae31c6ffdcbda1dec7f71d added the first working pages. Direct terminal push lacked credentials; the connected GitHub API preserved this order in the remote branch.

## Deployment A
Project skillproof-mx, production, commit 2abded3b591ef3b0a1ae31c6ffdcbda1dec7f71d.
ID: dpl_FP9oJp5LN9mW546CatRZGbenLnda.
URL: https://skillproof-ofpojus5o-valeriakarambuilds-2805s-projects.vercel.app . READY; canonical skillproof-mx.vercel.app assigned.
Anonymous HTTP: /pricing 200; /about 200; /api/reports 401 with sign-in-required error. Browser opened canonical /pricing without a login wall. Deployment-specific URLs may be protected; hand in the canonical domain.

## Mechanical checks observed
- Initial model suite: 21 passed. Full suite before correction: 33 passed. Production build generated /, /pricing, /about and existing API routes.
- Default output: 10 expected payers, 10 vacancies/month, MXN 1,800 gross, MXN 21,600 annualized, unit cost160, contribution200.
- Browser: changed frequency to0.25 -> gross450, annualized5400, variable cost400, contribution50. Saved scenario, reloaded, list persisted, clicked Load -> frequency0.25 and corresponding outputs restored. This is developer-observed browser behavior, not persona interaction evidence.
- Browser: conversion101 -> clear range error, output removed and Save disabled. Returned to valid input -> output returned.
- Automated boundaries: blank, whitespace, negative, Infinity, NaN, conversion>100, fractional company counts, zero users/conversion/price, negative contribution, 100% conversion, invalid JSON/version, duplicate IDs and >10 snapshots.

## Real observed bug - coercion of stored values
Expected: stored snapshots contain numbers only; tampered local JSON with frequency as string "0.25" is rejected.
Observed: shared input validator coerced numeric strings from storage, so the numeric-only storage contract was not enforced.
Regression test added BEFORE fix: `npm test -- src/lib/pricing.test.ts` -> 1 failed,21 passed, assertion "expected [Function] to throw an error".
Fix: check each stored field's primitive type is number before general range validation. Interactive form strings still validate correctly.
Retest: full suite ->34 passed. Production build passed after fix. This was not an intentionally inserted defect.

## Persona-driven corrections
Fresh-context synthetic Lucia reviewed actual local screenshots; no real participant claim. Main confusion: modeled human effort could imply staffed review. The pricing card and memo now identify the employer as reviewer; simulator explains provider economics and modeled future labor. Saved cards now show frequency and expand all assumptions; a persistent result label identifies loaded vs unsaved state. Memo brings 10:1 benefit/price and2.17x total-cost ratios together. See PERSONA_Valeria_Week14.md for exact synthetic utterances and remaining limits.

## Environment and dependency correction
Managed preview supplied --host and --strictPort to Next, which rejected them. A tiny dev launcher translates --host to --hostname and removes --strictPort. Preview then started at http://127.0.0.1:4173/.
Production dependency audit identified one low-severity fast-xml-parser issue (GHSA-474x-hrwr-fgx4). Updated within its existing compatible range; full assessment/API/pricing tests still passed. Final audit result is recorded at Session Close.

## Security evidence
No new secrets or personal-data tables. Tracked-source pattern scan found no supported secret-pattern hits (not a full historical secret audit). Existing server verifies Supabase getUser before private data access. Live SQL metadata query confirmed skillproof_reports RLS enabled and SELECT/INSERT/DELETE ownership predicates auth.uid()=user_id for authenticated role. No customer rows were queried or changed. Anonymous live reports request returned401. Two actual Google browser accounts were not retested this session; do not represent metadata inspection as that test.

## Remaining human validation
Week13 full stranger/session ledger, independent uncoached correction retest and genuine voluntary return remain pending. The professor's9/10 feedback is preserved in the Packet. Technical recovery and synthetic comprehension do not close these human-evidence gaps.

## Deployment B and final canonical browser verification
Commit f45d32654be7a242bb67bce77a891ae523e3772d. Deployment dpl_EWFXJ56XWXQCU19Augv654RACXCv, production, READY. URL: https://skillproof-jfhm6pg5g-valeriakarambuilds-2805s-projects.vercel.app ; canonical https://skillproof-mx.vercel.app/pricing assigned. Final production audit:0 vulnerabilities; full tests34 passed; build passed.

Signed-out browser on canonical domain displayed the corrected reviewer ownership and numeric labor helper. Set frequency0.25, saved, reloaded, loaded scenario1:450 gross and50 contribution returned. Deleted that disposable test scenario; empty list and deletion confirmation appeared. Opened /about and observed both ratio panels. Opened / and confirmed the preserved two-part delivery instructions, Google sign-in gate and send button. No Google sign-in or real user submission was performed. Final public screenshots are separate from local persona screenshots. Mobile CSS was implemented but an actual mobile viewport was not independently exercised in this session.

Local browser evidence is a developer check, not evidence of a returning human participant. Real Week13 validation remains pending. The demo MP4 still requires Valeria's recording; an English3-minute+30-second script is in docs/DEMO_SCRIPT_Valeria_Week14.md.
