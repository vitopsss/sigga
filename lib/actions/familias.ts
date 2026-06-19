"use server";

import { revalidatePath } from "next/cache";
import { getAterErrorMessage } from "@/lib/ater-runtime";
import { salvarDiagnosticoUfpa } from "@/lib/actions/diagnosticos";
import { AterSociobioService, FamiliaFilterDTO } from "@/lib/services/ater-sociobio.service";

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

function getBoolean(formData: FormData, key: string) {
  return formData.get(key) === "true" || formData.get(key) === "on";
}

function parseJsonSafe(formData: FormData, key: string) {
  const value = getText(formData.get(key));
  if (!value) return undefined;
  try {
    return JSON.parse(value);
  } catch (e) {
    return undefined;
  }
}

function parseStringArray(formData: FormData, key: string) {
  const values = formData.getAll(key).map(v => getText(v)).filter(Boolean);
  const first = values[0];
  if (values.length === 0) return undefined;
  if (values.length === 1 && first && first.includes(",")) {
    return first.split(",").map(s => s.trim()).filter(Boolean);
  }
  return values;
}

function readIntegrantes(formData: FormData) {
  const integrantes = [];

  for (let index = 0; index < 12; index++) {
    const prefix = `integrante_${index}_`;
    const nome = getText(formData.get(`${prefix}nome`));
    const cpf = getText(formData.get(`${prefix}cpf`));
    const nisCadUnico = getText(formData.get(`${prefix}nisCadUnico`));
    const parentesco = getText(formData.get(`${prefix}parentesco`));
    const dataNascimento = getOptionalDate(formData, `${prefix}dataNascimento`);
    const telefones = getText(formData.get(`${prefix}telefones`));
    const email = getText(formData.get(`${prefix}email`));
    const escolaridade = getText(formData.get(`${prefix}escolaridade`));
    const apelido = getText(formData.get(`${prefix}apelido`));
    const sexo = getText(formData.get(`${prefix}sexo`));
    const orientacaoSexual = getText(formData.get(`${prefix}orientacaoSexual`));
    const identidadeGenero = getText(formData.get(`${prefix}identidadeGenero`));
    const nomeMae = getText(formData.get(`${prefix}nomeMae`));
    const nomePai = getText(formData.get(`${prefix}nomePai`));
    const classificacao = getText(formData.get(`${prefix}classificacao`));
    const responsavelUfpa = getBoolean(formData, `${prefix}responsavelUfpa`);

    if (
      !nome &&
      !cpf &&
      !nisCadUnico &&
      !apelido &&
      !sexo &&
      !orientacaoSexual &&
      !identidadeGenero &&
      !parentesco &&
      !dataNascimento &&
      !nomeMae &&
      !nomePai &&
      !classificacao &&
      !telefones &&
      !email &&
      !escolaridade
    ) {
      continue;
    }

    if (!nome) {
      continue;
    }

    integrantes.push({
      nome,
      cpf: cpf || null,
      nisCadUnico: nisCadUnico || null,
      apelido: apelido || null,
      sexo: sexo || null,
      orientacaoSexual: orientacaoSexual || null,
      identidadeGenero: identidadeGenero || null,
      parentesco: parentesco || null,
      dataNascimento,
      nomeMae: nomeMae || null,
      nomePai: nomePai || null,
      classificacao: classificacao || null,
      telefones: telefones || null,
      email: email || null,
      escolaridade: escolaridade || null,
      responsavelUfpa,
    });
  }

  return integrantes;
}

function readAtividadesUfpa(formData: FormData) {
  const atividades = [];

  for (let index = 0; index < 9; index++) {
    const prefix = `atividade_${index}_`;
    const atividade = getText(formData.get(`${prefix}atividade`));
    const producaoAnual = getText(formData.get(`${prefix}producaoAnual`));
    const unidade = getText(formData.get(`${prefix}unidade`));
    const atividadePrincipal = getBoolean(formData, `${prefix}atividadePrincipal`);

    if (!atividade && !producaoAnual && !unidade && !atividadePrincipal) {
      continue;
    }

    atividades.push({
      atividade: atividade || null,
      producaoAnual: producaoAnual || null,
      unidade: unidade || null,
      atividadePrincipal,
    });
  }

  return atividades.length ? atividades : null;
}

