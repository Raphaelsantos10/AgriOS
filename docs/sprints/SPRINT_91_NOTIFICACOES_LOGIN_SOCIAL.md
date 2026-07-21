# Sprint 91 — Notificações funcionais e login social

## Correção do sino

O contador visual fixo foi removido. O novo painel consome os alertas unificados já usados pelo Dashboard e Centro de Operações. O utilizador pode abrir um alerta, seguir para o módulo de origem, marcar tudo como lido e consultar o total ativo. Os identificadores lidos ficam no dispositivo e não eliminam alertas agrícolas.

## Login social

O ecrã de autenticação suporta OAuth Google e Azure/Microsoft através do Supabase. Cada botão depende da respetiva variável:

- `VITE_GOOGLE_AUTH_ENABLED=true`
- `VITE_MICROSOFT_AUTH_ENABLED=true`

Os segredos OAuth ficam exclusivamente nos painéis Google/Microsoft e Supabase, nunca no frontend. O trigger da Sprint 90 cria o perfil social como `viewer` inativo; o proprietário precisa aprová-lo antes do acesso.

## Validação

- 50 ficheiros de teste e 166 testes aprovados.
- Lint e build aprovados.
- Testes da contagem de não lidas, idempotência de leitura e navegação por origem.
