'use server'

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";

function getTextField(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function formatarEixo(prefixo: string, formData: FormData) {
  const tipoAcao = getTextField(formData, `${prefixo}_tipoAcao`);
  const etapa = getTextField(formData, `${prefixo}_etapa`);
  const impactosAnt = getTextField(formData, `${prefixo}_impactosAnt`);
  const desenvolvimento = getTextField(formData, `${prefixo}_desenvolvimento`);
  const recomendacoes = getTextField(formData, `${prefixo}_recomendacoes`);

  return {
    tipoAcao,
    impacto: [
      `Tipo de Ação: ${tipoAcao}`,
      `Etapa: ${etapa}`,
      `Impactos: ${impactosAnt}`,
      `Desenvolvimento / Situações observadas: ${desenvolvimento}`,
      `Recomendações / Encaminhamentos: ${recomendacoes}`,
    ].join("\n"),
  };
}

async function gerarIdTec() {
  for (let tentativa = 0; tentativa < 10; tentativa += 1) {
    const codigo = `AT-${Math.floor(1000 + Math.random() * 9000)}`;
    const existente = await prisma.atendimentoTecnico.findUnique({
      where: { idTec: codigo },
      select: { id: true },
    });

    if (!existente) {
      return codigo;
    }
  }

  throw new Error("Nao foi possivel gerar um identificador unico para o atendimento.");
}

export async function salvarAtendimento(formData: FormData) {
  const beneficiariaId = getTextField(formData, "beneficiariaId");
  const projetoId = getTextField(formData, "projetoId");
  const tecnico = getTextField(formData, "tecnico");
  const data = getTextField(formData, "data");

  const produtivo = formatarEixo("produtivo", formData);
  const social = formatarEixo("social", formData);
  const ambiental = formatarEixo("ambiental", formData);
  const idTec = await gerarIdTec();

  await prisma.atendimentoTecnico.create({
    data: {
      idTec,
      beneficiariaId,
      projetoId: projetoId || null,
      tecnico,
      data: new Date(`${data}T00:00:00`),
      produtivoAcao: produtivo.tipoAcao || null,
      produtivoImpacto: produtivo.impacto,
      socialAcao: social.tipoAcao || null,
      socialImpacto: social.impacto,
      ambientalAcao: ambiental.tipoAcao || null,
      ambientalImpacto: ambiental.impacto,
    },
  });

  revalidatePath("/monitoramento");
  redirect("/monitoramento");
}
