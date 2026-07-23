# Sprint 92 — Assistente inteligente funcional

## Problema

O ícone de brilho do cabeçalho possuía aparência e descrição de assistente, mas não tinha qualquer ação de clique.

## Correção

O botão usa agora a navegação interna do React Router para abrir `/intelligence`, sem recarregar a aplicação. Por ser um botão HTML real, funciona por clique, Enter e barra de espaço. O foco visível foi reforçado.

O destino reúne recomendações explicáveis, confiança, riscos de doenças, plano de rega e atualização dos motores. A correção não cria respostas fictícias nem envia dados para um serviço externo de IA.

## Validação

- 50 ficheiros de teste e 166 testes aprovados.
- Lint, build, PWA, segurança, integridade e smoke test executados.
