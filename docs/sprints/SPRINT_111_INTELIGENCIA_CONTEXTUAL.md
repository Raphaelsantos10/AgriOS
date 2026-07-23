# Sprint 111 — Inteligência contextual e mensurável

## Objetivo

Transformar a integração segura criada na Sprint 107.6 numa assistência
contextual, transparente e controlável, preservando o guia local quando a API
está indisponível ou sem saldo.

## Entregas

- Consentimento explícito, desativado por predefinição.
- Contexto agregado de explorações, talhões, ordens e custos do utilizador.
- Exclusão de nomes, coordenadas, geometrias, descrições e responsáveis.
- Indicação de fonte, atualização, latência e consumo de tokens.
- Limites por perguntas/hora e tokens/dia.
- Telemetria RLS sem duplicar conteúdo das mensagens.
- `store: false` na OpenAI Responses API.
- Fallback local verificado para ausência de Internet, quota ou falha.
- Migração Supabase idempotente.
- Testes de consentimento e mensagens seguras.

## Estado honesto

Esta sprint melhora a Inteligência do **Centro de Ajuda**. A página
`/intelligence` continua demonstrativa porque os seus indicadores usam um
snapshot simulado. Recomendações agrícolas continuam a exigir validação com
técnicos e dados reais.

## Instalação

1. Instalar o ZIP cumulativo.
2. Executar `database/SPRINT_111_CONTEXTUAL_INTELLIGENCE.sql`.
3. Confirmar os Secrets da Edge Function.
4. Publicar novamente `farpha-intelligence`.
5. Executar `npm run validate` e `npm run audit:prod`.

Consulte `docs/AI_CONTEXT_PRIVACY.md` antes de ativar em produção.
