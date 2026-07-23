create table if not exists public.satellite_observations (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid references public.farms(id) on delete cascade,
  field_id uuid references public.fields(id) on delete cascade,
  provider text not null default 'sentinel-2',
  captured_at timestamptz not null,
  cloud_coverage numeric(5,2),
  vegetation_index text not null check (vegetation_index in ('ndvi','ndre','ndmi')),
  average_value numeric(6,4),
  minimum_value numeric(6,4),
  maximum_value numeric(6,4),
  raster_url text,
  thumbnail_url text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists satellite_observations_field_date_idx
  on public.satellite_observations(field_id, captured_at desc);

alter table public.satellite_observations enable row level security;
