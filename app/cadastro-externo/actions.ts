"use server";

import { prisma } from "@/lib/prisma";

type CadastroExternoState = {
  message?: string;
};

export async function salvarCadastroExterno(
  _prevState: CadastroExternoState,
  formData: FormData,
): Promise<CadastroExternoState> {
  const tipo = String(formData.get("tipo") ?? "PF").trim();
  const nome = String(formData.get("nome") ?? "").trim();
  const documento = String(formData.get("documento") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const telefone = String(formData.get("telefone") ?? "").trim();
  const banco = String(formData.get("banco") ?? "").trim();
  const agencia = String(formData.get("agencia") ?? "").trim();
  const conta = String(formData.get("conta") ?? "").trim();
  const pix = String(formData.get("pix") ?? "").trim();
  const estado = String(formData.get("estado") ?? "").trim();

  await prisma.pessoa.create({
    data: {
      tipo: tipo === "PJ" ? "PJ" : "PF",
      nome,
      documento,
      email: email || null,
      telefone: telefone || null,
      banco: banco || null,
      agencia: agencia || null,
      conta: conta || null,
      pix: pix || null,
      endereco: estado ? `UF: ${estado}` : null,
      origemCadastro: "LINK_EXTERNO",
    },
  });

  return { message: "Cadastro realizado com sucesso!" };
}
