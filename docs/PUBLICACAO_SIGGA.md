# Publicacao do SIGGA v5

## O que e necessario

Para disponibilizar o sistema fora da maquina de desenvolvimento, e necessario:

- hospedar a aplicacao Next.js em um servidor ou provedor de hospedagem;
- configurar as variaveis de ambiente do projeto;
- garantir acesso ao banco de dados;
- aplicar as migrations do Prisma no ambiente publicado.

## Passos basicos

1. Clonar o repositorio no ambiente de destino.
2. Instalar dependencias com `npm install`.
3. Configurar o arquivo `.env` com as credenciais corretas.
4. Executar `npx prisma migrate deploy`.
5. Executar `npx prisma generate`.
6. Publicar com `npm run build` e `npm run start`, ou via plataforma compativel.

## Observacao

Nao e obrigatorio ter dominio proprio para homologar ou usar o sistema inicialmente. A aplicacao pode ser acessada pela URL gerada pelo provedor de hospedagem.
