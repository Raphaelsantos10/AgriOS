-- FARPHA v2.1 Stable — sincronização segura da tabela field_history
-- Pode ser executado mais de uma vez.

begin;

create table if not exists public.field_history (
  id uuid primary key default gen_random_uuid(),
  field_id uuid null references public.fields(id) on delete set null,
  farm_id uuid not null references public.farms(id) on delete cascade,
  field_name text,
  crop text,
  area numeric,
  status text,
  geometry jsonb,
  change_type text,
  change_note text,
  created_by uuid null references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

-- Compatibilidade com versões antigas que usavam a coluna "name".
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='field_history' and column_name='name'
  ) and not exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='field_history' and column_name='field_name'
  ) then
    alter table public.field_history rename column name to field_name;
  end if;
end $$;

alter table public.field_history
  add column if not exists field_name text,
  add column if not exists crop text,
  add column if not exists area numeric,
  add column if not exists status text,
  add column if not exists geometry jsonb,
  add column if not exists change_type text,
  add column if not exists change_note text,
  add column if not exists created_by uuid,
  add column if not exists created_at timestamptz default now();

-- Se as duas colunas existirem, aproveita os dados antigos.
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='field_history' and column_name='name'
  ) then
    execute 'update public.field_history set field_name = coalesce(field_name, name) where field_name is null';
  end if;
end $$;

update public.field_history h
set
  field_name = coalesce(h.field_name, f.name, 'Talhão'),
  crop = coalesce(h.crop, f.crop, 'Não definida'),
  area = coalesce(h.area, f.area, 0),
  status = coalesce(h.status, f.status, 'healthy'),
  geometry = coalesce(h.geometry, f.geometry),
  change_type = coalesce(h.change_type, 'UPDATE'),
  created_at = coalesce(h.created_at, now())
from public.fields f
where h.field_id = f.id
  and (h.field_name is null or h.crop is null or h.area is null or h.status is null or h.change_type is null);

create index if not exists field_history_field_id_created_at_idx
  on public.field_history(field_id, created_at desc);
create index if not exists field_history_farm_id_created_at_idx
  on public.field_history(farm_id, created_at desc);

alter table public.field_history enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='field_history' and policyname='dev field history select') then
    create policy "dev field history select" on public.field_history for select using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='field_history' and policyname='dev field history insert') then
    create policy "dev field history insert" on public.field_history for insert with check (true);
  end if;
end $$;

-- Atualiza imediatamente o schema cache da API PostgREST.
notify pgrst, 'reload schema';

commit;
