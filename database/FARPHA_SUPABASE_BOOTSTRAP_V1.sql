-- FARPHA — Bootstrap seguro do Supabase
-- Execute no SQL Editor uma única vez. É idempotente.
create extension if not exists pgcrypto;

create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  role text not null default 'viewer' check (role in ('owner','manager','operator','viewer')),
  active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.handle_new_farpha_user() returns trigger
language plpgsql security definer set search_path = '' as $$ begin
  insert into public.user_profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', split_part(coalesce(new.email,''), '@', 1)))
  on conflict (id) do nothing; return new;
end; $$;
drop trigger if exists on_auth_user_created_farpha on auth.users;
create trigger on_auth_user_created_farpha after insert on auth.users for each row execute procedure public.handle_new_farpha_user();
insert into public.user_profiles (id, full_name)
select id, coalesce(raw_user_meta_data ->> 'full_name', split_part(coalesce(email,''), '@', 1)) from auth.users
on conflict (id) do nothing;

create table if not exists public.farms (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null,
  owner text not null default '',
  area numeric not null default 0 check (area >= 0),
  crop text not null default '',
  latitude numeric not null,
  longitude numeric not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.farms add column if not exists user_id uuid references auth.users(id) on delete cascade;
alter table public.farms alter column user_id set default auth.uid();

create table if not exists public.fields (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  name text not null,
  crop text not null default '',
  area numeric not null default 0 check (area >= 0),
  status text not null default 'healthy' check (status in ('healthy','attention','critical')),
  geometry jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.missions (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  field_id uuid references public.fields(id) on delete set null,
  title text not null, description text,
  priority text not null default 'medium' check (priority in ('low','medium','high','critical')),
  status text not null default 'new' check (status in ('new','in_progress','paused','completed','cancelled')),
  assigned_to text, start_date timestamptz, end_date timestamptz, completed_at timestamptz,
  latitude numeric, longitude numeric, notes text,
  checklist jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.billing_customers (
  user_id uuid primary key references auth.users(id) on delete cascade,
  stripe_customer_id text unique not null,
  created_at timestamptz not null default now()
);
create table if not exists public.subscriptions (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  stripe_customer_id text not null,
  stripe_subscription_id text unique not null,
  stripe_product_id text not null,
  stripe_price_id text not null,
  plan text not null check (plan in ('free','plus','pro','unknown')),
  status text not null,
  cancel_at_period_end boolean not null default false,
  current_period_end timestamptz,
  updated_at timestamptz not null default now()
);

alter table public.user_profiles enable row level security;
alter table public.farms enable row level security;
alter table public.fields enable row level security;
alter table public.missions enable row level security;
alter table public.billing_customers enable row level security;
alter table public.subscriptions enable row level security;

drop policy if exists profile_read_self on public.user_profiles;
create policy profile_read_self on public.user_profiles for select to authenticated using (id = auth.uid());
drop policy if exists profile_update_self on public.user_profiles;
create policy profile_update_self on public.user_profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

drop policy if exists farms_owner_all on public.farms;
create policy farms_owner_all on public.farms for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists fields_owner_all on public.fields;
create policy fields_owner_all on public.fields for all to authenticated
using (exists (select 1 from public.farms f where f.id = farm_id and f.user_id = auth.uid()))
with check (exists (select 1 from public.farms f where f.id = farm_id and f.user_id = auth.uid()));
drop policy if exists missions_owner_all on public.missions;
drop policy if exists "Permitir leitura missions" on public.missions;
drop policy if exists "Permitir criar missions" on public.missions;
drop policy if exists "Permitir atualizar missions" on public.missions;
drop policy if exists "Permitir apagar missions" on public.missions;
create policy missions_owner_all on public.missions for all to authenticated
using (exists (select 1 from public.farms f where f.id = farm_id and f.user_id = auth.uid()))
with check (exists (select 1 from public.farms f where f.id = farm_id and f.user_id = auth.uid()));
drop policy if exists billing_customer_read_self on public.billing_customers;
create policy billing_customer_read_self on public.billing_customers for select to authenticated using (user_id = auth.uid());
drop policy if exists subscription_read_self on public.subscriptions;
create policy subscription_read_self on public.subscriptions for select to authenticated using (user_id = auth.uid());

revoke all on public.user_profiles, public.farms, public.fields, public.missions from anon;
grant select on public.user_profiles to authenticated;
grant update (full_name) on public.user_profiles to authenticated;
grant select, insert, update, delete on public.farms, public.fields, public.missions to authenticated;
grant select on public.billing_customers, public.subscriptions to authenticated;

create index if not exists farms_user_id_idx on public.farms(user_id);
create index if not exists fields_farm_id_idx on public.fields(farm_id);
create index if not exists missions_farm_id_idx on public.missions(farm_id);
create index if not exists missions_field_id_idx on public.missions(field_id);
create index if not exists subscriptions_user_id_idx on public.subscriptions(user_id);
notify pgrst, 'reload schema';

-- Depois execute separadamente, substituindo o email:
-- update public.user_profiles set role='owner', active=true, updated_at=now()
-- where id=(select id from auth.users where email='SEU_EMAIL@EXEMPLO.PT');
