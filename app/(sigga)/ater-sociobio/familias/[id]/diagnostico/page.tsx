import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { ReactNode } from "react";

import { PaperBooleanField, PaperBooleanOptions, PaperTernaryField } from "@/components/ater/paper-boolean-field";
import { TecnicosSelector } from "@/components/ater/tecnicos-selector";
import { AterSetupWarning } from "@/components/ater/setup-warning";
import { Header } from "@/components/dashboard/header";
import { ATER_SETUP_ERROR, isAterMissingTableError } from "@/lib/ater-runtime";
import { salvarDiagnosticoUfpa } from "@/lib/actions/diagnosticos";
import {
  PRONAF_LINHAS_UFPA,
} from "@/lib/constants/ater-sociobio-official";
import {
  ATER_SOCIOBIO_POTENCIALIDADES_PRODUTIVO,
  ATER_SOCIOBIO_POTENCIALIDADES_SOCIAL,
  ATER_SOCIOBIO_POTENCIALIDADES_AMBIENTAL,
  ATER_SOCIOBIO_LIMITACOES_PRODUTIVO,
  ATER_SOCIOBIO_LIMITACOES_SOCIAL,
  ATER_SOCIOBIO_LIMITACOES_AMBIENTAL,
} from "@/lib/constants/ater-sociobio";
import { AterSociobioService, type FamiliaWithCadastro } from "@/lib/services/ater-sociobio.service";

type Params = Promise<{ id: string }>;

const inputClassName =
  "mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100";

const labelClassName = "block";

export const dynamic = "force-dynamic";

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

function formatDateInput(value?: Date | string | null) {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 10);
}

type JsonRow = Record<string, unknown>;

function getJsonRows(value: unknown): JsonRow[] {
  return Array.isArray(value) ? (value as JsonRow[]) : [];
}

function rowText(rows: JsonRow[], index: number, key: string) {
  const value = rows[index]?.[key];
  return typeof value === "string" || typeof value === "number" ? String(value) : "";
}

function getPronafDefault(value: unknown, label: string): boolean | null {
  if (!Array.isArray(value)) return null;

  const row = value.find((item) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) return false;
    return (item as { linha?: unknown }).linha === label;
  });

  if (!row || typeof row !== "object" || Array.isArray(row)) return null;
  const acessou = (row as { acessou?: unknown }).acessou;
  return typeof acessou === "boolean" ? acessou : null;
}

