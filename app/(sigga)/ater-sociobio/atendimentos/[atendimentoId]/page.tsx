import Link from "next/link";
import { notFound } from "next/navigation";

import type { AtendimentoEixoDocumento11 } from "@/components/ater/atendimento-documento-11-fields";
import { AterSetupWarning } from "@/components/ater/setup-warning";
import { Button } from "@/components/ui";
import { ATER_SETUP_ERROR } from "@/lib/ater-runtime";
import {
  ATER_SOCIOBIO_STATUS_RELATORIO_COLORS,
  ATER_SOCIOBIO_TERRITORY_NAME,
  getAterSociobioStatusRelatorioLabel,
} from "@/lib/constants/ater-sociobio";
import { AterSociobioService, type AtendimentoWithDetails } from "@/lib/services/ater-sociobio.service";

export const dynamic = "force-dynamic";

type EixoAtendimentoData = AtendimentoEixoDocumento11 & {
  tipoAcao?: string;
  etapa?: string;
  impactosAnteriores?: string;
  desenvolvimento?: string;
  recomendacoes?: string;
};

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

function toEixoAtendimentoData(value: unknown): EixoAtendimentoData | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as EixoAtendimentoData;
}

function formatBoolean(value: boolean | null | undefined) {
  if (value === true) return "Sim";
  if (value === false) return "Não";
  return "-";
}

function formatNumber(value: number | null | undefined) {
  return typeof value === "number" ? String(value) : "-";
}

function getSafeReturnHref(value?: string | null) {
  if (!value?.startsWith("/")) return null;
  if (value.startsWith("//")) return null;
  if (!value.startsWith("/ater-sociobio")) return null;
  return value;
}

function renderArray(values: string[] | undefined) {
  if (!Array.isArray(values) || values.length === 0) return "-";
  return values.join("; ");
}

