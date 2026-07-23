# Sprint 45 — Artefato de produção verificável

## Objetivo

Transformar cada build aprovado da branch principal num pacote de produção descarregável e verificável.

## Implementado

- Geração automática de `dist/build-manifest.json`.
- Inventário ordenado de todos os ficheiros do build.
- Registo do tamanho em bytes e hash SHA-256 de cada ficheiro.
- Total de ficheiros e tamanho total do build no manifesto.
- Manifesto determinístico, sem data ou informação específica da máquina.
- Nova etapa `Guardar build de produção` no `FARPHA CI`.
- Upload do diretório `frontend/dist` depois da validação completa.
- Artefato criado apenas em pushes da `main` e execuções manuais.
- Retenção de 14 dias e compressão máxima para controlar armazenamento.

## Validação local

```bash
cd AgriOS/frontend
npm install
npm run audit:prod
npm run validate
npm run dev
```

Depois do build, confirme a existência de `frontend/dist/build-manifest.json`.

## Obter o build no GitHub

1. Abra `Actions > FARPHA CI`.
2. Abra a execução verde da Sprint 45.
3. Na secção `Artifacts`, descarregue `farpha-production-...`.

O artefato é o conteúdo pronto para hospedagem estática; as variáveis de ambiente necessárias continuam a ser definidas no momento do build.
