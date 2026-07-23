# Sprint 60 — Relatório financeiro

## Objetivo

Analisar os custos agrícolas reais por período, exploração, talhão e categoria.

## Implementado

- Novo módulo `Relatório financeiro` no menu Operações.
- Filtros por data inicial, data final, exploração, talhão e categoria.
- Total de custos, número de lançamentos e custo médio.
- Identificação da categoria com maior custo.
- Distribuição visual de custos por categoria.
- Totais consolidados por talhão.
- Tabela detalhada dos lançamentos filtrados.
- Exportação CSV do resumo, categorias e lançamentos.
- Origem dos dados identificada como custos registados pelo utilizador.
- Receitas, margem e lucro não são simulados nem apresentados sem dados.
- Três novos testes automatizados; total acumulado de 73 testes.

## Transparência dos dados

O relatório analisa somente custos guardados localmente pela Sprint 59. Resultados financeiros de receita ou rentabilidade dependem de módulos futuros de produção e vendas.

## Validação local

```bash
cd AgriOS/frontend
npm install
npm run audit:prod
npm run validate
npm run dev
```

Registe custos e abra `Operações > Relatório financeiro`.
