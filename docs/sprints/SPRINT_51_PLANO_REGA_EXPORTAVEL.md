# Sprint 51 — Plano de rega exportável

## Objetivo

Transformar a recomendação do Smart Irrigation Engine num documento operacional que possa ser guardado, enviado ou aberto numa folha de cálculo.

## Implementado

- Novo botão `Exportar plano CSV` no painel de recomendação.
- Exportação do talhão, cultura e área.
- Inclusão do sistema, método, caudal e eficiência.
- Inclusão da humidade do solo e chuva prevista consideradas.
- Inclusão da necessidade, volume, duração e melhor janela de rega.
- Inclusão da prioridade, confiança, motivos e alertas.
- Nome de ficheiro seguro baseado no nome do talhão.
- CSV em UTF-8 com BOM e separador compatível com Excel em português.
- Escape correto de aspas e caracteres especiais.
- Três novos testes automatizados da exportação.

## Validação local

```bash
cd AgriOS/frontend
npm install
npm run audit:prod
npm run validate
npm run dev
```

Abra uma exploração, entre num talhão, aceda à irrigação e pressione `Exportar plano CSV`.
