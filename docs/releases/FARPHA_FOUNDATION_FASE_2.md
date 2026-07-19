# FARPHA Release 2.0 — Foundation Fase 2

## Objetivo

Aplicar a identidade FARPHA ao shell da aplicação sem alterar a lógica interna das páginas, do GIS ou do Supabase.

## Alterações

- Novo App Shell responsivo.
- Sidebar recolhível no desktop e menu sobreposto no mobile.
- Navegação agrupada e centralizada em `src/app/navigation.ts`.
- Header FARPHA com pesquisa visual, estado online, Intelligence, notificações e perfil.
- Status bar com estado da plataforma, Supabase e versão.
- Aplicação dos tokens visuais FARPHA ao layout principal.
- Módulos futuros apresentados como indisponíveis, sem criar rotas quebradas.

## Não alterado

- Rotas existentes.
- Dashboard e páginas internas.
- CRUD de explorações e talhões.
- GIS, MapLibre, importações e exportações.
- Missões, calendário e analytics.
- Banco de dados e RLS.

## Testes recomendados

1. Abrir Dashboard, Explorações, Missões, Calendário e Analytics.
2. Recolher e expandir a sidebar em desktop.
3. Redimensionar o browser para testar o menu mobile.
4. Abrir uma exploração e confirmar o mapa sem deformações.
5. Confirmar que links ativos recebem destaque verde-lima.
6. Executar `npm run lint` e `npm run build`.
