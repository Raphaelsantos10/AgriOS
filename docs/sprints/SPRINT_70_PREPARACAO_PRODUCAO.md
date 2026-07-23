# Sprint 70 — Preparação para produção

## Implementado

- Central em `Sistema > Definições` com estado pronto, aviso ou bloqueado.
- Verificação de configuração Supabase, HTTPS, PWA e armazenamento local.
- Autenticação, RLS e backup remoto mantidos como bloqueios até confirmação técnica.
- Matriz proposta para proprietário, gestor, operador e consulta.
- Backup JSON somente dos dados locais `farpha.*`.
- Restauração validada, confirmada e limitada às chaves permitidas.
- Cabeçalhos de segurança para provedores compatíveis.
- Verificação do build contra chaves `service_role` e chaves privadas.
- Manual de produção e manual de backup/recuperação.
- Três novos testes automatizados; total acumulado de 103 testes.

## Limite importante

Esta sprint prepara e verifica, mas não transforma uma aplicação sem autenticação/RLS numa aplicação segura. Esses bloqueios precisam ser resolvidos e comprovados no ambiente Supabase antes da disponibilização pública.
