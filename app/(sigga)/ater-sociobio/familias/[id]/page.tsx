import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, Hash, MapPin, User, Users } from "lucide-react";

import { DiagnosticoPdfLink } from "@/components/ater/diagnostico-pdf-link";
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
import { firstSearchParam, type SearchParamValue } from "@/lib/search-params";

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
  searchParams,
}: {
  params: Params;
  searchParams: Promise<{ from?: SearchParamValue }>;
}) {
  const { id } = await params;
  const { from } = await searchParams;
  const fromValue = firstSearchParam(from).trim();

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

  // Next.js cannot pass Prisma Decimal to Client Components
  if (familia.indicadores && familia.indicadores.valorBrutoProducaoUltimos12Meses && typeof familia.indicadores.valorBrutoProducaoUltimos12Meses === "object") {
    // @ts-ignore - Bypass readonly properties just for serialization to Client Components
    familia.indicadores.valorBrutoProducaoUltimos12Meses = Number(familia.indicadores.valorBrutoProducaoUltimos12Meses);
  }

  const atividadesUfpa = getAtividades(familia.envioSGAPorAtividade);
  const atendimentosValidos = atendimentos.filter((atendimento) =>
    isAterSociobioAtendimentoValido(atendimento.statusRelatorio),
  );

  const currentUrl = `/ater-sociobio/familias/${id}${fromValue ? `?from=${encodeURIComponent(fromValue)}` : ""}`;
  const appendFromDetails = (href: string) => {
    const connector = href.includes("?") ? "&" : "?";
    return `${href}${connector}from=${encodeURIComponent(currentUrl)}`;
  };

  return (
    <div className="min-h-screen bg-zinc-50/50">
      <Header
        title={familia.nomeFamilia}
        description={familia.nomeResponsavel ? `Responsável: ${familia.nomeResponsavel}` : "Detalhes da UFPA"}
        actions={
          <div className="flex flex-wrap gap-2">
            <Link href={appendFromDetails(`/ater-sociobio/familias/${familia.id}/editar`)}>
              <Button variant="secondary" size="sm">Editar UFPA</Button>
            </Link>
            <DiagnosticoPdfLink familia={familia} />
            <Link href={appendFromDetails(`/ater-sociobio/familias/${familia.id}/indicadores`)}>
              <Button variant="primary" size="sm">
                {familia.indicadores ? "Editar Indicadores" : "Preencher Indicadores"}
              </Button>
            </Link>
            <Link href={appendFromDetails(`/ater-sociobio/atendimentos/nova?familiaId=${familia.id}`)}>
              <Button variant="secondary" size="sm">Novo atendimento</Button>
            </Link>
          </div>
        }
      />

      <div className="p-6 lg:p-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-8">

          <div className="flex flex-wrap items-center gap-3">
            {familia.dataCadastro ? (
              <Badge variant="success-subtle" className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider">Diagnóstico OK</Badge>
            ) : (
              <Badge variant="warning-subtle" className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider">Diagnóstico Pendente</Badge>
            )}
            {familia.indicadores ? (
              <Badge variant="success-subtle" className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider">Indicadores OK</Badge>
            ) : (
              <Badge variant="warning-subtle" className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider">Indicadores Pendentes</Badge>
            )}
            {familia.lgpdConsentimento ? (
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
                    <div className="flex flex-col gap-1">
                      <span className="inline-flex w-fit rounded-md bg-zinc-950 px-2.5 py-1 text-xs font-bold text-white">
                        {familia.dapCaf}
                      </span>
                      {(familia.dapCafOrgaoEmissor || familia.dapCafValidade) && (
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                          {familia.dapCafOrgaoEmissor}{familia.dapCafOrgaoEmissor && familia.dapCafValidade ? " - " : ""}
                          {familia.dapCafValidade ? `Val: ${formatDate(familia.dapCafValidade)}` : ""}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-zinc-400">-</span>
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase tracking-widest text-zinc-400">Endereço</dt>
                <dd className="mt-1 text-base font-semibold text-zinc-900">
                  {familia.enderecoUfpa || "-"}
                  {familia.complementoUfpa ? ` (${familia.complementoUfpa})` : ""}
                  {familia.cepUfpa ? ` - CEP: ${familia.cepUfpa}` : ""}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase tracking-widest text-zinc-400">Coordenadas</dt>
                <dd className="mt-1 text-base font-semibold text-zinc-900">
                  {familia.latitude && familia.longitude ? `${familia.latitude}, ${familia.longitude}` : "-"}
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
                  {familia.referenciaAnexoLgpd ? (
                    <span className="inline-flex rounded-md bg-zinc-100 px-2.5 py-1 text-xs font-bold text-zinc-900">
                      Ref: {familia.referenciaAnexoLgpd}
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
              {familia.dataCadastro || familia.indicadores ? (
                <Link href={appendFromDetails(`/ater-sociobio/familias/${familia.id}/diagnostico`)}>
                  <Button variant="secondary">Atualizar diagnóstico completo</Button>
                </Link>
              ) : null}
            </div>

            {!familia.dataCadastro && !familia.indicadores ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-emerald-100 bg-emerald-50/50 py-12 text-center">
                <div className="mb-4 rounded-full bg-emerald-100 p-3 text-emerald-600">
                  <Calendar className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-base font-bold text-zinc-900">Nenhum diagnóstico registrado</h3>
                <p className="mb-6 max-w-sm text-sm text-zinc-500">
                  O diagnóstico estruturado é fundamental para traçar o plano de ação e gerar métricas para esta UFPA.
                </p>
                <Link href={appendFromDetails(`/ater-sociobio/familias/${familia.id}/diagnostico`)}>
                  <Button variant="primary" className="h-11 px-8">Preencher diagnóstico completo</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-2xl border border-zinc-100 bg-zinc-50/50 p-4">
                    <p className="font-bold text-zinc-400 uppercase tracking-tighter text-[10px]">Data do diagnóstico</p>
                    <p className="mt-1 font-semibold text-zinc-900">{formatDate(familia.dataCadastro)}</p>
                  </div>
                  <div className="rounded-2xl border border-zinc-100 bg-zinc-50/50 p-4">
                    <p className="font-bold text-zinc-400 uppercase tracking-tighter text-[10px]">Internet</p>
                    <p className="mt-1 font-semibold text-zinc-900">{booleanText(familia.possuiInternet)}</p>
                  </div>
                  <div className="rounded-2xl border border-zinc-100 bg-zinc-50/50 p-4">
                    <p className="font-bold text-zinc-400 uppercase tracking-tighter text-[10px]">Água tratada</p>
                    <p className="mt-1 font-semibold text-zinc-900">{booleanText(familia.aguaConsumoTratada)}</p>
                  </div>
                  <div className="rounded-2xl border border-zinc-100 bg-zinc-50/50 p-4">
                    <p className="font-bold text-zinc-400 uppercase tracking-tighter text-[10px]">CadÚnico</p>
                    <p className="mt-1 font-semibold text-zinc-900">{booleanText(familia.indicadores?.cadastradoCadUnico)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="rounded-2xl border border-zinc-100 p-6">
                    <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-zinc-400">Contexto Social e Político</h3>
                    <dl className="space-y-3 text-sm">
                      <div className="flex justify-between border-b border-zinc-50 pb-2">
                        <dt className="text-zinc-600 font-medium">Insegurança alimentar</dt>
                        <dd className="font-bold text-zinc-900">
                          {familia.indicadores
                            ? booleanText(
                                [
                                  familia.indicadores.alimentacaoVariadaComprometida,
                                  familia.indicadores.comidaAcabouSemCondicao,
                                  familia.indicadores.deixouRefeicaoSemCondicao,
                                  familia.indicadores.comeuMenosSemCondicao,
                                  familia.indicadores.sentiuFomeENaoComeu,
                                ].some(Boolean),
                              )
                            : "-"}
                        </dd>
                      </div>
                      <div className="flex justify-between border-b border-zinc-50 pb-2">
                        <dt className="text-zinc-600 font-medium">Políticas Sociais</dt>
                        <dd className="font-bold text-zinc-900">{booleanText(familia.indicadores?.acessaPoliticasSociais)}</dd>
                      </div>
                      <div className="flex justify-between border-b border-zinc-50 pb-2">
                        <dt className="text-zinc-600 font-medium">Participação Coletiva</dt>
                        <dd className="font-bold text-zinc-900">
                          {booleanText(
                            [
                              familia.indicadores?.participaGrupoComunitario,
                              familia.indicadores?.participaAssociacao,
                              familia.indicadores?.participaCooperativa,
                            ].some(Boolean),
                          )}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <div className="rounded-2xl border border-zinc-100 p-6">
                    <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-zinc-400">Canais de Comercialização</h3>
                    <div className="flex flex-wrap gap-2">
                      {familia.indicadores?.canalTrocaProdutoServico && <Badge variant="secondary">Troca</Badge>}
                      {familia.indicadores?.canalVendaPropriedade && <Badge variant="secondary">Venda na Propriedade</Badge>}
                      {familia.indicadores?.canalVendaDiretaConsumidor && <Badge variant="secondary">Venda Direta</Badge>}
                      {familia.indicadores?.canalFeira && <Badge variant="secondary">Feira</Badge>}
                      {familia.indicadores?.canalMercadoLocal && <Badge variant="secondary">Mercado Local</Badge>}
                      {familia.indicadores?.canalAtravessador && <Badge variant="secondary">Atravessador</Badge>}
                      {familia.indicadores?.canalPaa && <Badge variant="secondary">PAA</Badge>}
                      {familia.indicadores?.canalPnae && <Badge variant="secondary">PNAE</Badge>}
                      {familia.indicadores?.canalCooperativaEntreposto && <Badge variant="secondary">Cooperativa</Badge>}
                      {![
                        familia.indicadores?.canalTrocaProdutoServico,
                        familia.indicadores?.canalVendaPropriedade,
                        familia.indicadores?.canalVendaDiretaConsumidor,
                        familia.indicadores?.canalFeira,
                        familia.indicadores?.canalMercadoLocal,
                        familia.indicadores?.canalAtravessador,
                        familia.indicadores?.canalPaa,
                        familia.indicadores?.canalPnae,
                        familia.indicadores?.canalCooperativaEntreposto,
                      ].some(Boolean) && <span className="text-zinc-400 italic">Nenhum canal registrado</span>}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-zinc-100 p-6 md:col-span-2">
                    <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-zinc-400">Ações Potenciais e Limitações</h3>
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                      <div>
                        <p className="mb-3 font-semibold text-emerald-700">Ações Potenciais (Identificadas)</p>
                        <div className="space-y-4">
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Eixo Produtivo</p>
                            <div className="mt-1 flex flex-wrap gap-1">
                              {(familia.acoesPotenciaisProdutivo as string[])?.length ? (
                                (familia.acoesPotenciaisProdutivo as string[]).map((item) => (
                                  <Badge key={item} variant="secondary" className="text-xs font-normal text-zinc-700">{item}</Badge>
                                ))
                              ) : <span className="text-sm text-zinc-400 italic">Não informado</span>}
                            </div>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Eixo Social</p>
                            <div className="mt-1 flex flex-wrap gap-1">
                              {(familia.acoesPotenciaisSocial as string[])?.length ? (
                                (familia.acoesPotenciaisSocial as string[]).map((item) => (
                                  <Badge key={item} variant="secondary" className="text-xs font-normal text-zinc-700">{item}</Badge>
                                ))
                              ) : <span className="text-sm text-zinc-400 italic">Não informado</span>}
                            </div>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Eixo Ambiental</p>
                            <div className="mt-1 flex flex-wrap gap-1">
                              {(familia.acoesPotenciaisAmbiental as string[])?.length ? (
                                (familia.acoesPotenciaisAmbiental as string[]).map((item) => (
                                  <Badge key={item} variant="secondary" className="text-xs font-normal text-zinc-700">{item}</Badge>
                                ))
                              ) : <span className="text-sm text-zinc-400 italic">Não informado</span>}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <p className="mb-3 font-semibold text-rose-700">Limitações (Identificadas)</p>
                        <div className="space-y-4">
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Eixo Produtivo</p>
                            <div className="mt-1 flex flex-wrap gap-1">
                              {(familia.limitacoesProdutivo as string[])?.length ? (
                                (familia.limitacoesProdutivo as string[]).map((item) => (
                                  <Badge key={item} variant="destructive-subtle" className="text-xs font-normal text-zinc-700">{item}</Badge>
                                ))
                              ) : <span className="text-sm text-zinc-400 italic">Não informado</span>}
                            </div>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Eixo Social</p>
                            <div className="mt-1 flex flex-wrap gap-1">
                              {(familia.limitacoesSocial as string[])?.length ? (
                                (familia.limitacoesSocial as string[]).map((item) => (
                                  <Badge key={item} variant="destructive-subtle" className="text-xs font-normal text-zinc-700">{item}</Badge>
                                ))
                              ) : <span className="text-sm text-zinc-400 italic">Não informado</span>}
                            </div>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Eixo Ambiental</p>
                            <div className="mt-1 flex flex-wrap gap-1">
                              {(familia.limitacoesAmbiental as string[])?.length ? (
                                (familia.limitacoesAmbiental as string[]).map((item) => (
                                  <Badge key={item} variant="destructive-subtle" className="text-xs font-normal text-zinc-700">{item}</Badge>
                                ))
                              ) : <span className="text-sm text-zinc-400 italic">Não informado</span>}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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
