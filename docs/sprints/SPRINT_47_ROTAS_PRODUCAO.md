# Sprint 47 — Rotas críticas em produção

## Objetivo

Garantir que acessos diretos às rotas essenciais do FARPHA funcionam no artefato de produção e que o servidor entrega corretamente o ponto de entrada da SPA.

## Implementado

- Smoke test ampliado de uma para cinco rotas.
- Verificação da página inicial `/`.
- Verificação do Centro de Operações em `/centro-operacoes`.
- Verificação das explorações em `/exploracoes`.
- Verificação do diagnóstico em `/diagnostico`.
- Verificação do fallback numa rota inexistente controlada.
- Confirmação do elemento React `#root` em todas as respostas.
- Confirmação do mesmo JavaScript principal em todas as rotas.
- Preservada a verificação HTTP dos assets JavaScript e CSS.

## Validação local

```bash
cd AgriOS/frontend
npm install
npm run audit:prod
npm run validate
npm run dev
```

Resultado esperado: auditoria limpa, toolchain aprovada, 43 testes, lint, build, manifesto, bundles, cinco rotas e assets aprovados.
