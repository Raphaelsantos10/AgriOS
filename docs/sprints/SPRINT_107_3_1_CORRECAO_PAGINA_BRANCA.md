# Sprint 107.3.1 — Correção preventiva da página branca

## Problema comunicado

Depois da instalação da Sprint 107.3, a aplicação abriu com a página totalmente branca num ambiente Windows/Git Bash.

## Correções

- Utilitários da Central de Apoio receberam um nome de ficheiro inequívoco para Windows.
- Todas as importações do cabeçalho, menu da conta, assistente e testes foram atualizadas.
- A instalação corrigida força a reconstrução do cache de desenvolvimento do Vite.
- A página pública MarketingSiteV4, login, cadastro e módulos agrícolas foram preservados.

## Recuperação

A instalação deve ser feita com o servidor parado. Depois de extrair o ZIP, o comando remove apenas `frontend/node_modules/.vite`, executa novamente a validação e inicia o Vite com `--force`.

## Validação

- Vitest: 60 ficheiros e 202 testes aprovados.
- ESLint: aprovado.
- TypeScript e build Vite: aprovados.
- MarketingSiteV4: aprovado.
- PWA, segurança, integridade e smoke test: aprovados.

