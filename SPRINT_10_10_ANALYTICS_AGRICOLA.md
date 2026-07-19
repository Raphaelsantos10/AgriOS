# Sprint 10.10 — Analytics Agrícola

## Entrega

Esta sprint acrescenta uma página de Analytics baseada nos dados reais das tabelas `farms`, `fields` e `missions` do Supabase.

## Funcionalidades

- KPIs de explorações, talhões, área, missões e saúde.
- Missões por estado e prioridade.
- Saúde dos talhões.
- Culturas por área.
- Atividade operacional dos últimos seis meses.
- Ranking das explorações.
- Atualização manual dos dados.

## Instalação

Extraia o ZIP na raiz `AgriOS/`, substituindo os ficheiros indicados.

```bash
cd frontend
npm run build
npm run lint
npm run dev
```

## Testes

1. Abrir `Analytics` no menu lateral.
2. Confirmar os totais das explorações, talhões e missões.
3. Criar ou concluir uma missão.
4. Clicar em `Atualizar dados`.
5. Confirmar que os indicadores e distribuições mudaram.

## Commit recomendado

```bash
git add .
git commit -m "feat: analytics agricola com dados operacionais"
git push origin main
```
