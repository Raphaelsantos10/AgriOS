# ADR-002 — Event Bus tipado

## Decisão
Usar um Event Bus local e tipado como mecanismo leve de desacoplamento.

## Uso inicial
- atualizar Analytics após alterações;
- atualizar notificações;
- ligar futuramente Timeline e Auditoria;
- evitar dependências diretas entre features.

## Limites
O Event Bus não substitui estado React, Supabase Realtime ou filas de backend. Serve apenas para eventos internos da sessão do navegador.
