# Sprint 55 — Relatório integrado do talhão

## Objetivo

Reunir num único ficheiro a situação cadastral, geográfica e operacional de cada talhão.

## Implementado

- Novo botão `Relatório integrado CSV` no painel do talhão.
- Identificação da exploração, proprietário, talhão, cultura e estado.
- Resumo da área, disponibilidade do polígono e número de vértices.
- Dados ambientais disponíveis: altitude, declive, pH, água e confiança.
- Resumo do sistema de rega, atividade e eficiência.
- Consolidação dos últimos 20 eventos de rega, duração e volume total.
- Inclusão da avaliação mais recente de risco de incêndio.
- Identificação explícita dos módulos que ainda não possuem dados.
- Exportação UTF-8 compatível com Excel em português.
- Três novos testes automatizados; total acumulado de 58 testes.

## Validação local

```bash
cd AgriOS/frontend
npm install
npm run audit:prod
npm run validate
npm run dev
```

Abra uma exploração, selecione um talhão e pressione `Relatório integrado CSV`.
