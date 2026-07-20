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

## Sprint 57 — Central de alertas agrícolas

- Alertas consolidados de talhões, incêndio, rega, ambiente e clima.
- Severidades críticas, de atenção e informativas ordenadas automaticamente.
- Reservatório baixo, rega inativa e dados incompletos identificados.
- Ação recomendada e origem transparentes em cada alerta.
- Exportação CSV completa da central de alertas.
- Três novos testes automatizados da geração e exportação.
- Total acumulado de 64 testes automatizados.
- Supabase, autenticação, rotas e base de dados preservados.

## Sprint 58 — Agenda operacional

- Conversão direta de alertas agrícolas em tarefas pré-preenchidas.
- Responsável, prazo, prioridade, estado, custos e observações acompanháveis.
- Agenda da exploração ligada às Ordens de Trabalho.
- Atualização de estado, remoção controlada e exportação CSV.
- Ordens demonstrativas automáticas removidas para garantir transparência.
- Armazenamento local identificado claramente como a persistência atual.
- Três novos testes automatizados da conversão e exportação.
- Total acumulado de 67 testes automatizados.
- Supabase, autenticação, rotas e base de dados preservados.

## Sprint 59 — Custos agrícolas

- Novo módulo para custos de mão de obra, água, combustível, produtos e máquinas.
- Quantidade, unidade e preço unitário com total automático.
- Resumos financeiros e filtro por categoria.
- Remoção controlada e exportação CSV dos lançamentos.
- Nenhum custo demonstrativo criado automaticamente.
- Persistência local identificada claramente como a origem atual.
- Três novos testes automatizados de cálculos e exportação.
- Total acumulado de 70 testes automatizados.
- Supabase, autenticação, rotas e base de dados preservados.

## Sprint 60 — Relatório financeiro

- Análise de custos por período, exploração, talhão e categoria.
- Total, média, número de lançamentos e maior categoria calculados.
- Distribuição por categoria e consolidação por talhão.
- Detalhamento filtrado e exportação CSV do relatório.
- Origem dos valores apresentada como registos reais do utilizador.
- Receitas, margens e lucros não são simulados sem dados correspondentes.
- Três novos testes automatizados dos filtros, resumo e exportação.
- Total acumulado de 73 testes automatizados.
- Supabase, autenticação, rotas e base de dados preservados.

## Sprint 61 — Inventário de produtos

- Cadastro de fertilizantes, sementes, fitofármacos, corretivos e outros insumos.
- Stock inicial, stock mínimo, unidade e custo unitário controlados.
- Entradas e saídas com validação para impedir stock negativo.
- Fornecedor, lote, validade e observações incluídos.
- Alertas de stock baixo e validade ultrapassada.
- Valor estimado, pesquisa, remoção e exportação CSV.
- Nenhum produto demonstrativo criado automaticamente.
- Três novos testes automatizados do inventário.
- Total acumulado de 76 testes automatizados.
- Supabase, autenticação, rotas e base de dados preservados.

## Sprint 62 — Gestão de máquinas

- Cadastro de tratores, alfaias, colhedoras, pulverizadores e outros equipamentos.
- Horas, combustível e custo por hora acompanhados.
- Manutenção preventiva controlada por data e horímetro.
- Alertas de manutenção vencida e próxima.
- Registo de utilização e conclusão de manutenção.
- Custo estimado, remoção e exportação CSV.
- Nenhuma máquina demonstrativa criada automaticamente.
- Três novos testes automatizados da gestão de máquinas.
- Total acumulado de 79 testes automatizados.
- Supabase, autenticação, rotas e base de dados preservados.

## Sprint 63 — Diário do talhão

- Registos cronológicos de operações, inspeções e observações de campo.
- Exploração, talhão, cultura, data, atividade e responsável incluídos.
- Fotografia opcional validada e limitada a 1 MB.
- Pesquisa, resumo da atividade e linha temporal ordenada.
- Remoção controlada e exportação CSV.
- Nenhum registo demonstrativo criado automaticamente.
- Três novos testes automatizados do diário.
- Total acumulado de 82 testes automatizados.
- Supabase, autenticação, rotas e base de dados preservados.

## Sprint 64 — Produção e colheita

- Registo de campanha, cultura, área e quantidades colhidas.
- Produção bruta e comercializável em quilogramas ou toneladas.
- Qualidade, destino e observações incluídos.
- Perdas e produtividade por hectare calculadas automaticamente.
- Validação, pesquisa, remoção e exportação CSV.
- Nenhuma colheita demonstrativa criada automaticamente.
- Três novos testes automatizados dos cálculos e exportação.
- Total acumulado de 85 testes automatizados.
- Supabase, autenticação, rotas e base de dados preservados.

## Sprint 65 — Rastreabilidade agrícola

- Linha temporal unificada com evidências do Diário do Talhão e de Produção e Colheita.
- Preparação do solo, plantação, cuidados culturais, rega e colheita acompanhadas.
- Cobertura do ciclo e etapas sem evidência indicadas com transparência.
- Filtros por exploração, talhão, cultura e intervalo de datas.
- Origem, responsável e detalhes preservados em cada evento.
- Exportação CSV do histórico filtrado.
- Atividade de preparação do solo adicionada ao Diário do Talhão.
- Nenhum registo demonstrativo criado automaticamente.
- Três novos testes automatizados da rastreabilidade.
- Total acumulado de 88 testes automatizados.
- Supabase, autenticação, rotas e base de dados preservados.

