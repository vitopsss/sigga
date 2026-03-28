-- CreateTable
CREATE TABLE "empreendimentos" (
    "id" TEXT NOT NULL,
    "matricula" TEXT,
    "nome" TEXT NOT NULL,
    "segmento" TEXT,
    "status" TEXT DEFAULT 'ATIVO',
    "cadastroId" TEXT NOT NULL,

    CONSTRAINT "empreendimentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contribuicoes_fundo" (
    "id" TEXT NOT NULL,
    "parcela" TEXT,
    "mesReferencia" INTEGER,
    "anoReferencia" INTEGER,
    "valorGerado" DECIMAL(15,2) NOT NULL,
    "valorPago" DECIMAL(15,2),
    "dataVencimento" TIMESTAMP(3),
    "dataPagamento" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'PENDENTE',
    "empreendimentoId" TEXT NOT NULL,

    CONSTRAINT "contribuicoes_fundo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "empreendimentos_matricula_key" ON "empreendimentos"("matricula");

-- CreateIndex
CREATE UNIQUE INDEX "empreendimentos_cadastroId_key" ON "empreendimentos"("cadastroId");

-- AddForeignKey
ALTER TABLE "empreendimentos" ADD CONSTRAINT "empreendimentos_cadastroId_fkey" FOREIGN KEY ("cadastroId") REFERENCES "cadastros_unicos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contribuicoes_fundo" ADD CONSTRAINT "contribuicoes_fundo_empreendimentoId_fkey" FOREIGN KEY ("empreendimentoId") REFERENCES "empreendimentos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
