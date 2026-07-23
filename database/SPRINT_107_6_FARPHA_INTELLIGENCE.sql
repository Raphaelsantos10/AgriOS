-- FARPHA Sprint 107.6 — Base segura da Inteligência FARPHA
-- Execute todo o ficheiro no SQL Editor do projeto FARPHA.
-- A chave da IA pertence aos Secrets da Edge Function, nunca a uma variável VITE_*.

begin;

create table if not exists public.farpha_ai_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'Nova conversa'
    check (char_length(title) between 1 and 120),
  context_route text
    check (context_route is null or char_length(context_route) <= 240),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists farpha_ai_conversations_user_updated_idx
  on public.farpha_ai_conversations (user_id, updated_at desc);

alter table public.farpha_ai_conversations enable row level security;

drop policy if exists farpha_ai_conversations_read on public.farpha_ai_conversations;
create policy farpha_ai_conversations_read
on public.farpha_ai_conversations
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists farpha_ai_conversations_delete on public.farpha_ai_conversations;
create policy farpha_ai_conversations_delete
on public.farpha_ai_conversations
for delete
to authenticated
using (user_id = auth.uid());

create table if not exists public.farpha_ai_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null
    references public.farpha_ai_conversations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null check (char_length(content) between 1 and 8000),
  model text check (model is null or char_length(model) <= 100),
  request_id uuid,
  created_at timestamptz not null default now()
);

create index if not exists farpha_ai_messages_conversation_created_idx
  on public.farpha_ai_messages (conversation_id, created_at);
create index if not exists farpha_ai_messages_user_created_idx
  on public.farpha_ai_messages (user_id, created_at desc);

alter table public.farpha_ai_messages enable row level security;

drop policy if exists farpha_ai_messages_read on public.farpha_ai_messages;
create policy farpha_ai_messages_read
on public.farpha_ai_messages
for select
to authenticated
using (
  user_id = auth.uid()
  and exists (
    select 1
    from public.farpha_ai_conversations conversation
    where conversation.id = conversation_id
      and conversation.user_id = auth.uid()
  )
);

create table if not exists public.farpha_ai_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  conversation_id uuid references public.farpha_ai_conversations(id) on delete set null,
  status text not null default 'processing'
    check (status in ('processing', 'success', 'error', 'limited')),
  model text check (model is null or char_length(model) <= 100),
  input_characters integer not null default 0 check (input_characters >= 0),
  output_characters integer not null default 0 check (output_characters >= 0),
  error_code text check (error_code is null or char_length(error_code) <= 100),
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists farpha_ai_requests_user_created_idx
  on public.farpha_ai_requests (user_id, created_at desc);

alter table public.farpha_ai_requests enable row level security;

drop policy if exists farpha_ai_requests_read on public.farpha_ai_requests;
create policy farpha_ai_requests_read
on public.farpha_ai_requests
for select
to authenticated
using (user_id = auth.uid());

-- O frontend recebe apenas leitura e eliminação das próprias conversas.
-- Criação de conversas, mensagens e registos de utilização é feita pela
-- Edge Function depois de validar o JWT do utilizador.
revoke all on table public.farpha_ai_conversations from anon, authenticated;
revoke all on table public.farpha_ai_messages from anon, authenticated;
revoke all on table public.farpha_ai_requests from anon, authenticated;

grant select, delete on public.farpha_ai_conversations to authenticated;
grant select on public.farpha_ai_messages to authenticated;
grant select on public.farpha_ai_requests to authenticated;

create or replace function public.touch_farpha_ai_conversation()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.farpha_ai_conversations
  set updated_at = now()
  where id = new.conversation_id;
  return new;
end;
$$;

drop trigger if exists farpha_ai_message_touch_conversation
  on public.farpha_ai_messages;
create trigger farpha_ai_message_touch_conversation
after insert on public.farpha_ai_messages
for each row execute function public.touch_farpha_ai_conversation();

commit;

notify pgrst, 'reload schema';
