# FARPHA UI Stabilization — Sprint 02

## Entrega

Esta sprint consolida a navegação e a experiência responsiva da aplicação.

### Implementado

- Pesquisa global funcional com `Ctrl/Cmd + K`.
- Command Palette com pesquisa, teclado, navegação e estado vazio.
- Bottom Navigation exclusiva para mobile.
- App Shell atualizado com espaço seguro para a navegação móvel.
- Header conectado à pesquisa global.
- Navegação acessível com rótulos e suporte a `Escape`.
- Componentes responsivos sem novas dependências.

## Instalação

1. Faça uma cópia de segurança do frontend atual.
2. Substitua os ficheiros incluídos neste pacote, preservando `.env.local`.
3. Execute:

```bash
npm install
npm run build
npm run dev
```

## Verificação

- `Ctrl + K` abre e fecha a pesquisa global.
- `Esc` fecha a pesquisa.
- `Enter` abre o primeiro resultado.
- Em largura mobile, a navegação inferior permanece visível.
- Em desktop, a navegação inferior não aparece.
- O build deve concluir sem erros.
