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
