"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { BorderoService, BorderoInputDTO, LancamentoInputDTO } from "@/lib/services/bordero.service";

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

export async function getProximoIdBordero(): Promise<string> {
  return BorderoService.gerarProximoIdBordero();
}

function validarBordero(formData: FormData): BorderoInputDTO {
  let idBordero = getText(formData.get("idBordero"));
  const projetoId = getText(formData.get("projetoId"));
  const tipoBordero = getText(formData.get("tipoBordero"));
  const dataStr = getText(formData.get("data"));

  if (!projetoId) {
    throw new Error("Projeto obrigatório.");
  }

  return {
    idBordero: idBordero || "",
    projetoId,
    tipoBordero: tipoBordero || null,
    data: dataStr ? new Date(dataStr) : new Date(),
  };
}

function readLancamentosFromForm(formData: FormData): LancamentoInputDTO[] {
  const numLancamentos = Number(formData.get("numLancamentos") ?? 0);
  const lancamentos: LancamentoInputDTO[] = [];

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
    borderoInput.idBordero = await BorderoService.gerarProximoIdBordero();
  }

  const createdId = await BorderoService.create(borderoInput, lancamentos);

  revalidatePath("/borderos");
  revalidatePath("/financeiro");
  redirect(`/borderos/${createdId}`);
}

export async function atualizarBordero(id: string, formData: FormData): Promise<void> {
  const borderoInput = validarBordero(formData);

  if (!borderoInput.idBordero) {
    throw new Error("ID do borderô obrigatório.");
  }

  await BorderoService.update(id, borderoInput);

  revalidatePath("/borderos");
  revalidatePath(`/borderos/${id}`);
  revalidatePath(`/borderos/${id}/editar`);
  revalidatePath("/financeiro");
  redirect(`/borderos/${id}`);
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

  const lancamentoInput: LancamentoInputDTO = {
    nsu,
    favorecidoId,
    fase,
    etapa,
    valor,
    dataVencimento,
    formaPagamento,
  };

  await BorderoService.adicionarLancamento(borderoId, lancamentoInput);

  revalidatePath("/borderos");
  revalidatePath(`/borderos/${borderoId}`);
  revalidatePath(`/borderos/${borderoId}/editar`);
  revalidatePath("/financeiro");
}

export async function removerLancamento(borderoId: string, lancamentoId: string) {
  await BorderoService.removerLancamento(borderoId, lancamentoId);

  revalidatePath("/borderos");
  revalidatePath(`/borderos/${borderoId}`);
  revalidatePath(`/borderos/${borderoId}/editar`);
  revalidatePath("/financeiro");
}
