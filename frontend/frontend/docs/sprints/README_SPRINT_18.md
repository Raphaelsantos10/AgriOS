# FARPHA Sprint 18 — Ordens de Trabalho

## Entrega

- Nova rota `/ordens`.
- Página responsiva para desktop, tablet e mobile.
- KPIs operacionais.
- Pesquisa e filtro por estado.
- Criação de ordens em modal.
- Alteração de estado diretamente na listagem.
- Persistência local para teste imediato, sem depender do Supabase.
- Migração SQL pronta para `public.work_orders`.

## Instalação

Copie o conteúdo da pasta `frontend` sobre a pasta `frontend` atual e aceite substituir os ficheiros.

```bash
npm install
npm run build
npm run dev
```

## Base de dados

Quando quiser ligar o módulo ao Supabase, execute:

`database/migrations/20260717_create_work_orders.sql`

A versão desta sprint usa `localStorage` de propósito, para que a interface e os fluxos possam ser testados antes da integração remota.

## Teste rápido

1. Abra **Ordens de Trabalho** na barra lateral.
2. Pesquise por exploração ou responsável.
3. Filtre pelo estado.
4. Crie uma nova ordem.
5. Altere o estado para **Em execução** ou **Concluída**.
6. Recarregue a página e confirme que os dados permanecem guardados.