export async function listarFamilias(filtros?: FamiliaFilterDTO) {
  try {
    const data = await AterSociobioService.listFamilias({ filtros });
    return { data, error: null };
  } catch (error) {
    return { data: null, error: getAterErrorMessage(error, "Erro ao listar famílias.") };
  }
}

export async function buscarFamilia(id: string) {
  try {
    const data = await AterSociobioService.getFamiliaById(id);
    return {
      data,
      error: data ? null : "Família não encontrada.",
    };
  } catch (error) {
    return { data: null, error: getAterErrorMessage(error, "Erro ao buscar família.") };
  }
}

export async function criarFamilia(formData: FormData) {
  const nomeFamilia = getText(formData.get("nomeFamilia"));
  const municipio = getText(formData.get("municipio"));
  const documentoResponsavel = getText(formData.get("documentoResponsavel"));
  const integrantes = readIntegrantes(formData);
  const responsavel = integrantes.find((integrante) => integrante.responsavelUfpa) ?? integrantes[0];

  if (!nomeFamilia) {
    return { data: null, error: "O nome da UFPA / Denominação é obrigatório." };
  }

  if (!municipio) {
    return { data: null, error: "O município é obrigatório." };
  }

  if (!documentoResponsavel) {
    return { data: null, error: "O CPF do responsável é obrigatório." };
  }

  try {
    const extraData = {
      projeto: getText(formData.get("projeto")) || null,
      tecnico: getText(formData.get("tecnico")) || null,
      dataCadastro: getOptionalDate(formData, "dataCadastro"),
      lgpdConsentimento: getBoolean(formData, "lgpdConsentimento"),
      lgpdDataConsentimento: getOptionalDate(formData, "lgpdDataConsentimento"),
      representanteNome: getText(formData.get("representanteNome")) || null,
      representanteCpf: getText(formData.get("representanteCpf")) || null,
      referenciaAnexoLgpd: (() => {
        const file = formData.get("referenciaAnexoLgpd");
        if (file instanceof File) return file.name;
        return getText(file) || null;
      })(),
      patrimonios: parseJsonSafe(formData, "patrimonios_json"),
      atividadesProdutivas: parseJsonSafe(formData, "atividadesProdutivas_json"),
      possuiRadio: getBoolean(formData, "possuiRadio"),
      possuiTelevisao: getBoolean(formData, "possuiTelevisao"),
      possuiCelular: getBoolean(formData, "possuiCelular"),
      possuiInternet: getBoolean(formData, "possuiInternet"),
      usaRedesSociais: getBoolean(formData, "usaRedesSociais"),
      possuiOutroMeioComunicacao: getBoolean(formData, "possuiOutroMeioComunicacao"),
      outroMeioComunicacao: getText(formData.get("outroMeioComunicacao")) || null,
      aguaParaConsumo: getBoolean(formData, "aguaParaConsumo"),
      aguaConsumoTratada: getBoolean(formData, "aguaConsumoTratada"),
      aguaParaProducao: getBoolean(formData, "aguaParaProducao"),
      captacaoAguaChuva: getBoolean(formData, "captacaoAguaChuva"),
      esgotoTratado: getBoolean(formData, "esgotoTratado"),
      fontesProtegidas: getBoolean(formData, "fontesProtegidas"),
      acoesPotenciaisProdutivo: parseStringArray(formData, "acoesPotenciaisProdutivo"),
      acoesPotenciaisSocial: parseStringArray(formData, "acoesPotenciaisSocial"),
      acoesPotenciaisAmbiental: parseStringArray(formData, "acoesPotenciaisAmbiental"),
      limitacoesProdutivo: parseStringArray(formData, "limitacoesProdutivo"),
      limitacoesSocial: parseStringArray(formData, "limitacoesSocial"),
      limitacoesAmbiental: parseStringArray(formData, "limitacoesAmbiental"),
      outrasAcoesPotenciais: getText(formData.get("outrasAcoesPotenciais")) || null,
      outrasLimitacoes: getText(formData.get("outrasLimitacoes")) || null,
    };

    const payload = {
      nomeFamilia,
      documentoResponsavel: documentoResponsavel || responsavel?.cpf || "",
      nomeResponsavel: getText(formData.get("nomeResponsavel")) || responsavel?.nome || null,
      telefone: getText(formData.get("telefone")) || responsavel?.telefones || null,
      quantidadeMembros: getOptionalNumber(formData, "quantidadeMembros") ?? (integrantes.length || null),
      municipio: getText(formData.get("municipio")) || null,
      comunidade: getText(formData.get("comunidade")) || null,
      enderecoUfpa: getText(formData.get("enderecoUfpa")) || null,
      complementoUfpa: getText(formData.get("complementoUfpa")) || null,
      cepUfpa: getText(formData.get("cepUfpa")) || null,
      ufpa: getText(formData.get("ufpa")) || null,
      dapCaf: getText(formData.get("dapCaf")) || null,
      dapCafOrgaoEmissor: getText(formData.get("dapCafOrgaoEmissor")) || null,
      dapCafValidade: getOptionalDate(formData, "dapCafValidade"),
      areaEstabelecimento: getOptionalNumber(formData, "areaEstabelecimento"),
      areaImovelPrincipal: getOptionalNumber(formData, "areaImovelPrincipal"),
      classificacaoUfpa: getText(formData.get("classificacaoUfpa")) || null,
      bioma: getText(formData.get("bioma")) || null,
      latitude: getOptionalNumber(formData, "latitude"),
      longitude: getOptionalNumber(formData, "longitude"),
      grupoInteresse: getText(formData.get("grupoInteresse")) || null,
      organizacaoColetivaId: getText(formData.get("organizacaoColetivaId")) || null,
      statusCadastro: getText(formData.get("statusCadastro")) || null,
      situacaoProjeto: getText(formData.get("situacaoProjeto")) || null,
      tipoAtendimento: getText(formData.get("tipoAtendimento")) || null,
      atividadeProdutiva: getText(formData.get("atividadeProdutiva")) || null,
      envioSGAPorAtividade: readAtividadesUfpa(formData) ?? undefined,
      programaFomento: getText(formData.get("programaFomento")) || null,
      nis: getText(formData.get("nis")) || null,
      codigoSGA: getText(formData.get("codigoSGA")) || null,
      situacaoFomento: getText(formData.get("situacaoFomento")) || null,
      valorProjetoATER: getOptionalNumber(formData, "valorProjetoATER"),
      valorInvestidoUFPA: getOptionalNumber(formData, "valorInvestidoUFPA"),
      valorFomento: getOptionalNumber(formData, "valorFomento"),
      integrantes,
      ...extraData,
    };

    const created = await AterSociobioService.createFamilia(payload);
    if (!created.familia) {
      return { data: null, error: "Não foi possível criar a UFPA." };
    }

    const diagnosticoResult = await salvarDiagnosticoUfpa(created.familia.id, formData);

    if (diagnosticoResult.error) {
      return { data: null, error: diagnosticoResult.error };
    }

    revalidatePath("/ater-sociobio");
    revalidatePath("/ater-sociobio/familias");

    return { data: created.familia, error: null };
  } catch (error) {
    return { data: null, error: getAterErrorMessage(error, "Não foi possível criar a família.") };
  }
}

