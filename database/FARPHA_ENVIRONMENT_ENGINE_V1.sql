-- FARPHA Environment Engine V1
create extension if not exists pgcrypto;

create table if not exists public.field_environment_profiles (
  id uuid primary key default gen_random_uuid(),
  field_id uuid not null unique references public.fields(id) on delete cascade,
  farm_id uuid not null references public.farms(id) on delete cascade,
  altitude_m numeric,
  slope_percent numeric check (slope_percent is null or (slope_percent >= 0 and slope_percent <= 200)),
  exposure text not null default 'unknown' check (exposure in ('N','NE','E','SE','S','SW','W','NW','flat','unknown')),
  soil_texture text not null default 'unknown' check (soil_texture in ('sandy','loamy_sand','loam','silt_loam','clay_loam','clay','unknown')),
  soil_ph numeric check (soil_ph is null or (soil_ph >= 0 and soil_ph <= 14)),
  organic_matter_percent numeric check (organic_matter_percent is null or (organic_matter_percent >= 0 and organic_matter_percent <= 100)),
  drainage text not null default 'unknown' check (drainage in ('poor','moderate','good','excellent','unknown')),
  water_available boolean not null default false,
  irrigation_type text not null default 'none' check (irrigation_type in ('none','drip','sprinkler','pivot','furrow','manual','other')),
  annual_rainfall_mm numeric check (annual_rainfall_mm is null or annual_rainfall_mm >= 0),
  average_humidity_percent numeric check (average_humidity_percent is null or (average_humidity_percent >= 0 and average_humidity_percent <= 100)),
  min_temperature_c numeric,
  max_temperature_c numeric,
  chill_hours numeric check (chill_hours is null or chill_hours >= 0),
  frost_risk text not null default 'unknown' check (frost_risk in ('low','moderate','high','very_high','unknown')),
  fire_risk text not null default 'unknown' check (fire_risk in ('low','moderate','high','very_high','unknown')),
  wind_exposure text not null default 'unknown' check (wind_exposure in ('low','moderate','high','very_high','unknown')),
  data_confidence integer not null default 5 check (data_confidence between 0 and 100),
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists field_environment_profiles_farm_idx on public.field_environment_profiles(farm_id);
create index if not exists field_environment_profiles_field_idx on public.field_environment_profiles(field_id);

create or replace function public.set_environment_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

drop trigger if exists field_environment_profiles_updated_at on public.field_environment_profiles;
create trigger field_environment_profiles_updated_at before update on public.field_environment_profiles for each row execute function public.set_environment_updated_at();

alter table public.field_environment_profiles enable row level security;
drop policy if exists "Permitir leitura field_environment_profiles" on public.field_environment_profiles;
drop policy if exists "Permitir inserir field_environment_profiles" on public.field_environment_profiles;
drop policy if exists "Permitir atualizar field_environment_profiles" on public.field_environment_profiles;
drop policy if exists "Permitir apagar field_environment_profiles" on public.field_environment_profiles;
create policy "Permitir leitura field_environment_profiles" on public.field_environment_profiles for select to anon, authenticated using (true);
create policy "Permitir inserir field_environment_profiles" on public.field_environment_profiles for insert to anon, authenticated with check (true);
create policy "Permitir atualizar field_environment_profiles" on public.field_environment_profiles for update to anon, authenticated using (true) with check (true);
create policy "Permitir apagar field_environment_profiles" on public.field_environment_profiles for delete to anon, authenticated using (true);
grant select, insert, update, delete on public.field_environment_profiles to anon, authenticated;
notify pgrst, 'reload schema';
