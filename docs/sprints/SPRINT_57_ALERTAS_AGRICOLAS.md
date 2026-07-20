# Sprint 57 — Central de alertas agrícolas

## Objetivo

Transformar os dados operacionais da exploração em alertas claros, priorizados e acionáveis.

## Implementado

- Nova central de alertas na página da exploração.
- Severidades `Crítico`, `Atenção` e `Informativo`.
- Alertas de talhões críticos ou que exigem atenção.
- Alerta de risco elevado, muito elevado ou crítico de incêndio.
- Alertas de sistema de rega ausente ou inativo.
- Alerta de reservatório com nível igual ou inferior a 20%.
- Alertas de perfil ambiental e dados climáticos incompletos.
- Aviso quando a avaliação de incêndio ainda não foi realizada.
- Ação recomendada e origem visíveis em cada alerta.
- Dados do Supabase distinguidos de diagnósticos calculados.
- Exportação CSV de todos os alertas, incluindo os não mostrados no resumo inicial.
- Três novos testes automatizados; total acumulado de 64 testes.

## Validação local

```bash
cd AgriOS/frontend
npm install
npm run audit:prod
npm run validate
npm run dev
```

Abra uma exploração e consulte a `Central de alertas agrícolas`.
