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
- `SIGGATER_SESSION_SECRET`

### Modo SIGGATER

Para rodar o ambiente como SIGGATER isolado, configure uma das variaveis abaixo:

```bash
SIGGA_APP_SCOPE=siggater
# ou
NEXT_PUBLIC_SIGGA_APP_SCOPE=siggater
```

Em producao, defina tambem `SIGGATER_SESSION_SECRET` com um valor longo e aleatorio para assinar as sessoes de acesso.

Nesse modo, o middleware redireciona rotas fora do SIGGATER para `/ater-sociobio` e bloqueia APIs de outros modulos com `403`.
Use esse modo para demonstracao, homologacao e implantacao do SIGGATER Web sem expor os modulos de RH, financeiro, borderos, compras, patrimonio ou projetos.

Para criar ou atualizar um acesso inicial do SIGGATER:

```powershell
$env:SIGGATER_USER_PASSWORD='senha-provisoria-com-12-ou-mais-caracteres'
npm.cmd run siggater:user -- --email=usuario@instituto.org --role=COORDENADOR_PROJETO --name="Nome da Pessoa"
Remove-Item Env:SIGGATER_USER_PASSWORD
```

Perfis disponiveis:

- `ADMINISTRADOR_DIRETOR`: administracao do ambiente e acessos.
- `GERENTE`: coordenacao ampla do SIGGATER.
- `COORDENADOR_PROJETO`: coordenacao operacional.
- `OPERADOR`: equipe de campo/agente ATER.

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

## Estrutura do projeto

- `app/`: rotas e telas do Next.js.
- `components/`: componentes reutilizaveis de UI, dashboard e ATER.
- `lib/`: actions, services, constantes e acesso ao Prisma.
- `prisma/`: schema, seed e migrations.
- `docs/acariquara/`: documentacao comercial, tecnica e funcional do SIGGATER para o Instituto Acariquara.
- `docs/adr/`: decisoes de arquitetura.
- `referencias/sigga-legado/`: arquivos grandes de referencia local, fora da raiz e ignorados no Git.
- `scripts/acariquara/`: geradores de PDF e utilitarios ligados ao Acariquara.
- `scripts/import/`: scripts de importacao.

## Documentos Acariquara

Indice principal:

```text
docs/acariquara/README.md
```

PDF revisado da proposta:

```text
docs/acariquara/contratacao/Proposta_Tecnica_Comercial_SIGGATER_Web_Fase_1_Revisada.pdf
```

Gerar novamente a proposta revisada:

```bash
npm run docs:acariquara:proposta-revisada
```

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
