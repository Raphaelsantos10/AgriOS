# Fundamentos do Design System FARPHA

## Princípios

1. Clareza antes de decoração.
2. Uma única linguagem visual em site, autenticação e aplicação.
3. Contraste WCAG AA para texto e estados essenciais.
4. Navegação completa por teclado e alvos táteis de pelo menos 44 × 44 px nas ações principais.
5. Movimento discreto, com respeito pela preferência de movimento reduzido.
6. Tokens antes de valores diretos.

## Cores

- `brand`: identidade verde FARPHA, escala 50–950.
- `neutral`: fundos, superfícies, texto e bordas, escala 0–950.
- `success`, `warning`, `danger` e `info`: escalas 50–900.
- Para mensagens, usar fundo 50 e texto 700 no tema claro.
- Para temas escuros, usar as classes semânticas globais, que aplicam pares próprios.

Novos componentes não devem introduzir hexadecimais próprios. Exceções são mapas, gráficos e conteúdo proveniente de serviços externos, devendo ficar documentadas no módulo.

## Tipografia

As classes oficiais são `farpha-display`, `farpha-heading-1` a `farpha-heading-4`, `farpha-body`, `farpha-body-sm`, `farpha-caption` e `farpha-label`. Títulos usam alturas de linha compactas; conteúdo usa 1.5 ou 1.65.

## Espaçamento e layout

O espaçamento usa uma base de 4 px. As larguras oficiais de conteúdo são 720, 1040 e 1440 px. Os breakpoints exportados abrangem 320, 640, 768, 1024, 1280 e 1536 px.

## Movimento e camadas

As durações são 140 ms, 220 ms e 320 ms. Componentes devem usar os easings oficiais. A ordem de camadas é base, sticky, dropdown, overlay, modal, toast e assistant.

## Estados obrigatórios

Todo controle interativo deve definir, quando aplicável: default, hover, active, focus-visible, disabled, loading, success e error. O foco nunca pode depender apenas de alteração de cor.

## Acessibilidade

- Labels visíveis para campos; `aria-label` apenas quando um rótulo visual não for adequado.
- Erros ligados ao campo com `aria-describedby` e `aria-invalid`.
- Mudanças assíncronas anunciadas com `aria-live` ou `role=status`.
- Overlays devem gerir foco, Escape e retorno de foco.
- A ligação “Saltar para o conteúdo principal” é fornecida pelo layout global.
- Animações são desativadas automaticamente quando `prefers-reduced-motion` está ativo.
