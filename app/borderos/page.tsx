import Link from "next/link";
import { Search, WalletCards, Eye, Pencil, Plus, X } from "lucide-react";
import { BorderoListItem, BorderoService } from "@/lib/services/bordero.service";
import { isDatabaseUnavailableError } from "@/lib/prisma-runtime";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { MetricCard, MetricGrid } from "@/components/dashboard/metric-cards";
import { Card, Badge, Button } from "@/components/ui";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { DatabaseWarning } from "@/components/system/database-warning";

type SearchParams = Promise<{ busca?: string; projetoId?: string; status?: string }>;

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

function formatDate(value: Date | null) {
  return value ? value.toLocaleDateString("pt-BR") : "-";
}

function getTipoBadge(tipo: string | null) {
  if (!tipo) return <Badge variant="outline">-</Badge>;
  const normalized = tipo.toLowerCase();
  if (normalized.includes("pagar")) return <Badge variant="success">Pagar</Badge>;
  if (normalized.includes("receber")) return <Badge variant="info">Receber</Badge>;
  return <Badge variant="outline">{tipo}</Badge>;
}

function getStatusBadge(status: string) {
  if (status === "Pendente") return <Badge variant="warning">Pendente</Badge>;
  if (status === "Em processamento") return <Badge variant="info">Em processamento</Badge>;
  if (status === "Conciliado") return <Badge variant="success">Conciliado</Badge>;
  return <Badge variant="outline">{status}</Badge>;
}

export default async function BorderosPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { busca = "", projetoId = "", status = "" } = await searchParams;
  const buscaNorm = busca.trim();

  let borderos: BorderoListItem[] = [];
  let projetos: Array<{ id: string; titulo: string; centroCusto: string }> = [];
  let databaseUnavailable = false;

  try {
    [borderos, projetos] = await BorderoService.list({ busca: buscaNorm, projetoId, status });
  } catch (error) {
    if (isDatabaseUnavailableError(error)) {
      databaseUnavailable = true;
    } else {
      throw error;
    }
  }

  const totalValor = borderos.reduce((total, bordero) => {
    return total + bordero.lancamentos.reduce((subtotal, lancamento) => subtotal + Number(lancamento.valor), 0);
  }, 0);

  const totalBorderos = borderos.length;
  const pendentes = borderos.filter((bordero) => bordero.status === "Pendente").length;
  const hasFilters = buscaNorm || projetoId || status;

  return (
    <div className="flex min-h-screen bg-zinc-50">
      <Sidebar />

      <main className="ml-64 flex-1">
        <Header
          title="Borderôs"
          description="Controle de pagamentos e recebimentos"
          actions={
            <Link href="/borderos/novo">
              <Button variant="primary">
                <Plus className="h-4 w-4" /> Novo Borderô
              </Button>
            </Link>
          }
        />

        <div className="space-y-6 p-6 lg:p-8">
          {databaseUnavailable ? (
            <DatabaseWarning
              title="Borderôs carregados em modo reduzido"
              description="Os borderôs e lançamentos não puderam ser consultados agora porque a conexão com o banco falhou temporariamente."
              actionHref="/"
              actionLabel="Voltar ao painel"
            />
          ) : null}

          <MetricGrid>
            <MetricCard
              title="Total de Borderôs"
              value={totalBorderos}
              subtitle="registros"
              icon={WalletCards}
              iconBg="bg-teal-100"
              iconColor="text-teal-600"
            />
            <MetricCard
              title="Valor Total"
              value={currencyFormatter.format(totalValor)}
              subtitle="em lançamentos"
              icon={WalletCards}
              iconBg="bg-emerald-100"
              iconColor="text-emerald-600"
            />
            <MetricCard
              title="Pendentes"
              value={pendentes}
              subtitle="para validação"
              icon={WalletCards}
              iconBg="bg-amber-100"
              iconColor="text-amber-600"
            />
          </MetricGrid>

          <Card>
            <div className="flex flex-col gap-4 border-b border-zinc-200/60 p-6">
              <div>
                <h2 className="text-lg font-semibold text-zinc-950">Lista de Borderôs</h2>
                <p className="text-sm text-zinc-500">Busca e filtros por projeto e status.</p>
              </div>

              <form action="/borderos" method="GET" className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="search"
                    name="busca"
                    defaultValue={busca}
                    placeholder="Buscar borderô..."
                    className="h-11 w-full rounded-xl border border-zinc-300 bg-zinc-50 pl-11 pr-4 text-sm placeholder:text-zinc-400 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/15"
                  />
                </div>

                <select
                  name="projetoId"
                  defaultValue={projetoId}
                  className="h-11 rounded-xl border border-zinc-300 bg-zinc-50 px-4 text-sm text-zinc-700 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/15"
                >
                  <option value="">Todos os projetos</option>
                  {projetos.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.centroCusto} — {p.titulo.slice(0, 30)}...
                    </option>
                  ))}
                </select>

                <select
                  name="status"
                  defaultValue={status}
                  className="h-11 rounded-xl border border-zinc-300 bg-zinc-50 px-4 text-sm text-zinc-700 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/15"
                >
                  <option value="">Todos os status</option>
                  <option value="Pendente">Pendente</option>
                  <option value="Em processamento">Em processamento</option>
                  <option value="Conciliado">Conciliado</option>
                </select>

                <div className="flex gap-2">
                  <Button type="submit" variant="primary" className="flex-1">
                    Filtrar
                  </Button>
                  {hasFilters && (
                    <Link href="/borderos">
                      <Button variant="secondary" size="icon" title="Limpar filtros">
                        <X className="h-4 w-4" />
                      </Button>
                    </Link>
                  )}
                </div>
              </form>
            </div>

            {borderos.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-400">
                  <WalletCards className="h-8 w-8" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-zinc-900">Nenhum borderô encontrado</h3>
                <p className="mt-1 max-w-sm text-sm text-zinc-500">
                  {hasFilters ? "Ajuste os filtros ou a busca para encontrar o que precisa." : "Cadastre o primeiro borderô para iniciar."}
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Projeto</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Lançamentos</TableHead>
                    <TableHead>Valor Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {borderos.map((bordero) => {
                    const valorTotal = bordero.lancamentos.reduce((total, lancamento) => total + Number(lancamento.valor), 0);
                    return (
                      <TableRow key={bordero.id}>
                        <TableCell className="font-mono text-sm">{bordero.idBordero}</TableCell>
                        <TableCell>{formatDate(bordero.data)}</TableCell>
                        <TableCell>
                          <span className="text-sm">{bordero.projeto.titulo}</span>
                          <span className="block text-xs text-zinc-400">{bordero.projeto.centroCusto}</span>
                        </TableCell>
                        <TableCell>{getTipoBadge(bordero.tipoBordero)}</TableCell>
                        <TableCell>{bordero.lancamentos.length}</TableCell>
                        <TableCell className="font-semibold">{currencyFormatter.format(valorTotal)}</TableCell>
                        <TableCell>{getStatusBadge(bordero.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Link href={`/borderos/${bordero.id}/editar`}>
                              <Button variant="ghost" size="icon">
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Link href={`/borderos/${bordero.id}`}>
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}

            <div className="border-t border-zinc-200/60 px-6 py-4">
              <p className="text-sm text-zinc-500">{borderos.length} borderôs na listagem</p>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
