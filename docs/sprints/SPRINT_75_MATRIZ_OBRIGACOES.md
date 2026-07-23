# Sprint 75 — Matriz operacional de obrigações

## Objetivo

Transformar a matriz orientadora da Sprint 74 num acompanhamento operacional com estado, prazo, responsável e notas.

## Implementado

- Estados de trabalho `Pendente`, `Em curso`, `Concluída` e `Não aplicável` para cada tema.
- Prazo manual, a preencher somente depois de confirmado na fonte oficial ou com um técnico.
- Responsável e notas operacionais por obrigação.
- Data e hora de confirmação guardadas quando o utilizador marca uma obrigação como concluída.
- Remoção automática da confirmação se o estado deixar de ser concluído.
- Deteção e destaque de prazos ultrapassados.
- Indicadores de obrigações aplicáveis, temas a confirmar, conclusões e atrasos.
- Persistência local em `farpha.compliance-tracking.v1`, abrangida pelo backup local da Sprint 70.
- Três novos testes automatizados; total acumulado de 118 testes.

## Modelo de responsabilidade

A classificação legal (`Aplicável`, `Confirmar`, `Não aplicável`) é calculada a partir do perfil. O estado operacional (`Pendente`, `Em curso`, `Concluída`, `Não aplicável`) é definido pelo utilizador. Estes conceitos são apresentados separadamente para evitar que um clique seja interpretado como validação por uma entidade pública.

## Limitações

- O FARPHA não inventa prazos legais: o utilizador deve confirmá-los na fonte oficial.
- Uma conclusão manual não comprova entrega, aceitação ou conformidade perante o Governo.
- Comprovativos documentais serão tratados na Sprint 76.
- Nenhuma informação é submetida automaticamente a entidades públicas.
