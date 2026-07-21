# Sprint 98 - Autenticacao em dois fatores e sessoes

## Entregue

- Cadastro TOTP por QR Code e chave manual.
- Compatibilidade com Google Authenticator, Microsoft Authenticator e Authy.
- Confirmacao do codigo antes de ativar o fator.
- Desafio de segundo fator depois do login quando a conta exige AAL2.
- Listagem e remocao dos autenticadores cadastrados.
- Encerramento das outras sessoes sem desligar o dispositivo atual.
- Recuperacao de palavra-passe por email preservada.
- Recursos desativados de forma clara no modo local.

## Seguranca

- O segredo TOTP nao e guardado no localStorage.
- O segredo e apresentado apenas durante o cadastro.
- A remocao exige confirmacao e uma sessao AAL2 para fatores verificados.

## Validacao

- 175 testes aprovados.
- Lint, build, PWA, seguranca, integridade e smoke test aprovados.
- Zero vulnerabilidades de producao.

