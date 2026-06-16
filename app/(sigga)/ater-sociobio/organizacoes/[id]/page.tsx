import Link from "next/link";
import { notFound } from "next/navigation";
import { Building2, ClipboardList, MapPin, Users } from "lucide-react";

import { AterSetupWarning } from "@/components/ater/setup-warning";
import { Header } from "@/components/dashboard/header";
import { Badge, Button, Card, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui";
import { ATER_SETUP_ERROR, isAterMissingTableError } from "@/lib/ater-runtime";
import {
  AterSociobioService,
  type OrganizacaoColetivaWithFamilias,
} from "@/lib/services/ater-sociobio.service";
import { firstSearchParam, safeInternalPath, type SearchParamValue } from "@/lib/search-params";

type Params = Promise<{ id: string }>;

export const dynamic = "force-dynamic";

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

function formatDate(value?: Date | string | null) {
  return value ? new Date(value).toLocaleDateString("pt-BR") : "-";
}

function formatBoolean(value: boolean | null | undefined) {
  if (value === true) return "Sim";
  if (value === false) return "Não";
  return "-";
}

function getAtividadesRows(value: unknown) {
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (!item || typeof item !== "object") return { descricao: "", unidade: "" };
        const record = item as Record<string, unknown>;
        return {
          descricao: typeof record.descricao === "string" ? record.descricao : "",
          unidade: typeof record.unidade === "string" ? record.unidade : "",
        };
      })
      .filter((item) => item.descricao || item.unidade);
  }

  if (!value || typeof value !== "object") return [];

  const record = value as Record<string, unknown>;
  return [
    {
      descricao: typeof record.descricao === "string" ? record.descricao : "",
      unidade: typeof record.unidade === "string" ? record.unidade : "",
    },
  ].filter((item) => item.descricao || item.unidade);
}

export default async function OrganizacaoColetivaDetailPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams?: Promise<{ from?: SearchParamValue }>;
}) {
  const { id } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const fromValue = firstSearchParam(resolvedSearchParams.from).trim();
  const returnHref = safeInternalPath(resolvedSearchParams.from, "/ater-sociobio") ?? "/ater-sociobio/organizacoes";

  const currentUrl = `/ater-sociobio/organizacoes/${id}${fromValue ? `?from=${encodeURIComponent(fromValue)}` : ""}`;
  const appendFromDetails = (href: string) => {
    const connector = href.includes("?") ? "&" : "?";
    return `${href}${connector}from=${encodeURIComponent(currentUrl)}`;
  };

  let organizacao: OrganizacaoColetivaWithFamilias | null = null;
  let error: string | null = null;
  let setupMissing = false;

  try {
    organizacao = await AterSociobioService.getOrganizacaoColetivaById(id);
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

  if (!organizacao) {
    notFound();
  }

  const atividades = getAtividadesRows(organizacao.atividades);
  const indicadores = organizacao.indicadores;

  return (
    <div className="min-h-screen bg-zinc-50/50">
      <Header
        title={organizacao.denominacao}
        description="Cadastro da Organização Social - Sociobiodiversidade"
        actions={
          <div className="flex flex-wrap gap-2">
            <Link href={returnHref}>
              <Button variant="secondary" size="sm">Voltar para a lista</Button>
            </Link>
            <Link href={appendFromDetails(`/ater-sociobio/organizacoes/${organizacao.id}/indicadores`)}>
              <Button variant="secondary" size="sm">
                <ClipboardList className="h-4 w-4 text-emerald-600" />
                Indicadores
              </Button>
            </Link>
            <Link href={appendFromDetails(`/ater-sociobio/organizacoes/${organizacao.id}/editar`)}>
              <Button variant="primary" size="sm">Editar organização</Button>
            </Link>
          </div>
        }
      />

      <div className="p-6 lg:p-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-8">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card className="p-5">
              <p className="flex items-center gap-1 text-sm font-semibold text-zinc-500 uppercase tracking-wider">
                <Users className="h-4 w-4" />
                UFPAs vinculadas
              </p>
              <p className="mt-2 text-3xl font-bold text-zinc-950">{organizacao._count.familias}</p>
            </Card>
            <Card className="p-5">
              <p className="flex items-center gap-1 text-sm font-semibold text-zinc-500 uppercase tracking-wider">
                <MapPin className="h-4 w-4" />
                Município
              </p>
              <p className="mt-2 text-xl font-bold text-zinc-950">{organizacao.municipio ?? "-"}</p>
            </Card>
            <Card className="p-5">
              <p className="flex items-center gap-1 text-sm font-semibold text-zinc-500 uppercase tracking-wider">
                <Building2 className="h-4 w-4" />
                Famílias (Estimativa)
              </p>
              <p className="mt-2 text-3xl font-bold text-zinc-950">{organizacao.numeroFamilias ?? "-"}</p>
            </Card>
          </div>

          <section className="rounded-[2rem] border border-zinc-200 bg-white p-8 shadow-sm">
            <h2 className="mb-6 flex items-center gap-2 text-lg font-bold text-zinc-900">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Dados da Organização
            </h2>
            <dl className="grid grid-cols-1 gap-6 text-sm md:grid-cols-2">
              <div>
                <dt className="text-xs font-bold uppercase tracking-widest text-zinc-400">Entidade executora</dt>
                <dd className="mt-1 text-base font-semibold text-zinc-900">{organizacao.entidadeExecutoraNome ?? "-"}</dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase tracking-widest text-zinc-400">CNPJ da Executora</dt>
                <dd className="mt-1 text-base font-semibold text-zinc-900">{organizacao.entidadeExecutoraCnpj ?? "-"}</dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase tracking-widest text-zinc-400">Unidade de Serviços</dt>
                <dd className="mt-1 text-base font-semibold text-zinc-900">{organizacao.unidadeServicos ?? "-"}</dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase tracking-widest text-zinc-400">Número do instrumento</dt>
                <dd className="mt-1 text-base font-semibold text-zinc-900">{organizacao.numeroInstrumento ?? "-"}</dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase tracking-widest text-zinc-400">Responsável de ATER</dt>
                <dd className="mt-1 text-base font-semibold text-zinc-900">{organizacao.agenteAterNome1 ?? "-"}</dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase tracking-widest text-zinc-400">CPF do Responsável ATER</dt>
                <dd className="mt-1 text-base font-semibold text-zinc-900">{organizacao.agenteAterCpf1 ?? "-"}</dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase tracking-widest text-zinc-400">Estado / UF</dt>
                <dd className="mt-1 text-base font-semibold text-zinc-900">{organizacao.uf ?? "-"}</dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase tracking-widest text-zinc-400">Data de Cadastro</dt>
                <dd className="mt-1 text-base font-semibold text-zinc-900">{formatDate(organizacao.dataCadastro)}</dd>
              </div>
              <div className="md:col-span-2">
                <dt className="text-xs font-bold uppercase tracking-widest text-zinc-400">Observações</dt>
                <dd className="mt-1 whitespace-pre-wrap text-base font-semibold text-zinc-900">{organizacao.observacoes ?? "-"}</dd>
              </div>
            </dl>

            <div className="mt-8 overflow-hidden rounded-2xl border border-zinc-200">
              <Table>
                <TableHeader>
                  <TableRow className="bg-zinc-50 hover:bg-zinc-50">
                    <TableHead className="w-16 font-bold">Nº</TableHead>
                    <TableHead className="font-bold uppercase tracking-wider text-[10px]">Atividades produtivas / extrativismo / serviços</TableHead>
                    <TableHead className="w-40 font-bold uppercase tracking-wider text-[10px]">Unidade</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {atividades.length ? (
                    atividades.map((atividade, index) => (
                      <TableRow key={`${atividade.descricao}-${index}`}>
                        <TableCell className="font-bold text-zinc-400">{index + 1}.</TableCell>
                        <TableCell className="font-semibold text-zinc-900">{atividade.descricao || "-"}</TableCell>
                        <TableCell className="font-semibold text-zinc-900">{atividade.unidade || "-"}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-zinc-500 py-8 text-center font-medium">
                        Nenhuma atividade registrada.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </section>

          <section className="rounded-[2rem] border border-zinc-200 bg-white p-8 shadow-sm">
            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-zinc-900">Indicadores Coletivos</h2>
                <p className="mt-1 text-sm text-zinc-500 font-medium">Monitoramento do Doc 6: indicadores da organização coletiva.</p>
              </div>
              <Link href={appendFromDetails(`/ater-sociobio/organizacoes/${organizacao.id}/indicadores`)}>
                <Button variant={indicadores ? "secondary" : "primary"} size="sm">{indicadores ? "Atualizar indicadores" : "Preencher indicadores"}</Button>
              </Link>
            </div>

            {!indicadores ? (
              <p className="text-sm text-zinc-500">Indicadores coletivos ainda não preenchidos.</p>
            ) : (
              <div className="space-y-8">
                <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-2xl border border-zinc-100 bg-zinc-50/50 p-4">
                    <p className="font-bold text-zinc-400 uppercase tracking-tighter text-[10px]">Práticas ambientais</p>
                    <p className="mt-1 font-semibold text-zinc-900">{formatBoolean(indicadores.possuiPraticasAmbientais)}</p>
                    {indicadores.praticasAmbientaisQuais && <p className="mt-2 text-[10px] text-zinc-500 italic">{indicadores.praticasAmbientaisQuais}</p>}
                  </div>
                  <div className="rounded-2xl border border-zinc-100 bg-zinc-50/50 p-4">
                    <p className="font-bold text-zinc-400 uppercase tracking-tighter text-[10px]">Identidade comercial</p>
                    <p className="mt-1 font-semibold text-zinc-900">{formatBoolean(indicadores.usaIdentidadeComercial)}</p>
                    {indicadores.identidadeComercialQuais && <p className="mt-2 text-[10px] text-zinc-500 italic">{indicadores.identidadeComercialQuais}</p>}
                  </div>
                  <div className="rounded-2xl border border-zinc-100 bg-zinc-50/50 p-4">
                    <p className="font-bold text-zinc-400 uppercase tracking-tighter text-[10px]">Mulheres na direção</p>
                    <p className="mt-1 font-semibold text-zinc-900">{formatBoolean(indicadores.possuiMulheresDiretoriaConselho)}</p>
                  </div>
                  <div className="rounded-2xl border border-zinc-100 bg-zinc-50/50 p-4">
                    <p className="font-bold text-zinc-400 uppercase tracking-tighter text-[10px]">Políticas públicas</p>
                    <p className="mt-1 font-semibold text-zinc-900">{formatBoolean(indicadores.acessaPoliticasPublicas)}</p>
                    {indicadores.politicasPublicasQuais && <p className="mt-2 text-[10px] text-zinc-500 italic">{indicadores.politicasPublicasQuais}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="rounded-2xl border border-zinc-100 p-6">
                    <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-zinc-400">Detalhamento Social</h3>
                    <dl className="space-y-3 text-sm">
                      <div className="flex justify-between border-b border-zinc-50 pb-2">
                        <dt className="text-zinc-600 font-medium">Jovens na diretoria/conselho</dt>
                        <dd className="font-bold text-zinc-900">{formatBoolean(indicadores.possuiJovensDiretoriaConselho)}</dd>
                      </div>
                      <div className="flex justify-between border-b border-zinc-50 pb-2">
                        <dt className="text-zinc-600 font-medium">Filiada a organização</dt>
                        <dd className="font-bold text-zinc-900">{formatBoolean(indicadores.filiadaOrganizacao)}</dd>
                      </div>
                      {indicadores.representacaoPoliticaQuais && (
                        <div className="pt-1">
                          <dt className="text-[10px] font-bold uppercase text-zinc-400">Outras filiações</dt>
                          <dd className="mt-1 text-zinc-700 italic">{indicadores.representacaoPoliticaQuais}</dd>
                        </div>
                      )}
                    </dl>
                  </div>

                  <div className="rounded-2xl border border-zinc-100 p-6">
                    <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-zinc-400">Canais de Comercialização</h3>
                    <div className="flex flex-wrap gap-2">
                      {indicadores.canalTrocaProdutoServico && <Badge variant="secondary">Troca</Badge>}
                      {indicadores.canalVendaOrganizacao && <Badge variant="secondary">Venda na Org</Badge>}
                      {indicadores.canalVendaDiretaConsumidor && <Badge variant="secondary">Venda Direta</Badge>}
                      {indicadores.canalFeira && <Badge variant="secondary">Feira</Badge>}
                      {indicadores.canalMercadoLocal && <Badge variant="secondary">Mercado Local</Badge>}
                      {indicadores.canalAtravessador && <Badge variant="secondary">Atravessador</Badge>}
                      {indicadores.canalPaa && <Badge variant="secondary">PAA</Badge>}
                      {indicadores.canalPnae && <Badge variant="secondary">PNAE</Badge>}
                      {indicadores.canalMercadoJustoSolidario && <Badge variant="secondary">Mercado Justo</Badge>}
                      {![indicadores.canalTrocaProdutoServico, indicadores.canalVendaOrganizacao, indicadores.canalVendaDiretaConsumidor, indicadores.canalFeira, indicadores.canalMercadoLocal, indicadores.canalAtravessador, indicadores.canalPaa, indicadores.canalPnae, indicadores.canalMercadoJustoSolidario].some(Boolean) && (
                        <span className="text-zinc-400 italic">Nenhum canal registrado</span>
                      )}
                    </div>
                  </div>
                </div>

                {indicadores.observacoes && (
                  <div className="rounded-2xl bg-zinc-50 p-6">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Observações dos Indicadores</h3>
                    <p className="mt-2 text-sm text-zinc-700 whitespace-pre-wrap font-medium">{indicadores.observacoes}</p>
                  </div>
                )}
              </div>
            )}
          </section>

          <section className="rounded-[2rem] border border-zinc-200 bg-white p-8 shadow-sm">
            <h2 className="mb-6 flex items-center gap-2 text-lg font-bold text-zinc-900">
              <Users className="h-5 w-5 text-emerald-600" />
              UFPAs vinculadas
            </h2>
            {organizacao.familias.length === 0 ? (
              <p className="text-zinc-500 font-medium">Nenhuma UFPA vinculada a esta organização coletiva.</p>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-zinc-100">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-zinc-50 hover:bg-zinc-50">
                      <TableHead className="font-bold uppercase tracking-wider text-[10px]">UFPA</TableHead>
                      <TableHead className="font-bold uppercase tracking-wider text-[10px]">Município</TableHead>
                      <TableHead className="font-bold uppercase tracking-wider text-[10px]">Diagnóstico</TableHead>
                      <TableHead className="font-bold uppercase tracking-wider text-[10px]">Visitas</TableHead>
                      <TableHead className="text-right font-bold uppercase tracking-wider text-[10px]">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {organizacao.familias.map((familia) => (
                      <TableRow key={familia.id} className="hover:bg-zinc-50/50">
                        <TableCell>
                          <div>
                            <p className="font-bold text-zinc-950">{familia.nomeFamilia}</p>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{familia.nomeResponsavel ?? ""}</p>
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold text-zinc-700">{familia.municipio ?? "-"}</TableCell>
                        <TableCell>
                          <Badge variant={familia.diagnostico || familia.indicadores ? "success-subtle" : "warning-subtle"} className="font-bold text-[10px] uppercase">
                            {familia.diagnostico || familia.indicadores ? "Registrado" : "Pendente"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-bold">{familia._count.atendimentos}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Link href={`/ater-sociobio/familias/${familia.id}`} className="text-xs font-bold text-emerald-600 hover:text-emerald-700">
                            Ver detalhes
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </section>

          <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="mb-6 text-lg font-semibold text-slate-900">Leitura rápida de métricas</h2>
            <dl className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2 lg:grid-cols-4">
              <div>
                <dt className="font-medium text-slate-500">Sem diagnóstico</dt>
                <dd className="mt-1 text-slate-900">
                  {organizacao.familias.filter((familia) => !familia.diagnostico && !familia.indicadores).length}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-slate-500">Sem internet</dt>
                <dd className="mt-1 text-slate-900">
                  {organizacao.familias.filter((familia) => familia.diagnostico?.possuiInternet === false).length}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-slate-500">Sem água tratada</dt>
                <dd className="mt-1 text-slate-900">
                  {organizacao.familias.filter((familia) => familia.diagnostico?.aguaConsumoTratada === false).length}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-slate-500">CadÚnico</dt>
                <dd className="mt-1 text-slate-900">
                  {formatBoolean(
                    organizacao.familias.length > 0
                      ? organizacao.familias.every((familia) => familia.indicadores?.cadastradoCadUnico === true)
                      : null,
                  )}
                </dd>
              </div>
            </dl>
          </section>
        </div>
      </div>
    </div>
  );
}
