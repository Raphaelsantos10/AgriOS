# Sprint 107 — Auditoria e estabilização completa

## Base auditada

A auditoria foi executada sobre a branch `main` publicada no GitHub, commit `7c84ed2` (Sprint 106.3). O frontend anunciado como Sprint 106.7 não estava nessa branch. A migração SQL fornecida pelo proprietário foi incorporada, mas as telas específicas de cadastro e onboarding 106.7 não puderam ser certificadas nesta base.

## Resultado automatizado

| Área | Resultado |
| --- | --- |
| Dependências de produção | 0 vulnerabilidades conhecidas pelo `npm audit` |
| Testes | 188 aprovados |
| TypeScript e toolchain | Aprovados |
| ESLint | Aprovado |
| Build de produção | Aprovado |
| PWA/offline | Aprovado |
| Segurança e integridade do `dist` | Aprovadas |
| Smoke test | 5 rotas e 6 assets aprovados |
| Maior bundle | MapLibre, aproximadamente 1 MB antes de gzip |

## Correções aplicadas

1. `Sensores` deixou de abrir uma página 404 e permanece identificado como funcionalidade futura.
2. A barra lateral passou a apresentar nome, iniciais e função da sessão autenticada.
3. A Edge Function do portal Stripe passou a responder a `OPTIONS` e aceitar somente `POST`.
4. A migração 106.7 foi adicionada ao repositório.
5. Foi criada uma migração de endurecimento RLS para perfis, ambiente, incêndio, rega, ordens, histórico, satélite e catálogo de culturas.
6. Um teste automático passou a conferir caminhos duplicados e itens clicáveis sem rota.

## Estado por domínio

| Domínio | Estado | Observação |
| --- | --- | --- |
| Site público | Aprovado no build | Responsivo por CSS; requer validação visual final em navegadores reais |
| Login por email | Preparado | Depende de Auth, URLs e SMTP/configuração do projeto Supabase |
| Google e Microsoft | Preparados | Dependem dos clientes OAuth e das flags do `.env.local` |
| Temas | Estável com compatibilidade | Ainda existem módulos legados com cores utilitárias cobertas pela camada global |
| Supabase | Requer SQL da 106.7 e 107 | A migração 107 corrige políticas abertas de desenvolvimento |
| Stripe | Código estabilizado | Requer produtos, preços, secrets, webhook e deploy das Edge Functions |
| Mobile/PWA | Aprovado automaticamente | Recomenda-se teste físico Android/iPhone antes da produção |
| Módulos centrais | Compilam e possuem rotas | Diversos registos continuam no `localStorage`, não sincronizados entre dispositivos |
| Cadastro/onboarding 106.7 | Bloqueado | Código não encontrado na branch `main` auditada |

## SQL obrigatório

No Supabase SQL Editor, depois das migrações dos módulos, executar:

1. `database/SPRINT_106_7_SELF_SERVICE_AUTH.sql` — caso ainda não tenha sido executado.
2. `database/SPRINT_107_SECURITY_STABILIZATION.sql` — remove acessos anónimos/de desenvolvimento e limita dados pela exploração do utilizador.

A migração 107 pressupõe que todas as tabelas dos módulos nela referidas já foram criadas. Se uma tabela não existir, execute primeiro a migração desse módulo.

## Stripe antes da produção

Configurar secrets das Edge Functions: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_PLUS`, `STRIPE_PRICE_PRO` e `APP_ORIGIN`. Publicar as três funções e configurar o webhook para os eventos de subscrição. Nunca colocar essas chaves em variáveis `VITE_*`.

## Decisão de release

A base auditada está tecnicamente saudável para desenvolvimento e demonstração. A produção pública permanece condicionada a: sincronizar a Sprint 106.7 completa, executar e confirmar as RLS da Sprint 107, publicar/testar Stripe, validar email/OAuth e realizar testes visuais em dispositivos reais.
