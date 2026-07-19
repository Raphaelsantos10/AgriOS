# Sprint 10.11 — Performance e carregamento modular

## Alterações

- As páginas principais passam a usar `React.lazy`.
- Cada rota é descarregada apenas quando o utilizador a abre.
- Novo indicador visual de carregamento entre páginas.
- Separação dos fornecedores React, GIS, Supabase e UI em chunks próprios.
- Limite de aviso ajustado para refletir o peso natural do motor GIS.

## Instalação

Extraia este ZIP na pasta principal `AgriOS` e permita substituir os ficheiros.

```bash
cd frontend
npm run build
npm run lint
npm run dev
```

## Testes

1. Abrir Dashboard.
2. Abrir Explorações e uma exploração.
3. Abrir Missões, Calendário e Analytics.
4. Confirmar que o indicador “A carregar módulo” aparece brevemente.
5. Confirmar que o mapa, importação GIS e editor continuam funcionais.
6. Verificar os ficheiros produzidos em `dist/assets` após o build.

## Validação realizada

- TypeScript: aprovado.
- ESLint dos ficheiros alterados: aprovado.
- O build Vite não foi executado neste ambiente porque o `node_modules` recebido contém o binário Rolldown do Windows; execute o build no computador do projeto.
