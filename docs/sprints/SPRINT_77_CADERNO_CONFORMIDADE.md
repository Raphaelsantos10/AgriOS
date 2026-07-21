# Sprint 77 — Caderno de Campo de conformidade

## Objetivo

Ligar o Diário do Talhão já existente às obrigações agrícolas, evitando um segundo registo paralelo.

## Implementado

- Evolução do módulo `Diário do talhão` criado na Sprint 63.
- Associação de cada operação a um tema do Centro de Obrigações.
- Novos campos de produto/insumo, quantidade, unidade, equipamento e referência de evidência.
- Verificação de completude sem impedir registos urgentes ou observações parciais.
- Fertilização e pulverização exigem produto, quantidade e unidade para ficarem completas.
- Pulverização exige também equipamento.
- Indicador visual `Registo completo` ou `Campos em falta`, com lista do que falta.
- Resumo da quantidade de registos com conformidade completa.
- Exportação CSV ampliada com todos os novos campos.
- Três novos testes automatizados; total acumulado de 124 testes.

## Compatibilidade

Os registos anteriores permanecem disponíveis. Como não possuíam ligação a obrigação nem os campos novos, podem aparecer como incompletos; nenhum dado é eliminado ou alterado automaticamente.

## Limitações

- `Registo completo` significa apenas que os campos definidos pelo FARPHA estão preenchidos.
- Não comprova conformidade legal, autorização de um produto, dose correta ou aceitação por uma entidade.
- A referência de evidência é texto livre nesta sprint; a ligação direta ao Cofre Documental poderá ser ampliada posteriormente.
- Os dados e fotografias continuam no armazenamento local e devem ser incluídos em rotinas de backup adequadas.
