"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";

function getText(value: FormDataEntryValue | null) {
  return String(value ?? "").trim();
}

function parseOptionalDate(value: string) {
  return value ? new Date(value) : null;
}

function parseRequiredAmount(value: FormDataEntryValue | null) {
  const amount = Number(value ?? 0);
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Valor inválido.");
  }
  return amount;
}

async function gerarProximoIdBordero(): Promise<string> {
  const ultimo = await prisma.bordero.findFirst({
    where: {
      idBordero: { startsWith: "BOR" },
    },
    orderBy: { idBordero: "desc" },
    select: { idBordero: true },
  });

  if (!ultimo) return "BOR000001";

  const numStr = ultimo.idBordero.replace(/\D/g, "");
  const nextNum = parseInt(numStr, 10) + 1;
  return `BOR${String(nextNum).padStart(6, "0")}`;
}

export async function getProximoIdBordero(): Promise<string> {
  return gerarProximoIdBordero();
}

type PrismaExecutor = Prisma.TransactionClient | typeof prisma;

export async function sincronizarStatusBordero(borderoId: string, executor: PrismaExecutor = prisma) {
  const lancamentos = await executor.lancamentoFinanceiro.findMany({
    where: { borderoId },
    select: {
      conciliado: true,
      autorizado: true,
      dataPagamento: true,
    },
  });

  let status = "Pendente";

  if (lancamentos.length > 0 && lancamentos.every((lancamento) => lancamento.conciliado)) {
    status = "Conciliado";
  } else if (
    lancamentos.some(
      (lancamento) => lancamento.conciliado || lancamento.autorizado || lancamento.dataPagamento !== null
    )
  ) {
    status = "Em processamento";
  }

  await executor.bordero.update({
    where: { id: borderoId },
    data: { status },
  });

  return status;
}

function validarBordero(formData: FormData) {
  let idBordero = getText(formData.get("idBordero"));
  const projetoId = getText(formData.get("projetoId"));
  const tipoBordero = getText(formData.get("tipoBordero"));
  const dataStr = getText(formData.get("data"));

  if (!projetoId) {
    throw new Error("Projeto obrigatório.");
  }

  if (!idBordero) {
    idBordero = "";
  }

  return {
    idBordero,
    projetoId,
    tipoBordero: tipoBordero || null,
    data: dataStr ? new Date(dataStr) : new Date(),
  };
}

function readLancamentosFromForm(formData: FormData) {
  const numLancamentos = Number(formData.get("numLancamentos") ?? 0);
  const lancamentos: Array<{
    nsu: string;
    favorecidoId: string;
    fase: string | null;
    etapa: string | null;
    valor: number;
    dataVencimento: Date;
    formaPagamento: string | null;
  }> = [];

  for (let i = 0; i < numLancamentos; i++) {
    const nsu = getText(formData.get(`lancamento_${i}_nsu`));
    const favorecidoId = getText(formData.get(`lancamento_${i}_favorecido`));
    const fase = getText(formData.get(`lancamento_${i}_fase`)) || null;
    const etapa = getText(formData.get(`lancamento_${i}_etapa`)) || null;
    const valorRaw = Number(formData.get(`lancamento_${i}_valor`) ?? 0);
    const dataVencimentoStr = getText(formData.get(`lancamento_${i}_dataVencimento`));
    const formaPagamento = getText(formData.get(`lancamento_${i}_formaPagamento`)) || null;

    if (!nsu && !favorecidoId && !dataVencimentoStr && valorRaw <= 0) {
      continue;
    }

    if (!nsu || !favorecidoId || !dataVencimentoStr || !Number.isFinite(valorRaw) || valorRaw <= 0) {
      throw new Error("Cada lançamento precisa de NSU, favorecido, valor e vencimento.");
    }

    lancamentos.push({
      nsu,
      favorecidoId,
      fase,
      etapa,
      valor: valorRaw,
      dataVencimento: new Date(dataVencimentoStr),
      formaPagamento,
    });
  }

  return lancamentos;
}

