## SIGGA v5

SIGGA v5 e um MVP de sistema de gestao institucional do Instituto Acariquara.

O projeto foi evoluido sobre o app e o banco atuais, com foco operacional e entrega incremental.

## Stack

- Next.js 16.2.1
- React 19.2.4
- Prisma
- PostgreSQL / Supabase

## Modulos principais

- Cadastro Unico
- Projetos
- Financeiro
- Compras e contratos
- ATER Sociobio

## Requisitos

- Node.js 20+
- NPM
- Banco configurado nas variaveis de ambiente

## Variaveis de ambiente

O projeto depende de um arquivo `.env` com as conexoes de banco e servicos externos.

Exemplo de variaveis utilizadas:

- `DATABASE_URL`
- `DIRECT_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Desenvolvimento

Instalacao:

```bash
npm install
```

Ambiente local:

```bash
npm run dev
```

Abra `http://localhost:3000`.

## Validacao

```bash
npm run lint
npx tsc --noEmit
npm run build
```

## Publicacao

Para disponibilizar o sistema para uso compartilhado, e necessario:

- publicar a aplicacao em um servidor ou provedor de hospedagem;
- configurar as variaveis de ambiente;
- aplicar as migrations do Prisma no ambiente;
- apontar um dominio ou utilizar a URL do provedor.
