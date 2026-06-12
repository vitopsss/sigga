import Link from "next/link";
import { redirect } from "next/navigation";
import { ClipboardList, Users, MapPin } from "lucide-react";

import { AtendimentoDocumento11Fields } from "@/components/ater/atendimento-documento-11-fields";
import { AterSetupWarning } from "@/components/ater/setup-warning";
import { criarAtendimentoFamilia } from "@/lib/actions/atendimentos-familia";
import { ATER_SETUP_ERROR } from "@/lib/ater-runtime";
import {
  ATER_SOCIOBIO_PROJETOS_REFERENCIA,
  ATER_SOCIOBIO_STATUS_RELATORIO,
  ATER_SOCIOBIO_TERRITORY_NAME,
} from "@/lib/constants/ater-sociobio";
import { AterSociobioService, type FamiliaListItem, type TecnicoAtivo } from "@/lib/services/ater-sociobio.service";
import { Header } from "@/components/dashboard/header";
import { Button } from "@/components/ui";

export const dynamic = "force-dynamic";

const inputClassName =
  "mt-2 w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15";

const labelClassName = "block";

type SearchParams = Promise<{ familiaId?: string }>;

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

export default async function NovoAtendimentoPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { familiaId: familiaIdPre } = await searchParams;

  async function submit(formData: FormData) {
    "use server";
    const result = await criarAtendimentoFamilia(formData);
    if (result.data) {
      redirect(`/ater-sociobio/atendimentos/${result.data.id}`);
    }
  }

  let familias: FamiliaListItem[] = [];
  let tecnicos: TecnicoAtivo[] = [];
  let setupMissing = false;

  try {
    const [familiasResult, tecnicosResult] = await Promise.all([
      AterSociobioService.listFamilias({}),
      AterSociobioService.listTecnicos()
    ]);
    familias = familiasResult.familias;
    tecnicos = tecnicosResult;
  } catch (e: unknown) {
    if (getErrorMessage(e) === ATER_SETUP_ERROR) {
      setupMissing = true;
    } else {
      console.error(e);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50/50">
      <Header
        title="Nova visita técnica"
        description={`Registro de atendimento para UFPAs em ${ATER_SOCIOBIO_TERRITORY_NAME}.`}
        actions={
          <Link href="/ater-sociobio/atendimentos">
            <Button variant="secondary" size="sm">Voltar para atendimentos</Button>
          </Link>
        }
      />

      <div className="p-6 lg:p-8">
        <div className="mx-auto max-w-5xl">
          {setupMissing ? (
            <AterSetupWarning />
          ) : (
            <form action={submit} className="space-y-8">
              <section className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
                <div className="mb-8">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-emerald-600" />
                    <h2 className="text-xl font-bold text-zinc-900">Identificação da UFPA</h2>
                  </div>
                  <p className="mt-2 text-sm text-zinc-500 font-medium">Selecione a unidade familiar e informe os dados básicos da visita.</p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <label className="block md:col-span-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">Unidade Familiar (UFPA) *</span>
                    <select name="familiaId" required defaultValue={familiaIdPre ?? ""} className={inputClassName}>
                      <option value="">Selecione pelo nome do responsável ou comunidade...</option>
                      {familias.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.nomeResponsavel || f.nomeFamilia} — {f.comunidade || "Sem comunidade"} ({f.municipio})
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className={labelClassName}>
                    <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">Número da visita *</span>
                    <input name="numeroVisita" type="number" min={1} max={16} required className={inputClassName} placeholder="Ex: 1" />
                  </label>

                  <label className={labelClassName}>
                    <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">Data da visita</span>
                    <input name="data" type="date" className={inputClassName} />
                  </label>

                  <label className={labelClassName}>
                    <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">Houve atendimento?</span>
                    <select name="houveAtendimento" className={inputClassName}>
                      <option value="true">Sim</option>
                      <option value="false">Não</option>
                    </select>
                  </label>

                  <label className={labelClassName}>
                    <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">Status do relatório</span>
                    <select name="statusRelatorio" className={inputClassName}>
                      {ATER_SOCIOBIO_STATUS_RELATORIO.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </section>

              <section className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
                <div className="mb-8">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-emerald-600" />
                    <h2 className="text-xl font-bold text-zinc-900">Equipe técnica e projeto</h2>
                  </div>
                  <p className="mt-2 text-sm text-zinc-500 font-medium">Responsáveis técnicos e vínculo institucional.</p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <label className={labelClassName}>
                    <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">Técnico responsável</span>
                    <select name="tecnicoId" className={inputClassName}>
                      <option value="">Outro (informe ao lado)</option>
                      {tecnicos.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.nome} {t.conselho ? `(${t.conselho})` : ""}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className={labelClassName}>
                    <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">Nome (caso não listado)</span>
                    <input name="tecnico" type="text" className={inputClassName} placeholder="Nome completo do técnico" />
                  </label>

                  <label className={labelClassName}>
                    <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">ID / Centro de Custo</span>
                    <input name="projetoId" type="text" className={inputClassName} placeholder="Ex: 1084" />
                  </label>

                  <label className={labelClassName}>
                    <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">Título do projeto</span>
                    <input name="projetoTitulo" type="text" list="projeto-titulo-options" className={inputClassName} placeholder="Selecione ou digite..." />
                  </label>
                </div>
              </section>

              <section className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
                <div className="mb-8">
                  <div className="flex items-center gap-2">
                    <ClipboardList className="h-5 w-5 text-emerald-600" />
                    <h2 className="text-xl font-bold text-zinc-900">Atividade e meta</h2>
                  </div>
                  <p className="mt-2 text-sm text-zinc-500 font-medium">Campos do Relatório Técnico de Visita Individual (Documento 11).</p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <Field label="Atividade número / total" name="atividadeNumeroTotal" placeholder="Ex.: 1/16" />
                  <Field label="Código da Meta" name="codigoMeta" />

                  <div className="md:col-span-2">
                    <label className={labelClassName}>
                      <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">Descrição da Meta</span>
                      <textarea name="descricaoMeta" rows={3} className={inputClassName} />
                    </label>
                  </div>

                  <Field label="Nº Mulheres atendidas" name="numeroMulheres" type="number" />
                  <Field label="Nº Jovens atendidos" name="numeroJovens" type="number" />
                </div>
              </section>

              <AtendimentoDocumento11Fields />

              <div className="flex flex-col gap-6 border-t border-zinc-100 pt-10 sm:flex-row sm:items-center sm:justify-between">
                <Link href="/ater-sociobio/atendimentos" className="text-sm font-bold text-zinc-400 hover:text-zinc-600">
                  Cancelar e sair
                </Link>

                <button
                  type="submit"
                  className="inline-flex h-14 items-center justify-center rounded-2xl bg-emerald-600 px-10 text-base font-bold text-white shadow-xl shadow-emerald-600/20 transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
                >
                  Salvar Visita Técnica
                </button>
              </div>
            </form>
          )}

          <datalist id="projeto-titulo-options">
            {ATER_SOCIOBIO_PROJETOS_REFERENCIA.map((projeto) => (
              <option key={projeto} value={projeto} />
            ))}
          </datalist>
        </div>
      </div>
    </div>
  );
}

function Field({ label, name, type = "text", placeholder }: { label: string; name: string; type?: string; placeholder?: string }) {
  return (
    <label className={labelClassName}>
      <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">{label}</span>
      <input name={name} type={type} className={inputClassName} placeholder={placeholder} />
    </label>
  );
}
