# FARPHA — Correção de imports

Este patch inclui integralmente as páginas e componentes de:

- Diagnóstico
- Digital Twin

Além dos ficheiros `App.tsx` e `navigation.ts` sincronizados.

## Instalação

Extraia o conteúdo diretamente na raiz do projeto AgriOS e aceite substituir os ficheiros.

Estrutura esperada:

AgriOS/frontend/src/features/diagnostics
AgriOS/frontend/src/features/digital-twin
AgriOS/frontend/src/app/App.tsx
AgriOS/frontend/src/app/navigation.ts

Depois execute dentro de `frontend`:

npm run lint
npm run build
npm run dev

Se o servidor Vite já estiver aberto, pare-o com Ctrl+C e inicie novamente.
