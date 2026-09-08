-- Tabla de ranking para Tower Defense (Fase 6)
-- Pégalo en Supabase → SQL Editor → Run.

create table if not exists public.leaderboard (
  id bigint generated always as identity primary key,
  player_name text not null,
  score integer not null,
  created_at timestamptz not null default now()
);

create index if not exists leaderboard_score_desc_idx
  on public.leaderboard (score desc);

alter table public.leaderboard enable row level security;

drop policy if exists "Anyone can read leaderboard" on public.leaderboard;
create policy "Anyone can read leaderboard"
  on public.leaderboard
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Anyone can insert scores" on public.leaderboard;
create policy "Anyone can insert scores"
  on public.leaderboard
  for insert
  to anon, authenticated
  with check (
    char_length(player_name) between 1 and 32
    and score >= 0
  );

grant select, insert on table public.leaderboard to anon, authenticated;
