# Sprint 72 — Risco oficial de incêndio IPMA

## Objetivo

Apresentar no FARPHA a previsão oficial portuguesa de perigo de incêndio rural para três dias.

## Implementado

- Novo módulo `Risco de incêndio` no menu Monitorização.
- Consulta dos endpoints oficiais `rcm-d0`, `rcm-d1` e `rcm-d2` do IPMA.
- Classificações reduzido, moderado, elevado, muito elevado e máximo.
- Seleção de exploração cadastrada ou coordenadas manuais.
- Associação ao ponto municipal IPMA mais próximo.
- Código do concelho, distância, corrida do modelo e atualização do ficheiro apresentados.
- Orientação operacional proporcional ao nível oficial.
- Cache local válido durante seis horas.
- Última previsão preservada se uma atualização falhar.
- Exportação CSV com fonte, localização e metadados.
- Parser compatível com o campo real `dico` e a variante `DICO` documentada.
- Três novos testes automatizados; total acumulado de 109 testes.

## Limitação geográfica

A associação inicial utiliza a distância ao ponto representativo municipal devolvido pelo IPMA. Não executa uma interseção com os limites oficiais dos concelhos. O utilizador deve confirmar o código indicado, especialmente perto de fronteiras administrativas. Uma futura integração CAOP poderá tornar essa associação exata.

## Segurança

Consulte sempre restrições e avisos nas fontes oficiais. Em emergência, ligue 112. O FARPHA não substitui IPMA, ICNF, Proteção Civil ou autoridades locais.

Fonte: https://api.ipma.pt/
