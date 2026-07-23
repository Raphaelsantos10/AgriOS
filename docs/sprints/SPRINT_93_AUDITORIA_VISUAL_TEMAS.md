# Sprint 93 — Auditoria visual dos temas

## Problema confirmado

Módulos mais recentes usam tokens FARPHA, mas vários módulos antigos ainda continham cores Tailwind fixas para fundo branco e texto escuro. No tema escuro, o cartão mudava de fundo através do componente partilhado enquanto títulos, descrições, campos e opções permaneciam com a cor original. Isso criava texto escuro sobre fundo escuro e opções quase brancas sobre listas brancas.

## Alcance da correção

- 186 ocorrências de fundo branco antigo cobertas.
- Mais de 500 ocorrências de texto cinza antigo normalizadas no tema escuro.
- Mais de 220 bordas e divisores claros compatibilizados.
- Inputs, selects, opções, textareas, placeholders, tabelas e estados vazios.
- Cores de sucesso, perigo, aviso e informação recalibradas.
- Pesquisa global, barra inferior e navegação móvel convertidas diretamente para tokens.
- Aviso PWA compactado e controlos do mapa deslocados em ecrãs estreitos.

As páginas de operação deliberadamente escuras mantêm as suas cores próprias. A camada de compatibilidade atua sobre utilitários antigos de interface clara sem substituir texto branco intencional desses módulos.

## Contraste

Foi incluído um cálculo WCAG de luminância relativa e contraste. Os pares principais passam o mínimo de 4,5:1 para texto normal:

| Tema | Texto | Fundo |
| --- | --- | --- |
| Claro | `#17251c` | `#ffffff` |
| Escuro | `#eef7f1` | `#101c14` |

## Validação

- 51 ficheiros de teste e 169 testes aprovados.
- Lint, TypeScript, build, PWA, segurança, integridade e smoke test incluídos.
