import Link from "next/link";
import { redirect } from "next/navigation";

import { PaperBooleanOptions, PaperBooleanField } from "@/components/ater/paper-boolean-field";
import { DynamicLists } from "@/components/ater-sociobio/familias/dynamic-lists";
import { IntegrantesForm } from "@/components/ater/integrantes-form";
import { criarFamilia } from "@/lib/actions/familias";
import {
  AterSociobioService,
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
            {/* 1. Top Fields */}
            <Section title="Dados Gerais" description="Informações do projeto e técnico responsável.">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <label className={labelClassName}>
                  <span className="text-sm font-medium text-zinc-700">Projeto</span>
                  <select name="projeto" className={inputClassName}>
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
                <Field label="Técnico" name="tecnico" />
                <Field label="Data de Cadastro" name="dataCadastro" type="date" />
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
                  <PaperBooleanOptions name="lgpdConsentimento" />
                </label>
                <Field label="Data do consentimento" name="lgpdDataConsentimento" type="date" />
                <Field label="Representante (Nome)" name="representanteNome" />
                <Field label="Representante (CPF)" name="representanteCpf" />
                <Field label="Anexo do Termo Assinado (PDF/Imagem)" name="referenciaAnexoLgpd" type="file" className="lg:col-span-4" />
              </div>
            </section>

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
                <div className="grid grid-cols-1 gap-2">
                  <Field label="DAP/CAF" name="dapCaf" />
                  <div className="flex gap-2">
                    <Field label="Órgão Emissor" name="dapCafOrgaoEmissor" className="w-1/2" />
                    <Field label="Validade" name="dapCafValidade" type="date" className="w-1/2" />
                  </div>
                </div>
                <Field label="Código SGA" name="codigoSGA" placeholder="Código gerado no SGA da Anater" />
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
                <Field label="Complemento" name="complementoUfpa" />
                <Field label="CEP" name="cepUfpa" />
                <Field label="Latitude (decimal)" name="latitude" placeholder="-3.123456" />
                <Field label="Longitude (decimal)" name="longitude" placeholder="-60.123456" />
              </div>
            </Section>

            {/* 3. Dynamic Lists (Patrimonios e Atividades) */}
            <DynamicLists />

            {/* 4. Diagnostico Info */}
            <Section title="Meios de Comunicação">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <PaperBooleanField name="possuiRadio" label="Rádio" />
                <PaperBooleanField name="possuiTelevisao" label="Televisão" />
                <PaperBooleanField name="possuiCelular" label="Celular" />
                <PaperBooleanField name="possuiInternet" label="Internet" />
                <PaperBooleanField name="usaRedesSociais" label="Redes Sociais" />
                <PaperBooleanField name="possuiOutroMeioComunicacao" label="Outro" />
              </div>
              <div className="mt-4">
                <Field label="Outros meios (Ex: Carta, Rádio amador)" name="outroMeioComunicacao" />
              </div>
            </Section>

            <Section title="Saneamento">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <PaperBooleanField name="aguaParaConsumo" label="Água para Consumo" />
                <PaperBooleanField name="aguaConsumoTratada" label="Água Tratada" />
                <PaperBooleanField name="aguaParaProducao" label="Água para Produção" />
                <PaperBooleanField name="captacaoAguaChuva" label="Captação de Chuva" />
                <PaperBooleanField name="esgotoTratado" label="Esgoto Tratado" />
                <PaperBooleanField name="fontesProtegidas" label="Fontes Protegidas" />
              </div>
            </Section>

            <Section title="Recursos e Atividades Coletivas">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-bold text-zinc-900 mb-3 text-sm">Recursos Disponíveis (Produção e Beneficiamento)</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {["Água para irrigação", "Energia elétrica", "Equipamentos agrícolas", "Veículo para transporte", "Local para armazenamento", "Local para beneficiamento", "Crédito rural"].map(opt => (
                      <label key={opt} className="flex items-start gap-3 text-sm font-medium text-zinc-800 hover:text-zinc-900 cursor-pointer">
                        <input type="checkbox" name="recursosDisponiveis" value={opt} className="mt-0.5 h-4 w-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500" />
                        <span className="leading-tight">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-zinc-900 mb-3 text-sm">Participação em Atividades Coletivas</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {["Reuniões comunitárias", "Mutirões", "Festas tradicionais", "Assembleias sindicais", "Feiras locais", "Cursos e capacitações"].map(opt => (
                      <label key={opt} className="flex items-start gap-3 text-sm font-medium text-zinc-800 hover:text-zinc-900 cursor-pointer">
                        <input type="checkbox" name="atividadesColetivas" value={opt} className="mt-0.5 h-4 w-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500" />
                        <span className="leading-tight">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
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
                          <input type="checkbox" name="acoesPotenciaisProdutivo" value={opt} className="mt-0.5 h-4 w-4 rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500" />
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
                          <input type="checkbox" name="acoesPotenciaisSocial" value={opt} className="mt-0.5 h-4 w-4 rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500" />
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
                          <input type="checkbox" name="acoesPotenciaisAmbiental" value={opt} className="mt-0.5 h-4 w-4 rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500" />
                          <span className="leading-tight">{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-emerald-100/50">
                    <Field label="Outras Ações Potenciais (texto livre)" name="outrasAcoesPotenciais" />
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
                          <input type="checkbox" name="limitacoesProdutivo" value={opt} className="mt-0.5 h-4 w-4 rounded border-rose-300 text-rose-600 focus:ring-rose-500" />
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
                          <input type="checkbox" name="limitacoesSocial" value={opt} className="mt-0.5 h-4 w-4 rounded border-rose-300 text-rose-600 focus:ring-rose-500" />
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
                          <input type="checkbox" name="limitacoesAmbiental" value={opt} className="mt-0.5 h-4 w-4 rounded border-rose-300 text-rose-600 focus:ring-rose-500" />
                          <span className="leading-tight">{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-rose-100/50">
                    <Field label="Outras Limitações (texto livre)" name="outrasLimitacoes" />
                  </div>
                </div>
              </div>
            </Section>

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
  const isFile = type === "file";
  const finalInputClass = isFile 
    ? `mt-2 w-full text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer` 
    : inputClassName;

  return (
    <label className={`${labelClassName} ${className}`}>
      <span className="text-sm font-medium text-zinc-700">{label}</span>
      <input name={name} type={type} step={step} required={required} className={finalInputClass} placeholder={placeholder} />
    </label>
  );
}
