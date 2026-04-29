'use server'

import { RHService, SaveColaboradorDTO } from "@/lib/services/rh.service";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function salvarColaborador(formData: FormData) {
  try {
    const id = formData.get("id") as string;
    const cadastroId = formData.get("cadastroId") as string;
    const cargo = formData.get("cargo") as string;
    const vinculo = formData.get("vinculo") as string;
    const salarioBase = Number(formData.get("salarioBase"));
    const status = formData.get("status") as string;
    const idRH = formData.get("idRH") as string || `RH-${Math.floor(Math.random() * 10000)}`;

    const dto: SaveColaboradorDTO = {
      id: id || undefined,
      cadastroId,
      idRH,
      cargo,
      vinculo,
      salarioBase,
      status,
    };

    await RHService.save(dto);
  } catch (error) {
    console.error("Failed to save colaborador:", error);
    throw new Error("Erro ao salvar colaborador. Verifique os dados e tente novamente.");
  }

  revalidatePath("/rh");
  redirect("/rh");
}

export async function deletarColaborador(id: string) {
  try {
    await RHService.delete(id);
    revalidatePath("/rh");
  } catch (error) {
    console.error("Failed to delete colaborador:", error);
    throw new Error("Erro ao excluir colaborador.");
  }
}
