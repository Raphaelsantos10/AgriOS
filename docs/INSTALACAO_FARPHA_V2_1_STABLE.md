# FARPHA v2.1 Stable — correções

## Corrigido

1. **Nova Exploração:** o texto digitado nos campos agora fica visível. O formulário herdava texto branco do Centro de Operações sobre inputs brancos.
2. **Guardar Talhão:** migração compatível com versões antigas de `field_history`, incluindo `change_note`, `field_name`, `change_type` e restantes colunas esperadas pelo frontend.

## Instalação

1. Extrair o ZIP na raiz `AgriOS/` e aceitar substituir o ficheiro.
2. No Supabase, abrir **SQL Editor → New query**.
3. Executar `database/FARPHA_V2_1_FIELD_HISTORY_SYNC.sql` por inteiro.
4. Atualizar o navegador com `Ctrl + F5`.
5. Na pasta `frontend`, executar:

```bash
npm run lint
npm run build
npm run dev
```
