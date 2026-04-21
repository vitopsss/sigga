-- Migration: ater_socio_familias
-- Date: 2026-04-15
-- Desc: adiciona suporte ao modulo ATER Socio orientado a familia

CREATE TABLE IF NOT EXISTS "familias_ater" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "nomeFamilia" TEXT NOT NULL,
  "nomeResponsavel" TEXT,
  "documentoResponsavel" TEXT,
  "telefone" TEXT,
  "quantidadeMembros" INTEGER,
  "composicaoFamiliar" JSONB,
  "municipio" TEXT,
  "comunidade" TEXT,
  "ufpa" TEXT,
  "grupoInteresse" TEXT,
  "statusCadastro" TEXT,
  "situacaoProjeto" TEXT,
  "tipoAtendimento" TEXT,
  "atividadeProdutiva" TEXT,
  "projetoColetivoPrincipal" TEXT,
  "valorProjetoATER" NUMERIC(15,2),
  "valorInvestidoUFPA" NUMERIC(15,2),
  "efetividade" TEXT,
  "houveAvanco" BOOLEAN,
  "nis" TEXT,
  "codigoSGA" TEXT,
  "sgaCadastro" BOOLEAN,
  "sgaRevisao" BOOLEAN,
  "sgaIndicador" BOOLEAN,
  "sgaFotos" BOOLEAN,
  "statusSGA" TEXT,
  "ajusteProjeto" TEXT,
  "informacaoSGA" TEXT,
  "envioSGAPorAtividade" JSONB,
  "situacaoFomento" TEXT,
  "valorFomento" NUMERIC(15,2),
  "sgaStatusAnalise" TEXT,
  "sgaParcela1" TEXT,
  "sgaParcela2" TEXT,
  "sgaProjetoEnviado" BOOLEAN NOT NULL DEFAULT false,
  "cadastroId" TEXT NOT NULL UNIQUE REFERENCES "cadastros_unicos"("id") ON DELETE RESTRICT
);

ALTER TABLE "atendimentos"
  ADD COLUMN IF NOT EXISTS "familiaId" TEXT;

ALTER TABLE "atendimentos"
  ALTER COLUMN "beneficiariaId" DROP NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'atendimentos_familiaId_fkey'
  ) THEN
    ALTER TABLE "atendimentos"
      ADD CONSTRAINT "atendimentos_familiaId_fkey"
      FOREIGN KEY ("familiaId") REFERENCES "familias_ater"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS "atendimentos_familia_idx" ON "atendimentos"("familiaId");
