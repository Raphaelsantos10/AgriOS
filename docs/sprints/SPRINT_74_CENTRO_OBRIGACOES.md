# Sprint 74 — Centro de Obrigações

## Objetivo

Criar a base do acompanhamento de obrigações agrícolas portuguesas sem substituir as entidades públicas nem emitir conclusões jurídicas automáticas.

## Implementado

- Novo `Centro de Obrigações` no menu Sistema.
- Questionário inicial sobre atividade profissional, apoios, comercialização, fitofármacos, captação de água, pecuária, trabalhadores e Produção Integrada.
- Identificação opcional da exploração por designação e concelho, sem solicitar NIF ou credenciais.
- Matriz inicial com nove temas:
  - atividade fiscal e Segurança Social;
  - parcelário e culturas;
  - Pedido Único e compromissos PEPAC;
  - caderno de campo;
  - produtos fitofarmacêuticos;
  - captação e utilização de água;
  - produção primária e rastreabilidade;
  - pecuária;
  - trabalhadores e segurança.
- Classificação transparente em `Aplicável`, `Confirmar` ou `Não aplicável`.
- Explicação do motivo de cada resultado, entidade responsável, fonte oficial e data de verificação.
- Perfil guardado apenas no armazenamento local `farpha.compliance-profile.v1` e incluído no backup local já existente.
- Três novos testes automatizados; total acumulado de 115 testes.

## Proteção e limites

- A ferramenta não determina conformidade legal e não substitui IFAP, DGAV, APA, Autoridade Tributária, Segurança Social, ACT ou aconselhamento profissional.
- `Aplicável` indica um tema que requer acompanhamento; não significa incumprimento.
- As regras variam conforme localização, atividade, dimensão, regime, culturas, apoios e legislação em vigor.
- Nenhum dado é transmitido automaticamente a uma entidade pública.
- O utilizador deve confirmar as fontes e condições oficiais antes de qualquer submissão.

## Continuidade

A Sprint 75 acrescentará a matriz detalhada com prazos, responsáveis, estado e campos de confirmação. As sprints posteriores incluirão documentos, caderno de campo de conformidade, auditoria e dossiê PDF/ZIP.
