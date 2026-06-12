-- Migration: diagnostico_ufpa_cabecalho_oficial
-- Date: 2026-05-27
-- Desc: Adiciona o cabecalho oficial do documento Diagnostico da UFPA - Sociobiodiversidade.

ALTER TABLE "diagnosticos_ufpa"
  ADD COLUMN IF NOT EXISTS "entidadeExecutoraNome" TEXT,
  ADD COLUMN IF NOT EXISTS "entidadeExecutoraCnpj" TEXT,
  ADD COLUMN IF NOT EXISTS "unidadeServicos" TEXT,
  ADD COLUMN IF NOT EXISTS "numeroInstrumento" TEXT,
  ADD COLUMN IF NOT EXISTS "localUf" TEXT,
  ADD COLUMN IF NOT EXISTS "localMunicipio" TEXT,
  ADD COLUMN IF NOT EXISTS "localOrganizacaoColetiva" TEXT;
