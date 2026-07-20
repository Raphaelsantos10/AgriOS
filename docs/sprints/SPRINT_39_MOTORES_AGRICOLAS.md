# Sprint 39 — Validação dos motores agrícolas

## Objetivo

Proteger os cálculos existentes de irrigação e aptidão de culturas antes de integrar dados externos.

## Implementado

- Testes de necessidade, prioridade, volume e duração de rega.
- Cobertura de chuva, solo arenoso/argiloso e ausência de sistema.
- Verificação dos limites de água e confiança.
- Testes de aptidão por pH, frio, água, geada, calor e drenagem.
- Validação do ganho simulado com irrigação.
- Cobertura da confiança com dados ambientais incompletos.
- Confirmação dos seis fatores explicáveis do motor.
- Total acumulado esperado: 43 testes automatizados.

## Limites preservados

- Sem alterações no Supabase, autenticação, rotas ou banco.
- Sem alteração das fórmulas existentes.
