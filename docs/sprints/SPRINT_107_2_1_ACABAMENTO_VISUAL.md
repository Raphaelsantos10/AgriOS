# Sprint 107.2.1 — Acabamento visual e continuidade do cadastro

## Resultado

Esta atualização conclui o acabamento da experiência pública apresentada na Sprint 107.2. A página inicial, o login e o cadastro mantêm a direção visual editorial aprovada, agora com identidade FARPHA oficial, melhor distribuição do espaço e continuidade entre a escolha do plano e a criação da conta.

## Melhorias entregues

- Símbolo oficial FARPHA aplicado ao componente vetorial de marca utilizado na página pública e na autenticação.
- Navegação e âncoras ajustadas para não esconder conteúdo sob a barra fixa.
- Espaçamentos verticais reduzidos em Soluções, Mapa, Como funciona, Resultados, Planos e Contacto.
- Rodapé reorganizado, com marca mais legível e chamada final equilibrada.
- Texto técnico de variáveis `VITE_SUPPORT_*` removido da página pública.
- Bloco de contacto convertido em comunicação adequada ao utilizador final.
- Mapa demonstrativo enriquecido com textura territorial, caminhos, coordenadas e região ativa acessível.
- Escolha de Free, Plus ou Pro guardada durante a navegação para o cadastro.
- Plano selecionado apresentado no formulário e enviado como `selected_plan` nos metadados seguros do cadastro Supabase.
- Página continua responsiva e respeita `prefers-reduced-motion`.

## Limites e segurança

- O mapa público continua sendo uma demonstração visual; não representa dados reais de uma exploração.
- Esta Sprint não exige executar SQL no Supabase.
- Nenhuma chave privada foi incluída.
- Google e Microsoft dependem de configuração e ativação nos respetivos provedores e no Supabase.
- O ficheiro `frontend/.env.local` não faz parte do pacote e deve ser preservado durante a instalação.

## Validação executada

- Entrada pública MarketingSiteV4: aprovada.
- Vitest: 59 ficheiros e 197 testes aprovados.
- ESLint: aprovado.
- TypeScript e build Vite: aprovados.
- Limite de bundles: aprovado.
- PWA e funcionamento offline: aprovados.
- Segurança do build: aprovada.
- Manifesto e integridade: aprovados.
- Smoke test: 5 rotas e 6 assets aprovados.

