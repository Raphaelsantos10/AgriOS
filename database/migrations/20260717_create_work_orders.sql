create type public.work_order_status as enum ('draft', 'planned', 'in_progress', 'completed', 'cancelled');
create type public.work_order_priority as enum ('low', 'medium', 'high', 'critical');

create table if not exists public.work_orders (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid references public.farms(id) on delete cascade,
  field_id uuid references public.fields(id) on delete set null,
  title text not null,
  operation_type text not null,
  crop text,
  priority public.work_order_priority not null default 'medium',
  status public.work_order_status not null default 'draft',
  assigned_to text,
  scheduled_date date,
  completed_date timestamptz,
  estimated_cost numeric(12,2) not null default 0,
  actual_cost numeric(12,2),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists work_orders_farm_id_idx on public.work_orders(farm_id);
create index if not exists work_orders_field_id_idx on public.work_orders(field_id);
create index if not exists work_orders_status_idx on public.work_orders(status);
create index if not exists work_orders_scheduled_date_idx on public.work_orders(scheduled_date);

alter table public.work_orders enable row level security;

create policy "Authenticated users can read work orders" on public.work_orders for select to authenticated using (true);
create policy "Authenticated users can create work orders" on public.work_orders for insert to authenticated with check (true);
create policy "Authenticated users can update work orders" on public.work_orders for update to authenticated using (true) with check (true);
create policy "Authenticated users can delete work orders" on public.work_orders for delete to authenticated using (true);
