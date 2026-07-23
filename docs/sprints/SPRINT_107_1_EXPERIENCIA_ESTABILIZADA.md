# Sprint 107.1 — Experiência pública e autenticação estabilizadas

## Resultado

Esta correção consolida as experiências das Sprints 106.6, 106.7 e 107 sem remover os módulos agrícolas existentes.

## Entregas

- Centro de Ajuda profissional restaurado com três áreas: Inteligência, Pedidos e Equipa.
- Orientação contextual para explorações, mapa, clima, custos, segurança, planos e diagnóstico.
- Pedidos guardados no dispositivo com referência e histórico local.
- Contacto configurável por WhatsApp, email e telefone.
- Montagem duplicada do assistente removida.
- Instalação PWA retirada do rodapé flutuante e colocada exclusivamente na navegação pública.
- Logótipo vetorial FARPHA restaurado no site, login, onboarding e aplicação.
- Login e cadastro reorganizados com rolagem independente e conteúdo visível em ecrãs de baixa altura.
- Melhorias para PC, tablet e telemóvel, incluindo áreas de toque e afastamento da navegação inferior.
- Verificação do estado dos provedores sociais antes do redirecionamento.
- Mensagens amigáveis quando Google ou Microsoft ainda não estão ativos no Supabase.
- Cadastro por email, confirmação, recuperação e onboarding preservados.

## Limites claros

- Os contactos precisam ser configurados com valores reais em `frontend/.env.local`.
- Os pedidos ficam no navegador até existir backend de atendimento.
- Google e Microsoft só funcionam depois de os respetivos provedores estarem ativados e guardados no mesmo projeto Supabase utilizado pelo frontend.
- A orientação do Centro de Ajuda é contextual e local. Uma IA generativa exige backend ou Supabase Edge Function segura; chaves privadas não devem ser colocadas em variáveis `VITE_*`.

## Validação executada

- Toolchain: aprovada.
- Vitest: 57 ficheiros e 191 testes aprovados.
- ESLint: aprovado.
- TypeScript e build Vite: aprovados.
- Verificação PWA: aprovada.
- Verificação de segurança: aprovada.
- Manifesto e integridade do build: aprovados.
- Smoke test de produção: aprovado.
