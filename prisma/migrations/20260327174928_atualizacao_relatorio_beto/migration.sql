/*
  Warnings:

  - The values [ADMIN] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `createdAt` on the `borderos` table. All the data in the column will be lost.
  - You are about to drop the column `dataPagamento` on the `borderos` table. All the data in the column will be lost.
  - You are about to drop the column `dataVencimento` on the `borderos` table. All the data in the column will be lost.
  - You are about to drop the column `descricao` on the `borderos` table. All the data in the column will be lost.
  - You are about to drop the column `favorecidoId` on the `borderos` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `borderos` table. All the data in the column will be lost.
  - You are about to drop the column `valorTotal` on the `borderos` table. All the data in the column will be lost.
  - You are about to drop the column `emailContato` on the `cadastros_unicos` table. All the data in the column will be lost.
  - You are about to drop the column `nomeFantasia` on the `cadastros_unicos` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `cadastros_unicos` table. All the data in the column will be lost.
  - You are about to drop the column `tipoPessoa` on the `cadastros_unicos` table. All the data in the column will be lost.
  - You are about to drop the column `dataAdmissao` on the `colaboradores` table. All the data in the column will be lost.
  - You are about to drop the column `dataDesligamento` on the `colaboradores` table. All the data in the column will be lost.
  - The `status` column on the `colaboradores` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `codigo` on the `projetos` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `projetos` table. All the data in the column will be lost.
  - You are about to drop the column `dataFim` on the `projetos` table. All the data in the column will be lost.
  - You are about to drop the column `dataInicio` on the `projetos` table. All the data in the column will be lost.
  - You are about to drop the column `descricao` on the `projetos` table. All the data in the column will be lost.
  - You are about to drop the column `nome` on the `projetos` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `projetos` table. All the data in the column will be lost.
  - You are about to drop the column `emailVerified` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `accounts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `acessos_projetos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `alocacoes_projetos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `atividades` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `lancamentos_folhas` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `planos_trabalho` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sessions` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[idBordero]` on the table `borderos` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[idRH]` on the table `colaboradores` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[centroCusto]` on the table `projetos` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `idBordero` to the `borderos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipo` to the `cadastros_unicos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idRH` to the `colaboradores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `centroCusto` to the `projetos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `titulo` to the `projetos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `valorTotal` to the `projetos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vigenciaInicial` to the `projetos` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `status` on the `projetos` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "TipoCadastro" AS ENUM ('PF', 'PJ');

-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('ADMINISTRADOR_DIRETOR', 'GERENTE', 'COORDENADOR_PROJETO', 'OPERADOR');
ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'OPERADOR';
COMMIT;

-- DropForeignKey
ALTER TABLE "accounts" DROP CONSTRAINT "accounts_userId_fkey";

-- DropForeignKey
ALTER TABLE "acessos_projetos" DROP CONSTRAINT "acessos_projetos_projetoId_fkey";

-- DropForeignKey
ALTER TABLE "acessos_projetos" DROP CONSTRAINT "acessos_projetos_userId_fkey";

-- DropForeignKey
ALTER TABLE "alocacoes_projetos" DROP CONSTRAINT "alocacoes_projetos_colaboradorId_fkey";

-- DropForeignKey
ALTER TABLE "alocacoes_projetos" DROP CONSTRAINT "alocacoes_projetos_projetoId_fkey";

-- DropForeignKey
ALTER TABLE "atividades" DROP CONSTRAINT "atividades_planoTrabalhoId_fkey";

-- DropForeignKey
ALTER TABLE "borderos" DROP CONSTRAINT "borderos_favorecidoId_fkey";

-- DropForeignKey
ALTER TABLE "lancamentos_folhas" DROP CONSTRAINT "lancamentos_folhas_colaboradorId_fkey";

-- DropForeignKey
ALTER TABLE "planos_trabalho" DROP CONSTRAINT "planos_trabalho_projetoId_fkey";

-- DropForeignKey
ALTER TABLE "sessions" DROP CONSTRAINT "sessions_userId_fkey";

-- DropIndex
DROP INDEX "projetos_codigo_key";

-- AlterTable
ALTER TABLE "borderos" DROP COLUMN "createdAt",
DROP COLUMN "dataPagamento",
DROP COLUMN "dataVencimento",
DROP COLUMN "descricao",
DROP COLUMN "favorecidoId",
DROP COLUMN "updatedAt",
DROP COLUMN "valorTotal",
ADD COLUMN     "cadastrador" TEXT,
ADD COLUMN     "data" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "idBordero" TEXT NOT NULL,
ADD COLUMN     "tipoBordero" TEXT,
ALTER COLUMN "status" SET DEFAULT 'Pendente';

-- AlterTable
ALTER TABLE "cadastros_unicos" DROP COLUMN "emailContato",
DROP COLUMN "nomeFantasia",
DROP COLUMN "status",
DROP COLUMN "tipoPessoa",
ADD COLUMN     "agencia" TEXT,
ADD COLUMN     "banco" TEXT,
ADD COLUMN     "conta" TEXT,
ADD COLUMN     "documentosAnexos" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "origemCadastro" TEXT NOT NULL DEFAULT 'INTERNO',
ADD COLUMN     "pix" TEXT,
ADD COLUMN     "tipo" "TipoCadastro" NOT NULL;

-- AlterTable
ALTER TABLE "colaboradores" DROP COLUMN "dataAdmissao",
DROP COLUMN "dataDesligamento",
ADD COLUMN     "idRH" TEXT NOT NULL,
ADD COLUMN     "vinculo" TEXT,
ALTER COLUMN "cargo" DROP NOT NULL,
ALTER COLUMN "salarioBase" SET DATA TYPE DECIMAL(15,2),
DROP COLUMN "status",
ADD COLUMN     "status" TEXT;

-- AlterTable
ALTER TABLE "projetos" DROP COLUMN "codigo",
DROP COLUMN "createdAt",
DROP COLUMN "dataFim",
DROP COLUMN "dataInicio",
DROP COLUMN "descricao",
DROP COLUMN "nome",
DROP COLUMN "updatedAt",
ADD COLUMN     "abreviacao" TEXT,
ADD COLUMN     "ano" INTEGER,
ADD COLUMN     "centroCusto" TEXT NOT NULL,
ADD COLUMN     "financiador" TEXT,
ADD COLUMN     "numContrato" TEXT,
ADD COLUMN     "portfolio" TEXT,
ADD COLUMN     "titulo" TEXT NOT NULL,
ADD COLUMN     "valorTotal" DECIMAL(15,2) NOT NULL,
ADD COLUMN     "vigenciaFinal" TIMESTAMP(3),
ADD COLUMN     "vigenciaInicial" TIMESTAMP(3) NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "emailVerified",
DROP COLUMN "image",
ADD COLUMN     "passwordHash" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'ATIVO';

-- DropTable
DROP TABLE "accounts";

-- DropTable
DROP TABLE "acessos_projetos";

-- DropTable
DROP TABLE "alocacoes_projetos";

-- DropTable
DROP TABLE "atividades";

-- DropTable
DROP TABLE "lancamentos_folhas";

-- DropTable
DROP TABLE "planos_trabalho";

-- DropTable
DROP TABLE "sessions";

-- DropEnum
DROP TYPE "StatusGeral";

-- DropEnum
DROP TYPE "StatusProjeto";

-- DropEnum
DROP TYPE "TipoPessoa";

-- CreateTable
CREATE TABLE "orcamentos_itens" (
    "id" TEXT NOT NULL,
    "idOrc" TEXT NOT NULL,
    "planoGerencial" TEXT,
    "descricao" TEXT,
    "unidade" TEXT,
    "quantidade" INTEGER,
    "valorReferencia" DECIMAL(15,2) NOT NULL,
    "valorTotal" DECIMAL(15,2) NOT NULL,
    "projetoId" TEXT NOT NULL,

    CONSTRAINT "orcamentos_itens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "faturamentos_projetos" (
    "id" TEXT NOT NULL,
    "parcela" INTEGER,
    "vencimento" TIMESTAMP(3),
    "valorTotal" DECIMAL(15,2) NOT NULL,
    "dataLiquidacao" TIMESTAMP(3),
    "numNotaFiscal" TEXT,
    "projetoId" TEXT NOT NULL,

    CONSTRAINT "faturamentos_projetos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lancamentos_financeiros" (
    "id" TEXT NOT NULL,
    "nsu" TEXT NOT NULL,
    "fase" TEXT,
    "etapa" TEXT,
    "atividade" TEXT,
    "valor" DECIMAL(15,2) NOT NULL,
    "dataVencimento" TIMESTAMP(3) NOT NULL,
    "autorizado" BOOLEAN NOT NULL DEFAULT false,
    "conciliado" BOOLEAN NOT NULL DEFAULT false,
    "dataPagamento" TIMESTAMP(3),
    "formaPagamento" TEXT,
    "borderoId" TEXT NOT NULL,
    "favorecidoId" TEXT NOT NULL,

    CONSTRAINT "lancamentos_financeiros_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "colaboradores_projetos" (
    "id" TEXT NOT NULL,
    "porcentagem" DECIMAL(5,2) NOT NULL DEFAULT 100.00,
    "colaboradorId" TEXT NOT NULL,
    "projetoId" TEXT NOT NULL,

    CONSTRAINT "colaboradores_projetos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "beneficiarias" (
    "id" TEXT NOT NULL,
    "codigoSGA" TEXT,
    "nis" TEXT,
    "municipio" TEXT,
    "comunidade" TEXT,
    "ufpa" TEXT,
    "cadastroId" TEXT NOT NULL,

    CONSTRAINT "beneficiarias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "atendimentos_tecnicos" (
    "id" TEXT NOT NULL,
    "idTec" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tecnico" TEXT NOT NULL,
    "produtivoAcao" TEXT,
    "produtivoImpacto" TEXT,
    "socialAcao" TEXT,
    "socialImpacto" TEXT,
    "ambientalAcao" TEXT,
    "ambientalImpacto" TEXT,
    "beneficiariaId" TEXT NOT NULL,

    CONSTRAINT "atendimentos_tecnicos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "controle_sga" (
    "id" TEXT NOT NULL,
    "statusAnalise" TEXT,
    "parcela1" TEXT,
    "parcela2" TEXT,
    "projetoEnviado" BOOLEAN NOT NULL DEFAULT false,
    "beneficiariaId" TEXT NOT NULL,

    CONSTRAINT "controle_sga_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "planejamento_ater" (
    "id" TEXT NOT NULL,
    "numMeta" INTEGER NOT NULL,
    "descricao" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "valorUnitario" DECIMAL(15,2) NOT NULL,
    "projetoId" TEXT NOT NULL,

    CONSTRAINT "planejamento_ater_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projetos_produtivos" (
    "id" TEXT NOT NULL,
    "atividade" TEXT NOT NULL,
    "situacao" TEXT,
    "projetoId" TEXT NOT NULL,

    CONSTRAINT "projetos_produtivos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contratos_fornecedores" (
    "id" TEXT NOT NULL,
    "idContrato" TEXT NOT NULL,
    "objeto" TEXT,
    "valorTotal" DECIMAL(15,2) NOT NULL,
    "status" TEXT,
    "fornecedorId" TEXT NOT NULL,

    CONSTRAINT "contratos_fornecedores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patrimonio" (
    "id" TEXT NOT NULL,
    "tombamento" TEXT,
    "descricao" TEXT NOT NULL,
    "status" TEXT,
    "valorAquisicao" DECIMAL(15,2),

    CONSTRAINT "patrimonio_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "orcamentos_itens_idOrc_key" ON "orcamentos_itens"("idOrc");

-- CreateIndex
CREATE UNIQUE INDEX "lancamentos_financeiros_nsu_key" ON "lancamentos_financeiros"("nsu");

-- CreateIndex
CREATE UNIQUE INDEX "beneficiarias_codigoSGA_key" ON "beneficiarias"("codigoSGA");

-- CreateIndex
CREATE UNIQUE INDEX "beneficiarias_nis_key" ON "beneficiarias"("nis");

-- CreateIndex
CREATE UNIQUE INDEX "beneficiarias_cadastroId_key" ON "beneficiarias"("cadastroId");

-- CreateIndex
CREATE UNIQUE INDEX "atendimentos_tecnicos_idTec_key" ON "atendimentos_tecnicos"("idTec");

-- CreateIndex
CREATE UNIQUE INDEX "controle_sga_beneficiariaId_key" ON "controle_sga"("beneficiariaId");

-- CreateIndex
CREATE UNIQUE INDEX "contratos_fornecedores_idContrato_key" ON "contratos_fornecedores"("idContrato");

-- CreateIndex
CREATE UNIQUE INDEX "patrimonio_tombamento_key" ON "patrimonio"("tombamento");

-- CreateIndex
CREATE UNIQUE INDEX "borderos_idBordero_key" ON "borderos"("idBordero");

-- CreateIndex
CREATE UNIQUE INDEX "colaboradores_idRH_key" ON "colaboradores"("idRH");

-- CreateIndex
CREATE UNIQUE INDEX "projetos_centroCusto_key" ON "projetos"("centroCusto");

-- AddForeignKey
ALTER TABLE "orcamentos_itens" ADD CONSTRAINT "orcamentos_itens_projetoId_fkey" FOREIGN KEY ("projetoId") REFERENCES "projetos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "faturamentos_projetos" ADD CONSTRAINT "faturamentos_projetos_projetoId_fkey" FOREIGN KEY ("projetoId") REFERENCES "projetos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lancamentos_financeiros" ADD CONSTRAINT "lancamentos_financeiros_borderoId_fkey" FOREIGN KEY ("borderoId") REFERENCES "borderos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lancamentos_financeiros" ADD CONSTRAINT "lancamentos_financeiros_favorecidoId_fkey" FOREIGN KEY ("favorecidoId") REFERENCES "cadastros_unicos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "colaboradores_projetos" ADD CONSTRAINT "colaboradores_projetos_colaboradorId_fkey" FOREIGN KEY ("colaboradorId") REFERENCES "colaboradores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "colaboradores_projetos" ADD CONSTRAINT "colaboradores_projetos_projetoId_fkey" FOREIGN KEY ("projetoId") REFERENCES "projetos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "beneficiarias" ADD CONSTRAINT "beneficiarias_cadastroId_fkey" FOREIGN KEY ("cadastroId") REFERENCES "cadastros_unicos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "atendimentos_tecnicos" ADD CONSTRAINT "atendimentos_tecnicos_beneficiariaId_fkey" FOREIGN KEY ("beneficiariaId") REFERENCES "beneficiarias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "controle_sga" ADD CONSTRAINT "controle_sga_beneficiariaId_fkey" FOREIGN KEY ("beneficiariaId") REFERENCES "beneficiarias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "planejamento_ater" ADD CONSTRAINT "planejamento_ater_projetoId_fkey" FOREIGN KEY ("projetoId") REFERENCES "projetos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projetos_produtivos" ADD CONSTRAINT "projetos_produtivos_projetoId_fkey" FOREIGN KEY ("projetoId") REFERENCES "projetos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contratos_fornecedores" ADD CONSTRAINT "contratos_fornecedores_fornecedorId_fkey" FOREIGN KEY ("fornecedorId") REFERENCES "cadastros_unicos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
