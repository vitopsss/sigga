"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { sincronizarStatusBordero } from "@/app/borderos/actions";
import { prisma } from "@/lib/prisma";

function getText(value: FormDataEntryValue | null) {
  return String(value ?? "").trim();
}

function resolveReturnPath(formData: FormData) {
  const returnTo = getText(formData.get("returnTo"));
  return returnTo || "/financeiro";
}

async function revalidateLancamentoFlow(borderoId: string, returnTo: string) {
  await sincronizarStatusBordero(borderoId);
  revalidatePath("/financeiro");
  revalidatePath("/borderos");
  revalidatePath(`/borderos/${borderoId}`);
  redirect(returnTo);
}

export async function autorizarLancamento(id: string, formData: FormData) {
  const returnTo = resolveReturnPath(formData);

  const lancamento = await prisma.lancamentoFinanceiro.update({
    where: { id },
    data: {
      autorizado: true,
    },
    select: {
      borderoId: true,
    },
  });

  await revalidateLancamentoFlow(lancamento.borderoId, returnTo);
}

export async function registrarPagamento(id: string, formData: FormData) {
  const returnTo = resolveReturnPath(formData);
  const dataPagamento = getText(formData.get("dataPagamento"));
  const formaPagamento = getText(formData.get("formaPagamento"));

  if (!dataPagamento) {
    throw new Error("Informe a data de pagamento.");
  }

  const lancamento = await prisma.lancamentoFinanceiro.update({
    where: { id },
    data: {
      autorizado: true,
      dataPagamento: new Date(dataPagamento),
      formaPagamento: formaPagamento || null,
    },
    select: {
      borderoId: true,
    },
  });

  await revalidateLancamentoFlow(lancamento.borderoId, returnTo);
}

export async function conciliarLancamento(id: string, formData: FormData) {
  const returnTo = resolveReturnPath(formData);

  const lancamentoAtual = await prisma.lancamentoFinanceiro.findUnique({
    where: { id },
    select: {
      borderoId: true,
      dataPagamento: true,
      formaPagamento: true,
    },
  });

  if (!lancamentoAtual) {
    throw new Error("Lancamento nao encontrado.");
  }

  const lancamento = await prisma.lancamentoFinanceiro.update({
    where: { id },
    data: {
      autorizado: true,
      conciliado: true,
      dataPagamento: lancamentoAtual.dataPagamento ?? new Date(),
      formaPagamento: lancamentoAtual.formaPagamento ?? "Nao informado",
    },
    select: {
      borderoId: true,
    },
  });

  await revalidateLancamentoFlow(lancamento.borderoId, returnTo);
}
