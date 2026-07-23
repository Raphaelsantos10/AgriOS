# Sprint 46 — Smoke test de produção

## Objetivo

Confirmar automaticamente que o artefato de produção pode ser servido e que os recursos essenciais da página inicial estão acessíveis.

## Implementado

- Novo comando `npm run smoke:prod`.
- Inicialização programática do servidor de preview do Vite.
- Porta fixa `4173` com falha explícita quando estiver ocupada.
- Verificação da resposta HTTP da página inicial.
- Confirmação do tipo de conteúdo HTML.
- Confirmação da existência do elemento React `#root`.
- Descoberta automática dos ficheiros JavaScript e CSS referenciados.
- Verificação de status HTTP e tipo de conteúdo de cada asset.
- Encerramento garantido do servidor mesmo em caso de falha.
- Execução integrada no fim do `npm run validate` e no `FARPHA CI`.

## Validação local

```bash
cd AgriOS/frontend
npm install
npm run audit:prod
npm run validate
npm run dev
```

Resultado esperado: auditoria limpa, toolchain aprovada, 43 testes, lint, build, manifesto, limite de bundle e smoke test aprovados.
