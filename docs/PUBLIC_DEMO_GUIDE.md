# Guia de demonstração pública FARPHA

## Objetivo

Apresentar o produto sem confundir uma interface completa com uma integração
já validada em produção.

## Roteiro de 10 minutos

1. Página institucional e proposta de valor.
2. Login, cadastro e onboarding vazio.
3. Exploração e desenho/importação de um talhão.
4. Clima, solo e risco oficial com fonte e data visíveis.
5. Missão operacional ligada ao território.
6. Diagnóstico e Matriz de Maturidade.

## Linguagem aprovada

Use:

- “integração criada e sujeita a configuração”;
- “estimativa com fonte e incerteza”;
- “módulo parcial”;
- “experiência demonstrativa”.

Evite:

- “IA comprovada” sem validação;
- “satélite integrado” quando a página usa mock;
- “redução garantida de custos”;
- “conformidade automática garantida”;
- “aplicação mobile nativa” quando existe apenas PWA.

## Capturas atuais

As capturas em `docs/screenshots/` são imagens reais da aplicação. O
`manifest.json` regista origem e data. Conceitos ou mockups futuros devem ser
guardados fora desta pasta e identificados como conceitos.

Para atualizar automaticamente em Windows com Google Chrome:

```bash
cd frontend
npm run screenshots:capture
npm run verify:media
```

O comando captura a página pública, login, cadastro, dashboard, diagnóstico e
vista mobile. Reveja todas as imagens antes do commit para remover dados pessoais.
