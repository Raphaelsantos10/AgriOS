# Sprint 107.7 — Assistente FARPHA resiliente

## Objetivo

Garantir respostas locais corretas e transparentes quando a Inteligência online
estiver sem saldo, limitada ou indisponível.

## Entregas

- Classificador determinístico de intenções para exploração, clima, custos,
  diagnóstico, segurança, planos, atendimento e navegação.
- Perguntas sobre explorações e talhões recebem um roteiro operacional completo.
- Intenções operacionais têm prioridade sobre palavras genéricas como
  “primeiro” e “começar”.
- Identificação visual de `Inteligência online` e `Guia local verificado`.
- Mensagem específica quando a conta da API estiver sem saldo.
- Distinção entre falta de saldo e limite temporário do fornecedor.
- Bloqueio imediato de envios duplicados para evitar respostas cruzadas.
- Fallback local preservado sem exigir pagamento da API.
- Pedidos e contacto com a equipa preservados.
- Testes de regressão para a pergunta observada durante a Sprint 107.6.

## Validação funcional

Pergunta de regressão:

> Como posso criar a minha primeira exploração e desenhar os talhões?

Mesmo sem saldo de API, a resposta deve:

- ser identificada como `Guia local verificado`;
- abrir `/exploracoes`;
- explicar criação da exploração;
- explicar desenho ou importação do talhão;
- não mencionar palavra-passe ou segurança.

## Supabase

Esta sprint não cria tabelas e não exige novo SQL. A Edge Function deve ser
publicada novamente para ativar a distinção entre saldo esgotado e limite.
