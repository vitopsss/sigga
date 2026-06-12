import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { PaperBooleanOptions } from "@/components/ater/paper-boolean-field";
import { IntegrantesForm } from "@/components/ater/integrantes-form";
import { AterSetupWarning } from "@/components/ater/setup-warning";
import { Header } from "@/components/dashboard/header";
import { atualizarFamilia } from "@/lib/actions/familias";
import { ATER_SETUP_ERROR } from "@/lib/ater-runtime";
import { ATER_SOCIOBIO_MUNICIPIOS } from "@/lib/constants/ater-sociobio";
import {
  AterSociobioService,
  type FamiliaWithCadastro,
  type OrganizacaoColetivaListItem,
} from "@/lib/services/ater-sociobio.service";

const inputClassName =
  "mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15";

const labelClassName = "block";

export const dynamic = "force-dynamic";

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

type AtividadeRow = {
  atividade?: unknown;
  producaoAnual?: unknown;
  unidade?: unknown;
  atividadePrincipal?: unknown;
};

function getAtividades(value: unknown): AtividadeRow[] {
  return Array.isArray(value) ? (value as AtividadeRow[]) : [];
}

function asText(value: unknown) {
  return typeof value === "string" || typeof value === "number" ? String(value) : "";
}

export default async function EditarFamiliaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let familia: FamiliaWithCadastro | null = null;
  let organizacoes: OrganizacaoColetivaListItem[] = [];
  let error: string | null = null;

  try {
    [familia, organizacoes] = await Promise.all([
      AterSociobioService.getFamiliaById(id),
      AterSociobioService.listOrganizacoesColetivas(),
    ]);
  } catch (e: unknown) {
    console.error(e);
    error = getErrorMessage(e);
  }

  if (error === ATER_SETUP_ERROR) {
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

  if (!familia) {
    notFound();
  }

  const atividades = getAtividades(familia.envioSGAPorAtividade);
  const atividadeSlots = Array.from({ length: Math.max(9, atividades.length + 1) }, (_, index) => index);

  async function submit(formData: FormData) {
    "use server";
    const result = await atualizarFamilia(id, formData);
    if (result.data) {
      redirect(`/ater-sociobio/familias/${id}`);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50/50">
      <Header
        title="Editar UFPA"
        description={`Atualizando dados de ${familia.nomeFamilia}`}
        actions={
          <Link href={`/ater-sociobio/familias/${id}`} className="text-sm font-bold text-zinc-500 hover:text-zinc-700">
            Voltar para detalhes
          </Link>
        }
      />

      <div className="p-6 lg:p-8">
        <div className="mx-auto max-w-6xl">
          <section className="rounded-[2.5rem] border border-zinc-200 bg-white p-6 shadow-sm sm:p-10 lg:p-12">
            <form action={submit} className="space-y-12">
              <Section title="Dados da UFPA" description="Informações cadastrais e de localização.">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <label className={labelClassName + " lg:col-span-2"}>
                    <span className="text-sm font-medium text-zinc-700">Denominação da UFPA *</span>
                    <input name="nomeFamilia" type="text" required defaultValue={familia.nomeFamilia} className={inputClassName} />
                  </label>

                  <label className={labelClassName}>
                    <span className="text-sm font-medium text-zinc-700">DAP/CAF</span>
                    <input name="dapCaf" type="text" defaultValue={familia.dapCaf ?? ""} className={inputClassName} />
                  </label>

                  <label className={labelClassName}>
                    <span className="text-sm font-medium text-zinc-700">Órgão Emissor</span>
                    <input name="dapCafOrgaoEmissor" type="text" defaultValue={familia.dapCafOrgaoEmissor ?? ""} className={inputClassName} />
                  </label>

                  <label className={labelClassName}>
                    <span className="text-sm font-medium text-zinc-700">Validade</span>
                    <input name="dapCafValidade" type="date" defaultValue={familia.dapCafValidade ? new Date(familia.dapCafValidade).toISOString().split('T')[0] : ""} className={inputClassName} />
                  </label>

                  <label className={labelClassName}>
                    <span className="text-sm font-medium text-zinc-700">Área total (ha)</span>
                    <input name="areaEstabelecimento" type="number" step="0.01" defaultValue={familia.areaEstabelecimento?.toString() ?? ""} className={inputClassName} />
                  </label>

                  <label className={labelClassName}>
                    <span className="text-sm font-medium text-zinc-700">Área imóvel principal (ha)</span>
                    <input name="areaImovelPrincipal" type="number" step="0.01" defaultValue={familia.areaImovelPrincipal?.toString() ?? ""} className={inputClassName} />
                  </label>

                  <label className={labelClassName}>
                    <span className="text-sm font-medium text-zinc-700">Município</span>
                    <select name="municipio" defaultValue={familia.municipio ?? ""} className={inputClassName}>
                      <option value="">Selecione...</option>
                      {ATER_SOCIOBIO_MUNICIPIOS.map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </label>

                  <label className={labelClassName + " lg:col-span-2"}>
                    <span className="text-sm font-medium text-zinc-700">Endereço/Acesso</span>
                    <input name="enderecoUfpa" type="text" defaultValue={familia.enderecoUfpa ?? ""} className={inputClassName} />
                  </label>

                  <label className={labelClassName}>
                    <span className="text-sm font-medium text-zinc-700">Comunidade</span>
                    <input name="comunidade" type="text" defaultValue={familia.comunidade ?? ""} className={inputClassName} />
                  </label>

                  <label className={labelClassName}>
                    <span className="text-sm font-medium text-zinc-700">Organização Coletiva</span>
                    <select name="organizacaoColetivaId" defaultValue={familia.organizacaoColetivaId ?? ""} className={inputClassName}>
                      <option value="">Nenhuma / Sem vínculo</option>
                      {organizacoes.map((org) => (
                        <option key={org.id} value={org.id}>{org.denominacao}</option>
                      ))}
                    </select>
                  </label>

                  <label className={labelClassName}>
                    <span className="text-sm font-medium text-zinc-700">Código SGA</span>
                    <input name="codigoSGA" type="text" defaultValue={familia.codigoSGA ?? ""} className={inputClassName} />
                  </label>
                </div>
              </Section>

              <IntegrantesForm initialData={familia.integrantes.map(i => ({
                nome: i.nome,
                cpf: i.cpf,
                nisCadUnico: i.nisCadUnico,
                apelido: i.apelido,
                sexo: i.sexo,
                orientacaoSexual: i.orientacaoSexual,
                identidadeGenero: i.identidadeGenero,
                dataNascimento: i.dataNascimento,
                escolaridade: i.escolaridade,
                nomeMae: i.nomeMae,
                nomePai: i.nomePai,
                classificacao: i.classificacao,
                email: i.email,
                telefones: i.telefones,
                responsavelUfpa: i.responsavelUfpa,
                parentesco: i.parentesco
              }))} />

              <Section title="Atividade, produção anual e unidade" description="Referência produtiva da UFPA.">
                <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
                  <div className="grid grid-cols-[64px_1fr_160px_160px] bg-zinc-50 text-xs font-bold uppercase tracking-wider text-zinc-500">
                    <div className="px-4 py-3">Nº</div>
                    <div className="px-4 py-3">Atividade</div>
                    <div className="px-4 py-3 text-center">Produção</div>
                    <div className="px-4 py-3 text-center">Principal</div>
                  </div>
                  {atividadeSlots.map((index) => {
                    const atividade = atividades[index];
                    return (
                      <div key={index} className="grid grid-cols-[64px_1fr_160px_160px] items-center border-t border-zinc-100">
                        <div className="px-4 py-3 text-sm font-medium text-zinc-400">{index + 1}.</div>
                        <input name={`atividade_${index}_atividade`} type="text" defaultValue={asText(atividade?.atividade)} className="h-full border-r border-zinc-50 px-4 py-3 text-sm outline-none focus:bg-emerald-50/30" placeholder="Descrição..." />
                        <input name={`atividade_${index}_producaoAnual`} type="text" defaultValue={asText(atividade?.producaoAnual)} className="h-full border-r border-zinc-50 px-4 py-3 text-center text-sm outline-none focus:bg-emerald-50/30" placeholder="Qtd + Unid" />
                        <div className="flex justify-center px-4 py-3">
                          <PaperBooleanOptions name={`atividade_${index}_atividadePrincipal`} defaultValue={atividade?.atividadePrincipal === true ? true : atividade?.atividadePrincipal === false ? false : null} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Section>

              <div className="flex flex-col gap-4 border-t border-zinc-100 pt-10 sm:flex-row sm:items-center sm:justify-between">
                <Link href={`/ater-sociobio/familias/${id}`} className="text-sm font-bold text-zinc-400 hover:text-zinc-600">
                  Cancelar alterações
                </Link>
                <button
                  type="submit"
                  className="inline-flex h-14 items-center justify-center rounded-2xl bg-emerald-600 px-10 text-base font-bold text-white shadow-xl shadow-emerald-600/20 transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="mb-8">
        <h2 className="text-xl font-bold text-zinc-900">{title}</h2>
        {description && <p className="mt-2 text-sm text-zinc-500">{description}</p>}
      </div>
      {children}
    </section>
  );
}
