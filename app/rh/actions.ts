'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function salvarColaborador(formData: FormData) {
  const id = formData.get("id") as string;
  const cadastroId = formData.get("cadastroId") as string;
  const cargo = formData.get("cargo") as string;
  const vinculo = formData.get("vinculo") as string;
  const salarioBase = Number(formData.get("salarioBase"));
  const status = formData.get("status") as string;

  // No seu schema o idRH é obrigatório e único. 
  // Vou gerar um temporário aqui, mas o ideal é o Ademar digitar um.
  const idRH = formData.get("idRH") as string || `RH-${Math.floor(Math.random() * 10000)}`;

  const dados = {
    cadastroId,
    idRH,
    cargo,
    vinculo,
    salarioBase,
    status,
  };

  if (id) {
    await prisma.colaborador.update({ where: { id }, data: dados });
  } else {
    await prisma.colaborador.create({ data: dados });
  }

  revalidatePath("/rh");
  redirect("/rh");
}

export async function deletarColaborador(id: string) {
  await prisma.colaborador.delete({ where: { id } });
  revalidatePath("/rh");
}