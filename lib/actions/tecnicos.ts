"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { getAterErrorMessage } from "@/lib/ater-runtime";
import { prisma } from "@/lib/prisma";

function getText(value: FormDataEntryValue | null) {
  return String(value ?? "").trim();
}

export async function criarTecnico(formData: FormData) {
  const nome = getText(formData.get("nome"));
  const cpf = getText(formData.get("cpf"));
  const registroConselho = getText(formData.get("registroConselho")) || null;
  const uf = getText(formData.get("uf")) || null;
  const ativo = formData.get("ativo") === "true";

  if (!nome) {
    return { data: null, error: "Nome do técnico obrigatório." };
  }

  if (!cpf) {
    return { data: null, error: "CPF do técnico obrigatório." };
  }

  try {
    const data = await prisma.tecnico.create({
      data: {
        nome,
        cpf,
        registroConselho,
        uf,
        ativo,
      },
    });

    revalidatePath("/ater-sociobio/tecnicos");
    revalidatePath("/ater-sociobio/tecnicos/novo");
    revalidatePath("/ater-sociobio/extensionistas");
    revalidatePath("/ater-sociobio/extensionistas/novo");
    revalidatePath("/ater-sociobio/atendimentos/nova");

    return { data, error: null as string | null };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { data: null, error: "Já existe um técnico cadastrado com esse CPF." };
    }

    return { data: null, error: getAterErrorMessage(error, "Não foi possível criar o técnico.") };
  }
}

export async function buscarTecnico(id: string) {
  try {
    const data = await prisma.tecnico.findUnique({
      where: { id },
    });

    return {
      data,
      error: data ? null : "Técnico não encontrado.",
    };
  } catch (error) {
    return { data: null, error: getAterErrorMessage(error, "Erro ao buscar técnico.") };
  }
}

export async function atualizarTecnico(id: string, formData: FormData) {
  const nome = getText(formData.get("nome"));
  const cpf = getText(formData.get("cpf"));
  const registroConselho = getText(formData.get("registroConselho")) || null;
  const uf = getText(formData.get("uf")) || null;
  const ativo = formData.get("ativo") === "true";

  if (!nome) {
    return { data: null, error: "Nome do técnico obrigatório." };
  }

  if (!cpf) {
    return { data: null, error: "CPF do técnico obrigatório." };
  }

  try {
    const data = await prisma.tecnico.update({
      where: { id },
      data: {
        nome,
        cpf,
        registroConselho,
        uf,
        ativo,
      },
    });

    revalidatePath("/ater-sociobio/tecnicos");
    revalidatePath(`/ater-sociobio/tecnicos/${id}/editar`);
    revalidatePath("/ater-sociobio/extensionistas");
    revalidatePath(`/ater-sociobio/extensionistas/${id}/editar`);
    revalidatePath("/ater-sociobio/atendimentos/nova");

    return { data, error: null as string | null };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { data: null, error: "Já existe um técnico cadastrado com esse CPF." };
    }

    return { data: null, error: getAterErrorMessage(error, "Não foi possível atualizar o técnico.") };
  }
}
