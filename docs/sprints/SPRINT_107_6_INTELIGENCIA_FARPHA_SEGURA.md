# Sprint 107.6 — Inteligência FARPHA segura

## Objetivo

Transformar a orientação local do Centro de Ajuda numa base real de
Inteligência Artificial, sem expor credenciais no navegador e sem perder o
funcionamento local quando o serviço externo estiver indisponível.

## Entregas

- Edge Function `farpha-intelligence` autenticada com o JWT do utilizador.
- Chamada à OpenAI Responses API exclusivamente no servidor.
- `OPENAI_API_KEY` lida apenas dos Secrets do Supabase.
- Modelo configurável por `OPENAI_MODEL`, com `gpt-5.6` como predefinição.
- Lista de origens autorizadas por `FARPHA_ALLOWED_ORIGINS`.
- Limite configurável de perguntas por utilizador e por hora.
- Histórico por utilizador, protegido por RLS.
- Registo técnico de sucesso, falha e limite sem guardar Secrets.
- Contexto mínimo da página atual, sem envio automático de dados agrícolas.
- Respostas online integradas na aba Inteligência do Centro de Ajuda.
- Fallback automático para o guia local.
- Pedidos, conversa com o administrador, email, WhatsApp e telefone preservados.
- Testes das mensagens seguras e do contexto enviado.
- Verificação automática de segurança no `npm run validate`.

## Limites desta base

A Inteligência orienta e explica, mas não altera explorações, talhões, custos,
missões ou configurações. A execução assistida de ações deverá ser construída
posteriormente com confirmações explícitas, permissões e auditoria.

Não existe diagnóstico agronómico garantido. Recomendações com risco agrícola,
químico, financeiro, jurídico ou de segurança precisam de confirmação
profissional ou de uma fonte oficial.

## Fluxo de segurança

1. O utilizador entra no FARPHA.
2. O frontend envia a pergunta e o token da sessão para a Edge Function.
3. A função valida o utilizador no Supabase Auth.
4. A função confirma a origem, o limite e a propriedade da conversa.
5. Só então utiliza o Secret para contactar a IA.
6. A resposta e o histórico ficam associados ao utilizador.
7. Se a função falhar, o guia local responde sem expor dados técnicos.

## Ficheiros principais

- `database/SPRINT_107_6_FARPHA_INTELLIGENCE.sql`
- `supabase/functions/farpha-intelligence/index.ts`
- `supabase/config.toml`
- `frontend/src/repositories/intelligence/farphaIntelligenceRepository.ts`
- `frontend/src/features/support/farphaIntelligence.ts`
- `frontend/src/features/support/SupportAssistant.tsx`
- `CONFIGURAR_INTELIGENCIA_FARPHA_SUPABASE.txt`
- `COMO_INSTALAR_SPRINT_107_6.txt`

## Validação

Execute dentro de `frontend`:

```bash
npm install
npm run validate
```

O validador confirma testes, lint, TypeScript, build, PWA, manifesto,
cabeçalhos, ausência de Secrets no frontend e proteções essenciais da função.
