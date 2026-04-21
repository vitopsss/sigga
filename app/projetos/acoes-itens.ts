"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";

export async function adicionarOrcamento(projetoId: string, formData: FormData) {
  const idOrc = String(formData.get("idOrc") ?? "").trim();
  const descricao = String(formData.get("descricao") ?? "").trim();
  const valorReferencia = Number(String(formData.get("valorReferencia") ?? "0").trim()) || 0;
  const valorTotal = Number(String(formData.get("valorTotal") ?? "0").trim()) || 0;

  await prisma.orcamentoItem.create({
    data: {
      projetoId,
      idOrc,
      descricao: descricao || null,
      valorReferencia,
      valorTotal,
    },
  });

  revalidatePath("/projetos/[id]");
}

export async function adicionarAtividade() {
  // Atividades agora sao criadas via PlanoTrabalho
  // Funcionalidade temporariamente desabilitada
}
