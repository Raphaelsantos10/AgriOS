# Plano Mestre Pré-Publicação FARPHA

Este plano acrescenta as melhorias recomendadas nas avaliações de mercado sem
substituir nem apagar as sprints anteriores.

## 1. Repositório, segurança e continuidade

- [x] Restaurar CI, CodeQL, release, Dependabot e `.gitignore`.
- [x] Retirar `node_modules` e `dist` do controlo de versões.
- [x] Recuperar migrações, ativos e histórico das sprints.
- [x] Automatizar a verificação de integridade e padrões de segredos.
- [ ] Confirmar todos os workflows verdes no GitHub.
- [ ] Auditar licenças de dependências, imagens e ativos.
- [ ] Verificar e, se necessário, limpar segredos do histórico.
- [ ] Testar backup, recuperação e rollback.
- [ ] Instalar e validar num computador limpo.

## 2. Marca, apresentação e documentação

- [ ] Definir o nome final do repositório FARPHA.
- [x] Eliminar referências e logótipos AgriOS antigos da interface ativa.
- [x] Consolidar índice, governança de marca e guias de continuidade.
- [ ] Produzir capturas reais, vídeo e demonstração pública.
- [x] Separar e indexar documentação pública, técnica e administrativa.
- [ ] Manter roadmap e limitações apresentados de forma honesta.

## 3. Matriz de maturidade

Classificar cada módulo como **real**, **parcial**, **demonstrativo** ou
**planeado**, indicando persistência, testes, APIs, permissões e limitações.

- [x] Explorações, talhões e GIS.
- [x] Operações, custos, inventário, máquinas e colheitas.
- [x] Clima, solo, incêndio, rega e ambiente.
- [x] Conformidade, IFAP/PEPAC, fiscal e laboral.
- [x] Inteligência, automações e agricultura de precisão.
- [x] Digital Twin, IoT, satélite, drones e mobile.

## 4. Dados reais e Supabase

- [ ] Substituir seeds, mocks e persistência operacional em `localStorage`.
- [ ] Validar todas as políticas RLS com duas contas independentes.
- [ ] Garantir estados vazios sem dados fictícios.
- [ ] Criar exportação, retenção, recuperação e sincronização offline.
- [ ] Identificar fonte e hora da atualização de dados externos.

## 5. Inteligência FARPHA

- [x] Manter a chave privada numa Edge Function autenticada.
- [x] Distinguir inteligência online e guia local verificado.
- [ ] Ativar quota real da API e testar respostas de produção.
- [x] Contextualizar respostas com dados agregados e autorizados pelo utilizador.
- [x] Medir tokens, latência, falhas, uso, modelo e fontes; utilidade humana continua pendente.
- [ ] Remover indicadores simulados ou identificá-los claramente.
- [ ] Validar recomendações com técnicos agrícolas.

## 6. Integrações e faturação

- [ ] Validar clima, incêndio, solo e cartografia com fontes reais.
- [ ] Definir integrações reais para satélite, IoT e drones.
- [ ] Configurar Stripe de produção, planos, checkout e portal.
- [ ] Validar webhooks, cancelamento, renovação e mudança de plano.
- [ ] Rever IVA, termos, privacidade e política de cancelamento.

## 7. Autenticação e onboarding

- [ ] Validar email, confirmação, recuperação, sessão e logout.
- [ ] Validar Google e Microsoft no domínio de produção.
- [ ] Confirmar criação do perfil e isolamento por proprietário.
- [ ] Testar onboarding vazio e criação da primeira exploração.

## 8. GIS, UI/UX e acessibilidade

- [ ] Auditar criação, edição, divisão, união e histórico de polígonos.
- [ ] Validar GeoJSON, shapefile, áreas e geometrias inválidas.
- [ ] Auditar todas as páginas nos temas claro e escuro.
- [ ] Testar PC, tablet, telemóvel, zoom e navegação por teclado.
- [ ] Impedir sobreposição da PWA, ajuda, modais e formulários.
- [ ] Garantir que nenhum botão, aba, card ou página fica sem ação.

## 9. Dashboard, notificações e suporte

- [ ] Validar saudação, nome, data, relógio e previsão reais.
- [ ] Organizar notificações novas, lidas, arquivadas e sem duplicados.
- [ ] Ligar notificações ao respetivo módulo.
- [ ] Permitir pedidos, respostas, estados e histórico de suporte.
- [ ] Manter fallback local quando a inteligência estiver indisponível.

## 10. Produção, métricas e pilotos

- [ ] Otimizar bundles, imagens, PWA, cache e ligação lenta.
- [ ] Configurar erros, logs, health checks e observabilidade.
- [ ] Separar desenvolvimento, testes e produção.
- [ ] Publicar com HTTPS, smoke test e rollback.
- [ ] Não apresentar métricas ilustrativas como resultados reais.
- [ ] Medir utilização, retenção, falhas e valor operacional.
- [ ] Conduzir pilotos com 3 a 5 explorações.
- [ ] Obter o primeiro utilizador pagante e um estudo de caso.

## 11. Licença e propriedade

- [ ] Decidir a licença das versões comerciais futuras.
- [ ] Avaliar tornar o desenvolvimento futuro privado.
- [ ] Inventariar propriedade intelectual, dependências e ativos.
- [ ] Preparar contratos e revisão jurídica.

Versões anteriormente publicadas sob MIT mantêm os direitos já concedidos.

## Sprints acrescentadas

| Sprint | Entrega |
| --- | --- |
| 107.8 | Auditoria do GitHub, segurança, CI, Dependabot e histórico |
| 107.9 | Identidade definitiva e organização do repositório |
| 108 | Matriz de maturidade dos módulos |
| 109 | README, capturas, vídeo e documentação consolidada |
| 110 | Persistência real e redução de mocks |
| 111 | Inteligência real, contextual e mensurável |
| 112 | APIs reais e resiliência de integrações |
| 113 | Stripe, planos e faturação |
| 114 | Autenticação, OAuth e onboarding |
| 115 | Auditoria GIS |
| 116 | Auditoria UI/UX claro e escuro |
| 117 | Dashboard, notificações e suporte |
| 118 | PWA, offline, desempenho e acessibilidade |
| 119 | Observabilidade, backups e recuperação |
| 120 | Publicação controlada |
| 121 | Pilotos com explorações reais |
| 122 | Ajustes e validação agrícola |
| 123 | Preparação comercial, jurídica e licenciamento |
| 124 | Release Candidate e lançamento público |
