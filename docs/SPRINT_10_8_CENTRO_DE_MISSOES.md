# Sprint 10.8 — Centro de Missões

## Entrega
- Página `/missoes` adicionada ao menu.
- CRUD completo de missões no Supabase.
- Prioridades, estados, responsável, datas, notas e checklist.
- Associação opcional a um talhão e obrigatória a uma exploração.
- Filtros de pesquisa, estado e prioridade.
- Ações rápidas: iniciar, pausar, concluir, editar e eliminar.
- Acesso à exploração no mapa a partir da missão.

## Instalação
1. Execute `database/SPRINT_10_8_MISSIONS.sql` no SQL Editor do Supabase.
2. Copie os ficheiros do ZIP para a raiz do projeto AgriOS.
3. Execute `npm run build`, `npm run lint` e `npm run dev` dentro de `frontend`.

## Testes
- Criar missão sem talhão e com talhão.
- Editar prioridade, responsável, datas e checklist.
- Iniciar, pausar e concluir.
- Filtrar por estado e prioridade.
- Abrir o talhão no mapa.
- Eliminar a missão.
