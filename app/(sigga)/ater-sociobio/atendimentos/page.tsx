import Link from "next/link";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

import { AterSetupWarning } from "@/components/ater/setup-warning";
import { Button, Card } from "@/components/ui";
import { ATER_SETUP_ERROR } from "@/lib/ater-runtime";
import { ATER_SOCIOBIO_TERRITORY_NAME } from "@/lib/constants/ater-sociobio";
import { Header } from "@/components/dashboard/header";
import { AterSociobioService, AtendimentoWithDetails } from "@/lib/services/ater-sociobio.service";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 10;

const statusColors: Record<string, string> = {
  PENDENTE: "bg-amber-100 text-amber-700",
  RASCUNHO: "bg-blue-100 text-blue-700",
  CONCLUIDO: "bg-emerald-100 text-emerald-700",
  ENVIADO_SGA: "bg-purple-100 text-purple-700",
};

type SearchParams = Promise<{ busca?: string; status?: string; pagina?: string }>;

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
  },
) {
  const query = new URLSearchParams();

  if (params.busca) query.set("busca", params.busca);
  if (params.status) query.set("status", params.status);
  if (params.pagina && params.pagina > 1) query.set("pagina", String(params.pagina));

  const queryString = query.toString();
  return queryString ? `${pathname}?${queryString}` : pathname;
}

export default async function AtendimentosPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { busca = "", status = "", pagina = "1" } = await searchParams;
  const buscaNorm = busca.trim().toLowerCase();
  const statusNorm = status.trim().toUpperCase();
  const requestedPage = parsePage(pagina);

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
    const tecnicoNome = (at.tecnicoRef?.nome ?? at.tecnico ?? "").toLowerCase();
    const statusValue = (at.statusRelatorio ?? "").toUpperCase();
    const numeroVisita = String(at.numeroVisita ?? "");

    const matchBusca =
      !buscaNorm ||
      familiaNome.includes(buscaNorm) ||
      municipio.includes(buscaNorm) ||
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

  return (
    <div className="min-h-screen bg-zinc-50/50">
      <Header
        title="Atendimentos"
        description={`Histórico de visitas técnicas vinculadas a famílias do lote ${ATER_SOCIOBIO_TERRITORY_NAME}`}
        actions={
          <Link href="/ater-sociobio/atendimentos/nova" className="rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white">
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
                <p className="text-sm text-zinc-500">Busque por família, município, técnico ou número da visita e refine por status.</p>
              </div>

              <form action="/ater-sociobio/atendimentos" method="GET" className="flex flex-col gap-3 md:flex-row">
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
                  <option value="PENDENTE">Pendente</option>
                  <option value="RASCUNHO">Rascunho</option>
                  <option value="CONCLUIDO">Concluído</option>
                  <option value="ENVIADO_SGA">Enviado SGA</option>
                </select>

                <Button type="submit" variant="ghost">
                  Filtrar
                </Button>
              </form>
            </div>
          </Card>

          {!atendimentosPagina.length ? (
            <div className="rounded-[2rem] border border-slate-200 bg-white p-12 text-center shadow-sm">
              <p className="text-slate-600">
                {atendimentos.length ? "Nenhum atendimento encontrado para os filtros atuais." : "Nenhum atendimento registrado ainda."}
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50 text-left">
                    <th className="px-6 py-4 font-medium text-slate-600">Visita</th>
                    <th className="px-6 py-4 font-medium text-slate-600">Data</th>
                    <th className="px-6 py-4 font-medium text-slate-600">Família</th>
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

                    return (
                      <tr key={at.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 font-medium text-slate-900">#{at.numeroVisita}</td>
                        <td className="px-6 py-4 text-slate-600">
                          {at.data ? new Date(at.data).toLocaleDateString("pt-BR") : "-"}
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-medium text-slate-900">{familiaNome ?? "-"}</span>
                          {municipio && <span className="ml-2 text-slate-500">{municipio}</span>}
                        </td>
                        <td className="px-6 py-4 text-slate-600">{tecnicoNome ?? "-"}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[at.statusRelatorio ?? ""] ?? "bg-slate-100 text-slate-600"}`}
                          >
                            {at.statusRelatorio}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-3">
                            <Link href={`/ater-sociobio/atendimentos/${at.id}/editar`} className="text-slate-500 hover:underline">
                              Editar
                            </Link>
                            <Link href={`/ater-sociobio/atendimentos/${at.id}`} className="text-emerald-600 hover:underline">
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
