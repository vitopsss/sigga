import Link from "next/link";
import { BarChart3, ChevronLeft, ChevronRight, Eye, MapPin, PencilLine, Plus, Search, Users } from "lucide-react";

import { AterSetupWarning } from "@/components/ater/setup-warning";
import {
  Badge,
  Button,
  Card,
  Empty,
  EmptyActions,
  EmptyDescription,
  EmptyIcon,
  EmptyTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import { isAterMissingTableError } from "@/lib/ater-runtime";
import { ATER_SOCIOBIO_TERRITORY_NAME } from "@/lib/constants/ater-sociobio";
import { Header } from "@/components/dashboard/header";
import { AterSociobioService, FamiliaListItem } from "@/lib/services/ater-sociobio.service";

type SearchParams = Promise<{
  busca?: string;
  municipio?: string;
  comunidade?: string;
  organizacao?: string;
  sga?: string;
  indicador?: string;
  pagina?: string;
  from?: string;
}>;

const PAGE_SIZE = 10;

function parsePage(value?: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 1;
}

function buildHref(
  pathname: string,
  params: {
    busca?: string;
    municipio?: string;
    comunidade?: string;
    organizacao?: string;
    sga?: string;
    indicador?: string;
    pagina?: number;
    from?: string;
  },
) {
  const query = new URLSearchParams();

  if (params.busca) query.set("busca", params.busca);
  if (params.municipio) query.set("municipio", params.municipio);
  if (params.comunidade) query.set("comunidade", params.comunidade);
  if (params.organizacao) query.set("organizacao", params.organizacao);
  if (params.sga) query.set("sga", params.sga);
  if (params.indicador) query.set("indicador", params.indicador);
  if (params.pagina && params.pagina > 1) query.set("pagina", String(params.pagina));
  if (params.from) query.set("from", params.from);

  const queryString = query.toString();
  return queryString ? `${pathname}?${queryString}` : pathname;
}

export const dynamic = "force-dynamic";

export default async function FamiliasPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const busca = Array.isArray(params.busca) ? params.busca[0] : params.busca;
  const municipio = Array.isArray(params.municipio) ? params.municipio[0] : params.municipio;
  const comunidade = Array.isArray(params.comunidade) ? params.comunidade[0] : params.comunidade;
  const organizacao = Array.isArray(params.organizacao) ? params.organizacao[0] : params.organizacao;
  const sga = Array.isArray(params.sga) ? params.sga[0] : params.sga;
  const indicador = Array.isArray(params.indicador) ? params.indicador[0] : params.indicador;
  const pagina = Array.isArray(params.pagina) ? params.pagina[0] : params.pagina;
  const from = Array.isArray(params.from) ? params.from[0] : params.from;

  const buscaNorm = (busca || "").trim();
  const municipioNorm = (municipio || "").trim();
  const comunidadeNorm = (comunidade || "").trim();
  const organizacaoNorm = (organizacao || "").trim();
  const sgaNorm = (sga || "").trim().toLowerCase();
  const indicadorNorm = (indicador || "").trim().toLowerCase();
  const requestedPage = parsePage(pagina || "1");
  const fromValue = (from || "").trim();

  let familias: FamiliaListItem[] = [];
  let totalFamilias = 0;
  let metrics = {
    totalMunicipios: 0,
    comNis: 0,
    comSGA: 0,
    comDapCaf: 0,
    semInternet: 0,
    semAguaTratada: 0,
    semEsgotoTratado: 0,
    insegurancaAlimentar: 0,
    semCadUnico: 0,
    municipios: [] as string[],
    porMunicipio: [] as { name: string; value: number }[],
    diagnosticoStatus: [] as { name: string; value: number }[],
    aguaTratadaStatus: [] as { name: string; value: number }[],
    cadUnicoStatus: [] as { name: string; value: number }[],
    insegurancaAlimentarStatus: [] as { name: string; value: number }[],
  };
  let setupMissing = false;

  try {
    const skip = (requestedPage - 1) * PAGE_SIZE;
    const result = await AterSociobioService.listFamilias({
      filtros: {
        busca: buscaNorm,
        municipio: municipioNorm,
        comunidade: comunidadeNorm,
        organizacaoId: organizacaoNorm,
        sgaIncompleto: sgaNorm === "incompleto",
        indicador: indicadorNorm,
      },
      skip,
      take: PAGE_SIZE,
    });

    familias = result.familias;
    totalFamilias = result.total;
    metrics = result.metrics;
  } catch (error) {
    if (isAterMissingTableError(error)) {
      setupMissing = true;
    } else {
      console.error(error);
    }
  }

  const totalPages = Math.max(1, Math.ceil(totalFamilias / PAGE_SIZE));
  const currentPage = Math.min(requestedPage, totalPages);
  const startItem = totalFamilias === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const endItem = totalFamilias === 0 ? 0 : Math.min(currentPage * PAGE_SIZE, totalFamilias);
  const hasFilters = Boolean(
    buscaNorm || municipioNorm || comunidadeNorm || organizacaoNorm || sgaNorm || indicadorNorm,
  );
  const baseQuery = {
    busca: buscaNorm,
    municipio: municipioNorm,
    comunidade: comunidadeNorm,
    organizacao: organizacaoNorm,
    sga: sgaNorm,
    indicador: indicadorNorm,
    from: fromValue,
  };

  const currentListUrl = buildHref("/ater-sociobio/familias", { ...baseQuery, pagina: currentPage });
  const appendFromList = (href: string) => {
    const connector = href.includes("?") ? "&" : "?";
    return `${href}${connector}from=${encodeURIComponent(currentListUrl)}`;
  };
  const indicatorOptions = [
    ["", "Todos os indicadores"],
    ["com-diagnostico", "Com diagnóstico"],
    ["sem-diagnostico", "Sem diagnóstico"],
    ["com-dap-caf", "Com DAP/CAF"],
    ["sem-dap-caf", "Sem DAP/CAF"],
    ["com-sga", "Com SGA"],
    ["sem-sga", "Sem SGA"],
    ["com-internet", "Com internet"],
    ["sem-internet", "Sem internet"],
    ["com-agua-tratada", "Com água tratada"],
    ["sem-agua-tratada", "Sem água tratada"],
    ["com-esgoto-tratado", "Com esgoto tratado"],
    ["sem-esgoto-tratado", "Sem esgoto tratado"],
    ["inseguranca-alimentar", "Com insegurança alimentar"],
    ["com-cadunico", "Com CadÚnico"],
    ["sem-cadunico", "Sem CadÚnico"],
  ] as const;

  return (
    <div className="min-h-screen bg-zinc-50/50">
      <Header
        title="UFPAs"
        description={`Unidades familiares acompanhadas nas atividades de ${ATER_SOCIOBIO_TERRITORY_NAME}`}
        actions={
          <Link href="/ater-sociobio/dashboard/ufpas">
            <Button variant="secondary">
              <BarChart3 className="h-4 w-4" />
              Painel
            </Button>
          </Link>
        }
      />

      <div className="p-6 lg:p-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6">
          {setupMissing && <AterSetupWarning className="mb-8" />}

          <Card>
            <div className="flex flex-col gap-4 border-b border-zinc-200/60 p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-zinc-950">Lista de UFPAs</h2>
                  <p className="text-sm text-zinc-500">Busque por denominação, responsável, DAP/CAF, NIS, SGA ou comunidade e refine pelos municípios cadastrados.</p>
                </div>
                <Link href={appendFromList("/ater-sociobio/familias/nova")}>
                  <Button variant="primary">
                    <Plus className="h-4 w-4" />
                    Nova UFPA
                  </Button>
                </Link>
              </div>

              <form action="/ater-sociobio/familias" method="GET" className="grid gap-3 lg:grid-cols-[minmax(0,1.3fr)_220px_220px_260px_auto_auto]">
                <input type="hidden" name="from" value={fromValue} />
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="search"
                    name="busca"
                    defaultValue={buscaNorm}
                    placeholder="Buscar UFPA..."
                    className="h-11 w-full rounded-xl border border-zinc-300 bg-zinc-50 pl-11 pr-4 text-sm placeholder:text-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/15"
                  />
                </div>

                <select
                  name="municipio"
                  defaultValue={municipioNorm}
                  className="h-11 rounded-xl border border-zinc-300 bg-zinc-50 px-4 text-sm text-zinc-700 focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/15"
                >
                  <option value="">Todos os municípios</option>
                  {metrics.municipios.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>

                <select
                  name="sga"
                  defaultValue={sgaNorm}
                  className="h-11 rounded-xl border border-zinc-300 bg-zinc-50 px-4 text-sm text-zinc-700 focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/15"
                >
                  <option value="">Todos os status SGA</option>
                  <option value="completo">SGA completo</option>
                  <option value="incompleto">SGA incompleto</option>
                </select>

                <select
                  name="indicador"
                  defaultValue={indicadorNorm}
                  className="h-11 rounded-xl border border-zinc-300 bg-zinc-50 px-4 text-sm text-zinc-700 focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/15"
                >
                  {indicatorOptions.map(([value, label]) => (
                    <option key={value || "todos"} value={value}>
                      {label}
                    </option>
                  ))}
                </select>

                <Button type="submit" variant="secondary">
                  <Search className="h-4 w-4" />
                  Filtrar
                </Button>

                {hasFilters ? (
                  <Link href={buildHref("/ater-sociobio/familias", { from: fromValue })}>
                    <Button variant="secondary" className="w-full">
                      Limpar
                    </Button>
                  </Link>
                ) : (
                  <div />
                )}
              </form>
            </div>

            {familias.length === 0 ? (
              <Empty>
                <EmptyIcon>
                  <Users className="h-10 w-10" />
                </EmptyIcon>
                <EmptyTitle>Nenhuma UFPA encontrada</EmptyTitle>
                <EmptyDescription>
                  {hasFilters
                    ? "Ajuste os filtros ou cadastre uma nova UFPA."
                    : "Cadastre a primeira UFPA para iniciar o acompanhamento territorial."}
                </EmptyDescription>
                <EmptyActions>
                  {hasFilters ? (
                    <Link href={appendFromList("/ater-sociobio/familias")}>
                      <Button variant="secondary">Limpar filtros</Button>
                    </Link>
                  ) : null}
                  <Link href={appendFromList("/ater-sociobio/familias/nova")}>
                    <Button variant="primary">Nova UFPA</Button>
                  </Link>
                </EmptyActions>
              </Empty>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Denominação da UFPA</TableHead>
                    <TableHead>Responsável</TableHead>
                    <TableHead>DAP/CAF</TableHead>
                    <TableHead>Código SGA</TableHead>
                    <TableHead>Município</TableHead>
                    <TableHead>Integrantes</TableHead>
                    <TableHead>Atendimentos válidos</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {familias.map((f) => (
                    <TableRow key={f.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-zinc-950">{f.nomeFamilia}</p>
                          <p className="text-xs text-zinc-500">
                            {f.organizacaoColetiva?.denominacao || f.grupoInteresse || f.comunidade || ""}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-zinc-600">{f.nomeResponsavel ?? "-"}</span>
                      </TableCell>
                      <TableCell>
                        {f.dapCaf ? (
                          <span className="inline-flex rounded-md bg-zinc-100 px-2 py-1 text-xs font-bold text-zinc-900">
                            {f.dapCaf}
                          </span>
                        ) : (
                          <span className="text-zinc-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {f.codigoSGA ? <Badge variant="info">{f.codigoSGA}</Badge> : <span className="text-sm text-zinc-400">-</span>}
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center gap-1 text-sm text-zinc-600">
                          <MapPin className="h-3.5 w-3.5 text-zinc-400" />
                          {f.municipio ?? "Não informado"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{f._count.integrantes || f.quantidadeMembros || 0}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{f._count.atendimentos}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-3">
                          <Link href={appendFromList(`/ater-sociobio/familias/${f.id}/editar`)} className="inline-flex items-center gap-1 text-zinc-500 hover:underline">
                            <PencilLine className="h-4 w-4" />
                            Editar
                          </Link>
                          <Link href={appendFromList(`/ater-sociobio/familias/${f.id}`)} className="inline-flex items-center gap-1 text-emerald-600 hover:underline">
                            <Eye className="h-4 w-4" />
                            Ver
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            <div className="flex flex-col gap-4 border-t border-zinc-200/60 px-6 py-4 md:flex-row md:items-center md:justify-between">
              <p className="text-sm text-zinc-500">
                {totalFamilias > 0
                  ? `Mostrando ${startItem}-${endItem} de ${totalFamilias} UFPAs.`
                  : "0 UFPAs na listagem atual."}
              </p>

              <div className="flex items-center gap-2">
                <Link
                  href={buildHref("/ater-sociobio/familias", { ...baseQuery, pagina: currentPage - 1 })}
                  aria-disabled={currentPage <= 1}
                  className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
                >
                  <Button variant="ghost" size="sm">
                    <ChevronLeft className="h-4 w-4" />
                    Anterior
                  </Button>
                </Link>
                <span className="text-sm text-zinc-500">
                  Página {currentPage} de {totalPages}
                </span>
                <Link
                  href={buildHref("/ater-sociobio/familias", { ...baseQuery, pagina: currentPage + 1 })}
                  aria-disabled={currentPage >= totalPages}
                  className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
                >
                  <Button variant="ghost" size="sm">
                    Próxima
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
