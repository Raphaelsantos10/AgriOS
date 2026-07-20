# Sprint 53 — Relatório de risco de incêndio

## Objetivo

Permitir guardar e partilhar uma avaliação preventiva completa de risco de incêndio por talhão.

## Implementado

- Novo botão `Exportar relatório CSV` no Fire Intelligence.
- Exportação do talhão, cultura e área.
- Inclusão da pontuação, nível e confiança do risco.
- Inclusão de temperatura, humidade, vento, declive e secura da vegetação.
- Inclusão da carga combustível, proximidade de incêndio e direção do vento.
- Inclusão de todos os fatores, explicações e ações recomendadas.
- Inclusão das notas operacionais do utilizador.
- Aviso explícito para seguir as autoridades e ligar 112 em emergência.
- Valores não informados identificados claramente.
- Três novos testes automatizados do relatório.

## Validação local

```bash
cd AgriOS/frontend
npm install
npm run audit:prod
npm run validate
npm run dev
```

Abra uma exploração, entre num talhão, aceda a Incêndio e pressione `Exportar relatório CSV`.
