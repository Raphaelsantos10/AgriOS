# Sprint 44 — Auditoria de dependências

## Objetivo

Impedir que vulnerabilidades conhecidas de severidade alta ou crítica cheguem à branch principal através das dependências utilizadas em produção.

## Implementado

- Novo comando `npm run audit:prod`.
- Auditoria apenas das dependências de produção com `--omit=dev`.
- Limite de bloqueio configurado em severidade alta com `--audit-level=high`.
- Nova etapa `Auditar dependências de produção` no workflow `FARPHA CI`.
- Execução da auditoria depois do `npm ci` e antes dos testes, lint e build.
- Pull requests com vulnerabilidades altas ou críticas deixam de obter validação verde.
- Ferramentas exclusivas de desenvolvimento não geram falsos bloqueios da aplicação publicada.

## Validação local

```bash
cd AgriOS/frontend
npm install
npm run audit:prod
npm run validate
npm run dev
```

Resultado esperado: `found 0 vulnerabilities`, toolchain aprovada, 43 testes aprovados, lint sem erros, build e limite de bundle aprovados.

## Validação no GitHub

Depois do push, abra `Actions > FARPHA CI` e confirme que a etapa `Auditar dependências de produção` terminou com um visto verde.
