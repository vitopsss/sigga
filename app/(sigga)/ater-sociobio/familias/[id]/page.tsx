import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, Hash, MapPin, User, Users } from "lucide-react";

import { PDFDownloadLink } from "@react-pdf/renderer";
import { DiagnosticoReportPdf } from "@/components/ater/diagnostico-report-pdf";
import { AterSetupWarning } from "@/components/ater/setup-warning";
import { Button, Card, Badge } from "@/components/ui";
import { ATER_SETUP_ERROR, isAterMissingTableError } from "@/lib/ater-runtime";
import { Header } from "@/components/dashboard/header";
import {
  ATER_SOCIOBIO_STATUS_RELATORIO_COLORS,
  getAterSociobioStatusRelatorioLabel,
  isAterSociobioAtendimentoValido,
} from "@/lib/constants/ater-sociobio";
import {
  AterSociobioService,
  type AtendimentoWithDetails,
  type FamiliaWithCadastro,
} from "@/lib/services/ater-sociobio.service";

type Params = Promise<{ id: string }>;

export const dynamic = "force-dynamic";

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

function formatDate(value?: Date | string | null) {
  return value ? new Date(value).toLocaleDateString("pt-BR") : "-";
}

type AtividadeUfpaRow = {
  atividade?: unknown;
  producaoAnual?: unknown;
  unidade?: unknown;
  atividadePrincipal?: unknown;
};

function getAtividades(value: unknown): AtividadeUfpaRow[] {
  return Array.isArray(value) ? (value as AtividadeUfpaRow[]) : [];
}

function asText(value: unknown) {
  return typeof value === "string" || typeof value === "number" ? String(value) : "-";
}

function booleanText(value?: boolean | null) {
  return value === true ? "Sim" : value === false ? "Não" : "-";
}

