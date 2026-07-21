# Sprint 96 - Painel, temas e relogio em tempo real

## Objetivo

Corrigir a falta de contraste no cabecalho do painel no tema claro e manter a
saudacao, a data e a hora local atualizadas sem recarregar a pagina.

## Alteracoes

- O cabecalho do Dashboard passou a usar cores semanticas controladas pelo tema.
- Saudacao, data, hora, previsao e indicadores mantem contraste nos temas claro e escuro.
- Os cartoes do cabecalho usam bordas, fundos e textos especificos para cada tema.
- A hora local passa a atualizar a cada segundo.
- O relogio e sincronizado imediatamente ao voltar para a aba ou focar a janela.
- Os valores longos dos cartoes nao provocam sobreposicao em telas menores.

## Validacao

- 175 testes aprovados.
- Lint aprovado.
- Build de producao aprovado.
- PWA, seguranca, integridade e smoke test aprovados.
- Zero vulnerabilidades de producao.

