"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { FinanceiroService } from "@/lib/services/financeiro.service";

function getText(value: FormDataEntryValue | null) {
  return String(value ?? "").trim();
}

function resolveReturnPath(formData: FormData) {
  const returnTo = getText(formData.get("returnTo"));
  return returnTo || "/financeiro";
}

function revalidateAll() {
  revalidatePath("/financeiro");
  revalidatePath("/borderos");
  revalidatePath("/borderos/[id]");
}

export async function autorizarLancamento(id: string, formData: FormData) {
  const returnTo = resolveReturnPath(formData);
  try {
    await FinanceiroService.autorizar(id);
    revalidateAll();
    redirect(returnTo);
  } catch (error) {
    console.error("Failed to authorize lancamento:", error);
    throw new Error("Erro ao autorizar lançamento.");
  }
}

export async function registrarPagamento(id: string, formData: FormData) {
  const returnTo = resolveReturnPath(formData);
  const dataPagamentoStr = getText(formData.get("dataPagamento"));
  const formaPagamento = getText(formData.get("formaPagamento"));

  if (!dataPagamentoStr) {
    throw new Error("Informe a data de pagamento.");
  }

  try {
    await FinanceiroService.registrarPagamento(id, new Date(dataPagamentoStr), formaPagamento);
    revalidateAll();
    redirect(returnTo);
  } catch (error) {
    console.error("Failed to register payment:", error);
    throw new Error("Erro ao registrar pagamento.");
  }
}

export async function conciliarLancamento(id: string, formData: FormData) {
  const returnTo = resolveReturnPath(formData);
  try {
    await FinanceiroService.conciliar(id);
    revalidateAll();
    redirect(returnTo);
  } catch (error) {
    console.error("Failed to conciliate lancamento:", error);
    throw new Error("Erro ao conciliar lançamento.");
  }
}
