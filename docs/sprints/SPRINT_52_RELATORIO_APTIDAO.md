# Sprint 52 — Relatório de aptidão de culturas

## Objetivo

Permitir guardar e partilhar a classificação de culturas calculada para cada talhão.

## Implementado

- Novo botão `Exportar relatório CSV` na página de aptidão.
- Exportação da lista na mesma ordem apresentada no ecrã.
- Inclusão do talhão, cultura e nome científico.
- Inclusão das pontuações sem rega e com rega.
- Inclusão do ganho potencial proporcionado pela rega.
- Respeito pelo cenário selecionado em `Simular rega`.
- Inclusão da confiança, pontos fortes, alertas e fatores conhecidos.
- Exportação respeita a pesquisa/filtro atual da página.
- CSV UTF-8 compatível com Excel em português.
- Três novos testes automatizados do relatório.

## Validação local

```bash
cd AgriOS/frontend
npm install
npm run audit:prod
npm run validate
npm run dev
```

Abra uma exploração, entre num talhão, aceda à aptidão, escolha o cenário e pressione `Exportar relatório CSV`.
