# Guia de administração FARPHA

## Responsabilidades

- Manter Supabase, migrações, RLS e URLs autorizadas.
- Gerir autenticação por email, Google e Microsoft.
- Manter Secrets somente no backend ou Edge Functions.
- Verificar backups, retenção, logs e custos das APIs.
- Rever a Matriz de Maturidade antes de apresentações comerciais.

## Verificação antes de publicar

```bash
cd frontend
npm install
npm run validate
npm run audit:prod
```

Confirme também:

- workflows verdes no GitHub;
- domínio e HTTPS;
- email de confirmação e recuperação;
- duas contas isoladas por RLS;
- Edge Function e quota da inteligência;
- Stripe apenas quando checkout, portal e webhooks estiverem validados;
- política de privacidade, termos e contactos reais.

## Capturas

Num computador com Google Chrome:

```bash
cd frontend
npm run screenshots:capture
npm run verify:media
```

O processo força modo local apenas no servidor temporário usado para capturas.
Não altera `.env.local`, Supabase nem dados de produção.
