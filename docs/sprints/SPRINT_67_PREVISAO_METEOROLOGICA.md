# Sprint 67 — Previsão meteorológica integrada

## Objetivo

Consultar previsões meteorológicas por localização e transformar condições relevantes em alertas agrícolas compreensíveis.

## Implementado

- Página `Clima` ligada à rota já existente no menu Monitorização.
- Consulta real de sete dias através da API Open-Meteo, sem necessidade de chave.
- Seleção de uma exploração cadastrada ou introdução manual de latitude e longitude.
- Temperaturas mínima e máxima, condição, precipitação, probabilidade de chuva, rajadas e evapotranspiração de referência.
- Alertas de geada, calor intenso, chuva forte, rajadas e procura hídrica elevada.
- Recomendações operacionais prudentes para cada alerta.
- Exportação da previsão para CSV com localização, data de consulta e fonte.
- Diagnóstico do sistema atualizado para testar a integração meteorológica real.
- Estado vazio e mensagens de erro sem criar previsões fictícias.
- Três novos testes automatizados; total acumulado de 94 testes.

## Transparência dos dados

As previsões são estimativas de modelos meteorológicos fornecidas pela Open-Meteo. Alertas críticos devem ser confirmados em fontes oficiais e nas condições observadas no terreno. A aplicação não inicia regas ou operações automaticamente.

Documentação da fonte: https://open-meteo.com/en/docs

## Validação local

```bash
cd AgriOS/frontend
npm install
npm run audit:prod
npm run validate
npm run dev
```

Abra `Monitorização > Clima`, selecione uma exploração, atualize a previsão e exporte o CSV.
