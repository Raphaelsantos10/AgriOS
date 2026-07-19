# FARPHA Environment Engine V1

## Objetivo
Criar um perfil ambiental persistente por talhão, base para aptidão de culturas, rega inteligente, alertas climáticos, Fire Intelligence e FARPHA DNA.

## Instalação
1. Extrair este patch na raiz `AgriOS/`.
2. Executar `database/FARPHA_ENVIRONMENT_ENGINE_V1.sql` no SQL Editor do Supabase.
3. Em `frontend`, executar `npm run lint`, `npm run build` e `npm run dev`.

## Teste
1. Abrir uma exploração.
2. Selecionar um talhão.
3. Clicar em **Perfil ambiental**.
4. Preencher os dados e guardar.
5. Atualizar a página e confirmar a persistência.

A percentagem apresentada mede a completude/confiança dos dados, não a aptidão de uma cultura.
