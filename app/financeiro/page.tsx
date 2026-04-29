import Link from "next/link";
import { Eye, Search, WalletCards } from "lucide-react";

import { Header } from "@/components/dashboard/header";
import { MetricCard, MetricGrid } from "@/components/dashboard/metric-cards";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Badge, Button, Card } from "@/components/ui";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DatabaseWarning } from "@/components/system/database-warning";
import { isDatabaseUnavailableError } from "@/lib/prisma-runtime";
import { FinanceiroService, LancamentoListItem } from "@/lib/services/financeiro.service";
import { autorizarLancamento, conciliarLancamento, registrarPagamento } from "./actions";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

function formatDate(value: Date | null) {
  return value ? value.toLocaleDateString("pt-BR") : "-";
}

function normalizeParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function buildReturnTo(params: { busca: string; status: string; borderoId: string }) {
  const search = new URLSearchParams();

  if (params.busca) search.set("busca", params.busca);
  if (params.status) search.set("status", params.status);
  if (params.borderoId) search.set("borderoId", params.borderoId);

  const query = search.toString();
  return query ? `/financeiro?${query}` : "/financeiro";
}

function getStatusBadge(lancamento: {
  conciliado: boolean;
  autorizado: boolean;
  dataVencimento: Date;
}) {
  if (lancamento.conciliado) return <Badge variant="success">Conciliado</Badge>;
  if (lancamento.autorizado) return <Badge variant="info">Autorizado</Badge>;
  if (lancamento.dataVencimento < new Date()) return <Badge variant="destructive">Vencido</Badge>;
  return <Badge variant="warning">Pendente</Badge>;
}

