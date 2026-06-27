import Link from "next/link";
import { ChevronLeft, ChevronRight, Search, ClipboardList } from "lucide-react";

import { AterSetupWarning } from "@/components/ater/setup-warning";
import { Button, Card } from "@/components/ui";
import { Empty, EmptyIcon, EmptyTitle, EmptyDescription, EmptyActions } from "@/components/ui/empty";
import { ATER_SETUP_ERROR } from "@/lib/ater-runtime";
import {
  ATER_SOCIOBIO_STATUS_RELATORIO,
  ATER_SOCIOBIO_STATUS_RELATORIO_COLORS,
  ATER_SOCIOBIO_TERRITORY_NAME,
  getAterSociobioStatusRelatorioLabel,
} from "@/lib/constants/ater-sociobio";
import { Header } from "@/components/dashboard/header";
import { AterSociobioService, AtendimentoWithDetails } from "@/lib/services/ater-sociobio.service";
import { firstSearchParam, type SearchParamValue } from "@/lib/search-params";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 10;

type SearchParams = Promise<{
  busca?: SearchParamValue;
  status?: SearchParamValue;
  pagina?: SearchParamValue;
  from?: SearchParamValue;
}>;

function parsePage(value?: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 1;
}

function buildHref(
  pathname: string,
  params: {
    busca?: string;
    status?: string;
    pagina?: number;
    from?: string;
  },
) {
  const query = new URLSearchParams();

  if (params.busca) query.set("busca", params.busca);
  if (params.status) query.set("status", params.status);
  if (params.pagina && params.pagina > 1) query.set("pagina", String(params.pagina));
  if (params.from) query.set("from", params.from);

  const queryString = query.toString();
  return queryString ? `${pathname}?${queryString}` : pathname;
}

