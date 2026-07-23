# Sprint 76 — Cofre Documental

## Objetivo

Associar licenças, certificados, comprovativos e faturas às obrigações agrícolas, com controlo de validade e sem transmissão externa.

## Implementado

- Nova página `Cofre Documental` no menu Sistema.
- Associação de cada documento a um dos nove temas do Centro de Obrigações.
- Categorias licença/título, certificado, comprovativo, fatura e outro.
- Entidade emissora, referência, emissão e validade.
- Anexos PDF, JPEG, PNG e WebP limitados a 5 MB.
- Impressão SHA-256 calculada no navegador para identificação do ficheiro.
- Armazenamento do anexo e metadados no IndexedDB local.
- Download e eliminação individual com confirmação.
- Indicadores de documentos válidos, a expirar em 30 dias, expirados e sem validade.
- Três novos testes automatizados; total acumulado de 121 testes.

## Segurança e limitações

- O armazenamento local desta versão não é cifrado e não deve ser utilizado num dispositivo partilhado.
- Os anexos não são enviados para FARPHA, Governo ou outros servidores.
- O backup JSON da Sprint 70 inclui dados `localStorage`, mas não os ficheiros IndexedDB deste cofre.
- O utilizador deve conservar cópias externas protegidas e testar a respetiva recuperação.
- O estado de validade depende da data introduzida e deve ser confirmado no documento e na fonte oficial.
- A Sprint 87 está planeada para segurança avançada, permissões e encriptação.
