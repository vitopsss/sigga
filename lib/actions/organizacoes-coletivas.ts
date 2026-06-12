"use server";

import { revalidatePath } from "next/cache";

import { getAterErrorMessage } from "@/lib/ater-runtime";
import { AterSociobioService } from "@/lib/services/ater-sociobio.service";

function getText(value: FormDataEntryValue | null) {
  return String(value ?? "").trim();
}

function getOptionalNumber(formData: FormData, key: string) {
  const value = getText(formData.get(key));
  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function getOptionalDate(formData: FormData, key: string) {
  const value = getText(formData.get(key));
  return value ? new Date(`${value}T00:00:00`) : null;
}

function getOptionalBoolean(formData: FormData, key: string) {
  const value = getText(formData.get(key));
  if (value === "true") return true;
  if (value === "false") return false;
  return null;
}

const indicadorOrganizacaoKeys = [
  "numeroContrato",
  "agenteAterNome1",
  "agenteAterCpf1",
  "agenteAterNome2",
  "agenteAterCpf2",
  "agenteAterNome3",
  "agenteAterCpf3",
  "agenteAterNome4",
  "agenteAterCpf4",
  "localEstado",
  "localMunicipio",
  "localOrganizacaoColetiva",
  "dataReferencia",
  "possuiPraticasAmbientais",
  "praticaSeparacaoLixo",
  "praticaDescarteCorretoLixo",
  "praticaManutencaoAcessos",
  "praticaTratamentoDejetos",
  "praticaCaptacaoAguaChuva",
  "praticaEducacaoAmbiental",
  "praticaAvaliacaoPrevencaoRiscos",
  "usaIdentidadeComercial",
  "identidadeMarcaPropria",
  "identidadeSeloArte",
  "identidadeSenaf",
  "identidadeSenafSociobiodiversidade",
  "identidadeSeloQuilombos",
  "identidadeSeloIndigenas",
  "identidadeSeloPovosTradicionais",
  "possuiMulheresDiretoriaConselho",
  "possuiJovensDiretoriaConselho",
  "filiadaOrganizacao",
  "filiadaUnicafes",
  "filiadaUnicopas",
  "filiadaSistemaOcb",
  "acessaPoliticasPublicas",
  "possuiCafJuridica",
  "acessouPronafCusteio",
  "acessouPronafCapitalGiro",
  "acessouPronafMaisAlimentos",
  "acessouPronafIndustrializacao",
  "acessouPronafAgroindustria",
  "acessouPronafCotasPartes",
  "acessouPaa",
  "acessouPnae",
  "acessouPgpm",
  "acessouPgpmSociobiodiversidade",
  "acessouCooperaMaisBrasil",
  "canalTrocaProdutoServico",
  "canalVendaOrganizacao",
  "canalVendaDiretaConsumidor",
  "canalFeira",
  "canalMercadoLocal",
  "canalAtravessador",
  "canalPaa",
  "canalPnae",
  "canalMercadoJustoSolidario",
  "praticasAmbientaisQuais",
  "identidadeComercialQuais",
  "representacaoPoliticaQuais",
  "politicasPublicasQuais",
  "observacoesIndicadoresOrganizacao",
];

function readOrganizacaoColetivaPayload(formData: FormData) {
  const atividadesDescricao = formData.getAll("atividadeDescricao").map((value) => String(value ?? "").trim());
  const atividadesUnidade = formData.getAll("atividadeUnidade").map((value) => String(value ?? "").trim());
  const atividades = atividadesDescricao
    .map((descricao, index) => ({
      descricao,
      unidade: atividadesUnidade[index] ?? "",
    }))
    .filter((item) => item.descricao || item.unidade);

  return {
    denominacao: getText(formData.get("denominacao")),
    cnpj: getText(formData.get("cnpj")) || null,
    uf: getText(formData.get("uf")) || null,
    municipio: getText(formData.get("municipio")) || null,
    dataCadastro: getOptionalDate(formData, "dataCadastro"),
    entidadeExecutoraNome: getText(formData.get("entidadeExecutoraNome")) || null,
    entidadeExecutoraCnpj: getText(formData.get("entidadeExecutoraCnpj")) || null,
    unidadeServicos: getText(formData.get("unidadeServicos")) || null,
    numeroInstrumento: getText(formData.get("numeroInstrumento")) || null,
    agenteAterNome1: getText(formData.get("agenteAterNome1")) || null,
    agenteAterCpf1: getText(formData.get("agenteAterCpf1")) || null,
    agenteAterNome2: getText(formData.get("agenteAterNome2")) || null,
    agenteAterCpf2: getText(formData.get("agenteAterCpf2")) || null,
    agenteAterNome3: getText(formData.get("agenteAterNome3")) || null,
    agenteAterCpf3: getText(formData.get("agenteAterCpf3")) || null,
    agenteAterNome4: getText(formData.get("agenteAterNome4")) || null,
    agenteAterCpf4: getText(formData.get("agenteAterCpf4")) || null,
    numeroFamilias: getOptionalNumber(formData, "numeroFamilias"),
    atividades: atividades.length ? atividades : undefined,
    grupoInteresse: getText(formData.get("grupoInteresse")) || null,
    observacoes: getText(formData.get("observacoes")) || null,
  };
}

function hasIndicadoresOrganizacaoPayload(formData: FormData) {
  return indicadorOrganizacaoKeys.some((key) => getText(formData.get(key)) !== "");
}

function readIndicadoresOrganizacaoColetivaPayload(formData: FormData) {
  return {
    entidadeExecutoraNome: getText(formData.get("indicadorEntidadeExecutoraNome")) || getText(formData.get("entidadeExecutoraNome")) || null,
    entidadeExecutoraCnpj: getText(formData.get("indicadorEntidadeExecutoraCnpj")) || getText(formData.get("entidadeExecutoraCnpj")) || null,
    unidadeServicos: getText(formData.get("indicadorUnidadeServicos")) || getText(formData.get("unidadeServicos")) || null,
    numeroContrato: getText(formData.get("numeroContrato")) || getText(formData.get("numeroInstrumento")) || null,
    agenteAterNome1: getText(formData.get("indicadorAgenteAterNome1")) || getText(formData.get("agenteAterNome1")) || null,
    agenteAterCpf1: getText(formData.get("indicadorAgenteAterCpf1")) || getText(formData.get("agenteAterCpf1")) || null,
    agenteAterNome2: getText(formData.get("indicadorAgenteAterNome2")) || getText(formData.get("agenteAterNome2")) || null,
    agenteAterCpf2: getText(formData.get("indicadorAgenteAterCpf2")) || getText(formData.get("agenteAterCpf2")) || null,
    agenteAterNome3: getText(formData.get("indicadorAgenteAterNome3")) || getText(formData.get("agenteAterNome3")) || null,
    agenteAterCpf3: getText(formData.get("indicadorAgenteAterCpf3")) || getText(formData.get("agenteAterCpf3")) || null,
    agenteAterNome4: getText(formData.get("indicadorAgenteAterNome4")) || getText(formData.get("agenteAterNome4")) || null,
    agenteAterCpf4: getText(formData.get("indicadorAgenteAterCpf4")) || getText(formData.get("agenteAterCpf4")) || null,
    localEstado: getText(formData.get("localEstado")) || getText(formData.get("uf")) || null,
    localMunicipio: getText(formData.get("localMunicipio")) || getText(formData.get("municipio")) || null,
    localOrganizacaoColetiva: getText(formData.get("localOrganizacaoColetiva")) || getText(formData.get("denominacao")) || null,
    dataReferencia: getOptionalDate(formData, "dataReferencia") || getOptionalDate(formData, "dataCadastro"),
    possuiPraticasAmbientais: getOptionalBoolean(formData, "possuiPraticasAmbientais"),
    praticaSeparacaoLixo: getOptionalBoolean(formData, "praticaSeparacaoLixo"),
    praticaDescarteCorretoLixo: getOptionalBoolean(formData, "praticaDescarteCorretoLixo"),
    praticaManutencaoAcessos: getOptionalBoolean(formData, "praticaManutencaoAcessos"),
    praticaTratamentoDejetos: getOptionalBoolean(formData, "praticaTratamentoDejetos"),
    praticaCaptacaoAguaChuva: getOptionalBoolean(formData, "praticaCaptacaoAguaChuva"),
    praticaEducacaoAmbiental: getOptionalBoolean(formData, "praticaEducacaoAmbiental"),
    praticaAvaliacaoPrevencaoRiscos: getOptionalBoolean(formData, "praticaAvaliacaoPrevencaoRiscos"),
    usaIdentidadeComercial: getOptionalBoolean(formData, "usaIdentidadeComercial"),
    identidadeMarcaPropria: getOptionalBoolean(formData, "identidadeMarcaPropria"),
    identidadeSeloArte: getOptionalBoolean(formData, "identidadeSeloArte"),
    identidadeSenaf: getOptionalBoolean(formData, "identidadeSenaf"),
    identidadeSenafSociobiodiversidade: getOptionalBoolean(formData, "identidadeSenafSociobiodiversidade"),
    identidadeSeloQuilombos: getOptionalBoolean(formData, "identidadeSeloQuilombos"),
    identidadeSeloIndigenas: getOptionalBoolean(formData, "identidadeSeloIndigenas"),
    identidadeSeloPovosTradicionais: getOptionalBoolean(formData, "identidadeSeloPovosTradicionais"),
    possuiMulheresDiretoriaConselho: getOptionalBoolean(formData, "possuiMulheresDiretoriaConselho"),
    possuiJovensDiretoriaConselho: getOptionalBoolean(formData, "possuiJovensDiretoriaConselho"),
    filiadaOrganizacao: getOptionalBoolean(formData, "filiadaOrganizacao"),
    filiadaUnicafes: getOptionalBoolean(formData, "filiadaUnicafes"),
    filiadaUnicopas: getOptionalBoolean(formData, "filiadaUnicopas"),
    filiadaSistemaOcb: getOptionalBoolean(formData, "filiadaSistemaOcb"),
    acessaPoliticasPublicas: getOptionalBoolean(formData, "acessaPoliticasPublicas"),
    possuiCafJuridica: getOptionalBoolean(formData, "possuiCafJuridica"),
    acessouPronafCusteio: getOptionalBoolean(formData, "acessouPronafCusteio"),
    acessouPronafCapitalGiro: getOptionalBoolean(formData, "acessouPronafCapitalGiro"),
    acessouPronafMaisAlimentos: getOptionalBoolean(formData, "acessouPronafMaisAlimentos"),
    acessouPronafIndustrializacao: getOptionalBoolean(formData, "acessouPronafIndustrializacao"),
    acessouPronafAgroindustria: getOptionalBoolean(formData, "acessouPronafAgroindustria"),
    acessouPronafCotasPartes: getOptionalBoolean(formData, "acessouPronafCotasPartes"),
    acessouPaa: getOptionalBoolean(formData, "acessouPaa"),
    acessouPnae: getOptionalBoolean(formData, "acessouPnae"),
    acessouPgpm: getOptionalBoolean(formData, "acessouPgpm"),
    acessouPgpmSociobiodiversidade: getOptionalBoolean(formData, "acessouPgpmSociobiodiversidade"),
    acessouCooperaMaisBrasil: getOptionalBoolean(formData, "acessouCooperaMaisBrasil"),
    canalTrocaProdutoServico: getOptionalBoolean(formData, "canalTrocaProdutoServico"),
    canalVendaOrganizacao: getOptionalBoolean(formData, "canalVendaOrganizacao"),
    canalVendaDiretaConsumidor: getOptionalBoolean(formData, "canalVendaDiretaConsumidor"),
    canalFeira: getOptionalBoolean(formData, "canalFeira"),
    canalMercadoLocal: getOptionalBoolean(formData, "canalMercadoLocal"),
    canalAtravessador: getOptionalBoolean(formData, "canalAtravessador"),
    canalPaa: getOptionalBoolean(formData, "canalPaa"),
    canalPnae: getOptionalBoolean(formData, "canalPnae"),
    canalMercadoJustoSolidario: getOptionalBoolean(formData, "canalMercadoJustoSolidario"),
    praticasAmbientaisQuais: getText(formData.get("praticasAmbientaisQuais")) || null,
    identidadeComercialQuais: getText(formData.get("identidadeComercialQuais")) || null,
    representacaoPoliticaQuais: getText(formData.get("representacaoPoliticaQuais")) || null,
    politicasPublicasQuais: getText(formData.get("politicasPublicasQuais")) || null,
    observacoes: getText(formData.get("observacoesIndicadoresOrganizacao")) || null,
  };
}

function revalidateOrganizacoes(id?: string) {
  revalidatePath("/ater-sociobio");
  revalidatePath("/ater-sociobio/organizacoes");
  revalidatePath("/ater-sociobio/familias");
  if (id) {
    revalidatePath(`/ater-sociobio/organizacoes/${id}`);
    revalidatePath(`/ater-sociobio/organizacoes/${id}/editar`);
    revalidatePath(`/ater-sociobio/organizacoes/${id}/indicadores`);
  }
}

export async function criarOrganizacaoColetiva(formData: FormData) {
  const payload = readOrganizacaoColetivaPayload(formData);

  if (!payload.denominacao) {
    return { data: null, error: "Denominação da organização coletiva é obrigatória." };
  }

  try {
    const created = await AterSociobioService.createOrganizacaoColetiva(payload);
    if (hasIndicadoresOrganizacaoPayload(formData)) {
      await AterSociobioService.upsertIndicadoresOrganizacaoColetiva(
        created.id,
        readIndicadoresOrganizacaoColetivaPayload(formData),
      );
    }
    revalidateOrganizacoes(created.id);
    return { data: created, error: null };
  } catch (error) {
    return { data: null, error: getAterErrorMessage(error, "Não foi possível criar a organização coletiva.") };
  }
}

export async function atualizarOrganizacaoColetiva(id: string, formData: FormData) {
  const payload = readOrganizacaoColetivaPayload(formData);

  if (!payload.denominacao) {
    return { data: null, error: "Denominação da organização coletiva é obrigatória." };
  }

  try {
    const updated = await AterSociobioService.updateOrganizacaoColetiva(id, payload);
    if (hasIndicadoresOrganizacaoPayload(formData)) {
      await AterSociobioService.upsertIndicadoresOrganizacaoColetiva(
        id,
        readIndicadoresOrganizacaoColetivaPayload(formData),
      );
    }
    revalidateOrganizacoes(id);
    return { data: updated, error: null };
  } catch (error) {
    return { data: null, error: getAterErrorMessage(error, "Não foi possível atualizar a organização coletiva.") };
  }
}

export async function salvarIndicadoresOrganizacaoColetiva(id: string, formData: FormData) {
  try {
    const saved = await AterSociobioService.upsertIndicadoresOrganizacaoColetiva(
      id,
      readIndicadoresOrganizacaoColetivaPayload(formData),
    );
    revalidateOrganizacoes(id);

    return { data: saved, error: null };
  } catch (error) {
    return { data: null, error: getAterErrorMessage(error, "Não foi possível salvar os indicadores da organização coletiva.") };
  }
}
