# Sprint 63 — Diário do talhão

## Objetivo

Manter um histórico cronológico das operações, inspeções, fotografias e observações de campo.

## Implementado

- Novo módulo `Diário do talhão` no menu Operações.
- Exploração, talhão, cultura, data, atividade e título.
- Responsável, condições observadas e notas de campo.
- Atividades de inspeção, plantação, rega, fertilização, pulverização, poda, colheita, manutenção e outras.
- Fotografia opcional guardada com o registo.
- Validação do formato e limite de 1 MB por fotografia.
- Linha temporal ordenada do registo mais recente para o mais antigo.
- Pesquisa por exploração, talhão, cultura, atividade ou responsável.
- Resumo de registos, talhões acompanhados e fotografias.
- Remoção com confirmação e exportação CSV.
- Nenhum registo demonstrativo criado automaticamente.
- Três novos testes automatizados; total acumulado de 82 testes.

## Transparência dos dados

Registos e fotografias são guardados localmente no navegador nesta fase. O CSV inclui o nome da fotografia, mas não incorpora os seus bytes.

## Validação local

```bash
cd AgriOS/frontend
npm install
npm run audit:prod
npm run validate
npm run dev
```

Abra `Operações > Diário do talhão`, crie um registo e adicione uma fotografia opcional.
