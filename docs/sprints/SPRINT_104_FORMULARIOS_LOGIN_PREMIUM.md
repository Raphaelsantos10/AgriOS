# Sprint 104 — Formulários e Login Premium

## Entregas

- Componentes oficiais Select, Textarea, Checkbox, Radio, Switch e FormMessage.
- Input oficial com ação final, sucesso acessível e estado de erro semântico.
- Login reconstruído com os componentes do Design System.
- Mostrar/ocultar palavra-passe com nome acessível e estado pressionado.
- Deteção de Caps Lock durante o preenchimento da palavra-passe.
- Validação progressiva do email após interação.
- Opção “Lembrar-me” com armazenamento da sessão controlado entre navegador e sessão atual.
- Recuperação de palavra-passe com resposta neutra para evitar revelar contas existentes.
- Normalização de erros técnicos de autenticação.
- Loading acessível, prevenção de múltiplos envios e mensagens por `aria-live`.
- Layout responsivo de 320 px a ultrawide, duas colunas no desktop e uma no mobile.

## Segurança

O FARPHA não guarda a palavra-passe. Quando “Lembrar-me” está desativado, o token de autenticação utiliza armazenamento de sessão; quando ativado, utiliza armazenamento persistente do navegador. A recuperação apresenta a mesma confirmação independentemente da existência da conta.

## Próxima etapa

A Sprint 105 padronizará overlays, menus, feedback, estados vazios/carregamento/erro e navegação avançada.

## Validação

- 181 testes aprovados.
- Lint e build aprovados.
- PWA, segurança, integridade e smoke test aprovados.
- Zero vulnerabilidades de produção.
