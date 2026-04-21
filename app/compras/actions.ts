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
    throw new Error("ID do contrato obrigatorio.");
  }

  if (!fornecedorId) {
    throw new Error("Fornecedor obrigatorio.");
  }

  if (!Number.isFinite(valorTotal) || valorTotal <= 0) {
    throw new Error("Valor total invalido.");
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

  try {
    const contrato = await prisma.contratoFornecedor.create({ data });
    revalidatePath("/compras");
    revalidatePath(`/compras/${contrato.id}`);
    redirect(`/compras/${contrato.id}`);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      throw new Error("Ja existe um contrato com esse identificador.");
    }

    throw error;
  }
}

export async function atualizarContrato(id: string, formData: FormData) {
  const data = validateContrato(formData);

  try {
    const contrato = await prisma.contratoFornecedor.update({
      where: { id },
      data,
    });

    revalidatePath("/compras");
    revalidatePath(`/compras/${id}`);
    redirect(`/compras/${contrato.id}`);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      throw new Error("Ja existe um contrato com esse identificador.");
    }

    throw error;
  }
}
