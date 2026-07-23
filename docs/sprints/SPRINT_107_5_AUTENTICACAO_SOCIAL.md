# Sprint 107.5 — Autenticação Google e Microsoft estabilizada

## Resultado

O login e o cadastro do FARPHA passam a validar a configuração real dos provedores Google e Microsoft/Azure antes de iniciar o redirecionamento OAuth. Um provedor pedido no `.env.local`, mas ainda não ativado no Supabase, deixa de enviar o utilizador para uma resposta JSON técnica.

## Entregas

- Diagnóstico público e seguro dos provedores habilitados no Supabase.
- Estados distintos: a verificar, pronto, não ativado e serviço inacessível.
- Botões sociais só ficam ativos quando o provedor está pronto.
- Ação “Verificar novamente” sem recarregar a página.
- Retorno OAuth calculado a partir da origem e da base real da aplicação.
- Leitura de erros devolvidos na query ou no fragmento da URL.
- Mensagens amigáveis para cancelamento, callback inválido, rede e provedor desativado.
- Limpeza do erro OAuth da URL após a apresentação no login.
- Escopo `email` obrigatório no acesso Microsoft/Azure.
- Login por email, cadastro, recuperação e confirmação por email preservados.
- Cadastro social continua ligado ao trigger `handle_new_farpha_user`, às políticas RLS e ao onboarding vazio.
- Central de Apoio Supabase da Sprint 107.4 preservada.

## Segurança

- Client Secret do Google e Secret Value do Microsoft ficam apenas nos painéis dos respetivos provedores e no Supabase.
- O frontend utiliza somente a URL do projeto e a chave anon/publishable.
- `service_role`, Client Secret e Secret Value nunca entram no `.env.local`, no ZIP ou no GitHub.
- O endpoint público de configuração informa somente se cada provedor está habilitado; não devolve segredos.

## Configuração externa obrigatória

Os botões só funcionam depois de:

1. criar os clientes OAuth no Google Cloud e no Microsoft Entra;
2. colocar o callback do projeto FARPHA nas duas plataformas;
3. ativar Google e Azure em `Authentication → Providers` no Supabase;
4. autorizar os endereços local e de produção em `Authentication → URL Configuration`;
5. ativar as duas variáveis públicas no `frontend/.env.local`;
6. reiniciar o Vite.

O callback do projeto indicado para esta instalação é:

`https://cafvzjljkxtssbqzqzbi.supabase.co/auth/v1/callback`

## Validação

- Testes unitários para resolução de provedores, URL de retorno e erros OAuth.
- Testes de mensagens de autenticação.
- ESLint, TypeScript e build Vite aprovados.
- Validação integral executada antes de gerar o pacote.

## SQL

Esta sprint não exige uma nova migração SQL. O trigger de criação de perfis da Sprint 106.7 e a Central de Apoio da Sprint 107.4 continuam obrigatórios.
