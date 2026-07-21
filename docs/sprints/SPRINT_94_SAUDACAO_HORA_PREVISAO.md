# Sprint 94 — Saudação, hora e previsão diária

## Experiência inicial

A página inicial utiliza agora a hora do dispositivo para escolher `Bom dia` (05:00–11:59), `Boa tarde` (12:00–19:59) ou `Boa noite` (20:00–04:59). Quando a autenticação da Sprint 90 está ativa, apresenta o primeiro nome do perfil; no modo local mantém o nome local atual.

O relógio inclui segundos e é atualizado a cada 30 segundos. A data usa formatação portuguesa completa.

## Meteorologia

A primeira exploração da lista é usada como exploração principal. As suas coordenadas são enviadas diretamente à Open-Meteo para obter:

- condição meteorológica;
- temperatura mínima e máxima;
- probabilidade de precipitação;
- precipitação acumulada prevista.

O nome da exploração e a fonte são apresentados. Sem exploração, coordenadas válidas, rede ou resposta do fornecedor, a interface informa que a previsão está indisponível; nenhum valor é inventado.

## Validação

- 52 ficheiros de teste e 172 testes aprovados.
- Testes de intervalos da saudação, códigos meteorológicos e data portuguesa.
- Lint, TypeScript e build aprovados antes do pacote final.
