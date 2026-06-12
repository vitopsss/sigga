import Link from "next/link";
import { redirect } from "next/navigation";

import { OrganizacaoColetivaIndicadoresForm } from "@/components/ater/organizacao-coletiva-indicadores-form";
import { TecnicosSelector } from "@/components/ater/tecnicos-selector";
import { criarOrganizacaoColetiva } from "@/lib/actions/organizacoes-coletivas";
import { ATER_SOCIOBIO_MUNICIPIOS } from "@/lib/constants/ater-sociobio";
import { AterSociobioService } from "@/lib/services/ater-sociobio.service";

const inputClassName =
  "mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100";

const labelClassName = "block";
const atividadeRows = Array.from({ length: 10 }, (_, index) => index);

export const dynamic = "force-dynamic";

export default async function NovaOrganizacaoColetivaPage() {
  const tecnicosAtivos = await AterSociobioService.listTecnicos();

  async function submit(formData: FormData) {
    "use server";

    const result = await criarOrganizacaoColetiva(formData);
    if (result.data) {
      redirect(`/ater-sociobio/organizacoes/${result.data.id}`);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
          <div className="border-b border-slate-200 pb-8">
            <Link href="/ater-sociobio/organizacoes" className="inline-flex text-sm font-medium text-slate-500 hover:text-slate-700">
              Voltar
            </Link>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Cadastro da Organização Social - Sociobiodiversidade
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
              Cadastro seguindo os campos do documento Cadastro da Organização Social - Sociobiodiversidade.
            </p>
          </div>

          <form action={submit} className="mt-8 space-y-8">
            <section className="rounded-3xl border border-slate-200 bg-slate-50/80 p-6 shadow-sm">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-slate-900">Entidade executora</h2>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <label className={labelClassName}>
                  <span className="text-sm font-medium text-slate-700">Nome:</span>
                  <input name="entidadeExecutoraNome" type="text" className={inputClassName} />
                </label>
                <label className={labelClassName}>
                  <span className="text-sm font-medium text-slate-700">CNPJ:</span>
                  <input name="entidadeExecutoraCnpj" type="text" className={inputClassName} />
                </label>
                <label className={labelClassName}>
                  <span className="text-sm font-medium text-slate-700">Unidade de Serviços/Núcleo Operacional:</span>
                  <input name="unidadeServicos" type="text" className={inputClassName} />
                </label>
                <label className={labelClassName}>
                  <span className="text-sm font-medium text-slate-700">Número do instrumento:</span>
                  <input name="numeroInstrumento" type="text" className={inputClassName} />
                </label>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-slate-900">Técnicos (Cadastro)</h2>
              </div>

              <TecnicosSelector
                options={tecnicosAtivos}
                max={4}
                prefix="agenteAter"
              />
            </section>

            <section className="rounded-3xl border border-slate-200 bg-slate-50/80 p-6 shadow-sm">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-slate-900">Local de realização da atividade</h2>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                <label className={labelClassName}>
                  <span className="text-sm font-medium text-slate-700">UF:</span>
                  <input name="uf" type="text" defaultValue="AM" className={inputClassName} />
                </label>
                <label className={labelClassName}>
                  <span className="text-sm font-medium text-slate-700">Município:</span>
                  <select name="municipio" defaultValue="" className={inputClassName}>
                    <option value="">Selecione</option>
                    {ATER_SOCIOBIO_MUNICIPIOS.map((municipio) => (
                      <option key={municipio} value={municipio}>
                        {municipio}
                      </option>
                    ))}
                  </select>
                </label>
                <label className={labelClassName}>
                  <span className="text-sm font-medium text-slate-700">Data:</span>
                  <input name="dataCadastro" type="date" className={inputClassName} />
                </label>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-slate-900">Características da Organização Social</h2>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <label className={labelClassName + " md:col-span-2"}>
                  <span className="text-sm font-medium text-slate-700">Denominação *</span>
                  <input name="denominacao" type="text" required className={inputClassName} />
                </label>
                <label className={labelClassName}>
                  <span className="text-sm font-medium text-slate-700">Nº famílias</span>
                  <input name="numeroFamilias" type="number" min="0" className={inputClassName} />
                </label>
                <div className="md:col-span-2">
                  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                    <div className="grid grid-cols-[64px_1fr_160px] bg-slate-100 text-sm font-semibold text-slate-700">
                      <div className="border-r border-slate-200 px-4 py-3">Nº</div>
                      <div className="border-r border-slate-200 px-4 py-3">
                        Atividades produtivas / extrativismo / serviços da Organização Social
                      </div>
                      <div className="px-4 py-3">unidade</div>
                    </div>
                    {atividadeRows.map((index) => (
                      <div key={index} className="grid grid-cols-[64px_1fr_160px] border-t border-slate-200">
                        <div className="border-r border-slate-200 px-4 py-3 text-sm text-slate-500">{index + 1}.</div>
                        <input
                          name="atividadeDescricao"
                          type="text"
                          className="border-0 border-r border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:bg-emerald-50/40"
                        />
                        <input
                          name="atividadeUnidade"
                          type="text"
                          className="border-0 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:bg-emerald-50/40"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <OrganizacaoColetivaIndicadoresForm />

            <div className="flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-2xl text-sm leading-6 text-slate-500">
                Os rótulos desta tela seguem o documento de Cadastro da Organização Social - Sociobiodiversidade.
              </p>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-100"
              >
                Salvar Organização Social
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
