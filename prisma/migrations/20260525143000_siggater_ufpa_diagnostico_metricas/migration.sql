-- Migration: siggater_ufpa_diagnostico_metricas
-- Date: 2026-05-25
-- Desc: Evolui SIGGATER para UFPA, Organizacao Coletiva, diagnostico estruturado, indicadores e metricas.

-- =============================================
-- Organizacao Coletiva
-- =============================================

CREATE TABLE IF NOT EXISTS "organizacoes_coletivas" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "denominacao" TEXT NOT NULL,
  "cnpj" TEXT,
  "uf" TEXT,
  "municipio" TEXT,
  "dataCadastro" TIMESTAMP(3),
  "entidadeExecutoraNome" TEXT,
  "entidadeExecutoraCnpj" TEXT,
  "unidadeServicos" TEXT,
  "numeroInstrumento" TEXT,
  "agenteAterNome" TEXT,
  "agenteAterCpf" TEXT,
  "numeroFamilias" INTEGER,
  "atividades" JSONB,
  "grupoInteresse" TEXT,
  "observacoes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "organizacoes_coletivas_denominacao_idx" ON "organizacoes_coletivas"("denominacao");
CREATE INDEX IF NOT EXISTS "organizacoes_coletivas_municipio_idx" ON "organizacoes_coletivas"("municipio");
CREATE INDEX IF NOT EXISTS "organizacoes_coletivas_cnpj_idx" ON "organizacoes_coletivas"("cnpj");

-- =============================================
-- Familias ATER agora representam UFPA no SIGGATER
-- =============================================

ALTER TABLE "familias_ater"
  ADD COLUMN IF NOT EXISTS "enderecoUfpa" TEXT,
  ADD COLUMN IF NOT EXISTS "complementoUfpa" TEXT,
  ADD COLUMN IF NOT EXISTS "cepUfpa" TEXT,
  ADD COLUMN IF NOT EXISTS "dapCaf" TEXT,
  ADD COLUMN IF NOT EXISTS "dapCafOrgaoEmissor" TEXT,
  ADD COLUMN IF NOT EXISTS "dapCafValidade" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "areaEstabelecimento" NUMERIC(12,2),
  ADD COLUMN IF NOT EXISTS "areaImovelPrincipal" NUMERIC(12,2),
  ADD COLUMN IF NOT EXISTS "classificacaoUfpa" TEXT,
  ADD COLUMN IF NOT EXISTS "bioma" TEXT,
  ADD COLUMN IF NOT EXISTS "latitude" NUMERIC(10,7),
  ADD COLUMN IF NOT EXISTS "longitude" NUMERIC(10,7),
  ADD COLUMN IF NOT EXISTS "programaFomento" TEXT,
  ADD COLUMN IF NOT EXISTS "dataEnvioSGA" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "statusGestor" TEXT,
  ADD COLUMN IF NOT EXISTS "motivoReprovacaoGestor" TEXT,
  ADD COLUMN IF NOT EXISTS "dataStatusGestor" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "organizacaoColetivaId" TEXT;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'familias_ater_organizacaoColetivaId_fkey'
  ) THEN
    ALTER TABLE "familias_ater"
      ADD CONSTRAINT "familias_ater_organizacaoColetivaId_fkey"
      FOREIGN KEY ("organizacaoColetivaId")
      REFERENCES "organizacoes_coletivas"("id")
      ON DELETE SET NULL
      ON UPDATE CASCADE;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS "familias_ater_organizacaoColetivaId_idx" ON "familias_ater"("organizacaoColetivaId");
CREATE INDEX IF NOT EXISTS "familias_ater_municipio_idx" ON "familias_ater"("municipio");
CREATE INDEX IF NOT EXISTS "familias_ater_dapCaf_idx" ON "familias_ater"("dapCaf");
CREATE INDEX IF NOT EXISTS "familias_ater_statusGestor_idx" ON "familias_ater"("statusGestor");

-- =============================================
-- Integrantes da UFPA
-- =============================================

CREATE TABLE IF NOT EXISTS "integrantes_ufpa" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "cpf" TEXT,
  "nisCadUnico" TEXT,
  "nome" TEXT NOT NULL,
  "apelido" TEXT,
  "sexo" TEXT,
  "orientacaoSexual" TEXT,
  "identidadeGenero" TEXT,
  "dataNascimento" TIMESTAMP(3),
  "escolaridade" TEXT,
  "nomeMae" TEXT,
  "nomePai" TEXT,
  "classificacao" TEXT,
  "email" TEXT,
  "telefones" TEXT,
  "responsavelUfpa" BOOLEAN NOT NULL DEFAULT false,
  "parentesco" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "familiaId" TEXT NOT NULL REFERENCES "familias_ater"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "integrantes_ufpa_familiaId_idx" ON "integrantes_ufpa"("familiaId");
