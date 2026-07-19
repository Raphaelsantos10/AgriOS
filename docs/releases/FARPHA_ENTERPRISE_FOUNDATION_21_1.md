# FARPHA Enterprise Foundation 21.1

## Objetivo

Introduzir uma camada de repositórios e um sistema global de notificações sem alterar os contratos públicos atuais das features.

## Entregue

- `RepositoryResult<T>` padronizado.
- `farmRepository` e `fieldRepository`.
- Serviços existentes migrados para usar repositórios.
- `NotificationProvider`, hook e viewport global.
- Compatibilidade preservada com os componentes atuais.

## Próximos passos

1. Migrar Crop, Environment, Irrigation, Fire e Missions.
2. Usar notificações globais nos fluxos de criar/editar/eliminar.
3. Adicionar Activity Center e auditoria.
4. Preparar `organization_id` e RLS multiempresa.
