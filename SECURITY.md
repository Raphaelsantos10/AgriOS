# Política de segurança do FARPHA

## Versões suportadas

| Versão | Suporte de segurança |
| --- | --- |
| `main` | Sim |
| Versões anteriores | Não |

## Comunicar uma vulnerabilidade

Não publique vulnerabilidades ou dados sensíveis numa issue pública.

No repositório do FARPHA no GitHub, abra **Security > Advisories > New draft security advisory** e descreva:

- o componente afetado;
- os passos mínimos para reproduzir o problema;
- o impacto observado ou esperado;
- uma sugestão de correção, quando existir.

Remova credenciais, chaves, tokens, dados pessoais e informações reais de clientes das evidências.

## Tratamento

A vulnerabilidade deve ser confirmada, classificada e corrigida numa branch privada antes da divulgação. Dependências e workflows são acompanhados pelo Dependabot; o código JavaScript e TypeScript é analisado pelo CodeQL.

## Segredos

- Chaves privadas pertencem aos Secrets do Supabase ou ao cofre do fornecedor.
- Variáveis `VITE_*` são públicas e nunca podem conter credenciais privadas.
- `.env`, `.env.local`, builds e `node_modules` não são versionados.
- O workflow `FARPHA Repository Audit` bloqueia padrões evidentes de tokens e
  ficheiros proibidos.

Se um segredo for publicado, apague-o da utilização atual, revogue-o no
fornecedor e crie uma nova credencial. Remover apenas o ficheiro do commit mais
recente não elimina o segredo do histórico.

## Controlos automáticos

- `FARPHA CI`: testes, lint, build e validações de produção.
- `FARPHA Security`: CodeQL para JavaScript e TypeScript.
- `FARPHA Repository Audit`: infraestrutura obrigatória, histórico, ficheiros
  gerados e padrões de segredo.
- Dependabot: dependências npm e GitHub Actions.
- `FARPHA Release`: validação de tags e artefactos de release.
