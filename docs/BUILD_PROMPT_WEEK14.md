# Implementation prompt - Week 14

Extend SkillProof MX from published dc86a9c on week14-pricing. Read AGENTS.md and installed Next.js docs. Implement only after docs/PACKET.md and the generated mockup are committed.

Build small testable features:
1. One shared TypeScript configuration for offer scope, assumptions, baseline and disclosure. Pure bounded numeric calculator; gross, annualized run rate, labor/service costs and contribution with explicit units.
2. Public /pricing with Candidate Free, Vacancy Pilot MXN 180 per vacancy (20 evaluations, 30 days), and special adaptation quoted. Two employer segments, no monthly subscription, no active payment or staffed review claim.
3. Accessible numeric form, invalid-input clearing, live calculations, ten nonpersonal local numeric snapshots with load/delete, schema/version validation and storage-failure messages. No freeform scenario names.
4. Public /about containing one-page 10:1 memo, same baseline 20/10h/4h/300/180, gross value/price 10:1 vs total cost 2.17x distinction. Reported conditional payer interest is a paraphrase, not a sale.
5. Navigation on all three pages; scoped styles, mobile layout and print-friendly memo. Preserve Week 13 submission and protected report features.

Acceptance: default users100/conversion10/frequency1/price180 => 10 expected buyers, 10 vacancies, gross1800, annualized21600, variable160/unit, contribution200/month. Zero gross has no margin percentage. Empty values are invalid, not silently zero. Reject negative/nonfinite/too-large numbers and conversion>100. Stored snapshots are revalidated. Recovery after reload works. No checkout, personal-data storage or new auth tables.

Tests: meaningful arithmetic/boundary/corrupt-storage checks, existing suite, TypeScript and production build. Deploy first working slice; capture an actual bug, fix it and redeploy. Do not introduce deliberate defects to manufacture a test cycle. Log exact observations. Finish DECISIONS.md, next move, commit and push. At least five commits and two READY deployments. Persona must use actual screenshots in a fresh chat; do not substitute developer opinion for a completed persona study or independent human retest.
