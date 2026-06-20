"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const inputClassName =
  "mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50/50 px-4 py-3 text-sm text-zinc-900 outline-none backdrop-blur-sm transition-all duration-300 hover:border-emerald-400 hover:bg-white focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/20 focus:shadow-lg focus:shadow-emerald-500/10 placeholder:text-zinc-400";

const labelClassName = "block group";

function Field({ label, name, type = "text", step, required, placeholder, register, className = "", readOnly }: any) {
  return (
    <label className={`${labelClassName} ${className}`}>
      <span className="text-sm font-medium text-zinc-700 transition-colors group-hover:text-emerald-700">{label}</span>
      <input type={type} step={step} required={required} placeholder={placeholder} readOnly={readOnly} {...register(name)} className={inputClassName} />
    </label>
  );
}

function CheckboxField({ label, name, value, register, className = "" }: any) {
  return (
    <label className={`group flex cursor-pointer items-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 transition-all duration-200 hover:border-emerald-400 hover:bg-emerald-50/50 hover:shadow-sm ${className}`}>
      <input type="checkbox" value={value} {...register(name)} className="h-5 w-5 rounded border-zinc-300 text-emerald-600 transition-all focus:ring-4 focus:ring-emerald-500/20" />
      <span className="text-sm font-medium text-zinc-700 transition-colors group-hover:text-emerald-900">{label}</span>
    </label>
  );
}

function Section({ title, description, children }: any) {
  return (
    <section className="group relative overflow-hidden rounded-[2.5rem] border border-zinc-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-zinc-300 hover:shadow-md sm:p-8">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-400/0 via-emerald-400/50 to-emerald-400/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="mb-8">
        <h2 className="flex items-center gap-3 text-xl font-bold text-zinc-900">
          <div className="h-2 w-2 rounded-full bg-emerald-500 transition-all duration-300 group-hover:scale-150 group-hover:bg-emerald-400" />
          {title}
        </h2>
        {description && <p className="mt-2 text-sm text-zinc-500">{description}</p>}
      </div>
      {children}
    </section>
  );
}

