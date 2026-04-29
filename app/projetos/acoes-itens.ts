"use server";

import { revalidatePath } from "next/cache";
import { ProjetoService, OrcamentoItemDTO } from "@/lib/services/projeto.service";

export async function adicionarOrcamento(projetoId: string, formData: FormData) {
  try {
    const idOrc = String(formData.get("idOrc") ?? "").trim();
    const descricao = String(formData.get("descricao") ?? "").trim();
    const valorReferencia = Number(String(formData.get("valorReferencia") ?? "0").trim()) || 0;
    const valorTotal = Number(String(formData.get("valorTotal") ?? "0").trim()) || 0;

    const item: OrcamentoItemDTO = {
      idOrc,
      descricao: descricao || null,
      valorReferencia,
      valorTotal,
    };

    await ProjetoService.addOrcamentoItem(projetoId, item);
    revalidatePath("/projetos/[id]");
  } catch (error) {
    console.error("Failed to add orcamento item:", error);
    throw new Error("Erro ao adicionar item de orçamento.");
  }
}

export async function adicionarAtividade() {
  // Atividades agora sao criadas via PlanoTrabalho
  // Funcionalidade temporariamente desabilitada
}
