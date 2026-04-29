"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";

function getText(value: FormDataEntryValue | null) {
  return String(value ?? "").trim();
}

function parseValor(formData: FormData) {
  return Number(formData.get("valorTotal") ?? 0);
}

function validateContrato(formData: FormData) {
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
    idContrato,
    fornecedorId,
    objeto,
    status,
    valorTotal,
  };
}

export async function criarContrato(formData: FormData) {
  const data = validateContrato(formData);
  let createdId: string | undefined;

  try {
    const contrato = await prisma.contratoFornecedor.create({ data });
    createdId = contrato.id;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      throw new Error("Já existe um contrato com esse identificador.");
    }

    throw error;
  }

  if (createdId) {
    revalidatePath("/compras");
    revalidatePath(`/compras/${createdId}`);
    redirect(`/compras/${createdId}`);
  }
}

export async function atualizarContrato(id: string, formData: FormData) {
  const data = validateContrato(formData);
  let success = false;

  try {
    await prisma.contratoFornecedor.update({
      where: { id },
      data,
    });
    success = true;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      throw new Error("Já existe um contrato com esse identificador.");
    }

    throw error;
  }

  if (success) {
    revalidatePath("/compras");
    revalidatePath(`/compras/${id}`);
    redirect(`/compras/${id}`);
  }
}
