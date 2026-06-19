import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { PaperBooleanOptions, PaperBooleanField } from "@/components/ater/paper-boolean-field";
import { DynamicLists } from "@/components/ater-sociobio/familias/dynamic-lists";
import { IntegrantesForm } from "@/components/ater/integrantes-form";
import { AterSetupWarning } from "@/components/ater/setup-warning";
import { Header } from "@/components/dashboard/header";
import { atualizarFamilia } from "@/lib/actions/familias";
import { ATER_SETUP_ERROR } from "@/lib/ater-runtime";
import {
  AterSociobioService,
  type FamiliaWithCadastro,
  type OrganizacaoColetivaListItem,
} from "@/lib/services/ater-sociobio.service";
import {
  ATER_SOCIOBIO_MUNICIPIOS,
  ATER_SOCIOBIO_POTENCIALIDADES_PRODUTIVO,
  ATER_SOCIOBIO_POTENCIALIDADES_SOCIAL,
  ATER_SOCIOBIO_POTENCIALIDADES_AMBIENTAL,
  ATER_SOCIOBIO_LIMITACOES_PRODUTIVO,
  ATER_SOCIOBIO_LIMITACOES_SOCIAL,
  ATER_SOCIOBIO_LIMITACOES_AMBIENTAL,
} from "@/lib/constants/ater-sociobio";

const inputClassName =
  "mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15";

const labelClassName = "block";

export const dynamic = "force-dynamic";

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

function asText(value: unknown) {
  return typeof value === "string" || typeof value === "number" ? String(value) : "";
}

