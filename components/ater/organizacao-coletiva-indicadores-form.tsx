import type { ReactNode } from "react";

import { PaperBooleanField, PaperTernaryField } from "@/components/ater/paper-boolean-field";

type IndicadorValues = Record<string, unknown>;

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
  { name: "possuiCafJuridica", label: "a. CAF jurídica" },
  { name: "acessouPronafCusteio", label: "b. Pronaf Custeio" },
  { name: "acessouPronafCapitalGiro", label: "c. Pronaf Capital de Giro" },
  { name: "acessouPronafMaisAlimentos", label: "d. Pronaf Mais Alimentos" },
  { name: "acessouPronafIndustrializacao", label: "e. Pronaf Industrialização" },
  { name: "acessouPronafAgroindustria", label: "f. Pronaf Agroindústria" },
  { name: "acessouPronafCotasPartes", label: "g. Pronaf Cotas Partes" },
  { name: "acessouPaa", label: "h. PAA" },
  { name: "acessouPnae", label: "i. PNAE" },
  { name: "acessouPgpm", label: "j. PGPM" },
  { name: "acessouPgpmSociobiodiversidade", label: "k. PGPM - Sociobiodiversidade" },
  { name: "acessouCooperaMaisBrasil", label: "l. Coopera Mais brasil" },
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

function getValue(defaultValues: IndicadorValues | undefined, field: string) {
  const value = defaultValues?.[field];
  return typeof value === "boolean" ? value : null;
}

function IndicatorCard({
  eixo,
  indicador,
  children,
  muted = false,
}: {
  eixo: string;
  indicador: string;
  children: ReactNode;
  muted?: boolean;
}) {
  return (
    <div className={`rounded-2xl border border-slate-200 ${muted ? "bg-slate-50" : "bg-white"} p-5`}>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{eixo}</p>
      <h3 className="mt-2 text-base font-semibold text-slate-900">{indicador}</h3>
      <div className="mt-5 space-y-5">{children}</div>
    </div>
  );
}

export function OrganizacaoColetivaIndicadoresForm({
  defaultValues,
}: {
  defaultValues?: IndicadorValues;
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900">4. Indicadores</h2>
        <p className="mt-1 text-sm leading-6 text-slate-500">
          Indicadores da Organização Coletiva - Sociobiodiversidade, com os eixos Ambiental, Social e Econômico.
        </p>
      </div>

      <div className="space-y-8">
        <IndicatorCard eixo="AMBIENTAL" indicador="Organização Coletiva com práticas sustentáveis" muted>
          <PaperBooleanField
            label="1. A Organização Coletiva faz uso de práticas ambientais?"
            name="possuiPraticasAmbientais"
            defaultValue={getValue(defaultValues, "possuiPraticasAmbientais")}
          />
          <div>
            <p className="text-sm font-medium text-slate-700">2. Se sim, quais?</p>
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              {praticasAmbientais.map((item) => (
                <PaperTernaryField
                  key={item.name}
                  label={item.label}
                  name={item.name}
                  defaultValue={getValue(defaultValues, item.name)}
                />
              ))}
            </div>
          </div>
        </IndicatorCard>

        <IndicatorCard eixo="SOCIAL" indicador="Identidade organizacional">
          <PaperBooleanField
            label="1. A Organização Coletiva se utiliza de estratégias de identidade comercial?"
            name="usaIdentidadeComercial"
            defaultValue={getValue(defaultValues, "usaIdentidadeComercial")}
          />
          <div>
            <p className="text-sm font-medium text-slate-700">2. Se sim na questão 1, qual?</p>
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              {identidadeComercial.map((item) => (
                <PaperTernaryField
                  key={item.name}
                  label={item.label}
                  name={item.name}
                  defaultValue={getValue(defaultValues, item.name)}
                />
              ))}
            </div>
          </div>
        </IndicatorCard>

        <IndicatorCard eixo="SOCIAL" indicador="Organização Coletiva - Gênero e juventude" muted>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <PaperBooleanField
              label="1. A Organização Coletiva possui mulheres na diretoria executiva ou Conselho fiscal?"
              name="possuiMulheresDiretoriaConselho"
              defaultValue={getValue(defaultValues, "possuiMulheresDiretoriaConselho")}
            />
            <PaperBooleanField
              label="2. A Organização Coletiva possui jovens na diretoria executiva ou Conselho fiscal?"
              name="possuiJovensDiretoriaConselho"
              defaultValue={getValue(defaultValues, "possuiJovensDiretoriaConselho")}
            />
          </div>
        </IndicatorCard>

        <IndicatorCard eixo="SOCIAL" indicador="Representação política">
          <PaperBooleanField
            label="1. A Organização Coletiva é filiada a uma organização?"
            name="filiadaOrganizacao"
            defaultValue={getValue(defaultValues, "filiadaOrganizacao")}
          />
          <div>
            <p className="text-sm font-medium text-slate-700">2. Se sim, qual?</p>
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
              {representacaoPolitica.map((item) => (
                <PaperTernaryField
                  key={item.name}
                  label={item.label}
                  name={item.name}
                  defaultValue={getValue(defaultValues, item.name)}
                />
              ))}
            </div>
          </div>
        </IndicatorCard>

        <IndicatorCard eixo="ECONÔMICO" indicador="Organização com Acesso à Políticas Públicas" muted>
          <PaperBooleanField
            label="1. A Organização Coletiva acessa ou acessou no último ano políticas públicas?"
            name="acessaPoliticasPublicas"
            defaultValue={getValue(defaultValues, "acessaPoliticasPublicas")}
          />
          <div>
            <p className="text-sm font-medium text-slate-700">2. Se sim na questão 1, quais?</p>
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              {politicasPublicas.map((item) => (
                <PaperTernaryField
                  key={item.name}
                  label={item.label}
                  name={item.name}
                  defaultValue={getValue(defaultValues, item.name)}
                />
              ))}
            </div>
          </div>
        </IndicatorCard>

        <IndicatorCard eixo="ECONÔMICO" indicador="Organização com Canais de comercialização">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {canaisComercializacao.map((item) => (
              <PaperBooleanField
                key={item.name}
                label={item.label}
                name={item.name}
                defaultValue={getValue(defaultValues, item.name)}
              />
            ))}
          </div>
        </IndicatorCard>
      </div>
    </section>
  );
}
