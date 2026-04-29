"use server";

import { revalidatePath } from "next/cache";
import { CadastroService } from "@/lib/services/cadastro.service";

export async function deleteCadastro(id: string) {
  await CadastroService.delete(id);
  revalidatePath("/cadastros");
}