export default async function AtendimentoDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ atendimentoId: string }>;
  searchParams?: Promise<{ from?: string }>;
}) {
  const { atendimentoId } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const returnHref = getSafeReturnHref(resolvedSearchParams.from) ?? "/ater-sociobio/atendimentos";

  let atendimento: AtendimentoWithDetails | null = null;
  let error: string | null = null;

  try {
    atendimento = await AterSociobioService.getAtendimentoById(atendimentoId);
  } catch (e: unknown) {
    console.error(e);
    error = getErrorMessage(e);
  }

  if (error === ATER_SETUP_ERROR) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-5xl flex-col gap-6">
          <div className="flex items-center gap-4">
            <Link href={returnHref} className="text-sm text-slate-500 hover:text-slate-700">
              Voltar
            </Link>
          </div>

          <AterSetupWarning />
        </div>
      </div>
    );
  }

  if (!atendimento) {
    notFound();
  }

  const diagnostico = atendimento.familia?.diagnostico;
  const indicadores = atendimento.familia?.indicadores;
  const insegurancaAlimentar = indicadores
    ? [
        indicadores.alimentacaoVariadaComprometida,
        indicadores.comidaAcabouSemCondicao,
        indicadores.deixouRefeicaoSemCondicao,
        indicadores.comeuMenosSemCondicao,
        indicadores.sentiuFomeENaoComeu,
      ].some(Boolean)
    : null;

  const renderEixo = (value: unknown, label: string) => {
    const eixoData = toEixoAtendimentoData(value);
    if (!eixoData || Object.keys(eixoData).length === 0) return null;

    return (
      <section className="rounded-3xl border border-slate-200 bg-slate-50/80 p-6">
        <h3 className="mb-4 text-base font-semibold capitalize text-slate-900">{label}</h3>
        <dl className="grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
          <div>
            <dt className="font-medium text-slate-500">Tipo de ação</dt>
            <dd className="mt-1 text-slate-900">{eixoData.tipoAcao ?? "-"}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-500">Etapa</dt>
            <dd className="mt-1 text-slate-900">{eixoData.etapa ?? "-"}</dd>
          </div>
          <div className="md:col-span-2">
            <dt className="font-medium text-slate-500">Impactos anteriores</dt>
            <dd className="mt-1 text-slate-900">{eixoData.impactosAnteriores ?? "-"}</dd>
          </div>
          <div className="md:col-span-2">
            <dt className="font-medium text-slate-500">Desenvolvimento</dt>
            <dd className="mt-1 text-slate-900">{eixoData.desenvolvimento ?? "-"}</dd>
          </div>
          <div className="md:col-span-2">
            <dt className="font-medium text-slate-500">Recomendações</dt>
            <dd className="mt-1 text-slate-900">{eixoData.recomendacoes ?? "-"}</dd>
          </div>
        </dl>
      </section>
    );
  };

  void renderEixo;

  const renderEixoDocumento11 = (value: unknown, label: string) => {
    const eixoData = toEixoAtendimentoData(value);
    if (!eixoData || Object.keys(eixoData).length === 0) return null;
    const isProdutivo = label.toLowerCase().includes("produtivo");
    const isSocial = label.toLowerCase().includes("social");
    const officialFields = isProdutivo
      ? [
          ["Tecnologia de produção", eixoData.tecnologiaProducao],
          ["Atividade produtiva", eixoData.atividadeProdutiva],
          ["Orientações", eixoData.orientacoes],
          ["Outras atividades da UFPA", eixoData.outrasAtividadesUfpa],
        ]
      : isSocial
        ? [
            ["Orientações / encaminhamentos", eixoData.orientacoesEncaminhamentos],
            ["Atividade social", eixoData.atividadeSocial],
            ["Orientações", eixoData.orientacoes],
          ]
        : [
            ["Tecnologia ambiental", eixoData.tecnologiaAmbiental],
            ["Atividade ambiental", eixoData.atividadeAmbiental],
            ["Orientações", eixoData.orientacoes],
          ];
    const hasLegacyData = Boolean(
      eixoData.tipoAcao ||
        eixoData.etapa ||
        eixoData.impactosAnteriores ||
        eixoData.desenvolvimento ||
        eixoData.recomendacoes,
    );

    return (
      <section className="rounded-3xl border border-slate-200 bg-slate-50/80 p-6">
        <h3 className="mb-4 text-base font-semibold capitalize text-slate-900">{label}</h3>
        <dl className="grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
          {officialFields.map(([fieldLabel, value]) => (
            <div key={fieldLabel} className="md:col-span-2">
              <dt className="font-medium text-slate-500">{fieldLabel}</dt>
              <dd className="mt-1 text-slate-900">{value ?? "-"}</dd>
            </div>
          ))}
          <div className="md:col-span-2">
            <dt className="font-medium text-slate-500">Resultados parciais/finais</dt>
            <dd className="mt-1 text-slate-900">{renderArray(eixoData.resultadosParciaisFinais)}</dd>
          </div>
          <div className="md:col-span-2">
            <dt className="font-medium text-slate-500">Indicadores trabalhados</dt>
            <dd className="mt-1 text-slate-900">{renderArray(eixoData.indicadoresTrabalhados)}</dd>
          </div>
          {hasLegacyData && (
            <>
              <div>
                <dt className="font-medium text-slate-500">Tipo de ação anterior</dt>
                <dd className="mt-1 text-slate-900">{eixoData.tipoAcao ?? "-"}</dd>
              </div>
              <div>
                <dt className="font-medium text-slate-500">Etapa anterior</dt>
                <dd className="mt-1 text-slate-900">{eixoData.etapa ?? "-"}</dd>
              </div>
              <div className="md:col-span-2">
                <dt className="font-medium text-slate-500">Impactos anteriores</dt>
                <dd className="mt-1 text-slate-900">{eixoData.impactosAnteriores ?? "-"}</dd>
              </div>
              <div className="md:col-span-2">
                <dt className="font-medium text-slate-500">Desenvolvimento anterior</dt>
                <dd className="mt-1 text-slate-900">{eixoData.desenvolvimento ?? "-"}</dd>
              </div>
              <div className="md:col-span-2">
                <dt className="font-medium text-slate-500">Recomendações anteriores</dt>
                <dd className="mt-1 text-slate-900">{eixoData.recomendacoes ?? "-"}</dd>
              </div>
            </>
          )}
        </dl>
      </section>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <div className="flex items-center gap-4">
          <Link href={returnHref} className="text-sm text-slate-500 hover:text-slate-700">
            Voltar
          </Link>
        </div>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">SIGGATER Web</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
                Visita #{atendimento.numeroVisita}
              </h1>
              <p className="mt-1 text-slate-600">
                {atendimento.data ? new Date(atendimento.data).toLocaleDateString("pt-BR") : "Sem data"}
              </p>
              <p className="mt-1 text-sm text-slate-500">{ATER_SOCIOBIO_TERRITORY_NAME}</p>
            </div>
            <div className="flex flex-col items-start gap-3 lg:items-end">
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${ATER_SOCIOBIO_STATUS_RELATORIO_COLORS[atendimento.statusRelatorio ?? ""] ?? "bg-slate-100 text-slate-600"}`}>
                {getAterSociobioStatusRelatorioLabel(atendimento.statusRelatorio)}
              </span>
              <Link href={`/ater-sociobio/atendimentos/${atendimentoId}/pdf`} target="_blank">
                <Button variant="primary">Baixar PDF</Button>
              </Link>
              <Link href={`/ater-sociobio/atendimentos/${atendimentoId}/editar`}>
                <Button variant="ghost">Editar atendimento</Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-lg font-semibold text-slate-900">Dados do atendimento</h2>
          <dl className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
            <div>
              <dt className="font-medium text-slate-500">UFPA</dt>
              <dd className="mt-1 text-slate-900">{atendimento.familia?.nomeFamilia ?? "-"}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-500">Município</dt>
              <dd className="mt-1 text-slate-900">{atendimento.familia?.municipio ?? "-"}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-500">Técnico</dt>
              <dd className="mt-1 text-slate-900">{atendimento.tecnicoRef?.nome ?? atendimento.tecnico ?? "-"}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-500">Houve atendimento</dt>
              <dd className="mt-1 text-slate-900">{formatBoolean(atendimento.houveAtendimento)}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-500">Projeto</dt>
              <dd className="mt-1 text-slate-900">{atendimento.projetoTitulo ?? atendimento.projetoId ?? "-"}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-500">Atividade número / total planejado</dt>
              <dd className="mt-1 text-slate-900">{atendimento.atividadeNumeroTotal ?? "-"}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-500">Código da Meta</dt>
              <dd className="mt-1 text-slate-900">{atendimento.codigoMeta ?? "-"}</dd>
            </div>
            <div className="md:col-span-2">
              <dt className="font-medium text-slate-500">Descrição da Meta</dt>
              <dd className="mt-1 text-slate-900">{atendimento.descricaoMeta ?? "-"}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-500">Nº Mulheres no atendimento</dt>
              <dd className="mt-1 text-slate-900">{formatNumber(atendimento.numeroMulheres)}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-500">Nº Jovens no atendimento</dt>
              <dd className="mt-1 text-slate-900">{formatNumber(atendimento.numeroJovens)}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-500">Enviado SGA</dt>
              <dd className="mt-1 text-slate-900">{formatBoolean(atendimento.enviadoSGA)}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-500">DAP/CAF</dt>
              <dd className="mt-1 text-slate-900">{atendimento.familia?.dapCaf ?? "-"}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-500">Programa de fomento</dt>
              <dd className="mt-1 text-slate-900">{atendimento.familia?.programaFomento ?? "-"}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-500">Diagnóstico da UFPA</dt>
              <dd className="mt-1 text-slate-900">{diagnostico ? "Registrado" : "Pendente"}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-500">Água tratada</dt>
              <dd className="mt-1 text-slate-900">{formatBoolean(diagnostico?.aguaConsumoTratada)}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-500">Internet</dt>
              <dd className="mt-1 text-slate-900">{formatBoolean(diagnostico?.possuiInternet)}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-500">CadÚnico</dt>
              <dd className="mt-1 text-slate-900">{formatBoolean(indicadores?.cadastradoCadUnico)}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-500">Insegurança alimentar</dt>
              <dd className="mt-1 text-slate-900">{formatBoolean(insegurancaAlimentar)}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-500">Status gestor</dt>
              <dd className="mt-1 text-slate-900">{atendimento.familia?.statusGestor ?? "-"}</dd>
            </div>
          </dl>
          {atendimento.familia && (
            <div className="mt-6 border-t border-slate-100 pt-4">
              <Link
                href={`/ater-sociobio/familias/${atendimento.familia.id}/diagnostico`}
                className="text-sm font-medium text-emerald-700 hover:underline"
              >
                Abrir diagnóstico da UFPA
              </Link>
            </div>
          )}
        </section>

        <div className="flex flex-col gap-6">
          {renderEixoDocumento11(atendimento.eixoProdutivo, "Eixo Produtivo")}
          {renderEixoDocumento11(atendimento.eixoSocial, "Eixo Social")}
          {renderEixoDocumento11(atendimento.eixoAmbiental, "Eixo Ambiental")}
        </div>
      </div>
    </div>
  );
}
