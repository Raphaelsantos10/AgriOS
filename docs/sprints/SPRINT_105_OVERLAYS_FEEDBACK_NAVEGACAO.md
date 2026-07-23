# Sprint 105 — Overlays, feedback e navegação

## Entregas

- Modal e Drawer com Escape, bloqueio de scroll, ciclo de foco e retorno ao elemento de origem.
- Tooltip, Popover e Menu com camadas oficiais e fecho por Escape/clique exterior.
- Toast global com fila, encerramento manual, expiração e anúncios acessíveis.
- Alert, Skeleton, EmptyState, LoadingState e ErrorState.
- Tabs e Accordion com semântica ARIA.
- Breadcrumbs e Pagination responsivos.
- Avatar e Chip oficiais.
- Pontes de compatibilidade para Modal, EmptyState e Avatar legados.
- Camadas do Command Palette, notificações e assistente migradas para tokens.

## Acessibilidade

Overlays oficiais guardam e restauram foco, mantêm a navegação por Tab no interior e fecham com Escape. Feedback urgente utiliza `role=alert`; feedback não urgente utiliza `role=status`. Tabs, menus, paginação, acordeões e percursos possuem nomes e estados acessíveis.

## Próxima etapa

A Sprint 106 criará DataTable/List e migrará os módulos operacionais prioritários: Dashboard, Centro de Operações, Explorações, Talhões, Missões e Ordens.

## Validação

- 184 testes aprovados.
- Lint e build aprovados.
- PWA, segurança, integridade e smoke test aprovados.
- Zero vulnerabilidades de produção.
