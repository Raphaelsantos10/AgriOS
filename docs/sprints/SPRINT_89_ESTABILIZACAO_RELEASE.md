# Sprint 89 — Estabilização e preparação de release

- Auditoria automática da configuração de navegação.
- Deteção de caminhos duplicados, caminhos inválidos e rótulos vazios.
- Verificação das rotas críticas: início, explorações, diário, rastreabilidade, obrigações, auditoria e definições.
- Navegação móvel validada com cinco destinos existentes e únicos.
- Quinto atalho móvel alterado de Mais/Diagnóstico para Auditoria.
- Bloqueio da Sprint 87 elevado acima da pesquisa global e marcado como diálogo modal.
- Confirmação das proteções globais de foco visível, redução de movimento e salto para o conteúdo.
- Três novos testes; total acumulado de 160.

## Verificação manual recomendada

1. Abrir todas as áreas do menu no computador.
2. Usar `Ctrl+K`, pesquisar um módulo, abrir e fechar com `Esc`.
3. Ativar o bloqueio, abrir a pesquisa e confirmar que o bloqueio permanece acima de tudo.
4. Testar os cinco atalhos num ecrã móvel.
5. Exportar PDF, ZIP de auditoria e backup cifrado usando apenas dados fictícios.
6. Confirmar que FARPHA CI e FARPHA Security ficam verdes após o push.

Esta sprint prepara uma release consolidada, mas não substitui testes com utilizadores reais, auditoria externa de segurança, autenticação no servidor e RLS antes de produção.
