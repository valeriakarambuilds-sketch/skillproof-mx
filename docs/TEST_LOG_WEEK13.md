# Week 13 technical verification — 5 November 2026

## Reproduced bug and correction

The evaluation endpoint exposed a total containing advisory/simulated reasoning without an explicit provisional review status. Added route regression with perfect numerical checks and simulated 40/40 reasoning. Before correction: test failed because `reviewStatus` was undefined. After correction: response has `reviewStatus: pending_human_review`, `total: null`, numerical subtotal 60 and separately labeled advisory reasoning. UI, restored legacy reports and exported reports remain provisional. No final human-review workflow or reviewer availability is claimed.

## Checks

- Vitest: 3 files, 12 tests passed, including existing calculation checks, provisional endpoint regression and pilot envelope/feedback validation.
- ESLint: passed after repairing existing package export paths, effect initialization and OOXML annotations.
- Production build: passed with Next.js 16.4.3, TypeScript and prerendering. One intermediate annotation failed type checking and was corrected before the final successful deployment.
- Live browser at https://skillproof-mx.vercel.app/: page renders; rubric requires complete human review; optional pilot starts with unchecked consent. Checking consent displays event count and feedback. Adding an explicitly fictional technical comment displays that it remains in this session and has not been sent. Download emitted an actual browser download. This was a developer check, not a real participant or synthetic-persona session.
- Full authenticated upload/save/reload and live A/B RLS were not reverified. Supabase management query against the app's public project reference returned database password authentication failure; no database schema or policy changes were made. Local browser launch was unavailable due to container process restrictions, so the public pilot UI was tested in the cloud browser instead. Endpoint regression uses mocks; it does not establish real AI or database availability.

## Actual production deployments

| Deployment | Commit | Result |
|---|---|---|
| dpl_81zZp6aLTRbsU3ZfnhLVNQ52AZwg | bbc030727b64023f9d408511f2db8fd755771da4 | READY; first provisional-result correction |
| dpl_EkYwjgpBzPyjTJjnu3We7bAsXevj | f2c2a0b0a5829a245cf3d490c139f3b43d65d275 | Superseded after local type-check failure; not counted as successful evidence |
| dpl_GGc9NF2381wX1X7bpycnNiiSHsAZ | 7d38705f1215b058e6f05d48eeffcb4e1d40b035 | READY; pilot events/feedback and type correction |

Final successful deployment aliases include skillproof-mx.vercel.app. An owned custom domain remains unconfirmed. Technical deploys do not satisfy the separate obligation to fix the highest observed real-user pain.

## Known limitations

Pilot data is opt-in, bounded, in browser memory only, and erased by reload or disabling consent. Feedback uses basic identifier checks and explicit user review; these cannot guarantee removal of all personal information. Participants decide whether to share downloads privately. The application has no automated research collector, return-case service or staffed human-review queue. New reports retain a numerical subtotal out of 60 that can be affected by pending checks; only check-level evidence establishes what was verified. Existing private report integration was preserved but not revalidated end to end.

No five-user sessions, exact research quotes, pain ranking, return signal, fresh-chat persona test or demonstration recording have been completed in this session. No 10:1 operating result is established.
