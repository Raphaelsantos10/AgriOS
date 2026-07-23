# Sprint 107.2 — Experiência visual imersiva, login e cadastro

## Resultado

A página pública e a autenticação foram reunidas numa experiência contemporânea, editorial e responsiva, inspirada na fluidez de plataformas visuais modernas, mas desenhada de raiz para a identidade agrícola do FARPHA. O dashboard e os módulos operacionais não foram substituídos.

## Página pública

- Hero cinematográfico com mensagens e ações objetivas.
- Navegação fixa e responsiva com destinos reais para Soluções, Mapa, Como funciona, Resultados, Planos e Contacto.
- Instalação PWA mantida exclusivamente na navegação pública.
- Demonstração interativa do mapa com cinco camadas: clima, incêndio, saúde, rega e produtividade.
- História guiada e clicável: Observe, Planeie, Execute e Comprove.
- Indicadores e gráfico animados durante a rolagem, com respeito por `prefers-reduced-motion`.
- Resultados assinalados como cenário ilustrativo, sem prometer ganhos reais.
- Planos ligados ao cadastro e canais de apoio ligados aos contactos configurados.
- Menu móvel completo, acessibilidade por teclado e ligação para saltar diretamente ao conteúdo.

## Login e cadastro

- Linguagem visual alinhada com a nova página pública.
- Fotografia agrícola contextual no computador e cabeçalho reduzido no telemóvel.
- Formulário com rolagem própria em ecrãs baixos, sem exigir F11.
- Alternância funcional entre Entrar e Criar conta, incluindo navegação por URL.
- Cadastro Supabase em duas etapas com nome, email, perfil agrícola, palavra-passe e consentimento.
- Validações visíveis para campos incompletos, palavra-passe e termos.
- Recuperação de palavra-passe e confirmação por email preservadas.
- Google e Microsoft preservados, com verificação prévia no Supabase e mensagens amigáveis.
- Ajuda no acesso abre um email real, sem sobrepor o formulário.

## Segurança e configuração

- Nenhuma chave privada foi adicionada ao frontend.
- `service_role` continua proibida em variáveis `VITE_*`.
- A atualização não exige novo SQL.
- Google e Microsoft apenas aparecem quando ativados em `.env.local` e apenas redirecionam quando o provedor também está ativo no Supabase.
- O ficheiro `.env.local` existente não é incluído nem substituído pelo pacote.

## Validação executada

- Toolchain: aprovada.
- Verificação obrigatória da ligação pública ao MarketingSiteV4: aprovada.
- Vitest: 59 ficheiros e 196 testes aprovados.
- ESLint: aprovado.
- TypeScript e build Vite: aprovados.
- Limite de bundles: aprovado.
- Verificação PWA: aprovada.
- Verificação de segurança: aprovada.
- Manifesto e integridade do build: aprovados.
- Smoke test de produção: aprovado.
