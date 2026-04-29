"use server";

import { CadastroService, SaveCadastroDTO } from "@/lib/services/cadastro.service";

type CadastroExternoState = {
  message?: string;
  error?: string;
};

export async function salvarCadastroExterno(
  _prevState: CadastroExternoState,
  formData: FormData,
): Promise<CadastroExternoState> {
  try {
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

    if (!nome || !documento) {
      return { error: "Nome e documento são obrigatórios." };
    }

    const documentoExiste = await CadastroService.checkDocumentoExists(documento);
    if (documentoExiste) {
      return { error: "Este documento já está cadastrado em nossa base." };
    }

    const data: SaveCadastroDTO = {
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
    };

    await CadastroService.save(data);

    return { message: "Cadastro realizado com sucesso!" };
  } catch (error) {
    console.error("Erro no cadastro externo:", error);
    return { error: "Ocorreu um erro ao salvar seu cadastro. Tente novamente mais tarde." };
  }
}
