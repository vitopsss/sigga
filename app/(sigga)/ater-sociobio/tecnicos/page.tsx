import Link from "next/link";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

import { AterSetupWarning } from "@/components/ater/setup-warning";
import { Badge, Button, Card, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui";
import { isAterMissingTableError } from "@/lib/ater-runtime";
import { ATER_SOCIOBIO_TERRITORY_NAME } from "@/lib/constants/ater-sociobio";
import { prisma } from "@/lib/prisma";
import { Header } from "@/components/dashboard/header";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ busca?: string; status?: string; pagina?: string }>;

const PAGE_SIZE = 10;

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

  if (params.busca) {
    query.set("busca", params.busca);
  }
  if (params.status) {
    query.set("status", params.status);
  }
  if (params.pagina && params.pagina > 1) {
    query.set("pagina", String(params.pagina));
  }

  const queryString = query.toString();
  return queryString ? `${pathname}?${queryString}` : pathname;
}

export default async function TecnicosPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { busca = "", status = "", pagina = "1" } = await searchParams;
  const buscaNorm = busca.trim();
  const statusNorm = status.trim().toLowerCase();
  const requestedPage = parsePage(pagina);

  let tecnicos: Array<{
    id: string;
    nome: string;
    cpf: string;
    registroConselho: string | null;
    uf: string | null;
    ativo: boolean;
    _count: { atendimentos: number };
  }> = [];
  let setupMissing = false;

  try {
    tecnicos = await prisma.tecnico.findMany({
      where: {
        ...(buscaNorm
          ? {
              OR: [
                { nome: { contains: buscaNorm, mode: "insensitive" } },
                { cpf: { contains: buscaNorm, mode: "insensitive" } },
                { registroConselho: { contains: buscaNorm, mode: "insensitive" } },
                { uf: { contains: buscaNorm, mode: "insensitive" } },
              ],
            }
          : {}),
        ...(statusNorm === "ativos" ? { ativo: true } : {}),
        ...(statusNorm === "inativos" ? { ativo: false } : {}),
      },
      orderBy: [{ ativo: "desc" }, { nome: "asc" }],
      include: {
        _count: {
          select: { atendimentos: true },
        },
      },
    });
  } catch (error) {
    if (isAterMissingTableError(error)) {
      setupMissing = true;
    } else {
      throw error;
    }
  }

  const ativos = tecnicos.filter((tecnico) => tecnico.ativo).length;
  const totalAtendimentos = tecnicos.reduce((acc, tecnico) => acc + tecnico._count.atendimentos, 0);
  const totalTecnicos = tecnicos.length;
  const totalPages = Math.max(1, Math.ceil(totalTecnicos / PAGE_SIZE));
  const currentPage = Math.min(requestedPage, totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const tecnicosPagina = tecnicos.slice(startIndex, startIndex + PAGE_SIZE);
  const startItem = totalTecnicos === 0 ? 0 : startIndex + 1;
  const endItem = totalTecnicos === 0 ? 0 : Math.min(startIndex + PAGE_SIZE, totalTecnicos);

  return (
    <div className="min-h-screen bg-zinc-50/50">
      <Header
        title="Técnicos"
        description={`Equipe de campo responsável pelo acompanhamento técnico das famílias no lote ${ATER_SOCIOBIO_TERRITORY_NAME}`}
        actions={
          <Link href="/ater-sociobio/tecnicos/novo">
            <Button variant="primary">
              Novo técnico
            </Button>
          </Link>
        }
      />

      <div className="p-6 lg:p-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6">
          {setupMissing && <AterSetupWarning />}

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="p-5">
              <p className="text-sm text-zinc-500">Técnicos na busca</p>
              <p className="mt-1 text-3xl font-bold text-zinc-950">{totalTecnicos}</p>
            </Card>
            <Card className="p-5">
              <p className="text-sm text-zinc-500">Ativos na busca</p>
              <p className="mt-1 text-3xl font-bold text-emerald-600">{ativos}</p>
            </Card>
            <Card className="p-5">
              <p className="text-sm text-zinc-500">Atendimentos na busca</p>
              <p className="mt-1 text-3xl font-bold text-zinc-950">{totalAtendimentos}</p>
            </Card>
          </div>

          <Card>
            <div className="flex flex-col gap-4 border-b border-zinc-200/60 p-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-zinc-950">Equipe técnica</h2>
                <p className="text-sm text-zinc-500">Busque por nome, CPF, conselho ou UF e edite o cadastro quando precisar.</p>
              </div>

              <form action="/ater-sociobio/tecnicos" method="GET" className="flex flex-col gap-3 md:flex-row">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="search"
                    name="busca"
                    defaultValue={buscaNorm}
                    placeholder="Buscar técnico..."
                    className="h-11 w-full rounded-xl border border-zinc-300 bg-zinc-50 pl-11 pr-4 text-sm placeholder:text-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/15 md:w-72"
                  />
                </div>

                <select
                  name="status"
                  defaultValue={statusNorm}
                  className="h-11 rounded-xl border border-zinc-300 bg-zinc-50 px-4 text-sm text-zinc-700 focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/15"
                >
                  <option value="">Todos os status</option>
                  <option value="ativos">Somente ativos</option>
                  <option value="inativos">Somente inativos</option>
                </select>

                <Button type="submit" variant="ghost">
                  Filtrar
                </Button>
              </form>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>CPF</TableHead>
                  <TableHead>Registro do Conselho</TableHead>
                  <TableHead>UF</TableHead>
                  <TableHead>Atendimentos</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tecnicosPagina.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-8 text-center text-slate-500">
                      Nenhum técnico encontrado para os filtros atuais.
                    </TableCell>
                  </TableRow>
                ) : (
                  tecnicosPagina.map((tecnico) => (
                    <TableRow key={tecnico.id}>
                      <TableCell className="font-medium text-slate-900">{tecnico.nome}</TableCell>
                      <TableCell className="font-mono text-sm">{tecnico.cpf}</TableCell>
                      <TableCell>{tecnico.registroConselho ?? "-"}</TableCell>
                      <TableCell>{tecnico.uf ?? "-"}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{tecnico._count.atendimentos}</Badge>
                      </TableCell>
                      <TableCell>
                        {tecnico.ativo ? (
                          <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                            Ativo
                          </span>
                        ) : (
                          <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                            Inativo
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/ater-sociobio/tecnicos/${tecnico.id}/editar`} className="text-emerald-600 hover:underline">
                          Editar
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            <div className="flex flex-col gap-4 border-t border-zinc-200/60 px-6 py-4 md:flex-row md:items-center md:justify-between">
              <p className="text-sm text-zinc-500">
                {totalTecnicos > 0
                  ? `Mostrando ${startItem}-${endItem} de ${totalTecnicos} técnicos.`
                  : "0 técnicos na listagem atual."}
              </p>

              <div className="flex items-center gap-2">
                <Link
                  href={buildHref("/ater-sociobio/tecnicos", { busca: buscaNorm, status: statusNorm, pagina: currentPage - 1 })}
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
                  href={buildHref("/ater-sociobio/tecnicos", { busca: buscaNorm, status: statusNorm, pagina: currentPage + 1 })}
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
