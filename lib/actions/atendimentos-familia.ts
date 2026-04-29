"use server";

import { revalidatePath } from "next/cache";
import { getAterErrorMessage } from "@/lib/ater-runtime";
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

    const rawEixo = (key: string) => {
      const fields = ["tipoAcao", "etapa", "impactosAnteriores", "desenvolvimento", "recomendacoes"];
      const obj: Record<string, string> = {};
      let hasData = false;
      
      fields.forEach(f => {
        const val = getText(formData.get(`eixo_${key}_${f}`));
        if (val) {
          obj[f] = val;
          hasData = true;
        }
      });
      
      return hasData ? obj : null;
    };

    if (!familiaId || !numeroVisita) {
      return { data: null, error: "Família e número da visita são obrigatórios." };
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
      eixoProdutivo: rawEixo("produtivo") ?? undefined,
      eixoSocial: rawEixo("social") ?? undefined,
      eixoAmbiental: rawEixo("ambiental") ?? undefined,
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

    const rawEixo = (key: string) => {
      const fields = ["tipoAcao", "etapa", "impactosAnteriores", "desenvolvimento", "recomendacoes"];
      const obj: Record<string, string> = {};
      let hasData = false;
      
      fields.forEach(f => {
        const val = getText(formData.get(`eixo_${key}_${f}`));
        if (val) {
          obj[f] = val;
          hasData = true;
        }
      });
      
      return hasData ? obj : null;
    };

    if (!familiaId || !numeroVisita) {
      return { data: null, error: "Família e número da visita são obrigatórios." };
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
      eixoProdutivo: rawEixo("produtivo") ?? undefined,
      eixoSocial: rawEixo("social") ?? undefined,
      eixoAmbiental: rawEixo("ambiental") ?? undefined,
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
