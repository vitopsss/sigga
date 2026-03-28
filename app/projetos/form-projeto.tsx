"use client";

import { useActionState } from "react";

type ProjetoFormState = {
  errors?: Record<string, string>;
  values?: Record<string, string>;
};

type FormProjetoProps = {
  action: (
    prevState: ProjetoFormState,
    formData: FormData,
  ) => Promise<ProjetoFormState | void>;
  projeto?: {
    id: string;
    centroCusto: string;
    titulo: string;
    abreviacao: string | null;
    portfolio: string | null;
    financiador: string | null;
    numContrato: string | null;
    ano: number | null;
    valorTotal: string;
    status: string;
    vigenciaInicial: string;
    vigenciaFinal: string | null;
  };
};

const initialState: ProjetoFormState = {
  errors: {},
  values: {},
};

const statusOptions = ["ATIVO", "CONCLUÍDO", "SUSPENSO", "EM ANÁLISE"] as const;

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-2 text-sm text-rose-600">{message}</p>;
}

function SubmitButton({ pending, isEditing }: { pending: boolean; isEditing: boolean }) {
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

export function FormProjeto({ action, projeto }: FormProjetoProps) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const isEditing = Boolean(projeto?.id);

  return (
    <section className="rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-[0_20px_80px_-30px_rgba(15,23,42,0.25)] backdrop-blur sm:p-8">
      <form action={formAction} className="grid gap-8">
        <input type="hidden" name="id" value={state.values?.id ?? projeto?.id ?? ""} />

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <label className="block">
            <span className="text-sm font-medium text-zinc-700">Centro de Custo</span>
            <input type="text" name="centroCusto" required defaultValue={state.values?.centroCusto ?? projeto?.centroCusto ?? ""} className="mt-2 h-12 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 text-sm text-zinc-950 outline-none transition focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10" placeholder="Ex.: 1084" />
            <FieldError message={state.errors?.centroCusto} />
          </label>

          <label className="block md:col-span-2">
            <span className="text-sm font-medium text-zinc-700">Titulo do Projeto</span>
            <input type="text" name="titulo" required defaultValue={state.values?.titulo ?? projeto?.titulo ?? ""} className="mt-2 h-12 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 text-sm text-zinc-950 outline-none transition focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10" placeholder="Ex.: Projeto Quintais Produtivos" />
            <FieldError message={state.errors?.titulo} />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-zinc-700">Abreviacao</span>
            <input type="text" name="abreviacao" defaultValue={state.values?.abreviacao ?? projeto?.abreviacao ?? ""} className="mt-2 h-12 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 text-sm text-zinc-950 outline-none transition focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10" />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-zinc-700">Portfolio</span>
            <input type="text" name="portfolio" defaultValue={state.values?.portfolio ?? projeto?.portfolio ?? ""} className="mt-2 h-12 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 text-sm text-zinc-950 outline-none transition focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10" />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-zinc-700">Financiador</span>
            <input type="text" name="financiador" defaultValue={state.values?.financiador ?? projeto?.financiador ?? ""} className="mt-2 h-12 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 text-sm text-zinc-950 outline-none transition focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10" />
          </label>

          <label className="block md:col-span-2 xl:col-span-1">
            <span className="text-sm font-medium text-zinc-700">Nº do Contrato</span>
            <input type="text" name="numContrato" defaultValue={state.values?.numContrato ?? projeto?.numContrato ?? ""} className="mt-2 h-12 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 text-sm text-zinc-950 outline-none transition focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10" />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-zinc-700">Ano</span>
            <input type="number" name="ano" defaultValue={state.values?.ano ?? String(projeto?.ano ?? "")} className="mt-2 h-12 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 text-sm text-zinc-950 outline-none transition focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10" />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-zinc-700">Valor Total</span>
            <input type="number" step="0.01" name="valorTotal" defaultValue={state.values?.valorTotal ?? projeto?.valorTotal ?? ""} className="mt-2 h-12 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 text-sm text-zinc-950 outline-none transition focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10" />
            <FieldError message={state.errors?.valorTotal} />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-zinc-700">Status</span>
            <select name="status" defaultValue={state.values?.status ?? projeto?.status ?? "ATIVO"} className="mt-2 h-12 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 text-sm text-zinc-950 outline-none transition focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10">
              {statusOptions.map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
            <FieldError message={state.errors?.status} />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-zinc-700">Vigencia Inicial</span>
            <input type="date" name="vigenciaInicial" required defaultValue={state.values?.vigenciaInicial ?? projeto?.vigenciaInicial ?? ""} className="mt-2 h-12 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 text-sm text-zinc-950 outline-none transition focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10" />
            <FieldError message={state.errors?.vigenciaInicial} />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-zinc-700">Vigencia Final</span>
            <input type="date" name="vigenciaFinal" defaultValue={state.values?.vigenciaFinal ?? projeto?.vigenciaFinal ?? ""} className="mt-2 h-12 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 text-sm text-zinc-950 outline-none transition focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10" />
          </label>
        </div>

        {state.errors?.form ? <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{state.errors.form}</div> : null}

        <div className="flex flex-col gap-3 border-t border-zinc-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-zinc-500">Apos salvar, voce sera redirecionado para a listagem de projetos.</p>
          <SubmitButton pending={pending} isEditing={isEditing} />
        </div>
      </form>
    </section>
  );
}
