-- FARPHA Fire Intelligence V1
create extension if not exists pgcrypto;

create table if not exists public.fire_risk_assessments (
  id uuid primary key default gen_random_uuid(),
  field_id uuid not null references public.fields(id) on delete cascade,
  farm_id uuid not null references public.farms(id) on delete cascade,
  temperature_c numeric,
  humidity_percent numeric,
  wind_speed_kmh numeric,
  vegetation_dryness_percent numeric,
  fuel_load text not null default 'moderate' check (fuel_load in ('low','moderate','high','very_high')),
  nearby_fire_distance_km numeric,
  wind_toward_property boolean not null default false,
  risk_score integer not null check (risk_score between 0 and 100),
  risk_level text not null check (risk_level in ('low','moderate','high','very_high','extreme')),
  confidence integer not null default 0 check (confidence between 0 and 100),
  notes text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists fire_risk_assessments_field_created_idx
  on public.fire_risk_assessments (field_id, created_at desc);
create index if not exists fire_risk_assessments_farm_created_idx
  on public.fire_risk_assessments (farm_id, created_at desc);

alter table public.fire_risk_assessments enable row level security;

drop policy if exists "Permitir leitura fire assessments" on public.fire_risk_assessments;
drop policy if exists "Permitir criar fire assessments" on public.fire_risk_assessments;
drop policy if exists "Permitir apagar fire assessments" on public.fire_risk_assessments;

create policy "Permitir leitura fire assessments"
on public.fire_risk_assessments for select
to anon, authenticated using (true);

create policy "Permitir criar fire assessments"
on public.fire_risk_assessments for insert
to anon, authenticated with check (true);

create policy "Permitir apagar fire assessments"
on public.fire_risk_assessments for delete
to anon, authenticated using (true);

grant select, insert, delete on public.fire_risk_assessments to anon, authenticated;
notify pgrst, 'reload schema';
