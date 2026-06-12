"use server";

import { revalidatePath } from "next/cache";

import { getAterErrorMessage } from "@/lib/ater-runtime";
import { PRONAF_LINHAS_UFPA } from "@/lib/constants/ater-sociobio-official";
import { AterSociobioService } from "@/lib/services/ater-sociobio.service";

function getText(value: FormDataEntryValue | null) {
  return String(value ?? "").trim();
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

function getOptionalNumber(formData: FormData, key: string) {
  const value = getText(formData.get(key));
  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function getOptionalInt(formData: FormData, key: string) {
  const value = getOptionalNumber(formData, key);
  return value === null ? null : Math.trunc(value);
}

function readRows(formData: FormData, prefix: string, fields: string[], max = 8) {
  const rows: Record<string, string | null>[] = [];

  for (let index = 0; index < max; index++) {
    const row: Record<string, string | null> = {};
    let hasData = false;

    fields.forEach((field) => {
      const value = getText(formData.get(`${prefix}_${index}_${field}`));
      row[field] = value || null;
      if (value) hasData = true;
    });

    if (hasData) rows.push(row);
  }

  return rows.length ? rows : undefined;
}

function readLinhasPronaf(formData: FormData) {
  const linhas = PRONAF_LINHAS_UFPA.map((item) => ({
    linha: item.label,
    acessou: getOptionalBoolean(formData, item.field),
  })).filter((item) => item.acessou !== null);

  return linhas.length ? linhas : undefined;
}

export async function salvarDiagnosticoUfpa(familiaId: string, formData: FormData) {
  try {
    const diagnostico = {
      entidadeExecutoraNome: getText(formData.get("entidadeExecutoraNome")) || null,
      entidadeExecutoraCnpj: getText(formData.get("entidadeExecutoraCnpj")) || null,
      unidadeServicos: getText(formData.get("unidadeServicos")) || null,
      numeroInstrumento: getText(formData.get("numeroInstrumento")) || null,
      dataDiagnostico: getOptionalDate(formData, "dataDiagnostico"),
      agenteAterNome1: getText(formData.get("diagnosticoAgenteAterNome1")) || null,
      agenteAterCpf1: getText(formData.get("diagnosticoAgenteAterCpf1")) || null,
      agenteAterNome2: getText(formData.get("diagnosticoAgenteAterNome2")) || null,
      agenteAterCpf2: getText(formData.get("diagnosticoAgenteAterCpf2")) || null,
      agenteAterNome3: getText(formData.get("diagnosticoAgenteAterNome3")) || null,
      agenteAterCpf3: getText(formData.get("diagnosticoAgenteAterCpf3")) || null,
      localUf: getText(formData.get("localUf")) || null,
      localMunicipio: getText(formData.get("localMunicipio")) || null,
      localOrganizacaoColetiva: getText(formData.get("localOrganizacaoColetiva")) || null,
      possuiRadio: getOptionalBoolean(formData, "possuiRadio"),
      possuiTelevisao: getOptionalBoolean(formData, "possuiTelevisao"),
      possuiCelular: getOptionalBoolean(formData, "possuiCelular"),
      possuiInternet: getOptionalBoolean(formData, "possuiInternet"),
      usaRedesSociais: getOptionalBoolean(formData, "usaRedesSociais"),
      possuiOutroMeioComunicacao: getOptionalBoolean(formData, "possuiOutroMeioComunicacao"),
      outroMeioComunicacao: getText(formData.get("outroMeioComunicacao")) || null,
      aguaParaConsumo: getOptionalBoolean(formData, "aguaParaConsumo"),
      aguaConsumoTratada: getOptionalBoolean(formData, "aguaConsumoTratada"),
      aguaParaProducao: getOptionalBoolean(formData, "aguaParaProducao"),
      captacaoAguaChuva: getOptionalBoolean(formData, "captacaoAguaChuva"),
      esgotoTratado: getOptionalBoolean(formData, "esgotoTratado"),
      fontesProtegidas: getOptionalBoolean(formData, "fontesProtegidas"),
      qtdMaquinasAgricolas: getOptionalInt(formData, "qtdMaquinasAgricolas"),
      qtdImplementosAgricolas: getOptionalInt(formData, "qtdImplementosAgricolas"),
      qtdVeiculosPasseio: getOptionalInt(formData, "qtdVeiculosPasseio"),
      qtdConstrucoesRurais: getOptionalInt(formData, "qtdConstrucoesRurais"),
      qtdMotoresEletricos: getOptionalInt(formData, "qtdMotoresEletricos"),
      qtdConjuntosIrrigacao: getOptionalInt(formData, "qtdConjuntosIrrigacao"),
      qtdAnimaisTrabalho: getOptionalInt(formData, "qtdAnimaisTrabalho"),
      qtdMaquinarioTracaoAnimal: getOptionalInt(formData, "qtdMaquinarioTracaoAnimal"),
      qtdBovinos: getOptionalInt(formData, "qtdBovinos"),
      qtdOvinos: getOptionalInt(formData, "qtdOvinos"),
      qtdCaprinos: getOptionalInt(formData, "qtdCaprinos"),
      qtdSuinos: getOptionalInt(formData, "qtdSuinos"),
      qtdAves: getOptionalInt(formData, "qtdAves"),
      qtdBubalinos: getOptionalInt(formData, "qtdBubalinos"),
      qtdEquinosMuaresAsininos: getOptionalInt(formData, "qtdEquinosMuaresAsininos"),
      qtdColmeias: getOptionalInt(formData, "qtdColmeias"),
      qtdPequenosAnimaisOutros: getOptionalInt(formData, "qtdPequenosAnimaisOutros"),
      areaPastagens: getOptionalNumber(formData, "areaPastagens"),
      areaCulturasTemporarias: getOptionalNumber(formData, "areaCulturasTemporarias"),
      areaCulturasPermanentes: getOptionalNumber(formData, "areaCulturasPermanentes"),
      areaLaminaAgua: getOptionalNumber(formData, "areaLaminaAgua"),
      areaExtrativismo: getOptionalNumber(formData, "areaExtrativismo"),
      areaReservaLegal: getOptionalNumber(formData, "areaReservaLegal"),
      areaOutrosUsos: getOptionalNumber(formData, "areaOutrosUsos"),
      recursosDisponiveis: readRows(formData, "recurso", ["recursosDisponiveis", "tipo"]),
      atividadesColetivas: readRows(formData, "atividadeColetiva", ["atividadeColetiva", "area"]),
      politicasPublicas: readRows(formData, "politica", ["integrante", "politicaPublicaFederal", "ultimoAnoAdesao"]),
      acoesPotenciaisProdutivo: formData.getAll("acoesPotenciaisProdutivo").map(String).filter(Boolean),
      acoesPotenciaisSocial: formData.getAll("acoesPotenciaisSocial").map(String).filter(Boolean),
      acoesPotenciaisAmbiental: formData.getAll("acoesPotenciaisAmbiental").map(String).filter(Boolean),
      limitacoesProdutivo: formData.getAll("limitacoesProdutivo").map(String).filter(Boolean),
      limitacoesSocial: formData.getAll("limitacoesSocial").map(String).filter(Boolean),
      limitacoesAmbiental: formData.getAll("limitacoesAmbiental").map(String).filter(Boolean),
      lgpdConsentimento: getOptionalBoolean(formData, "lgpdConsentimento"),
      lgpdDataConsentimento: getOptionalDate(formData, "lgpdDataConsentimento"),
      referenciaAnexoLgpd: getText(formData.get("referenciaAnexoLgpd")) || null,
      representanteNome: getText(formData.get("representanteNome")) || null,
      representanteCpf: getText(formData.get("representanteCpf")) || null,
      observacoes: getText(formData.get("observacoesDiagnostico")) || null,
    };

    const indicadores = {
      entidadeExecutoraNome: getText(formData.get("indicadorEntidadeExecutoraNome")) || null,
      entidadeExecutoraCnpj: getText(formData.get("indicadorEntidadeExecutoraCnpj")) || null,
      unidadeServicos: getText(formData.get("indicadorUnidadeServicos")) || null,
      numeroInstrumento: getText(formData.get("indicadorNumeroInstrumento")) || null,
      agenteAterNome1: getText(formData.get("indicadorAgenteAterNome1")) || null,
      agenteAterCpf1: getText(formData.get("indicadorAgenteAterCpf1")) || null,
      agenteAterNome2: getText(formData.get("indicadorAgenteAterNome2")) || null,
      agenteAterCpf2: getText(formData.get("indicadorAgenteAterCpf2")) || null,
      agenteAterNome3: getText(formData.get("indicadorAgenteAterNome3")) || null,
      agenteAterCpf3: getText(formData.get("indicadorAgenteAterCpf3")) || null,
      localUf: getText(formData.get("indicadorLocalUf")) || null,
      localMunicipio: getText(formData.get("indicadorLocalMunicipio")) || null,
      localOrganizacaoColetiva: getText(formData.get("indicadorLocalOrganizacaoColetiva")) || null,
      dataReferencia: getOptionalDate(formData, "dataReferencia"),
      alimentacaoVariadaComprometida: getOptionalBoolean(formData, "alimentacaoVariadaComprometida"),
      comidaAcabouSemCondicao: getOptionalBoolean(formData, "comidaAcabouSemCondicao"),
      deixouRefeicaoSemCondicao: getOptionalBoolean(formData, "deixouRefeicaoSemCondicao"),
      comeuMenosSemCondicao: getOptionalBoolean(formData, "comeuMenosSemCondicao"),
      qtdVezesComeuMenos: getOptionalInt(formData, "qtdVezesComeuMenos"),
      sentiuFomeENaoComeu: getOptionalBoolean(formData, "sentiuFomeENaoComeu"),
      documentacaoPessoalCompleta: getOptionalBoolean(formData, "documentacaoPessoalCompleta"),
      documentacaoPessoalQuais: getText(formData.get("documentacaoPessoalQuais")) || null,
      cadastradoCadUnico: getOptionalBoolean(formData, "cadastradoCadUnico"),
      cadUnicoQuais: getText(formData.get("cadUnicoQuais")) || null,
      acessaPoliticasSociais: getOptionalBoolean(formData, "acessaPoliticasSociais"),
      politicasSociaisQuais: getText(formData.get("politicasSociaisQuais")) || null,
      participaGrupoComunitario: getOptionalBoolean(formData, "participaGrupoComunitario"),
      qualGrupoComunitario: getText(formData.get("qualGrupoComunitario")) || null,
      participaAssociacao: getOptionalBoolean(formData, "participaAssociacao"),
      participaCooperativa: getOptionalBoolean(formData, "participaCooperativa"),
      participaGrupoInformalProdutivo: getOptionalBoolean(formData, "participaGrupoInformalProdutivo"),
      participaGrupoInformalSocial: getOptionalBoolean(formData, "participaGrupoInformalSocial"),
      possuiPraticasSustentaveis: getOptionalBoolean(formData, "possuiPraticasSustentaveis"),
      praticasSustentaveisQuais: getText(formData.get("praticasSustentaveisQuais")) || null,
      praticaIntegracaoAtividades: getOptionalBoolean(formData, "praticaIntegracaoAtividades"),
      praticaDescarteCorretoEmbalagens: getOptionalBoolean(formData, "praticaDescarteCorretoEmbalagens"),
      praticaControleQueimadas: getOptionalBoolean(formData, "praticaControleQueimadas"),
      praticaAdubacaoVerde: getOptionalBoolean(formData, "praticaAdubacaoVerde"),
      praticaRecuperacaoPastagens: getOptionalBoolean(formData, "praticaRecuperacaoPastagens"),
      praticaCoberturaSolo: getOptionalBoolean(formData, "praticaCoberturaSolo"),
      praticaManejoIntegradoPragas: getOptionalBoolean(formData, "praticaManejoIntegradoPragas"),
      praticaCordoesVegetacao: getOptionalBoolean(formData, "praticaCordoesVegetacao"),
      praticaRotacaoCulturas: getOptionalBoolean(formData, "praticaRotacaoCulturas"),
      praticaPlantioDireto: getOptionalBoolean(formData, "praticaPlantioDireto"),
      praticaPousio: getOptionalBoolean(formData, "praticaPousio"),
      praticaProtecaoNascentes: getOptionalBoolean(formData, "praticaProtecaoNascentes"),
      praticaPreservacaoApps: getOptionalBoolean(formData, "praticaPreservacaoApps"),
      praticaManejoFlorestal: getOptionalBoolean(formData, "praticaManejoFlorestal"),
      praticaRecomposicaoFlorestal: getOptionalBoolean(formData, "praticaRecomposicaoFlorestal"),
      motivoSemPraticaFinanceiro: getOptionalBoolean(formData, "motivoSemPraticaFinanceiro"),
      motivoSemPraticaFaltaInformacao: getOptionalBoolean(formData, "motivoSemPraticaFaltaInformacao"),
      motivoSemPraticaTecnologico: getOptionalBoolean(formData, "motivoSemPraticaTecnologico"),
      motivoSemPraticaFaltaInteresse: getOptionalBoolean(formData, "motivoSemPraticaFaltaInteresse"),
      valorBrutoProducaoUltimos12Meses: getOptionalNumber(formData, "valorBrutoProducaoUltimos12Meses"),
      acessaPoliticasProdutivas: getOptionalBoolean(formData, "acessaPoliticasProdutivas"),
      motivoNaoAcessaPoliticasFaltaInfo: getOptionalBoolean(formData, "motivoNaoAcessaPoliticasFaltaInfo"),
      motivoNaoAcessaPoliticasDificilAcesso: getOptionalBoolean(formData, "motivoNaoAcessaPoliticasDificilAcesso"),
      motivoNaoAcessaPoliticasSemInteresse: getOptionalBoolean(formData, "motivoNaoAcessaPoliticasSemInteresse"),
      acessouPaa: getOptionalBoolean(formData, "acessouPaa"),
      acessouPnae: getOptionalBoolean(formData, "acessouPnae"),
      acessouPgpmBio: getOptionalBoolean(formData, "acessouPgpmBio"),
      acessouPronaf: getOptionalBoolean(formData, "acessouPronaf"),
      linhasPronaf: readLinhasPronaf(formData),
      canalTrocaProdutoServico: getOptionalBoolean(formData, "canalTrocaProdutoServico"),
      canalVendaPropriedade: getOptionalBoolean(formData, "canalVendaPropriedade"),
      canalVendaDiretaConsumidor: getOptionalBoolean(formData, "canalVendaDiretaConsumidor"),
      canalFeira: getOptionalBoolean(formData, "canalFeira"),
      canalMercadoLocal: getOptionalBoolean(formData, "canalMercadoLocal"),
      canalAtravessador: getOptionalBoolean(formData, "canalAtravessador"),
      canalPaa: getOptionalBoolean(formData, "canalPaa"),
      canalPnae: getOptionalBoolean(formData, "canalPnae"),
      canalCooperativaEntreposto: getOptionalBoolean(formData, "canalCooperativaEntreposto"),
      observacoes: getText(formData.get("observacoesIndicadores")) || null,
    };

    const saved = await AterSociobioService.upsertDiagnosticoUfpa(familiaId, { diagnostico, indicadores });

    revalidatePath("/ater-sociobio/familias");
    revalidatePath(`/ater-sociobio/familias/${familiaId}`);
    revalidatePath(`/ater-sociobio/familias/${familiaId}/diagnostico`);
    revalidatePath("/ater-sociobio");

    return { data: saved, error: null };
  } catch (error) {
    return { data: null, error: getAterErrorMessage(error, "Não foi possível salvar o diagnóstico da UFPA.") };
  }
}
