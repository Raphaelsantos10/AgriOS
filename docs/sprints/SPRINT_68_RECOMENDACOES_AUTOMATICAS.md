# Sprint 68 — Recomendações automáticas

## Objetivo

Cruzar clima, solo, cultura e histórico para produzir recomendações agrícolas explicáveis e prudentes.

## Implementado

- Novo módulo `Recomendações` no menu Inteligência.
- Seleção de exploração e talhão reais do projeto.
- Motor baseado na última previsão meteorológica consultada para a mesma exploração.
- Utilização do perfil ambiental do talhão, Diário do Talhão e histórico de colheitas.
- Recomendações para geada, calor, chuva, vento, pH, matéria orgânica, drenagem e perdas históricas.
- Prioridades urgente, alta, média e melhoria de dados.
- Evidências apresentadas em cada recomendação.
- Confiança calculada pela presença das quatro fontes necessárias.
- Indicação clara de dados em falta e como completá-los.
- Cache local da última previsão meteorológica para reutilização controlada.
- Exportação das recomendações e evidências para CSV.
- Nenhuma operação executada automaticamente.
- Três novos testes automatizados; total acumulado de 97 testes.

## Segurança agronómica

As recomendações são apoio à decisão. Não substituem observação no terreno, análise laboratorial, instruções dos produtos, restrições legais ou aconselhamento de um profissional qualificado. O motor não prescreve doses de corretivos nem inicia regas, tratamentos ou outras operações.

## Preparação das próximas integrações

A arquitetura permite acrescentar nas sprints futuras dados oficiais de risco de incêndio do IPMA, perfil estimado SoilGrids e camadas geográficas do ICNF.

## Validação local

```bash
cd AgriOS/frontend
npm install
npm run audit:prod
npm run validate
npm run dev
```

Consulte primeiro `Monitorização > Clima` para a exploração e depois abra `Inteligência > Recomendações`.