export async function salvarBordero(formData: FormData): Promise<void> {
  const borderoInput = validarBordero(formData);
  const lancamentos = readLancamentosFromForm(formData);

  if (!borderoInput.idBordero) {
    borderoInput.idBordero = await gerarProximoIdBordero();
  }

  let createdId: string | undefined;

  try {
    const bordero = await prisma.$transaction(async (tx) => {
      const created = await tx.bordero.create({
        data: {
          idBordero: borderoInput.idBordero,
          projetoId: borderoInput.projetoId,
          tipoBordero: borderoInput.tipoBordero,
          data: borderoInput.data,
          status: "Pendente",
        },
      });

      for (const lancamento of lancamentos) {
        await tx.lancamentoFinanceiro.create({
          data: {
            nsu: lancamento.nsu,
            borderoId: created.id,
            favorecidoId: lancamento.favorecidoId,
            fase: lancamento.fase,
            etapa: lancamento.etapa,
            valor: lancamento.valor,
            dataVencimento: lancamento.dataVencimento,
            formaPagamento: lancamento.formaPagamento,
            conciliado: false,
          },
        });
      }

      await sincronizarStatusBordero(created.id, tx);
      return created;
    });

    createdId = bordero.id;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        const target = (error.meta?.target as string[]) || [];
        if (target.includes("idBordero")) {
          throw new Error(`O ID de borderô "${borderoInput.idBordero}" já está sendo usado por outro registro.`);
        }
        if (target.includes("nsu")) {
          throw new Error("Um ou mais NSUs informados já estão em uso em outros lançamentos. O NSU deve ser único.");
        }
      }
      if (error.code === "P2003") {
        throw new Error("Erro de referência: Verifique se o Projeto e os Favorecidos selecionados são válidos.");
      }
    }
    console.error("Erro ao salvar borderô:", error);
    throw new Error("Erro ao salvar borderô. Verifique os dados.");
  }

  if (createdId) {
    revalidatePath("/borderos");
    revalidatePath("/financeiro");
    redirect(`/borderos/${createdId}`);
  }
}

export async function atualizarBordero(id: string, formData: FormData): Promise<void> {
  const borderoInput = validarBordero(formData);

  if (!borderoInput.idBordero) {
    throw new Error("ID do borderô obrigatório.");
  }

  let success = false;

  try {
    await prisma.bordero.update({
      where: { id },
      data: {
        idBordero: borderoInput.idBordero,
        projetoId: borderoInput.projetoId,
        tipoBordero: borderoInput.tipoBordero,
        data: borderoInput.data,
      },
    });

    await sincronizarStatusBordero(id);
    success = true;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      const target = (error.meta?.target as string[]) || [];
      if (target.includes("idBordero")) {
        throw new Error(`O ID de borderô "${borderoInput.idBordero}" já está sendo usado por outro registro.`);
      }
    }
    console.error("Erro ao atualizar borderô:", error);
    throw new Error("Erro ao atualizar borderô. Verifique os dados.");
  }

  if (success) {
    revalidatePath("/borderos");
    revalidatePath(`/borderos/${id}`);
    revalidatePath(`/borderos/${id}/editar`);
    revalidatePath("/financeiro");
    redirect(`/borderos/${id}`);
  }
}

export async function adicionarLancamento(borderoId: string, formData: FormData) {
  const nsu = getText(formData.get("nsu"));
  const favorecidoId = getText(formData.get("favorecidoId"));
  const fase = getText(formData.get("fase")) || null;
  const etapa = getText(formData.get("etapa")) || null;
  const formaPagamento = getText(formData.get("formaPagamento")) || null;
  const dataVencimento = parseOptionalDate(getText(formData.get("dataVencimento")));
  const valor = parseRequiredAmount(formData.get("valor"));

  if (!nsu) {
    throw new Error("NSU obrigatório.");
  }

  if (!favorecidoId) {
    throw new Error("Favorecido obrigatório.");
  }

  if (!dataVencimento) {
    throw new Error("Data de vencimento obrigatória.");
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.lancamentoFinanceiro.create({
        data: {
          borderoId,
          nsu,
          favorecidoId,
          fase,
          etapa,
          valor,
          dataVencimento,
          formaPagamento,
          autorizado: false,
          conciliado: false,
        },
      });

      await sincronizarStatusBordero(borderoId, tx);
    });

    revalidatePath("/borderos");
    revalidatePath(`/borderos/${borderoId}`);
    revalidatePath(`/borderos/${borderoId}/editar`);
    revalidatePath("/financeiro");
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      const target = (error.meta?.target as string[]) || [];
      if (target.includes("nsu")) {
        throw new Error(`O NSU "${nsu}" já está sendo usado em outro lançamento.`);
      }
    }
    console.error("Erro ao adicionar lançamento:", error);
    throw new Error("Erro ao adicionar lançamento.");
  }
}

export async function removerLancamento(borderoId: string, lancamentoId: string) {
  await prisma.$transaction(async (tx) => {
    await tx.lancamentoFinanceiro.delete({
      where: { id: lancamentoId },
    });

    await sincronizarStatusBordero(borderoId, tx);
  });

  revalidatePath("/borderos");
  revalidatePath(`/borderos/${borderoId}`);
  revalidatePath(`/borderos/${borderoId}/editar`);
  revalidatePath("/financeiro");
}
