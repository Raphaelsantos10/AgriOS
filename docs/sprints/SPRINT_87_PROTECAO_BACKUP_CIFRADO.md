# Sprint 87 — Proteção local e backups cifrados

- Bloqueio opcional de toda a interface, configurado em Sistema > Definições.
- Palavra-passe com mínimo de 12 caracteres, maiúscula, minúscula, número e símbolo.
- Verificador derivado com PBKDF2-SHA-256 e 210 000 iterações; a palavra-passe não é guardada.
- Backup das chaves `farpha.*` cifrado por AES-256-GCM com salt e IV aleatórios.
- Deteção de palavra-passe incorreta, ficheiro danificado ou formato incompatível.
- Botões para bloquear imediatamente, desativar com confirmação e restaurar backup cifrado.
- Três novos testes; total acumulado de 154.

Limitações: o bloqueio local não substitui login no servidor, RLS ou controlo de utilizadores. Os anexos do Cofre ficam no IndexedDB e não entram neste backup. O backup JSON legado continua disponível para compatibilidade, mas não é cifrado. Se a palavra-passe for perdida, o FARPHA não consegue recuperá-la nem decifrar o backup.
