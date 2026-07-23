# Auditoria FARPHA — Design System e Login após a Sprint 102

Data: 22 de julho de 2026

## Conclusão executiva

A Sprint 102 criou uma fundação visual útil, mas a aplicação ainda não possui um Design System completo nem cobertura uniforme em todas as páginas. O núcleo oficial contém quatro componentes (`Button`, `Input`, `Card` e `Badge`). A maior parte das páginas ainda combina tokens FARPHA com utilitários e componentes locais.

A página pública e o login já possuem uma base moderna e responsiva. O login tem duas colunas no desktop, versão mobile, recuperação de palavra-passe, autenticação Google/Microsoft configurável, feedback de processamento e integração com autenticação e MFA. Ainda faltam controles e validações essenciais para cumprir integralmente o novo requisito.

## Evidências do inventário

| Indicador | Estado atual |
| --- | ---: |
| Ficheiros React TSX | 142 |
| Componentes oficiais no Design System | 4 |
| Ficheiros com botão HTML próprio | 70 |
| Ficheiros com input HTML próprio | 49 |
| Ficheiros com select HTML próprio | 31 |
| Ficheiros com tabela HTML própria | 10 |
| Ficheiros TSX com cores diretas/utilitárias | 115 |
| Ficheiros que importam o Design System | 33 |
| Rotas principais com lazy loading | 40+ |
| Testes atualmente aprovados | 175 |
| Vulnerabilidades de produção | 0 |

Os números indicam que a fundação existe, porém a migração ainda está incompleta. As regras globais de compatibilidade do tema escuro também mostram que módulos legados continuam dependentes de cores claras locais.

## Cobertura dos requisitos

### Já existe

- Escala principal `brand` 50–950 e escala neutra.
- Cores semânticas básicas de sucesso, aviso, perigo e informação.
- Tokens de espaçamento em múltiplos de 4 px, raios e sombras.
- Tema claro e escuro com variáveis globais.
- Botão com variantes primary, secondary, ghost e danger, tamanhos e loading.
- Input com label, hint, erro e atributos acessíveis.
- Card e Badge oficiais.
- Foco global visível e suporte a `prefers-reduced-motion`.
- Ícones predominantemente centralizados em Lucide React.
- Layout principal com sidebar, header, navegação mobile e carregamento por rota.
- Site público responsivo, planos Free/Plus/Pro e apresentação de segurança.
- Login em duas colunas no desktop e coluna única no mobile.
- Email, palavra-passe, recuperação por email, login social opcional e loader.
- Autenticação MFA/TOTP e gestão de sessão integradas no fluxo autenticado.

### Parcial

- Paleta: escalas completas apenas para marca e neutros; cores semânticas não possuem tons 50–900.
- Tipografia: família global definida, mas sem tokens/exportações H1–H6, Body, Caption e Label.
- Layout: responsivo na base, sem matriz formal de breakpoints e testes visuais por viewport.
- Estados: botão e input cobrem parte dos estados; não há contrato comum para success/error/loading em todos os componentes.
- Acessibilidade: foco e ARIA aparecem em áreas importantes, mas não existe teste automatizado de acessibilidade nem prova integral de WCAG AA.
- Animação: Framer Motion está instalado, mas não é utilizado; existem apenas transições CSS pontuais.
- Performance: lazy loading de páginas está implementado; ainda faltam orçamento por rota, auditoria de imagens e medição de re-renderizações.

### Em falta

- Tokens tipográficos e semânticos completos.
- Select, Textarea, Checkbox, Radio, Switch, Chip, Avatar, Tabs, Accordion, Breadcrumbs e Pagination oficiais.
- Modal, Drawer, Tooltip, Popover, Menu e Dropdown oficiais com gestão completa de foco.
- Table/DataTable, List, Toast, Alert, Skeleton, Empty, Loading e Error states oficiais.
- Documentação navegável dos componentes, variantes e exemplos.
- Testes unitários e acessíveis do Design System.
- Migração de todos os botões, campos, formulários, tabelas, modais e cores locais.
- Mostrar/ocultar palavra-passe e indicador de Caps Lock no login.
- “Lembrar-me” com semântica segura de sessão.
- Validação progressiva do email e mensagens de autenticação amigáveis normalizadas.
- Estado de sucesso da recuperação de palavra-passe mais completo.
- Transição de autenticação e microinterações coerentes.
- Testes E2E do login, recuperação, MFA, logout e breakpoints.
- Auditoria automatizada WCAG AA e regressão visual.

## Roadmap recomendado

### Sprint 103 — Fundação completa de tokens e acessibilidade

