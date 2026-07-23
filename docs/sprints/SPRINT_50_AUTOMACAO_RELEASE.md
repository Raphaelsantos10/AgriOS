# Sprint 50 — Automação de release

## Objetivo

Criar um processo controlado para transformar tags versionadas em pacotes de release totalmente validados.

## Implementado

- Workflow independente `FARPHA Release`.
- Execução exclusiva em tags iniciadas por `v`.
- Validação do formato semântico `vMAJOR.MINOR.PATCH`.
- Comparação obrigatória entre a tag e a versão do `package.json`.
- Novo comando `npm run check:release -- v2.1.0`.
- Instalação determinística com `npm ci`.
- Auditoria de dependências de produção antes da release.
- Execução integral da toolchain, 43 testes, lint, build, manifesto, integridade e smoke test.
- Artefato nomeado `farpha-release-v2.1.0` e conservado durante 30 dias.
- Permissões apenas de leitura; o workflow não publica nem altera código automaticamente.

## Validar localmente

```bash
cd AgriOS/frontend
npm install
npm run check:release -- v2.1.0
npm run audit:prod
npm run validate
```

## Criar a release opcional

Somente depois de a Sprint 50 estar verde na `main`:

```bash
cd ~/Documents/Projetos/AgriOS
git tag -a v2.1.0 -m "FARPHA v2.1.0"
git push origin v2.1.0
```

Depois, abra `Actions > FARPHA Release` e descarregue `farpha-release-v2.1.0`.
