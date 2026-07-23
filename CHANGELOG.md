# FARPHA — Changelog

## Sprint 107.8 — Integridade do repositório e pré-publicação

- CI, CodeQL, release, Dependabot, `.gitignore` e CODEOWNERS incorporados no pacote.
- Auditoria automática impede o desaparecimento de ficheiros estruturais.
- `node_modules`, `dist`, ambientes privados, chaves e certificados bloqueados.
- Padrões evidentes de tokens OpenAI, Supabase, GitHub e chaves privadas verificados.
- Migrações críticas, ativos oficiais e 80+ documentos de sprint recuperados.
- README atualizado com estado pré-comercial e limites das funcionalidades.
- Plano Mestre Pré-Publicação incorporado ao repositório.
- Baseline de segurança e workflow semanal de auditoria adicionados.

## Sprint 107.7 — Assistente FARPHA resiliente

- Classificação determinística das perguntas do guia local.
- Roteiro completo para criar explorações e desenhar/importar talhões.
- Correção da resposta incorreta sobre palavra-passe observada sem saldo de API.
- Origem da resposta identificada como Inteligência online ou Guia local verificado.
- Falta de saldo distinguida de limite temporário da API.
- Envios duplicados bloqueados para evitar respostas trocadas.
- Testes de regressão e guias de instalação, publicação e GitHub.

## Sprint 107.6 — Inteligência FARPHA segura

- Edge Function autenticada para a Inteligência FARPHA.
- Integração server-side com a OpenAI Responses API.
- Chaves privadas isoladas nos Secrets do Supabase.
- Origens autorizadas e limite por utilizador/hora.
- Conversas, mensagens e utilização protegidas por RLS.
- Contexto mínimo da página, sem envio automático de dados agrícolas.
- Aba Inteligência ligada à função com estados de espera e limite restante.
- Fallback local automático em falhas, modo local ou ausência de Internet.
- Pedidos e atendimento humano da Sprint 107.4 preservados.
- Validação automática de segurança, testes e guias completos.

## Sprint 107.5 — Autenticação social estabilizada

- Validação real dos provedores Google e Microsoft/Azure no Supabase.
- Botões OAuth protegidos contra configuração incompleta.
- Retorno OAuth compatível com a base da aplicação.
- Erros OAuth apresentados dentro do login em linguagem clara.
- Diagnóstico e nova tentativa sem recarregar a página.
- Escopo de email Microsoft preservado.
- Testes de provedores, callbacks e mensagens de erro.
- Guias completos de instalação, configuração e GitHub.
- Login por email, cadastro, onboarding e Central de Apoio 107.4 preservados.
