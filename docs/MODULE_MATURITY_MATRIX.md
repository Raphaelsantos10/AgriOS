# Matriz de maturidade dos módulos FARPHA

Versão: `2026-07-23.111`

Esta matriz responde de forma verificável à pergunta: **o módulo está ligado a
dados reais, funciona apenas parcialmente, demonstra uma experiência futura ou
ainda está planeado?**

| Estado | Total | Significado |
| --- | ---: | --- |
| Real | 14 | Fluxo ligado à fonte declarada, sujeito a configuração e validação operacional |
| Parcial | 22 | Interface utilizável, mas integração, persistência ou validação incompleta |
| Demonstrativo | 4 | Experiência com dados simulados ou sem motor de produção |
| Planeado | 4 | Item de roadmap ainda sem implementação operacional |
| **Total** | **44** | 40 rotas da aplicação e 4 capacidades futuras |

## Módulos reais

- Explorações, detalhe da exploração e GIS.
- Missões.
- Ordens de trabalho e custos agrícolas.
- Clima através de Open-Meteo.
- Prontidão e segurança local.
- Solo através de SoilGrids.
- Risco oficial de incêndio através do IPMA.
- Biblioteca de culturas.
- Perfil ambiental do talhão.
- Irrigação e incêndio por talhão.
- Diagnóstico técnico.

“Real” não significa automaticamente “validado em produção”. Migrações, RLS,
credenciais, disponibilidade das APIs e testes agrícolas continuam necessários.

## Módulos demonstrativos declarados

- Digital Twin.
- Agricultura de Precisão.
- Página FARPHA Intelligence.
- Automações.

O Centro de Ajuda possui integração online separada através da Edge Function
`farpha-intelligence`. Isso não transforma os indicadores demonstrativos da
página Intelligence em previsões agrícolas reais.

## Persistência local prioritária

Inventário, máquinas, diário, colheitas, conformidade, tratamentos, água,
IFAP/PEPAC e dados fiscais ainda usam principalmente armazenamento do navegador.
Ordens de trabalho e custos foram migrados na Sprint 110, mantendo fallback
local identificado quando o Supabase não está disponível.

## Fonte integral

O registo completo encontra-se em
`frontend/src/features/diagnostics/data/moduleMaturity.ts`. A página
**Diagnóstico** permite pesquisar, filtrar e exportar a matriz em CSV.

Verificação:

```bash
cd frontend
npm run verify:maturity
```

O comando bloqueia rotas sem classificação e protege os totais conhecidos.
