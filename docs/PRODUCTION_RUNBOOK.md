# FARPHA — Manual de produção

## Estado desta entrega

A Sprint 70 adiciona verificações e ferramentas de preparação. A aplicação não deve ser disponibilizada a utilizadores reais enquanto a página `Sistema > Definições` apresentar bloqueios.

## Requisitos obrigatórios

1. Hospedagem HTTPS com os cabeçalhos existentes em `frontend/public/_headers` aplicados pela plataforma.
2. Variáveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` configuradas no ambiente de build.
3. Nunca colocar `service_role`, chaves privadas ou palavras-passe em variáveis `VITE_*`.
4. Autenticação Supabase implementada e testada com cada perfil.
5. Row Level Security ativada e testada em todas as tabelas expostas.
6. Política de backups do Supabase definida, monitorizada e testada por recuperação.
7. Domínios e origens permitidas revistos no Supabase e no provedor de hospedagem.
8. `npm run audit:prod` e `npm run validate` aprovados no mesmo commit que será publicado.

## Matriz proposta

- Proprietário: gestão completa, utilizadores, exportação e recuperação.
- Gestor: explorações, operações, relatórios, exportação e recuperação.
- Operador: registo de operações e consulta de relatórios.
- Consulta: apenas leitura de relatórios autorizados.

A autorização deve ser aplicada no servidor através de JWT e políticas RLS. Ocultar botões no frontend não é segurança.

## Processo de publicação

```bash
cd frontend
npm ci
npm run audit:prod
npm run validate
npm run preview
```

Depois de validar o build local, publique o conteúdo de `frontend/dist` através do processo aprovado. Confirme HTTPS, cabeçalhos, autenticação, permissões, PWA, logs e recuperação antes de abrir o acesso.

## Resposta a incidente

1. Restringir acesso ou retirar a versão afetada.
2. Preservar logs e identificar utilizadores, dados e período afetados.
3. Revogar e rodar credenciais comprometidas no fornecedor correto.
4. Corrigir, testar e publicar uma nova versão.
5. Restaurar dados somente a partir de um ponto validado.
6. Documentar causa, impacto, ações e medidas preventivas.
