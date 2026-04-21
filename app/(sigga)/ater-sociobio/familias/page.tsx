import Link from "next/link";
import { Prisma } from "@prisma/client";
import { ChevronLeft, ChevronRight, Eye, Hash, MapPin, PencilLine, Plus, Search, Users } from "lucide-react";

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
import { ATER_SOCIOBIO_TERRITORY_NAME, getAterSociobioMunicipios } from "@/lib/constants/ater-sociobio";
import { prisma } from "@/lib/prisma";

type SearchParams = Promise<{ busca?: string; municipio?: string; sga?: string; pagina?: string }>;

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
    sga?: string;
    pagina?: number;
  },
) {
  const query = new URLSearchParams();

  if (params.busca) {
    query.set("busca", params.busca);
  }
  if (params.municipio) {
    query.set("municipio", params.municipio);
  }
  if (params.sga) {
    query.set("sga", params.sga);
  }
  if (params.pagina && params.pagina > 1) {
    query.set("pagina", String(params.pagina));
  }

  const queryString = query.toString();
  return queryString ? `${pathname}?${queryString}` : pathname;
}

export const dynamic = "force-dynamic";

export default async function FamiliasPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { busca = "", municipio = "", sga = "", pagina = "1" } = await searchParams;
  const buscaNorm = busca.trim();
  const municipioNorm = municipio.trim();
  const sgaNorm = sga.trim().toLowerCase();
  const requestedPage = parsePage(pagina);

  const where: Prisma.FamiliaAterWhereInput = {};
  const and: Prisma.FamiliaAterWhereInput[] = [];

  if (buscaNorm) {
    and.push({
      OR: [
        { nomeFamilia: { contains: buscaNorm, mode: "insensitive" } },
        { nomeResponsavel: { contains: buscaNorm, mode: "insensitive" } },
        { nis: { contains: buscaNorm, mode: "insensitive" } },
        { codigoSGA: { contains: buscaNorm, mode: "insensitive" } },
        { municipio: { contains: buscaNorm, mode: "insensitive" } },
        { comunidade: { contains: buscaNorm, mode: "insensitive" } },
      ],
    });
  }

  if (municipioNorm) {
    and.push({ municipio: { equals: municipioNorm, mode: "insensitive" } });
  }

  if (sgaNorm === "incompleto") {
    and.push({
      OR: [
        { sgaCadastro: false },
        { sgaCadastro: null },
        { sgaRevisao: false },
        { sgaRevisao: null },
      ],
    });
  }

  if (sgaNorm === "completo") {
    and.push({
      AND: [{ sgaCadastro: true }, { sgaRevisao: true }],
    });
  }

  if (and.length > 0) {
    where.AND = and;
  }

  let familias: Array<{
    id: string;
    nomeFamilia: string;
    nomeResponsavel: string | null;
    quantidadeMembros: number | null;
    nis: string | null;
    codigoSGA: string | null;
    municipio: string | null;
    _count: { atendimentos: number };
  }> = [];
  let municipios: string[] = [];
  let totalFamilias = 0;
  let totalMunicipios = 0;
  let comNis = 0;
  let comSGA = 0;
  let setupMissing = false;

  try {
    totalFamilias = await prisma.familiaAter.count({ where });

    const totalPages = Math.max(1, Math.ceil(totalFamilias / PAGE_SIZE));
    const currentPage = Math.min(requestedPage, totalPages);
    const skip = (currentPage - 1) * PAGE_SIZE;

    const [familiasResult, municipiosResult, municipiosResumo, comNisResult, comSGAResult] = await Promise.all([
      prisma.familiaAter.findMany({
        where,
        include: {
          _count: {
            select: { atendimentos: true },
          },
        },
        orderBy: [{ municipio: "asc" }, { nomeFamilia: "asc" }],
        skip,
        take: PAGE_SIZE,
      }),
      prisma.familiaAter.findMany({
        where: { municipio: { not: null } },
        select: { municipio: true },
        distinct: ["municipio"],
        orderBy: { municipio: "asc" },
      }),
      prisma.familiaAter.findMany({
        where: { ...where, municipio: { not: null } },
        select: { municipio: true },
        distinct: ["municipio"],
      }),
      prisma.familiaAter.count({
        where: { ...where, nis: { not: null } },
      }),
      prisma.familiaAter.count({
        where: { ...where, codigoSGA: { not: null } },
      }),
    ]);

    familias = familiasResult;
    municipios = getAterSociobioMunicipios(municipiosResult.map((item) => item.municipio));
    totalMunicipios = municipiosResumo.length;
    comNis = comNisResult;
    comSGA = comSGAResult;
  } catch (error) {
    if (isAterMissingTableError(error)) {
      setupMissing = true;
    } else {
      throw error;
    }
  }

  const totalPages = Math.max(1, Math.ceil(totalFamilias / PAGE_SIZE));
  const currentPage = Math.min(requestedPage, totalPages);
  const startItem = totalFamilias === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const endItem = totalFamilias === 0 ? 0 : Math.min(currentPage * PAGE_SIZE, totalFamilias);
  const hasFilters = Boolean(buscaNorm || municipioNorm || sgaNorm);
  const baseQuery = { busca: buscaNorm, municipio: municipioNorm, sga: sgaNorm };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/50 via-slate-50 to-teal-50/30">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10 lg:py-10">
        <div className="mb-8">
          <div className="flex flex-col gap-2">
            <Badge variant="success" className="w-fit">
              ATER Sociobio
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-zinc-950">Famílias</h1>
            <p className="text-zinc-500">Famílias acompanhadas no lote {ATER_SOCIOBIO_TERRITORY_NAME}.</p>
          </div>
        </div>

        {setupMissing && <AterSetupWarning className="mb-8" />}

        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Card className="p-5">
            <p className="text-sm text-zinc-500">Total filtrado</p>
            <p className="mt-1 text-3xl font-bold text-zinc-950">{totalFamilias}</p>
          </Card>
          <Card className="p-5">
            <p className="text-sm text-zinc-500">Municípios</p>
            <p className="mt-1 text-3xl font-bold text-zinc-950">{totalMunicipios}</p>
          </Card>
          <Card className="p-5">
            <p className="text-sm text-zinc-500">Com NIS</p>
            <p className="mt-1 text-3xl font-bold text-emerald-600">{comNis}</p>
          </Card>
          <Card className="p-5">
            <p className="text-sm text-zinc-500">Com SGA</p>
            <p className="mt-1 text-3xl font-bold text-emerald-600">{comSGA}</p>
          </Card>
        </div>

        <Card>
          <div className="flex flex-col gap-4 border-b border-zinc-200/60 p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-zinc-950">Lista de famílias</h2>
                <p className="text-sm text-zinc-500">Busque por nome, responsável, NIS, SGA ou comunidade e refine pelos municípios do lote {ATER_SOCIOBIO_TERRITORY_NAME}.</p>
              </div>
              <Link href="/ater-sociobio/familias/nova">
                <Button variant="primary">
                  <Plus className="h-4 w-4" />
                  Nova família
                </Button>
              </Link>
            </div>

            <form action="/ater-sociobio/familias" method="GET" className="grid gap-3 lg:grid-cols-[minmax(0,1.3fr)_220px_220px_auto_auto]">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <input
                  type="search"
                  name="busca"
                  defaultValue={buscaNorm}
                  placeholder="Buscar família..."
                  className="h-11 w-full rounded-xl border border-zinc-300 bg-zinc-50 pl-11 pr-4 text-sm placeholder:text-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/15"
                />
              </div>

              <select
                name="municipio"
                defaultValue={municipioNorm}
                className="h-11 rounded-xl border border-zinc-300 bg-zinc-50 px-4 text-sm text-zinc-700 focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/15"
              >
                <option value="">Todos os municípios da FLONA</option>
                {municipios.map((item) => (
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

              <Button type="submit" variant="ghost">
                Filtrar
              </Button>

              {hasFilters ? (
                <Link href="/ater-sociobio/familias">
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
              <EmptyTitle>Nenhuma família encontrada</EmptyTitle>
              <EmptyDescription>
                {hasFilters
                  ? "Ajuste os filtros ou cadastre uma nova família."
                  : "Cadastre a primeira família para iniciar o acompanhamento territorial."}
              </EmptyDescription>
              <EmptyActions>
                {hasFilters ? (
                  <Link href="/ater-sociobio/familias">
                    <Button variant="secondary">Limpar filtros</Button>
                  </Link>
                ) : null}
                <Link href="/ater-sociobio/familias/nova">
                  <Button variant="primary">Nova família</Button>
                </Link>
              </EmptyActions>
            </Empty>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome da Família</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead>NIS</TableHead>
                  <TableHead>Código SGA</TableHead>
                  <TableHead>Município</TableHead>
                  <TableHead>Atendimentos</TableHead>
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
                          {f.quantidadeMembros ? `${f.quantidadeMembros} membros` : ""}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-zinc-600">{f.nomeResponsavel ?? "-"}</span>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1 font-mono text-sm">
                        <Hash className="h-3 w-3 text-zinc-400" />
                        {f.nis ?? <span className="text-zinc-400">-</span>}
                      </span>
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
                      <Badge variant="outline">{f._count.atendimentos}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-3">
                        <Link href={`/ater-sociobio/familias/${f.id}/editar`} className="inline-flex items-center gap-1 text-zinc-500 hover:underline">
                          <PencilLine className="h-4 w-4" />
                          Editar
                        </Link>
                        <Link href={`/ater-sociobio/familias/${f.id}`} className="inline-flex items-center gap-1 text-emerald-600 hover:underline">
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
                ? `Mostrando ${startItem}-${endItem} de ${totalFamilias} famílias.`
                : "0 famílias na listagem atual."}
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
  );
}
