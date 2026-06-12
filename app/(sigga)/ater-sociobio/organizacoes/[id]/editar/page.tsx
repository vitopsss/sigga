import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { OrganizacaoColetivaIndicadoresForm } from "@/components/ater/organizacao-coletiva-indicadores-form";
import { TecnicosSelector } from "@/components/ater/tecnicos-selector";
import { AterSetupWarning } from "@/components/ater/setup-warning";
import { Header } from "@/components/dashboard/header";
import { atualizarOrganizacaoColetiva } from "@/lib/actions/organizacoes-coletivas";
import { ATER_SETUP_ERROR, isAterMissingTableError } from "@/lib/ater-runtime";
import { ATER_SOCIOBIO_MUNICIPIOS } from "@/lib/constants/ater-sociobio";
import {
  AterSociobioService,
  type OrganizacaoColetivaWithFamilias,
} from "@/lib/services/ater-sociobio.service";

type Params = Promise<{ id: string }>;

const inputClassName =
  "mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100";

const labelClassName = "block";
const atividadeRows = Array.from({ length: 10 }, (_, index) => index);

export const dynamic = "force-dynamic";

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

function formatDateInput(value?: Date | string | null) {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 10);
}

function getAtividadesRows(value: unknown) {
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (!item || typeof item !== "object") return { descricao: "", unidade: "" };
        const record = item as Record<string, unknown>;
        return {
          descricao: typeof record.descricao === "string" ? record.descricao : "",
          unidade: typeof record.unidade === "string" ? record.unidade : "",
        };
      })
      .filter((item) => item.descricao || item.unidade);
  }

  if (!value || typeof value !== "object") return [];

  const record = value as Record<string, unknown>;
  return [
    {
      descricao: typeof record.descricao === "string" ? record.descricao : "",
      unidade: typeof record.unidade === "string" ? record.unidade : "",
    },
  ].filter((item) => item.descricao || item.unidade);
}

export default async function EditarOrganizacaoColetivaPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;

  let organizacao: OrganizacaoColetivaWithFamilias | null = null;
  let error: string | null = null;
  let setupMissing = false;
  let tecnicosAtivos: { id: string; nome: string; cpf: string; conselho: string | null }[] = [];

  try {
    organizacao = await AterSociobioService.getOrganizacaoColetivaById(id);
    if (organizacao) {
      tecnicosAtivos = await AterSociobioService.listTecnicos();
    }
  } catch (e: unknown) {
    if (isAterMissingTableError(e)) {
      setupMissing = true;
    } else {
      console.error(e);
      error = getErrorMessage(e);
    }
  }

  if (error === ATER_SETUP_ERROR || setupMissing) {
    return (
      <div className="min-h-screen bg-zinc-50/50">
        <Header title="Erro de Configuração" />
        <div className="p-6 lg:p-8">
          <div className="mx-auto max-w-5xl">
            <AterSetupWarning />
          </div>
        </div>
      </div>
    );
  }

  if (!organizacao) {
    notFound();
  }

  const atividades = getAtividadesRows(organizacao.atividades);

  const orgTecnicos = [
    { nome: organizacao.agenteAterNome1 ?? null, cpf: organizacao.agenteAterCpf1 ?? null },
    { nome: organizacao.agenteAterNome2 ?? null, cpf: organizacao.agenteAterCpf2 ?? null },
    { nome: organizacao.agenteAterNome3 ?? null, cpf: organizacao.agenteAterCpf3 ?? null },
    { nome: organizacao.agenteAterNome4 ?? null, cpf: organizacao.agenteAterCpf4 ?? null },
  ];

  async function submit(formData: FormData) {
    "use server";

    const result = await atualizarOrganizacaoColetiva(id, formData);
    if (result.data) {
      redirect(`/ater-sociobio/organizacoes/${id}`);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50/50">
      <Header
        title="Editar Cadastro da Organização Social - Sociobiodiversidade"
        description="Campos alinhados ao documento Cadastro da Organização Social - Sociobiodiversidade."
        actions={
          <Link href={`/ater-sociobio/organizacoes/${id}`} className="text-sm font-medium text-slate-500 hover:text-slate-700">
            Voltar para organização
          </Link>
        }
      />

      <div className="p-6 lg:p-8">
        <div className="mx-auto max-w-5xl">
          <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
            <form action={submit} className="space-y-8">
              <section className="rounded-3xl border border-slate-200 bg-slate-50/80 p-6 shadow-sm">
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-slate-900">Entidade executora</h2>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <label className={labelClassName}>
                    <span className="text-sm font-medium text-slate-700">Nome:</span>
                    <input name="entidadeExecutoraNome" type="text" defaultValue={organizacao.entidadeExecutoraNome ?? ""} className={inputClassName} />
                  </label>
                  <label className={labelClassName}>
                    <span className="text-sm font-medium text-slate-700">CNPJ:</span>
                    <input name="entidadeExecutoraCnpj" type="text" defaultValue={organizacao.entidadeExecutoraCnpj ?? ""} className={inputClassName} />
                  </label>
                  <label className={labelClassName}>
                    <span className="text-sm font-medium text-slate-700">Unidade de Serviços/Núcleo Operacional:</span>
                    <input name="unidadeServicos" type="text" defaultValue={organizacao.unidadeServicos ?? ""} className={inputClassName} />
                  </label>
                  <label className={labelClassName}>
                    <span className="text-sm font-medium text-slate-700">Número do instrumento:</span>
                    <input name="numeroInstrumento" type="text" defaultValue={organizacao.numeroInstrumento ?? ""} className={inputClassName} />
                  </label>
                </div>
              </section>

              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-slate-900">Técnicos (Cadastro)</h2>
                </div>

                <TecnicosSelector
                  options={tecnicosAtivos}
                  defaultValues={orgTecnicos}
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
                    <input name="uf" type="text" defaultValue={organizacao.uf ?? "AM"} className={inputClassName} />
                  </label>
                  <label className={labelClassName}>
                    <span className="text-sm font-medium text-slate-700">Município:</span>
                    <select name="municipio" defaultValue={organizacao.municipio ?? ""} className={inputClassName}>
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
                    <input name="dataCadastro" type="date" defaultValue={formatDateInput(organizacao.dataCadastro)} className={inputClassName} />
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
                    <input name="denominacao" type="text" required defaultValue={organizacao.denominacao} className={inputClassName} />
                  </label>
                  <label className={labelClassName}>
                    <span className="text-sm font-medium text-slate-700">Nº famílias (Previsão/Estimativa)</span>
                    <input name="numeroFamilias" type="number" min="0" defaultValue={organizacao.numeroFamilias ?? ""} className={inputClassName} />
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
                            defaultValue={atividades[index]?.descricao ?? ""}
                            className="border-0 border-r border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:bg-emerald-50/40"
                          />
                          <input
                            name="atividadeUnidade"
                            type="text"
                            defaultValue={atividades[index]?.unidade ?? ""}
                            className="border-0 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:bg-emerald-50/40"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              <OrganizacaoColetivaIndicadoresForm defaultValues={organizacao.indicadores ?? undefined} />

              <div className="flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <Link href={`/ater-sociobio/organizacoes/${id}`} className="text-sm font-medium text-slate-500 hover:text-slate-700">
                  Cancelar
                </Link>
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
    </div>
  );
}
