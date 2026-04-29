"use server";

import { revalidatePath } from "next/cache";
import { AterSociobioService } from "@/lib/services/ater-sociobio.service";

export async function listarTecnicos() {
  try {
    const data = await AterSociobioService.listTecnicos();
    return { data, error: null };
  } catch (error) {
    console.error(error);
    return { data: null, error: "Erro ao listar técnicos." };
  }
}

export async function listarAtendimentos(beneficiariaId?: string) {
  try {
    const data = await AterSociobioService.listAtendimentos(beneficiariaId);
    return { data, error: null };
  } catch (error) {
    console.error(error);
    return { data: null, error: "Erro ao listar atendimentos." };
  }
}

export async function buscarAtendimento(id: string) {
  try {
    const data = await AterSociobioService.getAtendimentoById(id);
    return {
      data,
      error: data ? null : "Atendimento não encontrado.",
    };
  } catch (error) {
    console.error(error);
    return { data: null, error: "Erro ao buscar atendimento." };
  }
}

export async function criarAtendimento(formData: FormData) {
  try {
    const beneficiariaId = String(formData.get("beneficiariaId") ?? "").trim();
    const numeroVisita = Number(formData.get("numeroVisita") ?? 0);
    const data = formData.get("data") ? new Date(String(formData.get("data"))) : null;
    const tecnicoId = String(formData.get("tecnicoId") ?? "").trim() || null;
    const tecnico = String(formData.get("tecnico") ?? "").trim() || null;
    const projetoId = String(formData.get("projetoId") ?? "").trim() || null;
    const projetoTitulo = String(formData.get("projetoTitulo") ?? "").trim() || null;
    const statusRelatorio = String(formData.get("statusRelatorio") ?? "PENDENTE").trim() || "PENDENTE";
    const houveAtendimento = formData.get("houveAtendimento") === "true";

    const rawEixo = (key: string) => {
      const tipoAcao = String(formData.get(`eixo_${key}_tipoAcao`) ?? "").trim() || undefined;
      const etapa = String(formData.get(`eixo_${key}_etapa`) ?? "").trim() || undefined;
      const impactosAnteriores = String(formData.get(`eixo_${key}_impactosAnteriores`) ?? "").trim() || undefined;
      const desenvolvimento = String(formData.get(`eixo_${key}_desenvolvimento`) ?? "").trim() || undefined;
      const recomendacoes = String(formData.get(`eixo_${key}_recomendacoes`) ?? "").trim() || undefined;
      return tipoAcao || etapa ? { tipoAcao, etapa, impactosAnteriores, desenvolvimento, recomendacoes } : null;
    };

    if (!beneficiariaId || !numeroVisita) {
      return { data: null, error: "Beneficiária e número da visita são obrigatórios." };
    }

    const payload = {
      beneficiariaId,
      numeroVisita,
      data,
      tecnicoId,
      tecnico,
      projetoId,
      projetoTitulo,
      statusRelatorio,
      houveAtendimento,
      eixoProdutivo: rawEixo("produtivo") ?? undefined,
      eixoSocial: rawEixo("social") ?? undefined,
      eixoAmbiental: rawEixo("ambiental") ?? undefined,
    };

    const created = await AterSociobioService.createAtendimento(payload);

    revalidatePath("/ater-sociobio/atendimentos");
    revalidatePath("/ater-sociobio");

    return { data: created, error: null };
  } catch (error) {
    console.error(error);
    return { data: null, error: "Não foi possível criar o atendimento." };
  }
}

export async function atualizarAtendimento(id: string, formData: FormData) {
  try {
    const data = formData.get("data") ? new Date(String(formData.get("data"))) : undefined;
    const tecnicoId = String(formData.get("tecnicoId") ?? "").trim() || undefined;
    const tecnico = String(formData.get("tecnico") ?? "").trim() || undefined;
    const projetoId = String(formData.get("projetoId") ?? "").trim() || undefined;
    const projetoTitulo = String(formData.get("projetoTitulo") ?? "").trim() || undefined;
    const statusRelatorio = String(formData.get("statusRelatorio") ?? "").trim() || undefined;
    const houveAtendimento = formData.get("houveAtendimento") === "true" ? true : formData.get("houveAtendimento") === "false" ? false : undefined;

    const rawEixo = (key: string) => {
      const tipoAcao = String(formData.get(`eixo_${key}_tipoAcao`) ?? "").trim() || undefined;
      const etapa = String(formData.get(`eixo_${key}_etapa`) ?? "").trim() || undefined;
      const impactosAnteriores = String(formData.get(`eixo_${key}_impactosAnteriores`) ?? "").trim() || undefined;
      const desenvolvimento = String(formData.get(`eixo_${key}_desenvolvimento`) ?? "").trim() || undefined;
      const recomendacoes = String(formData.get(`eixo_${key}_recomendacoes`) ?? "").trim() || undefined;
      if (!tipoAcao && !etapa) return undefined;
      return { tipoAcao, etapa, impactosAnteriores, desenvolvimento, recomendacoes };
    };

    const payload = {
      ...(data !== undefined && { data }),
      ...(tecnicoId !== undefined && { tecnicoId }),
      ...(tecnico !== undefined && { tecnico }),
      ...(projetoId !== undefined && { projetoId }),
      ...(projetoTitulo !== undefined && { projetoTitulo }),
      ...(statusRelatorio !== undefined && { statusRelatorio }),
      ...(houveAtendimento !== undefined && { houveAtendimento }),
      ...(rawEixo("produtivo") !== undefined && { eixoProdutivo: rawEixo("produtivo") }),
      ...(rawEixo("social") !== undefined && { eixoSocial: rawEixo("social") }),
      ...(rawEixo("ambiental") !== undefined && { eixoAmbiental: rawEixo("ambiental") }),
    };

    const updated = await AterSociobioService.updateAtendimento(id, payload);

    revalidatePath("/ater-sociobio/atendimentos");
    revalidatePath("/ater-sociobio");

    return { data: updated, error: null };
  } catch (error) {
    console.error(error);
    return { data: null, error: "Não foi possível atualizar o atendimento." };
  }
}
