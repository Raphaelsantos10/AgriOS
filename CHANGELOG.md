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

## Sprint 40 — Integração contínua

- Workflow GitHub Actions para push na main e pull requests.
- Validação automática de 43 testes, lint e build.
- Node.js 24 fixado para desenvolvimento e CI.
- Instalação determinística com npm ci e cache de dependências.
- Novo comando npm run validate.
- Permissões mínimas e cancelamento de execuções obsoletas.
- Supabase, autenticação, rotas e base de dados preservados.

## Sprint 41 — Segurança automatizada

- Análise CodeQL para JavaScript e TypeScript em pushes e pull requests.
- Verificação de segurança semanal e execução manual pelo GitHub Actions.
- Atualizações semanais do npm e GitHub Actions pelo Dependabot.
- Agrupamento e limites para atualizações automáticas controladas.
- Política de comunicação responsável de vulnerabilidades em SECURITY.md.
- Mantidos os 43 testes, lint e build da integração contínua.
- Supabase, autenticação, rotas e base de dados preservados.

## Sprint 42 — Performance dos bundles

- Separação do bundle GIS em MapLibre, Turf e ferramentas de desenho.
- Limite automático de 1.050 KiB por ficheiro JavaScript gerado.
- Build interrompido quando o limite de tamanho é ultrapassado.
- Verificação integrada no npm run build, npm run validate e FARPHA CI.
- Mantidos os 43 testes automatizados.
- Supabase, autenticação, rotas e base de dados preservados.

## Sprint 43 — Governança de dependências

- Bloqueio de atualizações principais automáticas do TypeScript e @types/node.
- Verificação local da compatibilidade entre TypeScript e typescript-eslint.
- Alinhamento obrigatório entre Node 24 e @types/node 24.
- Novo comando npm run check:toolchain integrado na validação completa.
- Mensagens claras para atualizações incompatíveis no desenvolvimento e no CI.
- Mantidos os 43 testes e a proteção de tamanho dos bundles.
- Supabase, autenticação, rotas e base de dados preservados.

## Sprint 44 — Auditoria de dependências

- Auditoria automática das dependências utilizadas em produção.
- Bloqueio do CI para vulnerabilidades conhecidas de severidade alta ou crítica.
- Novo comando npm run audit:prod.
- Nova etapa de segurança executada antes dos testes, lint e build.
- Exclusão das ferramentas de desenvolvimento da decisão sobre o risco em produção.
- Resultado atual: zero vulnerabilidades nas dependências de produção.
- Mantidos os 43 testes, a proteção da toolchain e o limite dos bundles.
- Supabase, autenticação, rotas e base de dados preservados.

## Sprint 45 — Artefato de produção verificável

- Manifesto automático do build com hashes SHA-256.
- Inventário, tamanho individual e tamanho total dos ficheiros de produção.
- Upload do frontend/dist nas execuções verdes da branch main.
- Artefatos identificados pelo SHA do commit e conservados durante 14 dias.
- Upload restrito a pushes e execuções manuais para controlar armazenamento.
- Mantidos auditoria, toolchain, 43 testes, lint e limite dos bundles.
- Supabase, autenticação, rotas e base de dados preservados.

## Sprint 46 — Smoke test de produção

- Servidor de preview iniciado automaticamente após o build.
- Verificação HTTP da página inicial do artefato de produção.
- Confirmação do elemento React principal e dos tipos de conteúdo.
- Carregamento verificado dos assets JavaScript e CSS referenciados.
- Encerramento seguro do servidor de teste em sucesso ou falha.
- Novo comando npm run smoke:prod integrado ao validate e FARPHA CI.
- Mantidos auditoria, toolchain, 43 testes, lint, manifesto e limite dos bundles.
- Supabase, autenticação, rotas e base de dados preservados.
