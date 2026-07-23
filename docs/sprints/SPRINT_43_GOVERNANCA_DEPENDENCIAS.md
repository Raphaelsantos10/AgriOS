# Sprint 43 — Governança de dependências

## Objetivo

Evitar pull requests incompatíveis de ferramentas essenciais e tornar as falhas de compatibilidade fáceis de entender.

## Implementado

- Bloqueio de atualizações principais automáticas do TypeScript pelo Dependabot.
- Bloqueio de atualizações principais automáticas de `@types/node`.
- Continuidade das atualizações menores e de correção semanais.
- Validação da linha TypeScript 6 antes dos testes.
- Verificação de que `@types/node` corresponde ao Node 24 definido em `.nvmrc`.
- Novo comando `npm run check:toolchain`.
- Verificação integrada em `npm run validate` e no `FARPHA CI`.
- Mensagens explícitas quando uma atualização incompatível é introduzida.

## Razão técnica

O PR #4 tentou atualizar TypeScript 6 para 7 enquanto `typescript-eslint` ainda exigia uma versão inferior a 6.1. O `npm ci` detetou corretamente o conflito. Esta sprint transforma essa ocorrência numa regra permanente do projeto.

## Validação local

```bash
cd AgriOS/frontend
npm install
npm run validate
npm run dev
```

Resultado esperado: toolchain aprovada, 43 testes aprovados, lint sem erros, build concluído e limite de bundle aprovado.
