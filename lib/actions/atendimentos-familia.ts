"use server";

import { revalidatePath } from "next/cache";
import { getAterErrorMessage } from "@/lib/ater-runtime";
import {
  ATENDIMENTO_AMBIENTAL_INDICADORES,
  ATENDIMENTO_AMBIENTAL_RESULTADOS,
  ATENDIMENTO_PRODUTIVO_INDICADORES,
  ATENDIMENTO_PRODUTIVO_RESULTADOS,
  ATENDIMENTO_SOCIAL_INDICADORES,
  ATENDIMENTO_SOCIAL_RESULTADOS,
} from "@/lib/constants/ater-sociobio-official";
import { AterSociobioService } from "@/lib/services/ater-sociobio.service";

export async function listarTecnicos() {
  try {
    const data = await AterSociobioService.listTecnicos();
    return { data, error: null };
  } catch (error) {
    return { data: null, error: getAterErrorMessage(error, "Erro ao listar técnicos.") };
  }
}

export async function listarAtendimentosFamilia(familiaId?: string) {
  try {
    const data = await AterSociobioService.listAtendimentos({ familiaId });
    return { data, error: null };
  } catch (error) {
    return { data: null, error: getAterErrorMessage(error, "Erro ao listar atendimentos.") };
  }
}

export async function buscarAtendimento(id: string) {
  if (!id || id.length !== 36) {
    return { data: null, error: "ID de atendimento inválido." };
  }

  try {
    const data = await AterSociobioService.getAtendimentoById(id);
    return {
      data,
      error: data ? null : "Atendimento não encontrado.",
    };
  } catch (error) {
    return { data: null, error: getAterErrorMessage(error, "Erro ao buscar atendimento.") };
  }
}

function getText(value: FormDataEntryValue | null) {
  return String(value ?? "").trim();
}

function getOptionalNumber(value: FormDataEntryValue | null) {
  const text = getText(value);
  if (!text) return null;

  const number = Number(text);
  return Number.isFinite(number) ? number : null;
}

function getTextList(formData: FormData, key: string) {
  return formData
    .getAll(key)
    .map((value) => getText(value))
    .filter(Boolean);
}

function readEixoAtendimento(formData: FormData, key: "produtivo" | "social" | "ambiental") {
  const baseFields =
    key === "produtivo"
      ? ["tecnologiaProducao", "atividadeProdutiva", "orientacoes", "outrasAtividadesUfpa"]
      : key === "social"
        ? ["orientacoesEncaminhamentos", "atividadeSocial", "orientacoes"]
        : ["tecnologiaAmbiental", "atividadeAmbiental", "orientacoes"];

  const resultadosPermitidos =
    key === "produtivo"
      ? ATENDIMENTO_PRODUTIVO_RESULTADOS
      : key === "social"
        ? ATENDIMENTO_SOCIAL_RESULTADOS
        : ATENDIMENTO_AMBIENTAL_RESULTADOS;

  const indicadoresPermitidos =
    key === "produtivo"
      ? ATENDIMENTO_PRODUTIVO_INDICADORES
      : key === "social"
        ? ATENDIMENTO_SOCIAL_INDICADORES
        : ATENDIMENTO_AMBIENTAL_INDICADORES;

  const obj: Record<string, string | string[]> = {};
  let hasData = false;

  baseFields.forEach((field) => {
    const value = getText(formData.get(`eixo_${key}_${field}`));
    if (value) {
      obj[field] = value;
      hasData = true;
    }
  });

  const resultados = getTextList(formData, `eixo_${key}_resultados`).filter((value) =>
    (resultadosPermitidos as readonly string[]).includes(value),
  );
  const indicadores = getTextList(formData, `eixo_${key}_indicadores`).filter((value) =>
    (indicadoresPermitidos as readonly string[]).includes(value),
  );

  if (resultados.length > 0) {
    obj.resultadosParciaisFinais = resultados;
    hasData = true;
  }

  if (indicadores.length > 0) {
    obj.indicadoresTrabalhados = indicadores;
    hasData = true;
  }

  return hasData ? obj : null;
}

