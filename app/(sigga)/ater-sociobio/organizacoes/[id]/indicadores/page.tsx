import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { ReactNode } from "react";

import { PaperBooleanField, PaperTernaryField } from "@/components/ater/paper-boolean-field";
import { TecnicosSelector } from "@/components/ater/tecnicos-selector";
import { AterSetupWarning } from "@/components/ater/setup-warning";
import { Header } from "@/components/dashboard/header";
import { salvarIndicadoresOrganizacaoColetiva } from "@/lib/actions/organizacoes-coletivas";
import { ATER_SETUP_ERROR, isAterMissingTableError } from "@/lib/ater-runtime";
import { AterSociobioService, type OrganizacaoColetivaWithFamilias } from "@/lib/services/ater-sociobio.service";

type Params = Promise<{ id: string }>;

const inputClassName =
  "mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100";

const labelClassName = "block";

const praticasAmbientais = [
  { name: "praticaSeparacaoLixo", label: "a. Separação de lixo" },
  { name: "praticaDescarteCorretoLixo", label: "b. Descarte correto de lixo" },
  { name: "praticaManutencaoAcessos", label: "c. Manutenção de acessos" },
  { name: "praticaTratamentoDejetos", label: "d. Tratamento de dejetos" },
  { name: "praticaCaptacaoAguaChuva", label: "e. Captação de água das chuvas" },
  { name: "praticaEducacaoAmbiental", label: "f. Educação ambiental" },
  { name: "praticaAvaliacaoPrevencaoRiscos", label: "g. Avaliação e prevenção de riscos" },
] as const;

const identidadeComercial = [
  { name: "identidadeMarcaPropria", label: "a. Marca própria" },
  { name: "identidadeSeloArte", label: "b. Selo Arte" },
  { name: "identidadeSenaf", label: "c. Selo Nacional da Agricultura Familiar" },
  { name: "identidadeSenafSociobiodiversidade", label: "d. SENAF Sociobiodiversidade" },
  { name: "identidadeSeloQuilombos", label: "e. Selo Quilombos do Brasil" },
  { name: "identidadeSeloIndigenas", label: "f. Selo Indígenas do Brasil" },
  { name: "identidadeSeloPovosTradicionais", label: "g. Selo Povos e Comunidades Tradicionais (outros)" },
] as const;

const representacaoPolitica = [
  { name: "filiadaUnicafes", label: "a. UNICAFES" },
  { name: "filiadaUnicopas", label: "b. UNICOPAS" },
  { name: "filiadaSistemaOcb", label: "c. Sistema OCB" },
] as const;

const politicasPublicas = [
  { name: "possuiCafJuridica", label: "CAF jurídica" },
  { name: "acessouPronafCusteio", label: "Pronaf Custeio" },
  { name: "acessouPronafCapitalGiro", label: "Pronaf Capital de Giro" },
  { name: "acessouPronafMaisAlimentos", label: "Pronaf Mais Alimentos" },
  { name: "acessouPronafIndustrializacao", label: "Pronaf Industrialização" },
  { name: "acessouPronafAgroindustria", label: "Pronaf Agroindústria" },
  { name: "acessouPronafCotasPartes", label: "Pronaf Cotas Partes" },
  { name: "acessouPaa", label: "PAA" },
  { name: "acessouPnae", label: "PNAE" },
  { name: "acessouPgpm", label: "PGPM" },
  { name: "acessouPgpmSociobiodiversidade", label: "PGPM - Sociobiodiversidade" },
  { name: "acessouCooperaMaisBrasil", label: "Coopera Mais brasil" },
] as const;

const canaisComercializacao = [
  { name: "canalTrocaProdutoServico", label: "1. Troca por outro produto ou serviço" },
  { name: "canalVendaOrganizacao", label: "2. Venda na organização coletiva" },
  { name: "canalVendaDiretaConsumidor", label: "3. Venda direta ao consumidor" },
  { name: "canalFeira", label: "4. Feira" },
  { name: "canalMercadoLocal", label: "5. Mercado local" },
  { name: "canalAtravessador", label: "6. Atravessador" },
  { name: "canalPaa", label: "7. PAA" },
  { name: "canalPnae", label: "8. PNAE" },
  { name: "canalMercadoJustoSolidario", label: "9. Mercado justo / solidário" },
] as const;

export const dynamic = "force-dynamic";

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

function formatDateInput(value?: Date | string | null) {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 10);
}

