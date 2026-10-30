# Week 12 - Verified status addendum
30 October 2026. This addendum updates the historical plan without rewriting what was known before implementation. It is a factual evidence update, not an invented chat transcript or proof that every course condition is complete.

## Packet-before-code evidence
Commit 5196eff1358db2d481e26c550e9622d232fd3758 added docs/CHARTER.md, docs/PACKET.md, docs/BUILD_PROMPT.md and the archived Week 4 packet. The verified GitHub diff contains only these four documentation files. Its parent is 543540781f838f2c97e393799cb10d668afdb508. The later regression-test commit is 662395bd7a5b21241413325900034f0bab34fbac; evaluator implementation followed in adde44e6a72874bba0bca675ad0256612c6f9b5f. This proves the committed sequence, not unrecorded offline activity.
https://github.com/valeriakarambuilds-sketch/skillproof-mx/commit/5196eff1358db2d481e26c550e9622d232fd3758

## Researched benchmark update
The selected benchmark is TestGorilla's Microsoft Excel (General) assessment. Its official page describes spreadsheet-data management, formulas and functions, with financial analysts among intended roles. It is a relevant established comparison; global superiority is not established.
SkillProof MX narrows the task to Spanish-language, fictional MXN financial workbooks with inspectable cell/formula evidence, explicit uncertainty and retries under human hiring judgment. This describes our design; it does not assert TestGorilla lacks those capabilities.
Source checked 30 October 2026: https://www.testgorilla.com/test-library/software-skills-tests/microsoft-excel-skills-test/
The original Financial Modeling in Excel page could not be retrieved. This verified page replaces the earlier unverified benchmark reference for the current comparison. No head-to-head performance or 10:1 advantage is demonstrated.

## Implementation and live evidence
The repository contains Next.js/React, Tailwind, Supabase browser/server clients, an evaluation route, a private-report retrieval route, schema/RLS policies, validation and the lockfile. Preview deployment and owner-run reports support implemented functionality; a stack table alone is not the evidence.
The author reported Google sign-in and latest-report recovery. Exported reports support saved=true and the correct/error/correction sequence 86 -> 80 -> 86. The 26 explanation points were simulated, explicitly labeled. This is not a validated assessment of reasoning or hiring suitability.
The intentional =1+1 input is a negative-input test, not an application bug. The reproduced application bugs were false formula traceability with cached results, provider-disabled navigation, and contradictory generic explanation feedback. The persona feedback bug was fixed and its changed wording was seen in later screenshots.

## GitHub and five substantive commits
Repository and implementation branch:
https://github.com/valeriakarambuilds-sketch/skillproof-mx/tree/week12-core
1. 5196eff1358db2d481e26c550e9622d232fd3758 - charter and packet before core changes.
2. 662395bd7a5b21241413325900034f0bab34fbac - regression reproducing false traceability.
3. adde44e6a72874bba0bca675ad0256612c6f9b5f - verify supported formulas and evidence states.
4. ea26e246596c43fa253dfb7426ef9118b56ed133 - Google auth, private reports, export and Tailwind.
5. c344cccdfdfe79917a313de1a95ff1f6575028a4 - persona-driven simulation and retry correction.
Individual commit URLs and the test evidence are collected here:
https://github.com/valeriakarambuilds-sketch/skillproof-mx/blob/week12-core/docs/TECHNICAL_EVIDENCE_WEEK12.md

## Two identified READY deployments
Deployment 1: dpl_12FX9QLnaFcoWENoNYdRL8y13dvW, commit 2d9b6dc56844eea2b6b912b4a19828a1cdd378bf.
https://vercel.com/valeriakarambuilds-2805s-projects/skillproof-mx/12FX9QLnaFcoWENoNYdRL8y13dvW
Deployment 2: dpl_EvTKFNyUKeyTqNG1kUxJ8QNdhKLd, commit c344cccdfdfe79917a313de1a95ff1f6575028a4.
https://vercel.com/valeriakarambuilds-2805s-projects/skillproof-mx/EvTKFNyUKeyTqNG1kUxJ8QNdhKLd
Both are real preview deployments verified READY, not proof of a public owned-domain deployment. Vercel protection may require authorization. The second contains the persona-driven feedback correction.

