# Sprint 106.6 — Experiência, ajuda e acessibilidade

## Problemas corrigidos

- rolagem do site público restaurada sem alterar o painel autenticado;
- fotografia agrícola premium recuperada no hero;
- marca reconstruída como componente vetorial adaptável a fundos claros e escuros;
- aviso de instalação reposicionado sem sobrepor o botão de ajuda;
- cortes e proporções da marca corrigidos;
- conteúdo institucional expandido a partir do README do projeto;
- contactos e atendimento adicionados ao site.

## Centro de Ajuda

- assistente contextual com respostas e navegação orientada;
- abertura de pedidos com categoria, prioridade, descrição e referência;
- histórico local de pedidos;
- escalamento para WhatsApp, email e telefone;
- explicação clara sobre atendimento automático e humano;
- contactos configuráveis com variáveis `VITE_SUPPORT_*`.

O histórico atual fica no navegador. A sincronização multiutilizador exigirá uma tabela de tickets no Supabase ou integração com uma plataforma de atendimento.

## Validação de experiência

- visitante consegue percorrer o site e compreender o produto;
- utilizador encontra módulos, planos, segurança e contactos;
- ajuda pode ser utilizada só com teclado e fechada com Escape;
- separadores e diálogo possuem nomes e estados acessíveis;
- formulários possuem labels, limites e mensagens de privacidade;
- instalação e suporte ocupam zonas distintas;
- desktop e mobile usam dimensões mínimas de toque;
- 185 testes, lint, TypeScript, build, PWA, segurança, integridade e smoke test aprovados;
- zero vulnerabilidades de produção.

