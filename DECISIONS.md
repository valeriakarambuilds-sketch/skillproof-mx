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


## Week 15 — Distribution kickoff

- Follow the Fusion decision: focus on the finance reviewer after files arrive and demonstrate a pasted EBITDA, a direct formula and a formula through an intermediate sheet with the same result.
- Treat the two valid formulas equally. Route an incomplete trace to manual Excel review with score and eligibility preserved pending review.
- The first outreach test proposes carousel plus screen recording via individual email. Treat the CTA response as interest. Any time-savings test must include upload and manual Excel review.
- Next move: verify the Week 13 source evidence and build three synthetic fixtures from the existing financial case. Generate the design mockup, verify cell trails in Excel, and test the signed-out demo and CTA before outreach.
- Keep the original build exchange complete. Run an independent fresh-state candidate regression and a fresh synthetic reviewer walkthrough. Record real outreach behavior only after it occurs.
