# SkillProof MX - Week14 pricing slice

Public product: https://skillproof-mx.vercel.app

- Pricing and saved scenarios: https://skillproof-mx.vercel.app/pricing
- One-page10:1 memo: https://skillproof-mx.vercel.app/about
- Existing assessment: https://skillproof-mx.vercel.app/

This branch extends published Week13 dc86a9c. Candidates remain free. The employer offer is a provisional MXN180 per vacancy,20 assessments,30 days; no active billing or assigned reviewer. The public numeric calculator models service revenue/contribution and saves bounded numeric snapshots only in the current browser.

## Build and test

```sh
npm ci
npm test
npm run build
npm run dev
```

The development launcher also supports managed-preview host/port arguments. No credentials belong in the repo. Existing private reports use Supabase Google Auth and owner RLS. Scenarios introduce no personal-data storage or new table.

## Week14 evidence

- [Packet before code](docs/PACKET.md), [implementation prompt](docs/BUILD_PROMPT_WEEK14.md).
- [Mechanical tests and deployment IDs](docs/TEST_LOG_WEEK14.md).
- [Synthetic persona log](docs/PERSONA_Valeria_Week14.md), [screenshots](docs/evidence/week14).
- [Development exchange](docs/BUILDCHAT_Valeria_Week14.md).
- [3:30 demo script](docs/DEMO_SCRIPT_Valeria_Week14.md).
- [Session Close and next move](DECISIONS.md).

34 tests passed; two production deployments READY. The observed stored-value coercion defect was fixed after a failing regression test. Persona confusion about staffed review was clarified and retested on screenshots. The ratios10:1 benefit/price and2.17x total-cost improvement use unmeasured assumptions; neither is a validated commercial claim.

## Remaining human work

Record the demo video. Complete the independent no-coaching Week13 retest with exact observations and the missing stranger/session evidence. A follow-up invitation is not a genuine voluntary return. Synthetic testing and technical persistence checks do not close these gaps.
