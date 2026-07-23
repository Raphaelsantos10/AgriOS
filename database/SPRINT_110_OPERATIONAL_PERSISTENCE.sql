-- FARPHA Sprint 110 — persistência operacional real
-- Execute integralmente no SQL Editor do Supabase. Pode ser repetido.

do $$ begin
  create type public.work_order_status as enum ('draft','planned','in_progress','completed','cancelled');
exception when duplicate_object then null; end $$;
do $$ begin
  create type public.work_order_priority as enum ('low','medium','high','critical');
exception when duplicate_object then null; end $$;

create table if not exists public.work_orders (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid default auth.uid(), client_reference text,
  farm_id uuid, field_id uuid, farm_name text, field_name text,
  title text not null, operation_type text not null, crop text,
  priority public.work_order_priority not null default 'medium',
  status public.work_order_status not null default 'draft',
  assigned_to text, scheduled_date date, completed_date timestamptz,
  estimated_cost numeric(12,2) not null default 0, actual_cost numeric(12,2),
  notes text, created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.work_orders add column if not exists owner_id uuid;
alter table public.work_orders add column if not exists client_reference text;
alter table public.work_orders add column if not exists farm_name text;
alter table public.work_orders add column if not exists field_name text;
alter table public.work_orders alter column owner_id set default auth.uid();
create index if not exists work_orders_owner_id_idx on public.work_orders(owner_id);
create unique index if not exists work_orders_owner_client_reference_uidx
  on public.work_orders(owner_id,client_reference);

create table if not exists public.agricultural_costs (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid(), client_reference text,
  farm_id uuid, field_id uuid, farm_name text not null, field_name text,
  category text not null, description text not null, cost_date date not null,
  quantity numeric(14,3) not null check (quantity > 0),
  unit text not null, unit_cost numeric(14,2) not null check (unit_cost >= 0),
  notes text, created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
do $$ begin
  alter table public.agricultural_costs add constraint agricultural_costs_category_check
    check (category in ('labor','water','fuel','product','machine','other'));
exception when duplicate_object then null; end $$;
create index if not exists agricultural_costs_owner_id_idx on public.agricultural_costs(owner_id);
create unique index if not exists agricultural_costs_owner_client_reference_uidx
  on public.agricultural_costs(owner_id,client_reference);
create index if not exists agricultural_costs_date_idx on public.agricultural_costs(cost_date desc);

alter table public.work_orders enable row level security;
alter table public.agricultural_costs enable row level security;
drop policy if exists "Authenticated users can read work orders" on public.work_orders;
drop policy if exists "Authenticated users can create work orders" on public.work_orders;
drop policy if exists "Authenticated users can update work orders" on public.work_orders;
drop policy if exists "Authenticated users can delete work orders" on public.work_orders;
drop policy if exists work_orders_owner_all on public.work_orders;
create policy work_orders_owner_all on public.work_orders for all to authenticated
using ((select auth.uid())=owner_id) with check ((select auth.uid())=owner_id);
drop policy if exists agricultural_costs_owner_all on public.agricultural_costs;
create policy agricultural_costs_owner_all on public.agricultural_costs for all to authenticated
using ((select auth.uid())=owner_id) with check ((select auth.uid())=owner_id);
revoke all on public.work_orders from anon;
revoke all on public.agricultural_costs from anon;
grant select,insert,update,delete on public.work_orders to authenticated;
grant select,insert,update,delete on public.agricultural_costs to authenticated;
notify pgrst,'reload schema';

select relname as tabela, relrowsecurity as rls_ativo from pg_class
where relnamespace='public'::regnamespace
and relname in ('work_orders','agricultural_costs') order by relname;
