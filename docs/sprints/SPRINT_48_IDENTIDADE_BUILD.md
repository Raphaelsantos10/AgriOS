# Sprint 48 — Identidade e rastreabilidade do build

## Objetivo

Permitir identificar com precisão qual versão e commit do FARPHA originaram cada artefato de produção.

## Implementado

- Geração automática de `dist/build-info.json`.
- Identificação da aplicação e versão do `package.json`.
- Versão do pacote alinhada com a base documentada FARPHA v2.1 Stable.
- Registo do SHA do commit fornecido pelo GitHub Actions.
- Registo do identificador da execução do workflow quando disponível.
- Registo da versão do Node utilizada no build.
- Distinção entre builds locais e builds do CI.
- Inclusão do `build-info.json` no manifesto SHA-256.
- Cartão de identificação na página `Diagnóstico`.
- Carregamento silencioso em desenvolvimento, onde o ficheiro ainda não existe.
- Smoke test atualizado para rejeitar artefatos sem identificação completa.

## Validação local

```bash
cd AgriOS/frontend
npm install
npm run audit:prod
npm run validate
npm run dev
```

No build local, o commit aparece como `local`. No artefato criado pelo GitHub, aparece o SHA real do commit.
