# Sprint 78 — Fitofármacos e fertilização

## Objetivo

Registar aplicações agrícolas com os elementos operacionais necessários para acompanhamento e futura auditoria.

## Implementado

- Novo módulo `Fitofármacos e fertilização` no menu Operações.
- Registos separados de produto fitofarmacêutico e fertilização/corretivo.
- Data, exploração, talhão, cultura, área, aplicador, produto, dose, unidade e quantidade total.
- Cartão/habilitação e respetiva validade.
- Número de autorização do produto.
- Equipamento, validade de inspeção e condições observadas.
- Intervalo de segurança introduzido pelo utilizador e cálculo da primeira data possível de colheita.
- Destaque das restrições de colheita ainda ativas.
- Seleção opcional de produtos já existentes no Inventário.
- Seleção opcional de pulverizadores/implementos já existentes em Máquinas.
- Alertas de habilitação ou inspeção aparentemente expiradas ou sem validade indicada.
- Três novos testes automatizados; total acumulado de 127 testes.

## Decisões de segurança

- O FARPHA não recomenda produtos, doses ou aplicações.
- Não valida nesta fase se a autorização indicada existe, está ativa ou abrange a cultura e finalidade.
- Não desconta stock nem adiciona horas à máquina automaticamente, evitando alterações implícitas noutros módulos.
- Um aviso não impede o registo histórico, mas exige confirmação explícita do utilizador.
- A data de colheita é um cálculo matemático baseado no intervalo introduzido, não uma decisão técnica ou legal.

## Verificação obrigatória

Antes de qualquer aplicação, o responsável deve confirmar rótulo, autorização, cultura, inimigo, dose, intervalo de segurança, zonas de proteção, condições meteorológicas e requisitos atuais da DGAV.
