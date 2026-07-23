# Visão técnica FARPHA

## Arquitetura

- React 19 e TypeScript.
- Vite e Tailwind CSS.
- React Query e formulários validados.
- Supabase para autenticação, dados, RLS e Edge Functions.
- MapLibre, Turf e Terra Draw para GIS.
- PWA com cache e funcionamento offline limitado.

As funcionalidades estão organizadas por domínio em `frontend/src/features`.
Chamadas de dados centrais passam por serviços e repositórios quando já foram
migradas; módulos locais estão identificados na Matriz de Maturidade.

## Validação

`npm run validate` executa:

1. compatibilidade da toolchain;
2. integridade do repositório;
3. identidade FARPHA;
4. cobertura da matriz de maturidade;
5. media e documentação visual;
6. experiência pública;
7. testes e lint;
8. build, PWA, segurança, manifesto e smoke test.

## Ambientes

- `VITE_*` contém apenas valores públicos necessários no navegador.
- `service_role`, `OPENAI_API_KEY` e segredos de Stripe ficam fora do frontend.
- desenvolvimento, testes e produção devem usar projetos e credenciais separados.

## Limitações atuais

Consulte [Matriz de Maturidade](MODULE_MATURITY_MATRIX.md). A principal dívida
técnica é migrar persistência operacional do navegador para o Supabase e
substituir experiências demonstrativas por fontes reais validadas.