## Cross-user isolation - actual database test
Executed against public.skillproof_reports in the owner-selected semestre project using synthetic A/B auth records and report rows inside BEGIN/ROLLBACK. Read statements ran as authenticated with separate request.jwt.claim.sub identities, not with administrator privileges. No real personal data was used or returned.
A reads own report: expected 1, actual 1, PASS.
A reads B report by known ID: expected 0, actual 0, PASS.
B reads own report: expected 1, actual 1, PASS.
B reads A report by known ID: expected 0, actual 0, PASS.
B listing rows owned by A: expected 0, actual 0, PASS.
All fixture changes were rolled back. Own-report recovery was not used as proof of isolation. This proves RLS behavior at the database layer; a two-Google-session browser/API test remains unperformed.
SQL: https://github.com/valeriakarambuilds-sketch/skillproof-mx/blob/week12-core/docs/evidence/RLS_AB_TEST.sql
Returned output: https://github.com/valeriakarambuilds-sketch/skillproof-mx/blob/week12-core/docs/evidence/RLS_AB_RESULT.json

## Blueprint and shadow clause review
The supplied BLUEPRINT_team(1).pdf was read in full. Valeria's assigned core is evidence comparison linked to cells/formulas with verified, contradictory and pending states. That bounded core is implemented; human interpretation is retained.
Shadow clause: the score must not become an unchallengeable identity. Correction/retry, visible scope and no automated hiring support this condition. Remaining concern: the start screen's 70-point advance wording conflicts with the result's non-hiring disclaimer. Earlier reports remain privately stored; latest-report display is not deletion of history.
Blueprint conditions also require facts/assumptions/unknowns/simulations to be distinguished, human accountability and total-effort/cost/quality comparison against manual and simple alternatives. Simulation labeling is present; a real reviewer, payer, budget authority, operational capacity and 10:1 benefit remain unvalidated. Do not make live service commitments.
The complete Crystal Ball Brief has not been supplied or verified. Its overriding conditions and the fifth founder's missing record cannot be certified from this build.

## Security and unresolved submission gates
An old OAuth secret appeared in a screenshot and was withheld in the transcript. A replacement was created and configured. Direct proof that the old secret is disabled/deleted was not retained; revocation must still be confirmed in Google. Do not infer a repository leak or assign a numeric penalty without evidence.
Google account MFA is an administrator setup requirement. The supplied assignment does not prohibit connected GitHub, Vercel or Supabase tools, synthetic users or labeled AI simulation.
No owned venture domain has been confirmed. A vercel.app preview does not satisfy the real-domain requirement. Verify domain ownership, DNS, HTTPS, public access without the owner's Vercel login, and Google callback before treating the live URL requirement as complete.
DEMO_Valeria.mp4 has not been recorded or provided. The 3-minute walkthrough plus 30-second mind-change reflection remains outstanding.

## Session close and next first move
DECISIONS.md records the test and limits:
https://github.com/valeriakarambuilds-sketch/skillproof-mx/blob/week12-core/DECISIONS.md
Next: supply actual access and retry screens for a complete ordered persona walkthrough; test two separate Google sessions through the API; confirm old-secret revocation; connect and test the owned domain; verify production; record the demo. Prioritize domain availability because the rubric explicitly makes it a submission gate.
The historical BUILDCHAT stops at the first PERSONA delivery, as requested. This later addendum documents subsequent technical work; it is not a verbatim transcript of that later work. If the rubric requires the full development exchange, export and append the genuine continuation rather than claiming the earlier cutoff is complete.
Final verdict: substantial implementation and evidence are present, but complete course compliance is not established. The remaining gates are explicitly disclosed above.
