-- Desc: Adiciona o cabecalho oficial do documento Indicadores da Organizacao Coletiva - Sociobiodiversidade.

ALTER TABLE "indicadores_organizacoes_coletivas"
ADD COLUMN IF NOT EXISTS "entidadeExecutoraNome" TEXT,
ADD COLUMN IF NOT EXISTS "entidadeExecutoraCnpj" TEXT,
ADD COLUMN IF NOT EXISTS "unidadeServicos" TEXT,
ADD COLUMN IF NOT EXISTS "numeroContrato" TEXT,
ADD COLUMN IF NOT EXISTS "agenteAterNome1" TEXT,
ADD COLUMN IF NOT EXISTS "agenteAterCpf1" TEXT,
ADD COLUMN IF NOT EXISTS "agenteAterNome2" TEXT,
ADD COLUMN IF NOT EXISTS "agenteAterCpf2" TEXT,
ADD COLUMN IF NOT EXISTS "agenteAterNome3" TEXT,
ADD COLUMN IF NOT EXISTS "agenteAterCpf3" TEXT,
ADD COLUMN IF NOT EXISTS "agenteAterNome4" TEXT,
ADD COLUMN IF NOT EXISTS "agenteAterCpf4" TEXT,
ADD COLUMN IF NOT EXISTS "localEstado" TEXT,
ADD COLUMN IF NOT EXISTS "localMunicipio" TEXT,
ADD COLUMN IF NOT EXISTS "localOrganizacaoColetiva" TEXT;
