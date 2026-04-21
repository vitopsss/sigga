-- =============================================
-- SQL Corretivo — SIGGA v5 ATER
-- Cria tabelas e colunas faltantes para alinhar
-- o banco real ao schema target sem tocar no legado.
-- Usa TEXT para todas as chaves para casar com o banco real.
-- =============================================

BEGIN;

-- =============================================
-- pessoas (era cadastros_unicos no legado)
-- =============================================
CREATE TABLE IF NOT EXISTS "pessoas" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tipo" TEXT NOT NULL DEFAULT 'PF',
  "documento" TEXT NOT NULL UNIQUE,
  "nome" TEXT NOT NULL,
  "email" TEXT,
  "telefone" TEXT,
  "endereco" TEXT,
  "bairro" TEXT,
  "cidade" TEXT,
  "estado" TEXT,
  "cep" TEXT,
  "pais" TEXT,
  "banco" TEXT,
  "agencia" TEXT,
  "conta" TEXT,
  "pix" TEXT,
  "origemCadastro" TEXT NOT NULL DEFAULT 'INTERNO',
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "pessoas_documento_idx" ON "pessoas"("documento");

-- =============================================
-- Planos gerenciais
-- =============================================
CREATE TABLE IF NOT EXISTS "planos_gerenciais" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "idPgcOrc" TEXT NOT NULL UNIQUE,
  "planoGerencial" TEXT NOT NULL,
  "descricao" TEXT,
  "obrigatoriedade" TEXT
);

CREATE INDEX IF NOT EXISTS "planos_gerenciais_idPgcOrc_idx" ON "planos_gerenciais"("idPgcOrc");

-- =============================================
-- Planos contabeis
-- =============================================
CREATE TABLE IF NOT EXISTS "planos_contabeis" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "idPgc" TEXT NOT NULL UNIQUE,
  "tipo" TEXT,
  "planoConta" TEXT NOT NULL,
  "descricao" TEXT,
  "vinculacao" TEXT,
  "obrigatoriedade" TEXT
);

CREATE INDEX IF NOT EXISTS "planos_contabeis_idPgc_idx" ON "planos_contabeis"("idPgc");

-- =============================================
-- Perfis operacionais
-- =============================================
CREATE TABLE IF NOT EXISTS "perfis_operacionais" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "nome" TEXT NOT NULL,
  "perfil" TEXT NOT NULL,
  "situacao" TEXT
);

-- =============================================
-- Contas bancarias
-- =============================================
CREATE TABLE IF NOT EXISTS "contas_bancarias" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "descricao" TEXT NOT NULL,
  "idBanco" TEXT,
  "agencia" TEXT,
  "conta" TEXT,
  "situacao" TEXT,
  "nomeclatura" TEXT
);

-- =============================================
-- Planos de trabalho
-- =============================================
CREATE TABLE IF NOT EXISTS "planos_trabalho" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "idPT" TEXT NOT NULL UNIQUE,
  "tipoInstrumento" TEXT,
  "identificacao" TEXT,
  "vigenciaInicial" TIMESTAMPTZ NOT NULL,
  "vigenciaFinal" TIMESTAMPTZ,
  "descricao" TEXT,
  "exige" TEXT,
  "status" TEXT,
  "projetoId" TEXT NOT NULL,
  "coordenadorId" TEXT
);

CREATE INDEX IF NOT EXISTS "planos_trabalho_idPT_idx" ON "planos_trabalho"("idPT");

-- =============================================
-- Atividades
-- =============================================
CREATE TABLE IF NOT EXISTS "atividades" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "idAtv" TEXT NOT NULL UNIQUE,
  "faseMeta" TEXT,
  "etapa" TEXT,
  "atividade" TEXT NOT NULL,
  "dataInicio" TIMESTAMPTZ,
  "dataFim" TIMESTAMPTZ,
  "status" TEXT,
  "buscaAtividade" TEXT,
  "planoTrabalhoId" TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS "atividades_idAtv_idx" ON "atividades"("idAtv");

-- =============================================
-- Faturamentos
-- =============================================
CREATE TABLE IF NOT EXISTS "faturamentos" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "dataSolicitacao" TIMESTAMPTZ,
  "tipoInstrumento" TEXT,
  "parcela" INT,
  "descricao" TEXT,
  "quantidade" INT,
  "valorReferencia" NUMERIC(15,2) NOT NULL,
  "vencimento" TIMESTAMPTZ,
  "valorTotal" NUMERIC(15,2) NOT NULL,
  "dataFaturamento" TIMESTAMPTZ,
  "valorFaturado" NUMERIC(15,2),
  "numControleFatura" TEXT,
  "dataLiquidacao" TIMESTAMPTZ,
  "observacoes" TEXT,
  "planoTrabalhoId" TEXT NOT NULL
);

