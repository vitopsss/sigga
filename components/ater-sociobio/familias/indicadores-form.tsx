"use client";

import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

const inputClassName =
  "mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none backdrop-blur-sm transition-all duration-300 hover:border-emerald-400 hover:bg-white focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/20 focus:shadow-lg focus:shadow-emerald-500/10 placeholder:text-slate-400";

function Section({ title, description, children }: any) {
  return (
    <section className="group relative mb-12 overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-md sm:p-8">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-400/0 via-emerald-400/50 to-emerald-400/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="mb-8">
        <h2 className="flex items-center gap-3 text-xl font-bold text-slate-900">
          <div className="h-2 w-2 rounded-full bg-emerald-500 transition-all duration-300 group-hover:scale-150 group-hover:bg-emerald-400" />
          {title}
        </h2>
        {description && <p className="mt-2 text-sm text-slate-500">{description}</p>}
      </div>
      {children}
    </section>
  );
}

function Field({ label, name, type = "text", step, required, placeholder, register, className = "" }: any) {
  return (
    <label className={`block group ${className}`}>
      <span className="text-sm font-bold text-slate-900 block mb-2 transition-colors group-hover:text-emerald-700">{label}</span>
      <input type={type} step={step} required={required} placeholder={placeholder} {...register(name)} className={inputClassName} />
    </label>
  );
}

function BooleanSelect({ label, name, register }: any) {
  return (
    <fieldset className="block group rounded-2xl border border-transparent p-4 transition-all duration-300 hover:border-slate-100 hover:bg-slate-50/50 hover:shadow-sm">
      <legend className="text-sm font-semibold text-slate-700 mb-3 transition-colors group-hover:text-emerald-800">{label}</legend>
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-slate-700 shadow-sm transition-all hover:border-emerald-300 hover:bg-emerald-50 hover:shadow">
          <input type="radio" value="true" {...register(name)} className="peer sr-only" />
          <span className="h-4 w-4 rounded-full border-2 border-slate-300 bg-white transition-all peer-checked:border-emerald-600 peer-checked:bg-emerald-600 peer-checked:scale-110" />
          Sim
        </label>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-slate-700 shadow-sm transition-all hover:border-rose-300 hover:bg-rose-50 hover:shadow">
          <input type="radio" value="false" {...register(name)} className="peer sr-only" />
          <span className="h-4 w-4 rounded-full border-2 border-slate-300 bg-white transition-all peer-checked:border-rose-600 peer-checked:bg-rose-600 peer-checked:scale-110" />
          Não
        </label>
      </div>
    </fieldset>
  );
}

function TernarySelect({ label, name, register }: any) {
  return (
    <fieldset className="block group rounded-2xl border border-transparent p-4 transition-all duration-300 hover:border-slate-100 hover:bg-slate-50/50 hover:shadow-sm">
      <legend className="text-sm font-semibold text-slate-700 mb-3 transition-colors group-hover:text-emerald-800">{label}</legend>
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-slate-700 shadow-sm transition-all hover:border-emerald-300 hover:bg-emerald-50 hover:shadow">
          <input type="radio" value="true" {...register(name)} className="peer sr-only" />
          <span className="h-4 w-4 rounded-full border-2 border-slate-300 bg-white transition-all peer-checked:border-emerald-600 peer-checked:bg-emerald-600 peer-checked:scale-110" />
          Sim
        </label>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-slate-700 shadow-sm transition-all hover:border-rose-300 hover:bg-rose-50 hover:shadow">
          <input type="radio" value="false" {...register(name)} className="peer sr-only" />
          <span className="h-4 w-4 rounded-full border-2 border-slate-300 bg-white transition-all peer-checked:border-rose-600 peer-checked:bg-rose-600 peer-checked:scale-110" />
          Não
        </label>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-slate-700 shadow-sm transition-all hover:border-slate-400 hover:bg-slate-50 hover:shadow">
          <input type="radio" value="nao_aplica" {...register(name)} className="peer sr-only" />
          <span className="h-4 w-4 rounded-full border-2 border-slate-300 bg-white transition-all peer-checked:border-slate-700 peer-checked:bg-slate-700 peer-checked:scale-110" />
          Não se aplica
        </label>
      </div>
    </fieldset>
  );
}

