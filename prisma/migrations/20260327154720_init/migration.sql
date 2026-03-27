-- CreateEnum
CREATE TYPE "TipoPessoa" AS ENUM ('PF', 'PJ');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'GERENTE', 'COORDENADOR_PROJETO', 'OPERADOR');

-- CreateEnum
CREATE TYPE "StatusProjeto" AS ENUM ('EM_ELABORACAO', 'ATIVO', 'PAUSADO', 'CONCLUIDO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "StatusGeral" AS ENUM ('ATIVO', 'INATIVO');

-- CreateTable
CREATE TABLE "cadastros_unicos" (
    "id" TEXT NOT NULL,
    "tipoPessoa" "TipoPessoa" NOT NULL,
    "nome" TEXT NOT NULL,
    "nomeFantasia" TEXT,
    "documento" TEXT NOT NULL,
    "emailContato" TEXT,
    "telefone" TEXT,
    "endereco" TEXT,
    "status" "StatusGeral" NOT NULL DEFAULT 'ATIVO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cadastros_unicos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "role" "Role" NOT NULL DEFAULT 'OPERADOR',
    "cadastroId" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "acessos_projetos" (
    "userId" TEXT NOT NULL,
    "projetoId" TEXT NOT NULL,

    CONSTRAINT "acessos_projetos_pkey" PRIMARY KEY ("userId","projetoId")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projetos" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "descricao" TEXT,
    "dataInicio" TIMESTAMP(3) NOT NULL,
    "dataFim" TIMESTAMP(3),
    "status" "StatusProjeto" NOT NULL DEFAULT 'EM_ELABORACAO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projetos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "planos_trabalho" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT,
    "projetoId" TEXT NOT NULL,

    CONSTRAINT "planos_trabalho_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "atividades" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "dataPrevista" TIMESTAMP(3),
    "status" TEXT NOT NULL,
    "planoTrabalhoId" TEXT NOT NULL,

    CONSTRAINT "atividades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "colaboradores" (
    "id" TEXT NOT NULL,
    "cargo" TEXT NOT NULL,
    "dataAdmissao" TIMESTAMP(3) NOT NULL,
    "dataDesligamento" TIMESTAMP(3),
    "salarioBase" DECIMAL(10,2) NOT NULL,
    "status" "StatusGeral" NOT NULL DEFAULT 'ATIVO',
    "cadastroId" TEXT NOT NULL,

    CONSTRAINT "colaboradores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alocacoes_projetos" (
    "id" TEXT NOT NULL,
    "colaboradorId" TEXT NOT NULL,
    "projetoId" TEXT NOT NULL,
    "porcentagem" DECIMAL(5,2) NOT NULL,
    "dataInicio" TIMESTAMP(3) NOT NULL,
    "dataFim" TIMESTAMP(3),

    CONSTRAINT "alocacoes_projetos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lancamentos_folhas" (
    "id" TEXT NOT NULL,
    "competencia" TIMESTAMP(3) NOT NULL,
    "valorTotal" DECIMAL(10,2) NOT NULL,
    "tipo" TEXT NOT NULL,
    "colaboradorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lancamentos_folhas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "borderos" (
    "id" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "valorTotal" DECIMAL(10,2) NOT NULL,
    "dataVencimento" TIMESTAMP(3) NOT NULL,
    "dataPagamento" TIMESTAMP(3),
    "status" TEXT NOT NULL,
    "projetoId" TEXT NOT NULL,
    "favorecidoId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "borderos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cadastros_unicos_documento_key" ON "cadastros_unicos"("documento");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_cadastroId_key" ON "users"("cadastroId");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_providerAccountId_key" ON "accounts"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_sessionToken_key" ON "sessions"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "projetos_codigo_key" ON "projetos"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "colaboradores_cadastroId_key" ON "colaboradores"("cadastroId");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_cadastroId_fkey" FOREIGN KEY ("cadastroId") REFERENCES "cadastros_unicos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "acessos_projetos" ADD CONSTRAINT "acessos_projetos_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "acessos_projetos" ADD CONSTRAINT "acessos_projetos_projetoId_fkey" FOREIGN KEY ("projetoId") REFERENCES "projetos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "planos_trabalho" ADD CONSTRAINT "planos_trabalho_projetoId_fkey" FOREIGN KEY ("projetoId") REFERENCES "projetos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "atividades" ADD CONSTRAINT "atividades_planoTrabalhoId_fkey" FOREIGN KEY ("planoTrabalhoId") REFERENCES "planos_trabalho"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "colaboradores" ADD CONSTRAINT "colaboradores_cadastroId_fkey" FOREIGN KEY ("cadastroId") REFERENCES "cadastros_unicos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alocacoes_projetos" ADD CONSTRAINT "alocacoes_projetos_colaboradorId_fkey" FOREIGN KEY ("colaboradorId") REFERENCES "colaboradores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alocacoes_projetos" ADD CONSTRAINT "alocacoes_projetos_projetoId_fkey" FOREIGN KEY ("projetoId") REFERENCES "projetos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lancamentos_folhas" ADD CONSTRAINT "lancamentos_folhas_colaboradorId_fkey" FOREIGN KEY ("colaboradorId") REFERENCES "colaboradores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "borderos" ADD CONSTRAINT "borderos_projetoId_fkey" FOREIGN KEY ("projetoId") REFERENCES "projetos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "borderos" ADD CONSTRAINT "borderos_favorecidoId_fkey" FOREIGN KEY ("favorecidoId") REFERENCES "cadastros_unicos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
