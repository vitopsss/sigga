-- Migration: ater_sociobio_v1_final
-- Date: 2026-04-15
-- Desc: Adiciona models ATER Sociobio V1 ao schema
-- Models: Tecnico, Atendimento, Fomento + campos ATER em Beneficiaria

-- =============================================
-- Beneficiaria: novos campos ATER e SGA
-- =============================================

ALTER TABLE "beneficiarias"
  ADD COLUMN IF NOT EXISTS "grupoInteresse" TEXT,
  ADD COLUMN IF NOT EXISTS "statusCadastro" TEXT,
  ADD COLUMN IF NOT EXISTS "situacaoProjeto" TEXT,
  ADD COLUMN IF NOT EXISTS "tipoAtendimento" TEXT,
  ADD COLUMN IF NOT EXISTS "atividadeProdutiva" TEXT,
  ADD COLUMN IF NOT EXISTS "projetoColetivoPrincipal" TEXT,
  ADD COLUMN IF NOT EXISTS "valorProjetoATER" NUMERIC(15,2),
  ADD COLUMN IF NOT EXISTS "valorInvestidoUFPA" NUMERIC(15,2),
  ADD COLUMN IF NOT EXISTS "efetividade" TEXT,
  ADD COLUMN IF NOT EXISTS "houveAvanco" BOOLEAN,
  ADD COLUMN IF NOT EXISTS "sgaCadastro" BOOLEAN,
  ADD COLUMN IF NOT EXISTS "sgaRevisao" BOOLEAN,
  ADD COLUMN IF NOT EXISTS "sgaIndicador" BOOLEAN,
  ADD COLUMN IF NOT EXISTS "sgaFotos" BOOLEAN,
  ADD COLUMN IF NOT EXISTS "statusSGA" TEXT,
  ADD COLUMN IF NOT EXISTS "ajusteProjeto" TEXT,
  ADD COLUMN IF NOT EXISTS "informacaoSGA" TEXT,
  ADD COLUMN IF NOT EXISTS "envioSGAPorAtividade" JSONB;

-- =============================================
-- Tecnico: equipe tecnica / extensao rural
-- =============================================

CREATE TABLE IF NOT EXISTS "tecnicos_ater" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "nome" TEXT NOT NULL,
  "cpf" TEXT NOT NULL UNIQUE,
  "registroConselho" TEXT,
  "uf" TEXT,
  "ativo" BOOLEAN NOT NULL DEFAULT true
);

CREATE INDEX IF NOT EXISTS "tecnicos_ater_cpf_idx" ON "tecnicos_ater"("cpf");

-- =============================================
-- Fomento: fomento territorial
-- =============================================

CREATE TABLE IF NOT EXISTS "fomentos" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "situacao" TEXT,
  "valorFomento" NUMERIC(15,2),
  "valorInvestido" NUMERIC(15,2),
  "retornoCampo" TEXT,
  "orientacoes" TEXT,
  "analiseAnater" TEXT,
  "beneficiariaId" TEXT NOT NULL UNIQUE REFERENCES "beneficiarias"("id") ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "fomentos_beneficiaria_idx" ON "fomentos"("beneficiariaId");

-- =============================================
-- Atendimento: visitas tecnicas de campo
-- =============================================

CREATE TABLE IF NOT EXISTS "atendimentos" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "numeroVisita" INTEGER NOT NULL,
  "data" TIMESTAMPTZ,
  "tecnico" TEXT,
  "projetoId" TEXT,
  "projetoTitulo" TEXT,
  "statusRelatorio" TEXT NOT NULL DEFAULT 'PENDENTE',
  "houveAtendimento" BOOLEAN,
  "enviadoSGA" BOOLEAN NOT NULL DEFAULT false,
  "dataEnvioSGA" TIMESTAMPTZ,
  "eixoProdutivo" JSONB,
  "eixoSocial" JSONB,
  "eixoAmbiental" JSONB,
  "tecnicoId" TEXT REFERENCES "tecnicos_ater"("id") ON DELETE SET NULL,
  "beneficiariaId" TEXT NOT NULL REFERENCES "beneficiarias"("id") ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "atendimentos_beneficiaria_idx" ON "atendimentos"("beneficiariaId");
CREATE INDEX IF NOT EXISTS "atendimentos_tecnico_idx" ON "atendimentos"("tecnicoId");
CREATE INDEX IF NOT EXISTS "atendimentos_numeroVisita_idx" ON "atendimentos"("numeroVisita");
