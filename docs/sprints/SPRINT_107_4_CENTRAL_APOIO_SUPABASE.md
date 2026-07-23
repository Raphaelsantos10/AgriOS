# Sprint 107.4 — Central de Apoio Supabase

## Resultado

Os pedidos da Central de Ajuda passam a funcionar entre dispositivos e contas autenticadas. O FARPHA mantém uma cópia local para tolerar falhas de ligação, sincroniza com o Supabase quando possível e oferece uma caixa de entrada administrativa protegida por RLS.

## Entregas

- Tabelas `support_tickets`, `support_ticket_messages` e `support_admins`.
- RLS para cada utilizador consultar apenas os próprios pedidos e mensagens.
- Função segura `is_farpha_support_admin()` sem expor a lista administrativa.
- Caixa administrativa para utilizadores explicitamente autorizados.
- Estados: Aberto, Em análise, Aguardando utilizador, Resolvido e Encerrado.
- Conversa entre utilizador e equipa dentro de cada pedido.
- Atualizações Realtime e notificações no FARPHA.
- Migração automática de pedidos locais ainda não sincronizados.
- Fallback local quando estiver offline ou antes da instalação do SQL.
- Repositório isolado entre a interface e o Supabase.
- Email e WhatsApp continuam disponíveis como canais alternativos.

## Segurança

- Nenhuma operação utiliza `service_role` no navegador.
- O frontend utiliza somente a sessão autenticada e a chave pública anon/publishable.
- A tabela `support_admins` não permite leitura ou alteração pelo frontend.
- A autorização administrativa é verificada por função `security definer`.
- Utilizadores comuns não podem responder como equipa.
- Mensagens não podem ser adicionadas a pedidos encerrados.
- Não existe política de eliminação de pedidos, preservando o histórico.

## Administração

Depois de executar a migração, o primeiro administrador deve ser inserido manualmente pelo SQL Editor. Esta ação não é feita automaticamente durante cadastro e não pode ser executada pelo frontend.

## Funcionamento offline

Um pedido criado sem rede fica guardado no navegador. Ao abrir a aba Pedidos com sessão autenticada e ligação disponível, o FARPHA tenta sincronizá-lo. A referência `FAR-` é preservada para impedir duplicações.

## Validação

- Vitest: 60 ficheiros e 203 testes aprovados.
- ESLint: aprovado.
- TypeScript e build Vite: aprovados.
- MarketingSiteV4: aprovado.
- PWA, segurança, integridade e smoke test: aprovados.

