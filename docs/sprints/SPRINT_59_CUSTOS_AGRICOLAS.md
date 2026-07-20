# Sprint 59 — Custos agrícolas

## Objetivo

Registar e acompanhar os custos reais das operações agrícolas por exploração e talhão.

## Implementado

- Novo módulo `Custos agrícolas` no menu Operações.
- Categorias: mão de obra, água, combustível, produto, máquina e outros.
- Exploração, talhão, descrição, data, quantidade, unidade e preço unitário.
- Total calculado automaticamente por quantidade × preço unitário.
- Resumo do custo total, número de lançamentos, mão de obra e combustível.
- Filtro por categoria.
- Remoção de lançamentos com confirmação.
- Exportação CSV compatível com Excel em português.
- Nenhum custo ou valor demonstrativo criado automaticamente.
- Persistência local identificada claramente na interface.
- Três novos testes automatizados; total acumulado de 70 testes.

## Transparência dos dados

Nesta fase, os custos são guardados apenas no navegador. A sincronização com backend será adicionada posteriormente, sem apresentar dados locais como provenientes do Supabase.

## Validação local

```bash
cd AgriOS/frontend
npm install
npm run audit:prod
npm run validate
npm run dev
```

Abra `Operações > Custos agrícolas`, registe um custo e exporte o CSV.
