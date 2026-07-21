# Sprint 95 — Notificações organizadas

## Modelo da caixa de entrada

O sino segue agora um modelo semelhante às redes sociais: o badge representa apenas itens não lidos, enquanto a aba `Todas` preserva o histórico. Abrir uma notificação grava a sua versão como lida, remove-a imediatamente de `Novas` e navega para o módulo de origem.

Cada versão é identificada por ID, título, descrição e gravidade. Atualizar a página ou pressionar atualizar não faz uma notificação antiga reaparecer. Se a origem alterar conteúdo ou gravidade, a nova versão volta a ser sinalizada.

## Ações

- Abrir e marcar individualmente como lida.
- Marcar todas como lidas.
- Dispensar individualmente.
- Limpar todas as já lidas.
- Atualizar os alertas do Centro de Operações.
- Consultar tempo relativo e destino.

Leitura e dispensa continuam locais ao dispositivo nesta etapa. A sincronização entre dispositivos depende da autenticação e de uma tabela remota específica, prevista para evolução posterior.

## Validação

- 52 ficheiros de teste e 175 testes aprovados.
- Cobertura de alerta alterado, versão dispensada e tempo relativo.
- Lint, TypeScript, build e verificações de produção incluídos.
