# Sprint 56 — Painel consolidado da exploração

## Objetivo

Apresentar numa única visão o estado dos talhões, a cobertura dos módulos e as prioridades operacionais da exploração.

## Implementado

- Novo painel consolidado diretamente na página da exploração.
- Total e área acumulada dos talhões acompanhados.
- Contagem de talhões saudáveis, em atenção e críticos.
- Cobertura dos perfis ambientais, sistemas de rega e avaliações de incêndio.
- Consulta dos registos reais existentes no Supabase para cada talhão.
- Prioridades automáticas para estado crítico, risco de incêndio e dados incompletos.
- Classificação transparente: `Funcional — dados reais`, `Calculado` ou `Parcial — sem dados`.
- Exportação CSV do diagnóstico completo da exploração e de cada talhão.
- Dados ausentes não são apresentados como reais ou simulados.
- Três novos testes automatizados; total acumulado de 61 testes.

## Validação local

```bash
cd AgriOS/frontend
npm install
npm run audit:prod
npm run validate
npm run dev
```

Abra uma exploração para consultar o painel e pressione `Exportar diagnóstico CSV`.
