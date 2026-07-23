create table if not exists public.field_history (
  id uuid primary key default gen_random_uuid(),
  field_id uuid null references public.fields(id) on delete set null,
  farm_id uuid not null references public.farms(id) on delete cascade,
  field_name text not null,
  crop text not null,
  area numeric not null default 0,
  status text not null check (status in ('healthy','attention','critical')),
  geometry jsonb null,
  change_type text not null check (change_type in ('CREATE','UPDATE','GEOMETRY','SPLIT','MERGE','DELETE','IMPORT','RESTORE')),
  change_note text null,
  created_by uuid null references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);
create index if not exists field_history_field_id_created_at_idx on public.field_history(field_id, created_at desc);
create index if not exists field_history_farm_id_created_at_idx on public.field_history(farm_id, created_at desc);

alter table public.field_history enable row level security;
create policy "dev field history select" on public.field_history for select using (true);
create policy "dev field history insert" on public.field_history for insert with check (true);
-- Antes de produção, substituir estas policies por regras baseadas em auth.uid() e user_id.
