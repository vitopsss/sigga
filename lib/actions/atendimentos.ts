"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";

export async function listarTecnicos() {
  try {
    const data = await prisma.tecnico.findMany({
      where: { ativo: true },
      orderBy: { nome: "asc" },
    });
    return { data, error: null as string | null };
  } catch (error) {
    console.error(error);
    return { data: null, error: "Erro ao listar técnicos." };
  }
}

export async function listarAtendimentos(beneficiariaId?: string) {
  try {
    const data = await prisma.atendimento.findMany({
      where: beneficiariaId ? { beneficiariaId } : undefined,
      include: {
        beneficiaria: {
          include: { cadastro: true },
        },
        tecnicoRef: true,
      },
      orderBy: { data: "desc" },
    });
    return { data, error: null as string | null };
  } catch (error) {
    console.error(error);
    return { data: null, error: "Erro ao listar atendimentos." };
  }
}

export async function buscarAtendimento(id: string) {
  try {
    const data = await prisma.atendimento.findUnique({
      where: { id },
      include: {
        beneficiaria: {
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
    console.error(error);
    return { data: null, error: "Erro ao buscar atendimento." };
  }
}

export async function criarAtendimento(formData: FormData) {
  const beneficiariaId = String(formData.get("beneficiariaId") ?? "").trim();
  const numeroVisita = Number(formData.get("numeroVisita") ?? 0);
  const data = formData.get("data") ? new Date(String(formData.get("data"))) : null;
  const tecnicoId = String(formData.get("tecnicoId") ?? "").trim() || null;
  const tecnico = String(formData.get("tecnico") ?? "").trim() || null;
  const projetoId = String(formData.get("projetoId") ?? "").trim() || null;
  const projetoTitulo = String(formData.get("projetoTitulo") ?? "").trim() || null;
  const statusRelatorio = String(formData.get("statusRelatorio") ?? "PENDENTE").trim() || "PENDENTE";
  const houveAtendimento = formData.get("houveAtendimento") === "true";

  const rawEixo = (key: string) => {
    const tipoAcao = String(formData.get(`eixo_${key}_tipoAcao`) ?? "").trim() || undefined;
    const etapa = String(formData.get(`eixo_${key}_etapa`) ?? "").trim() || undefined;
    const impactosAnteriores = String(formData.get(`eixo_${key}_impactosAnteriores`) ?? "").trim() || undefined;
    const desenvolvimento = String(formData.get(`eixo_${key}_desenvolvimento`) ?? "").trim() || undefined;
    const recomendacoes = String(formData.get(`eixo_${key}_recomendacoes`) ?? "").trim() || undefined;
    return tipoAcao || etapa ? { tipoAcao, etapa, impactosAnteriores, desenvolvimento, recomendacoes } : null;
  };

  const eixoProdutivo = rawEixo("produtivo");
  const eixoSocial = rawEixo("social");
  const eixoAmbiental = rawEixo("ambiental");

  if (!beneficiariaId || !numeroVisita) {
    return { data: null, error: "Beneficiária e número da visita são obrigatórios." };
  }

  try {
    const created = await prisma.atendimento.create({
      data: {
        beneficiariaId,
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
        beneficiaria: { include: { cadastro: true } },
        tecnicoRef: true,
      },
    });

    revalidatePath("/ater-sociobio/atendimentos");
    revalidatePath("/ater-sociobio");

    return { data: created, error: null as string | null };
  } catch (error) {
    console.error(error);
    return { data: null, error: "Não foi possível criar o atendimento." };
  }
}

export async function atualizarAtendimento(id: string, formData: FormData) {
  const data = formData.get("data") ? new Date(String(formData.get("data"))) : undefined;
  const tecnicoId = String(formData.get("tecnicoId") ?? "").trim() || undefined;
  const tecnico = String(formData.get("tecnico") ?? "").trim() || undefined;
  const projetoId = String(formData.get("projetoId") ?? "").trim() || undefined;
  const projetoTitulo = String(formData.get("projetoTitulo") ?? "").trim() || undefined;
  const statusRelatorio = String(formData.get("statusRelatorio") ?? "").trim() || undefined;
  const houveAtendimento = formData.get("houveAtendimento") === "true" ? true : formData.get("houveAtendimento") === "false" ? false : undefined;

  const rawEixo = (key: string) => {
    const tipoAcao = String(formData.get(`eixo_${key}_tipoAcao`) ?? "").trim() || undefined;
    const etapa = String(formData.get(`eixo_${key}_etapa`) ?? "").trim() || undefined;
    const impactosAnteriores = String(formData.get(`eixo_${key}_impactosAnteriores`) ?? "").trim() || undefined;
    const desenvolvimento = String(formData.get(`eixo_${key}_desenvolvimento`) ?? "").trim() || undefined;
    const recomendacoes = String(formData.get(`eixo_${key}_recomendacoes`) ?? "").trim() || undefined;
    if (!tipoAcao && !etapa) return undefined;
    return { tipoAcao, etapa, impactosAnteriores, desenvolvimento, recomendacoes };
  };

  try {
    const updated = await prisma.atendimento.update({
      where: { id },
      data: {
        ...(data !== undefined && { data }),
        ...(tecnicoId !== undefined && { tecnicoId }),
        ...(tecnico !== undefined && { tecnico }),
        ...(projetoId !== undefined && { projetoId }),
        ...(projetoTitulo !== undefined && { projetoTitulo }),
        ...(statusRelatorio !== undefined && { statusRelatorio }),
        ...(houveAtendimento !== undefined && { houveAtendimento }),
        ...(rawEixo("produtivo") !== undefined && { eixoProdutivo: rawEixo("produtivo") }),
        ...(rawEixo("social") !== undefined && { eixoSocial: rawEixo("social") }),
        ...(rawEixo("ambiental") !== undefined && { eixoAmbiental: rawEixo("ambiental") }),
      },
      include: {
        beneficiaria: { include: { cadastro: true } },
        tecnicoRef: true,
      },
    });

    revalidatePath("/ater-sociobio/atendimentos");
    revalidatePath("/ater-sociobio");

    return { data: updated, error: null as string | null };
  } catch (error) {
    console.error(error);
    return { data: null, error: "Não foi possível atualizar o atendimento." };
  }
}