Objetivo: fechar a linguagem visual antes de migrar páginas.

- Completar escalas semânticas 50–900 e tokens de superfície/texto/borda por tema.
- Criar tokens de tipografia, breakpoint, camada, duração e easing.
- Definir contratos de estado e tamanho para todos os controles.
- Criar testes de contraste e regras de foco, movimento reduzido e alvos táteis.
- Publicar documentação de uso e proibir novas cores diretas fora de exceções registradas.

Aceitação: tokens documentados, contraste AA automatizado e nenhuma duplicação entre CSS e TypeScript sem fonte definida.

### Sprint 104 — Componentes de formulário e login premium

Objetivo: concluir a experiência de autenticação e os controles fundamentais.

- Criar Select, Textarea, Checkbox, Radio, Switch e Field/FormMessage.
- Migrar o login para os componentes oficiais.
- Implementar mostrar/ocultar palavra-passe, Caps Lock, lembrar sessão e validação progressiva.
- Normalizar erros de autenticação sem revelar informações sensíveis.
- Melhorar recuperação de palavra-passe, login social, loading e transições.
- Validar desktop, tablet, mobile, ultrawide, teclado e leitor de ecrã.

Aceitação: login completo por teclado, responsivo de 320 px a ultrawide, sem cores diretas e com testes dos estados de sucesso/erro/loading.

### Sprint 105 — Overlays, navegação e feedback

Objetivo: padronizar componentes que controlam foco e comunicação.

- Criar Modal, Drawer, Tooltip, Popover, Dropdown/Menu e Command primitives.
- Criar Toast, Alert, Skeleton, EmptyState, LoadingState e ErrorState.
- Criar Tabs, Accordion, Breadcrumbs, Pagination, Avatar e Chip.
- Implementar focus trap, retorno de foco, Escape e anúncios por leitor de ecrã.
- Migrar header, sidebar, menu de conta, notificações e assistente global.

Aceitação: nenhum overlay principal com implementação local e testes de teclado aprovados.

### Sprint 106 — Dados, formulários e módulos operacionais

Objetivo: migrar os fluxos de trabalho com maior utilização.

- Criar Table/DataTable, List, filtros, ordenação e paginação responsiva.
- Migrar Dashboard, Centro de Operações, Explorações, Talhões, Missões e Ordens.
- Padronizar formulários, cards, estados vazios, erros e confirmações.
- Garantir alternativa mobile para tabelas largas e ações contextuais.

Aceitação: fluxos críticos sem controles HTML estilizados localmente e sem regressão funcional.

### Sprint 107 — Migração integral dos módulos

Objetivo: eliminar o legado visual restante.

- Migrar custos, financeiro, inventário, máquinas, diário, colheitas e rastreabilidade.
- Migrar clima, ambiente, irrigação, incêndio, cartografia, solo e agricultura de precisão.
- Migrar conformidade, documentos, tratamentos, IFAP/PEPAC, fiscal/laboral, auditoria, inteligência, analytics e automações.
- Rever mapas, gráficos, modais, tabelas, formulários, exportações e estados sem dados.

Aceitação: inventário automático sem componentes duplicados, cores diretas apenas em mapas/gráficos documentados e 100% das rotas revistas.

### Sprint 108 — Qualidade visual, WCAG AA e performance

Objetivo: certificar a experiência completa antes da publicação.

- Adicionar testes automatizados de acessibilidade e fluxos E2E.
- Criar matriz de regressão visual nos cinco grupos de viewport.
- Auditar navegação por teclado, leitores de ecrã, zoom 200% e contraste.
- Otimizar imagens, chunks, fontes, mapas e renderizações.
- Definir budgets de performance e corrigir mudanças de layout.
- Realizar revisão final de português, mensagens, SEO do site público e telemetria de erros sem dados sensíveis.

Aceitação: zero violações críticas/sérias de acessibilidade, fluxos E2E críticos aprovados, budgets cumpridos e checklist visual assinado por rota.

## Ordem de execução

As sprints devem ser realizadas na ordem 103 → 108. Migrar todas as páginas antes de completar os componentes faria o mesmo trabalho ser repetido. A Sprint 104 é a primeira entrega visível recomendada porque combina a fundação dos formulários com a renovação integral do login.

## Definição de pronto comum

Cada sprint deve manter os 175 testes existentes aprovados, adicionar testes para os novos componentes, concluir lint/build/PWA/segurança/integridade/smoke test e manter zero vulnerabilidades de produção. Cada entrega deve incluir ZIP, instruções Git Bash, preservação do `.env.local` e `.git`, e comandos de publicação no GitHub.
