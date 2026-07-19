# Relatório de limpeza

## Alterações realizadas

- Mantida apenas uma aplicação React oficial em `frontend/`.
- Removidas da raiz as cópias estruturais de `src`, `public`, `assets`, `dist`, `node_modules` e configurações Vite.
- `node_modules` e `dist` foram excluídos do pacote; devem ser recriados com `npm install` e `npm run build`.
- Os recursos visuais da antiga pasta `assets/` foram movidos para `design/assets/`.
- Documentos de sprints foram centralizados em `docs/sprints/`.
- Ficheiros Markdown com conteúdo exatamente igual foram deduplicados.
- `.env.local` não foi incluído para proteger credenciais; foi criado `frontend/.env.example`.
- Foi criado um `.gitignore` único na raiz.

## Estrutura canónica

A pasta `frontend/` é a única aplicação web. Não volte a copiar uma sprint para a raiz do repositório. Para atualizar, substitua os ficheiros dentro de `frontend/` ou use Git.

## Validação

A estrutura e os ficheiros de configuração foram verificados. O build dentro deste ambiente não foi concluído porque o `node_modules` recebido foi instalado no Windows e continha dependências nativas incompatíveis com Linux. No teu computador, execute `npm install` novamente antes do build.
