# Week 13 implementation prompt

Use the committed pre-code Packet. Preserve bounded Excel verification and existing private report storage. Make all unreviewed reports explicitly provisional in the API, UI and JSON export; do not sum advisory or simulated reasoning into a final score. Keep legacy restored reports provisional as well. Add an optional consented in-memory event log with allowlisted names, case/rubric/build versions, no account/file/explanation content and bounded feedback. Explain that it disappears on reload and download does not send it. Do not advertise operational review or completed research.

Acceptance: regression test must reproduce the original total bug and then pass; unsupported formulas remain pending; events and feedback contain no arbitrary metadata; lint, build and tests pass; browser walkthrough covers consent, download, evaluation, provisional results and feedback export. Record actual deployment IDs and outstanding Auth/RLS and human-research gates.

Operating change: private server analytics were planned, but the Supabase management query failed with database authentication. Implement an explicit in-memory export fallback instead of adding an unverified table. Researcher collects voluntarily shared exports and de-identified observation notes privately; no automatic collection exists.
