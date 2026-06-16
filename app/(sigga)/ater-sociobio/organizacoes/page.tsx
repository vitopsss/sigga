import Link from "next/link";
import { Building2, Eye, PencilLine, Plus, Search, Users } from "lucide-react";

import { AterSetupWarning } from "@/components/ater/setup-warning";
import { Header } from "@/components/dashboard/header";
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
import {
  AterSociobioService,
  type OrganizacaoColetivaListItem,
} from "@/lib/services/ater-sociobio.service";

type SearchParams = Promise<{ busca?: string; from?: string }>;

export const dynamic = "force-dynamic";

export default async function OrganizacoesColetivasPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const busca = Array.isArray(params.busca) ? params.busca[0] : params.busca;
  const from = Array.isArray(params.from) ? params.from[0] : params.from;

  const buscaNorm = (busca || "").trim().toLowerCase();
  const fromValue = (from || "").trim();

  let organizacoes: OrganizacaoColetivaListItem[] = [];
  let setupMissing = false;

  try {
    organizacoes = await AterSociobioService.listOrganizacoesColetivas();
  } catch (error) {
    if (isAterMissingTableError(error)) {
      setupMissing = true;
    } else {
      throw error;
    }
  }

  const organizacoesFiltradas = organizacoes.filter((org) => {
    if (!buscaNorm) return true;

    return [
      org.denominacao,
      org.cnpj,
      org.municipio,
      org.grupoInteresse,
      org.numeroInstrumento,
      org.agenteAterNome1,
    ]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(buscaNorm));
  });

  const currentListUrl = `/ater-sociobio/organizacoes${buscaNorm ? `?busca=${encodeURIComponent(buscaNorm)}` : ""}${fromValue ? `${buscaNorm ? "&" : "?"}from=${encodeURIComponent(fromValue)}` : ""}`;
  const appendFromList = (href: string) => {
    const connector = href.includes("?") ? "&" : "?";
    return `${href}${connector}from=${encodeURIComponent(currentListUrl)}`;
  };

  return (
    <div className="min-h-screen bg-zinc-50/50">
      <Header
        title="Organizações coletivas"
        description={`Associações, cooperativas e grupos vinculados às UFPAs acompanhadas em ${ATER_SOCIOBIO_TERRITORY_NAME}`}
        actions={
          <Link href={appendFromList("/ater-sociobio/organizacoes/nova")}>
            <Button variant="primary">
              <Plus className="h-4 w-4" />
              Nova organização
            </Button>
          </Link>
        }
      />

      <div className="p-6 lg:p-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-6">
          {setupMissing && <AterSetupWarning />}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card className="p-5">
              <p className="text-sm text-zinc-500">Organizações cadastradas</p>
              <p className="mt-1 text-2xl font-bold text-zinc-950">{organizacoes.length}</p>
            </Card>
            <Card className="p-5">
              <p className="text-sm text-zinc-500">UFPAs vinculadas</p>
              <p className="mt-1 text-2xl font-bold text-zinc-950">
                {organizacoes.reduce((total, org) => total + org._count.familias, 0)}
              </p>
            </Card>
            <Card className="p-5">
              <p className="text-sm text-zinc-500">Municípios com organização</p>
              <p className="mt-1 text-2xl font-bold text-zinc-950">
                {new Set(organizacoes.map((org) => org.municipio).filter(Boolean)).size}
              </p>
            </Card>
          </div>

          <Card>
            <div className="flex flex-col gap-4 border-b border-zinc-200/60 p-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-zinc-950">Cadastro de organizações</h2>
              <p className="text-sm text-zinc-500">Use esta lista para consultar o Cadastro da Organização Social - Sociobiodiversidade.</p>
              </div>

              <form action="/ater-sociobio/organizacoes" method="GET" className="relative">
                <input type="hidden" name="from" value={fromValue} />
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <input
                  type="search"
                  name="busca"
                  defaultValue={busca}
                  placeholder="Buscar organização..."
                  className="h-11 w-full rounded-xl border border-zinc-300 bg-zinc-50 pl-11 pr-4 text-sm placeholder:text-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/15 md:w-80"
                />
              </form>
            </div>

            {!organizacoesFiltradas.length ? (
              <Empty className="p-12">
                <EmptyIcon>
                  <Building2 className="h-8 w-8" />
                </EmptyIcon>
                <EmptyTitle>{organizacoes.length ? "Nenhuma organização encontrada" : "Nenhuma organização cadastrada"}</EmptyTitle>
                <EmptyDescription>
                  {organizacoes.length
                    ? "Ajuste a busca para localizar a organização coletiva."
                    : "Cadastre a primeira organização coletiva para agrupar UFPAs."}
                </EmptyDescription>
                <EmptyActions>
                  <Link href={appendFromList("/ater-sociobio/organizacoes/nova")}>
                    <Button variant="primary">Nova organização</Button>
                  </Link>
                </EmptyActions>
              </Empty>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Organização</TableHead>
                    <TableHead>Município</TableHead>
                    <TableHead>Famílias (Estimativa)</TableHead>
                    <TableHead>UFPAs (Reais)</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {organizacoesFiltradas.map((org) => (
                    <TableRow key={org.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-zinc-950">{org.denominacao}</p>
                          <p className="text-xs text-zinc-500">{org.cnpj || org.numeroInstrumento || ""}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-zinc-600">{org.municipio ?? "-"}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-zinc-600">{org.numeroFamilias ?? "-"}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          <Users className="h-3 w-3" />
                          {org._count.familias}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-3">
                          <Link href={appendFromList(`/ater-sociobio/organizacoes/${org.id}/editar`)} className="inline-flex items-center gap-1 text-zinc-500 hover:underline">
                            <PencilLine className="h-4 w-4" />
                            Editar
                          </Link>
                          <Link href={appendFromList(`/ater-sociobio/organizacoes/${org.id}`)} className="inline-flex items-center gap-1 text-emerald-600 hover:underline">
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
          </Card>
        </div>
      </div>
    </div>
  );
}