export default async function FamiliaDetailPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;

  let familia: FamiliaWithCadastro | null = null;
  let atendimentos: AtendimentoWithDetails[] = [];
  let error: string | null = null;
  let setupMissing = false;

  try {
    [familia, atendimentos] = await Promise.all([
      AterSociobioService.getFamiliaById(id),
      AterSociobioService.listAtendimentos({ familiaId: id })
    ]);
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

  const atividadesUfpa = getAtividades(familia.envioSGAPorAtividade);
  const atendimentosValidos = atendimentos.filter((atendimento) =>
    isAterSociobioAtendimentoValido(atendimento.statusRelatorio),
  );

  return (
    <div className="min-h-screen bg-zinc-50/50">
      <Header
        title={familia.nomeFamilia}
        description={familia.nomeResponsavel ? `Responsável: ${familia.nomeResponsavel}` : "Detalhes da UFPA"}
        actions={
          <div className="flex flex-wrap gap-2">
            <Link href={`/ater-sociobio/familias/${familia.id}/editar`}>
              <Button variant="secondary" size="sm">Editar UFPA</Button>
            </Link>
            <PDFDownloadLink
              document={<DiagnosticoReportPdf familia={familia} />}
              fileName={`Diagnostico_${familia.nomeFamilia.replace(/\s+/g, "_")}.pdf`}
            >
              {({ loading }) => (
                <Button variant="secondary" size="sm" disabled={loading}>
                  {loading ? "Gerando..." : "Baixar Diagnóstico PDF"}
                </Button>
              )}
            </PDFDownloadLink>
            <Link href={`/ater-sociobio/familias/${familia.id}/diagnostico`}>
              <Button variant="primary" size="sm">
                {familia.diagnostico || familia.indicadores ? "Diagnóstico & Indicadores" : "Preencher Diagnóstico"}
              </Button>
            </Link>
            <Link href={`/ater-sociobio/atendimentos/nova?familiaId=${familia.id}`}>
              <Button variant="secondary" size="sm">Novo atendimento</Button>
            </Link>
          </div>
        }
      />

      <div className="p-6 lg:p-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-8">

          <div className="flex flex-wrap items-center gap-3">
            {familia.diagnostico ? (
              <Badge variant="success-subtle" className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider">Diagnóstico OK</Badge>
            ) : (
              <Badge variant="warning-subtle" className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider">Diagnóstico Pendente</Badge>
            )}
            {familia.indicadores ? (
              <Badge variant="success-subtle" className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider">Indicadores OK</Badge>
            ) : (
              <Badge variant="warning-subtle" className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider">Indicadores Pendentes</Badge>
            )}
            {familia.diagnostico?.lgpdConsentimento ? (
              <Badge variant="success-subtle" className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider">LGPD OK</Badge>
            ) : (
              <Badge variant="destructive-subtle" className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider">LGPD Pendente</Badge>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <Card className="p-5">
              <p className="flex items-center gap-1 text-sm font-semibold text-zinc-500 uppercase tracking-wider">
                <Users className="h-4 w-4" />
                Integrantes
              </p>
              <p className="mt-2 text-3xl font-bold text-zinc-950">{familia.integrantes.length || familia.quantidadeMembros || "0"}</p>
            </Card>
            <Card className="p-5">
              <p className="flex items-center gap-1 text-sm font-semibold text-zinc-500 uppercase tracking-wider">
                <MapPin className="h-4 w-4" />
                Município
              </p>
              <p className="mt-2 text-xl font-bold text-zinc-950">{familia.municipio ?? "-"}</p>
            </Card>
            <Card className="p-5">
              <p className="flex items-center gap-1 text-sm font-semibold text-zinc-500 uppercase tracking-wider">
                <Hash className="h-4 w-4" />
                DAP/CAF
              </p>
              <div className="mt-2">
                {familia.dapCaf ? (
                  <span className="inline-flex rounded-lg bg-emerald-50 px-3 py-1 text-lg font-bold text-emerald-700">
                    {familia.dapCaf}
                  </span>
                ) : (
                  <p className="text-xl font-bold text-zinc-300">-</p>
                )}
              </div>
            </Card>
            <Card className="p-5">
              <p className="flex items-center gap-1 text-sm font-semibold text-zinc-500 uppercase tracking-wider">
                <Calendar className="h-4 w-4" />
                Visitas
              </p>
              <p className="mt-2 text-3xl font-bold text-zinc-950">{atendimentosValidos.length}</p>
            </Card>
          </div>

          <section className="rounded-[2rem] border border-zinc-200 bg-white p-8 shadow-sm">
            <h2 className="mb-6 flex items-center gap-2 text-lg font-bold text-zinc-900">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Dados da UFPA
            </h2>
            <dl className="grid grid-cols-1 gap-6 text-sm md:grid-cols-2 lg:grid-cols-3">
              <div>
                <dt className="text-xs font-bold uppercase tracking-widest text-zinc-400">Responsável</dt>
                <dd className="mt-1 text-base font-semibold text-zinc-900">{familia.nomeResponsavel ?? "-"}</dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase tracking-widest text-zinc-400">CPF do responsável</dt>
                <dd className="mt-1 text-base font-semibold text-zinc-900">{familia.documentoResponsavel ?? "-"}</dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase tracking-widest text-zinc-400">Município</dt>
                <dd className="mt-1 text-base font-semibold text-zinc-900">{familia.municipio ?? "-"}</dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase tracking-widest text-zinc-400">Comunidade</dt>
                <dd className="mt-1 text-base font-semibold text-zinc-900">{familia.comunidade ?? "-"}</dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase tracking-widest text-zinc-400">Organização coletiva</dt>
                <dd className="mt-1 text-base font-semibold">
                  {familia.organizacaoColetiva ? (
                    <Link href={`/ater-sociobio/organizacoes/${familia.organizacaoColetiva.id}`} className="text-emerald-600 hover:text-emerald-700">
                      {familia.organizacaoColetiva.denominacao}
                    </Link>
                  ) : (
                    "-"
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase tracking-widest text-zinc-400">DAP/CAF</dt>
                <dd className="mt-1">
                  {familia.dapCaf ? (
                    <span className="inline-flex rounded-md bg-zinc-950 px-2.5 py-1 text-xs font-bold text-white">
                      {familia.dapCaf}
                    </span>
                  ) : (
                    <span className="text-zinc-400">-</span>
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase tracking-widest text-zinc-400">Código SGA</dt>
                <dd className="mt-1">
                  {familia.codigoSGA ? (
                    <span className="inline-flex rounded-md bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">
                      {familia.codigoSGA}
                    </span>
                  ) : (
                    <span className="text-zinc-400">-</span>
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase tracking-widest text-zinc-400">LGPD / Adesão</dt>
                <dd className="mt-1">
                  {familia.diagnostico?.referenciaAnexoLgpd ? (
                    <span className="inline-flex rounded-md bg-zinc-100 px-2.5 py-1 text-xs font-bold text-zinc-900">
                      Ref: {familia.diagnostico.referenciaAnexoLgpd}
                    </span>
                  ) : (
                    <span className="text-zinc-400">Sem referência</span>
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase tracking-widest text-zinc-400">Data de Referência</dt>
                <dd className="mt-1 text-base font-semibold text-zinc-900">{formatDate(familia.cadastro.createdAt)}</dd>
              </div>
            </dl>
          </section>

          <section className="rounded-[2rem] border border-zinc-200 bg-white p-8 shadow-sm">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-bold text-zinc-900">
                <Users className="h-5 w-5 text-emerald-600" />
                Composição Familiar
              </h2>
              <Badge variant="outline" className="font-bold">{familia.integrantes.length} integrantes</Badge>
            </div>

            {familia.integrantes.length === 0 ? (
              <p className="text-sm text-zinc-500">Nenhum integrante cadastrado para esta UFPA.</p>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {familia.integrantes.map((integrante) => (
                  <div key={integrante.id} className="relative overflow-hidden rounded-2xl border border-zinc-100 bg-zinc-50/50 p-5 transition hover:border-zinc-200 hover:bg-zinc-50">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`rounded-full p-2 ${integrante.responsavelUfpa ? "bg-emerald-100 text-emerald-700" : "bg-white text-zinc-400 border border-zinc-200"}`}>
                          <User className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-zinc-950">{integrante.nome}</p>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{integrante.parentesco || "Parentesco não informado"}</p>
                        </div>
                      </div>
                      {integrante.responsavelUfpa && (
                        <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white uppercase">Responsável</span>
                      )}
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-y-3 text-[11px]">
                      <div>
                        <p className="font-bold text-zinc-400 uppercase tracking-tighter">CPF</p>
                        <p className="font-medium text-zinc-700">{integrante.cpf || "-"}</p>
                      </div>
                      <div>
                        <p className="font-bold text-zinc-400 uppercase tracking-tighter">Nascimento</p>
                        <p className="font-medium text-zinc-700">{formatDate(integrante.dataNascimento)}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="font-bold text-zinc-400 uppercase tracking-tighter">NIS / CadÚnico</p>
                        <p className="font-medium text-zinc-700">{integrante.nisCadUnico || "-"}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-[2rem] border border-zinc-200 bg-white p-8 shadow-sm">
            <h2 className="mb-6 flex items-center gap-2 text-lg font-bold text-zinc-900">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Atividades produtivas da UFPA
            </h2>
            {atividadesUfpa.length === 0 ? (
              <p className="text-zinc-500">Nenhuma atividade produtiva cadastrada para esta UFPA.</p>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-zinc-200">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-100 bg-zinc-50 text-left">
                      <th className="px-6 py-4 font-medium text-zinc-600">Atividade</th>
                      <th className="px-6 py-4 font-medium text-zinc-600">Produção anual</th>
                      <th className="px-6 py-4 font-medium text-zinc-600">Unidade</th>
                      <th className="px-6 py-4 font-medium text-zinc-600">Atividade principal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {atividadesUfpa.map((atividade, index) => (
                      <tr key={index} className="hover:bg-zinc-50">
                        <td className="px-6 py-4 font-medium text-zinc-900">{asText(atividade.atividade)}</td>
                        <td className="px-6 py-4 text-zinc-600">{asText(atividade.producaoAnual)}</td>
                        <td className="px-6 py-4 text-zinc-600">{asText(atividade.unidade)}</td>
                        <td className="px-6 py-4 text-zinc-600">{booleanText(atividade.atividadePrincipal === true ? true : atividade.atividadePrincipal === false ? false : null)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="rounded-[2rem] border border-zinc-200 bg-white p-8 shadow-sm">
            <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-bold text-zinc-900">Diagnóstico e indicadores</h2>
                <p className="mt-1 text-sm text-zinc-500">
                  Base estruturada para métricas e plano de ação da UFPA.
                </p>
              </div>
              <Link href={`/ater-sociobio/familias/${familia.id}/diagnostico`}>
                <Button variant="secondary">{familia.diagnostico || familia.indicadores ? "Atualizar diagnóstico completo" : "Preencher diagnóstico completo"}</Button>
              </Link>
            </div>

            {!familia.diagnostico && !familia.indicadores ? (
              <p className="text-zinc-500">Nenhum diagnóstico estruturado registrado para esta UFPA.</p>
            ) : (
              <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl border border-zinc-100 bg-zinc-50/50 p-4">
                  <p className="font-bold text-zinc-400 uppercase tracking-tighter text-[10px]">Data do diagnóstico</p>
                  <p className="mt-1 font-semibold text-zinc-900">{formatDate(familia.diagnostico?.dataDiagnostico)}</p>
                </div>
                <div className="rounded-2xl border border-zinc-100 bg-zinc-50/50 p-4">
                  <p className="font-bold text-zinc-400 uppercase tracking-tighter text-[10px]">Internet</p>
                  <p className="mt-1 font-semibold text-zinc-900">{booleanText(familia.diagnostico?.possuiInternet)}</p>
                </div>
                <div className="rounded-2xl border border-zinc-100 bg-zinc-50/50 p-4">
                  <p className="font-bold text-zinc-400 uppercase tracking-tighter text-[10px]">Água tratada</p>
                  <p className="mt-1 font-semibold text-zinc-900">{booleanText(familia.diagnostico?.aguaConsumoTratada)}</p>
                </div>
                <div className="rounded-2xl border border-zinc-100 bg-zinc-50/50 p-4">
                  <p className="font-bold text-zinc-400 uppercase tracking-tighter text-[10px]">CadÚnico</p>
                  <p className="mt-1 font-semibold text-zinc-900">{booleanText(familia.indicadores?.cadastradoCadUnico)}</p>
                </div>
              </div>
            )}
          </section>

          <section className="rounded-[2rem] border border-zinc-200 bg-white p-8 shadow-sm">
            <h2 className="mb-6 flex items-center gap-2 text-lg font-bold text-zinc-900">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Histórico de atendimentos
            </h2>
            {atendimentos.length === 0 ? (
              <p className="text-zinc-500">Nenhum atendimento registrado para esta UFPA.</p>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-zinc-200">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-100 bg-zinc-50 text-left">
                      <th className="px-6 py-4 font-medium text-zinc-600">Visita</th>
                      <th className="px-6 py-4 font-medium text-zinc-600">Data</th>
                      <th className="px-6 py-4 font-medium text-zinc-600">Técnico</th>
                      <th className="px-6 py-4 font-medium text-zinc-600">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {atendimentos.map((at) => {
                      const tecnicoNome = at.tecnicoRef?.nome ?? at.tecnico;
                      return (
                        <tr key={at.id} className="hover:bg-zinc-50">
                          <td className="px-6 py-4 font-medium text-zinc-900">#{at.numeroVisita}</td>
                          <td className="px-6 py-4 text-zinc-500">
                            {at.data ? new Date(at.data).toLocaleDateString("pt-BR") : "-"}
                          </td>
                          <td className="px-6 py-4 text-zinc-500">{tecnicoNome ?? "-"}</td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${ATER_SOCIOBIO_STATUS_RELATORIO_COLORS[at.statusRelatorio] ?? "bg-zinc-100 text-zinc-600"}`}
                            >
                              {getAterSociobioStatusRelatorioLabel(at.statusRelatorio)}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
