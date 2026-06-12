import Link from "next/link";
import { redirect } from "next/navigation";

import { PaperBooleanOptions } from "@/components/ater/paper-boolean-field";
import { IntegrantesForm } from "@/components/ater/integrantes-form";
import { criarFamilia } from "@/lib/actions/familias";
import { ATER_SOCIOBIO_MUNICIPIOS } from "@/lib/constants/ater-sociobio";
import {
  AterSociobioService,
} from "@/lib/services/ater-sociobio.service";

const inputClassName =
  "mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15";

const labelClassName = "block";
const atividadeSlots = Array.from({ length: 9 }, (_, index) => index);

export const dynamic = "force-dynamic";

export default async function NovaFamiliaPage() {
  const organizacoes = await AterSociobioService.listOrganizacoesColetivas();

  async function submit(formData: FormData) {
    "use server";
    const result = await criarFamilia(formData);
    if (result.data) {
      redirect(`/ater-sociobio/familias/${result.data.id}`);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <section className="rounded-[2.5rem] border border-zinc-200 bg-white p-6 shadow-sm sm:p-10 lg:p-12">
          <div className="border-b border-zinc-100 pb-10">
            <Link href="/ater-sociobio/familias" className="inline-flex text-sm font-bold text-zinc-400 hover:text-zinc-600">
              Voltar para a lista
            </Link>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
              Nova UFPA
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-500 sm:text-base">
              Cadastre uma nova Unidade Familiar de Produção Agrária (UFPA) preenchendo os dados do responsável e a composição familiar.
            </p>
          </div>

          <form action={submit} className="mt-12 space-y-12">
            <Section title="Identificação e Localização" description="Dados básicos da unidade familiar e vínculo organizacional.">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Field label="Nome da UFPA/Denominação *" name="nomeFamilia" required className="lg:col-span-2" />
                <Field label="Responsável (Referência) *" name="nomeResponsavel" required />
                <Field label="CPF do Responsável *" name="documentoResponsavel" required />

                <label className={labelClassName}>
                  <span className="text-sm font-medium text-zinc-700">Município *</span>
                  <select name="municipio" required className={inputClassName}>
                    <option value="">Selecione...</option>
                    {ATER_SOCIOBIO_MUNICIPIOS.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </label>

                <Field label="Comunidade" name="comunidade" />

                <label className={labelClassName}>
                  <span className="text-sm font-medium text-zinc-700">Organização Coletiva</span>
                  <select name="organizacaoColetivaId" className={inputClassName}>
                    <option value="">Nenhuma / Sem vínculo</option>
                    {organizacoes.map((org) => (
                      <option key={org.id} value={org.id}>{org.denominacao}</option>
                    ))}
                  </select>
                </label>

                <Field label="Grupo de Interesse" name="grupoInteresse" />
                <Field label="DAP/CAF" name="dapCaf" />
                <Field label="Código SGA" name="codigoSGA" />
              </div>
            </Section>

            <IntegrantesForm />

            <Section title="Dados Complementares" description="Informações técnicas adicionais sobre a propriedade.">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Field label="Área total (ha)" name="areaEstabelecimento" type="number" step="0.01" />
                <Field label="Área imóvel principal (ha)" name="areaImovelPrincipal" type="number" step="0.01" />
                <Field label="Bioma" name="bioma" />
                <Field label="Programa de Fomento" name="programaFomento" />
                <Field label="Classificação da UFPA" name="classificacaoUfpa" />
                <Field label="Endereço/Acesso" name="enderecoUfpa" className="lg:col-span-2" />
                <Field label="CEP" name="cepUfpa" />
              </div>
            </Section>

            {/* Patrimônio, Recursos e Outros (Abaixo dos Integrantes para fluxo lógico) */}
            <Section title="Patrimônio e Atividades" description="Produção anual e bens da unidade familiar.">
              <div className="space-y-8">
                <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
                  <div className="grid grid-cols-[64px_1fr_160px_160px] bg-zinc-50 text-xs font-bold uppercase tracking-wider text-zinc-500">
                    <div className="px-4 py-3">Nº</div>
                    <div className="px-4 py-3">Atividade</div>
                    <div className="px-4 py-3 text-center">Produção</div>
                    <div className="px-4 py-3 text-center">Principal</div>
                  </div>
                  {atividadeSlots.map((index) => (
                    <div key={index} className="grid grid-cols-[64px_1fr_160px_160px] items-center border-t border-zinc-100">
                      <div className="px-4 py-3 text-sm font-medium text-zinc-400">{index + 1}.</div>
                      <input name={`atividade_${index}_atividade`} type="text" className="h-full border-r border-zinc-50 px-4 py-3 text-sm outline-none focus:bg-emerald-50/30" placeholder="Descrição..." />
                      <input name={`atividade_${index}_producaoAnual`} type="text" className="h-full border-r border-zinc-50 px-4 py-3 text-center text-sm outline-none focus:bg-emerald-50/30" placeholder="Qtd + Unidade" />
                      <div className="flex justify-center px-4 py-3">
                        <PaperBooleanOptions name={`atividade_${index}_atividadePrincipal`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Section>

            <section className="rounded-3xl border border-zinc-200 bg-zinc-50/50 p-6 shadow-sm">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-zinc-900">Proteção de Dados Pessoais (LGPD)</h2>
                <p className="mt-2 text-sm text-zinc-500">
                  Registro de conformidade com a Lei Geral de Proteção de Dados e Termo de Adesão ao programa.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                <label className={labelClassName}>
                  <span className="text-sm font-medium text-zinc-700">Consentimento LGPD?</span>
                  <PaperBooleanOptions name="lgpdConsentimento" />
                </label>
                <Field label="Data do consentimento" name="lgpdDataConsentimento" type="date" />
                <Field label="Referência do Termo Assinado" name="referenciaAnexoLgpd" placeholder="Ex: Pasta 04 / Link ou Código" />
                <Field label="Representante (CPF)" name="representanteCpf" />
              </div>
            </section>

            <div className="flex flex-col gap-4 border-t border-zinc-100 pt-10 sm:flex-row sm:items-center sm:justify-between">
              <Link href="/ater-sociobio/familias" className="text-sm font-bold text-zinc-400 hover:text-zinc-600">
                Cancelar cadastro
              </Link>
              <button
                type="submit"
                className="inline-flex h-14 items-center justify-center rounded-2xl bg-emerald-600 px-10 text-base font-bold text-white shadow-xl shadow-emerald-600/20 transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
              >
                Cadastrar Unidade Familiar (UFPA)
              </button>
            </div>
          </form>
        </section>
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

function Field({
  label,
  name,
  type = "text",
  step,
  required = false,
  className = "",
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  step?: string;
  required?: boolean;
  className?: string;
  placeholder?: string;
}) {
  return (
    <label className={`${labelClassName} ${className}`}>
      <span className="text-sm font-medium text-zinc-700">{label}</span>
      <input name={name} type={type} step={step} required={required} className={inputClassName} placeholder={placeholder} />
    </label>
  );
}
