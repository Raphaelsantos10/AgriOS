# Sprint 61 — Inventário de produtos

## Objetivo

Controlar fertilizantes, sementes, fitofármacos e outros insumos agrícolas com stock mínimo e validade.

## Implementado

- Novo módulo `Inventário` no menu Operações.
- Categorias: fertilizante, semente, fitofármaco, corretivo e outros.
- Cadastro de unidade, stock inicial, stock mínimo e custo unitário.
- Fornecedor, lote, validade e observações.
- Movimentos de entrada e saída de stock.
- Bloqueio de quantidades inválidas e saída superior ao stock atual.
- Alertas de stock baixo e validade ultrapassada.
- Valor estimado total do inventário.
- Pesquisa por produto, fornecedor, lote ou categoria.
- Remoção controlada e exportação CSV.
- Nenhum produto demonstrativo criado automaticamente.
- Três novos testes automatizados; total acumulado de 76 testes.

## Transparência dos dados

O inventário é guardado localmente no navegador nesta fase. Os produtos apresentados são exclusivamente os cadastrados pelo utilizador.

## Validação local

```bash
cd AgriOS/frontend
npm install
npm run audit:prod
npm run validate
npm run dev
```

Abra `Operações > Inventário`, cadastre um produto e teste entradas e saídas.
