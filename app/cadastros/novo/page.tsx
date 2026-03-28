import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";

import { bancoOptions, estadoOptions, tipoOptions } from "../form-options";
import { CadastroForm } from "./cadastro-form";

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
    tipo: "PF",
    banco: "001 - BCO DO BRASIL S.A.",
    estado: "AM",
  },
};

export default function NovoCadastroPage() {
  async function saveCadastro(
    _prevState: FormState,
    formData: FormData,
  ): Promise<FormState> {
    "use server";

    const id = String(formData.get("id") ?? "").trim();
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
      id,
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
      errors.tipo = "Selecione um tipo de cadastro valido.";
    }

    if (!documento) {
      errors.documento = "Informe o CPF ou CNPJ.";
    }

    if (!nome) {
      errors.nome = "Informe o nome ou razao social.";
    }

    if (!bancoOptions.includes(banco as (typeof bancoOptions)[number])) {
      errors.banco = "Selecione um banco valido.";
    }

    if (!estadoOptions.includes(estado as (typeof estadoOptions)[number])) {
      errors.estado = "Selecione um estado valido.";
    }

    if (Object.keys(errors).length > 0) {
      return { errors, values };
    }

    const documentoExistente = await prisma.cadastroUnico.findFirst({
      where: {
        documento,
        ...(id
          ? {
              NOT: {
                id,
              },
            }
          : {}),
      },
      select: { id: true },
    });

    if (documentoExistente) {
      return {
        errors: {
          documento: "Ja existe um cadastro com este documento.",
        },
        values,
      };
    }

    const data = {
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
      if (id) {
        await prisma.cadastroUnico.update({
          where: { id },
          data,
        });
      } else {
        await prisma.cadastroUnico.create({
          data,
        });
      }
    } catch {
      return {
        errors: {
          form: "Nao foi possivel salvar o registro. Tente novamente.",
        },
        values,
      };
    }

    redirect("/cadastros");
  }

  return (
    <div className="bg-[radial-gradient(circle_at_top_right,_rgba(20,184,166,0.16),_transparent_34%)]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-8 lg:px-10 lg:py-10">
        <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-[0_20px_80px_-30px_rgba(15,23,42,0.35)] backdrop-blur xl:p-10">
          <div>
            <span className="inline-flex items-center rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-teal-700">
              Novo Registro
            </span>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              Tela de cadastro unificado
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-600 sm:text-lg">
              Preencha os dados basicos e bancarios para criar um novo registro no sistema.
            </p>
          </div>
        </section>

        <CadastroForm
          action={saveCadastro}
          initialState={initialState}
          tipoOptions={tipoOptions}
          bancoOptions={bancoOptions}
          estadoOptions={estadoOptions}
        />
      </div>
    </div>
  );
}
