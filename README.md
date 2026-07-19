# FARPHA / AgriOS

Plataforma inteligente de gestão agrícola.

## Estrutura oficial

```text
AgriOS/
├── frontend/   # Aplicação React + TypeScript + Vite
├── backend/    # Serviços de backend
├── database/   # Migrações e scripts de base de dados
├── design/     # Identidade visual e recursos de design
├── docs/       # Documentação, arquitetura e histórico de sprints
└── mobile/     # Aplicação móvel (futura)
```

## Executar o frontend

```bash
cd frontend
copy .env.example .env.local
npm install
npm run dev
```

No Linux/macOS, use `cp .env.example .env.local`. Preencha as credenciais do Supabase no `.env.local`.

## Build

```bash
cd frontend
npm run build
```

Não copie `node_modules` nem `dist` entre computadores. Essas pastas são recriadas localmente.
