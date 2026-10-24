-- Pega esto en Supabase > SQL Editor > Run
create table public.scores(
  id bigint generated always as identity primary key,
  game text not null check (game ~ '^[a-z0-9-]{1,30}$'),
  nick text not null check (nick ~ '^[A-Za-z0-9ÁÉÍÓÚÑáéíóúñ_-]{3,12}$'),
  p int not null check (p between 0 and 100000000),
  d int not null check (d between 0 and 10000000),
  t int not null check (t between 0 and 86400),
  created_at timestamptz not null default now()
);
create index on public.scores(game, p desc);
create index on public.scores(game, d desc);
create index on public.scores(game, t desc);
alter table public.scores enable row level security;
create policy "ver ranking" on public.scores for select to anon using (true);
create policy "enviar marca" on public.scores for insert to anon with check (true);
grant select, insert on public.scores to anon;
