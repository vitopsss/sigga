"use server";

import { randomUUID } from "crypto";

import { revalidatePath } from "next/cache";
import { Prisma, TipoCadastro } from "@prisma/client";

import { getAterErrorMessage } from "@/lib/ater-runtime";
import { prisma } from "@/lib/prisma";

function getText(value: FormDataEntryValue | null) {
  return String(value ?? "").trim();
}

export async function listarFamilias(filtros?: {
  municipio?: string;
  comunidade?: string;
  busca?: string;
  sgaIncompleto?: boolean;
}) {
  const where: Prisma.FamiliaAterWhereInput = {};
  const and: Prisma.FamiliaAterWhereInput[] = [];

  if (filtros?.municipio) {
    and.push({ municipio: { equals: filtros.municipio, mode: "insensitive" } });
  }
  if (filtros?.comunidade) {
    and.push({ comunidade: { equals: filtros.comunidade, mode: "insensitive" } });
  }
  if (filtros?.busca) {
    and.push({
      OR: [
        { nomeFamilia: { contains: filtros.busca, mode: "insensitive" } },
        { nomeResponsavel: { contains: filtros.busca, mode: "insensitive" } },
        { nis: { contains: filtros.busca, mode: "insensitive" } },
        { codigoSGA: { contains: filtros.busca, mode: "insensitive" } },
        { municipio: { contains: filtros.busca, mode: "insensitive" } },
        { comunidade: { contains: filtros.busca, mode: "insensitive" } },
      ],
    });
  }
  if (filtros?.sgaIncompleto) {
    and.push({
      OR: [
        { sgaCadastro: false },
        { sgaCadastro: null },
        { sgaRevisao: false },
        { sgaRevisao: null },
      ],
    });
  }

  if (and.length > 0) {
    where.AND = and;
  }

  try {
    const data = await prisma.familiaAter.findMany({
      where,
      include: { cadastro: true },
      orderBy: [{ municipio: "asc" }, { nomeFamilia: "asc" }],
    });

    return { data, error: null as string | null };
  } catch (error) {
    return { data: null, error: getAterErrorMessage(error, "Erro ao listar famílias.") };
  }
}

export async function buscarFamilia(id: string) {
  try {
    const data = await prisma.familiaAter.findUnique({
      where: { id },
      include: { cadastro: true },
    });

    return {
      data,
      error: data ? null : "Família não encontrada.",
    };
  } catch (error) {
    return { data: null, error: getAterErrorMessage(error, "Erro ao buscar família.") };
  }
}

export async function criarFamilia(formData: FormData) {
  const nomeFamilia = getText(formData.get("nomeFamilia"));
  const documento = getText(formData.get("documentoResponsavel"));

  if (!nomeFamilia) {
    return { data: null, error: "Nome da família obrigatório." };
  }

  try {
    const created = await prisma.cadastroUnico.create({
      data: {
        tipo: TipoCadastro.PF,
        documento: documento || `fam-${randomUUID()}`,
        nome: nomeFamilia,
        telefone: getText(formData.get("telefone")) || null,
        familia: {
          create: {
            nomeFamilia,
            nomeResponsavel: getText(formData.get("nomeResponsavel")) || null,
            documentoResponsavel: documento || null,
            telefone: getText(formData.get("telefone")) || null,
            quantidadeMembros: Number(formData.get("quantidadeMembros")) || null,
            municipio: getText(formData.get("municipio")) || null,
            comunidade: getText(formData.get("comunidade")) || null,
            ufpa: getText(formData.get("ufpa")) || null,
            grupoInteresse: getText(formData.get("grupoInteresse")) || null,
            statusCadastro: getText(formData.get("statusCadastro")) || null,
            situacaoProjeto: getText(formData.get("situacaoProjeto")) || null,
            tipoAtendimento: getText(formData.get("tipoAtendimento")) || null,
            atividadeProdutiva: getText(formData.get("atividadeProdutiva")) || null,
            nis: getText(formData.get("nis")) || null,
            codigoSGA: getText(formData.get("codigoSGA")) || null,
            situacaoFomento: getText(formData.get("situacaoFomento")) || null,
            valorProjetoATER: Number(formData.get("valorProjetoATER")) || null,
            valorInvestidoUFPA: Number(formData.get("valorInvestidoUFPA")) || null,
            valorFomento: Number(formData.get("valorFomento")) || null,
          },
        },
      },
      include: { familia: true },
    });

    revalidatePath("/ater-sociobio");
    revalidatePath("/ater-sociobio/familias");

    return { data: created.familia, error: null as string | null };
  } catch (error) {
    return { data: null, error: getAterErrorMessage(error, "Não foi possível criar a família.") };
  }
}

export async function atualizarFamilia(id: string, formData: FormData) {
  const nomeFamilia = getText(formData.get("nomeFamilia"));
  const telefone = getText(formData.get("telefone"));
  const fields = {
    nomeFamilia,
    nomeResponsavel: getText(formData.get("nomeResponsavel")),
    telefone,
    quantidadeMembros: Number(formData.get("quantidadeMembros")) || null,
    municipio: getText(formData.get("municipio")),
    comunidade: getText(formData.get("comunidade")),
    ufpa: getText(formData.get("ufpa")),
    grupoInteresse: getText(formData.get("grupoInteresse")),
    statusCadastro: getText(formData.get("statusCadastro")),
    situacaoProjeto: getText(formData.get("situacaoProjeto")),
    tipoAtendimento: getText(formData.get("tipoAtendimento")),
    atividadeProdutiva: getText(formData.get("atividadeProdutiva")),
    nis: getText(formData.get("nis")),
    codigoSGA: getText(formData.get("codigoSGA")),
    situacaoFomento: getText(formData.get("situacaoFomento")),
    valorProjetoATER: Number(formData.get("valorProjetoATER")) || null,
    valorInvestidoUFPA: Number(formData.get("valorInvestidoUFPA")) || null,
    valorFomento: Number(formData.get("valorFomento")) || null,
    efetividade: getText(formData.get("efetividade")),
    statusSGA: getText(formData.get("statusSGA")),
    sgaCadastro: formData.get("sgaCadastro") === "true",
    sgaRevisao: formData.get("sgaRevisao") === "true",
    sgaIndicador: formData.get("sgaIndicador") === "true",
    sgaFotos: formData.get("sgaFotos") === "true",
  };

  const updateData: Prisma.FamiliaAterUpdateInput = {};
  for (const [key, value] of Object.entries(fields)) {
    if (value !== undefined) {
      (updateData as Record<string, unknown>)[key] = value;
    }
  }

  try {
    const updated = await prisma.$transaction(async (tx) => {
      const familia = await tx.familiaAter.update({
        where: { id },
        data: updateData,
        include: { cadastro: true },
      });

      await tx.cadastroUnico.update({
        where: { id: familia.cadastroId },
        data: {
          nome: nomeFamilia || familia.nomeFamilia,
          telefone: telefone || null,
        },
      });

      return familia;
    });

    revalidatePath("/ater-sociobio/familias");
    revalidatePath(`/ater-sociobio/familias/${id}`);

    return { data: updated, error: null as string | null };
  } catch (error) {
    return { data: null, error: getAterErrorMessage(error, "Não foi possível atualizar a família.") };
  }
}
