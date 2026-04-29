import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { AterSetupWarning } from "@/components/ater/setup-warning";
import { atualizarAtendimentoFamilia } from "@/lib/actions/atendimentos-familia";
import { ATER_SETUP_ERROR } from "@/lib/ater-runtime";
import {
  ATER_SOCIOBIO_ETAPAS,
  ATER_SOCIOBIO_PROJETOS_REFERENCIA,
  ATER_SOCIOBIO_TIPOS_ACAO,
} from "@/lib/constants/ater-sociobio";
import { AterSociobioService } from "@/lib/services/ater-sociobio.service";

export const dynamic = "force-dynamic";

const inputClassName =
  "mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100";

export default async function EditarAtendimentoPage({
  params,
}: {
  params: Promise<{ atendimentoId: string }>;
}) {
  const { atendimentoId } = await params;
  
  let atendimento = null;
  let familias: any[] = [];
  let tecnicos: any[] = [];
  let error: string | null = null;
  let setupMissing = false;

  try {
    const [atendRes, familiasRes, tecnicosRes] = await Promise.all([
      AterSociobioService.getAtendimentoById(atendimentoId),
      AterSociobioService.listFamilias({}),
      AterSociobioService.listTecnicos()
    ]);
    atendimento = atendRes;
    familias = familiasRes.familias;
    tecnicos = tecnicosRes;
  } catch (e: any) {
    if (e.message === ATER_SETUP_ERROR) {
      setupMissing = true;
    } else {
      console.error(e);
      error = e.message;
    }
  }

  if (setupMissing) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-5xl flex-col gap-6">
          <Link href="/ater-sociobio/atendimentos" className="text-sm text-slate-500 hover:text-slate-700">
            Voltar
          </Link>
          <AterSetupWarning />
        </div>
      </div>
    );
  }

  if (!atendimento) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-slate-900">Atendimento não encontrado</h2>
          <p className="mt-2 text-sm text-slate-600">Não foi possível localizar o atendimento solicitado.</p>
          <Link href="/ater-sociobio/atendimentos" className="mt-4 inline-block text-sm text-emerald-600 hover:underline">
            Voltar para a listagem
          </Link>
        </div>
      </div>
    );
  }

  async function submit(formData: FormData) {
    "use server";

    const result = await atualizarAtendimentoFamilia(atendimentoId, formData);
    if (result.data) {
      redirect(`/ater-sociobio/atendimentos/${atendimentoId}`);
    }
  }

  const getEixoData = (val: any): Record<string, any> => {
    if (val && typeof val === "object" && !Array.isArray(val)) return val;
    return {};
  };

  const eixoProdutivo = getEixoData(atendimento.eixoProdutivo);
  const eixoSocial = getEixoData(atendimento.eixoSocial);
  const eixoAmbiental = getEixoData(atendimento.eixoAmbiental);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.12),_transparent_32%),linear-gradient(180deg,_#f8fafc_0%,_#eefbf5_100%)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <section className="rounded-[2rem] border border-slate-200 bg-white/90 p-6 shadow-[0_24px_80px_-32px_rgba(15,23,42,0.35)] backdrop-blur sm:p-8 lg:p-10">
          <div className="border-b border-slate-200 pb-8">
            <Link href={`/ater-sociobio/atendimentos/${atendimentoId}`} className="inline-flex text-sm font-medium text-slate-500 hover:text-slate-700">
              Voltar
            </Link>
            <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
              ATER Sociobio
            </span>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Editar atendimento
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
              Atualize os dados da visita, equipe responsável e registros por eixo.
            </p>
          </div>

          <form action={submit} className="mt-8 space-y-8">
            <section className="rounded-3xl border border-slate-200 bg-slate-50/80 p-6 shadow-sm">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-slate-900">Identificação</h2>
                <p className="mt-1 text-sm text-slate-600">Dados obrigatórios do atendimento.</p>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <label className="block md:col-span-2">
                  <span className="text-sm font-medium text-slate-700">Família *</span>
                  <select name="familiaId" required defaultValue={atendimento.familiaId ?? ""} className={inputClassName}>
                    <option value="">Selecione a família</option>
                    {familias.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.nomeFamilia} - {f.municipio ?? "sem município"}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Número da visita *</span>
                  <input name="numeroVisita" type="number" min={1} max={16} required defaultValue={atendimento.numeroVisita} className={inputClassName} />
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Data da visita</span>
                  <input
                    name="data"
                    type="date"
                    defaultValue={atendimento.data ? new Date(atendimento.data).toISOString().slice(0, 10) : ""}
                    className={inputClassName}
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Houve atendimento?</span>
                  <select name="houveAtendimento" defaultValue={String(Boolean(atendimento.houveAtendimento))} className={inputClassName}>
                    <option value="true">Sim</option>
                    <option value="false">Não</option>
                  </select>
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Status do relatório</span>
                  <select name="statusRelatorio" defaultValue={atendimento.statusRelatorio} className={inputClassName}>
                    <option value="PENDENTE">Pendente</option>
                    <option value="RASCUNHO">Rascunho</option>
                    <option value="CONCLUIDO">Concluído</option>
                    <option value="ENVIADO_SGA">Enviado SGA</option>
                  </select>
                </label>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-slate-900">Equipe e projeto</h2>
                <p className="mt-1 text-sm text-slate-600">Informações sobre a visita.</p>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Técnico responsável</span>
                  <select name="tecnicoId" defaultValue={atendimento.tecnicoId ?? ""} className={inputClassName}>
                    <option value="">Outro (informe abaixo)</option>
                    {tecnicos.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.nome}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Nome do técnico</span>
                  <input
                    name="tecnico"
                    type="text"
                    defaultValue={atendimento.tecnico ?? ""}
                    className={inputClassName}
                    placeholder="Preencha se o técnico não estiver listado acima"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-slate-700">ID do projeto</span>
                  <input name="projetoId" type="text" defaultValue={atendimento.projetoId ?? ""} className={inputClassName} />
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Título do projeto</span>
                  <input name="projetoTitulo" type="text" list="projeto-titulo-options" defaultValue={atendimento.projetoTitulo ?? ""} className={inputClassName} />
                </label>
              </div>
            </section>

            {(
              [
                ["produtivo", eixoProdutivo],
                ["social", eixoSocial],
                ["ambiental", eixoAmbiental],
              ] as const
            ).map(([eixo, vals]) => (
              <section key={eixo} className="rounded-3xl border border-slate-200 bg-slate-50/80 p-6 shadow-sm">
                <div className="mb-6">
                  <h2 className="text-lg font-semibold capitalize text-slate-900">Eixo {eixo}</h2>
                  <p className="mt-1 text-sm text-slate-600">Atualize os registros deste eixo.</p>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-medium text-slate-700">Tipo de ação</span>
                    <select name={`eixo_${eixo}_tipoAcao`} defaultValue={vals.tipoAcao ?? ""} className={inputClassName}>
                      <option value="">Selecione</option>
                      {ATER_SOCIOBIO_TIPOS_ACAO[eixo].map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium text-slate-700">Etapa</span>
                    <select name={`eixo_${eixo}_etapa`} defaultValue={vals.etapa ?? ""} className={inputClassName}>
                      <option value="">Selecione</option>
                      {ATER_SOCIOBIO_ETAPAS[eixo].map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block md:col-span-2">
                    <span className="text-sm font-medium text-slate-700">Impactos anteriores</span>
                    <input
                      name={`eixo_${eixo}_impactosAnteriores`}
                      type="text"
                      defaultValue={vals.impactosAnteriores ?? ""}
                      className={inputClassName}
                    />
                  </label>

                  <label className="block md:col-span-2">
                    <span className="text-sm font-medium text-slate-700">Desenvolvimento</span>
                    <textarea name={`eixo_${eixo}_desenvolvimento`} rows={3} defaultValue={vals.desenvolvimento ?? ""} className={inputClassName} />
                  </label>

                  <label className="block md:col-span-2">
                    <span className="text-sm font-medium text-slate-700">Recomendações</span>
                    <textarea name={`eixo_${eixo}_recomendacoes`} rows={2} defaultValue={vals.recomendacoes ?? ""} className={inputClassName} />
                  </label>
                </div>
              </section>
            ))}

            <div className="flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-2xl text-sm leading-6 text-slate-500">
                Depois de salvar, o histórico e o detalhe do atendimento refletem os dados atualizados.
              </p>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-100"
              >
                Salvar alterações
              </button>
            </div>
          </form>
          <datalist id="projeto-titulo-options">
            {ATER_SOCIOBIO_PROJETOS_REFERENCIA.map((projeto) => (
              <option key={projeto} value={projeto} />
            ))}
          </datalist>
        </section>
      </div>
    </div>
  );
}
