# Política de arquivo

## Objetivo

Preservar decisões úteis sem deixar implementações antigas competir com o
produto atual.

## Regras

- Código não utilizado deve ser removido depois de confirmar ausência de imports.
- Um ficheiro antigo só permanece quando é necessário para migração, auditoria
  ou compatibilidade e essa razão está documentada.
- Builds, `node_modules`, cobertura, ambientes privados e pacotes ZIP não são
  versionados.
- Documentação de sprint é histórica e não deve substituir documentos vigentes.
- O `CHANGELOG.md` deve manter o histórico integral; a auditoria bloqueia
  truncamentos abaixo do mínimo conhecido.
- Ativos substituídos não permanecem junto dos ativos oficiais.

Ficheiros removidos continuam recuperáveis através do histórico Git.
