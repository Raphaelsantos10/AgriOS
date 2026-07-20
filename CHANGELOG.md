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

## Sprint 47 — Rotas críticas em produção

- Smoke test ampliado para cinco rotas da aplicação.
- Acesso direto verificado para operações, explorações e diagnóstico.
- Fallback do React Router verificado com uma rota inexistente controlada.
- Elemento React principal confirmado em todas as respostas.
- Mesmo ponto de entrada JavaScript confirmado em todas as rotas.
- Mantidas as verificações dos assets, auditoria, 43 testes, lint e build.
- Supabase, autenticação e base de dados preservados.

## Sprint 48 — Identidade e rastreabilidade do build

- Ficheiro build-info.json gerado em cada build de produção.
- Versão do frontend alinhada para 2.1.0.
- Registo da versão, commit, execução, Node e ambiente do artefato.
- Identificação incluída no manifesto SHA-256.
- Informação do build apresentada na página de Diagnóstico.
- Smoke test atualizado para rejeitar builds sem rastreabilidade.
- Mantidas cinco rotas, seis assets, auditoria, 43 testes, lint e build.
- Supabase, autenticação, rotas e base de dados preservados.

## Sprint 49 — Integridade do artefato

- Verificação automática do manifesto antes do smoke test e do upload.
- Deteção de ficheiros ausentes ou inesperados no dist.
- Comparação do tamanho e hash SHA-256 de cada ficheiro.
- Verificação da contagem e do tamanho total do artefato.
- Novo comando npm run verify:dist integrado ao validate e FARPHA CI.
- Mantidos identidade, cinco rotas, seis assets, auditoria e 43 testes.
- Supabase, autenticação, rotas e base de dados preservados.

## Sprint 50 — Automação de release

- Workflow FARPHA Release acionado por tags versionadas.
- Tag validada contra a versão 2.1.0 do package.json.
- Auditoria e validação completa obrigatórias antes do empacotamento.
- Artefato de release identificado pela versão e conservado por 30 dias.
- Processo com permissões de leitura e sem publicação automática de código.
- Novo comando npm run check:release.
- Mantidas todas as proteções acumuladas e os 43 testes.
- Supabase, autenticação, rotas e base de dados preservados.

## Sprint 51 — Plano de rega exportável

- Exportação CSV da recomendação do Smart Irrigation Engine.
- Dados do talhão, cultura, sistema, condições, volume e duração incluídos.
- Prioridade, confiança, motivos e alertas incluídos no plano.
- Compatibilidade UTF-8 e Excel em português.
- Três novos testes da geração do relatório.
- Total acumulado de 46 testes automatizados.
- Supabase, autenticação, rotas e base de dados preservados.

## Sprint 52 — Relatório de aptidão de culturas

- Exportação CSV da classificação de culturas por talhão.
- Pontuações atuais, cenário com rega e ganho potencial incluídos.
- Confiança, pontos fortes, alertas e fatores conhecidos incluídos.
- Exportação respeita a pesquisa e o cenário selecionado.
- Três novos testes automatizados do relatório.
- Total acumulado de 49 testes automatizados.
- Supabase, autenticação, rotas e base de dados preservados.

## Sprint 53 — Relatório de risco de incêndio

- Exportação CSV completa do Fire Intelligence por talhão.
- Risco, confiança, condições meteorológicas e vegetação incluídos.
- Fatores transparentes, recomendações e notas operacionais incluídos.
- Aviso de prioridade das autoridades e do número 112.
- Três novos testes automatizados do relatório.
- Total acumulado de 52 testes automatizados.
- Supabase, autenticação, rotas e base de dados preservados.

## Sprint 54 — Relatório ambiental do talhão

- Exportação CSV do perfil ambiental completo.
- Relevo, solo, água, clima, riscos e confiança incluídos.
- Códigos internos traduzidos para nomes legíveis em português.
- Campos desconhecidos identificados claramente no relatório.
- Três novos testes automatizados da exportação.
- Total acumulado de 55 testes automatizados.
- Supabase, autenticação, rotas e base de dados preservados.

## Sprint 55 — Relatório integrado do talhão

- Exportação CSV consolidada diretamente no painel do talhão.
- Dados cadastrais, cultura, estado e geometria incluídos.
- Perfil ambiental e sistema de rega reunidos no mesmo relatório.
- Histórico operacional dos últimos 20 eventos de rega consolidado.
- Avaliação mais recente de risco de incêndio incluída.
- Módulos sem registos identificados sem bloquear a exportação.
- Três novos testes automatizados do relatório.
- Total acumulado de 58 testes automatizados.
- Supabase, autenticação, rotas e base de dados preservados.

## Sprint 56 — Painel consolidado da exploração

- Visão geral da área, estados e cobertura operacional dos talhões.
- Perfis ambientais, sistemas de rega e avaliações de incêndio consultados no Supabase.
- Prioridades identificadas para estados críticos, incêndio e módulos incompletos.
- Classificação transparente entre dados reais, valores calculados e dados ausentes.
- Exportação CSV do diagnóstico por exploração e por talhão.
- Três novos testes automatizados do painel e relatório.
- Total acumulado de 61 testes automatizados.
- Supabase, autenticação, rotas e base de dados preservados.