CREATE INDEX IF NOT EXISTS "integrantes_ufpa_cpf_idx" ON "integrantes_ufpa"("cpf");
CREATE INDEX IF NOT EXISTS "integrantes_ufpa_nisCadUnico_idx" ON "integrantes_ufpa"("nisCadUnico");

-- =============================================
-- Diagnostico estruturado da UFPA
-- =============================================

CREATE TABLE IF NOT EXISTS "diagnosticos_ufpa" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "entidadeExecutoraNome" TEXT,
  "entidadeExecutoraCnpj" TEXT,
  "unidadeServicos" TEXT,
  "numeroInstrumento" TEXT,
  "dataDiagnostico" TIMESTAMP(3),
  "agenteAterNome" TEXT,
  "agenteAterCpf" TEXT,
  "localUf" TEXT,
  "localMunicipio" TEXT,
  "localOrganizacaoColetiva" TEXT,
  "possuiRadio" BOOLEAN,
  "possuiTelevisao" BOOLEAN,
  "possuiCelular" BOOLEAN,
  "possuiInternet" BOOLEAN,
  "usaRedesSociais" BOOLEAN,
  "outroMeioComunicacao" TEXT,
  "aguaParaConsumo" BOOLEAN,
  "aguaConsumoTratada" BOOLEAN,
  "aguaParaProducao" BOOLEAN,
  "captacaoAguaChuva" BOOLEAN,
  "esgotoTratado" BOOLEAN,
  "fontesProtegidas" BOOLEAN,
  "qtdMaquinasAgricolas" INTEGER,
  "qtdImplementosAgricolas" INTEGER,
  "qtdVeiculosPasseio" INTEGER,
  "qtdConstrucoesRurais" INTEGER,
  "qtdMotoresEletricos" INTEGER,
  "qtdConjuntosIrrigacao" INTEGER,
  "qtdAnimaisTrabalho" INTEGER,
  "qtdMaquinarioTracaoAnimal" INTEGER,
  "qtdBovinos" INTEGER,
  "qtdOvinos" INTEGER,
  "qtdCaprinos" INTEGER,
  "qtdSuinos" INTEGER,
  "qtdAves" INTEGER,
  "qtdBubalinos" INTEGER,
  "qtdEquinosMuaresAsininos" INTEGER,
  "qtdColmeias" INTEGER,
  "qtdPequenosAnimaisOutros" INTEGER,
  "areaPastagens" NUMERIC(12,2),
  "areaCulturasTemporarias" NUMERIC(12,2),
  "areaCulturasPermanentes" NUMERIC(12,2),
  "areaLaminaAgua" NUMERIC(12,2),
  "areaExtrativismo" NUMERIC(12,2),
  "areaReservaLegal" NUMERIC(12,2),
  "areaOutrosUsos" NUMERIC(12,2),
  "recursosDisponiveis" JSONB,
  "atividadesColetivas" JSONB,
  "politicasPublicas" JSONB,
  "acoesPotenciaisProdutivo" TEXT,
  "acoesPotenciaisSocial" TEXT,
  "acoesPotenciaisAmbiental" TEXT,
  "limitacoesProdutivo" TEXT,
  "limitacoesSocial" TEXT,
  "limitacoesAmbiental" TEXT,
  "lgpdConsentimento" BOOLEAN,
  "lgpdDataConsentimento" TIMESTAMP(3),
  "representanteNome" TEXT,
  "representanteCpf" TEXT,
  "observacoes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "familiaId" TEXT NOT NULL UNIQUE REFERENCES "familias_ater"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE "diagnosticos_ufpa"
  ADD COLUMN IF NOT EXISTS "entidadeExecutoraNome" TEXT,
  ADD COLUMN IF NOT EXISTS "entidadeExecutoraCnpj" TEXT,
  ADD COLUMN IF NOT EXISTS "unidadeServicos" TEXT,
  ADD COLUMN IF NOT EXISTS "numeroInstrumento" TEXT,
  ADD COLUMN IF NOT EXISTS "localUf" TEXT,
  ADD COLUMN IF NOT EXISTS "localMunicipio" TEXT,
  ADD COLUMN IF NOT EXISTS "localOrganizacaoColetiva" TEXT;

