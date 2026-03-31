"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";

export async function adicionarOrcamento(projetoId: string, formData: FormData) {
  const idOrc = String(formData.get("idOrc") ?? "").trim();
  const planoGerencial = String(formData.get("planoGerencial") ?? "").trim();
  const descricao = String(formData.get("descricao") ?? "").trim();
  const valorReferencia = Number(String(formData.get("valorReferencia") ?? "").trim());
  const valorTotal = Number(String(formData.get("valorTotal") ?? "").trim());

  await prisma.orcamentoItem.create({
    data: {
      projetoId,
      idOrc,
      planoGerencial: planoGerencial || null,
      descricao: descricao || null,
      valorReferencia,
      valorTotal,
    },
  });

  revalidatePath("/projetos/[id]", "page");
}

export async function adicionarAtividade(projetoId: string, formData: FormData) {
  const numMeta = Number.parseInt(String(formData.get("numMeta") ?? "").trim(), 10);
  const descricao = String(formData.get("descricao") ?? "").trim();
  const status = String(formData.get("status") ?? "").trim();
  const valorUnitario = Number(String(formData.get("valorUnitario") ?? "").trim());

  await prisma.planejamentoAtividade.create({
    data: {
      projetoId,
      numMeta,
      descricao,
      status,
      valorUnitario,
    },
  });

  revalidatePath("/projetos/[id]", "page");
}