function CheckboxGroup({
  label,
  name,
  options,
  defaultValues,
}: {
  label: string;
  name: string;
  options: readonly string[];
  defaultValues?: string[] | null;
}) {
  const selected = new Set(defaultValues ?? []);
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-slate-900">{label}</h3>
      <div className="space-y-2">
        {options.map((option) => (
          <label key={option} className="flex items-start gap-2">
            <input
              type="checkbox"
              name={name}
              value={option}
              defaultChecked={selected.has(option)}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
            <span className="text-sm text-slate-700">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function Section({
  title,
  description,
  children,
  muted = false,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  muted?: boolean;
}) {
  return (
    <section className={`rounded-3xl border border-slate-200 p-6 shadow-sm ${muted ? "bg-slate-50/80" : "bg-white"}`}>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        {description ? <p className="mt-1 text-sm text-slate-600">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  step,
  readOnly = false,
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue?: string | number | null;
  type?: "text" | "date" | "number";
  step?: string;
  readOnly?: boolean;
  placeholder?: string;
}) {
  return (
    <label className={labelClassName}>
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input
        name={name}
        type={type}
        step={step}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        readOnly={readOnly}
        className={inputClassName}
      />
    </label>
  );
}

function BooleanField({ label, name, defaultValue }: { label: string; name: string; defaultValue?: boolean | null }) {
  return <PaperBooleanField label={label} name={name} defaultValue={defaultValue} />;
}

function SNCell({
  name,
  value,
  defaultValue,
  label,
}: {
  name: string;
  value: "true" | "false";
  defaultValue?: boolean | null;
  label: "S" | "N";
}) {
  const checkedValue = value === "true";
  const checkedClass =
    value === "true"
      ? "peer-checked:border-emerald-600 peer-checked:bg-emerald-600"
      : "peer-checked:border-rose-600 peer-checked:bg-rose-600";

  return (
    <label className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap">
      <input name={name} type="radio" value={value} defaultChecked={defaultValue === checkedValue} className="peer sr-only" />
      <span className={`inline-flex h-8 min-w-8 items-center justify-center rounded-full border border-slate-300 bg-white px-2 text-xs font-semibold text-slate-600 transition peer-checked:text-white ${checkedClass}`}>
        {label}
      </span>
    </label>
  );
}

function SNTableRow({
  left,
  leftName,
  leftValue,
  right,
  rightName,
  rightValue,
}: {
  left: string;
  leftName: string;
  leftValue?: boolean | null;
  right: string;
  rightName: string;
  rightValue?: boolean | null;
}) {
  return (
    <tr className="border-t border-slate-300">
      <td className="border-r border-slate-200 px-4 py-4 font-medium text-slate-700">{left}</td>
      <td className="whitespace-nowrap border-r border-slate-200 px-4 py-4 text-center">
        <SNCell name={leftName} value="true" defaultValue={leftValue} label="S" />
      </td>
      <td className="whitespace-nowrap border-r-2 border-slate-300 px-4 py-4 text-center">
        <SNCell name={leftName} value="false" defaultValue={leftValue} label="N" />
      </td>
      <td className="border-r border-slate-200 px-4 py-4 font-medium text-slate-700">{right}</td>
      <td className="whitespace-nowrap border-r border-slate-200 px-4 py-4 text-center">
        <SNCell name={rightName} value="true" defaultValue={rightValue} label="S" />
      </td>
      <td className="whitespace-nowrap px-4 py-4 text-center">
        <SNCell name={rightName} value="false" defaultValue={rightValue} label="N" />
      </td>
    </tr>
  );
}

function TableInput({
  name,
  defaultValue,
  type = "text",
  step,
}: {
  name: string;
  defaultValue?: string | number | null;
  type?: "text" | "number";
  step?: string;
}) {
  return (
    <input
      name={name}
      type={type}
      step={step}
      defaultValue={defaultValue ?? ""}
      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
    />
  );
}

function QuantityTableRow({
  marker,
  label,
  name,
  defaultValue,
  unit,
  step,
}: {
  marker: string;
  label: string;
  name: string;
  defaultValue?: string | number | null;
  unit?: string;
  step?: string;
}) {
  return (
    <tr className="border-t border-slate-200">
      <td className="px-4 py-3 text-slate-700">
        <span className="mr-2 font-semibold text-slate-500">{marker}</span>
        {label}
      </td>
      <td className="px-4 py-3">
        <TableInput name={name} type="number" step={step} defaultValue={defaultValue} />
      </td>
      <td className="px-4 py-3 text-sm text-slate-600">{unit ?? ""}</td>
    </tr>
  );
}

function TernaryField({ label, name, defaultValue }: { label: string; name: string; defaultValue?: boolean | null }) {
  return <PaperTernaryField label={label} name={name} defaultValue={defaultValue} />;
}

function TextArea({ label, name, defaultValue }: { label: string; name: string; defaultValue?: string | null }) {
  return (
    <label className={labelClassName}>
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <textarea
        name={name}
        defaultValue={defaultValue ?? ""}
        rows={4}
        className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
      />
    </label>
  );
}

export default async function DiagnosticoUfpaPage({ params }: { params: Params }) {
  const { id } = await params;

  let familia: FamiliaWithCadastro | null = null;
  let error: string | null = null;
  let setupMissing = false;
  let tecnicosAtivos: { id: string; nome: string; cpf: string; conselho: string | null }[] = [];

  try {
    familia = await AterSociobioService.getFamiliaById(id);
    if (familia) {
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
          <div className="mx-auto max-w-6xl">
            <AterSetupWarning />
          </div>
        </div>
      </div>
    );
  }

  if (!familia) {
    notFound();
  }

  const diagnostico = familia.diagnostico;
  const indicadores = familia.indicadores;
  const atividadesUfpa = getJsonRows(familia.envioSGAPorAtividade);
  const recursosDisponiveis = getJsonRows(diagnostico?.recursosDisponiveis);
  const atividadesColetivas = getJsonRows(diagnostico?.atividadesColetivas);
  const politicasPublicas = getJsonRows(diagnostico?.politicasPublicas);
  const atividadeUfpaSlots = Array.from({ length: Math.max(9, atividadesUfpa.length + 1) }, (_, index) => index);
  const recursoSlots = Array.from({ length: Math.max(4, recursosDisponiveis.length + 1) }, (_, index) => index);
  const atividadeColetivaSlots = Array.from({ length: Math.max(4, atividadesColetivas.length + 1) }, (_, index) => index);
  const politicaSlots = Array.from({ length: Math.max(4, politicasPublicas.length + 1) }, (_, index) => index);

  const diagnosticoTecnicos = [
    { nome: diagnostico?.agenteAterNome1 ?? null, cpf: diagnostico?.agenteAterCpf1 ?? null },
    { nome: diagnostico?.agenteAterNome2 ?? null, cpf: diagnostico?.agenteAterCpf2 ?? null },
    { nome: diagnostico?.agenteAterNome3 ?? null, cpf: diagnostico?.agenteAterCpf3 ?? null },
  ];

  const indicadoresTecnicos = [
    { nome: indicadores?.agenteAterNome1 ?? null, cpf: indicadores?.agenteAterCpf1 ?? null },
    { nome: indicadores?.agenteAterNome2 ?? null, cpf: indicadores?.agenteAterCpf2 ?? null },
    { nome: indicadores?.agenteAterNome3 ?? null, cpf: indicadores?.agenteAterCpf3 ?? null },
  ];

  async function submit(formData: FormData) {
    "use server";

    const result = await salvarDiagnosticoUfpa(id, formData);
    if (result.data) {
      redirect(`/ater-sociobio/familias/${id}`);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50/50">
      <Header
        title="Diagnóstico da UFPA"
        description={`Estrutura de diagnóstico e indicadores de ${familia.nomeFamilia}`}
        actions={
          <Link href={`/ater-sociobio/familias/${id}`} className="text-sm font-medium text-slate-500 hover:text-slate-700">
            Voltar para UFPA
          </Link>
        }
      />

      <div className="p-6 lg:p-8">
        <div className="mx-auto max-w-6xl">
          <form action={submit} className="space-y-8">
            <Section title="Entidade executora" description="Cabeçalho do documento Diagnóstico da UFPA - Sociobiodiversidade." muted>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                <Field label="Nome:" name="entidadeExecutoraNome" defaultValue={diagnostico?.entidadeExecutoraNome ?? familia.organizacaoColetiva?.entidadeExecutoraNome} />
                <Field label="CNPJ:" name="entidadeExecutoraCnpj" defaultValue={diagnostico?.entidadeExecutoraCnpj ?? familia.organizacaoColetiva?.entidadeExecutoraCnpj} />
                <Field label="Unidade de Serviços/Núcleo Operacional:" name="unidadeServicos" defaultValue={diagnostico?.unidadeServicos ?? familia.organizacaoColetiva?.unidadeServicos} />
                <Field label="Número do instrumento:" name="numeroInstrumento" defaultValue={diagnostico?.numeroInstrumento ?? familia.organizacaoColetiva?.numeroInstrumento} />
              </div>
            </Section>

            <Section title="Técnicos (Diagnóstico)" muted>
              <TecnicosSelector
                options={tecnicosAtivos}
                defaultValues={diagnosticoTecnicos}
                max={3}
                prefix="diagnosticoAgenteAter"
              />
            </Section>

            <Section title="Local de realização da atividade" muted>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                <Field label="UF:" name="localUf" defaultValue={diagnostico?.localUf ?? "AM"} />
                <Field label="Município:" name="localMunicipio" defaultValue={diagnostico?.localMunicipio ?? familia.municipio} />
                <Field label="Organização Coletiva:" name="localOrganizacaoColetiva" defaultValue={diagnostico?.localOrganizacaoColetiva ?? familia.organizacaoColetiva?.denominacao} />
                <Field label="Data:" name="dataDiagnostico" type="date" defaultValue={formatDateInput(diagnostico?.dataDiagnostico)} />
              </div>
            </Section>

            <Section title="Dados da UFPA" description="Dados cadastrais usados como referência do Diagnóstico da UFPA.">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                <Field label="Denominação da UFPA" name="referenciaDenominacaoUfpa" defaultValue={familia.nomeFamilia} readOnly />
                <Field label="DAP/CAF" name="referenciaDapCaf" defaultValue={familia.dapCaf} readOnly />
                <Field label="Órgão Emissor" name="referenciaDapCafOrgaoEmissor" defaultValue={familia.dapCafOrgaoEmissor} readOnly />
                <Field label="Validade" name="referenciaDapCafValidade" type="date" defaultValue={formatDateInput(familia.dapCafValidade)} readOnly />
                <Field label="Área do estabelecimento (ha)" name="referenciaAreaEstabelecimento" defaultValue={familia.areaEstabelecimento?.toString()} readOnly />
                <Field label="Área do imóvel principal (ha)" name="referenciaAreaImovelPrincipal" defaultValue={familia.areaImovelPrincipal?.toString()} readOnly />
                <Field label="Endereço" name="referenciaEnderecoUfpa" defaultValue={familia.enderecoUfpa} readOnly />
                <Field label="Complemento" name="referenciaComplementoUfpa" defaultValue={familia.complementoUfpa} readOnly />
                <Field label="CEP" name="referenciaCepUfpa" defaultValue={familia.cepUfpa} readOnly />
                <Field label="Organização Coletiva:" name="referenciaOrganizacaoColetiva" defaultValue={familia.organizacaoColetiva?.denominacao} readOnly />
                <Field label="Classificação da UFPA" name="referenciaClassificacaoUfpa" defaultValue={familia.classificacaoUfpa} readOnly />
                <Field label="Bioma" name="referenciaBioma" defaultValue={familia.bioma} readOnly />
                <Field label="Programa de Fomento:" name="referenciaProgramaFomento" defaultValue={familia.programaFomento} readOnly />
                <div className="md:col-span-2 xl:col-span-3">
                  <p className="text-sm font-semibold text-slate-900">Coordenadas Geográficas (decimais)</p>
                </div>
                <Field label="Latitude principal" name="referenciaLatitude" defaultValue={familia.latitude?.toString()} readOnly />
                <Field label="Longitude principal" name="referenciaLongitude" defaultValue={familia.longitude?.toString()} readOnly />
                <div className="md:col-span-2 xl:col-span-3">
                  <p className="text-sm font-semibold text-slate-900">Atividade, Produção anual, Unidade e Atividade principal</p>
                </div>
                <div className="space-y-4 md:col-span-2 xl:col-span-3">
                  {atividadeUfpaSlots.map((index) => {
                    const atividade = atividadesUfpa[index];
                    const atividadePrincipal = atividade?.atividadePrincipal;
                    const atividadePrincipalValue =
                      atividadePrincipal === true ? "true" : atividadePrincipal === false ? "false" : "";

                    return (
                      <div key={index} className="grid grid-cols-1 gap-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 md:grid-cols-4">
                        <Field label="Atividade" name={`referenciaAtividade_${index}`} defaultValue={rowText(atividadesUfpa, index, "atividade")} readOnly />
                        <Field label="Produção anual" name={`referenciaProducaoAnual_${index}`} defaultValue={rowText(atividadesUfpa, index, "producaoAnual")} readOnly />
                        <Field label="Unidade" name={`referenciaUnidade_${index}`} defaultValue={rowText(atividadesUfpa, index, "unidade")} readOnly />
                        <label className={labelClassName}>
                          <span className="text-sm font-medium text-slate-700">Atividade principal</span>
                          <PaperBooleanOptions
                            name={`referenciaAtividadePrincipal_${index}`}
                            defaultValue={atividadePrincipalValue === "true" ? true : atividadePrincipalValue === "false" ? false : null}
                            disabled
                          />
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Section>

            <Section title="Diversos" description="Meios de comunicação e saneamento rural conforme o Diagnóstico da UFPA.">
              <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
                <table className="min-w-[860px] table-fixed border-collapse text-left text-sm">
                  <colgroup>
                    <col className="w-[30%]" />
                    <col className="w-[7%]" />
                    <col className="w-[7%]" />
                    <col className="w-[35%]" />
                    <col className="w-[7%]" />
                    <col className="w-[7%]" />
                  </colgroup>
                  <thead className="bg-slate-50 text-slate-900">
                    <tr>
                      <th className="border-r border-slate-200 px-4 py-3 font-semibold">Meios de comunicação</th>
                      <th className="border-r border-slate-200 px-4 py-3 text-center font-semibold">S</th>
                      <th className="border-r-2 border-slate-300 px-4 py-3 text-center font-semibold">N</th>
                      <th className="border-r border-slate-200 px-4 py-3 font-semibold">Saneamento rural</th>
                      <th className="border-r border-slate-200 px-4 py-3 text-center font-semibold">S</th>
                      <th className="px-4 py-3 text-center font-semibold">N</th>
                    </tr>
                  </thead>
                  <tbody>
                  <SNTableRow
                    left="Rádio"
                    leftName="possuiRadio"
                    leftValue={diagnostico?.possuiRadio}
                    right="Água para consumo"
                    rightName="aguaParaConsumo"
                    rightValue={diagnostico?.aguaParaConsumo}
                  />
                  <SNTableRow
                    left="Televisão"
                    leftName="possuiTelevisao"
                    leftValue={diagnostico?.possuiTelevisao}
                    right="Água para consumo tratada"
                    rightName="aguaConsumoTratada"
                    rightValue={diagnostico?.aguaConsumoTratada}
                  />
                  <SNTableRow
                    left="Celular"
                    leftName="possuiCelular"
                    leftValue={diagnostico?.possuiCelular}
                    right="Água para produção"
                    rightName="aguaParaProducao"
                    rightValue={diagnostico?.aguaParaProducao}
                  />
                  <SNTableRow
                    left="Internet"
                    leftName="possuiInternet"
                    leftValue={diagnostico?.possuiInternet}
                    right="Captação de água da chuva"
                    rightName="captacaoAguaChuva"
                    rightValue={diagnostico?.captacaoAguaChuva}
                  />
                  <SNTableRow
                    left="Redes Sociais"
                    leftName="usaRedesSociais"
                    leftValue={diagnostico?.usaRedesSociais}
                    right="Esgoto tratado"
                    rightName="esgotoTratado"
                    rightValue={diagnostico?.esgotoTratado}
                  />
                  <tr className="border-t border-slate-300">
                    <td className="border-r border-slate-200 px-4 py-4">
                      <label className="block">
                        <span className="font-medium text-slate-700">Outros meios de comunicação</span>
                        <input
                          name="outroMeioComunicacao"
                          type="text"
                          defaultValue={diagnostico?.outroMeioComunicacao ?? ""}
                          placeholder="Especifique..."
                          className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                        />
                      </label>
                    </td>
                    <td className="whitespace-nowrap border-r border-slate-200 px-4 py-4 text-center">
                      <SNCell name="possuiOutroMeioComunicacao" value="true" defaultValue={diagnostico?.possuiOutroMeioComunicacao} label="S" />
                    </td>
                    <td className="whitespace-nowrap border-r-2 border-slate-300 px-4 py-4 text-center">
                      <SNCell name="possuiOutroMeioComunicacao" value="false" defaultValue={diagnostico?.possuiOutroMeioComunicacao} label="N" />
                    </td>
                    <td className="border-r border-slate-200 px-4 py-4 font-medium text-slate-700">Fontes protegidas</td>
                    <td className="whitespace-nowrap border-r border-slate-200 px-4 py-4 text-center">
                      <SNCell name="fontesProtegidas" value="true" defaultValue={diagnostico?.fontesProtegidas} label="S" />
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-center">
                      <SNCell name="fontesProtegidas" value="false" defaultValue={diagnostico?.fontesProtegidas} label="N" />
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </Section>

            <Section title="Patrimônio" description="Tabela quantitativa conforme o Diagnóstico da UFPA - Sociobiodiversidade.">
              <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
                <table className="min-w-[760px] table-fixed border-collapse text-left text-sm">
                  <colgroup>
                    <col className="w-[60%]" />
                    <col className="w-[25%]" />
                    <col className="w-[15%]" />
                  </colgroup>
                  <thead className="bg-slate-100 text-xs uppercase tracking-wide text-slate-600">
                    <tr>
                      <th className="px-4 py-3">Descrição</th>
                      <th className="px-4 py-3">Quantidade</th>
                      <th className="px-4 py-3">Unid.</th>
                    </tr>
                  </thead>
                  <tbody>
                    <QuantityTableRow marker="1." label="Quantidade de máquinas agrícolas" name="qtdMaquinasAgricolas" defaultValue={diagnostico?.qtdMaquinasAgricolas} />
                    <QuantityTableRow marker="2." label="Quantidade de implemento agrícolas" name="qtdImplementosAgricolas" defaultValue={diagnostico?.qtdImplementosAgricolas} />
                    <QuantityTableRow marker="3." label="Quantidade de veículos de passeio" name="qtdVeiculosPasseio" defaultValue={diagnostico?.qtdVeiculosPasseio} />
                    <QuantityTableRow marker="4." label="Quantidade de construções rurais" name="qtdConstrucoesRurais" defaultValue={diagnostico?.qtdConstrucoesRurais} />
                    <QuantityTableRow marker="5." label="Quantidade de motores elétricos (não pertencente às máquinas)" name="qtdMotoresEletricos" defaultValue={diagnostico?.qtdMotoresEletricos} />
                    <QuantityTableRow marker="6." label="Quantidade de conjuntos de irrigação" name="qtdConjuntosIrrigacao" defaultValue={diagnostico?.qtdConjuntosIrrigacao} />
                    <QuantityTableRow marker="7." label="Quantidade de animais de trabalho" name="qtdAnimaisTrabalho" defaultValue={diagnostico?.qtdAnimaisTrabalho} />
                    <QuantityTableRow marker="8." label="Quantidade de veículos / maquinário de tração animal" name="qtdMaquinarioTracaoAnimal" defaultValue={diagnostico?.qtdMaquinarioTracaoAnimal} />
                    <tr className="border-t border-slate-300 bg-slate-50">
                      <td colSpan={3} className="px-4 py-3 font-semibold text-slate-900">Quantidade de cabeças no plantel</td>
                    </tr>
                    <QuantityTableRow marker="a." label="Bovinos" name="qtdBovinos" defaultValue={diagnostico?.qtdBovinos} unit="cabeças" />
                    <QuantityTableRow marker="b." label="Ovinos" name="qtdOvinos" defaultValue={diagnostico?.qtdOvinos} unit="cabeças" />
                    <QuantityTableRow marker="c." label="Caprinos" name="qtdCaprinos" defaultValue={diagnostico?.qtdCaprinos} unit="cabeças" />
                    <QuantityTableRow marker="d." label="Suínos" name="qtdSuinos" defaultValue={diagnostico?.qtdSuinos} unit="cabeças" />
                    <QuantityTableRow marker="e." label="Aves" name="qtdAves" defaultValue={diagnostico?.qtdAves} unit="cabeças" />
                    <QuantityTableRow marker="f." label="Bubalinos" name="qtdBubalinos" defaultValue={diagnostico?.qtdBubalinos} unit="cabeças" />
                    <QuantityTableRow marker="g." label="Equinos, muares e asininos" name="qtdEquinosMuaresAsininos" defaultValue={diagnostico?.qtdEquinosMuaresAsininos} unit="cabeças" />
                    <QuantityTableRow marker="h." label="Colmeias" name="qtdColmeias" defaultValue={diagnostico?.qtdColmeias} />
                    <QuantityTableRow marker="i." label="Pequenos animais (outros)" name="qtdPequenosAnimaisOutros" defaultValue={diagnostico?.qtdPequenosAnimaisOutros} />
                    <tr className="border-t border-slate-300 bg-slate-50">
                      <td colSpan={3} className="px-4 py-3 font-semibold text-slate-900">Área destinada a:</td>
                    </tr>
                    <QuantityTableRow marker="j." label="Pastagens" name="areaPastagens" defaultValue={diagnostico?.areaPastagens?.toString()} unit="ha" step="0.01" />
                    <QuantityTableRow marker="k." label="Culturas temporárias" name="areaCulturasTemporarias" defaultValue={diagnostico?.areaCulturasTemporarias?.toString()} unit="ha" step="0.01" />
                    <QuantityTableRow marker="l." label="Culturas permanentes" name="areaCulturasPermanentes" defaultValue={diagnostico?.areaCulturasPermanentes?.toString()} unit="ha" step="0.01" />
                    <QuantityTableRow marker="m." label="Lâmina d'água" name="areaLaminaAgua" defaultValue={diagnostico?.areaLaminaAgua?.toString()} unit="ha" step="0.01" />
                    <QuantityTableRow marker="n." label="Extrativismo" name="areaExtrativismo" defaultValue={diagnostico?.areaExtrativismo?.toString()} unit="ha" step="0.01" />
                    <QuantityTableRow marker="o." label="Reserva Legal" name="areaReservaLegal" defaultValue={diagnostico?.areaReservaLegal?.toString()} unit="ha" step="0.01" />
                    <QuantityTableRow marker="" label="Outros" name="areaOutrosUsos" defaultValue={diagnostico?.areaOutrosUsos?.toString()} unit="ha" step="0.01" />
                  </tbody>
                </table>
              </div>
            </Section>

            <Section title="Recursos disponíveis para produção, beneficiamento e comercialização da UFPA.">
              <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
                <table className="min-w-[720px] table-fixed border-collapse text-left text-sm">
                  <thead className="bg-slate-100 text-xs uppercase tracking-wide text-slate-600">
                    <tr>
                      <th className="w-1/2 px-4 py-3">Recursos disponíveis</th>
                      <th className="w-1/2 px-4 py-3">Tipo: Produção, beneficiamento ou comercialização</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recursoSlots.map((index) => (
                      <tr key={index} className="border-t border-slate-200">
                        <td className="px-4 py-3">
                          <TableInput name={`recurso_${index}_recursosDisponiveis`} defaultValue={rowText(recursosDisponiveis, index, "recursosDisponiveis")} />
                        </td>
                        <td className="px-4 py-3">
                          <TableInput name={`recurso_${index}_tipo`} defaultValue={rowText(recursosDisponiveis, index, "tipo")} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>

            <Section title="Participação em atividades coletivas sociais, políticas, culturais, produtivas e econômicas." muted>
              <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
                <table className="min-w-[720px] table-fixed border-collapse text-left text-sm">
                  <thead className="bg-slate-100 text-xs uppercase tracking-wide text-slate-600">
                    <tr>
                      <th className="w-1/2 px-4 py-3">Atividade Coletiva</th>
                      <th className="w-1/2 px-4 py-3">Área: Social, política, cultural, produtiva ou econômica.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {atividadeColetivaSlots.map((index) => (
                      <tr key={index} className="border-t border-slate-200">
                        <td className="px-4 py-3">
                          <TableInput name={`atividadeColetiva_${index}_atividadeColetiva`} defaultValue={rowText(atividadesColetivas, index, "atividadeColetiva")} />
                        </td>
                        <td className="px-4 py-3">
                          <TableInput name={`atividadeColetiva_${index}_area`} defaultValue={rowText(atividadesColetivas, index, "area")} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>

            <Section title="Ações Potenciais">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                <CheckboxGroup
                  label="Eixo Produtivo"
                  name="acoesPotenciaisProdutivo"
                  options={ATER_SOCIOBIO_POTENCIALIDADES_PRODUTIVO}
                  defaultValues={diagnostico?.acoesPotenciaisProdutivo as string[] | undefined}
                />
                <CheckboxGroup
                  label="Eixo Social"
                  name="acoesPotenciaisSocial"
                  options={ATER_SOCIOBIO_POTENCIALIDADES_SOCIAL}
                  defaultValues={diagnostico?.acoesPotenciaisSocial as string[] | undefined}
                />
                <CheckboxGroup
                  label="Eixo Ambiental"
                  name="acoesPotenciaisAmbiental"
                  options={ATER_SOCIOBIO_POTENCIALIDADES_AMBIENTAL}
                  defaultValues={diagnostico?.acoesPotenciaisAmbiental as string[] | undefined}
                />
              </div>
            </Section>

            <Section title="Limitações" muted>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                <CheckboxGroup
                  label="Eixo Produtivo"
                  name="limitacoesProdutivo"
                  options={ATER_SOCIOBIO_LIMITACOES_PRODUTIVO}
                  defaultValues={diagnostico?.limitacoesProdutivo as string[] | undefined}
                />
                <CheckboxGroup
                  label="Eixo Social"
                  name="limitacoesSocial"
                  options={ATER_SOCIOBIO_LIMITACOES_SOCIAL}
                  defaultValues={diagnostico?.limitacoesSocial as string[] | undefined}
                />
                <CheckboxGroup
                  label="Eixo Ambiental"
                  name="limitacoesAmbiental"
                  options={ATER_SOCIOBIO_LIMITACOES_AMBIENTAL}
                  defaultValues={diagnostico?.limitacoesAmbiental as string[] | undefined}
                />
              </div>
            </Section>

            <Section title="Integrantes" description="Referência dos integrantes cadastrados na UFPA. Reproduzir quantas vezes forem necessários para cadastrar todos(as) os(as) integrantes da família.">
              <div className="space-y-4">
                {Array.from({ length: Math.max(2, familia.integrantes.length) }, (_, index) => {
                  const integrante = familia.integrantes[index];

                  return (
                    <div key={integrante?.id ?? index} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                      <p className="mb-4 text-sm font-semibold text-slate-900">Integrante {index + 1}</p>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                        <Field label="CPF" name={`referenciaIntegrante_${index}_cpf`} defaultValue={integrante?.cpf} readOnly />
                        <Field label="NIS/CAD ÚNICO" name={`referenciaIntegrante_${index}_nisCadUnico`} defaultValue={integrante?.nisCadUnico} readOnly />
                        <Field label="Nome" name={`referenciaIntegrante_${index}_nome`} defaultValue={integrante?.nome} readOnly />
                        <Field label="Apelido" name={`referenciaIntegrante_${index}_apelido`} defaultValue={integrante?.apelido} readOnly />
                        <Field label="sexo" name={`referenciaIntegrante_${index}_sexo`} defaultValue={integrante?.sexo} readOnly />
                        <Field label="Orientação sexual" name={`referenciaIntegrante_${index}_orientacaoSexual`} defaultValue={integrante?.orientacaoSexual} readOnly />
                        <Field label="Identidade de Gênero" name={`referenciaIntegrante_${index}_identidadeGenero`} defaultValue={integrante?.identidadeGenero} readOnly />
                        <Field label="Data de nascimento" name={`referenciaIntegrante_${index}_dataNascimento`} type="date" defaultValue={formatDateInput(integrante?.dataNascimento)} readOnly />
                        <Field label="Escolaridade" name={`referenciaIntegrante_${index}_escolaridade`} defaultValue={integrante?.escolaridade} readOnly />
                        <Field label="Nome da mãe" name={`referenciaIntegrante_${index}_nomeMae`} defaultValue={integrante?.nomeMae} readOnly />
                        <Field label="Nome do pai" name={`referenciaIntegrante_${index}_nomePai`} defaultValue={integrante?.nomePai} readOnly />
                        <Field label="Classificação da pessoa" name={`referenciaIntegrante_${index}_classificacao`} defaultValue={integrante?.classificacao} readOnly />
                        <Field label="e-mail" name={`referenciaIntegrante_${index}_email`} defaultValue={integrante?.email} readOnly />
                        <Field label="Telefones" name={`referenciaIntegrante_${index}_telefones`} defaultValue={integrante?.telefones} readOnly />
                        <label className={labelClassName}>
                          <span className="text-sm font-medium text-slate-700">Responsável pela UFPA</span>
                          <PaperBooleanOptions name={`referenciaIntegrante_${index}_responsavelUfpa`} defaultValue={integrante?.responsavelUfpa ?? null} disabled />
                        </label>
                        <Field label="Parentesco" name={`referenciaIntegrante_${index}_parentesco`} defaultValue={integrante?.parentesco} readOnly />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Section>

            <Section title="Políticas públicas">
              <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
                <table className="min-w-[760px] table-fixed border-collapse text-left text-sm">
                  <thead className="bg-slate-100 text-xs uppercase tracking-wide text-slate-600">
                    <tr>
                      <th className="w-1/3 px-4 py-3">Integrante</th>
                      <th className="w-1/3 px-4 py-3">Política Pública Federal</th>
                      <th className="w-1/3 px-4 py-3">Último ano de adesão</th>
                    </tr>
                  </thead>
                  <tbody>
                    {politicaSlots.map((index) => (
                      <tr key={index} className="border-t border-slate-200">
                        <td className="px-4 py-3">
                          <TableInput name={`politica_${index}_integrante`} defaultValue={rowText(politicasPublicas, index, "integrante")} />
                        </td>
                        <td className="px-4 py-3">
                          <TableInput name={`politica_${index}_politicaPublicaFederal`} defaultValue={rowText(politicasPublicas, index, "politicaPublicaFederal")} />
                        </td>
                        <td className="px-4 py-3">
                          <TableInput name={`politica_${index}_ultimoAnoAdesao`} defaultValue={rowText(politicasPublicas, index, "ultimoAnoAdesao")} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>

            <Section title="Indicadores da UFPA - Sociobiodiversidade" description="Perguntas oficiais organizadas por eixo para alimentar métricas e plano de ação." muted>
              <div className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                <Field label="Entidade executora - Nome:" name="indicadorEntidadeExecutoraNome" defaultValue={indicadores?.entidadeExecutoraNome ?? diagnostico?.entidadeExecutoraNome ?? familia.organizacaoColetiva?.entidadeExecutoraNome} />
                <Field label="CNPJ:" name="indicadorEntidadeExecutoraCnpj" defaultValue={indicadores?.entidadeExecutoraCnpj ?? diagnostico?.entidadeExecutoraCnpj ?? familia.organizacaoColetiva?.entidadeExecutoraCnpj} />
                <Field label="Unidade de Serviços/Núcleo Operacional:" name="indicadorUnidadeServicos" defaultValue={indicadores?.unidadeServicos ?? diagnostico?.unidadeServicos ?? familia.organizacaoColetiva?.unidadeServicos} />
                <Field label="Número do instrumento:" name="indicadorNumeroInstrumento" defaultValue={indicadores?.numeroInstrumento ?? diagnostico?.numeroInstrumento ?? familia.organizacaoColetiva?.numeroInstrumento} />
              </div>

              <div className="mb-6">
                <h3 className="mb-4 text-sm font-bold text-zinc-900">Técnicos (Indicadores)</h3>
                <TecnicosSelector
                  options={tecnicosAtivos}
                  defaultValues={indicadoresTecnicos}
                  max={3}
                  prefix="indicadorAgenteAter"
                />
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                <Field label="UF:" name="indicadorLocalUf" defaultValue={indicadores?.localUf ?? diagnostico?.localUf ?? familia.organizacaoColetiva?.uf} />
                <Field label="Município:" name="indicadorLocalMunicipio" defaultValue={indicadores?.localMunicipio ?? diagnostico?.localMunicipio ?? familia.municipio ?? familia.organizacaoColetiva?.municipio} />
                <Field label="Organização Coletiva:" name="indicadorLocalOrganizacaoColetiva" defaultValue={indicadores?.localOrganizacaoColetiva ?? diagnostico?.localOrganizacaoColetiva ?? familia.organizacaoColetiva?.denominacao} />
                <Field label="Data:" name="dataReferencia" type="date" defaultValue={formatDateInput(indicadores?.dataReferencia)} />
                <Field label="Denominação da UFPA:" name="referenciaIndicadorDenominacaoUfpa" defaultValue={familia.nomeFamilia} readOnly />
              </div>
            </Section>

            <Section title="SOCIAL - Segurança Alimentar e Nutricional">
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                <BooleanField label="1. Na sua casa, alguém deixou de ter uma alimentação variada, com frutas, saladas, feijão, arroz e carne?" name="alimentacaoVariadaComprometida" defaultValue={indicadores?.alimentacaoVariadaComprometida} />
                <BooleanField label="2. Alguma vez a comida da sua casa terminou e não havia como comprar mais? (logística, dinheiro, saúde,...)" name="comidaAcabouSemCondicao" defaultValue={indicadores?.comidaAcabouSemCondicao} />
                <BooleanField label="3. Nos últimos 12 meses, você ou alguma pessoa na sua casa teve que comer menos ou deixou de fazer alguma refeição por não havia como comprar mais?" name="deixouRefeicaoSemCondicao" defaultValue={indicadores?.deixouRefeicaoSemCondicao} />
                <BooleanField label="4. Nos últimos 12 meses, você já comeu menos do que deveria, por que não havia como comprar mais?" name="comeuMenosSemCondicao" defaultValue={indicadores?.comeuMenosSemCondicao} />
                <Field label="5. Quantas vezes aconteceu de comer menos do que deveria, porque por que não havia como comprar mais comida, nos últimos 12 meses? Quantidade:" name="qtdVezesComeuMenos" type="number" defaultValue={indicadores?.qtdVezesComeuMenos} />
                <BooleanField label="6. Nos últimos 12 meses, alguma vez sentiu fome, mas não comeu, porque a sua família não pôde comprar comida suficiente?" name="sentiuFomeENaoComeu" defaultValue={indicadores?.sentiuFomeENaoComeu} />
              </div>
            </Section>

            <Section title="SOCIAL - Serviços Sociais Básicos" muted>
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <BooleanField label="1. A família possui documentação pessoal completa?" name="documentacaoPessoalCompleta" defaultValue={indicadores?.documentacaoPessoalCompleta} />
                  <TextArea label="Quais:" name="documentacaoPessoalQuais" defaultValue={indicadores?.documentacaoPessoalQuais} />
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <BooleanField label="2. A família é cadastrada no CadÚnico?" name="cadastradoCadUnico" defaultValue={indicadores?.cadastradoCadUnico} />
                  <TextArea label="Quais:" name="cadUnicoQuais" defaultValue={indicadores?.cadUnicoQuais} />
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <BooleanField label="3. A família acessa Políticas Públicas Sociais?" name="acessaPoliticasSociais" defaultValue={indicadores?.acessaPoliticasSociais} />
                  <TextArea label="Quais:" name="politicasSociaisQuais" defaultValue={indicadores?.politicasSociaisQuais} />
                </div>
              </div>
            </Section>

            <Section title="SOCIAL - Participação comunitária">
              <div className="space-y-5">
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                  <BooleanField label="1. A família participa ativa e frequentemente de algum grupo comunitário?" name="participaGrupoComunitario" defaultValue={indicadores?.participaGrupoComunitario} />
                  <TextArea label="2. Se sim, na questão 1, qual?" name="qualGrupoComunitario" defaultValue={indicadores?.qualGrupoComunitario} />
                </div>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <TernaryField label="a. Associação agropecuário / extrativista / comercialização" name="participaAssociacao" defaultValue={indicadores?.participaAssociacao} />
                  <TernaryField label="b. Cooperativa agropecuário / extrativista / comercialização" name="participaCooperativa" defaultValue={indicadores?.participaCooperativa} />
                  <TernaryField label="c. Grupo informal agropecuário / extrativista / comercializ." name="participaGrupoInformalProdutivo" defaultValue={indicadores?.participaGrupoInformalProdutivo} />
                  <TernaryField label="d. Grupo informal social / político / cultural" name="participaGrupoInformalSocial" defaultValue={indicadores?.participaGrupoInformalSocial} />
                </div>
              </div>
            </Section>

            <Section title="AMBIENTAL - Propriedade com práticas sustentáveis" muted>
              <div className="space-y-6">
                <BooleanField label="1. A UFPA faz uso de práticas sustentáveis de conservação?" name="possuiPraticasSustentaveis" defaultValue={indicadores?.possuiPraticasSustentaveis} />
                <div>
                  <p className="mb-4 text-sm font-bold text-zinc-900">2. Se sim, quais práticas são realizadas?</p>
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                    <TernaryField label="a. Integração de atividades" name="praticaIntegracaoAtividades" defaultValue={indicadores?.praticaIntegracaoAtividades} />
                    <TernaryField label="b. Descarte correto de embalagens" name="praticaDescarteCorretoEmbalagens" defaultValue={indicadores?.praticaDescarteCorretoEmbalagens} />
                    <TernaryField label="c. Controle das queimadas" name="praticaControleQueimadas" defaultValue={indicadores?.praticaControleQueimadas} />
                    <TernaryField label="d. Adubação verde" name="praticaAdubacaoVerde" defaultValue={indicadores?.praticaAdubacaoVerde} />
                    <TernaryField label="e. Recuperação de pastagens" name="praticaRecuperacaoPastagens" defaultValue={indicadores?.praticaRecuperacaoPastagens} />
                    <TernaryField label="f. Cobertura de solo / manejo de plantas" name="praticaCoberturaSolo" defaultValue={indicadores?.praticaCoberturaSolo} />
                    <TernaryField label="g. Manejo integrado de pragas" name="praticaManejoIntegradoPragas" defaultValue={indicadores?.praticaManejoIntegradoPragas} />
                    <TernaryField label="h. Cordões de vegetação permanente (e afins)" name="praticaCordoesVegetacao" defaultValue={indicadores?.praticaCordoesVegetacao} />
                    <TernaryField label="i. Rotação de culturas" name="praticaRotacaoCulturas" defaultValue={indicadores?.praticaRotacaoCulturas} />
                    <TernaryField label="j. Sistema plantio direto" name="praticaPlantioDireto" defaultValue={indicadores?.praticaPlantioDireto} />
                    <TernaryField label="k. Pousio" name="praticaPousio" defaultValue={indicadores?.praticaPousio} />
                    <TernaryField label="l. Proteção de nascentes" name="praticaProtecaoNascentes" defaultValue={indicadores?.praticaProtecaoNascentes} />
                    <TernaryField label="m. Preservação das APPs" name="praticaPreservacaoApps" defaultValue={indicadores?.praticaPreservacaoApps} />
                    <TernaryField label="n. Manejo florestal de áreas de extrativismo" name="praticaManejoFlorestal" defaultValue={indicadores?.praticaManejoFlorestal} />
                    <TernaryField label="o. Recomposição florestal" name="praticaRecomposicaoFlorestal" defaultValue={indicadores?.praticaRecomposicaoFlorestal} />
                  </div>
                  <div className="mt-5">
                    <TextArea label="Outras práticas sustentáveis (Quais?)" name="praticasSustentaveisQuais" defaultValue={indicadores?.praticasSustentaveisQuais} />
                  </div>
                </div>
                <div className="border-t border-slate-200 pt-6">
                  <p className="mb-4 text-sm font-semibold text-slate-900">3. Se não na questão 1, qual o motivo?</p>
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <TernaryField label="a. Questão financeira" name="motivoSemPraticaFinanceiro" defaultValue={indicadores?.motivoSemPraticaFinanceiro} />
                    <TernaryField label="b. Falta de informação" name="motivoSemPraticaFaltaInformacao" defaultValue={indicadores?.motivoSemPraticaFaltaInformacao} />
                    <TernaryField label="c. Questão tecnológica" name="motivoSemPraticaTecnologico" defaultValue={indicadores?.motivoSemPraticaTecnologico} />
                    <TernaryField label="d. Falta de interesse" name="motivoSemPraticaFaltaInteresse" defaultValue={indicadores?.motivoSemPraticaFaltaInteresse} />
                  </div>
                </div>
              </div>
            </Section>

            <Section title="ECONÔMICO - Valor bruto da produção">
              <Field
                label="Valor total dos últimos 12 meses: R$"
                name="valorBrutoProducaoUltimos12Meses"
                type="number"
                step="0.01"
                defaultValue={indicadores?.valorBrutoProducaoUltimos12Meses?.toString()}
              />
            </Section>

            <Section title="ECONÔMICO - Família com acesso a política pública" muted>
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <BooleanField label="1. A família acessa Políticas Públicas Produtivas?" name="acessaPoliticasProdutivas" defaultValue={indicadores?.acessaPoliticasProdutivas} />
                  <BooleanField label="3. A família já acessou o PAA?" name="acessouPaa" defaultValue={indicadores?.acessouPaa} />
                  <BooleanField label="4. A família já acessou o PNAE?" name="acessouPnae" defaultValue={indicadores?.acessouPnae} />
                  <BooleanField label="5. A família já acessou o Política de Garantia de Preços Mínimos para Produtos da Sociobiodiversidade (PGPM-Bio)?" name="acessouPgpmBio" defaultValue={indicadores?.acessouPgpmBio} />
                  <BooleanField label="6. Você já acessou o PRONAF?" name="acessouPronaf" defaultValue={indicadores?.acessouPronaf} />
                </div>
                <div>
                  <p className="mb-4 text-sm font-semibold text-slate-900">2. Se não na questão 1, qual o motivo?</p>
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                    <TernaryField label="a. Falta de informação" name="motivoNaoAcessaPoliticasFaltaInfo" defaultValue={indicadores?.motivoNaoAcessaPoliticasFaltaInfo} />
                    <TernaryField label="b. Difícil acesso" name="motivoNaoAcessaPoliticasDificilAcesso" defaultValue={indicadores?.motivoNaoAcessaPoliticasDificilAcesso} />
                    <TernaryField label="c. Sem necessidade / interesse" name="motivoNaoAcessaPoliticasSemInteresse" defaultValue={indicadores?.motivoNaoAcessaPoliticasSemInteresse} />
                  </div>
                </div>
                <div>
                  <p className="mb-4 text-sm font-semibold text-slate-900">7. Se sim na questão 6, qual?</p>
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {PRONAF_LINHAS_UFPA.map((item, index) => (
                      <TernaryField
                        key={item.field}
                        label={`${String.fromCharCode(97 + index)}) ${item.label}`}
                        name={item.field}
                        defaultValue={getPronafDefault(indicadores?.linhasPronaf, item.label)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </Section>

            <Section title="ECONÔMICO - Canais de comercialização">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                <BooleanField label="1. Troca por outro produto ou serviço" name="canalTrocaProdutoServico" defaultValue={indicadores?.canalTrocaProdutoServico} />
                <BooleanField label="2. Venda na propriedade" name="canalVendaPropriedade" defaultValue={indicadores?.canalVendaPropriedade} />
                <BooleanField label="3. Venda direta ao consumidor" name="canalVendaDiretaConsumidor" defaultValue={indicadores?.canalVendaDiretaConsumidor} />
                <BooleanField label="4. Feira" name="canalFeira" defaultValue={indicadores?.canalFeira} />
                <BooleanField label="5. Mercado local" name="canalMercadoLocal" defaultValue={indicadores?.canalMercadoLocal} />
                <BooleanField label="6. Atravessador" name="canalAtravessador" defaultValue={indicadores?.canalAtravessador} />
                <BooleanField label="7. PAA" name="canalPaa" defaultValue={indicadores?.canalPaa} />
                <BooleanField label="8. PNAE" name="canalPnae" defaultValue={indicadores?.canalPnae} />
                <BooleanField label="9. Cooperativa / entreposto" name="canalCooperativaEntreposto" defaultValue={indicadores?.canalCooperativaEntreposto} />
              </div>
            </Section>

            <Section title="Proteção de Dados Pessoais e observações" description="Controle final do diagnóstico e conformidade com a LGPD." muted>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                <BooleanField label="Consentimento LGPD?" name="lgpdConsentimento" defaultValue={diagnostico?.lgpdConsentimento} />
                <Field label="Data do consentimento" name="lgpdDataConsentimento" type="date" defaultValue={formatDateInput(diagnostico?.lgpdDataConsentimento)} />
                <Field label="Representante" name="representanteNome" defaultValue={diagnostico?.representanteNome} />
                <Field label="CPF do representante" name="representanteCpf" defaultValue={diagnostico?.representanteCpf} />
              </div>

              <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-sm font-bold text-zinc-900">Anexo do Termo assinado</h3>
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                  <label className="block">
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Foto ou Escaneamento do Termo físico</span>
                    <input
                      type="file"
                      name="anexoLgpd"
                      accept="image/*,application/pdf"
                      className="mt-2 w-full text-sm text-zinc-500 file:mr-4 file:rounded-xl file:border-0 file:bg-emerald-50 file:px-4 file:py-2 file:text-xs file:font-bold file:text-emerald-700 hover:file:bg-emerald-100"
                    />
                    {diagnostico?.anexoLgpdUrl && (
                      <p className="mt-2 text-xs font-medium text-emerald-600">
                        Arquivo já enviado. Para substituir, selecione um novo.
                      </p>
                    )}
                  </label>
                  <Field
                    label="Referência do Termo (Pasta/Código)"
                    name="referenciaAnexoLgpd"
                    defaultValue={diagnostico?.referenciaAnexoLgpd}
                    placeholder="Ex: Pasta 04 / Ficha 2026-001"
                  />
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
                <TextArea label="Observações do diagnóstico" name="observacoesDiagnostico" defaultValue={diagnostico?.observacoes} />
                <TextArea label="Observações dos indicadores" name="observacoesIndicadores" defaultValue={indicadores?.observacoes} />
              </div>
            </Section>

            <div className="flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-2xl text-sm leading-6 text-slate-500">
                Os campos acima são estruturados para alimentar métricas de acompanhamento e plano de ação da UFPA.
              </p>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-100"
              >
                Salvar diagnóstico
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