CREATE INDEX IF NOT EXISTS "diagnosticos_ufpa_aguaParaConsumo_idx" ON "diagnosticos_ufpa"("aguaParaConsumo");
CREATE INDEX IF NOT EXISTS "diagnosticos_ufpa_aguaConsumoTratada_idx" ON "diagnosticos_ufpa"("aguaConsumoTratada");
CREATE INDEX IF NOT EXISTS "diagnosticos_ufpa_possuiInternet_idx" ON "diagnosticos_ufpa"("possuiInternet");
CREATE INDEX IF NOT EXISTS "diagnosticos_ufpa_esgotoTratado_idx" ON "diagnosticos_ufpa"("esgotoTratado");

-- =============================================
-- Indicadores da UFPA
-- =============================================

CREATE TABLE IF NOT EXISTS "indicadores_ufpa" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "dataReferencia" TIMESTAMP(3),
  "alimentacaoVariadaComprometida" BOOLEAN,
  "comidaAcabouSemCondicao" BOOLEAN,
  "deixouRefeicaoSemCondicao" BOOLEAN,
  "comeuMenosSemCondicao" BOOLEAN,
  "qtdVezesComeuMenos" INTEGER,
  "sentiuFomeENaoComeu" BOOLEAN,
  "documentacaoPessoalCompleta" BOOLEAN,
  "cadastradoCadUnico" BOOLEAN,
  "acessaPoliticasSociais" BOOLEAN,
  "politicasSociaisQuais" TEXT,
  "participaGrupoComunitario" BOOLEAN,
  "qualGrupoComunitario" TEXT,
  "participaAssociacao" BOOLEAN,
  "participaCooperativa" BOOLEAN,
  "participaGrupoInformalProdutivo" BOOLEAN,
  "participaGrupoInformalSocial" BOOLEAN,
  "possuiPraticasSustentaveis" BOOLEAN,
  "praticaIntegracaoAtividades" BOOLEAN,
  "praticaDescarteCorretoEmbalagens" BOOLEAN,
  "praticaControleQueimadas" BOOLEAN,
  "praticaAdubacaoVerde" BOOLEAN,
  "praticaRecuperacaoPastagens" BOOLEAN,
  "praticaCoberturaSolo" BOOLEAN,
  "praticaManejoIntegradoPragas" BOOLEAN,
  "praticaCordoesVegetacao" BOOLEAN,
  "praticaRotacaoCulturas" BOOLEAN,
  "praticaPlantioDireto" BOOLEAN,
  "praticaPousio" BOOLEAN,
  "praticaProtecaoNascentes" BOOLEAN,
  "praticaPreservacaoApps" BOOLEAN,
  "praticaManejoFlorestal" BOOLEAN,
  "praticaRecomposicaoFlorestal" BOOLEAN,
  "motivoSemPraticaFinanceiro" BOOLEAN,
  "motivoSemPraticaFaltaInformacao" BOOLEAN,
  "motivoSemPraticaTecnologico" BOOLEAN,
  "motivoSemPraticaFaltaInteresse" BOOLEAN,
  "valorBrutoProducaoUltimos12Meses" NUMERIC(15,2),
  "acessaPoliticasProdutivas" BOOLEAN,
  "motivoNaoAcessaPoliticasFaltaInfo" BOOLEAN,
  "motivoNaoAcessaPoliticasDificilAcesso" BOOLEAN,
  "motivoNaoAcessaPoliticasSemInteresse" BOOLEAN,
  "acessouPaa" BOOLEAN,
  "acessouPnae" BOOLEAN,
  "acessouPgpmBio" BOOLEAN,
  "acessouPronaf" BOOLEAN,
  "linhasPronaf" JSONB,
  "canalTrocaProdutoServico" BOOLEAN,
  "canalVendaPropriedade" BOOLEAN,
  "canalVendaDiretaConsumidor" BOOLEAN,
  "canalFeira" BOOLEAN,
  "canalMercadoLocal" BOOLEAN,
  "canalAtravessador" BOOLEAN,
  "canalPaa" BOOLEAN,
  "canalPnae" BOOLEAN,
  "canalCooperativaEntreposto" BOOLEAN,
  "observacoes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "familiaId" TEXT NOT NULL UNIQUE REFERENCES "familias_ater"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "indicadores_ufpa_alimentacaoVariadaComprometida_idx" ON "indicadores_ufpa"("alimentacaoVariadaComprometida");
CREATE INDEX IF NOT EXISTS "indicadores_ufpa_comidaAcabouSemCondicao_idx" ON "indicadores_ufpa"("comidaAcabouSemCondicao");
CREATE INDEX IF NOT EXISTS "indicadores_ufpa_cadastradoCadUnico_idx" ON "indicadores_ufpa"("cadastradoCadUnico");
CREATE INDEX IF NOT EXISTS "indicadores_ufpa_acessaPoliticasSociais_idx" ON "indicadores_ufpa"("acessaPoliticasSociais");
CREATE INDEX IF NOT EXISTS "indicadores_ufpa_acessaPoliticasProdutivas_idx" ON "indicadores_ufpa"("acessaPoliticasProdutivas");

