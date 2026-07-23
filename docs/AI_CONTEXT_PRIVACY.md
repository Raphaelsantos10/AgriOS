# Contexto e privacidade da Inteligência FARPHA

## Regra principal

O FARPHA não envia automaticamente os dados operacionais da exploração para o
fornecedor de Inteligência. A opção **Usar contexto da exploração** começa
desativada e precisa de ser marcada pelo utilizador.

## Dados enviados quando a opção está ativa

O servidor produz um resumo agregado associado ao utilizador autenticado:

- quantidade e área total das explorações;
- quantidade, culturas e estados dos talhões;
- quantidade de ordens abertas;
- quantidade e total matemático dos custos registados;
- fontes consultadas e data da atualização mais recente.

Não entram nesse resumo nomes de explorações ou talhões, coordenadas,
geometrias, responsáveis, descrições, notas ou dados de contacto.

## Perguntas e histórico

A pergunta escrita pelo utilizador e a resposta ficam guardadas nas tabelas
`farpha_ai_messages` para permitir continuidade da conversa. As políticas RLS
limitam a leitura ao próprio utilizador. Não introduza palavras-passe, códigos
MFA, dados bancários, chaves ou outros segredos.

## OpenAI e retenção

A chamada é feita pela Edge Function, nunca pelo navegador, e utiliza
`store: false`. Isso desativa o armazenamento do objeto Response para
continuidade na API. A política de retenção aplicável à conta OpenAI deve ser
confirmada antes da produção; `store: false` não equivale por si só a ativar
Zero Data Retention.

## Telemetria

Cada pedido regista apenas metadados técnicos:

- estado, modelo e identificador do fornecedor;
- caracteres de entrada e saída;
- tokens de entrada, saída e total;
- latência, erro normalizado e fontes agregadas;
- datas de início, conclusão e atualização do contexto.

Essas métricas não duplicam a pergunta nem a resposta e são visíveis apenas ao
proprietário através das políticas RLS.

## Limites e responsabilidade

A Inteligência orienta, explica e ajuda a organizar decisões. Não executa ações
agrícolas e não substitui um técnico, uma análise laboratorial ou uma fonte
oficial em decisões agronómicas, químicas, jurídicas, financeiras ou de
segurança.
