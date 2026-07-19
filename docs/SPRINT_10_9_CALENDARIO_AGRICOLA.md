# Sprint 10.9 — Calendário Agrícola

## Funcionalidades

- Nova rota `/calendario` e item no menu lateral.
- Vista mensal com semana iniciada à segunda-feira.
- Missões distribuídas pelos dias conforme `start_date`.
- Navegação entre meses e atalho para o dia atual.
- KPIs mensais: total, em andamento, concluídas e críticas.
- Painel do dia selecionado.
- Duplo clique num dia para criar uma atividade às 08:00.
- Criação, edição, alteração de estado e eliminação usando o Centro de Missões já existente.
- Associação a exploração e talhão preservada.

## Base de dados

Não exige uma tabela nova. Esta sprint reutiliza `public.missions` criada na Sprint 10.8.

## Instalação

Extraia o ZIP na raiz do projeto `AgriOS/` e aceite substituir os ficheiros.

```bash
cd frontend
npm run build
npm run lint
npm run dev
```

## Testes

1. Abra `Calendário` no menu.
2. Navegue para o mês anterior e seguinte.
3. Clique num dia e confirme o painel lateral.
4. Faça duplo clique num dia e crie uma atividade.
5. Confirme que a missão surge no calendário e no Centro de Missões.
6. Abra a atividade e altere o estado.
7. Atualize a página para validar persistência.

## Validação realizada

- TypeScript: aprovado.
- ESLint nos ficheiros alterados: aprovado.
