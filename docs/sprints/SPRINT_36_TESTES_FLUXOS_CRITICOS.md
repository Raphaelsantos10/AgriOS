# Sprint 36 — Testes dos fluxos críticos

## Objetivo

Proteger os fluxos fundamentais de explorações e talhões antes de avançar para novos módulos.

## Implementado

- Testes de listagem, detalhe, criação, atualização e remoção de explorações.
- Testes de listagem, detalhe, criação, atualização e remoção de talhões.
- Validação da passagem de geometria, área e estado do talhão.
- Testes da propagação de mensagens, códigos e detalhes de erros do repositório.
- Preservação de Supabase, autenticação, rotas e banco de dados.

## Validação

Execute dentro de `AgriOS/frontend`:

```bash
npm install
npm run test
npm run lint
npm run build
```

Resultado esperado: 17 testes aprovados, lint sem erros e build concluído.
