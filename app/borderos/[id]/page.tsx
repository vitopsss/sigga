import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Eye, Pencil } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Card, Badge, Button } from "@/components/ui";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

function formatDate(value: Date | null) {
  return value ? value.toLocaleDateString("pt-BR") : "-";
}

function getBorderoStatusBadge(status: string) {
  if (status === "Pendente") return <Badge variant="warning">Pendente</Badge>;
  if (status === "Em processamento") return <Badge variant="info">Em processamento</Badge>;
  if (status === "Conciliado") return <Badge variant="success">Conciliado</Badge>;
  return <Badge variant="outline">{status}</Badge>;
}

function getLancamentoStatusBadge(lancamento: {
  conciliado: boolean;
  autorizado: boolean;
  dataVencimento: Date;
}) {
  if (lancamento.conciliado) return <Badge variant="success">Conciliado</Badge>;
  if (lancamento.autorizado) return <Badge variant="info">Autorizado</Badge>;
  if (lancamento.dataVencimento < new Date()) return <Badge variant="destructive">Vencido</Badge>;
  return <Badge variant="warning">Pendente</Badge>;
}

export default async function BorderoDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const bordero = await prisma.bordero.findUnique({
    where: { id },
    include: {
      projeto: { select: { titulo: true, centroCusto: true } },
      lancamentos: {
        include: { favorecido: true },
        orderBy: { dataVencimento: "asc" },
      },
    },
  });

  if (!bordero) {
    notFound();
  }

  const totalValor = bordero.lancamentos.reduce((total, lancamento) => total + Number(lancamento.valor), 0);
  const conciliados = bordero.lancamentos.filter((lancamento) => lancamento.conciliado).length;

  return (
    <div className="flex min-h-screen bg-zinc-50">
      <Sidebar />

      <main className="flex-1 ml-64">
        <div className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-zinc-200 bg-white/80 px-6 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <Link href="/borderos">
              <Button variant="secondary" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-semibold text-zinc-950">{bordero.idBordero}</h1>
              <p className="text-sm text-zinc-500">{bordero.projeto.titulo}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href={`/borderos/${bordero.id}/editar`}>
              <Button variant="primary">
                <Pencil className="h-4 w-4" /> Editar
              </Button>
            </Link>
            <Link href={`/financeiro?borderoId=${bordero.id}`}>
              <Button variant="secondary">
                <Eye className="h-4 w-4" /> Ver lancamentos
              </Button>
            </Link>
          </div>
        </div>

        <div className="p-6 lg:p-8 space-y-6">
          <Card>
            <div className="p-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Bordero</p>
                  <p className="mt-1 font-semibold text-zinc-950">{bordero.idBordero}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Data</p>
                  <p className="mt-1 font-semibold text-zinc-950">{formatDate(bordero.data)}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Tipo</p>
                  <p className="mt-1 font-semibold text-zinc-950">{bordero.tipoBordero ?? "-"}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Status</p>
                  <div className="mt-1">{getBorderoStatusBadge(bordero.status)}</div>
                </div>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Projeto</p>
                  <p className="mt-1 font-semibold text-zinc-950">{bordero.projeto.titulo}</p>
                  <p className="text-sm text-zinc-500">{bordero.projeto.centroCusto}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Total</p>
                  <p className="mt-1 text-2xl font-bold text-zinc-950">{currencyFormatter.format(totalValor)}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Lancamentos</p>
                  <p className="mt-1 text-2xl font-bold text-zinc-950">{bordero.lancamentos.length}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Conciliados</p>
                  <p className="mt-1 text-2xl font-bold text-zinc-950">{conciliados}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <h2 className="mb-4 text-lg font-semibold text-zinc-950">Lancamentos</h2>
              {bordero.lancamentos.length === 0 ? (
                <p className="text-zinc-500">Nenhum lancamento.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>NSU</TableHead>
                      <TableHead>Favorecido</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Vencimento</TableHead>
                      <TableHead>Forma</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bordero.lancamentos.map((lancamento) => (
                      <TableRow key={lancamento.id}>
                        <TableCell className="font-mono text-sm">{lancamento.nsu}</TableCell>
                        <TableCell>{lancamento.favorecido.nome}</TableCell>
                        <TableCell className="font-semibold">
                          {currencyFormatter.format(Number(lancamento.valor))}
                        </TableCell>
                        <TableCell>{formatDate(lancamento.dataVencimento)}</TableCell>
                        <TableCell>{lancamento.formaPagamento ?? "-"}</TableCell>
                        <TableCell>{getLancamentoStatusBadge(lancamento)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
