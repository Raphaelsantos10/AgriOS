# Sprint 42 — Performance dos bundles

## Objetivo

Reduzir o tamanho do maior ficheiro JavaScript carregado pela aplicação e proteger o projeto contra regressões de tamanho no build.

## Implementado

- Separação do antigo bundle GIS em grupos dedicados para MapLibre, Turf e ferramentas de desenho.
- Preservação dos grupos independentes de React, Supabase e componentes visuais.
- Verificação automática dos ficheiros JavaScript gerados pelo build.
- Limite máximo de 1.050 KiB por bundle JavaScript.
- Falha explícita do build quando um bundle ultrapassa o limite.
- Integração da verificação no comando existente `npm run build`.
- Execução automática da proteção no `npm run validate` e no workflow `FARPHA CI`.

## Validação local

```bash
cd AgriOS/frontend
npm install
npm run validate
npm run dev
```

Resultado esperado: 43 testes aprovados, lint sem erros, build concluído e a mensagem `Limite de bundle aprovado`.
