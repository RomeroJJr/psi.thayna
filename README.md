# Thayna Christer · Psicologia Clínica

Site da psicóloga Thayna Christer em Next.js. Inclui a apresentação profissional, exemplos de atendimento, agenda de preferências com confirmação pelo WhatsApp, Entrelinhas, feed RSS e lista de interesse por e-mail.

## Desenvolvimento

Use Node.js 24. Execute `npm ci` e `npm run dev`. Para verificar a versão de produção, execute `npm run build` e `npm start`.

## Publicação na Vercel

Use o preset Next.js e a raiz do repositório. O projeto usa um Vercel Blob **privado** para as edições e inscrições. Mantenha as variáveis abaixo apenas no servidor.

- `BLOB_READ_WRITE_TOKEN` é configurada pela conexão do armazenamento.
- `SUBSCRIBER_KEY` é uma chave aleatória estável para identificar as inscrições. Preserve seu valor nas migrações.
- `EDITOR_PROOF_SHA256` é o SHA-256 hexadecimal de uma credencial editorial exclusiva da Vercel. O autor autorizado transmite a credencial em `X-Editorial-Proof` ao publicar por `POST /api/editorial`.

O agendamento editorial diário publica uma edição por data de João Pessoa. A página e o RSS leem o mesmo arquivo. O formulário registra interesse em receber o caderno por e-mail. A entrega de mensagens depende da futura configuração do remetente.
