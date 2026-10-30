-- Execute in your own Supabase SQL editor. No service-role key is used.
create table if not exists public.skillproof_reports (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 created_at timestamptz not null default now(),
 payload jsonb not null check (jsonb_typeof(payload) = 'object' and octet_length(payload::text) <= 100000)
);
alter table public.skillproof_reports enable row level security;
revoke all on public.skillproof_reports from anon;
grant select, insert, delete on public.skillproof_reports to authenticated;
create policy skillproof_reports_select_own on public.skillproof_reports for select to authenticated using ((select auth.uid()) = user_id);
create policy skillproof_reports_insert_own on public.skillproof_reports for insert to authenticated with check ((select auth.uid()) = user_id);
create policy skillproof_reports_delete_own on public.skillproof_reports for delete to authenticated using ((select auth.uid()) = user_id);
create index if not exists skillproof_reports_user_created on public.skillproof_reports(user_id, created_at desc);
-- Updates intentionally not granted. Candidates see their latest report; old reports are private.
