# Sprint 49 — Integridade do artefato

## Objetivo

Comprovar automaticamente que o diretório de produção corresponde exatamente ao manifesto criado no build.

## Implementado

- Novo comando `npm run verify:dist`.
- Leitura e validação do formato de `build-manifest.json`.
- Deteção de ficheiros esperados que estejam ausentes.
- Deteção de ficheiros inesperados acrescentados ao `dist`.
- Verificação do tamanho de cada ficheiro.
- Recálculo e comparação do hash SHA-256 de cada ficheiro.
- Verificação da contagem e do tamanho total do artefato.
- Falha explícita com o caminho do ficheiro inconsistente.
- Verificação integrada em `npm run validate` antes do smoke test.
- Execução automática no `FARPHA CI` antes do upload do artefato.

## Validação local

```bash
cd AgriOS/frontend
npm install
npm run audit:prod
npm run validate
npm run dev
```

Resultado esperado: `Integridade aprovada`, seguida do smoke test de produção aprovado.