export default async function AtendimentosPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const busca = firstSearchParam(params.busca);
  const status = firstSearchParam(params.status);
  const pagina = firstSearchParam(params.pagina);
  const from = firstSearchParam(params.from);

  const buscaNorm = (busca || "").trim().toLowerCase();
  const statusNorm = (status || "").trim().toUpperCase();
  const requestedPage = parsePage(pagina || "1");
  const fromValue = (from || "").trim();

  let atendimentos: AtendimentoWithDetails[] = [];
  let error: string | null = null;

  try {
    atendimentos = await AterSociobioService.listAtendimentos();
  } catch (e) {
    console.error(e);
    error = "Erro ao carregar atendimentos.";
  }

  const atendimentosFiltrados = atendimentos.filter((at) => {
    const familiaNome = at.familia?.nomeFamilia?.toLowerCase() ?? "";
    const municipio = at.familia?.municipio?.toLowerCase() ?? "";
    const dapCaf = at.familia?.dapCaf?.toLowerCase() ?? "";
    const codigoSGA = at.familia?.codigoSGA?.toLowerCase() ?? "";
    const tecnicoNome = (at.tecnicoRef?.nome ?? at.tecnico ?? "").toLowerCase();
    const statusValue = (at.statusRelatorio ?? "").toUpperCase();
    const numeroVisita = String(at.numeroVisita ?? "");

    const matchBusca =
      !buscaNorm ||
      familiaNome.includes(buscaNorm) ||
      municipio.includes(buscaNorm) ||
      dapCaf.includes(buscaNorm) ||
      codigoSGA.includes(buscaNorm) ||
      tecnicoNome.includes(buscaNorm) ||
      numeroVisita.includes(buscaNorm);

    const matchStatus = !statusNorm || statusValue === statusNorm;

    return matchBusca && matchStatus;
  });

  const totalAtendimentos = atendimentosFiltrados.length;
  const totalPages = Math.max(1, Math.ceil(totalAtendimentos / PAGE_SIZE));
  const currentPage = Math.min(requestedPage, totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const atendimentosPagina = atendimentosFiltrados.slice(startIndex, startIndex + PAGE_SIZE);
  const startItem = totalAtendimentos === 0 ? 0 : startIndex + 1;
  const endItem = totalAtendimentos === 0 ? 0 : Math.min(startIndex + PAGE_SIZE, totalAtendimentos);

  const baseQuery = { busca: buscaNorm, status: statusNorm, from: fromValue };
  const currentListUrl = buildHref("/ater-sociobio/atendimentos", { ...baseQuery, pagina: currentPage });
  const appendFromList = (href: string) => {
    const connector = href.includes("?") ? "&" : "?";
    return `${href}${connector}from=${encodeURIComponent(currentListUrl)}`;
  };

  return (
    <div className="min-h-screen bg-zinc-50/50">
      <Header
        title="Atendimentos"
        description={`Histórico de visitas técnicas vinculadas às UFPAs acompanhadas em ${ATER_SOCIOBIO_TERRITORY_NAME}`}
        actions={
          <Link href={appendFromList("/ater-sociobio/atendimentos/nova")} className="rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white">
            Nova visita
          </Link>
        }
      />

      <div className="p-6 lg:p-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-6">
          {error === ATER_SETUP_ERROR && <AterSetupWarning />}

          <Card>
            <div className="flex flex-col gap-4 border-b border-zinc-200/60 p-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-zinc-950">Filtrar atendimentos</h2>
                <p className="text-sm text-zinc-500">Busque por UFPA, município, DAP/CAF, SGA, técnico ou número da visita e refine por status.</p>
              </div>

              <form action="/ater-sociobio/atendimentos" method="GET" className="flex flex-col gap-3 md:flex-row">
                <input type="hidden" name="from" value={fromValue} />
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="search"
                    name="busca"
                    defaultValue={busca}
                    placeholder="Buscar atendimento..."
                    className="h-11 w-full rounded-xl border border-zinc-300 bg-zinc-50 pl-11 pr-4 text-sm placeholder:text-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/15 md:w-72"
                  />
                </div>

                <select
                  name="status"
                  defaultValue={statusNorm}
                  className="h-11 rounded-xl border border-zinc-300 bg-zinc-50 px-4 text-sm text-zinc-700 focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/15"
                >
                  <option value="">Todos os status</option>
                  {ATER_SOCIOBIO_STATUS_RELATORIO.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>

                <Button type="submit" variant="ghost">
                  Filtrar
                </Button>
              </form>
            </div>
          </Card>

          {!atendimentosPagina.length ? (
            <Empty className="rounded-[2rem] border border-slate-200 bg-white shadow-sm">
              <EmptyIcon>
                <ClipboardList className="h-8 w-8" />
              </EmptyIcon>
              <EmptyTitle>
                {atendimentos.length ? "Nenhum atendimento encontrado" : "Nenhum atendimento registrado"}
              </EmptyTitle>
              <EmptyDescription>
                {atendimentos.length
                  ? "Tente limpar os filtros de busca para encontrar o atendimento desejado."
                  : "Nenhuma visita técnica foi registrada ainda no sistema."}
              </EmptyDescription>
              {!atendimentos.length && (
                <EmptyActions>
                  <Link href="/ater-sociobio/atendimentos/nova">
                    <Button>
                      Registrar Visita
                    </Button>
                  </Link>
                </EmptyActions>
              )}
            </Empty>
          ) : (
            <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50 text-left">
                    <th className="px-6 py-4 font-medium text-slate-600">Visita</th>
                    <th className="px-6 py-4 font-medium text-slate-600">Data</th>
                    <th className="px-6 py-4 font-medium text-slate-600">UFPA</th>
                    <th className="px-6 py-4 font-medium text-slate-600">Técnico</th>
                    <th className="px-6 py-4 font-medium text-slate-600">Status</th>
                    <th className="px-6 py-4 font-medium text-slate-600"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {atendimentosPagina.map((at) => {
                    const familiaNome = at.familia?.nomeFamilia;
                    const municipio = at.familia?.municipio;
                    const tecnicoNome = at.tecnicoRef?.nome ?? at.tecnico;
                    const diagnosticoStatus = at.familia?.dataCadastro || at.familia?.indicadores ? "Diagnóstico registrado" : "Sem diagnóstico";

                    return (
                      <tr key={at.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 font-medium text-slate-900">#{at.numeroVisita}</td>
                        <td className="px-6 py-4 text-slate-600">
                          {at.data ? new Date(at.data).toLocaleDateString("pt-BR") : "-"}
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-medium text-slate-900">{familiaNome ?? "-"}</span>
                          {municipio && <span className="ml-2 text-slate-500">{municipio}</span>}
                          <span className="block text-xs text-slate-500">{diagnosticoStatus}</span>
                        </td>
                        <td className="px-6 py-4 text-slate-600">{tecnicoNome ?? "-"}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${ATER_SOCIOBIO_STATUS_RELATORIO_COLORS[at.statusRelatorio ?? ""] ?? "bg-slate-100 text-slate-600"}`}
                          >
                            {getAterSociobioStatusRelatorioLabel(at.statusRelatorio)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-3">
                            <Link href={appendFromList(`/ater-sociobio/atendimentos/${at.id}/editar`)} className="text-slate-500 hover:underline">
                              Editar
                            </Link>
                            <Link href={appendFromList(`/ater-sociobio/atendimentos/${at.id}`)} className="text-emerald-600 hover:underline">
                              Ver
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div className="flex flex-col gap-4 border-t border-zinc-200/60 px-6 py-4 md:flex-row md:items-center md:justify-between">
                <p className="text-sm text-zinc-500">
                  {totalAtendimentos > 0
                    ? `Mostrando ${startItem}-${endItem} de ${totalAtendimentos} atendimentos.`
                    : "0 atendimentos na listagem atual."}
                </p>

                <div className="flex items-center gap-2">
                  <Link
                    href={buildHref("/ater-sociobio/atendimentos", { busca, status: statusNorm, pagina: currentPage - 1 })}
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
                    href={buildHref("/ater-sociobio/atendimentos", { busca, status: statusNorm, pagina: currentPage + 1 })}
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
