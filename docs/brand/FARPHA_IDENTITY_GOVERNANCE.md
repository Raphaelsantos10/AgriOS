# Governança da identidade FARPHA

## Identidade oficial

- Nome do produto: **FARPHA**
- Assinatura: **Intelligence for Agriculture**
- Descrição curta: plataforma AgTech/GIS de inteligência e gestão agrícola
- Idioma principal: `pt-PT`

O nome histórico `AgriOS` pode aparecer no caminho local, no URL atual do
repositório e em referências técnicas antigas. Não deve aparecer como marca
visível da aplicação.

## Ativos oficiais

Os componentes da aplicação devem consumir os ativos oficiais em
`frontend/src/assets/brand/`. O kit de origem e de transferência permanece em
`design/assets/`. Não devem ser introduzidas cópias redimensionadas sem uma
necessidade técnica documentada.

## Regras de interface

- Usar o componente `FarphaLogo` em vez de reconstruir a marca em cada página.
- Preservar legibilidade em temas claro e escuro.
- Não sobrepor instalação PWA, apoio, formulários ou ações essenciais.
- Respeitar `prefers-reduced-motion` e manter navegação por teclado.
- Não usar resultados agrícolas demonstrativos como provas reais.

## Verificação

Execute:

```bash
cd frontend
npm run verify:brand
```

A verificação confirma título, manifesto PWA, entrada pública V4, pacote,
assinatura, ícones e ausência dos recursos públicos antigos.
