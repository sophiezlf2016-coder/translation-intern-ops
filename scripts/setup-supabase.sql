-- 在 Supabase SQL Editor 中执行此脚本，然后运行 ./scripts/setup-cloud-sync.sh

create table if not exists public.workspaces (
  id text primary key,
  verifier jsonb,
  vault jsonb,
  updated_at timestamptz not null default now()
);

alter table public.workspaces enable row level security;

drop policy if exists "workspaces_anon_all" on public.workspaces;
create policy "workspaces_anon_all"
  on public.workspaces
  for all
  to anon, authenticated
  using (true)
  with check (true);
