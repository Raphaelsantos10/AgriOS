# Sprint 71 — Solo Inteligente

## Objetivo

Consultar propriedades estimadas do solo por coordenadas e apresentar incerteza, profundidade e fonte de forma responsável.

## Implementado

- Novo módulo `Solo Inteligente` no menu Inteligência.
- Seleção de exploração cadastrada ou coordenadas manuais.
- Integração com o endpoint REST SoilGrids v2 do ISRIC.
- pH, carbono orgânico, argila, areia, silte, nitrogénio, CEC e densidade aparente.
- Profundidades de 0–5, 5–15 e 15–30 centímetros.
- Média, quantis Q0.05 e Q0.95 e amplitude relativa da estimativa.
- Conversão conforme o fator e a unidade devolvidos pela API.
- Cache local por coordenadas durante 30 dias.
- Limite local de cinco chamadas por minuto conforme a política de uso justo.
- Exportação CSV com coordenadas, consulta, fonte e intervalos.
- Estado de indisponibilidade sem dados fictícios.
- Três novos testes automatizados; total acumulado de 106 testes.

## Limitação atual do fornecedor

Em julho de 2026, o ISRIC informa oficialmente que a API REST beta está temporariamente pausada e não possui garantia de disponibilidade. O FARPHA mantém a integração preparada, utiliza cache e mostra o erro real. Para operação em escala, deve-se implementar no backend uma solução com WCS/COG e cache central.

## Uso agronómico

SoilGrids possui resolução aproximada de 250 metros e representa uma estimativa por modelo. Não substitui amostragem representativa, análise laboratorial ou avaliação de um profissional qualificado.

Fonte e licença: https://isric.org/explore/soilgrids/ — CC BY 4.0.