-- =============================================
-- Lancamentos (era lancamentos_financeiros no legado)
-- =============================================
CREATE TABLE IF NOT EXISTS "lancamentos" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "nsu" TEXT NOT NULL UNIQUE,
  "fase" TEXT,
  "etapa" TEXT,
  "valor" NUMERIC(15,2) NOT NULL,
  "dataVencimento" TIMESTAMPTZ NOT NULL,
  "orcamentoItemId" TEXT,
  "planoContabilId" TEXT,
  "atividadeId" TEXT,
  "cpfCnpjFavorecido" TEXT,
  "nomeFavorecido" TEXT,
  "banco" TEXT,
  "agencia" TEXT,
  "conta" TEXT,
  "pix" TEXT,
  "tipoDocumento" TEXT,
  "numDoc" TEXT,
  "historico" TEXT,
  "autorizacao" TEXT,
  "responsavel" TEXT,
  "docCompleta" TEXT,
  "balancete" TEXT,
  "obsDiaf" TEXT,
  "obsArquivamento" TEXT,
  "formaPagamento" TEXT,
  "dataPagamento" TIMESTAMPTZ,
  "bancoPagamento" TEXT,
  "conciliado" BOOLEAN NOT NULL DEFAULT false,
  "contaPagamentoId" TEXT,
  "borderoId" TEXT NOT NULL,
  "favorecidoId" TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS "lancamentos_nsu_idx" ON "lancamentos"("nsu");

-- =============================================
-- Processos de compra
-- =============================================
CREATE TABLE IF NOT EXISTS "processos_compras" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "idProcesso" TEXT NOT NULL UNIQUE,
  "tipoDocumento" TEXT,
  "numero" TEXT,
  "dataAbertura" TIMESTAMPTZ,
  "objeto" TEXT,
  "modalidade" TEXT,
  "tipo" TEXT,
  "dataPrevisaoConclusao" TIMESTAMPTZ,
  "documentoFinal" TEXT,
  "status" TEXT,
  "projetoId" TEXT,
  "responsavelId" TEXT,
  "solicitanteId" TEXT
);

CREATE INDEX IF NOT EXISTS "processos_compras_idProcesso_idx" ON "processos_compras"("idProcesso");

-- =============================================
-- Contratos (era contratos_fornecedores no legado)
-- =============================================
CREATE TABLE IF NOT EXISTS "contratos" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "idContrato" TEXT NOT NULL UNIQUE,
  "tipo" TEXT,
  "objeto" TEXT,
  "vigenciaInicial" TIMESTAMPTZ,
  "vigenciaFinal" TIMESTAMPTZ,
  "valorTotal" NUMERIC(15,2) NOT NULL,
  "status" TEXT,
  "obs" TEXT,
  "projetoId" TEXT,
  "fornecedorId" TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS "contratos_idContrato_idx" ON "contratos"("idContrato");

-- =============================================
-- Itens de contrato
-- =============================================
CREATE TABLE IF NOT EXISTS "itens_contratos" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "idProd" TEXT,
  "descricao" TEXT,
  "prazo" TEXT,
  "unidade" TEXT,
  "valorRef" NUMERIC(15,2),
  "quantidade" INT,
  "valorDesembolso" NUMERIC(15,2),
  "dataEntrega" TIMESTAMPTZ,
  "statusProduto" TEXT,
  "statusPgto" TEXT,
  "observacao" TEXT,
  "contratoId" TEXT NOT NULL
);

-- =============================================
-- Novas colunas em borderos
-- =============================================
ALTER TABLE "borderos" ADD COLUMN IF NOT EXISTS "tipoDocumento" TEXT;
ALTER TABLE "borderos" ADD COLUMN IF NOT EXISTS "numero" TEXT;

-- =============================================
-- Nova coluna em orcamentos_itens
-- =============================================
ALTER TABLE "orcamentos_itens" ADD COLUMN IF NOT EXISTS "planoGerencialId" TEXT;

-- =============================================
-- Nova coluna em users
-- =============================================
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "perfilId" TEXT;

COMMIT;
