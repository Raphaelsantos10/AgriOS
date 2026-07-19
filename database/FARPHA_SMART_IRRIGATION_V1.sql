-- FARPHA Smart Irrigation Engine V1
create extension if not exists pgcrypto;

create table if not exists public.irrigation_systems (
  id uuid primary key default gen_random_uuid(),
  field_id uuid not null unique references public.fields(id) on delete cascade,
  farm_id uuid not null references public.farms(id) on delete cascade,
  name text not null default 'Sistema principal',
  method text not null default 'drip' check (method in ('drip','sprinkler','micro_sprinkler','pivot','furrow','manual','other')),
  water_source text not null default 'well' check (water_source in ('well','spring','reservoir','pond','network','river','other')),
  flow_l_min numeric,
  pressure_bar numeric,
  reservoir_capacity_m3 numeric,
  reservoir_level_percent numeric check (reservoir_level_percent is null or (reservoir_level_percent between 0 and 100)),
  efficiency_percent numeric not null default 90 check (efficiency_percent between 1 and 100),
  active boolean not null default true,
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.irrigation_events (
  id uuid primary key default gen_random_uuid(),
  system_id uuid not null references public.irrigation_systems(id) on delete cascade,
  field_id uuid not null references public.fields(id) on delete cascade,
  farm_id uuid not null references public.farms(id) on delete cascade,
  started_at timestamptz not null default now(),
  duration_minutes integer not null check (duration_minutes > 0),
  volume_m3 numeric not null default 0 check (volume_m3 >= 0),
  source text not null default 'manual' check (source in ('manual','scheduled','recommendation')),
  notes text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists irrigation_systems_farm_idx on public.irrigation_systems(farm_id);
create index if not exists irrigation_events_field_started_idx on public.irrigation_events(field_id, started_at desc);

alter table public.irrigation_systems enable row level security;
alter table public.irrigation_events enable row level security;

-- Políticas abertas apenas para a fase de desenvolvimento.
drop policy if exists "irrigation systems dev select" on public.irrigation_systems;
drop policy if exists "irrigation systems dev insert" on public.irrigation_systems;
drop policy if exists "irrigation systems dev update" on public.irrigation_systems;
drop policy if exists "irrigation systems dev delete" on public.irrigation_systems;
create policy "irrigation systems dev select" on public.irrigation_systems for select to anon, authenticated using (true);
create policy "irrigation systems dev insert" on public.irrigation_systems for insert to anon, authenticated with check (true);
create policy "irrigation systems dev update" on public.irrigation_systems for update to anon, authenticated using (true) with check (true);
create policy "irrigation systems dev delete" on public.irrigation_systems for delete to anon, authenticated using (true);

drop policy if exists "irrigation events dev select" on public.irrigation_events;
drop policy if exists "irrigation events dev insert" on public.irrigation_events;
drop policy if exists "irrigation events dev update" on public.irrigation_events;
drop policy if exists "irrigation events dev delete" on public.irrigation_events;
create policy "irrigation events dev select" on public.irrigation_events for select to anon, authenticated using (true);
create policy "irrigation events dev insert" on public.irrigation_events for insert to anon, authenticated with check (true);
create policy "irrigation events dev update" on public.irrigation_events for update to anon, authenticated using (true) with check (true);
create policy "irrigation events dev delete" on public.irrigation_events for delete to anon, authenticated using (true);

grant select, insert, update, delete on public.irrigation_systems to anon, authenticated;
grant select, insert, update, delete on public.irrigation_events to anon, authenticated;
notify pgrst, 'reload schema';
