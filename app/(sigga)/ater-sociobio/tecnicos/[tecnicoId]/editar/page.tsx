import { notFound, redirect } from "next/navigation";

import { AterSetupWarning } from "@/components/ater/setup-warning";
import { atualizarTecnico, buscarTecnico } from "@/lib/actions/tecnicos";
import { Header } from "@/components/dashboard/header";
import { ATER_SETUP_ERROR } from "@/lib/ater-runtime";

const inputClassName =
  "mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100";

const labelClassName = "block";

export const dynamic = "force-dynamic";

export default async function EditarTecnicoPage({
  params,
}: {
  params: Promise<{ tecnicoId: string }>;
}) {
  const { tecnicoId } = await params;
  const { data: tecnico, error } = await buscarTecnico(tecnicoId);

  if (error === ATER_SETUP_ERROR) {
    return (
      <div className="min-h-screen bg-zinc-50/50">
        <Header title="Erro de Configuração" />
        <div className="p-6 lg:p-8">
          <div className="mx-auto max-w-4xl">
            <AterSetupWarning />
          </div>
        </div>
      </div>
    );
  }

  if (!tecnico) {
    notFound();
  }

  async function submit(formData: FormData) {
    "use server";

    const result = await atualizarTecnico(tecnicoId, formData);
    if (result.data) {
      redirect("/ater-sociobio/tecnicos");
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50/50">
      <Header
        title="Editar técnico"
        description="Atualize os dados do técnico para refletir o cadastro operacional atual."
      />

      <div className="p-6 lg:p-8">
        <div className="mx-auto max-w-4xl">
          <section className="rounded-[2rem] border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur sm:p-8 lg:p-10">
            <form action={submit} className="space-y-8">
              <section className="rounded-3xl border border-slate-200 bg-slate-50/80 p-6 shadow-sm">
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-slate-900">Dados do técnico</h2>
                  <p className="mt-1 text-sm text-slate-600">Edite nome, identificação profissional e status da equipe de campo.</p>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <label className={labelClassName + " md:col-span-2"}>
                    <span className="text-sm font-medium text-slate-700">Nome completo *</span>
                    <input name="nome" type="text" required defaultValue={tecnico.nome} className={inputClassName} />
                  </label>

                  <label className={labelClassName}>
                    <span className="text-sm font-medium text-slate-700">CPF *</span>
                    <input name="cpf" type="text" required defaultValue={tecnico.cpf} className={inputClassName} />
                  </label>

                  <label className={labelClassName}>
                    <span className="text-sm font-medium text-slate-700">Registro do conselho</span>
                    <input name="registroConselho" type="text" defaultValue={tecnico.registroConselho ?? ""} className={inputClassName} />
                  </label>

                  <label className={labelClassName}>
                    <span className="text-sm font-medium text-slate-700">UF</span>
                    <input name="uf" type="text" maxLength={2} defaultValue={tecnico.uf ?? ""} className={inputClassName} />
                  </label>

                  <label className={labelClassName}>
                    <span className="text-sm font-medium text-slate-700">Status</span>
                    <select name="ativo" defaultValue={String(tecnico.ativo)} className={inputClassName}>
                      <option value="true">Ativo</option>
                      <option value="false">Inativo</option>
                    </select>
                  </label>
                </div>
              </section>

              <div className="flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="max-w-2xl text-sm leading-6 text-slate-500">
                  As alterações afetam a listagem da equipe e a seleção de técnicos nas novas visitas.
                </p>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-100"
                  >
                    Salvar alterações
                  </button>
                </div>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