export async function atualizarFamilia(id: string, formData: FormData) {
  try {
    const nomeFamilia = getText(formData.get("nomeFamilia"));
    const telefone = getText(formData.get("telefone"));
    const integrantes = readIntegrantes(formData);
    const responsavel = integrantes.find((integrante) => integrante.responsavelUfpa) ?? integrantes[0];

    const extraData = {
      projeto: getText(formData.get("projeto")) || null,
      tecnico: getText(formData.get("tecnico")) || null,
      dataCadastro: getOptionalDate(formData, "dataCadastro"),
      lgpdConsentimento: getBoolean(formData, "lgpdConsentimento"),
      lgpdDataConsentimento: getOptionalDate(formData, "lgpdDataConsentimento"),
      representanteNome: getText(formData.get("representanteNome")) || null,
      representanteCpf: getText(formData.get("representanteCpf")) || null,
      referenciaAnexoLgpd: (() => {
        const file = formData.get("referenciaAnexoLgpd");
        if (file instanceof File) return file.name;
        return getText(file) || null;
      })(),
      patrimonios: parseJsonSafe(formData, "patrimonios_json"),
      atividadesProdutivas: parseJsonSafe(formData, "atividadesProdutivas_json"),
      possuiRadio: getBoolean(formData, "possuiRadio"),
      possuiTelevisao: getBoolean(formData, "possuiTelevisao"),
      possuiCelular: getBoolean(formData, "possuiCelular"),
      possuiInternet: getBoolean(formData, "possuiInternet"),
      usaRedesSociais: getBoolean(formData, "usaRedesSociais"),
      possuiOutroMeioComunicacao: getBoolean(formData, "possuiOutroMeioComunicacao"),
      outroMeioComunicacao: getText(formData.get("outroMeioComunicacao")) || null,
      aguaParaConsumo: getBoolean(formData, "aguaParaConsumo"),
      aguaConsumoTratada: getBoolean(formData, "aguaConsumoTratada"),
      aguaParaProducao: getBoolean(formData, "aguaParaProducao"),
      captacaoAguaChuva: getBoolean(formData, "captacaoAguaChuva"),
      esgotoTratado: getBoolean(formData, "esgotoTratado"),
      fontesProtegidas: getBoolean(formData, "fontesProtegidas"),
      acoesPotenciaisProdutivo: parseStringArray(formData, "acoesPotenciaisProdutivo"),
      acoesPotenciaisSocial: parseStringArray(formData, "acoesPotenciaisSocial"),
      acoesPotenciaisAmbiental: parseStringArray(formData, "acoesPotenciaisAmbiental"),
      limitacoesProdutivo: parseStringArray(formData, "limitacoesProdutivo"),
      limitacoesSocial: parseStringArray(formData, "limitacoesSocial"),
      limitacoesAmbiental: parseStringArray(formData, "limitacoesAmbiental"),
      outrasAcoesPotenciais: getText(formData.get("outrasAcoesPotenciais")) || null,
      outrasLimitacoes: getText(formData.get("outrasLimitacoes")) || null,
    };

    const payload = {
      nomeFamilia,
      nomeResponsavel: getText(formData.get("nomeResponsavel")) || responsavel?.nome || null,
      documentoResponsavel: getText(formData.get("documentoResponsavel")) || responsavel?.cpf || "",
      telefone: telefone || responsavel?.telefones || null,
      quantidadeMembros: getOptionalNumber(formData, "quantidadeMembros") ?? (integrantes.length || null),
      municipio: getText(formData.get("municipio")),
      comunidade: getText(formData.get("comunidade")),
      enderecoUfpa: getText(formData.get("enderecoUfpa")),
      complementoUfpa: getText(formData.get("complementoUfpa")),
      cepUfpa: getText(formData.get("cepUfpa")),
      ufpa: getText(formData.get("ufpa")),
      dapCaf: getText(formData.get("dapCaf")),
      dapCafOrgaoEmissor: getText(formData.get("dapCafOrgaoEmissor")),
      dapCafValidade: getOptionalDate(formData, "dapCafValidade"),
      areaEstabelecimento: getOptionalNumber(formData, "areaEstabelecimento"),
      areaImovelPrincipal: getOptionalNumber(formData, "areaImovelPrincipal"),
      classificacaoUfpa: getText(formData.get("classificacaoUfpa")),
      bioma: getText(formData.get("bioma")),
      latitude: getOptionalNumber(formData, "latitude"),
      longitude: getOptionalNumber(formData, "longitude"),
      grupoInteresse: getText(formData.get("grupoInteresse")),
      organizacaoColetivaId: getText(formData.get("organizacaoColetivaId")) || null,
      statusCadastro: getText(formData.get("statusCadastro")),
      situacaoProjeto: getText(formData.get("situacaoProjeto")),
      tipoAtendimento: getText(formData.get("tipoAtendimento")),
      atividadeProdutiva: getText(formData.get("atividadeProdutiva")),
      envioSGAPorAtividade: readAtividadesUfpa(formData) ?? undefined,
      programaFomento: getText(formData.get("programaFomento")),
      nis: getText(formData.get("nis")),
      codigoSGA: getText(formData.get("codigoSGA")),
      situacaoFomento: getText(formData.get("situacaoFomento")),
      valorProjetoATER: getOptionalNumber(formData, "valorProjetoATER"),
      valorInvestidoUFPA: getOptionalNumber(formData, "valorInvestidoUFPA"),
      valorFomento: getOptionalNumber(formData, "valorFomento"),
      efetividade: getText(formData.get("efetividade")),
      integrantes,
      ...extraData,
    };

    const updated = await AterSociobioService.updateFamilia(id, payload);

    revalidatePath("/ater-sociobio/familias");
    revalidatePath(`/ater-sociobio/familias/${id}`);

    return { data: updated, error: null };
  } catch (error) {
    return { data: null, error: getAterErrorMessage(error, "Não foi possível atualizar a família.") };
  }
}
