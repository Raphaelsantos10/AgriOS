# FARPHA Sprint 21 — Precision Agriculture Foundation

## Entregue
- Nova rota `/precisao` e item de navegação.
- Dashboard de agricultura de precisão responsivo.
- Mapa MapLibre com base satélite e zonas NDVI demonstrativas.
- Seletor NDVI/NDRE/NDMI.
- Gestor de camadas com persistência em localStorage.
- Controlo de opacidade, legenda NDVI, KPIs e leituras recentes.
- Tipos TypeScript e serviço de preferências.
- Migração Supabase para `satellite_observations`.

## Nota técnica
Os polígonos NDVI incluídos são dados demonstrativos locais. A estrutura está pronta para receber tiles/raster reais de Sentinel/Copernicus numa sprint de integração de API.

## Teste
1. Copiar os ficheiros sobre o frontend atual.
2. Executar `npm install`.
3. Executar `npm run build`.
4. Executar `npm run dev` e abrir `/precisao`.
