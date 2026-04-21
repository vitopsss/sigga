import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { AterSetupWarning } from "@/components/ater/setup-warning";
import { atualizarFamilia, buscarFamilia } from "@/lib/actions/familias";
import { ATER_SETUP_ERROR } from "@/lib/ater-runtime";
import {
  ATER_SOCIOBIO_ATIVIDADES_PRODUTIVAS,
  ATER_SOCIOBIO_GRUPOS_INTERESSE,
  ATER_SOCIOBIO_MUNICIPIOS,
  ATER_SOCIOBIO_TERRITORY_NAME,
} from "@/lib/constants/ater-sociobio";

const inputClassName =
  "mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100";

const labelClassName = "block";

export const dynamic = "force-dynamic";

export default async function EditarFamiliaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data: familia, error } = await buscarFamilia(id);

  if (error === ATER_SETUP_ERROR) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-5xl flex-col gap-6">
          <Link href="/ater-sociobio/familias" className="text-sm text-slate-500 hover:text-slate-700">
            Voltar
          </Link>
          <AterSetupWarning />
        </div>
      </div>
    );
  }

  if (!familia) {
    notFound();
  }

  async function submit(formData: FormData) {
    "use server";

    const result = await atualizarFamilia(id, formData);
    if (result.data) {
      redirect(`/ater-sociobio/familias/${id}`);
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.12),_transparent_32%),linear-gradient(180deg,_#f8fafc_0%,_#eefbf5_100%)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <section className="rounded-[2rem] border border-slate-200 bg-white/90 p-6 shadow-[0_24px_80px_-32px_rgba(15,23,42,0.35)] backdrop-blur sm:p-8 lg:p-10">
          <div className="border-b border-slate-200 pb-8">
            <Link href={`/ater-sociobio/familias/${id}`} className="inline-flex text-sm font-medium text-slate-500 hover:text-slate-700">
              Voltar
            </Link>
            <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
              ATER Sociobio
            </span>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Editar família
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
              Atualize os dados de identificação, localização e acompanhamento da família no lote {ATER_SOCIOBIO_TERRITORY_NAME}.
            </p>
          </div>

          <form action={submit} className="mt-8 space-y-8">
            <section className="rounded-3xl border border-slate-200 bg-slate-50/80 p-6 shadow-sm">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-slate-900">Identificação da família</h2>
                <p className="mt-1 text-sm text-slate-600">Nome e dados de identificação da unidade familiar.</p>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <label className={labelClassName + " md:col-span-2"}>
                  <span className="text-sm font-medium text-slate-700">Nome da família *</span>
                  <input name="nomeFamilia" type="text" required defaultValue={familia.nomeFamilia} className={inputClassName} />
                </label>

                <label className={labelClassName}>
                  <span className="text-sm font-medium text-slate-700">Nome do responsável</span>
                  <input name="nomeResponsavel" type="text" defaultValue={familia.nomeResponsavel ?? ""} className={inputClassName} />
                </label>

                <label className={labelClassName}>
                  <span className="text-sm font-medium text-slate-700">Telefone / WhatsApp</span>
                  <input name="telefone" type="text" defaultValue={familia.telefone ?? ""} className={inputClassName} />
                </label>

                <label className={labelClassName}>
                  <span className="text-sm font-medium text-slate-700">Quantidade de membros</span>
                  <input name="quantidadeMembros" type="number" min="1" defaultValue={familia.quantidadeMembros ?? ""} className={inputClassName} />
                </label>

                <label className={labelClassName}>
                  <span className="text-sm font-medium text-slate-700">NIS</span>
                  <input name="nis" type="text" defaultValue={familia.nis ?? ""} className={inputClassName} />
                </label>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-slate-900">Localização e território</h2>
                <p className="mt-1 text-sm text-slate-600">Dados geográficos e de cobertura territorial do lote.</p>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                <label className={labelClassName}>
                  <span className="text-sm font-medium text-slate-700">Município</span>
                  <select name="municipio" defaultValue={familia.municipio ?? ""} className={inputClassName}>
                    <option value="">Selecione o município da FLONA</option>
                    {ATER_SOCIOBIO_MUNICIPIOS.map((municipio) => (
                      <option key={municipio} value={municipio}>
                        {municipio}
                      </option>
                    ))}
                  </select>
                </label>

                <label className={labelClassName}>
                  <span className="text-sm font-medium text-slate-700">Comunidade</span>
                  <input name="comunidade" type="text" defaultValue={familia.comunidade ?? ""} className={inputClassName} />
                </label>

                <label className={labelClassName}>
                  <span className="text-sm font-medium text-slate-700">UFPA</span>
                  <input name="ufpa" type="text" defaultValue={familia.ufpa ?? ""} className={inputClassName} />
                </label>

                <label className={labelClassName}>
                  <span className="text-sm font-medium text-slate-700">Grupo de interesse</span>
                  <input name="grupoInteresse" type="text" list="grupo-interesse-options" defaultValue={familia.grupoInteresse ?? ""} className={inputClassName} />
                </label>

                <label className={labelClassName}>
                  <span className="text-sm font-medium text-slate-700">Código SGA</span>
                  <input name="codigoSGA" type="text" defaultValue={familia.codigoSGA ?? ""} className={inputClassName} />
                </label>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-slate-50/80 p-6 shadow-sm">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-slate-900">Situação e projeto</h2>
                <p className="mt-1 text-sm text-slate-600">Dados operacionais do acompanhamento.</p>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                <label className={labelClassName}>
                  <span className="text-sm font-medium text-slate-700">Status do cadastro</span>
                  <select name="statusCadastro" defaultValue={familia.statusCadastro ?? ""} className={inputClassName}>
                    <option value="">Selecione</option>
                    <option value="ATIVO">Ativo</option>
                    <option value="INATIVO">Inativo</option>
                    <option value="RESERVA">Reserva</option>
                  </select>
                </label>

                <label className={labelClassName}>
                  <span className="text-sm font-medium text-slate-700">Tipo de atendimento</span>
                  <select name="tipoAtendimento" defaultValue={familia.tipoAtendimento ?? ""} className={inputClassName}>
                    <option value="">Selecione</option>
                    <option value="INDIVIDUAL">Individual</option>
                    <option value="COLETIVO">Coletivo</option>
                  </select>
                </label>

                <label className={labelClassName}>
                  <span className="text-sm font-medium text-slate-700">Atividade produtiva</span>
                  <select name="atividadeProdutiva" defaultValue={familia.atividadeProdutiva ?? ""} className={inputClassName}>
                    <option value="">Selecione</option>
                    {ATER_SOCIOBIO_ATIVIDADES_PRODUTIVAS.map((atividade) => (
                      <option key={atividade} value={atividade}>
                        {atividade}
                      </option>
                    ))}
                  </select>
                </label>

                <label className={labelClassName}>
                  <span className="text-sm font-medium text-slate-700">Situação do fomento</span>
                  <select name="situacaoFomento" defaultValue={familia.situacaoFomento ?? ""} className={inputClassName}>
                    <option value="">Selecione</option>
                    <option value="Aprovado">Aprovado</option>
                    <option value="Não aprovado">Não aprovado</option>
                    <option value="Em análise">Em análise</option>
                  </select>
                </label>

                <label className={labelClassName}>
                  <span className="text-sm font-medium text-slate-700">Valor projeto ATER</span>
                  <input name="valorProjetoATER" type="number" step="0.01" defaultValue={familia.valorProjetoATER?.toString() ?? ""} className={inputClassName} />
                </label>

                <label className={labelClassName}>
                  <span className="text-sm font-medium text-slate-700">Valor fomento</span>
                  <input name="valorFomento" type="number" step="0.01" defaultValue={familia.valorFomento?.toString() ?? ""} className={inputClassName} />
                </label>
              </div>
            </section>

            <div className="flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-2xl text-sm leading-6 text-slate-500">
                Depois de salvar, os dados atualizados aparecem no perfil da família e nas listagens do lote {ATER_SOCIOBIO_TERRITORY_NAME}.
              </p>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-100"
              >
                Salvar alterações
              </button>
            </div>
          </form>
          <datalist id="grupo-interesse-options">
            {ATER_SOCIOBIO_GRUPOS_INTERESSE.map((grupo) => (
              <option key={grupo} value={grupo} />
            ))}
          </datalist>
        </section>
      </div>
    </div>
  );
}
