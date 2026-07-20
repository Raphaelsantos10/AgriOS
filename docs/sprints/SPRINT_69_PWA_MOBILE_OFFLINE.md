# Sprint 69 — Aplicação móvel/PWA

## Objetivo

Permitir instalar o FARPHA como aplicação e manter acesso limitado quando a ligação à Internet falhar.

## Implementado

- Manifesto PWA com nome, cores, idioma e ícones oficiais em 192 e 512 pixels.
- Instalação em modo standalone em navegadores compatíveis.
- Botão de instalação apresentado quando o navegador disponibiliza essa possibilidade.
- Service worker com cache da estrutura principal e recursos visitados.
- Fallback offline para a aplicação após uma primeira visita online.
- Aviso automático quando a ligação é perdida.
- Diário, colheitas, custos, inventário, máquinas e outros dados locais mantidos no dispositivo.
- Última previsão meteorológica guardada continua disponível localmente.
- Supabase, novas previsões e outras APIs não são simuladas quando não existe rede.
- Limpeza automática de caches de versões PWA anteriores.
- Nova verificação `verify:pwa` integrada em `npm run validate`.
- Três novos testes automatizados; total acumulado de 100 testes.

## Limites do modo offline

O primeiro acesso deve ser realizado com Internet. Apenas páginas e recursos previamente carregados ficam disponíveis. Operações dependentes do Supabase ou de serviços externos precisam de ligação e não são colocadas numa fila de sincronização nesta sprint.

## Teste local

```bash
cd AgriOS/frontend
npm install
npm run audit:prod
npm run validate
npm run preview
```

Abra o endereço local indicado pelo terminal. O service worker só é registado no build de produção/preview, não no servidor de desenvolvimento.
