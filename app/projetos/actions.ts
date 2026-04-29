"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ProjetoService, SaveProjetoDTO } from "@/lib/services/projeto.service";

export type ProjetoActionState = {
  errors?: Record<string, string>;
  values?: Record<string, string>;
};

function parseOptionalNumber(value: FormDataEntryValue | null) {
  const parsed = Number(String(value ?? "").trim());
  return Number.isFinite(parsed) ? parsed : undefined;
}

function parseRequiredDate(value: FormDataEntryValue | null) {
  const raw = String(value ?? "").trim();
  return raw ? new Date(`${raw}T00:00:00`) : null;
}

function parseOptionalDate(value: FormDataEntryValue | null) {
  const raw = String(value ?? "").trim();
  return raw ? new Date(`${raw}T00:00:00`) : null;
}

export async function salvarProjeto(
  _prevState: ProjetoActionState,
  formData: FormData,
) {
  const id = String(formData.get("id") ?? "").trim();
  const centroCusto = String(formData.get("centroCusto") ?? "").trim();
  const titulo = String(formData.get("titulo") ?? "").trim();
  const abreviacao = String(formData.get("abreviacao") ?? "").trim();
  const portfolio = String(formData.get("portfolio") ?? "").trim();
  const financiador = String(formData.get("financiador") ?? "").trim();
  const numContrato = String(formData.get("numContrato") ?? "").trim();
  const status = String(formData.get("status") ?? "").trim();
  const vigenciaInicial = parseRequiredDate(formData.get("vigenciaInicial"));
  const vigenciaFinal = parseOptionalDate(formData.get("vigenciaFinal"));
  const ano = parseOptionalNumber(formData.get("ano"));
  const valorTotal = parseOptionalNumber(formData.get("valorTotal"));

  const values = {
    id,
    centroCusto,
    titulo,
    abreviacao,
    portfolio,
    financiador,
    numContrato,
    status,
    vigenciaInicial: String(formData.get("vigenciaInicial") ?? ""),
    vigenciaFinal: String(formData.get("vigenciaFinal") ?? ""),
    ano: String(formData.get("ano") ?? ""),
    valorTotal: String(formData.get("valorTotal") ?? ""),
  };

  const errors: Record<string, string> = {};

  if (!centroCusto) errors.centroCusto = "Informe o centro de custo.";
  if (!titulo) errors.titulo = "Informe o título do projeto.";
  if (!status) errors.status = "Selecione um status.";
  if (!vigenciaInicial) errors.vigenciaInicial = "Informe a vigência inicial.";
  if (valorTotal === undefined) errors.valorTotal = "Informe um valor total válido.";

  if (Object.keys(errors).length > 0) {
    return { errors, values };
  }

  const centroCustoExistente = await ProjetoService.checkCentroCustoExists(centroCusto, id || undefined);

  if (centroCustoExistente) {
    return {
      errors: { centroCusto: "Já existe um projeto com esse centro de custo." },
      values,
    };
  }

  const dto: SaveProjetoDTO = {
    id: id || undefined,
    centroCusto,
    titulo,
    abreviacao: abreviacao || null,
    portfolio: portfolio || null,
    financiador: financiador || null,
    numContrato: numContrato || null,
    ano: ano ?? null,
    valorTotal: Number(valorTotal),
    status,
    vigenciaInicial: vigenciaInicial || new Date(),
    vigenciaFinal: vigenciaFinal || null,
  };

  try {
    await ProjetoService.save(dto);
  } catch (error) {
    console.error("Failed to save projeto:", error);
    return {
      errors: { form: "Não foi possível salvar o projeto. Tente novamente." },
      values,
    };
  }

  revalidatePath("/projetos");
  redirect("/projetos");
}

export async function deleteProjeto(id: string) {
  try {
    await ProjetoService.delete(id);
    revalidatePath("/projetos");
  } catch (error) {
    console.error("Failed to delete projeto:", error);
    throw new Error("Erro ao excluir projeto.");
  }
}
