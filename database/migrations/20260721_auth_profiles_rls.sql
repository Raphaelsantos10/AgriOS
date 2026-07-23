-- FARPHA Sprint 90 — perfis autenticados e RLS
-- Execute uma vez no SQL Editor do Supabase.

create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  role text not null default 'viewer' check (role in ('owner', 'manager', 'operator', 'viewer')),
  active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.user_profiles enable row level security;

create or replace function public.is_farpha_admin()
returns boolean language sql stable security definer set search_path = ''
as $$ select exists(select 1 from public.user_profiles where id = auth.uid() and active and role in ('owner','manager')); $$;

drop policy if exists "profile_read_self_or_admin" on public.user_profiles;
create policy "profile_read_self_or_admin" on public.user_profiles for select to authenticated
using (id = auth.uid() or public.is_farpha_admin());

drop policy if exists "profile_update_self" on public.user_profiles;
create policy "profile_update_self" on public.user_profiles for update to authenticated
using (id = auth.uid()) with check (id = auth.uid());

revoke all on public.user_profiles from anon;
revoke update on public.user_profiles from authenticated;
grant select on public.user_profiles to authenticated;
grant update (full_name) on public.user_profiles to authenticated;

create or replace function public.handle_new_farpha_user()
returns trigger language plpgsql security definer set search_path = ''
as $$ begin
  insert into public.user_profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', split_part(coalesce(new.email,''), '@', 1)))
  on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created_farpha on auth.users;
create trigger on_auth_user_created_farpha after insert on auth.users
for each row execute procedure public.handle_new_farpha_user();

-- Perfis para contas já existentes.
insert into public.user_profiles (id, full_name)
select id, coalesce(raw_user_meta_data ->> 'full_name', split_part(coalesce(email,''), '@', 1))
from auth.users on conflict (id) do nothing;

-- DEPOIS substitua o e-mail e execute separadamente para ativar o primeiro proprietário:
-- update public.user_profiles set role = 'owner', active = true
-- where id = (select id from auth.users where email = 'SEU_EMAIL@EXEMPLO.PT');
