# Changelog

## [1.0.0-rc.1] - 2026-07-13

### Added

- Error Boundary global.
- Página 404.
- Componente reutilizável EmptyState.
- Documentação da Release Candidate 1.

### Improved

- Recuperação de erros sem ecrã branco.
- Experiência de navegação para rotas inexistentes.
- Mensagens de erro em desenvolvimento e referência para suporte.

## Sprint 33 — Dashboard profissional
- Novo cabeçalho do Centro de Operações.
- KPIs compactos e reutilizáveis com tendências e progresso.
- Barra de ferramentas visual no mapa.
- Ajustes de hierarquia, contraste e responsividade.
- Nenhuma alteração em rotas, Supabase, autenticação ou base de dados.

## Sprint 34 — Estabilização do GIS
- Validação dos limites e da área antes de guardar uma edição de geometria.
- Sincronização do talhão selecionado com a lista atual após criação, edição ou remoção.
- Limpeza automática da seleção quando um talhão deixa de existir.
- Correção de avisos de lint no Command Palette, Theme Context e FARPHA Intelligence.
- Build e lint validados com sucesso.

## Sprint 35 — Auditoria e testes do GIS

- Inventário técnico dos módulos e respetivas fontes de dados.
- Base de testes automatizados adicionada com Vitest.
- Cinco testes de importação e validação GeoJSON.
- Exportações GeoJSON e KML atualizadas para o branding FARPHA.
- Supabase, autenticação, rotas e base de dados preservados.

## Sprint 36 — Testes dos fluxos críticos

- Testes de listar, consultar, criar, editar e remover explorações.
- Testes de listar, consultar, criar, editar e remover talhões.
- Cobertura da passagem de geometria, área e estado entre serviço e repositório.
- Cobertura da propagação de erros do Supabase para a aplicação.
- Total acumulado de 17 testes automatizados.
- Supabase, autenticação, rotas e base de dados preservados.

## Sprint 37 — Histórico GIS e tratamento de erros

- Testes de criação e consulta de snapshots do histórico dos talhões.
- Cobertura da normalização de notas e do estado vazio.
- Cobertura de falhas do Supabase no histórico GIS.
- Testes da camada comum de resultados e erros dos repositórios.
- Total acumulado de 27 testes automatizados.
- Supabase, autenticação, rotas e base de dados preservados.

## Sprint 38 — Operações avançadas do GIS

- Testes da união de talhões adjacentes e sobrepostos.
- Rejeição da união de talhões separados.
- Testes da divisão de um talhão em dois polígonos válidos.
- Verificação da conservação aproximada da área após a divisão.
- Rejeição de linhas de corte incompletas ou externas.
- Total acumulado de 33 testes automatizados.
- Supabase, autenticação, rotas e base de dados preservados.

## Sprint 39 — Validação dos motores agrícolas

- Testes do motor de recomendação de irrigação.
- Cobertura de calor, humidade do solo, chuva, textura e eficiência.
- Testes do motor de aptidão de culturas.
- Cobertura de pH, frio, água, geada, calor, drenagem e confiança.
- Total acumulado de 43 testes automatizados.
- Supabase, autenticação, rotas e base de dados preservados.