function getBooleanValue(
  indicadores: OrganizacaoColetivaWithFamilias["indicadores"],
  field: keyof NonNullable<OrganizacaoColetivaWithFamilias["indicadores"]>,
) {
  const value = indicadores?.[field];
  return typeof value === "boolean" ? value : null;
}

function Field({
  label,
  name,
  defaultValue,
  type = "text",
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  type?: string;
}) {
  return (
    <label className={labelClassName}>
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input name={name} type={type} defaultValue={defaultValue ?? ""} className={inputClassName} />
    </label>
  );
}

function Section({
  title,
  subtitle,
  children,
  muted = false,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  muted?: boolean;
}) {
  return (
    <section className={`rounded-3xl border border-slate-200 ${muted ? "bg-slate-50/80" : "bg-white"} p-6 shadow-sm`}>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm leading-6 text-slate-500">{subtitle}</p> : null}
      </div>
      {children}
    </section>
  );
}

export default async function IndicadoresOrganizacaoColetivaPage({
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

  const indicadores = organizacao.indicadores;

  const orgTecnicos = [
    { nome: indicadores?.agenteAterNome1 ?? organizacao.agenteAterNome1 ?? null, cpf: indicadores?.agenteAterCpf1 ?? organizacao.agenteAterCpf1 ?? null },
    { nome: indicadores?.agenteAterNome2 ?? organizacao.agenteAterNome2 ?? null, cpf: indicadores?.agenteAterCpf2 ?? organizacao.agenteAterCpf2 ?? null },
    { nome: indicadores?.agenteAterNome3 ?? organizacao.agenteAterNome3 ?? null, cpf: indicadores?.agenteAterCpf3 ?? organizacao.agenteAterCpf3 ?? null },
    { nome: indicadores?.agenteAterNome4 ?? organizacao.agenteAterNome4 ?? null, cpf: indicadores?.agenteAterCpf4 ?? organizacao.agenteAterCpf4 ?? null },
  ];

  async function submit(formData: FormData) {
    "use server";

    const result = await salvarIndicadoresOrganizacaoColetiva(id, formData);
    if (result.data) {
      redirect(`/ater-sociobio/organizacoes/${id}`);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50/50">
      <Header
        title="Indicadores da Organização Coletiva"
        description="Campos alinhados ao documento Indicadores da Organização Coletiva - Sociobiodiversidade."
        actions={
          <Link href={`/ater-sociobio/organizacoes/${id}`} className="text-sm font-medium text-slate-500 hover:text-slate-700">
            Voltar para organização
          </Link>
        }
      />

      <div className="p-6 lg:p-8">
        <div className="mx-auto max-w-5xl">
          <form action={submit} className="space-y-8">
            <Section title="Entidade Executora" muted>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Field label="Nome:" name="entidadeExecutoraNome" defaultValue={indicadores?.entidadeExecutoraNome ?? organizacao.entidadeExecutoraNome} />
                <Field label="CNPJ:" name="entidadeExecutoraCnpj" defaultValue={indicadores?.entidadeExecutoraCnpj ?? organizacao.entidadeExecutoraCnpj} />
                <Field label="Unidade de Serviços/Núcleo Operacional:" name="unidadeServicos" defaultValue={indicadores?.unidadeServicos ?? organizacao.unidadeServicos} />
                <Field label="Número do Contrato:" name="numeroContrato" defaultValue={indicadores?.numeroContrato ?? organizacao.numeroInstrumento} />
              </div>
            </Section>

            <Section title="Técnicos (Indicadores)">
              <TecnicosSelector
                options={tecnicosAtivos}
                defaultValues={orgTecnicos}
                max={4}
                prefix="indicadorAgenteAter"
              />
            </Section>

            <Section title="Local de Realização da Atividade" muted>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Field label="Estado" name="localEstado" defaultValue={indicadores?.localEstado ?? organizacao.uf ?? "AM"} />
                <Field label="Município" name="localMunicipio" defaultValue={indicadores?.localMunicipio ?? organizacao.municipio} />
                <Field label="Organização Coletiva:" name="localOrganizacaoColetiva" defaultValue={indicadores?.localOrganizacaoColetiva ?? organizacao.denominacao} />
                <Field label="Data da execução" name="dataReferencia" type="date" defaultValue={formatDateInput(indicadores?.dataReferencia)} />
              </div>
            </Section>

            <Section title="Indicadores">
              <div className="space-y-8">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">AMBIENTAL</p>
                  <h3 className="mt-2 text-base font-semibold text-slate-900">Organização Coletiva com práticas sustentáveis</h3>
                  <div className="mt-5 space-y-5">
                    <PaperBooleanField
                      label="1. A Organização Coletiva faz uso de práticas ambientais?"
                      name="possuiPraticasAmbientais"
                      defaultValue={indicadores?.possuiPraticasAmbientais}
                    />
                    <div>
                      <p className="text-sm font-medium text-slate-700">2. Se sim, quais?</p>
                      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                        {praticasAmbientais.map((item) => (
                          <PaperTernaryField
                            key={item.name}
                            label={item.label}
                            name={item.name}
                            defaultValue={getBooleanValue(indicadores, item.name)}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">SOCIAL</p>
                  <h3 className="mt-2 text-base font-semibold text-slate-900">Identidade organizacional</h3>
                  <div className="mt-5 space-y-5">
                    <PaperBooleanField
                      label="1. A Organização Coletiva se utiliza de estratégias de identidade comercial?"
                      name="usaIdentidadeComercial"
                      defaultValue={indicadores?.usaIdentidadeComercial}
                    />
                    <div>
                      <p className="text-sm font-medium text-slate-700">2. Se sim na questão 1, qual?</p>
                      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                        {identidadeComercial.map((item) => (
                          <PaperTernaryField
                            key={item.name}
                            label={item.label}
                            name={item.name}
                            defaultValue={getBooleanValue(indicadores, item.name)}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">SOCIAL</p>
                  <h3 className="mt-2 text-base font-semibold text-slate-900">Organização Coletiva - Gênero e juventude</h3>
                  <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
                    <PaperBooleanField
                      label="A Organização Coletiva possui mulheres na diretoria executiva ou Conselho fiscal?"
                      name="possuiMulheresDiretoriaConselho"
                      defaultValue={indicadores?.possuiMulheresDiretoriaConselho}
                    />
                    <PaperBooleanField
                      label="A Organização Coletiva possui jovens na diretoria executiva ou Conselho fiscal?"
                      name="possuiJovensDiretoriaConselho"
                      defaultValue={indicadores?.possuiJovensDiretoriaConselho}
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">SOCIAL</p>
                  <h3 className="mt-2 text-base font-semibold text-slate-900">Representação política</h3>
                  <div className="mt-5 space-y-5">
                    <PaperBooleanField
                      label="1. A Organização Coletiva é filiada a uma organização?"
                      name="filiadaOrganizacao"
                      defaultValue={indicadores?.filiadaOrganizacao}
                    />
                    <div>
                      <p className="text-sm font-medium text-slate-700">2. Se sim, qual?</p>
                      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                        {representacaoPolitica.map((item) => (
                          <PaperTernaryField
                            key={item.name}
                            label={item.label}
                            name={item.name}
                            defaultValue={getBooleanValue(indicadores, item.name)}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">ECONÔMICO</p>
                  <h3 className="mt-2 text-base font-semibold text-slate-900">Organização com Acesso à Políticas Públicas</h3>
                  <div className="mt-5 space-y-5">
                    <PaperBooleanField
                      label="1. A Organização Coletiva acessa ou acessou no último ano políticas públicas?"
                      name="acessaPoliticasPublicas"
                      defaultValue={indicadores?.acessaPoliticasPublicas}
                    />
                    <div>
                      <p className="text-sm font-medium text-slate-700">2. Se sim na questão 1, quais?</p>
                      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                        {politicasPublicas.map((item) => (
                          <PaperTernaryField
                            key={item.name}
                            label={item.label}
                            name={item.name}
                            defaultValue={getBooleanValue(indicadores, item.name)}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">ECONÔMICO</p>
                  <h3 className="mt-2 text-base font-semibold text-slate-900">Organização com Canais de comercialização</h3>
                  <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                    {canaisComercializacao.map((item) => (
                      <PaperBooleanField
                        key={item.name}
                        label={item.label}
                        name={item.name}
                        defaultValue={getBooleanValue(indicadores, item.name)}
                      />
                    ))}
                  </div>
                </div>

                <label className={labelClassName}>
                  <span className="text-sm font-medium text-slate-700">Observações</span>
                  <textarea
                    name="observacoesIndicadoresOrganizacao"
                    rows={4}
                    defaultValue={indicadores?.observacoes ?? ""}
                    className={inputClassName}
                  />
                </label>
              </div>
            </Section>

            <div className="flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <Link href={`/ater-sociobio/organizacoes/${id}`} className="text-sm font-medium text-slate-500 hover:text-slate-700">
                Cancelar
              </Link>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-100"
              >
                Salvar indicadores da Organização Coletiva
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
