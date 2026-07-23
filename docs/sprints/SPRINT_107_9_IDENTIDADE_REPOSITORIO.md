# Sprint 107.9 — Identidade FARPHA e organização do repositório

## Objetivo

Consolidar a identidade FARPHA, recuperar o histórico perdido e reduzir risco
antes da publicação, sem alterar módulos agrícolas, dados ou Supabase.

## Entregas

- Histórico completo do changelog recuperado.
- Proteção automática contra novo truncamento.
- Nome técnico do frontend alterado para `farpha-frontend`.
- Verificador de identidade integrado em `npm run validate`.
- Páginas públicas V2/V3 e recursos padrão Vite/React removidos por estarem sem uso.
- Ativos duplicados da marca removidos, mantendo somente os oficiais.
- `.gitattributes` para line endings previsíveis no Windows e CI.
- Governança de marca, índice documental, política de arquivo e contribuição.
- Templates GitHub para pull requests, erros e novas funcionalidades.
- Guia manual para futura mudança do nome do repositório.

## Limites

- Não altera o projeto Supabase e não requer SQL.
- Não muda o URL do repositório automaticamente.
- Não transforma módulos demonstrativos em integrações reais.
- Não inclui segredos, `.env.local`, dependências ou build no ZIP.

## Aceitação

```bash
cd frontend
npm run validate
npm run audit:prod
```

Além da validação anterior, `verify:brand` deve passar e a auditoria deve
confirmar mais de 1.400 linhas de histórico.
