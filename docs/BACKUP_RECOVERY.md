# FARPHA — Backup e recuperação

## Dois tipos de dados

O FARPHA possui dados locais no navegador e dados remotos no Supabase. Um backup local não contém tabelas, utilizadores, ficheiros ou políticas do Supabase.

## Backup local

1. Abra `Sistema > Definições`.
2. Pressione `Exportar backup local`.
3. Guarde o JSON num local protegido e com controlo de acesso.
4. Verifique se o ficheiro possui `format: farpha-local-backup` e `version: 1`.

Para restaurar, use `Restaurar backup local`, selecione o JSON, confirme a substituição e recarregue a aplicação. A importação aceita somente chaves iniciadas por `farpha.`.

## Backup remoto

Configure no Supabase o plano de retenção adequado, responsáveis, alertas e processo de recuperação. Inclua base de dados, autenticação, Storage e configurações necessárias. A disponibilidade depende do plano e da configuração da conta.

## Teste de recuperação

Um backup só é considerado válido depois de uma recuperação de teste num ambiente isolado. Registe data, versão, responsável, duração, consistência dos dados e problemas encontrados. Nunca teste uma restauração destrutiva diretamente em produção.
