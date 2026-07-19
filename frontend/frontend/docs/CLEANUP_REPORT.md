# FARPHA — Relatório de limpeza estrutural

- Eliminada a pasta duplicada `frontend/frontend`.
- Mantida uma única aplicação Vite em `frontend`.
- Recuperados e integrados os módulos `intelligence` e `engines/ai` que existiam apenas na cópia interna.
- Mantido o módulo `automation` da Sprint 30.
- Restauradas simultaneamente as rotas `/intelligence` e `/automacoes`.
- Removidos `node_modules`, `dist` e `.env.local` do pacote distribuído.
- Documentação de sprints organizada em `docs/sprints`.
- `.gitignore` atualizado para evitar novas duplicações e ficheiros gerados.
