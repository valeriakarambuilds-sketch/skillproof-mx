# Week 12 technical evidence

Verified 30 October 2026.

Repository: https://github.com/valeriakarambuilds-sketch/skillproof-mx/tree/week12-core

## Five substantive Week 12 commits

- [5196eff](https://github.com/valeriakarambuilds-sketch/skillproof-mx/commit/5196eff1358db2d481e26c550e9622d232fd3758): docs: establish Week 12 charter and packet before core changes
- [662395b](https://github.com/valeriakarambuilds-sketch/skillproof-mx/commit/662395bd7a5b21241413325900034f0bab34fbac): test: reproduce false traceability credit for unrelated formula
- [adde44e](https://github.com/valeriakarambuilds-sketch/skillproof-mx/commit/adde44e6a72874bba0bca675ad0256612c6f9b5f): fix: verify supported formulas and expose cell evidence states
- [ea26e24](https://github.com/valeriakarambuilds-sketch/skillproof-mx/commit/ea26e246596c43fa253dfb7426ef9118b56ed133): feat: add evidence export Google auth private reports and Tailwind
- [c344ccc](https://github.com/valeriakarambuilds-sketch/skillproof-mx/commit/c344cccdfdfe79917a313de1a95ff1f6575028a4): fix: clarify simulated feedback and retries after live persona walkthrough

## Two actual READY preview deployments

- [dpl_12FX9QLnaFcoWENoNYdRL8y13dvW](https://vercel.com/valeriakarambuilds-2805s-projects/skillproof-mx/12FX9QLnaFcoWENoNYdRL8y13dvW): READY; commit `2d9b6dc56844eea2b6b912b4a19828a1cdd378bf`. URL: https://skillproof-8ns7yr8xb-valeriakarambuilds-2805s-projects.vercel.app
- [dpl_EvTKFNyUKeyTqNG1kUxJ8QNdhKLd](https://vercel.com/valeriakarambuilds-2805s-projects/skillproof-mx/EvTKFNyUKeyTqNG1kUxJ8QNdhKLd): READY; commit `c344cccdfdfe79917a313de1a95ff1f6575028a4`. URL: https://skillproof-fsejoyi1l-valeriakarambuilds-2805s-projects.vercel.app

These are preview deployments and may require Vercel access. They do not establish public owned-domain availability.

## Cross-user isolation

See [SQL](evidence/RLS_AB_TEST.sql) and [returned result](evidence/RLS_AB_RESULT.json). The test ran against public.skillproof_reports in the owner-selected semestre project. Temporary synthetic A/B auth records and report rows existed only within BEGIN/ROLLBACK. Reads ran as authenticated with distinct request.jwt.claim.sub values, not as the administrator role.

| Check | Expected rows | Actual rows | Result |
|---|---:|---:|---|
| A reads A | 1 | 1 | PASS |
| A reads B by known report ID | 0 | 0 | PASS |
| B reads B | 1 | 1 | PASS |
| B reads A by known report ID | 0 | 0 | PASS |
| B list filtered for A owner | 0 | 0 | PASS |

This is direct database RLS evidence, not two real Google logins or a browser-to-API token test. It is stronger than recovering only your own report, but that remaining end-to-end test should be recorded separately.

## Session close and next first move

See [DECISIONS.md](../DECISIONS.md). Next: test the API with two separate Google-authenticated browser sessions and record B being unable to obtain A data, then complete owned-domain/public access verification and production promotion.
