# FARPHA Engine Framework V1

## Objetivo

Separar a lógica agrícola da interface React e iniciar o núcleo determinístico da FARPHA Intelligence.

## Motores incluídos

- Environment Engine: completude do perfil, geada e incêndio.
- Crop Engine: ranking das culturas a partir do motor de aptidão existente.
- Irrigation Engine: recomendação de rega com volume, janela e confiança.
- Decision Engine: priorização e agregação das recomendações.

## Integração

O Centro de Operações carrega dados reais do Supabase e apresenta recomendações explicáveis no painel FARPHA Intelligence.

## Limitações da V1

- A humidade do solo e a chuva prevista usam valores padrão quando não há sensores ou API meteorológica.
- Não utiliza IA generativa.
- Não executa ações automaticamente.
- As percentagens são estimativas de apoio à decisão.
