# Sprint 09.3 — Exportação GeoJSON

## Funcionalidades

- Exportação do talhão selecionado em GeoJSON.
- Exportação de todos os talhões da exploração num único FeatureCollection.
- Nomes de ficheiro seguros e legíveis.
- Inclusão de propriedades agrícolas: cultura, estado, área, exploração e datas.
- Bloqueio da exportação quando não existe geometria válida.
- Sem alterações no Supabase e sem novas dependências.

## Teste

1. Abrir uma exploração com pelo menos um talhão.
2. Clicar em **Exportar GeoJSON** no cabeçalho do mapa.
3. Confirmar o download de um ficheiro com todos os talhões.
4. Selecionar um talhão e clicar em **Exportar talhão em GeoJSON**.
5. Abrir os ficheiros num editor de texto ou num visualizador GIS.
6. Confirmar que a geometria e as propriedades estão presentes.
