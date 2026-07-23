# Sprint 107.8 — Auditoria final do repositório

## Objetivo

Restaurar e proteger a infraestrutura eliminada numa substituição anterior de
sprint, preservando integralmente a aplicação, autenticação, Central de Apoio e
Inteligência FARPHA das Sprints 107.4 a 107.7.

## Entregas

- CI, CodeQL, release e Dependabot incluídos no pacote.
- CODEOWNERS para áreas críticas.
- `.gitignore` reforçado.
- Auditoria automática do repositório dentro de `npm run validate`.
- Workflow semanal e por push/PR.
- Migrações antigas e histórico documental recuperados.
- Plano Mestre Pré-Publicação versionado.
- README e política de segurança atualizados.

## Proteções

A auditoria falha quando:

- falta um ficheiro estrutural;
- `node_modules`, `dist` ou ambientes privados são versionados;
- certificados ou chaves são incluídos;
- aparece um padrão evidente de token real;
- o histórico de documentos de sprint é perdido.

## Base de dados

Esta sprint não cria nem altera tabelas. Os SQL recuperados são histórico e não
devem ser executados novamente quando já foram aplicados no Supabase.

## Validação

```bash
cd frontend
npm install
npm run validate
```
