"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";

export async function deleteCadastro(id: string) {
  await prisma.pessoa.delete({
    where: { id },
  });

  revalidatePath("/cadastros");
}
