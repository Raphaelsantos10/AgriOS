# FARPHA / AgriOS — Release 1.0 RC1

## Sprint 10.12 — Qualidade e Estabilização

### Entregue

- Error Boundary global para impedir ecrãs em branco.
- Página 404 para rotas inexistentes e módulos ainda não implementados.
- Carregamento modular preservado com React.lazy e Suspense.
- Componente reutilizável EmptyState.
- Referência de erro visível para facilitar suporte.
- Detalhes técnicos do erro mostrados apenas em desenvolvimento.

### Checklist manual

1. Abrir `/` e confirmar o Dashboard.
2. Abrir `/exploracoes`.
3. Abrir uma exploração e testar o mapa.
4. Abrir `/missoes`.
5. Abrir `/calendario`.
6. Abrir `/analytics`.
7. Abrir uma rota inexistente, por exemplo `/pagina-inexistente`.
8. Confirmar que aparece a página 404 e não um ecrã vazio.
9. Executar `npm run build`.
10. Executar `npm run lint`.

### Nota

Os itens do menu ainda não implementados passam a mostrar a página 404 de forma segura. Eles poderão ser substituídos pelos módulos reais nas próximas releases.
