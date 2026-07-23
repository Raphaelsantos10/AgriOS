# Sprint 58 — Agenda operacional

## Objetivo

Transformar alertas agrícolas em tarefas acompanháveis com prazo, responsável, prioridade e estado.

## Implementado

- Botão `Criar tarefa deste alerta` na Central de Alertas.
- Formulário pré-preenchido com exploração, talhão, cultura, título, tipo e prioridade.
- Ação recomendada e origem do alerta preservadas nas observações.
- Responsável, prazo, custo e detalhes confirmados pelo utilizador.
- Estados: rascunho, planeada, em execução, concluída e cancelada.
- Agenda da exploração ligada à página de Ordens de Trabalho.
- Exportação CSV de todas as tarefas operacionais.
- Remoção de tarefas com confirmação.
- Eliminação das três ordens demonstrativas que eram criadas automaticamente.
- Tarefas reais do utilizador preservadas no armazenamento local do navegador.
- Três novos testes automatizados; total acumulado de 67 testes.

## Transparência dos dados

Nesta fase, as tarefas são guardadas localmente no navegador e não no Supabase. A sincronização empresarial será implementada numa sprint posterior.

## Validação local

```bash
cd AgriOS/frontend
npm install
npm run audit:prod
npm run validate
npm run dev
```

Abra uma exploração, crie uma tarefa a partir de um alerta e consulte `Ordens`.