## Sprint 66 — Dashboard de produtividade

- Comparação de resultados por cultura, exploração/talhão e campanha.
- Produtividade média agregada de forma ponderada pela área colhida.
- Produção bruta e comercializável, perdas, área e número de registos apresentados.
- Ranking ordenado e barras comparativas dos resultados.
- Filtros por exploração, cultura, campanha e intervalo de datas.
- Exportação CSV da dimensão e filtros atuais.
- Nenhum registo demonstrativo criado automaticamente.
- Três novos testes automatizados do dashboard de produtividade.
- Total acumulado de 91 testes automatizados.
- Supabase, autenticação, rotas e base de dados preservados.

## Sprint 67 — Previsão meteorológica integrada

- Previsão real de sete dias por exploração ou coordenadas manuais.
- Open-Meteo integrada sem necessidade de chave de API.
- Temperatura, chuva, probabilidade, rajadas e ET₀ apresentadas.
- Alertas de geada, calor, chuva forte, vento e procura hídrica elevada.
- Recomendações operacionais e avisos de incerteza incluídos.
- Exportação CSV com localização, fonte e momento da consulta.
- Diagnóstico da integração meteorológica atualizado.
- Nenhuma previsão fictícia criada automaticamente.
- Três novos testes automatizados dos alertas meteorológicos.
- Total acumulado de 94 testes automatizados.
- Supabase, autenticação, rotas e base de dados preservados.

## Sprint 68 — Recomendações automáticas

- Motor explicável que cruza clima, perfil ambiental, diário e colheitas.
- Recomendações para geada, calor, chuva, vento, solo, drenagem e perdas.
- Evidências, prioridades e confiança dos dados apresentadas.
- Dados em falta identificados com orientação para os completar.
- Previsão meteorológica guardada e reutilizada somente na exploração correspondente.
- Exportação CSV das recomendações e respetivas evidências.
- Nenhuma operação agrícola executada automaticamente.
- Arquitetura preparada para IPMA, SoilGrids e ICNF.
- Três novos testes automatizados do motor de recomendações.
- Total acumulado de 97 testes automatizados.
- Supabase, autenticação, rotas e base de dados preservados.

## Sprint 69 — Aplicação móvel/PWA

- FARPHA instalável como aplicação standalone em navegadores compatíveis.
- Manifesto PWA e ícones oficiais em 192 e 512 pixels.
- Estrutura principal e recursos visitados guardados para acesso offline limitado.
- Aviso de ligação e explicação do alcance do modo offline.
- Dados locais e última previsão guardada preservados no dispositivo.
- Dependências externas não são simuladas quando a rede está indisponível.
- Limpeza de caches antigos incluída.
- Verificação PWA adicionada ao processo de validação.
- Três novos testes automatizados da capacidade PWA.
- Total acumulado de 100 testes automatizados.
- Supabase, autenticação, rotas e base de dados preservados.

## Sprint 70 — Preparação para produção

- Central de prontidão com verificações e bloqueios transparentes.
- Matriz de permissões proposta para quatro perfis.
- Autenticação, RLS e backup remoto exigidos antes da liberação.
- Exportação e restauração validada dos dados locais FARPHA.
- Cabeçalhos de segurança fornecidos para hospedagem compatível.
- Build verificado contra segredos administrativos e chaves privadas.
- Manuais finais de produção, backup e recuperação adicionados.
- Três novos testes automatizados de permissões, backup e prontidão.
- Total acumulado de 103 testes automatizados.
- Supabase, autenticação, rotas e base de dados preservados.

## Sprint 71 — Solo Inteligente

- SoilGrids integrado por exploração ou coordenadas manuais.
- Oito propriedades do solo em três profundidades.
- Média, intervalo Q0.05–Q0.95, unidade e incerteza apresentadas.
- Conversão orientada pelos metadados devolvidos pelo fornecedor.
- Cache de 30 dias por ponto e limite de cinco chamadas por minuto.
- Exportação CSV com fonte, coordenadas e momento da consulta.
- Indisponibilidade da API beta tratada sem resultados fictícios.
- Aviso explícito de que estimativas não substituem análise laboratorial.
- Três novos testes automatizados do perfil de solo.
- Total acumulado de 106 testes automatizados.
- Supabase, autenticação, rotas e base de dados preservados.

## Sprint 72 — Risco oficial de incêndio IPMA

- Previsão oficial de perigo de incêndio rural para três dias.
- Classificações IPMA de reduzido a máximo apresentadas.
- Exploração cadastrada ou coordenadas manuais suportadas.
- Associação ao ponto municipal mais próximo com distância transparente.
- Código do concelho, corrida do modelo e atualização incluídos.
- Cache por seis horas e preservação da última previsão em caso de falha.
- Exportação CSV com fonte oficial e metadados.
- Formato real do endpoint IPMA verificado e suportado.
- Três novos testes automatizados do risco oficial.
- Total acumulado de 109 testes automatizados.
- Supabase, autenticação, rotas e base de dados preservados.
