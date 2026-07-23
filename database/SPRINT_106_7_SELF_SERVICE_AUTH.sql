-- FARPHA Sprint 106.7: cadastro autosserviço seguro
-- Execute uma vez no SQL Editor do Supabase antes de disponibilizar o cadastro público.

alter table public.user_profiles alter column role set default 'owner';
alter table public.user_profiles alter column active set default true;

create or replace function public.handle_new_farpha_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.user_profiles (id, full_name, role, active)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      split_part(coalesce(new.email, ''), '@', 1)
    ),
    'owner',
    true
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_farpha on auth.users;
create trigger on_auth_user_created_farpha
after insert on auth.users
for each row execute function public.handle_new_farpha_user();

notify pgrst, 'reload schema';

-- Utilizadores anteriores não são ativados automaticamente.
-- Ative apenas contas verificadas, individualmente, pelo email.
