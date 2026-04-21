import Link from "next/link";
import { redirect } from "next/navigation";

import { criarTecnico } from "@/lib/actions/tecnicos";

const inputClassName =
  "mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100";

const labelClassName = "block";

export default function NovoTecnicoPage() {
  async function submit(formData: FormData) {
    "use server";

    const result = await criarTecnico(formData);
    if (result.data) {
      redirect("/ater-sociobio/tecnicos");
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.12),_transparent_32%),linear-gradient(180deg,_#f8fafc_0%,_#eefbf5_100%)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <section className="rounded-[2rem] border border-slate-200 bg-white/90 p-6 shadow-[0_24px_80px_-32px_rgba(15,23,42,0.35)] backdrop-blur sm:p-8 lg:p-10">
          <div className="border-b border-slate-200 pb-8">
            <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
              ATER Sociobio
            </span>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Novo técnico
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
              Cadastre um técnico para aparecer na equipe e nos formulários de atendimento.
            </p>
          </div>

          <form action={submit} className="mt-8 space-y-8">
            <section className="rounded-3xl border border-slate-200 bg-slate-50/80 p-6 shadow-sm">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-slate-900">Dados do técnico</h2>
                <p className="mt-1 text-sm text-slate-600">Nome e identificação profissional da equipe de campo.</p>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <label className={labelClassName + " md:col-span-2"}>
                  <span className="text-sm font-medium text-slate-700">Nome completo *</span>
                  <input name="nome" type="text" required className={inputClassName} />
                </label>

                <label className={labelClassName}>
                  <span className="text-sm font-medium text-slate-700">CPF *</span>
                  <input name="cpf" type="text" required className={inputClassName} />
                </label>

                <label className={labelClassName}>
                  <span className="text-sm font-medium text-slate-700">Registro do conselho</span>
                  <input name="registroConselho" type="text" className={inputClassName} />
                </label>

                <label className={labelClassName}>
                  <span className="text-sm font-medium text-slate-700">UF</span>
                  <input name="uf" type="text" maxLength={2} className={inputClassName} />
                </label>

                <label className={labelClassName}>
                  <span className="text-sm font-medium text-slate-700">Status</span>
                  <select name="ativo" defaultValue="true" className={inputClassName}>
                    <option value="true">Ativo</option>
                    <option value="false">Inativo</option>
                  </select>
                </label>
              </div>
            </section>

            <div className="flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-2xl text-sm leading-6 text-slate-500">
                Depois de salvar, o técnico aparece na listagem e no campo de seleção das novas visitas.
              </p>
              <div className="flex gap-3">
                <Link
                  href="/ater-sociobio/tecnicos"
                  className="inline-flex items-center justify-center rounded-2xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Voltar
                </Link>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-100"
                >
                  Salvar técnico
                </button>
              </div>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
