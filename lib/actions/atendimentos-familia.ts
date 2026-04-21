"use server";

import { revalidatePath } from "next/cache";

import { getAterErrorMessage } from "@/lib/ater-runtime";
import { prisma } from "@/lib/prisma";

export async function listarTecnicos() {
  try {
    const data = await prisma.tecnico.findMany({
      where: { ativo: true },
      orderBy: { nome: "asc" },
    });
    return { data, error: null as string | null };
  } catch (error) {
    return { data: null, error: getAterErrorMessage(error, "Erro ao listar técnicos.") };
  }
}

export async function listarAtendimentosFamilia(familiaId?: string) {
  try {
    const data = await prisma.atendimento.findMany({
      where: familiaId ? { familiaId } : undefined,
      include: {
        familia: {
          include: { cadastro: true },
        },
        tecnicoRef: true,
      },
      orderBy: { data: "desc" },
    });
    return { data, error: null as string | null };
  } catch (error) {
    return { data: null, error: getAterErrorMessage(error, "Erro ao listar atendimentos.") };
  }
}

export async function buscarAtendimento(id: string) {
  try {
    const data = await prisma.atendimento.findUnique({
      where: { id },
      include: {
        familia: {
          include: { cadastro: true },
        },
        tecnicoRef: true,
      },
    });
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
    const tipoAcao = getText(formData.get(`eixo_${key}_tipoAcao`)) || undefined;
    const etapa = getText(formData.get(`eixo_${key}_etapa`)) || undefined;
    const impactosAnteriores = getText(formData.get(`eixo_${key}_impactosAnteriores`)) || undefined;
    const desenvolvimento = getText(formData.get(`eixo_${key}_desenvolvimento`)) || undefined;
    const recomendacoes = getText(formData.get(`eixo_${key}_recomendacoes`)) || undefined;
    return tipoAcao || etapa || impactosAnteriores || desenvolvimento || recomendacoes
      ? { tipoAcao, etapa, impactosAnteriores, desenvolvimento, recomendacoes }
      : null;
  };

  const eixoProdutivo = rawEixo("produtivo");
  const eixoSocial = rawEixo("social");
  const eixoAmbiental = rawEixo("ambiental");

  if (!familiaId || !numeroVisita) {
    return { data: null, error: "Família e número da visita são obrigatórios." };
  }

  if (!tecnico && !tecnicoId) {
    return { data: null, error: "Nome do técnico obrigatório." };
  }

  try {
    const created = await prisma.atendimento.create({
      data: {
        familiaId,
        numeroVisita,
        data,
        tecnicoId,
        tecnico,
        projetoId,
        projetoTitulo,
        statusRelatorio,
        houveAtendimento,
        eixoProdutivo: eixoProdutivo ?? undefined,
        eixoSocial: eixoSocial ?? undefined,
        eixoAmbiental: eixoAmbiental ?? undefined,
      },
      include: {
        familia: { include: { cadastro: true } },
        tecnicoRef: true,
      },
    });

    revalidatePath("/ater-sociobio/atendimentos");
    revalidatePath("/ater-sociobio/familias");
    revalidatePath("/ater-sociobio");

    return { data: created, error: null as string | null };
  } catch (error) {
    return { data: null, error: getAterErrorMessage(error, "Não foi possível criar o atendimento.") };
  }
}

export async function atualizarAtendimentoFamilia(id: string, formData: FormData) {
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
    const tipoAcao = getText(formData.get(`eixo_${key}_tipoAcao`)) || undefined;
    const etapa = getText(formData.get(`eixo_${key}_etapa`)) || undefined;
    const impactosAnteriores = getText(formData.get(`eixo_${key}_impactosAnteriores`)) || undefined;
    const desenvolvimento = getText(formData.get(`eixo_${key}_desenvolvimento`)) || undefined;
    const recomendacoes = getText(formData.get(`eixo_${key}_recomendacoes`)) || undefined;
    return tipoAcao || etapa || impactosAnteriores || desenvolvimento || recomendacoes
      ? { tipoAcao, etapa, impactosAnteriores, desenvolvimento, recomendacoes }
      : null;
  };

  const eixoProdutivo = rawEixo("produtivo");
  const eixoSocial = rawEixo("social");
  const eixoAmbiental = rawEixo("ambiental");

  if (!familiaId || !numeroVisita) {
    return { data: null, error: "Família e número da visita são obrigatórios." };
  }

  if (!tecnico && !tecnicoId) {
    return { data: null, error: "Nome do técnico obrigatório." };
  }

  try {
    const updated = await prisma.atendimento.update({
      where: { id },
      data: {
        familiaId,
        numeroVisita,
        data,
        tecnicoId,
        tecnico,
        projetoId,
        projetoTitulo,
        statusRelatorio,
        houveAtendimento,
        eixoProdutivo: eixoProdutivo ?? undefined,
        eixoSocial: eixoSocial ?? undefined,
        eixoAmbiental: eixoAmbiental ?? undefined,
      },
      include: {
        familia: { include: { cadastro: true } },
        tecnicoRef: true,
      },
    });

    revalidatePath("/ater-sociobio/atendimentos");
    revalidatePath(`/ater-sociobio/atendimentos/${id}`);
    revalidatePath("/ater-sociobio/familias");
    revalidatePath("/ater-sociobio");

    return { data: updated, error: null as string | null };
  } catch (error) {
    return { data: null, error: getAterErrorMessage(error, "Não foi possível atualizar o atendimento.") };
  }
}
