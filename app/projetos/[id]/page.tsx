import Link from "next/link";
import { CircleDollarSign, Landmark, Wallet, Pencil } from "lucide-react";
import { notFound } from "next/navigation";
import type { Decimal } from "@prisma/client/runtime/library";

import { prisma } from "@/lib/prisma";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { Card, Badge, Button } from "@/components/ui";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

const formatCurrency = (value: number | Decimal) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(value));

const formatDate = (value: Date | null) => value ? value.toLocaleDateString("pt-BR") : "Em aberto";

function getStatusBadge(status: string) {
  const normalized = status.toLowerCase();
  if (normalized.includes("ativo") || normalized.includes("execucao")) return <Badge variant="success">Ativo</Badge>;
  if (normalized.includes("elaboracao") || normalized.includes("analise")) return <Badge variant="warning">Em elaboração</Badge>;
  if (normalized.includes("concluido")) return <Badge variant="info">Concluído</Badge>;
  if (normalized.includes("pausado") || normalized.includes("suspenso")) return <Badge variant="warning">Pausado</Badge>;
  if (normalized.includes("nao iniciado")) return <Badge variant="outline">Não iniciado</Badge>;
  return <Badge variant="outline">{status}</Badge>;
}

export default async function ProjetoDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const projeto = await prisma.projeto.findUnique({
    where: { id },
    include: {
      orcamentos: { select: { id: true, idOrc: true, descricao: true, valorTotal: true } },
      borderos: {
        orderBy: { data: "desc" },
        include: {
          lancamentos: {
            select: { id: true, nsu: true, valor: true, dataVencimento: true, conciliado: true, favorecido: { select: { nome: true } } },
          },
        },
      },
    },
  });

  if (!projeto) notFound();

  const totalOrcado = projeto.orcamentos.reduce((t, i) => t + Number(i.valorTotal), 0);
  const totalFaturado = 0;
  const totalLiquidado = 0;
  const totalBorderos = projeto.borderos.length;
  const totalLancamentos = projeto.borderos.reduce((t, b) => t + b.lancamentos.length, 0);
  const totalMovimentado = projeto.borderos.reduce(
    (t, b) => t + b.lancamentos.reduce((bt, l) => bt + Number(l.valor), 0), 0
  );
  const totalConciliados = projeto.borderos.reduce(
    (t, b) => t + b.lancamentos.filter((l) => l.conciliado).length, 0
  );

  return (
    <div className="flex min-h-screen bg-zinc-50">
      <Sidebar />

      <main className="ml-64 flex-1">
        <Header
          title={projeto.titulo}
          description={`Centro de Custo: ${projeto.centroCusto}`}
          actions={
            <Link href={`/projetos/${projeto.id}/editar`}>
              <Button variant="primary">
                <Pencil className="h-4 w-4" /> Editar
              </Button>
            </Link>
          }
        />

        <div className="space-y-6 p-6 lg:p-8">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-100">
                  <CircleDollarSign className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                  <p className="text-sm text-zinc-500">Orçado</p>
                  <p className="text-xl font-bold text-zinc-950">{formatCurrency(totalOrcado)}</p>
                </div>
              </div>
            </Card>
            <Card className="p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
                  <Wallet className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-zinc-500">Faturado</p>
                  <p className="text-xl font-bold text-zinc-950">{formatCurrency(totalFaturado)}</p>
                </div>
              </div>
            </Card>
            <Card className="p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-100">
                  <Landmark className="h-5 w-5 text-sky-600" />
                </div>
                <div>
                  <p className="text-sm text-zinc-500">Liquidado</p>
                  <p className="text-xl font-bold text-zinc-950">{formatCurrency(totalLiquidado)}</p>
                </div>
              </div>
            </Card>
            <Card className="p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
                  <Wallet className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-zinc-500">Movimentado</p>
                  <p className="text-xl font-bold text-zinc-950">{formatCurrency(totalMovimentado)}</p>
                </div>
              </div>
            </Card>
          </div>

          <Card>
            <div className="border-b border-zinc-200/60 p-6">
              <h2 className="text-lg font-semibold text-zinc-950">Resumo do Projeto</h2>
            </div>
            <div className="p-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Status</p>
                  <div className="mt-1">{getStatusBadge(projeto.status)}</div>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Centro de Custo</p>
                  <p className="mt-1 font-semibold text-zinc-950">{projeto.centroCusto}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Valor Total</p>
                  <p className="mt-1 font-semibold text-zinc-950">{formatCurrency(projeto.valorTotal)}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Vigência</p>
                  <p className="mt-1 text-sm text-zinc-700">{formatDate(projeto.vigenciaInicial)} - {formatDate(projeto.vigenciaFinal)}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="border-b border-zinc-200/60 p-6">
              <h2 className="text-lg font-semibold text-zinc-950">Orçamentos</h2>
              <p className="text-sm text-zinc-500">Itens orçamentários do projeto</p>
            </div>
            <div className="p-6">
              {projeto.orcamentos.length === 0 ? (
                <p className="text-zinc-500">Nenhum orçamento.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projeto.orcamentos.map((o) => (
                      <TableRow key={o.id}>
                        <TableCell className="font-mono text-sm">{o.idOrc}</TableCell>
                        <TableCell>{o.descricao}</TableCell>
                        <TableCell className="text-right font-semibold">{formatCurrency(o.valorTotal)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </Card>

          <Card>
            <div className="border-b border-zinc-200/60 p-6">
              <h2 className="text-lg font-semibold text-zinc-950">Borderos</h2>
              <p className="text-sm text-zinc-500">Pagamentos e recebimentos</p>
            </div>
            <div className="p-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Total</p>
                  <p className="text-2xl font-bold text-zinc-950">{totalBorderos}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Lançamentos</p>
                  <p className="text-2xl font-bold text-zinc-950">{totalLancamentos}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Conciliados</p>
                  <p className="text-2xl font-bold text-zinc-950">{totalConciliados}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
