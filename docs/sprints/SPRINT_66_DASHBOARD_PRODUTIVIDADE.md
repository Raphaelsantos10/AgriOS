# Sprint 66 — Dashboard de produtividade

## Objetivo

Comparar a produtividade entre culturas, talhões e campanhas a partir das colheitas registadas no FARPHA.

## Implementado

- Novo módulo `Produtividade` no menu Operações.
- Resumo de colheitas, produção bruta, produtividade média e perdas.
- Ranking alternável por cultura, exploração/talhão ou campanha.
- Produtividade agregada de forma ponderada pela área colhida.
- Produção bruta e comercializável, área, perdas e número de registos por grupo.
- Filtros por exploração, cultura, campanha e intervalo de datas.
- Barras comparativas proporcionais ao melhor resultado do conjunto filtrado.
- Exportação do ranking atual para CSV.
- Nenhum registo demonstrativo criado automaticamente.
- Três novos testes automatizados; total acumulado de 91 testes.

## Transparência dos dados

Os indicadores refletem somente colheitas guardadas localmente pelo utilizador. As comparações descrevem dados históricos e não constituem previsão ou garantia de produtividade futura.

## Validação local

```bash
cd AgriOS/frontend
npm install
npm run audit:prod
npm run validate
npm run dev
```

Abra `Operações > Produtividade`, alterne as dimensões do ranking e exporte o CSV.