-- =============================================
-- Indicadores da Organizacao Coletiva
-- =============================================

CREATE TABLE IF NOT EXISTS "indicadores_organizacoes_coletivas" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "dataReferencia" TIMESTAMP(3),
  "possuiPraticasAmbientais" BOOLEAN,
  "praticaSeparacaoLixo" BOOLEAN,
  "praticaDescarteCorretoLixo" BOOLEAN,
  "praticaManutencaoAcessos" BOOLEAN,
  "praticaTratamentoDejetos" BOOLEAN,
  "praticaCaptacaoAguaChuva" BOOLEAN,
  "praticaEducacaoAmbiental" BOOLEAN,
  "praticaAvaliacaoPrevencaoRiscos" BOOLEAN,
  "usaIdentidadeComercial" BOOLEAN,
  "identidadeMarcaPropria" BOOLEAN,
  "identidadeSeloArte" BOOLEAN,
  "identidadeSenaf" BOOLEAN,
  "identidadeSenafSociobiodiversidade" BOOLEAN,
  "identidadeSeloQuilombos" BOOLEAN,
  "identidadeSeloIndigenas" BOOLEAN,
  "identidadeSeloPovosTradicionais" BOOLEAN,
  "possuiMulheresDiretoriaConselho" BOOLEAN,
  "possuiJovensDiretoriaConselho" BOOLEAN,
  "filiadaOrganizacao" BOOLEAN,
  "filiadaUnicafes" BOOLEAN,
  "filiadaUnicopas" BOOLEAN,
  "filiadaSistemaOcb" BOOLEAN,
  "acessaPoliticasPublicas" BOOLEAN,
  "possuiCafJuridica" BOOLEAN,
  "acessouPronafCusteio" BOOLEAN,
  "acessouPronafCapitalGiro" BOOLEAN,
  "acessouPronafMaisAlimentos" BOOLEAN,
  "acessouPronafIndustrializacao" BOOLEAN,
  "acessouPronafAgroindustria" BOOLEAN,
  "acessouPronafCotasPartes" BOOLEAN,
  "acessouPaa" BOOLEAN,
  "acessouPnae" BOOLEAN,
  "acessouPgpm" BOOLEAN,
  "acessouPgpmSociobiodiversidade" BOOLEAN,
  "acessouCooperaMaisBrasil" BOOLEAN,
  "canalTrocaProdutoServico" BOOLEAN,
  "canalVendaOrganizacao" BOOLEAN,
  "canalVendaDiretaConsumidor" BOOLEAN,
  "canalFeira" BOOLEAN,
  "canalMercadoLocal" BOOLEAN,
  "canalAtravessador" BOOLEAN,
  "canalPaa" BOOLEAN,
  "canalPnae" BOOLEAN,
  "canalMercadoJustoSolidario" BOOLEAN,
  "observacoes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "organizacaoColetivaId" TEXT NOT NULL UNIQUE REFERENCES "organizacoes_coletivas"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "indicadores_organizacoes_coletivas_possuiPraticasAmbientais_idx" ON "indicadores_organizacoes_coletivas"("possuiPraticasAmbientais");
CREATE INDEX IF NOT EXISTS "indicadores_organizacoes_coletivas_usaIdentidadeComercial_idx" ON "indicadores_organizacoes_coletivas"("usaIdentidadeComercial");
CREATE INDEX IF NOT EXISTS "indicadores_organizacoes_coletivas_acessaPoliticasPublicas_idx" ON "indicadores_organizacoes_coletivas"("acessaPoliticasPublicas");

-- =============================================
-- Atendimento / relatorio individual
-- =============================================

ALTER TABLE "atendimentos"
  ADD COLUMN IF NOT EXISTS "atividadeNumeroTotal" TEXT,
  ADD COLUMN IF NOT EXISTS "codigoMeta" TEXT,
  ADD COLUMN IF NOT EXISTS "descricaoMeta" TEXT,
  ADD COLUMN IF NOT EXISTS "numeroMulheres" INTEGER,
  ADD COLUMN IF NOT EXISTS "numeroJovens" INTEGER,
  ADD COLUMN IF NOT EXISTS "statusGestor" TEXT,
  ADD COLUMN IF NOT EXISTS "motivoReprovacaoGestor" TEXT,
  ADD COLUMN IF NOT EXISTS "dataStatusGestor" TIMESTAMPTZ;
