"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { CompraService, SaveContratoDTO } from "@/lib/services/compra.service";

function getText(value: FormDataEntryValue | null) {
  return String(value ?? "").trim();
}

function parseValor(formData: FormData) {
  return Number(formData.get("valorTotal") ?? 0);
}

function validateContrato(formData: FormData, id?: string): SaveContratoDTO {
  const idContrato = getText(formData.get("idContrato"));
  const fornecedorId = getText(formData.get("fornecedorId"));
  const objeto = getText(formData.get("objeto")) || null;
  const status = getText(formData.get("status")) || null;
  const valorTotal = parseValor(formData);

  if (!idContrato) {
    throw new Error("ID do contrato obrigatório.");
  }

  if (!fornecedorId) {
    throw new Error("Fornecedor obrigatório.");
  }

  if (!Number.isFinite(valorTotal) || valorTotal <= 0) {
    throw new Error("Valor total inválido.");
  }

  return {
    id,
    idContrato,
    fornecedorId,
    objeto,
    status,
    valorTotal,
  };
}

export async function criarContrato(formData: FormData) {
  const data = validateContrato(formData);
  const createdId = await CompraService.save(data);

  if (createdId) {
    revalidatePath("/compras");
    revalidatePath(`/compras/${createdId}`);
    redirect(`/compras/${createdId}`);
  }
}

export async function atualizarContrato(id: string, formData: FormData) {
  const data = validateContrato(formData, id);
  await CompraService.save(data);

  revalidatePath("/compras");
  revalidatePath(`/compras/${id}`);
  redirect(`/compras/${id}`);
}
