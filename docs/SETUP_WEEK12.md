# Week 12 — connect and verify

## Required from the owner
- Existing GitHub repository URL and permission to update it.
- Existing Vercel project / account access.
- Real venture domain owned by you, with DNS control. A vercel.app address is not the Week 12 URL of record.
- Supabase project and Google OAuth provider configuration. Never paste secret keys in chat.
- Crystal Ball Brief: still needed to check any requirements that override the generic assignment.

## Local commands
npm ci
npm test
npm run build
npm run dev

## Supabase
Run supabase/schema.sql once in your project's SQL editor. Enable Google under Authentication → Providers using Google's client credentials in Supabase settings. Add your final HTTPS domain to Supabase's site URL and allowed redirect URLs; add localhost only for development. Configure Google's authorized callback URI from Supabase's own provider instructions.

Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in the Vercel environment. The anon/publishable client key is not a service-role secret; RLS is mandatory. This app uses no service-role key. Never place OAuth client secrets, database passwords or Gemini API keys in NEXT_PUBLIC variables.

GEMINI_API_KEY and GEMINI_MODEL are optional server-only settings for the inherited explanation feature. Without an available model the explanation is labeled simulated; the deterministic evidence report still works. A simulated total is not a verified hiring verdict.

## Vercel / domain
Import the existing GitHub repository, select Next.js, install with npm ci and build with npm run build. Add the venture's owned domain in Vercel, then apply the exact DNS records Vercel returns at your registrar. Do not invent records or change unrelated DNS. Update Supabase and Google redirect configuration for the final URL. Redeploy after adding build-time NEXT_PUBLIC variables.

## Required live checks
1 Sign in as invented test user A; upload fictional workbook; confirm saved message and retrieve after refresh.
2 Sign out; report disappears and API without token is denied.
3 Sign in as test user B; confirm A's report is unavailable. Attempt select/insert/delete with A's row ID using B's token; RLS must deny access.
4 Upload invalid and valid files; export a JSON report, retry corrected evidence.
5 Record deployment 1 URL/ID. Reproduce a real observed bug, fix and retest. Record deployment 2 URL/ID. The locally reproduced Week 12 formula bug is documented, but no production deployment is claimed.
6 Check the domain on mobile and desktop, HTTPS and Google sign-in.
7 Fresh-chat persona walks real screenshots of every stage; fix worst issue and retest. The provided preliminary mockup review does not replace this.

## Git history
The ZIP began without .git. The working checkout now has five substantive local commits. They are not GitHub pushes. The archive contains a git bundle so history is reviewable. Do not force-push over an existing repo. Integrate changes on a new branch, resolve differences with the existing source, push and use the real GitHub URL in submission.

## Session close
Use DECISIONS.md and docs/TEST_LOG_WEEK12.md. No credentials belong in the build transcript.
