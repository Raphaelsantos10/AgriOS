-- FARPHA / AgriOS — Sprint 10.8 Centro de Missões
create extension if not exists pgcrypto;

create table if not exists public.missions (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  field_id uuid references public.fields(id) on delete set null,
  title text not null,
  description text,
  priority text not null default 'medium' check (priority in ('low','medium','high','critical')),
  status text not null default 'new' check (status in ('new','in_progress','paused','completed','cancelled')),
  assigned_to text,
  start_date timestamptz,
  end_date timestamptz,
  completed_at timestamptz,
  latitude numeric,
  longitude numeric,
  notes text,
  checklist jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists missions_farm_id_idx on public.missions(farm_id);
create index if not exists missions_field_id_idx on public.missions(field_id);
create index if not exists missions_status_idx on public.missions(status);
create index if not exists missions_priority_idx on public.missions(priority);
create index if not exists missions_start_date_idx on public.missions(start_date);

alter table public.missions enable row level security;

drop policy if exists "Permitir leitura missions" on public.missions;
drop policy if exists "Permitir criar missions" on public.missions;
drop policy if exists "Permitir atualizar missions" on public.missions;
drop policy if exists "Permitir apagar missions" on public.missions;

create policy "Permitir leitura missions" on public.missions for select to anon, authenticated using (true);
create policy "Permitir criar missions" on public.missions for insert to anon, authenticated with check (true);
create policy "Permitir atualizar missions" on public.missions for update to anon, authenticated using (true) with check (true);
create policy "Permitir apagar missions" on public.missions for delete to anon, authenticated using (true);

grant select, insert, update, delete on public.missions to anon, authenticated;
notify pgrst, 'reload schema';
