"use server";

import { revalidatePath } from "next/cache";
import { getAterErrorMessage } from "@/lib/ater-runtime";
import { AterSociobioService, FamiliaFilterDTO } from "@/lib/services/ater-sociobio.service";

function getText(value: FormDataEntryValue | null) {
  return String(value ?? "").trim();
}

export async function listarFamilias(filtros?: FamiliaFilterDTO) {
  try {
    const data = await AterSociobioService.listFamilias(filtros);
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
  const documentoResponsavel = getText(formData.get("documentoResponsavel"));

  if (!nomeFamilia) {
    return { data: null, error: "Nome da família obrigatório." };
  }

  try {
    const payload = {
      nomeFamilia,
      documentoResponsavel,
      nomeResponsavel: getText(formData.get("nomeResponsavel")) || null,
      telefone: getText(formData.get("telefone")) || null,
      quantidadeMembros: Number(formData.get("quantidadeMembros")) || null,
      municipio: getText(formData.get("municipio")) || null,
      comunidade: getText(formData.get("comunidade")) || null,
      ufpa: getText(formData.get("ufpa")) || null,
      grupoInteresse: getText(formData.get("grupoInteresse")) || null,
      statusCadastro: getText(formData.get("statusCadastro")) || null,
      situacaoProjeto: getText(formData.get("situacaoProjeto")) || null,
      tipoAtendimento: getText(formData.get("tipoAtendimento")) || null,
      atividadeProdutiva: getText(formData.get("atividadeProdutiva")) || null,
      nis: getText(formData.get("nis")) || null,
      codigoSGA: getText(formData.get("codigoSGA")) || null,
      situacaoFomento: getText(formData.get("situacaoFomento")) || null,
      valorProjetoATER: Number(formData.get("valorProjetoATER")) || null,
      valorInvestidoUFPA: Number(formData.get("valorInvestidoUFPA")) || null,
      valorFomento: Number(formData.get("valorFomento")) || null,
    };

    const created = await AterSociobioService.createFamilia(payload);

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
    
    const payload = {
      nomeFamilia,
      nomeResponsavel: getText(formData.get("nomeResponsavel")),
      telefone,
      quantidadeMembros: Number(formData.get("quantidadeMembros")) || null,
      municipio: getText(formData.get("municipio")),
      comunidade: getText(formData.get("comunidade")),
      ufpa: getText(formData.get("ufpa")),
      grupoInteresse: getText(formData.get("grupoInteresse")),
      statusCadastro: getText(formData.get("statusCadastro")),
      situacaoProjeto: getText(formData.get("situacaoProjeto")),
      tipoAtendimento: getText(formData.get("tipoAtendimento")),
      atividadeProdutiva: getText(formData.get("atividadeProdutiva")),
      nis: getText(formData.get("nis")),
      codigoSGA: getText(formData.get("codigoSGA")),
      situacaoFomento: getText(formData.get("situacaoFomento")),
      valorProjetoATER: Number(formData.get("valorProjetoATER")) || null,
      valorInvestidoUFPA: Number(formData.get("valorInvestidoUFPA")) || null,
      valorFomento: Number(formData.get("valorFomento")) || null,
      efetividade: getText(formData.get("efetividade")),
      statusSGA: getText(formData.get("statusSGA")),
      sgaCadastro: formData.get("sgaCadastro") === "true",
      sgaRevisao: formData.get("sgaRevisao") === "true",
      sgaIndicador: formData.get("sgaIndicador") === "true",
      sgaFotos: formData.get("sgaFotos") === "true",
    };

    const updated = await AterSociobioService.updateFamilia(id, payload);

    revalidatePath("/ater-sociobio/familias");
    revalidatePath(`/ater-sociobio/familias/${id}`);

    return { data: updated, error: null };
  } catch (error) {
    return { data: null, error: getAterErrorMessage(error, "Não foi possível atualizar a família.") };
  }
}
