# Sprint 62 — Gestão de máquinas

## Objetivo

Controlar utilização, combustível, custos e manutenção preventiva de máquinas agrícolas.

## Implementado

- Página funcional `Máquinas` no menu Monitorização.
- Categorias para tratores, alfaias, colhedoras, pulverizadores, rega, veículos e outros.
- Marca, modelo, matrícula ou identificação e estado operacional.
- Registo acumulado de horas e combustível.
- Custo por hora e custo estimado de utilização.
- Última e próxima manutenção por data.
- Próxima manutenção por horas do equipamento.
- Alertas de manutenção vencida ou próxima.
- Registo de utilização com validação de horas e combustível.
- Marcação de manutenção concluída e novo planeamento.
- Remoção controlada e exportação CSV.
- Nenhuma máquina demonstrativa criada automaticamente.
- Três novos testes automatizados; total acumulado de 79 testes.

## Transparência dos dados

Máquinas e utilizações são guardadas localmente no navegador nesta fase. Somente dados introduzidos pelo utilizador são apresentados.

## Validação local

```bash
cd AgriOS/frontend
npm install
npm run audit:prod
npm run validate
npm run dev
```

Abra `Monitorização > Máquinas`, cadastre uma máquina e registe utilização.
