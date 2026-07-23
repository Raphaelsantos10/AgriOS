# Sprint 54 — Relatório ambiental do talhão

## Objetivo

Permitir guardar e partilhar o perfil ambiental que alimenta os motores agrícolas do FARPHA.

## Implementado

- Novo botão `Exportar perfil CSV` no Environment Engine.
- Exportação do talhão, cultura, área e confiança dos dados.
- Inclusão de altitude, declive e exposição.
- Inclusão de textura, pH, matéria orgânica e drenagem do solo.
- Inclusão de água disponível e tipo de rega.
- Inclusão de chuva, humidade, temperaturas e horas de frio.
- Inclusão dos riscos de geada, incêndio e exposição ao vento.
- Inclusão das observações do utilizador.
- Tradução dos códigos internos para nomes legíveis em português.
- Identificação clara de valores desconhecidos.
- Três novos testes automatizados do relatório.

## Validação local

```bash
cd AgriOS/frontend
npm install
npm run audit:prod
npm run validate
npm run dev
```

Abra uma exploração, entre num talhão, aceda ao Ambiente e pressione `Exportar perfil CSV`.
