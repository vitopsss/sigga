import Link from "next/link";
import { Search, Eye, Pencil, Plus, ShoppingCart, Building2 } from "lucide-react";
import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { isDatabaseUnavailableError } from "@/lib/prisma-runtime";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { MetricCard, MetricGrid } from "@/components/dashboard/metric-cards";
import { Card, Badge, Button } from "@/components/ui";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { DatabaseWarning } from "@/components/system/database-warning";

type SearchParams = Promise<{ busca?: string }>;
type ContratoListItem = Prisma.ContratoFornecedorGetPayload<{
  include: { fornecedor: true };
}>;

const currencyFormatter = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

function getStatusBadge(status: string | null) {
  if (!status) return <Badge variant="outline">Sem status</Badge>;
  const normalized = status.toLowerCase();
  if (normalized.includes("ativo") || normalized.includes("vigente")) return <Badge variant="success">Ativo</Badge>;
  if (normalized.includes("encerrado") || normalized.includes("concluido")) return <Badge variant="info">Encerrado</Badge>;
  if (normalized.includes("suspenso") || normalized.includes("pausado")) return <Badge variant="warning">Suspenso</Badge>;
  if (normalized.includes("cancelado")) return <Badge variant="destructive">Cancelado</Badge>;
  return <Badge variant="outline">{status}</Badge>;
}

export default async function ComprasPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { busca = "" } = await searchParams;
  const buscaNormalizada = busca.trim();

  let contratos: ContratoListItem[] = [];
  let databaseUnavailable = false;

  try {
    contratos = await prisma.contratoFornecedor.findMany({
      where: buscaNormalizada
        ? {
            OR: [
              { idContrato: { contains: buscaNormalizada, mode: "insensitive" } },
              { objeto: { contains: buscaNormalizada, mode: "insensitive" } },
              { fornecedor: { nome: { contains: buscaNormalizada, mode: "insensitive" } } },
            ],
          }
        : undefined,
      include: { fornecedor: true },
      orderBy: { idContrato: "desc" },
    });
  } catch (error) {
    if (isDatabaseUnavailableError(error)) {
      databaseUnavailable = true;
    } else {
      throw error;
    }
  }

  const totalValor = contratos.reduce((t, c) => t + Number(c.valorTotal), 0);
  const ativos = contratos.filter((c) => c.status?.toLowerCase().includes("ativo")).length;

  return (
    <div className="flex min-h-screen bg-zinc-50">
      <Sidebar />

      <main className="flex-1 ml-64">
        <Header
          title="Compras e Contratos"
          description="Gestão de contratos de fornecedores"
          actions={
            <Link href="/compras/novo">
              <Button variant="primary">
                <Plus className="h-4 w-4" /> Novo Contrato
              </Button>
            </Link>
          }
        />

        <div className="p-6 lg:p-8 space-y-6">
          {databaseUnavailable ? (
            <DatabaseWarning
              title="Compras carregadas em modo reduzido"
              description="Os contratos não puderam ser consultados agora porque a conexão com o banco falhou temporariamente."
              actionHref="/"
              actionLabel="Voltar ao painel"
            />
          ) : null}

          <MetricGrid>
            <MetricCard
              title="Contratos"
              value={contratos.length}
              subtitle="cadastrados"
              icon={ShoppingCart}
              iconBg="bg-teal-100"
              iconColor="text-teal-600"
            />
            <MetricCard
              title="Ativos"
              value={ativos}
              subtitle="em vigência"
              icon={ShoppingCart}
              iconBg="bg-emerald-100"
              iconColor="text-emerald-600"
            />
            <MetricCard
              title="Valor Total"
              value={currencyFormatter.format(totalValor)}
              icon={ShoppingCart}
              iconBg="bg-amber-100"
              iconColor="text-amber-600"
            />
          </MetricGrid>

          <Card>
            <div className="flex flex-col gap-4 border-b border-zinc-200/60 p-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-zinc-950">Lista de Contratos</h2>
                <p className="text-sm text-zinc-500">Busca por ID, fornecedor e objeto</p>
              </div>

              <form action="/compras" method="GET" className="relative">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <input
                  type="search"
                  name="busca"
                  defaultValue={buscaNormalizada}
                  placeholder="Buscar contrato..."
                  className="h-11 w-full rounded-xl border border-zinc-300 bg-zinc-50 pl-11 pr-4 text-sm placeholder:text-zinc-400 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/15 lg:w-72"
                />
              </form>
            </div>

            {contratos.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-400">
                  <ShoppingCart className="h-8 w-8" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-zinc-900">Nenhum contrato encontrado</h3>
                <p className="mt-1 max-w-sm text-sm text-zinc-500">
                  {buscaNormalizada
                    ? "Ajuste a busca ou cadastre um novo contrato."
                    : "Cadastre o primeiro contrato para iniciar."}
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID Contrato</TableHead>
                    <TableHead>Fornecedor</TableHead>
                    <TableHead>Objeto</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contratos.map((contrato) => (
                    <TableRow key={contrato.id}>
                      <TableCell className="font-mono text-sm">{contrato.idContrato}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600">
                            <Building2 className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium text-zinc-950">{contrato.fornecedor.nome}</p>
                            <p className="text-xs text-zinc-500">{contrato.fornecedor.documento}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs truncate text-zinc-600">{contrato.objeto ?? "—"}</TableCell>
                      <TableCell className="font-semibold text-zinc-950">
                        {currencyFormatter.format(Number(contrato.valorTotal))}
                      </TableCell>
                      <TableCell>{getStatusBadge(contrato.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Link href={`/compras/${contrato.id}`}>
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={`/compras/${contrato.id}/editar`}>
                            <Button variant="ghost" size="icon">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            <div className="border-t border-zinc-200/60 px-6 py-4">
              <p className="text-sm text-zinc-500">{contratos.length} contratos na listagem</p>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
