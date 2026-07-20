# Sprint 40 — Integração contínua

## Objetivo

Executar automaticamente testes, lint e build no GitHub antes que erros cheguem à branch principal.

## Implementado

- Workflow `FARPHA CI` para pushes na `main` e pull requests.
- Execução manual disponível através de `workflow_dispatch`.
- Node.js 24 fixado em `frontend/.nvmrc`.
- Instalação determinística com `npm ci` e cache do npm.
- Novo comando único `npm run validate`.
- Cancelamento automático de execuções antigas da mesma branch.
- Permissões mínimas de leitura e limite de 15 minutos.
- Mantidos os 43 testes automatizados existentes.

## Validação local

```bash
cd AgriOS/frontend
npm ci
npm run validate
```

Depois do push, confirme a execução em `GitHub > Actions > FARPHA CI`.