function joinJsonArray(value: unknown) {
  if (Array.isArray(value)) {
    return value.join(", ");
  }
  return "";
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
              
              {/* 1. Top Fields */}
              <Section title="Dados Gerais" description="Informações do projeto e técnico responsável.">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <label className={labelClassName}>
                    <span className="text-sm font-medium text-zinc-700">Projeto</span>
                    <select name="projeto" defaultValue={familia.projeto ?? ""} className={inputClassName}>
                      <option value="">Selecione...</option>
                      <option value="Ater - Sociobiodiversidade">Ater - Sociobiodiversidade</option>
                      <option value="Rede de Quintais Agroecológicos e Produtivos Amazônicos - Da Terra à Mesa">Rede de Quintais Agroecológicos e Produtivos Amazônicos</option>
                      <option value="Mulheres Rurais, Autonomia, Alimentação e Vidas Saudáveis">Mulheres Rurais, Autonomia</option>
                      <option value="Quintais Produtivos para Mulheres Rurais">Quintais Produtivos</option>
                      <option value="Capacitação e formação em ATER">Capacitação e formação em ATER</option>
                      <option value="Capacitação e formação em ATER II">Capacitação e formação em ATER II</option>
                      <option value="Outros">Outros...</option>
                    </select>
                  </label>
                  <Field label="Técnico" name="tecnico" defaultValue={familia.tecnico ?? ""} />
                  <Field label="Data de Cadastro" name="dataCadastro" type="date" defaultValue={familia.dataCadastro ? new Date(familia.dataCadastro).toISOString().split('T')[0] : ""} />
                </div>
              </Section>

              {/* 2. LGPD moved up */}
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
                    <PaperBooleanOptions name="lgpdConsentimento" defaultValue={familia.lgpdConsentimento} />
                  </label>
                  <Field label="Data do consentimento" name="lgpdDataConsentimento" type="date" defaultValue={familia.lgpdDataConsentimento ? new Date(familia.lgpdDataConsentimento).toISOString().split('T')[0] : ""} />
                  <Field label="Representante (Nome)" name="representanteNome" defaultValue={familia.representanteNome ?? ""} />
                  <Field label="Representante (CPF)" name="representanteCpf" defaultValue={familia.representanteCpf ?? ""} />
                  <Field label="Anexo do Termo Assinado (PDF/Imagem)" name="referenciaAnexoLgpd" type="file" className="lg:col-span-4" />
                </div>
              </section>

              <Section title="Identificação e Localização" description="Dados básicos da unidade familiar e vínculo organizacional.">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <Field label="Nome da UFPA/Denominação *" name="nomeFamilia" required defaultValue={familia.nomeFamilia} className="lg:col-span-2" />
                  <Field label="Responsável (Referência) *" name="nomeResponsavel" required defaultValue={familia.nomeResponsavel ?? ""} />
                  <Field label="CPF do Responsável *" name="documentoResponsavel" required defaultValue={familia.documentoResponsavel ?? ""} />

                  <label className={labelClassName}>
                    <span className="text-sm font-medium text-zinc-700">Município *</span>
                    <select name="municipio" required defaultValue={familia.municipio ?? ""} className={inputClassName}>
                      <option value="">Selecione...</option>
                      {ATER_SOCIOBIO_MUNICIPIOS.map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </label>

                  <Field label="Comunidade" name="comunidade" defaultValue={familia.comunidade ?? ""} />

                  <label className={labelClassName}>
                    <span className="text-sm font-medium text-zinc-700">Organização Coletiva</span>
                    <select name="organizacaoColetivaId" defaultValue={familia.organizacaoColetivaId ?? ""} className={inputClassName}>
                      <option value="">Nenhuma / Sem vínculo</option>
                      {organizacoes.map((org) => (
                        <option key={org.id} value={org.id}>{org.denominacao}</option>
                      ))}
                    </select>
                  </label>

                  <Field label="Grupo de Interesse" name="grupoInteresse" defaultValue={familia.grupoInteresse ?? ""} />
                  <div className="grid grid-cols-1 gap-2">
                    <Field label="DAP/CAF" name="dapCaf" defaultValue={familia.dapCaf ?? ""} />
                    <div className="flex gap-2">
                      <Field label="Órgão Emissor" name="dapCafOrgaoEmissor" defaultValue={familia.dapCafOrgaoEmissor ?? ""} className="w-1/2" />
                      <Field label="Validade" name="dapCafValidade" type="date" defaultValue={familia.dapCafValidade ? new Date(familia.dapCafValidade).toISOString().split('T')[0] : ""} className="w-1/2" />
                    </div>
                  </div>
                  <Field label="Código SGA" name="codigoSGA" defaultValue={familia.codigoSGA ?? ""} placeholder="Código gerado no SGA da Anater" />
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

              <Section title="Dados Complementares" description="Informações técnicas adicionais sobre a propriedade.">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <Field label="Área total (ha)" name="areaEstabelecimento" type="number" step="0.01" defaultValue={familia.areaEstabelecimento?.toString() ?? ""} />
                  <Field label="Área imóvel principal (ha)" name="areaImovelPrincipal" type="number" step="0.01" defaultValue={familia.areaImovelPrincipal?.toString() ?? ""} />
                  <Field label="Bioma" name="bioma" defaultValue={familia.bioma ?? ""} />
                  <Field label="Programa de Fomento" name="programaFomento" defaultValue={familia.programaFomento ?? ""} />
                  <Field label="Classificação da UFPA" name="classificacaoUfpa" defaultValue={familia.classificacaoUfpa ?? ""} />
                  <Field label="Endereço/Acesso" name="enderecoUfpa" defaultValue={familia.enderecoUfpa ?? ""} className="lg:col-span-2" />
                  <Field label="Complemento" name="complementoUfpa" defaultValue={familia.complementoUfpa ?? ""} />
                  <Field label="CEP" name="cepUfpa" defaultValue={familia.cepUfpa ?? ""} />
                  <Field label="Latitude (decimal)" name="latitude" defaultValue={familia.latitude?.toString() ?? ""} placeholder="-3.123456" />
                  <Field label="Longitude (decimal)" name="longitude" defaultValue={familia.longitude?.toString() ?? ""} placeholder="-60.123456" />
                </div>
              </Section>

              {/* 3. Dynamic Lists (Patrimonios e Atividades) */}
              <DynamicLists 
                defaultPatrimonios={Array.isArray(familia.patrimonios) ? familia.patrimonios : []} 
                defaultAtividades={Array.isArray(familia.atividadesProdutivas) ? familia.atividadesProdutivas : (Array.isArray(familia.envioSGAPorAtividade) ? familia.envioSGAPorAtividade : [])} 
              />

              {/* 4. Diagnostico Info */}
              <Section title="Meios de Comunicação">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <PaperBooleanField name="possuiRadio" label="Rádio" defaultValue={familia.possuiRadio} />
                  <PaperBooleanField name="possuiTelevisao" label="Televisão" defaultValue={familia.possuiTelevisao} />
                  <PaperBooleanField name="possuiCelular" label="Celular" defaultValue={familia.possuiCelular} />
                  <PaperBooleanField name="possuiInternet" label="Internet" defaultValue={familia.possuiInternet} />
                  <PaperBooleanField name="usaRedesSociais" label="Redes Sociais" defaultValue={familia.usaRedesSociais} />
                  <PaperBooleanField name="possuiOutroMeioComunicacao" label="Outro" defaultValue={familia.possuiOutroMeioComunicacao} />
                </div>
                <div className="mt-4">
                  <Field label="Outros meios (Ex: Carta, Rádio amador)" name="outroMeioComunicacao" defaultValue={familia.outroMeioComunicacao ?? ""} />
                </div>
              </Section>

              <Section title="Saneamento">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <PaperBooleanField name="aguaParaConsumo" label="Água para Consumo" defaultValue={familia.aguaParaConsumo} />
                  <PaperBooleanField name="aguaConsumoTratada" label="Água Tratada" defaultValue={familia.aguaConsumoTratada} />
                  <PaperBooleanField name="aguaParaProducao" label="Água para Produção" defaultValue={familia.aguaParaProducao} />
                  <PaperBooleanField name="captacaoAguaChuva" label="Captação de Chuva" defaultValue={familia.captacaoAguaChuva} />
                  <PaperBooleanField name="esgotoTratado" label="Esgoto Tratado" defaultValue={familia.esgotoTratado} />
                  <PaperBooleanField name="fontesProtegidas" label="Fontes Protegidas" defaultValue={familia.fontesProtegidas} />
                </div>
              </Section>

              <Section title="Ações Potenciais e Limitações" description="Marque os itens que se aplicam em cada eixo.">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Ações Potenciais Card */}
                <div className="rounded-3xl border border-emerald-100 bg-emerald-50/30 p-6 shadow-sm space-y-8">
                  <h3 className="text-lg font-bold text-emerald-900 border-b border-emerald-100 pb-2">Ações Potenciais</h3>
                  
                  <div>
                    <span className="block text-sm font-bold text-emerald-700 mb-3">Eixo Produtivo</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {ATER_SOCIOBIO_POTENCIALIDADES_PRODUTIVO.map(opt => (
                        <label key={opt} className="flex items-start gap-3 text-sm font-medium text-zinc-800 hover:text-zinc-900 cursor-pointer">
                          <input type="checkbox" name="acoesPotenciaisProdutivo" value={opt} defaultChecked={Array.isArray(familia.acoesPotenciaisProdutivo) && familia.acoesPotenciaisProdutivo.includes(opt)} className="mt-0.5 h-4 w-4 rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500" />
                          <span className="leading-tight">{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <span className="block text-sm font-bold text-emerald-700 mb-3">Eixo Social</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {ATER_SOCIOBIO_POTENCIALIDADES_SOCIAL.map(opt => (
                        <label key={opt} className="flex items-start gap-3 text-sm font-medium text-zinc-800 hover:text-zinc-900 cursor-pointer">
                          <input type="checkbox" name="acoesPotenciaisSocial" value={opt} defaultChecked={Array.isArray(familia.acoesPotenciaisSocial) && familia.acoesPotenciaisSocial.includes(opt)} className="mt-0.5 h-4 w-4 rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500" />
                          <span className="leading-tight">{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <span className="block text-sm font-bold text-emerald-700 mb-3">Eixo Ambiental</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {ATER_SOCIOBIO_POTENCIALIDADES_AMBIENTAL.map(opt => (
                        <label key={opt} className="flex items-start gap-3 text-sm font-medium text-zinc-800 hover:text-zinc-900 cursor-pointer">
                          <input type="checkbox" name="acoesPotenciaisAmbiental" value={opt} defaultChecked={Array.isArray(familia.acoesPotenciaisAmbiental) && familia.acoesPotenciaisAmbiental.includes(opt)} className="mt-0.5 h-4 w-4 rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500" />
                          <span className="leading-tight">{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-emerald-100/50">
                    <Field label="Outras Ações Potenciais (texto livre)" name="outrasAcoesPotenciais" defaultValue={familia.outrasAcoesPotenciais ?? ""} />
                  </div>
                </div>

                {/* Limitações Card */}
                <div className="rounded-3xl border border-rose-100 bg-rose-50/30 p-6 shadow-sm space-y-8">
                  <h3 className="text-lg font-bold text-rose-900 border-b border-rose-100 pb-2">Limitações</h3>
                  
                  <div>
                    <span className="block text-sm font-bold text-rose-700 mb-3">Eixo Produtivo</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {ATER_SOCIOBIO_LIMITACOES_PRODUTIVO.map(opt => (
                        <label key={opt} className="flex items-start gap-3 text-sm font-medium text-zinc-800 hover:text-zinc-900 cursor-pointer">
                          <input type="checkbox" name="limitacoesProdutivo" value={opt} defaultChecked={Array.isArray(familia.limitacoesProdutivo) && familia.limitacoesProdutivo.includes(opt)} className="mt-0.5 h-4 w-4 rounded border-rose-300 text-rose-600 focus:ring-rose-500" />
                          <span className="leading-tight">{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <span className="block text-sm font-bold text-rose-700 mb-3">Eixo Social</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {ATER_SOCIOBIO_LIMITACOES_SOCIAL.map(opt => (
                        <label key={opt} className="flex items-start gap-3 text-sm font-medium text-zinc-800 hover:text-zinc-900 cursor-pointer">
                          <input type="checkbox" name="limitacoesSocial" value={opt} defaultChecked={Array.isArray(familia.limitacoesSocial) && familia.limitacoesSocial.includes(opt)} className="mt-0.5 h-4 w-4 rounded border-rose-300 text-rose-600 focus:ring-rose-500" />
                          <span className="leading-tight">{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <span className="block text-sm font-bold text-rose-700 mb-3">Eixo Ambiental</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {ATER_SOCIOBIO_LIMITACOES_AMBIENTAL.map(opt => (
                        <label key={opt} className="flex items-start gap-3 text-sm font-medium text-zinc-800 hover:text-zinc-900 cursor-pointer">
                          <input type="checkbox" name="limitacoesAmbiental" value={opt} defaultChecked={Array.isArray(familia.limitacoesAmbiental) && familia.limitacoesAmbiental.includes(opt)} className="mt-0.5 h-4 w-4 rounded border-rose-300 text-rose-600 focus:ring-rose-500" />
                          <span className="leading-tight">{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-rose-100/50">
                    <Field label="Outras Limitações (texto livre)" name="outrasLimitacoes" defaultValue={familia.outrasLimitacoes ?? ""} />
                  </div>
                </div>
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

function Field({
  label,
  name,
  type = "text",
  step,
  required = false,
  className = "",
  placeholder,
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  step?: string;
  required?: boolean;
  className?: string;
  placeholder?: string;
  defaultValue?: string;
}) {
  const isFile = type === "file";
  const finalInputClass = isFile 
    ? `mt-2 w-full text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer` 
    : inputClassName;

  return (
    <label className={`${labelClassName} ${className}`}>
      <span className="text-sm font-medium text-zinc-700">{label}</span>
      <input name={name} type={type} step={step} required={required} defaultValue={defaultValue} className={finalInputClass} placeholder={placeholder} />
    </label>
  );
}