export function IndicadoresForm({ defaultValues, familiaId, onSubmit }: any) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const convertBoolToString = (val: any) => {
    if (val === true) return "true";
    if (val === false) return "false";
    return "";
  };

  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      ...defaultValues,
      acessaPoliticasProdutivas: convertBoolToString(defaultValues?.acessaPoliticasProdutivas),
      possuiPraticasSustentaveis: convertBoolToString(defaultValues?.possuiPraticasSustentaveis),
      alimentacaoVariadaComprometida: convertBoolToString(defaultValues?.alimentacaoVariadaComprometida),
      comidaAcabouSemCondicao: convertBoolToString(defaultValues?.comidaAcabouSemCondicao),
      deixouRefeicaoSemCondicao: convertBoolToString(defaultValues?.deixouRefeicaoSemCondicao),
      comeuMenosSemCondicao: convertBoolToString(defaultValues?.comeuMenosSemCondicao),
      sentiuFomeENaoComeu: convertBoolToString(defaultValues?.sentiuFomeENaoComeu),
      documentacaoPessoalCompleta: convertBoolToString(defaultValues?.documentacaoPessoalCompleta),
      cadastradoCadUnico: convertBoolToString(defaultValues?.cadastradoCadUnico),
      acessaPoliticasSociais: convertBoolToString(defaultValues?.acessaPoliticasSociais),
      participaGrupoComunitario: convertBoolToString(defaultValues?.participaGrupoComunitario),
      
      // Econômico - Políticas
      acessouPaa: convertBoolToString(defaultValues?.acessouPaa),
      acessouPnae: convertBoolToString(defaultValues?.acessouPnae),
      acessouPgpmBio: convertBoolToString(defaultValues?.acessouPgpmBio),
      acessouPronaf: convertBoolToString(defaultValues?.acessouPronaf),
      linhasPronafArray: defaultValues?.linhasPronaf && typeof defaultValues.linhasPronaf === 'object' ? Object.keys(defaultValues.linhasPronaf).filter(k => defaultValues.linhasPronaf[k]) : [],

      // Econômico - Comercialização
      canalTrocaProdutoServico: convertBoolToString(defaultValues?.canalTrocaProdutoServico),
      canalVendaPropriedade: convertBoolToString(defaultValues?.canalVendaPropriedade),
      canalVendaDiretaConsumidor: convertBoolToString(defaultValues?.canalVendaDiretaConsumidor),
      canalFeira: convertBoolToString(defaultValues?.canalFeira),
      canalMercadoLocal: convertBoolToString(defaultValues?.canalMercadoLocal),
      canalAtravessador: convertBoolToString(defaultValues?.canalAtravessador),
      canalPaa: convertBoolToString(defaultValues?.canalPaa),
      canalPnae: convertBoolToString(defaultValues?.canalPnae),
      canalCooperativaEntreposto: convertBoolToString(defaultValues?.canalCooperativaEntreposto),

      // Participação
      participaAssociacao: defaultValues?.participaAssociacao === true ? "true" : defaultValues?.participaAssociacao === false ? "false" : "nao_aplica",
      participaCooperativa: defaultValues?.participaCooperativa === true ? "true" : defaultValues?.participaCooperativa === false ? "false" : "nao_aplica",
      participaGrupoInformalProdutivo: defaultValues?.participaGrupoInformalProdutivo === true ? "true" : defaultValues?.participaGrupoInformalProdutivo === false ? "false" : "nao_aplica",
      participaGrupoInformalSocial: defaultValues?.participaGrupoInformalSocial === true ? "true" : defaultValues?.participaGrupoInformalSocial === false ? "false" : "nao_aplica",

      // Práticas Sustentáveis (Ambiental)
      praticaIntegracaoAtividades: defaultValues?.praticaIntegracaoAtividades === true ? "true" : defaultValues?.praticaIntegracaoAtividades === false ? "false" : "nao_aplica",
      praticaDescarteCorretoEmbalagens: defaultValues?.praticaDescarteCorretoEmbalagens === true ? "true" : defaultValues?.praticaDescarteCorretoEmbalagens === false ? "false" : "nao_aplica",
      praticaControleQueimadas: defaultValues?.praticaControleQueimadas === true ? "true" : defaultValues?.praticaControleQueimadas === false ? "false" : "nao_aplica",
      praticaAdubacaoVerde: defaultValues?.praticaAdubacaoVerde === true ? "true" : defaultValues?.praticaAdubacaoVerde === false ? "false" : "nao_aplica",
      praticaRecuperacaoPastagens: defaultValues?.praticaRecuperacaoPastagens === true ? "true" : defaultValues?.praticaRecuperacaoPastagens === false ? "false" : "nao_aplica",
      praticaCoberturaSolo: defaultValues?.praticaCoberturaSolo === true ? "true" : defaultValues?.praticaCoberturaSolo === false ? "false" : "nao_aplica",
      praticaManejoIntegradoPragas: defaultValues?.praticaManejoIntegradoPragas === true ? "true" : defaultValues?.praticaManejoIntegradoPragas === false ? "false" : "nao_aplica",
      praticaCordoesVegetacao: defaultValues?.praticaCordoesVegetacao === true ? "true" : defaultValues?.praticaCordoesVegetacao === false ? "false" : "nao_aplica",
      praticaRotacaoCulturas: defaultValues?.praticaRotacaoCulturas === true ? "true" : defaultValues?.praticaRotacaoCulturas === false ? "false" : "nao_aplica",
      praticaPlantioDireto: defaultValues?.praticaPlantioDireto === true ? "true" : defaultValues?.praticaPlantioDireto === false ? "false" : "nao_aplica",
      praticaPousio: defaultValues?.praticaPousio === true ? "true" : defaultValues?.praticaPousio === false ? "false" : "nao_aplica",
      praticaProtecaoNascentes: defaultValues?.praticaProtecaoNascentes === true ? "true" : defaultValues?.praticaProtecaoNascentes === false ? "false" : "nao_aplica",
      praticaPreservacaoApps: defaultValues?.praticaPreservacaoApps === true ? "true" : defaultValues?.praticaPreservacaoApps === false ? "false" : "nao_aplica",
      praticaManejoFlorestal: defaultValues?.praticaManejoFlorestal === true ? "true" : defaultValues?.praticaManejoFlorestal === false ? "false" : "nao_aplica",
      praticaRecomposicaoFlorestal: defaultValues?.praticaRecomposicaoFlorestal === true ? "true" : defaultValues?.praticaRecomposicaoFlorestal === false ? "false" : "nao_aplica",
      
      // Motivos Ambiental
      motivoSemPraticaFinanceiro: defaultValues?.motivoSemPraticaFinanceiro === true ? "true" : defaultValues?.motivoSemPraticaFinanceiro === false ? "false" : "nao_aplica",
      motivoSemPraticaFaltaInformacao: defaultValues?.motivoSemPraticaFaltaInformacao === true ? "true" : defaultValues?.motivoSemPraticaFaltaInformacao === false ? "false" : "nao_aplica",
      motivoSemPraticaTecnologico: defaultValues?.motivoSemPraticaTecnologico === true ? "true" : defaultValues?.motivoSemPraticaTecnologico === false ? "false" : "nao_aplica",
      motivoSemPraticaFaltaInteresse: defaultValues?.motivoSemPraticaFaltaInteresse === true ? "true" : defaultValues?.motivoSemPraticaFaltaInteresse === false ? "false" : "nao_aplica",

      // Motivos Economico
      motivoNaoAcessaPoliticasFaltaInfo: defaultValues?.motivoNaoAcessaPoliticasFaltaInfo === true ? "true" : defaultValues?.motivoNaoAcessaPoliticasFaltaInfo === false ? "false" : "nao_aplica",
      motivoNaoAcessaPoliticasDificilAcesso: defaultValues?.motivoNaoAcessaPoliticasDificilAcesso === true ? "true" : defaultValues?.motivoNaoAcessaPoliticasDificilAcesso === false ? "false" : "nao_aplica",
      motivoNaoAcessaPoliticasSemInteresse: defaultValues?.motivoNaoAcessaPoliticasSemInteresse === true ? "true" : defaultValues?.motivoNaoAcessaPoliticasSemInteresse === false ? "false" : "nao_aplica",
    }
  });

  const acessaPoliticasProdutivas = watch("acessaPoliticasProdutivas");
  const acessouPronaf = watch("acessouPronaf");
  const possuiPraticasSustentaveis = watch("possuiPraticasSustentaveis");
  const participaGrupoComunitario = watch("participaGrupoComunitario");

  const documentacaoPessoalCompleta = watch("documentacaoPessoalCompleta");
  const cadastradoCadUnico = watch("cadastradoCadUnico");
  const acessaPoliticasSociais = watch("acessaPoliticasSociais");

  const handleFormSubmit = (data: any) => {
    const parsedData = { ...data };
    for (const key of Object.keys(parsedData)) {
      if (parsedData[key] === "true") parsedData[key] = true;
      if (parsedData[key] === "false") parsedData[key] = false;
      if (parsedData[key] === "nao_aplica" || parsedData[key] === "") parsedData[key] = null;
    }

    if (parsedData.qtdVezesComeuMenos) parsedData.qtdVezesComeuMenos = parseInt(parsedData.qtdVezesComeuMenos, 10);
    if (parsedData.valorBrutoProducaoUltimos12Meses) parsedData.valorBrutoProducaoUltimos12Meses = parseFloat(parsedData.valorBrutoProducaoUltimos12Meses);

    // Convert array of checkboxes into JSON Record<string, boolean>
    if (Array.isArray(parsedData.linhasPronafArray)) {
      parsedData.linhasPronaf = parsedData.linhasPronafArray.reduce((acc: any, val: string) => {
        acc[val] = true;
        return acc;
      }, {});
    } else if (typeof parsedData.linhasPronafArray === "string") {
      parsedData.linhasPronaf = { [parsedData.linhasPronafArray]: true };
    }
    delete parsedData.linhasPronafArray;

    startTransition(async () => {
      try {
        await onSubmit(parsedData);
      } catch (e: any) {
        if (e && (e.message === 'NEXT_REDIRECT' || e.digest === 'NEXT_REDIRECT')) {
          throw e; // Let Next.js handle the redirect
        }
        console.error(e);
        alert("Erro ao salvar indicadores.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-16 mt-8">
      
      {/* ======================= SOCIAL ======================= */}
      <Section title="Eixo Social" description="Segurança Alimentar e Nutricional">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <BooleanSelect label="1. Na sua casa, alguém deixou de ter uma alimentação variada, com frutas, saladas, feijão, arroz e carne?" name="alimentacaoVariadaComprometida" register={register} />
          <BooleanSelect label="2. Alguma vez a comida da sua casa terminou e não havia como comprar mais? (logística, dinheiro, saúde,...)" name="comidaAcabouSemCondicao" register={register} />
          <BooleanSelect label="3. Nos últimos 12 meses, você ou alguma pessoa na sua casa teve que comer menos ou deixou de fazer alguma refeição por não havia como comprar mais?" name="deixouRefeicaoSemCondicao" register={register} />
          <BooleanSelect label="4. Nos últimos 12 meses, você já comeu menos do que deveria, por que não havia como comprar mais?" name="comeuMenosSemCondicao" register={register} />
          
          <Field label="5. Quantas vezes aconteceu de comer menos do que deveria, nos últimos 12 meses?" name="qtdVezesComeuMenos" type="number" register={register} />
          
          <BooleanSelect label="6. Nos últimos 12 meses, alguma vez sentiu fome, mas não comeu, porque a sua família não pôde comprar comida suficiente?" name="sentiuFomeENaoComeu" register={register} />
        </div>
        
        <div className="mt-12">
          <h3 className="font-bold text-xl text-zinc-900 mb-6 border-b border-zinc-100 pb-2">Serviços Sociais Básicos</h3>
          <div className="grid grid-cols-1 gap-8">
            <div className="flex flex-col md:flex-row md:items-start gap-4">
              <div className="flex-1">
                <BooleanSelect label="1. A família possui documentação pessoal completa?" name="documentacaoPessoalCompleta" register={register} />
              </div>
              {documentacaoPessoalCompleta === "true" && (
                <div className="flex-1">
                  <Field label="Quais documentos?" name="documentacaoPessoalQuais" register={register} />
                </div>
              )}
            </div>
            
            <div className="flex flex-col md:flex-row md:items-start gap-4">
              <div className="flex-1">
                <BooleanSelect label="2. A família é cadastrada no CadÚnico?" name="cadastradoCadUnico" register={register} />
              </div>
              {cadastradoCadUnico === "true" && (
                <div className="flex-1">
                  <Field label="Quais membros?" name="cadUnicoQuais" register={register} />
                </div>
              )}
            </div>

            <div className="flex flex-col md:flex-row md:items-start gap-4">
              <div className="flex-1">
                <BooleanSelect label="3. A família acessa Políticas Públicas Sociais?" name="acessaPoliticasSociais" register={register} />
              </div>
              {acessaPoliticasSociais === "true" && (
                <div className="flex-1">
                  <Field label="Quais políticas sociais?" name="politicasSociaisQuais" register={register} />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h3 className="font-bold text-xl text-zinc-900 mb-6 border-b border-zinc-100 pb-2">Participação comunitária</h3>
          <div className="grid grid-cols-1 gap-8">
            <BooleanSelect label="1. A família participa ativa e frequentemente de algum grupo comunitário?" name="participaGrupoComunitario" register={register} />
            
            {participaGrupoComunitario === "true" && (
              <div className="bg-zinc-50 p-6 rounded-3xl border border-zinc-100 space-y-6">
                <h4 className="font-bold text-zinc-900">2. Se sim na questão 1, qual?</h4>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <TernarySelect label="a. Associação agropecuária / extrativista / comercialização" name="participaAssociacao" register={register} />
                  <TernarySelect label="b. Cooperativa agropecuária / extrativista / comercialização" name="participaCooperativa" register={register} />
                  <TernarySelect label="c. Grupo informal agropecuário / extrativista / comercializ." name="participaGrupoInformalProdutivo" register={register} />
                  <TernarySelect label="d. Grupo informal social / político / cultural" name="participaGrupoInformalSocial" register={register} />
                </div>
              </div>
            )}
          </div>
        </div>
      </Section>

      {/* ======================= AMBIENTAL ======================= */}
      <Section title="Eixo Ambiental" description="Propriedade com práticas sustentáveis">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <BooleanSelect label="1. A UFPA faz uso de práticas sustentáveis de conservação?" name="possuiPraticasSustentaveis" register={register} />
        </div>

        {possuiPraticasSustentaveis === "true" && (
          <div className="mt-8 space-y-6 rounded-3xl bg-emerald-50/50 border border-emerald-100 p-8">
            <h3 className="font-bold text-xl text-emerald-900">2. Se sim na questão 1, qual?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
              <TernarySelect label="a) Integração de atividades" name="praticaIntegracaoAtividades" register={register} />
              <TernarySelect label="b) Descarte correto de embalagens" name="praticaDescarteCorretoEmbalagens" register={register} />
              <TernarySelect label="c) Controle das queimadas" name="praticaControleQueimadas" register={register} />
              <TernarySelect label="d) Adubação verde" name="praticaAdubacaoVerde" register={register} />
              <TernarySelect label="e) Recuperação de pastagens" name="praticaRecuperacaoPastagens" register={register} />
              <TernarySelect label="f) Cobertura de solo / manejo de plantas" name="praticaCoberturaSolo" register={register} />
              <TernarySelect label="g) Manejo integrado de pragas" name="praticaManejoIntegradoPragas" register={register} />
              <TernarySelect label="h) Cordões de vegetação permanente" name="praticaCordoesVegetacao" register={register} />
              <TernarySelect label="i) Rotação de culturas" name="praticaRotacaoCulturas" register={register} />
              <TernarySelect label="j) Sistema plantio direto" name="praticaPlantioDireto" register={register} />
              <TernarySelect label="k) Pousio" name="praticaPousio" register={register} />
              <TernarySelect label="l) Proteção de nascentes" name="praticaProtecaoNascentes" register={register} />
              <TernarySelect label="m) Preservação das APPs" name="praticaPreservacaoApps" register={register} />
              <TernarySelect label="n) Manejo florestal de áreas de extrativismo" name="praticaManejoFlorestal" register={register} />
              <TernarySelect label="o) Recomposição florestal" name="praticaRecomposicaoFlorestal" register={register} />
            </div>
          </div>
        )}

        {possuiPraticasSustentaveis === "false" && (
          <div className="mt-8 space-y-6 rounded-3xl bg-pink-50/50 border border-pink-100 p-8">
            <h3 className="font-bold text-xl text-pink-900">3. Se não na questão 1, qual o motivo?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
              <TernarySelect label="a) Questão financeira" name="motivoSemPraticaFinanceiro" register={register} />
              <TernarySelect label="b) Falta de informação" name="motivoSemPraticaFaltaInformacao" register={register} />
              <TernarySelect label="c) Questão tecnológica" name="motivoSemPraticaTecnologico" register={register} />
              <TernarySelect label="d) Falta de interesse" name="motivoSemPraticaFaltaInteresse" register={register} />
            </div>
          </div>
        )}
      </Section>

      {/* ======================= ECONÔMICO ======================= */}
      <Section title="Eixo Econômico">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <Field label="Valor total Bruto da Produção (Últimos 12 meses)" name="valorBrutoProducaoUltimos12Meses" type="number" step="0.01" register={register} placeholder="R$" />
          
          <BooleanSelect label="1. A família acessa Políticas Públicas Produtivas?" name="acessaPoliticasProdutivas" register={register} />
        </div>

        {acessaPoliticasProdutivas === "false" && (
          <div className="mt-8 space-y-6 rounded-3xl bg-pink-50/50 border border-pink-100 p-8">
            <h3 className="font-bold text-xl text-pink-900">2. Se não na questão 1, qual o motivo?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
              <TernarySelect label="a) Falta de informação" name="motivoNaoAcessaPoliticasFaltaInfo" register={register} />
              <TernarySelect label="b) Difícil acesso" name="motivoNaoAcessaPoliticasDificilAcesso" register={register} />
              <TernarySelect label="c) Sem necessidade / interesse" name="motivoNaoAcessaPoliticasSemInteresse" register={register} />
            </div>
          </div>
        )}

        {acessaPoliticasProdutivas === "true" && (
          <div className="mt-8 space-y-8 rounded-3xl bg-zinc-50 border border-zinc-100 p-8">
            <h3 className="font-bold text-xl text-zinc-900">Políticas Acessadas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <BooleanSelect label="3. A família já acessou o PAA?" name="acessouPaa" register={register} />
              <BooleanSelect label="4. A família já acessou o PNAE?" name="acessouPnae" register={register} />
              <BooleanSelect label="5. A família já acessou o PGPM-Bio?" name="acessouPgpmBio" register={register} />
              <BooleanSelect label="6. Você já acessou o PRONAF?" name="acessouPronaf" register={register} />
            </div>
            
            {acessouPronaf === "true" && (
              <div className="mt-8 border-t border-zinc-200 pt-8">
                <h4 className="font-bold text-lg text-zinc-900 mb-6">7. Se sim na questão 6, qual?</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    "Custeio", "Mais Alimentos", "Agroecologia", "Bioeconomia", 
                    "Mulher", "Jovem", "Microcrédito (B)", "Agroindústria", "Floresta", "Semiárido"
                  ].map((linha) => (
                    <label key={linha} className="flex items-center gap-3 p-3 rounded-xl border border-zinc-200 hover:bg-zinc-50 cursor-pointer transition-colors">
                      <input 
                        type="checkbox" 
                        value={linha} 
                        {...register("linhasPronafArray")} 
                        className="w-5 h-5 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="text-sm font-medium text-zinc-700">{linha}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-12">
          <h3 className="font-bold text-xl text-zinc-900 mb-6 border-b border-zinc-100 pb-2">Canais de Comercialização Utilizados</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <BooleanSelect label="1. Troca por outro produto ou serviço" name="canalTrocaProdutoServico" register={register} />
            <BooleanSelect label="2. Venda na propriedade" name="canalVendaPropriedade" register={register} />
            <BooleanSelect label="3. Venda direta ao consumidor" name="canalVendaDiretaConsumidor" register={register} />
            <BooleanSelect label="4. Feira" name="canalFeira" register={register} />
            <BooleanSelect label="5. Mercado local" name="canalMercadoLocal" register={register} />
            <BooleanSelect label="6. Atravessador" name="canalAtravessador" register={register} />
            <BooleanSelect label="7. PAA" name="canalPaa" register={register} />
            <BooleanSelect label="8. PNAE" name="canalPnae" register={register} />
            <BooleanSelect label="9. Cooperativa / entreposto" name="canalCooperativaEntreposto" register={register} />
          </div>
        </div>
      </Section>

      <div className="flex flex-col gap-4 border-t border-zinc-100 pt-10 sm:flex-row sm:items-center sm:justify-between">
        <Link href={`/ater-sociobio/familias/${familiaId}`} className="text-sm font-bold text-zinc-400 hover:text-zinc-600">
          Cancelar
        </Link>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex h-14 items-center justify-center rounded-2xl bg-emerald-600 px-10 text-base font-bold text-white shadow-xl shadow-emerald-600/20 transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 disabled:opacity-50"
        >
          {isPending ? "Salvando..." : "Salvar Indicadores"}
        </button>
      </div>
    </form>
  );
}
