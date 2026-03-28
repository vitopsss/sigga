"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";

export async function deleteCadastro(id: string) {
  await prisma.cadastroUnico.delete({
    where: { id },
  });

  revalidatePath("/cadastros");
}