export async function criarAtendimentoFamilia(formData: FormData) {
  try {
    const familiaId = getText(formData.get("familiaId"));
    const numeroVisita = Number(formData.get("numeroVisita") ?? 0);
    const data = formData.get("data") ? new Date(String(formData.get("data"))) : null;
    const tecnicoId = getText(formData.get("tecnicoId")) || null;
    const tecnico = getText(formData.get("tecnico")) || null;
    const projetoId = getText(formData.get("projetoId")) || null;
    const projetoTitulo = getText(formData.get("projetoTitulo")) || null;
    const statusRelatorio = getText(formData.get("statusRelatorio")) || "PENDENTE";
    const houveAtendimento = formData.get("houveAtendimento") === "true";
    const atividadeNumeroTotal = getText(formData.get("atividadeNumeroTotal")) || null;
    const codigoMeta = getText(formData.get("codigoMeta")) || null;
    const descricaoMeta = getText(formData.get("descricaoMeta")) || null;
    const numeroMulheres = getOptionalNumber(formData.get("numeroMulheres"));
    const numeroJovens = getOptionalNumber(formData.get("numeroJovens"));

    if (!familiaId || !numeroVisita) {
      return { data: null, error: "UFPA e número da visita são obrigatórios." };
    }

    if (!tecnico && !tecnicoId) {
      return { data: null, error: "Nome do técnico obrigatório." };
    }

    const payload = {
      familiaId,
      numeroVisita,
      data,
      tecnicoId,
      tecnico,
      projetoId,
      projetoTitulo,
      statusRelatorio,
      houveAtendimento,
      atividadeNumeroTotal,
      codigoMeta,
      descricaoMeta,
      numeroMulheres,
      numeroJovens,
      eixoProdutivo: readEixoAtendimento(formData, "produtivo") ?? undefined,
      eixoSocial: readEixoAtendimento(formData, "social") ?? undefined,
      eixoAmbiental: readEixoAtendimento(formData, "ambiental") ?? undefined,
    };

    const created = await AterSociobioService.createAtendimento(payload);

    revalidatePath("/ater-sociobio/atendimentos");
    revalidatePath("/ater-sociobio/familias");
    revalidatePath("/ater-sociobio");

    return { data: created, error: null };
  } catch (error) {
    return { data: null, error: getAterErrorMessage(error, "Não foi possível criar o atendimento.") };
  }
}

export async function atualizarAtendimentoFamilia(id: string, formData: FormData) {
  try {
    const familiaId = getText(formData.get("familiaId")) || null;
    const numeroVisita = Number(formData.get("numeroVisita") ?? 0);
    const data = formData.get("data") ? new Date(String(formData.get("data"))) : null;
    const tecnicoId = getText(formData.get("tecnicoId")) || null;
    const tecnico = getText(formData.get("tecnico")) || null;
    const projetoId = getText(formData.get("projetoId")) || null;
    const projetoTitulo = getText(formData.get("projetoTitulo")) || null;
    const statusRelatorio = getText(formData.get("statusRelatorio")) || "PENDENTE";
    const houveAtendimento = formData.get("houveAtendimento") === "true";
    const atividadeNumeroTotal = getText(formData.get("atividadeNumeroTotal")) || null;
    const codigoMeta = getText(formData.get("codigoMeta")) || null;
    const descricaoMeta = getText(formData.get("descricaoMeta")) || null;
    const numeroMulheres = getOptionalNumber(formData.get("numeroMulheres"));
    const numeroJovens = getOptionalNumber(formData.get("numeroJovens"));

    if (!familiaId || !numeroVisita) {
      return { data: null, error: "UFPA e número da visita são obrigatórios." };
    }

    const payload = {
      familiaId,
      numeroVisita,
      data,
      tecnicoId,
      tecnico,
      projetoId,
      projetoTitulo,
      statusRelatorio,
      houveAtendimento,
      atividadeNumeroTotal,
      codigoMeta,
      descricaoMeta,
      numeroMulheres,
      numeroJovens,
      eixoProdutivo: readEixoAtendimento(formData, "produtivo") ?? undefined,
      eixoSocial: readEixoAtendimento(formData, "social") ?? undefined,
      eixoAmbiental: readEixoAtendimento(formData, "ambiental") ?? undefined,
    };

    const updated = await AterSociobioService.updateAtendimento(id, payload);

    revalidatePath("/ater-sociobio/atendimentos");
    revalidatePath(`/ater-sociobio/atendimentos/${id}`);
    revalidatePath("/ater-sociobio/familias");
    revalidatePath("/ater-sociobio");

    return { data: updated, error: null };
  } catch (error) {
    return { data: null, error: getAterErrorMessage(error, "Não foi possível atualizar o atendimento.") };
  }
}
