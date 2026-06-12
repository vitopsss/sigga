ALTER TABLE "diagnosticos_ufpa"
ADD COLUMN "possuiOutroMeioComunicacao" BOOLEAN;

ALTER TABLE "indicadores_ufpa"
ADD COLUMN "entidadeExecutoraNome" TEXT,
ADD COLUMN "entidadeExecutoraCnpj" TEXT,
ADD COLUMN "unidadeServicos" TEXT,
ADD COLUMN "numeroInstrumento" TEXT,
ADD COLUMN "agenteAterNome1" TEXT,
ADD COLUMN "agenteAterCpf1" TEXT,
ADD COLUMN "agenteAterNome2" TEXT,
ADD COLUMN "agenteAterCpf2" TEXT,
ADD COLUMN "agenteAterNome3" TEXT,
ADD COLUMN "agenteAterCpf3" TEXT,
ADD COLUMN "localUf" TEXT,
ADD COLUMN "localMunicipio" TEXT,
ADD COLUMN "localOrganizacaoColetiva" TEXT;
