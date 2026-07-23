# Sprint 90 — Autenticação Supabase e RLS

## Objetivo

Substituir a identidade visual fixa por uma sessão real e criar a base segura de perfis FARPHA. A ativação é deliberadamente gradual: instalações atuais permanecem em modo local e o bloqueio só entra em vigor com `VITE_AUTH_REQUIRED=true`.

## Entregas

- Login por e-mail/palavra-passe com Supabase Auth.
- Recuperação de palavra-passe e fluxo `PASSWORD_RECOVERY`.
- Perfil associado a `auth.users`, função e estado de ativação.
- Cabeçalho com nome, função e término de sessão reais.
- Bloqueio seguro para configuração incompleta e perfil inativo.
- Migração idempotente `database/migrations/20260721_auth_profiles_rls.sql`.
- RLS de leitura do próprio perfil ou administração, e atualização limitada do próprio nome.
- Criação automática do perfil de novas contas.

## Funções preparadas

| Função | Finalidade |
| --- | --- |
| `owner` | Proprietário e administrador principal |
| `manager` | Gestão operacional e futura administração delegada |
| `operator` | Execução de operações autorizadas |
| `viewer` | Consulta sem administração |

Nesta sprint, a função protege o perfil e prepara a autorização central. A RLS dos dados agrícolas exige que as tabelas sejam associadas a uma organização/exploração; isso não é simulado nem aplicado cegamente a tabelas antigas sem coluna de proprietário.

## Ativação

1. Executar a migração no SQL Editor do Supabase.
2. Criar a primeira conta em Authentication > Users.
3. Promover essa conta com o `update` documentado no guia principal.
4. Configurar URL, chave `anon` e `VITE_AUTH_REQUIRED=true` em `frontend/.env.local`.
5. Reiniciar o servidor de desenvolvimento.

Nunca usar a chave `service_role` numa aplicação Vite ou num repositório Git.

## Validação

- 49 ficheiros de teste e 163 testes aprovados.
- Lint e build de produção aprovados.
- Política testada para modo local, configuração incompleta e funções administrativas.