export function UfpaForm({ defaultValues, organizacoes, onSubmit }: any) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const DEFAULT_PATRIMONIOS = [
    { descricao: "Máquinas agrícolas", quantidade: "", unidade: "" },
    { descricao: "Implemento agrícolas", quantidade: "", unidade: "" },
    { descricao: "Veículos de passeio", quantidade: "", unidade: "" },
    { descricao: "Construções rurais", quantidade: "", unidade: "" },
    { descricao: "Motores elétricos (não pertencentes às máquinas)", quantidade: "", unidade: "" },
    { descricao: "Conjuntos de irrigação", quantidade: "", unidade: "" },
    { descricao: "Animais de trabalho", quantidade: "", unidade: "" },
    { descricao: "Veículos / maquinário de tração animal", quantidade: "", unidade: "" },
    { descricao: "Bovinos", quantidade: "", unidade: "cabeças" },
    { descricao: "Ovinos", quantidade: "", unidade: "cabeças" },
    { descricao: "Caprinos", quantidade: "", unidade: "cabeças" },
    { descricao: "Suínos", quantidade: "", unidade: "cabeças" },
    { descricao: "Aves", quantidade: "", unidade: "cabeças" },
    { descricao: "Bubalinos", quantidade: "", unidade: "cabeças" },
    { descricao: "Equinos, muares e asininos", quantidade: "", unidade: "cabeças" },
    { descricao: "Colmeias", quantidade: "", unidade: "" },
    { descricao: "Pequenos animais (outros)", quantidade: "", unidade: "" },
    { descricao: "Pastagens (ha)", quantidade: "", unidade: "ha" },
    { descricao: "Culturas temporárias (ha)", quantidade: "", unidade: "ha" },
    { descricao: "Culturas permanentes (ha)", quantidade: "", unidade: "ha" },
    { descricao: "Lâmina d’água", quantidade: "", unidade: "" },
    { descricao: "Extrativismo", quantidade: "", unidade: "" },
    { descricao: "Reserva Legal", quantidade: "", unidade: "" },
  ];

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
      atividadesProdutivas: [],
      atividadesColetivas: [],
      recursosDisponiveis: [],
      politicasPublicasFederais: [],
      projeto: "",
      tecnico: "",
      dataCadastro: "",
      lgpdConsentimento: false,
      lgpdDataConsentimento: "",
      representanteNome: "",
      representanteCpf: "",
      referenciaAnexoLgpd: "",
      ...defaultValues,
      // Ensure patrimonios fallback applies even if spread overrides it with undefined
      patrimonios: defaultValues?.patrimonios?.length ? defaultValues.patrimonios : DEFAULT_PATRIMONIOS,
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

  const { fields: atividadesColetivas, append: appendAtividadeColetiva, remove: removeAtividadeColetiva } = useFieldArray({
    control,
    name: "atividadesColetivas"
  });

  const { fields: recursosDisponiveis, append: appendRecurso, remove: removeRecurso } = useFieldArray({
    control,
    name: "recursosDisponiveis"
  });

  const { fields: politicasPublicasFederais, append: appendPolitica, remove: removePolitica } = useFieldArray({
    control,
    name: "politicasPublicasFederais"
  });

  const handleFormSubmit = (data: any) => {
    startTransition(async () => {
      const promise = onSubmit(data);
      toast.promise(promise, {
        loading: "Salvando unidade familiar...",
        success: "Família salva com sucesso!",
        error: "Ocorreu um erro ao salvar os dados da família."
      });
      
      try {
        await promise;
      } catch (e) {
        console.error(e);
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
          {patrimonios.map((item, index) => {
            const isDefault = index < 23; // the first 23 items are from the DEFAULT_PATRIMONIOS list
            return (
              <div key={item.id} className="flex gap-4 items-end">
                <Field label="Descrição" name={`patrimonios.${index}.descricao`} register={register} className={isDefault ? "flex-1 bg-zinc-100 opacity-80 pointer-events-none" : "flex-1"} readOnly={isDefault} />
                <Field label="Quantidade" name={`patrimonios.${index}.quantidade`} type="number" register={register} className="w-32" />
                <Field label="Unidade" name={`patrimonios.${index}.unidade`} register={register} className="w-48" />
                {!isDefault && (
                  <Button type="button" variant="destructive" onClick={() => removePatrimonio(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            );
          })}
          <Button type="button" variant="outline" onClick={() => appendPatrimonio({ quantidade: 1, unidade: "", descricao: "" })}>
            <Plus className="mr-2 h-4 w-4" /> Adicionar Outro Patrimônio
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

      <Section title="Participação em atividades coletivas" description="Sociais, políticas, culturais, produtivas e econômicas.">
        <div className="space-y-4">
          {atividadesColetivas.map((item, index) => (
            <div key={item.id} className="flex gap-4 items-end">
              <Field label="Atividade Coletiva" name={`atividadesColetivas.${index}.atividade`} register={register} className="flex-1" />
              <Field label="Área (Ex: Social, produtiva...)" name={`atividadesColetivas.${index}.area`} register={register} className="flex-1" />
              <Button type="button" variant="destructive" onClick={() => removeAtividadeColetiva(index)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={() => appendAtividadeColetiva({ atividade: "", area: "" })}>
            <Plus className="mr-2 h-4 w-4" /> Adicionar Atividade
          </Button>
        </div>
      </Section>

      <Section title="Recursos Disponíveis" description="Para produção, beneficiamento e comercialização.">
        <div className="space-y-4">
          {recursosDisponiveis.map((item, index) => (
            <div key={item.id} className="flex gap-4 items-end">
              <Field label="Recurso disponível" name={`recursosDisponiveis.${index}.recurso`} register={register} className="flex-1" />
              <Field label="Tipo (Produção, beneficiamento...)" name={`recursosDisponiveis.${index}.tipo`} register={register} className="flex-1" />
              <Button type="button" variant="destructive" onClick={() => removeRecurso(index)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={() => appendRecurso({ recurso: "", tipo: "" })}>
            <Plus className="mr-2 h-4 w-4" /> Adicionar Recurso
          </Button>
        </div>
      </Section>

      <Section title="Políticas Públicas" description="Participação em políticas federais.">
        <div className="space-y-4">
          {politicasPublicasFederais.map((item, index) => (
            <div key={item.id} className="flex gap-4 items-end">
              <Field label="Integrante" name={`politicasPublicasFederais.${index}.integrante`} register={register} className="flex-1" />
              <Field label="Política Pública Federal" name={`politicasPublicasFederais.${index}.politica`} register={register} className="flex-1" />
              <Field label="Último ano de adesão" name={`politicasPublicasFederais.${index}.ano`} register={register} className="w-48" />
              <Button type="button" variant="destructive" onClick={() => removePolitica(index)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={() => appendPolitica({ integrante: "", politica: "", ano: "" })}>
            <Plus className="mr-2 h-4 w-4" /> Adicionar Política
          </Button>
        </div>
      </Section>

      {/* 4. Merge Diagnóstico */}
      <Section title="Meios de Comunicação">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <CheckboxField label="Rádio" name="possuiRadio" register={register} />
          <CheckboxField label="Televisão" name="possuiTelevisao" register={register} />
          <CheckboxField label="Celular" name="possuiCelular" register={register} />
          <CheckboxField label="Internet" name="possuiInternet" register={register} />
          <CheckboxField label="Redes Sociais" name="usaRedesSociais" register={register} />
          <CheckboxField label="Outro" name="possuiOutroMeioComunicacao" register={register} />
        </div>
        <div className="mt-4">
          <Field label="Outros meios (separe por vírgula para mais de um, ex: Carta, Rádio amador)" name="outroMeioComunicacao" register={register} />
        </div>
      </Section>

      <Section title="Saneamento">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <CheckboxField label="Água para Consumo" name="aguaParaConsumo" register={register} />
          <CheckboxField label="Água Tratada" name="aguaConsumoTratada" register={register} />
          <CheckboxField label="Água para Produção" name="aguaParaProducao" register={register} />
          <CheckboxField label="Captação de Chuva" name="captacaoAguaChuva" register={register} />
          <CheckboxField label="Esgoto Tratado" name="esgotoTratado" register={register} />
          <CheckboxField label="Fontes Protegidas" name="fontesProtegidas" register={register} />
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
                <CheckboxField key={opt} label={opt} value={opt} name="acoesPotenciaisProdutivo" register={register} />
              ))}
              <div className="sm:col-span-2 md:col-span-3 mt-2">
                <Field label="Outras ações (Produtivo)" name="outrasAcoesPotenciaisProdutivo" register={register} placeholder="Especifique..." />
              </div>
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
                <CheckboxField key={opt} label={opt} value={opt} name="acoesPotenciaisSocial" register={register} />
              ))}
              <div className="sm:col-span-2 md:col-span-3 mt-2">
                <Field label="Outras ações (Social)" name="outrasAcoesPotenciaisSocial" register={register} placeholder="Especifique..." />
              </div>
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
                <CheckboxField key={opt} label={opt} value={opt} name="acoesPotenciaisAmbiental" register={register} />
              ))}
              <div className="sm:col-span-2 md:col-span-3 mt-2">
                <Field label="Outras ações (Ambiental)" name="outrasAcoesPotenciaisAmbiental" register={register} placeholder="Especifique..." />
              </div>
            </div>
          </div>
          
          <div className="mt-6 border-t pt-6">
            <span className="block text-sm font-medium text-zinc-700 mb-2">Limitações (Produtivo)</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {[
                "Sistemas agroflorestais – SAF’s", "Diversificação produtiva", "Quintal produtivo (galinha caipira e horta)",
                "Apoio a Comercialização", "Apoio ao mercado institucional (PAA e PNAE)", "Produção e produtividade",
                "Transporte para a produção", "Faz venda direta", "Acesso a crédito", "Faz rotação de cultivos",
                "Faz consorciação", "Banco de sementes crioulas"
              ].map(opt => (
                <CheckboxField key={opt} label={opt} value={opt} name="limitacoesProdutivo" register={register} />
              ))}
              <div className="sm:col-span-2 md:col-span-3 mt-2">
                <Field label="Outras limitações (Produtivo)" name="outrasLimitacoesProdutivo" register={register} placeholder="Especifique..." />
              </div>
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
                <CheckboxField key={opt} label={opt} value={opt} name="limitacoesSocial" register={register} />
              ))}
              <div className="sm:col-span-2 md:col-span-3 mt-2">
                <Field label="Outras limitações (Social)" name="outrasLimitacoesSocial" register={register} placeholder="Especifique..." />
              </div>
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
                <CheckboxField key={opt} label={opt} value={opt} name="limitacoesAmbiental" register={register} />
              ))}
              <div className="sm:col-span-2 md:col-span-3 mt-2">
                <Field label="Outras limitações (Ambiental)" name="outrasLimitacoesAmbiental" register={register} placeholder="Especifique..." />
              </div>
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
          disabled={isPending}
          className="inline-flex h-14 items-center justify-center rounded-2xl bg-emerald-600 px-10 text-base font-bold text-white shadow-xl shadow-emerald-600/20 transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 disabled:opacity-50"
        >
          {isPending ? "Salvando..." : "Salvar Unidade Familiar (UFPA)"}
        </button>
      </div>
    </form>
  );
}
