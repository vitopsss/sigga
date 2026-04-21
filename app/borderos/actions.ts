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
    throw new Error("Valor invalido.");
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
    throw new Error("Projeto obrigatorio.");
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
      throw new Error("Cada lancamento precisa de NSU, favorecido, valor e vencimento.");
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

    revalidatePath("/borderos");
    revalidatePath("/financeiro");
    redirect(`/borderos/${bordero.id}`);
  } catch (error) {
    console.error("Erro ao salvar bordero:", error);
    throw new Error("Erro ao salvar bordero. Verifique os dados.");
  }
}

export async function atualizarBordero(id: string, formData: FormData): Promise<void> {
  const borderoInput = validarBordero(formData);

  if (!borderoInput.idBordero) {
    throw new Error("ID do bordero obrigatorio.");
  }

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

    revalidatePath("/borderos");
    revalidatePath(`/borderos/${id}`);
    revalidatePath(`/borderos/${id}/editar`);
    revalidatePath("/financeiro");
    redirect(`/borderos/${id}`);
  } catch (error) {
    console.error("Erro ao atualizar bordero:", error);
    throw new Error("Erro ao atualizar bordero. Verifique os dados.");
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
    throw new Error("NSU obrigatorio.");
  }

  if (!favorecidoId) {
    throw new Error("Favorecido obrigatorio.");
  }

  if (!dataVencimento) {
    throw new Error("Data de vencimento obrigatoria.");
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
    console.error("Erro ao adicionar lancamento:", error);
    throw new Error("Erro ao adicionar lancamento.");
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
