# Sprint 73 — Cartografia oficial ICNF

## Objetivo

Integrar no FARPHA cartografia pública oficial do ICNF para apoiar a leitura territorial e o planeamento preventivo de incêndios rurais.

## Implementado

- Novo módulo `Cartografia ICNF` no menu Monitorização.
- Mapa base OpenStreetMap com enquadramento inicial em Portugal continental.
- Seleção de uma exploração para centrar o mapa na respetiva localização.
- Quatro camadas WMS oficiais, ativáveis individualmente:
  - perigosidade estrutural de incêndio rural 2020–2030;
  - áreas ardidas de 2025;
  - pontos de água;
  - locais críticos de incêndio.
- Pedidos de imagem WMS 1.1.1 em `EPSG:4326`, atualizados quando o utilizador desloca ou amplia o mapa.
- Legenda, estado de carregamento, mensagens de falha e atribuição visível ao ICNF e OpenStreetMap.
- Três novos testes automatizados para catálogo, parâmetros WMS e coordenadas da imagem.
- Total acumulado de 112 testes automatizados.

## Arquitetura e dados

As imagens são solicitadas diretamente aos serviços WMS do ICNF. O FARPHA não copia nem guarda localmente a cartografia. Foi usado `EPSG:4326` porque os serviços consultados não anunciam suporte a `EPSG:3857`; a imagem correspondente à área visível é recriada após cada movimento do mapa.

Serviços integrados:

- `https://si.icnf.pt/wms/perigosidade_estrutural_2020_2030` — `BDG:perigosidade_incendio`
- `https://si.icnf.pt/wms/areas_ardidas` — `BDG:ardida_2025`
- `https://si.icnf.pt/wms/pontos_agua` — `BDG:pontos_agua`
- `https://si.icnf.pt/wms/locais_criticos_incendio` — `BDG:locais_criticos`

## Limitações e utilização responsável

- As camadas dependem da disponibilidade e do desempenho dos serviços externos do ICNF.
- A cartografia pode não estar disponível sem ligação à Internet.
- A designação e a data de cada camada devem ser confirmadas nos metadados oficiais; uma área sem representação não significa ausência de risco.
- Esta visualização é informativa e não substitui cartas oficiais, restrições legais, avisos do IPMA, ICNF, Proteção Civil ou autoridades locais.

Catálogo oficial: https://geocatalogo.icnf.pt/catalogo_tema5.html
