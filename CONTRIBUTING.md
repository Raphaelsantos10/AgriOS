# Contribuir para o FARPHA

## Princípios

- Não publicar chaves, `.env.local`, dados pessoais ou dados reais de explorações.
- Não anunciar como concluída uma integração que use dados demonstrativos.
- Preservar a identidade **FARPHA — Intelligence for Agriculture**.
- Manter acessibilidade, responsividade e contraste nos temas claro e escuro.
- Ligar cada alteração relevante a uma sprint, issue ou decisão documentada.

## Fluxo recomendado

```bash
git switch -c tipo/descricao-curta
cd frontend
npm install
npm run validate
npm run audit:prod
```

Antes do commit, reveja:

```bash
git status
git diff --check
git diff
```

Use mensagens como `fix:`, `feat:`, `test:`, `docs:`, `security:` ou `chore:`.
Pull requests devem explicar o problema, a solução, a validação executada e os
riscos ou configurações externas.

## Base de dados

Migrações devem ser repetíveis quando possível, documentadas e testadas num
projeto Supabase não produtivo. Nunca inclua `service_role` ou chaves privadas
em SQL, código frontend, documentação, imagens ou logs.

## Marca e documentação

Consulte [Governança da identidade](docs/brand/FARPHA_IDENTITY_GOVERNANCE.md) e
[Índice documental](docs/DOCUMENTATION_INDEX.md). Não recupere páginas,
logótipos ou slogans antigos sem uma decisão explícita.
