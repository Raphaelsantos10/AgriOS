# Sprint 37 — Histórico GIS e tratamento de erros

## Objetivo

Proteger o histórico de alterações dos talhões e a camada comum de erros antes de expandir funcionalidades.

## Implementado

- Testes de criação de snapshots completos em `field_history`.
- Validação de notas normalizadas e notas vazias guardadas como `null`.
- Teste da consulta do histórico por talhão em ordem decrescente.
- Cobertura do estado vazio e das falhas do Supabase.
- Testes da normalização e propagação de erros dos repositórios.
- Total acumulado esperado: 27 testes automatizados.

## Limites preservados

- Sem alterações no Supabase, autenticação, rotas ou banco.
- Sem recriação do GIS ou do histórico existente.
