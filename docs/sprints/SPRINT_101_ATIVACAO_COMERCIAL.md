# Sprint 101 - Ativacao comercial e planos

## Planos definidos

- Free: EUR 0, sem cartao e sem prazo.
- Plus: EUR 19,90 por mes, 30 dias de teste e cancelamento a qualquer momento.
- Pro: EUR 49,90 por mes, 30 dias de teste e toda a plataforma liberada.

## Entregue

- Saida funcional no modo local, retornando ao site publico.
- Entrada explicita em modo demonstracao, sem fingir autenticacao real.
- Saida real para contas Supabase.
- Planos apresentados no site publico e nas configuracoes.
- Checkout Plus e Pro com 30 dias de teste e cartao obrigatorio.
- Cancelamento e gestao de pagamento pelo portal Stripe.
- Plano Free sem cartao.

## Para ativar producao

1. Configurar Supabase e definir VITE_AUTH_REQUIRED=true.
2. Publicar a migracao de billing e as Edge Functions.
3. Criar no Stripe os precos mensais Plus EUR 19,90 e Pro EUR 49,90.
4. Configurar STRIPE_PRICE_PLUS e STRIPE_PRICE_PRO nas Edge Functions.
5. Configurar webhook e testar todo o ciclo em Test Mode.
6. Publicar RLS de cada modulo conforme os direitos dos planos.

