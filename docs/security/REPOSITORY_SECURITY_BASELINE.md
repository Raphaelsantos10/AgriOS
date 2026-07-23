# Baseline de segurança do repositório FARPHA

## Objetivo

Impedir que uma substituição de sprint elimine controlos de segurança, histórico
ou migrações e impedir que ficheiros gerados ou credenciais sejam publicados.

## Ficheiros estruturais obrigatórios

- `.github/dependabot.yml`
- `.github/workflows/ci.yml`
- `.github/workflows/codeql.yml`
- `.github/workflows/release.yml`
- `.github/workflows/repository-audit.yml`
- `.gitignore`
- `README.md`
- `SECURITY.md`
- `CHANGELOG.md`
- migrações de autenticação, RLS, suporte e inteligência
- Edge Function `farpha-intelligence`
- plano mestre e documentação das sprints

## Conteúdo proibido no Git

- `frontend/node_modules`
- `frontend/dist`
- `.env`, `.env.local` e ambientes privados
- certificados e chaves `.pem`, `.p12` e `.key`
- tokens reais OpenAI, Supabase ou GitHub
- chaves privadas

## Execução local

```bash
cd frontend
npm run verify:repository
```

A mesma verificação faz parte de `npm run validate` e do workflow
`FARPHA Repository Audit`.

## Resposta a incidente

1. Interromper o uso da credencial exposta.
2. Revogar a credencial no fornecedor.
3. Criar uma credencial nova.
4. Atualizar somente o cofre seguro correspondente.
5. Avaliar e limpar o histórico com uma ferramenta apropriada.
6. Forçar a rotação nos ambientes afetados.
7. Documentar o incidente sem publicar o segredo.

## Regra para pacotes de sprint

Cada ZIP deve conter o projeto completo, mas excluir `.git`, `node_modules`,
`dist`, `.env.local`, credenciais e ficheiros temporários. O instalador preserva
o `.git` e o `.env.local` existentes no computador do utilizador.
