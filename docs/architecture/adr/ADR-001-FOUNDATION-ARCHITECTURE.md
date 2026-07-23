# ADR-001 — FARPHA Foundation Architecture

## Estado
Aceite — primeira fase não invasiva.

## Decisão
Introduzir gradualmente três fundações sem mover as features existentes:

1. `src/core` para serviços transversais;
2. `src/design-system` para tokens e componentes reutilizáveis;
3. comunicação futura por eventos tipados.

## Razão
Uma migração total agora teria risco elevado de regressões. A estratégia incremental permite adotar a nova arquitetura por módulo, mantendo a Release 1.0 funcional.

## Regras
- Nenhuma feature nova deve criar cores próprias quando existir token equivalente.
- Serviços transversais não podem importar páginas ou componentes de features.
- Eventos descrevem factos ocorridos; não devem transportar funções ou componentes React.
- Supabase continua disponível nos serviços atuais até a futura introdução de repositories.
