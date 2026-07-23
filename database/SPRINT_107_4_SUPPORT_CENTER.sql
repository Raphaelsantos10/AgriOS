-- FARPHA Sprint 107.4 — Central de Apoio Supabase
-- Execute todo o ficheiro no SQL Editor do projeto FARPHA.
-- Não coloque service_role nem qualquer chave privada no frontend.

begin;

create table if not exists public.support_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.support_admins enable row level security;
revoke all on table public.support_admins from anon, authenticated;

create or replace function public.is_farpha_support_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.support_admins
    where user_id = auth.uid()
  );
$$;

revoke all on function public.is_farpha_support_admin() from public;
grant execute on function public.is_farpha_support_admin() to authenticated;

create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  client_reference text not null,
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  subject text not null check (char_length(subject) between 2 and 100),
  category text not null check (char_length(category) between 2 and 60),
  priority text not null default 'Normal' check (priority in ('Normal', 'Alta', 'Urgente')),
  description text not null check (char_length(description) between 2 and 1200),
  status text not null default 'open' check (status in ('open', 'in_progress', 'waiting_user', 'resolved', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, client_reference)
);

create index if not exists support_tickets_user_updated_idx
  on public.support_tickets (user_id, updated_at desc);
create index if not exists support_tickets_status_updated_idx
  on public.support_tickets (status, updated_at desc);

alter table public.support_tickets enable row level security;

drop policy if exists support_tickets_read on public.support_tickets;
create policy support_tickets_read
on public.support_tickets
for select
to authenticated
using (user_id = auth.uid() or public.is_farpha_support_admin());

drop policy if exists support_tickets_create on public.support_tickets;
create policy support_tickets_create
on public.support_tickets
for insert
to authenticated
with check (user_id = auth.uid());

drop policy if exists support_tickets_update on public.support_tickets;
create policy support_tickets_update
on public.support_tickets
for update
to authenticated
using (user_id = auth.uid() or public.is_farpha_support_admin())
with check (user_id = auth.uid() or public.is_farpha_support_admin());

create or replace function public.set_farpha_support_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists support_tickets_updated_at on public.support_tickets;
create trigger support_tickets_updated_at
before update on public.support_tickets
for each row execute function public.set_farpha_support_updated_at();

create table if not exists public.support_ticket_messages (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.support_tickets(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  author_kind text not null default 'user' check (author_kind in ('user', 'support', 'system')),
  body text not null check (char_length(body) between 1 and 4000),
  created_at timestamptz not null default now()
);

create index if not exists support_messages_ticket_created_idx
  on public.support_ticket_messages (ticket_id, created_at);

alter table public.support_ticket_messages enable row level security;

drop policy if exists support_messages_read on public.support_ticket_messages;
create policy support_messages_read
on public.support_ticket_messages
for select
to authenticated
using (
  exists (
    select 1
    from public.support_tickets ticket
    where ticket.id = ticket_id
      and (ticket.user_id = auth.uid() or public.is_farpha_support_admin())
  )
);

drop policy if exists support_messages_create on public.support_ticket_messages;
create policy support_messages_create
on public.support_ticket_messages
for insert
to authenticated
with check (
  author_id = auth.uid()
  and exists (
    select 1
    from public.support_tickets ticket
    where ticket.id = ticket_id
      and ticket.status <> 'closed'
      and (
        (
          ticket.user_id = auth.uid()
          and author_kind = 'user'
        )
        or (
          public.is_farpha_support_admin()
          and author_kind = 'support'
        )
      )
  )
);

create or replace function public.touch_farpha_support_ticket()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.support_tickets
  set updated_at = now()
  where id = new.ticket_id;
  return new;
end;
$$;

drop trigger if exists support_message_touch_ticket on public.support_ticket_messages;
create trigger support_message_touch_ticket
after insert on public.support_ticket_messages
for each row execute function public.touch_farpha_support_ticket();

grant select, insert, update on public.support_tickets to authenticated;
grant select, insert on public.support_ticket_messages to authenticated;

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'support_tickets'
  ) then
    alter publication supabase_realtime add table public.support_tickets;
  end if;

  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'support_ticket_messages'
  ) then
    alter publication supabase_realtime add table public.support_ticket_messages;
  end if;
end;
$$;

commit;

notify pgrst, 'reload schema';

-- ATIVAR O PRIMEIRO ADMINISTRADOR
-- Execute separadamente, substituindo o email pelo email real do administrador:
--
-- insert into public.support_admins (user_id)
-- select id from auth.users where email = 'SEU_EMAIL_DE_ADMINISTRADOR'
-- on conflict (user_id) do nothing;
