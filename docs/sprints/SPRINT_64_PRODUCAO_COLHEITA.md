# Sprint 64 — Produção e colheita

## Objetivo

Registar resultados de colheita, qualidade, perdas e produtividade por hectare.

## Implementado

- Novo módulo `Produção e colheita` no menu Operações.
- Campanha, data, exploração, talhão e cultura.
- Área colhida, produção bruta e produção comercializável.
- Quantidades em quilogramas ou toneladas com conversão automática.
- Classificação de qualidade premium, primeira, segunda, industrial ou não classificada.
- Destino da produção e observações.
- Perdas em quilogramas e percentagem calculadas automaticamente.
- Produtividade em toneladas por hectare.
- Validação para impedir produção comercializável superior à bruta.
- Resumo consolidado de produção, perdas e produtividade.
- Pesquisa, remoção controlada e exportação CSV.
- Nenhum registo demonstrativo criado automaticamente.
- Três novos testes automatizados; total acumulado de 85 testes.

## Transparência dos dados

As colheitas são guardadas localmente e refletem somente dados introduzidos pelo utilizador.

## Validação local

```bash
cd AgriOS/frontend
npm install
npm run audit:prod
npm run validate
npm run dev
```

Abra `Operações > Produção e colheita`, registe uma colheita e confirme perdas e produtividade.
