# Sprint 100 - Planos e subscricoes com Stripe

## Entregue

- Planos Foundation, Professional e Enterprise sem precos inventados no codigo.
- Checkout hospedado pelo Stripe criado por Supabase Edge Function autenticada.
- Portal do cliente para pagamento, troca de plano e cancelamento.
- Webhook com verificacao obrigatoria da assinatura Stripe.
- Estado da subscricao confirmado no backend e persistido no Supabase.
- Tabelas de clientes e subscricoes com Row Level Security.
- Chaves secretas exclusivamente no backend.
- Botoes bloqueados enquanto o ambiente de cobranca nao estiver configurado.

## Configuracao obrigatoria antes de testar pagamentos

1. Criar os produtos e precos recorrentes no Stripe Test Mode.
2. Executar `database/migrations/20260721_create_billing.sql` no Supabase.
3. Publicar as Edge Functions em `supabase/functions`.
4. Configurar os segredos `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`,
   `STRIPE_PRICE_FOUNDATION`, `STRIPE_PRICE_PROFESSIONAL`,
   `STRIPE_PRICE_ENTERPRISE`, `SUPABASE_SERVICE_ROLE_KEY` e `APP_ORIGIN`.
5. Cadastrar o endpoint `stripe-webhook` no Stripe.
6. Testar criacao, pagamento aprovado, pagamento recusado, renovacao e cancelamento.
7. Somente depois repetir a configuracao em Live Mode.

## Validacao local

- 175 testes aprovados.
- Lint, build, PWA, seguranca, integridade e smoke test aprovados.
- Zero vulnerabilidades de producao no frontend.

