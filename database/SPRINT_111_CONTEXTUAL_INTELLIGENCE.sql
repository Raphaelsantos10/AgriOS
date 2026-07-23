-- FARPHA Sprint 111 — Inteligência contextual e mensurável
-- Execute depois de SPRINT_107_6_FARPHA_INTELLIGENCE.sql.
-- Pode ser repetido sem apagar conversas ou métricas existentes.

begin;

alter table public.farpha_ai_requests
  add column if not exists input_tokens integer not null default 0,
  add column if not exists output_tokens integer not null default 0,
  add column if not exists total_tokens integer not null default 0,
  add column if not exists latency_ms integer,
  add column if not exists provider_request_id text,
  add column if not exists context_sources text[] not null default '{}'::text[],
  add column if not exists context_updated_at timestamptz;

do $$
begin
  alter table public.farpha_ai_requests
    add constraint farpha_ai_requests_token_counts_check
    check (input_tokens >= 0 and output_tokens >= 0 and total_tokens >= 0);
exception when duplicate_object then null;
end $$;

do $$
begin
  alter table public.farpha_ai_requests
    add constraint farpha_ai_requests_latency_check
    check (latency_ms is null or latency_ms >= 0);
exception when duplicate_object then null;
end $$;

do $$
begin
  alter table public.farpha_ai_requests
    add constraint farpha_ai_requests_provider_request_id_check
    check (provider_request_id is null or char_length(provider_request_id) <= 160);
exception when duplicate_object then null;
end $$;

create index if not exists farpha_ai_requests_user_status_created_idx
  on public.farpha_ai_requests (user_id, status, created_at desc);

-- Mantém a telemetria visível apenas ao proprietário. A Edge Function escreve
-- com service_role depois de validar o JWT e nunca devolve a chave privada.
alter table public.farpha_ai_requests enable row level security;

drop policy if exists farpha_ai_requests_read on public.farpha_ai_requests;
create policy farpha_ai_requests_read
on public.farpha_ai_requests
for select
to authenticated
using (user_id = auth.uid());

revoke all on table public.farpha_ai_requests from anon, authenticated;
grant select on table public.farpha_ai_requests to authenticated;

commit;

notify pgrst, 'reload schema';

select
  column_name,
  data_type
from information_schema.columns
where table_schema = 'public'
  and table_name = 'farpha_ai_requests'
  and column_name in (
    'input_tokens',
    'output_tokens',
    'total_tokens',
    'latency_ms',
    'provider_request_id',
    'context_sources',
    'context_updated_at'
  )
order by column_name;