export default async function FinanceiroPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const resolved = await searchParams;
  const busca = normalizeParam(resolved.busca).trim();
  const status = normalizeParam(resolved.status).trim().toLowerCase();
  const borderoId = normalizeParam(resolved.borderoId).trim();

  let lancamentos: LancamentoListItem[] = [];
  let databaseUnavailable = false;

  try {
    lancamentos = await FinanceiroService.list({ busca, status, borderoId });
  } catch (error) {
    if (isDatabaseUnavailableError(error)) {
      databaseUnavailable = true;
    } else {
      throw error;
    }
  }

  const totalValor = lancamentos.reduce((total, lancamento) => total + Number(lancamento.valor), 0);
  const conciliados = lancamentos.filter((lancamento) => lancamento.conciliado).length;
  const autorizados = lancamentos.filter((lancamento) => lancamento.autorizado).length;
  const returnTo = buildReturnTo({ busca, status, borderoId });

  return (
    <div className="flex min-h-screen bg-zinc-50">
      <Sidebar />

      <main className="ml-64 flex-1">
        <Header title="Lancamentos Financeiros" description="Operacao de borderos e lancamentos do nucleo F2/F3" />

        <div className="space-y-6 p-6 lg:p-8">
          {databaseUnavailable ? (
            <DatabaseWarning
              title="Financeiro carregado em modo reduzido"
              description="Os lancamentos nao puderam ser consultados agora porque a conexao com o banco falhou temporariamente."
              actionHref="/"
              actionLabel="Voltar ao painel"
            />
          ) : null}

          <MetricGrid>
            <MetricCard
              title="Lancamentos"
              value={lancamentos.length}
              subtitle="na listagem"
              icon={WalletCards}
              iconBg="bg-teal-100"
              iconColor="text-teal-600"
            />
            <MetricCard
              title="Valor total"
              value={currencyFormatter.format(totalValor)}
              subtitle="movimentado"
              icon={WalletCards}
              iconBg="bg-emerald-100"
              iconColor="text-emerald-600"
            />
            <MetricCard
              title="Conciliados"
              value={conciliados}
              subtitle="baixa concluida"
              icon={WalletCards}
              iconBg="bg-sky-100"
              iconColor="text-sky-600"
            />
            <MetricCard
              title="Autorizados"
              value={autorizados}
              subtitle="aguardando conciliacao"
              icon={WalletCards}
              iconBg="bg-amber-100"
              iconColor="text-amber-600"
            />
          </MetricGrid>

          <Card>
            <div className="flex flex-col gap-4 border-b border-zinc-200/60 p-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-zinc-950">Lancamentos</h2>
                <p className="text-sm text-zinc-500">Busque por NSU, bordero, projeto, favorecido, fase ou etapa.</p>
              </div>

              <form action="/financeiro" method="GET" className="grid gap-3 md:grid-cols-[minmax(0,1fr)_180px_auto]">
                {borderoId ? <input type="hidden" name="borderoId" value={borderoId} /> : null}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="search"
                    name="busca"
                    defaultValue={busca}
                    placeholder="Buscar lancamento..."
                    className="h-11 w-full rounded-xl border border-zinc-300 bg-zinc-50 pl-11 pr-4 text-sm placeholder:text-zinc-400 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/15"
                  />
                </div>

                <select
                  name="status"
                  defaultValue={status}
                  className="h-11 rounded-xl border border-zinc-300 bg-zinc-50 px-4 text-sm focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/15"
                >
                  <option value="">Todos os status</option>
                  <option value="pendente">Pendentes</option>
                  <option value="autorizado">Autorizados</option>
                  <option value="conciliado">Conciliados</option>
                  <option value="vencido">Vencidos</option>
                </select>

                <Button type="submit" variant="secondary">
                  Filtrar
                </Button>
              </form>
            </div>

            {lancamentos.length === 0 ? (
              <div className="p-10 text-center">
                <p className="text-base font-medium text-zinc-950">Nenhum lancamento encontrado.</p>
                <p className="mt-2 text-sm text-zinc-500">Ajuste os filtros ou cadastre novos lancamentos em um bordero.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>NSU</TableHead>
                    <TableHead>Bordero</TableHead>
                    <TableHead>Favorecido</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Vencimento</TableHead>
                    <TableHead>Forma</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Acoes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lancamentos.map((lancamento) => (
                    <TableRow key={lancamento.id}>
                      <TableCell className="font-mono text-sm">{lancamento.nsu}</TableCell>
                      <TableCell>
                        <p className="font-medium text-zinc-950">{lancamento.bordero.idBordero}</p>
                        <p className="text-xs text-zinc-500">{lancamento.bordero.projeto.titulo}</p>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium text-zinc-950">{lancamento.favorecido.nome}</p>
                        <p className="text-xs text-zinc-500">{lancamento.favorecido.documento}</p>
                      </TableCell>
                      <TableCell className="font-semibold text-zinc-950">
                        {currencyFormatter.format(Number(lancamento.valor))}
                      </TableCell>
                      <TableCell>{formatDate(lancamento.dataVencimento)}</TableCell>
                      <TableCell>{lancamento.formaPagamento ?? "-"}</TableCell>
                      <TableCell>{getStatusBadge(lancamento)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex min-w-[250px] flex-col items-end gap-2">
                          {!lancamento.autorizado ? (
                            <form action={autorizarLancamento.bind(null, lancamento.id)} className="flex items-center gap-2">
                              <input type="hidden" name="returnTo" value={returnTo} />
                              <Button type="submit" variant="secondary" size="sm">
                                Autorizar
                              </Button>
                            </form>
                          ) : null}

                          {!lancamento.conciliado ? (
                            <form action={registrarPagamento.bind(null, lancamento.id)} className="flex items-center gap-2">
                              <input type="hidden" name="returnTo" value={returnTo} />
                              <input
                                type="date"
                                name="dataPagamento"
                                defaultValue={
                                  lancamento.dataPagamento
                                    ? lancamento.dataPagamento.toISOString().split("T")[0]
                                    : new Date().toISOString().split("T")[0]
                                }
                                className="h-9 rounded-lg border border-zinc-300 bg-zinc-50 px-3 text-xs"
                              />
                              <select
                                name="formaPagamento"
                                defaultValue={lancamento.formaPagamento ?? ""}
                                className="h-9 rounded-lg border border-zinc-300 bg-zinc-50 px-3 text-xs"
                              >
                                <option value="">Forma</option>
                                <option value="TED">TED</option>
                                <option value="DOC">DOC</option>
                                <option value="PIX">PIX</option>
                                <option value="BOLETO">Boleto</option>
                                <option value="DINHEIRO">Dinheiro</option>
                              </select>
                              <Button type="submit" variant="secondary" size="sm">
                                Pagar
                              </Button>
                            </form>
                          ) : null}

                          {lancamento.autorizado && !lancamento.conciliado ? (
                            <form action={conciliarLancamento.bind(null, lancamento.id)} className="flex items-center gap-2">
                              <input type="hidden" name="returnTo" value={returnTo} />
                              <Button type="submit" variant="primary" size="sm">
                                Conciliar
                              </Button>
                            </form>
                          ) : null}

                          <Link href={`/borderos/${lancamento.bordero.id}`}>
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
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
              <p className="text-sm text-zinc-500">{lancamentos.length} lancamentos na listagem atual.</p>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
