# Sprint 41 — Segurança automatizada

## Objetivo

Detetar vulnerabilidades no código e manter dependências atualizadas através dos recursos de segurança do GitHub.

## Implementado

- Workflow `FARPHA Security` com análise CodeQL de JavaScript e TypeScript.
- Análise em pushes e pull requests da `main`, semanalmente e sob execução manual.
- Pacote de consultas `security-extended` para ampliar a cobertura.
- Dependabot semanal para dependências npm em `/frontend`.
- Dependabot semanal para GitHub Actions na raiz do repositório.
- Agrupamento das atualizações npm menores e de correção.
- Limites de pull requests para evitar excesso de atualizações simultâneas.
- Política `SECURITY.md` para comunicação responsável de vulnerabilidades.
- Permissões explícitas e mínimas nos workflows.

## Validação local

```bash
cd AgriOS/frontend
npm ci
npm run validate
```

## Validação no GitHub

Depois do push:

1. Abra `Actions > FARPHA CI` e confirme a validação verde.
2. Abra `Actions > FARPHA Security` e confirme a análise CodeQL.
3. Abra `Security > Code scanning` para consultar alertas.
4. Abra `Insights > Dependency graph > Dependabot` para confirmar as atualizações.

O primeiro resultado do CodeQL só fica disponível depois da execução do workflow no GitHub.
