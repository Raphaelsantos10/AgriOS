# Sprint 35 — Auditoria e testes do GIS

## Objetivo

Consolidar o snapshot da Sprint 34 antes de iniciar novas funcionalidades.

## Auditoria

- Rotas e módulos principais inventariados.
- Lint e build validados antes das alterações.
- GIS confirmado como funcional e avançado; não foi recriado.
- Analytics, diagnósticos, culturas, ambiente e irrigação usam Supabase.
- Intelligence e Precision Agriculture ainda usam dados simulados ou armazenamento local.
- Digital Twin é uma interface preparada, ainda sem motor 3D real.
- Não existiam testes automatizados no snapshot recebido.

## Alterações

- Criada a base de testes com Vitest.
- Adicionados cinco testes para importação GeoJSON: dados agrícolas, fecho de anel, duplicados, geometria não suportada e JSON inválido.
- Corrigido o branding dos ficheiros GeoJSON/KML exportados de `agrios-*` para `farpha-*`.
- Corrigidos metadados e estilo KML para FARPHA.

## Limites preservados

- Sem alterações em Supabase, autenticação, rotas ou base de dados.
- Sem recriação do editor GIS.
- Sem novas abstrações ou módulos vazios.
