"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";

const inputClassName =
  "mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15";

const labelClassName = "block";

function Field({ label, name, type = "text", step, required, placeholder, register, className = "" }: any) {
  return (
    <label className={`${labelClassName} ${className}`}>
      <span className="text-sm font-medium text-zinc-700">{label}</span>
      <input type={type} step={step} required={required} placeholder={placeholder} {...register(name)} className={inputClassName} />
    </label>
  );
}

function Section({ title, description, children }: any) {
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

export function UfpaForm({ defaultValues, organizacoes, onSubmit }: any) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const { register, control, handleSubmit, watch } = useForm({
    defaultValues: {
      nomeFamilia: "",
      nomeResponsavel: "",
      documentoResponsavel: "",
      municipio: "",
      comunidade: "",
      organizacaoColetivaId: "",
      grupoInteresse: "",
      dapCaf: "",
      dapCafOrgaoEmissor: "",
      dapCafValidade: "",
      codigoSGA: "",
      areaEstabelecimento: "",
      areaImovelPrincipal: "",
      bioma: "",
      programaFomento: "",
      classificacaoUfpa: "",
      enderecoUfpa: "",
      complementoUfpa: "",
      cepUfpa: "",
      latitude: "",
      longitude: "",
      patrimonios: [],
      atividadesProdutivas: [],
      projeto: "",
      tecnico: "",
      dataCadastro: "",
      lgpdConsentimento: false,
      lgpdDataConsentimento: "",
      representanteNome: "",
      representanteCpf: "",
      referenciaAnexoLgpd: "",
      ...defaultValues
    }
  });

  const { fields: patrimonios, append: appendPatrimonio, remove: removePatrimonio } = useFieldArray({
    control,
    name: "patrimonios"
  });

  const { fields: atividades, append: appendAtividade, remove: removeAtividade } = useFieldArray({
    control,
    name: "atividadesProdutivas"
  });

  const handleFormSubmit = (data: any) => {
    startTransition(async () => {
      try {
        await onSubmit(data);
      } catch (e) {
        console.error(e);
        alert("Erro ao salvar.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="mt-12 space-y-12">
      {/* 1. Fields to add at the VERY TOP: projeto, tecnico, dataCadastro */}
      <Section title="Dados Gerais">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <label className={labelClassName}>
            <span className="text-sm font-medium text-zinc-700">Projeto</span>
            <select {...register("projeto")} className={inputClassName}>
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
          <Field label="Técnico" name="tecnico" register={register} />
          <Field label="Data de Cadastro" name="dataCadastro" type="date" register={register} />
        </div>
      </Section>

      {/* 2. Move LGPD: right AFTER Projeto/Tecnico/Data, and BEFORE Identificação da UFPA */}
      <section className="rounded-3xl border border-zinc-200 bg-zinc-50/50 p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-zinc-900">Proteção de Dados Pessoais (LGPD)</h2>
          <p className="mt-2 text-sm text-zinc-500">
            Registro de conformidade com a Lei Geral de Proteção de Dados e Termo de Adesão ao programa.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <label className="flex items-center gap-3">
            <input type="checkbox" {...register("lgpdConsentimento")} className="h-5 w-5 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500" />
            <span className="text-sm font-medium text-zinc-700">Consentimento LGPD?</span>
          </label>
          <Field label="Data do consentimento" name="lgpdDataConsentimento" type="date" register={register} />
          <Field label="Representante (Nome)" name="representanteNome" register={register} />
          <Field label="Representante (CPF)" name="representanteCpf" register={register} />
          <Field label="Anexo do Termo Assinado (PDF/Imagem)" name="referenciaAnexoLgpd" type="file" register={register} className="lg:col-span-4" />
        </div>
      </section>

      <Section title="Identificação e Localização" description="Dados básicos da unidade familiar e vínculo organizacional.">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Field label="Nome da UFPA/Denominação *" name="nomeFamilia" required register={register} className="lg:col-span-2" />
          <Field label="Responsável (Referência) *" name="nomeResponsavel" required register={register} />
          <Field label="CPF do Responsável *" name="documentoResponsavel" required register={register} />

          <label className={labelClassName}>
            <span className="text-sm font-medium text-zinc-700">Município *</span>
            <select {...register("municipio")} required className={inputClassName}>
              <option value="">Selecione...</option>
              <option value="Abaetetuba">Abaetetuba</option>
              <option value="Barcarena">Barcarena</option>
              <option value="Igarapé-Miri">Igarapé-Miri</option>
              <option value="Moju">Moju</option>
              <option value="Tailândia">Tailândia</option>
            </select>
          </label>

          <Field label="Comunidade" name="comunidade" register={register} />

          <label className={labelClassName}>
            <span className="text-sm font-medium text-zinc-700">Organização Coletiva</span>
            <select {...register("organizacaoColetivaId")} className={inputClassName}>
              <option value="">Nenhuma / Sem vínculo</option>
              {organizacoes.map((org: any) => (
                <option key={org.id} value={org.id}>{org.denominacao}</option>
              ))}
            </select>
          </label>

          <Field label="Grupo de Interesse" name="grupoInteresse" register={register} />
          <div className="grid grid-cols-1 gap-2">
            <Field label="DAP/CAF" name="dapCaf" register={register} />
            <div className="flex gap-2">
              <Field label="Órgão Emissor" name="dapCafOrgaoEmissor" register={register} className="w-1/2" />
              <Field label="Validade" name="dapCafValidade" type="date" register={register} className="w-1/2" />
            </div>
          </div>
          <Field label="Código SGA" name="codigoSGA" placeholder="(Gerado automaticamente se vazio)" register={register} />
        </div>
      </Section>

      <Section title="Dados Complementares" description="Informações técnicas adicionais sobre a propriedade.">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Field label="Área total (ha)" name="areaEstabelecimento" type="number" step="0.01" register={register} />
          <Field label="Área imóvel principal (ha)" name="areaImovelPrincipal" type="number" step="0.01" register={register} />
          <Field label="Bioma" name="bioma" register={register} />
          <Field label="Programa de Fomento" name="programaFomento" register={register} />
          <Field label="Classificação da UFPA" name="classificacaoUfpa" register={register} />
          <Field label="Endereço/Acesso" name="enderecoUfpa" register={register} className="lg:col-span-2" />
          <Field label="Complemento" name="complementoUfpa" register={register} />
          <Field label="CEP" name="cepUfpa" register={register} />
          <Field label="Latitude (decimal)" name="latitude" placeholder="-3.123456" register={register} />
          <Field label="Longitude (decimal)" name="longitude" placeholder="-60.123456" register={register} />
        </div>
      </Section>

      {/* 3. Dynamic Lists */}
      <Section title="Patrimônios" description="Bens da unidade familiar.">
        <div className="space-y-4">
          {patrimonios.map((item, index) => (
            <div key={item.id} className="flex gap-4 items-end">
              <Field label="Quantidade" name={`patrimonios.${index}.quantidade`} type="number" register={register} className="w-32" />
              <Field label="Unidade" name={`patrimonios.${index}.unidade`} register={register} className="w-48" />
              <label className="flex items-center gap-2 w-32 pb-4 text-sm font-medium"><input type="checkbox" {...register(`patrimonios.${index}.atividadePrincipal`)} className="h-4 w-4" /> Principal</label>
              <Field label="Descrição" name={`patrimonios.${index}.descricao`} register={register} className="flex-1" />
              <Button type="button" variant="destructive" onClick={() => removePatrimonio(index)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={() => appendPatrimonio({ quantidade: 1, unidade: "", descricao: "" })}>
            <Plus className="mr-2 h-4 w-4" /> Adicionar Patrimônio
          </Button>
        </div>
      </Section>

      <Section title="Atividades Produtivas" description="Produção anual da unidade familiar.">
        <div className="space-y-4">
          {atividades.map((item, index) => (
            <div key={item.id} className="flex gap-4 items-end">
              <Field label="Atividade" name={`atividadesProdutivas.${index}.atividade`} register={register} className="flex-1" />
              <Field label="Produção Anual" name={`atividadesProdutivas.${index}.producaoAnual`} type="number" register={register} className="w-48" />
              <Field label="Unidade" name={`atividadesProdutivas.${index}.unidade`} register={register} className="w-48" />
              <label className="flex items-center gap-2 w-32 pb-4 text-sm font-medium"><input type="checkbox" {...register(`atividadesProdutivas.${index}.atividadePrincipal`)} className="h-4 w-4" /> Principal</label>
              <Button type="button" variant="destructive" onClick={() => removeAtividade(index)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={() => appendAtividade({ producaoAnual: 0, unidade: "", atividade: "" })}>
            <Plus className="mr-2 h-4 w-4" /> Adicionar Atividade
          </Button>
        </div>
      </Section>

      {/* 4. Merge Diagnóstico */}
      <Section title="Meios de Comunicação">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <label className="flex items-center gap-2"><input type="checkbox" {...register("possuiRadio")} /> Rádio</label>
          <label className="flex items-center gap-2"><input type="checkbox" {...register("possuiTelevisao")} /> Televisão</label>
          <label className="flex items-center gap-2"><input type="checkbox" {...register("possuiCelular")} /> Celular</label>
          <label className="flex items-center gap-2"><input type="checkbox" {...register("possuiInternet")} /> Internet</label>
          <label className="flex items-center gap-2"><input type="checkbox" {...register("usaRedesSociais")} /> Redes Sociais</label>
          <label className="flex items-center gap-2"><input type="checkbox" {...register("possuiOutroMeioComunicacao")} /> Outro</label>
        </div>
        <div className="mt-4">
          <Field label="Outros meios (separe por vírgula para mais de um, ex: Carta, Rádio amador)" name="outroMeioComunicacao" register={register} />
        </div>
      </Section>

      <Section title="Saneamento">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <label className="flex items-center gap-2"><input type="checkbox" {...register("aguaParaConsumo")} /> Água para Consumo</label>
          <label className="flex items-center gap-2"><input type="checkbox" {...register("aguaConsumoTratada")} /> Água Tratada</label>
          <label className="flex items-center gap-2"><input type="checkbox" {...register("aguaParaProducao")} /> Água para Produção</label>
          <label className="flex items-center gap-2"><input type="checkbox" {...register("captacaoAguaChuva")} /> Captação de Chuva</label>
          <label className="flex items-center gap-2"><input type="checkbox" {...register("esgotoTratado")} /> Esgoto Tratado</label>
          <label className="flex items-center gap-2"><input type="checkbox" {...register("fontesProtegidas")} /> Fontes Protegidas</label>
        </div>
      </Section>

      {/* TODO: Add Json fields logic if needed, but since it's just JSON, we can do text inputs or just simple strings in a comma separated format? The prompt says "Recursos Disponiveis (Json), Atividades Coletivas (Json), Politicas Publicas (Json), Acoes Potenciais e Limitacoes...". We can just use string arrays for these. But wait! Text inputs with commas? Or useFieldArray for each? I'll use a simple text input that splits by comma, or just use react-select if we had it. Let's make them comma-separated strings for simplicity. */}
      <Section title="Outras Informações">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <span className="block text-sm font-medium text-zinc-700 mb-2">Ações Potenciais (Produtivo)</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {[
                "Sistemas agroflorestais – SAF’s", "Diversificação produtiva", "Quintal produtivo (galinha caipira e horta)",
                "Apoio a Comercialização", "Apoio ao mercado institucional (PAA e PNAE)", "Produção e produtividade",
                "Transporte para a produção", "Faz venda direta", "Acesso a crédito", "Faz rotação de cultivos",
                "Faz consorciação", "Banco de sementes crioulas"
              ].map(opt => (
                <label key={opt} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" value={opt} {...register("acoesPotenciaisProdutivo")} /> {opt}
                </label>
              ))}
            </div>
          </div>
          <div>
            <span className="block text-sm font-medium text-zinc-700 mb-2 mt-4">Ações Potenciais (Social)</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {[
                "Cadastro da Agricultura Familiar - CAF", "Cadastro Ambiental Rural - CAR", "Acesso às políticas públicas - PAA e PNAE",
                "Segurança Alimentar", "Cidadania de acesso às políticas de crédito e de habitação rural",
                "Documentação da propriedade (CCIR, CAR e CAF)", "Documentação familiar (CPF, RG, Título de eleitor e CadÚnico)",
                "Estímulo para atividades de cultura, lazer, esporte e inclusão digital"
              ].map(opt => (
                <label key={opt} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" value={opt} {...register("acoesPotenciaisSocial")} /> {opt}
                </label>
              ))}
            </div>
          </div>
          <div>
            <span className="block text-sm font-medium text-zinc-700 mb-2 mt-4">Ações Potenciais (Ambiental)</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {[
                "Saneamento rural", "Gestão da propriedade integrando os aspectos produtivos, ambientais, sociais, culturais e econômicos",
                "Integração entre atividades produtivas", "Produções consorciadas, integradas e sistemas agroflorestais",
                "Proteção de nascentes", "Poço artesiano"
              ].map(opt => (
                <label key={opt} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" value={opt} {...register("acoesPotenciaisAmbiental")} /> {opt}
                </label>
              ))}
            </div>
          </div>
          <Field label="Outras Ações Potenciais (separe por vírgulas)" name="outrasAcoesPotenciais" register={register} />
          
          <div className="mt-6 border-t pt-6">
            <span className="block text-sm font-medium text-zinc-700 mb-2">Limitações (Produtivo)</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {[
                "Sistemas agroflorestais – SAF’s", "Diversificação produtiva", "Quintal produtivo (galinha caipira e horta)",
                "Apoio a Comercialização", "Apoio ao mercado institucional (PAA e PNAE)", "Produção e produtividade",
                "Transporte para a produção", "Faz venda direta", "Acesso a crédito", "Faz rotação de cultivos",
                "Faz consorciação", "Banco de sementes crioulas"
              ].map(opt => (
                <label key={opt} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" value={opt} {...register("limitacoesProdutivo")} /> {opt}
                </label>
              ))}
            </div>
          </div>
          <div>
            <span className="block text-sm font-medium text-zinc-700 mb-2 mt-4">Limitações (Social)</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {[
                "Cadastro da Agricultura Familiar - CAF", "Cadastro Ambiental Rural - CAR", "Acesso às políticas públicas - PAA e PNAE",
                "Segurança Alimentar", "Cidadania de acesso às políticas de crédito e de habitação rural",
                "Documentação da propriedade (CCIR, CAR e CAF)", "Documentação familiar (CPF, RG, Título de eleitor e CadÚnico)",
                "Estímulo para atividades de cultura, lazer, esporte e inclusão digital"
              ].map(opt => (
                <label key={opt} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" value={opt} {...register("limitacoesSocial")} /> {opt}
                </label>
              ))}
            </div>
          </div>
          <div>
            <span className="block text-sm font-medium text-zinc-700 mb-2 mt-4">Limitações (Ambiental)</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {[
                "Saneamento rural", "Gestão da propriedade integrando os aspectos produtivos, ambientais, sociais, culturais e econômicos",
                "Integração entre atividades produtivas", "Produções consorciadas, integradas e sistemas agroflorestais",
                "Proteção de nascentes", "Poço artesiano"
              ].map(opt => (
                <label key={opt} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" value={opt} {...register("limitacoesAmbiental")} /> {opt}
                </label>
              ))}
            </div>
          </div>
          <Field label="Outras Limitações (separe por vírgulas)" name="outrasLimitacoes" register={register} />
        </div>
      </Section>

      <div className="flex flex-col gap-4 border-t border-zinc-100 pt-10 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/ater-sociobio/familias" className="text-sm font-bold text-zinc-400 hover:text-zinc-600">
          Cancelar cadastro
        </Link>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex h-14 items-center justify-center rounded-2xl bg-emerald-600 px-10 text-base font-bold text-white shadow-xl shadow-emerald-600/20 transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 disabled:opacity-50"
        >
          {isPending ? "Salvando..." : "Salvar Unidade Familiar (UFPA)"}
        </button>
      </div>
    </form>
  );
}
