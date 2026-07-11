# AgriOS — Sprint 9.1: Undo/Redo do Editor GIS

## Funcionalidades

- Desfazer e refazer alterações nos limites do talhão.
- Botões no painel lateral durante a edição.
- Atalhos Ctrl+Z, Ctrl+Y e Ctrl+Shift+Z.
- Cada arrasto completo de um vértice cria uma etapa no histórico.
- Adicionar ou remover um vértice também cria uma etapa.
- Máximo de 60 etapas por sessão de edição.
- Cancelar elimina o histórico e recupera a geometria guardada.
- Guardar persiste apenas a versão atualmente visível.

## Instalação

1. Faça uma cópia da sua pasta `frontend` atual.
2. Extraia este ZIP dentro da pasta principal `AgriOS` e permita substituir os ficheiros.
3. Preserve o seu ficheiro local `frontend/.env.local`.
4. Execute:

```bash
cd frontend
npm install
npm run dev
```

## Validação

```bash
npm run build
npm run lint
```

## Teste funcional

1. Abra uma exploração e selecione um talhão.
2. Clique em `Editar limites`.
3. Arraste um vértice azul e solte-o.
4. Clique em `Desfazer` e depois em `Refazer`.
5. Clique num ponto branco para adicionar um vértice.
6. Use Ctrl+Z e Ctrl+Y.
7. Clique com o botão direito num vértice azul para removê-lo.
8. Teste `Cancelar` e confirme que os dados originais regressam.
9. Repita e clique em `Guardar limites`.
10. Atualize a página para confirmar a persistência.

## Commit sugerido

```bash
git add .
git commit -m "feat: adicionar undo e redo ao editor GIS"
git push origin main
```
