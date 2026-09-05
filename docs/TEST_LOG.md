# Test Log — SkillProof MX

## Mechanical pass — September 5, 2026

**Environment:** First production deployment at `https://skillproof-mx.vercel.app/`.

**Test performed:** Compared every visible rubric category with the server-side scoring limits and verified that the total possible score equals 100.

**Bug found:** The interface promised 35 points for accuracy, 25 for traceability, 30 for interpretation/recommendation, and 10 for clarity/limits. The API combined the last two categories into a 30-point explanation score, so the real maximum was only 90/100.

**Fix:** Increased the explanation score ceiling to 40 and aligned both real and simulated AI criteria with the visible rubric. Updated the result breakdown and automated boundary test.

**Verification:** Automated tests pass, the production build succeeds, and `npm audit` reports 0 vulnerabilities.

**Redeployment:** Pending second production deployment after commit and push.

## LLM integration check

**Test performed:** Added the Gemini API key only through Vercel environment variables and submitted the fictional workbook plus a valid explanation.

**Issue found:** The fallback remained active because the app used the legacy content-generation call with a retired default model.

**Fix:** Migrated to the current Interactions API, required a structured JSON response, disabled server-side interaction storage, and retained the clearly labeled simulated fallback.
