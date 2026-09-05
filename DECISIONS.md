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
- Migrated Gemini text scoring to the current Interactions API with a required JSON schema, `store: false`, and the configured `gemini-3.8-flash` model.
