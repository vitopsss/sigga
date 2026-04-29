import { notFound, redirect } from "next/navigation";
import { Pencil } from "lucide-react";
import { CadastroService } from "@/lib/services/cadastro.service";
import { bancoOptions, estadoOptions, tipoOptions } from "../../form-options";
import { CadastroForm } from "../../novo/cadastro-form";

type FormState = {
  errors?: {
    tipo?: string;
    documento?: string;
    nome?: string;
    banco?: string;
    estado?: string;
    form?: string;
  };
  values?: {
    id?: string;
    tipo?: string;
    documento?: string;
    nome?: string;
    email?: string;
    telefone?: string;
    endereco?: string;
    banco?: string;
    agencia?: string;
    conta?: string;
    pix?: string;
    estado?: string;
  };
};

const initialState: FormState = {
  errors: {},
  values: {
    banco: "001 - BCO DO BRASIL S.A.",
    estado: "AM",
  },
};

export default async function EditarCadastroPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const cadastro = await CadastroService.getById(id);

  if (!cadastro) {
    notFound();
  }

  async function saveCadastro(
    _prevState: FormState,
    formData: FormData,
  ): Promise<FormState> {
    "use server";

    const formId = String(formData.get("id") ?? "").trim();
    const tipo = String(formData.get("tipo") ?? "").trim();
    const documento = String(formData.get("documento") ?? "").trim();
    const nome = String(formData.get("nome") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const telefone = String(formData.get("telefone") ?? "").trim();
    const endereco = String(formData.get("endereco") ?? "").trim();
    const banco = String(formData.get("banco") ?? "").trim();
    const agencia = String(formData.get("agencia") ?? "").trim();
    const conta = String(formData.get("conta") ?? "").trim();
    const pix = String(formData.get("pix") ?? "").trim();
    const estado = String(formData.get("estado") ?? "").trim();

    const values = {
      id: formId,
      tipo,
      documento,
      nome,
      email,
      telefone,
      endereco,
      banco,
      agencia,
      conta,
      pix,
      estado,
    };

    const errors: NonNullable<FormState["errors"]> = {};

    if (!tipoOptions.some((option) => option.value === tipo)) {
      errors.tipo = "Selecione um tipo de cadastro válido.";
    }

    if (!documento) {
      errors.documento = "Informe o CPF ou CNPJ.";
    }

    if (!nome) {
      errors.nome = "Informe o nome ou razão social.";
    }

    if (!bancoOptions.includes(banco as (typeof bancoOptions)[number])) {
      errors.banco = "Selecione um banco válido.";
    }

    if (!estadoOptions.includes(estado as (typeof estadoOptions)[number])) {
      errors.estado = "Selecione um estado válido.";
    }

    if (Object.keys(errors).length > 0) {
      return { errors, values };
    }

    const documentoExiste = await CadastroService.checkDocumentoExists(documento, formId);

    if (documentoExiste) {
      return {
        errors: {
          documento: "Já existe um cadastro com este documento.",
        },
        values,
      };
    }

    const data = {
      id: formId,
      tipo: tipo as "PF" | "PJ" | "PUBLICO" | "PRIVADO",
      documento,
      nome,
      email: email || null,
      telefone: telefone || null,
      endereco: endereco || null,
      banco: banco || null,
      agencia: agencia || null,
      conta: conta || null,
      pix: pix || null,
    };

    try {
      await CadastroService.save(data);
    } catch {
      return {
        errors: {
          form: "Não foi possível salvar o registro. Tente novamente.",
        },
        values,
      };
    }

    redirect("/cadastros");
  }

  return (
    <div className="bg-[radial-gradient(circle_at_top_right,_rgba(245,158,11,0.12),_transparent_34%)]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-8 lg:px-10 lg:py-10">
        <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-[0_20px_80px_-30px_rgba(15,23,42,0.35)] backdrop-blur xl:p-10">
          <div className="flex items-start gap-4">
            <span className="rounded-2xl bg-amber-50 p-3 text-amber-700">
              <Pencil className="h-5 w-5" strokeWidth={2} />
            </span>
            <div>
              <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-amber-700">
                Editar Registro
              </span>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
                Atualize os dados do cadastro
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-600 sm:text-lg">
                Revise as informações e salve as alterações deste registro.
              </p>
            </div>
          </div>
        </section>

        <CadastroForm
          action={saveCadastro}
          cadastro={cadastro}
          initialState={initialState}
          tipoOptions={tipoOptions}
          bancoOptions={bancoOptions}
          estadoOptions={estadoOptions}
        />
      </div>
    </div>
  );
}
