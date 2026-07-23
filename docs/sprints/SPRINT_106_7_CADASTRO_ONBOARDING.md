# Sprint 106.7 — Cadastro e onboarding

## Entregue

- experiência de autenticação inspirada em produtos enterprise, com identidade FARPHA;
- alternância entre Entrar e Criar conta;
- cadastro em duas etapas com validação progressiva;
- email/palavra-passe, Google e Microsoft via Supabase;
- recuperação e confirmação por email;
- seleção do perfil agrícola;
- onboarding em três etapas para novos utilizadores;
- conta nova inicia sem explorações, talhões, missões ou registos fictícios;
- utilizador de autosserviço torna-se owner ativo do próprio espaço;
- isolamento de farms, fields e missions por RLS;
- experiência responsiva, teclado, foco, labels e mensagens acessíveis.

## Passo obrigatório no Supabase

Execute `database/SPRINT_106_7_SELF_SERVICE_AUTH.sql` no SQL Editor antes de disponibilizar cadastro público.

Em Authentication > Providers:

- mantenha Email ativo;
- configure Google e adicione as credenciais OAuth;
- configure Azure/Microsoft e adicione as credenciais OAuth;
- adicione a URL pública e `http://localhost:5173` às Redirect URLs durante desenvolvimento.

No `.env.local`:

```env
VITE_AUTH_REQUIRED=true
VITE_GOOGLE_AUTH_ENABLED=true
VITE_MICROSOFT_AUTH_ENABLED=true
```

Não ative um botão social antes de configurar o respetivo provedor no Supabase.

## Inteligência artificial

O onboarding e o suporte oferecem orientação contextual sem expor segredos. Uma IA generativa deve ser integrada por Supabase Edge Function ou backend próprio. Nunca coloque uma chave OpenAI, Anthropic ou Google AI em variáveis `VITE_*`.

## Validação final

- 56 ficheiros de testes e 185 testes aprovados;
- lint e TypeScript aprovados;
- build, PWA, segurança, integridade e smoke test aprovados;
- zero vulnerabilidades de produção.

