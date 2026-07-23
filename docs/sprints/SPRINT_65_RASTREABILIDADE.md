# Sprint 65 — Rastreabilidade agrícola

## Objetivo

Consolidar o histórico da cultura desde a preparação do solo até à colheita, usando os registos reais já introduzidos no FARPHA.

## Implementado

- Novo módulo `Rastreabilidade` no menu Operações.
- Linha temporal única formada pelo Diário do Talhão e por Produção e Colheita.
- Identificação da exploração, talhão, cultura, data, atividade, responsável e origem de cada evidência.
- Cobertura das etapas de preparação do solo, plantação, cuidados culturais, rega e colheita.
- Indicação transparente das etapas que ainda não possuem evidências.
- Filtros por exploração, talhão, cultura e intervalo de datas.
- Primeiro e último registo apresentados no resumo.
- Exportação do histórico filtrado para CSV, incluindo origem dos dados e cobertura.
- Nova atividade `Preparação do solo` disponível no Diário do Talhão.
- Nenhum registo demonstrativo criado automaticamente.
- Três novos testes automatizados; total acumulado de 88 testes.

## Transparência dos dados

A rastreabilidade reúne somente registos guardados localmente pelo utilizador. A percentagem de cobertura mede a presença de evidências e não representa certificação legal, auditoria ou garantia da qualidade das operações.

## Validação local

```bash
cd AgriOS/frontend
npm install
npm run audit:prod
npm run validate
npm run dev
```

Abra `Operações > Rastreabilidade`, filtre um ciclo agrícola e confirme a linha temporal e o CSV.
