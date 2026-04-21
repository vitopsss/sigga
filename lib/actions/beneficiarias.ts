"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { TipoCadastro } from "@prisma/client";

function getText(value: FormDataEntryValue | null) {
  return String(value ?? "").trim();
}

export async function listarBeneficiarias(filtros?: {
  municipio?: string;
  comunidade?: string;
  possuiNis?: boolean;
}) {
  const data = await prisma.beneficiaria.findMany({
    where: {
      municipio: filtros?.municipio ? { equals: filtros.municipio, mode: "insensitive" } : undefined,
      comunidade: filtros?.comunidade ? { equals: filtros.comunidade, mode: "insensitive" } : undefined,
      nis: filtros?.possuiNis ? { not: null } : undefined,
    },
    include: {
      cadastro: true,
    },
    orderBy: [{ municipio: "asc" }, { cadastro: { nome: "asc" } }],
  });

  return { data, error: null as string | null };
}

export async function buscarBeneficiaria(id: string) {
  const data = await prisma.beneficiaria.findUnique({
    where: { id },
    include: {
      cadastro: true,
    },
  });

  return {
    data,
    error: data ? null : "Beneficiária não encontrada.",
  };
}

export async function criarBeneficiaria(formData: FormData) {
  const nome = getText(formData.get("nome"));
  const documento = getText(formData.get("documento"));
  const telefone = getText(formData.get("telefone"));
  const municipio = getText(formData.get("municipio"));
  const comunidade = getText(formData.get("comunidade"));
  const ufpa = getText(formData.get("ufpa"));
  const nis = getText(formData.get("nis"));
  const codigoSGA = getText(formData.get("codigoSGA"));

  try {
    const created = await prisma.cadastroUnico.create({
      data: {
        tipo: TipoCadastro.PF,
        documento,
        nome,
        telefone: telefone || null,
        beneficiaria: {
          create: {
            municipio: municipio || null,
            comunidade: comunidade || null,
            ufpa: ufpa || null,
            nis: nis || null,
            codigoSGA: codigoSGA || null,
          },
        },
      },
      include: {
        beneficiaria: true,
      },
    });

    revalidatePath("/cadastros");
    revalidatePath("/ater-sociobio");
    revalidatePath("/ater-sociobio/familias");

    return {
      data: created.beneficiaria,
      error: null as string | null,
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      error: "Não foi possível criar a beneficiária integrada ao Cadastro Único.",
    };
  }
}
