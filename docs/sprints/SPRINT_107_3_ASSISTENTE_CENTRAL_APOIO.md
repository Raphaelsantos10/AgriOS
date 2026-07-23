# Sprint 107.3 — Assistente FARPHA e Central de Apoio

## Resultado

O apoio ao utilizador deixa de ser apenas uma caixa de respostas. O FARPHA passa a ter uma Central de Ajuda unificada, acessível pelo botão flutuante, pelo cabeçalho e pelo menu da conta, mantendo a instalação PWA separada na navegação pública.

## Entregas

- Assistente contextual com orientação para módulos reais.
- Atalhos para explorações, clima, custos, diagnóstico, segurança e planos.
- Criação de pedidos com assunto, categoria, prioridade e descrição.
- Histórico privado guardado no navegador.
- Estados `Aberto`, `Enviado` e `Resolvido`.
- Filtros por estado, resolução e reabertura de pedidos.
- Envio preparado para o administrador por email ou WhatsApp.
- Referência FARPHA incluída automaticamente no assunto e na mensagem.
- Contacto direto por WhatsApp, email e telefone.
- Avisos de privacidade e proteção contra introdução de credenciais.
- Texto técnico de configuração removido da interface do utilizador.
- Contraste claro/escuro e comportamento responsivo preservados.

## Funcionamento dos pedidos

Criar um pedido não envia informação automaticamente. O conteúdo fica guardado neste navegador até o utilizador escolher `Enviar por email` ou `WhatsApp`. Essa decisão evita transmissões inesperadas e mantém o utilizador no controlo.

## Limites

- Esta Sprint não exige SQL.
- O histórico local não é partilhado entre dispositivos.
- Uma futura integração Supabase poderá sincronizar pedidos entre utilizadores e administradores.
- Os contactos públicos continuam configuráveis no `.env.local`.
- Nenhuma chave privada foi incluída.

## Validação

- MarketingSiteV4: aprovado.
- Vitest: 60 ficheiros e 202 testes aprovados.
- ESLint: aprovado.
- TypeScript e build Vite: aprovados.
- Bundle: aprovado.
- PWA: aprovada.
- Segurança: aprovada.
- Integridade do build: aprovada.
- Smoke test: 5 rotas e 6 assets aprovados.

