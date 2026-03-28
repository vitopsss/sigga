"use client";

import { useActionState } from "react";

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

type CadastroFormProps = {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  initialState: FormState;
  tipoOptions: ReadonlyArray<{
    value: string;
    label: string;
  }>;
  bancoOptions: ReadonlyArray<string>;
  estadoOptions: ReadonlyArray<string>;
  cadastro?: {
    id: string;
    tipo: string;
    documento: string;
    nome: string;
    email: string | null;
    telefone: string | null;
    endereco: string | null;
    banco: string | null;
    agencia: string | null;
    conta: string | null;
    pix: string | null;
  };
};

function SubmitButton({
  pending,
  isEditing,
}: {
  pending: boolean;
  isEditing: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-12 items-center justify-center rounded-full bg-zinc-950 px-6 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
    >
      {pending ? "Salvando..." : isEditing ? "Salvar Alteracoes" : "Salvar"}
    </button>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="mt-2 text-sm text-rose-600">{message}</p>;
}

export function CadastroForm({
  action,
  initialState,
  tipoOptions,
  bancoOptions,
  estadoOptions,
  cadastro,
}: CadastroFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const isEditing = Boolean(cadastro?.id);

  return (
    <section className="rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-[0_20px_80px_-30px_rgba(15,23,42,0.25)] backdrop-blur sm:p-8">
      <form action={formAction} className="grid gap-8">
        <input
          type="hidden"
          name="id"
          value={state.values?.id ?? cadastro?.id ?? ""}
        />

        <div className="grid gap-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-zinc-950">
              Dados Basicos
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Preencha a identificacao principal e os meios de contato do cadastro.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            <label className="block">
              <span className="text-sm font-medium text-zinc-700">Tipo de Cadastro</span>
              <select
                name="tipo"
                defaultValue={state.values?.tipo ?? cadastro?.tipo ?? "PF"}
                className="mt-2 h-12 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 text-sm text-zinc-950 outline-none transition focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
              >
                {tipoOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <FieldError message={state.errors?.tipo} />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-zinc-700">Documento (CPF/CNPJ)</span>
              <input
                type="text"
                name="documento"
                required
                defaultValue={state.values?.documento ?? cadastro?.documento ?? ""}
                className="mt-2 h-12 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                placeholder="Ex.: 12345678900 ou 12345678000199"
              />
              <FieldError message={state.errors?.documento} />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-zinc-700">Nome / Razao Social</span>
              <input
                type="text"
                name="nome"
                required
                defaultValue={state.values?.nome ?? cadastro?.nome ?? ""}
                className="mt-2 h-12 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                placeholder="Ex.: Maria Silva ou Cooperativa Amazonica"
              />
              <FieldError message={state.errors?.nome} />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-zinc-700">Email</span>
              <input
                type="email"
                name="email"
                defaultValue={state.values?.email ?? cadastro?.email ?? ""}
                className="mt-2 h-12 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                placeholder="email@exemplo.com"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-zinc-700">Telefone</span>
              <input
                type="text"
                name="telefone"
                defaultValue={state.values?.telefone ?? cadastro?.telefone ?? ""}
                className="mt-2 h-12 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                placeholder="(92) 99999-9999"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-zinc-700">Estado</span>
              <select
                name="estado"
                defaultValue={state.values?.estado ?? "AM"}
                className="mt-2 h-12 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 text-sm text-zinc-950 outline-none transition focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
              >
                {estadoOptions.map((estado) => (
                  <option key={estado} value={estado}>
                    {estado}
                  </option>
                ))}
              </select>
              <FieldError message={state.errors?.estado} />
            </label>

            <label className="block md:col-span-2 xl:col-span-3">
              <span className="text-sm font-medium text-zinc-700">Endereco</span>
              <input
                type="text"
                name="endereco"
                defaultValue={state.values?.endereco ?? cadastro?.endereco ?? ""}
                className="mt-2 h-12 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                placeholder="Rua, numero, bairro, cidade e UF"
              />
            </label>
          </div>
        </div>

        <div className="grid gap-4 border-t border-zinc-200 pt-8">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-zinc-950">
              Dados Bancarios
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Preencha as informacoes financeiras quando o cadastro participar do fluxo de pagamentos.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <label className="block md:col-span-2 xl:col-span-4">
              <span className="text-sm font-medium text-zinc-700">Banco</span>
              <select
                name="banco"
                defaultValue={
                  state.values?.banco ??
                  cadastro?.banco ??
                  "001 - BCO DO BRASIL S.A."
                }
                className="mt-2 h-12 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 text-sm text-zinc-950 outline-none transition focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
              >
                {bancoOptions.map((banco) => (
                  <option key={banco} value={banco}>
                    {banco}
                  </option>
                ))}
              </select>
              <FieldError message={state.errors?.banco} />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-zinc-700">Agencia</span>
              <input
                type="text"
                name="agencia"
                defaultValue={state.values?.agencia ?? cadastro?.agencia ?? ""}
                className="mt-2 h-12 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                placeholder="Ex.: 1234-5"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-zinc-700">Conta</span>
              <input
                type="text"
                name="conta"
                defaultValue={state.values?.conta ?? cadastro?.conta ?? ""}
                className="mt-2 h-12 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                placeholder="Ex.: 98765-4"
              />
            </label>

            <label className="block md:col-span-2">
              <span className="text-sm font-medium text-zinc-700">PIX</span>
              <input
                type="text"
                name="pix"
                defaultValue={state.values?.pix ?? cadastro?.pix ?? ""}
                className="mt-2 h-12 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                placeholder="Chave PIX"
              />
            </label>
          </div>
        </div>

        {state.errors?.form ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {state.errors.form}
          </div>
        ) : null}

        <div className="flex flex-col gap-3 border-t border-zinc-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-zinc-500">
            Apos salvar, voce sera redirecionado para a listagem de cadastros.
          </p>
          <SubmitButton pending={pending} isEditing={isEditing} />
        </div>
      </form>
    </section>
  );
}
