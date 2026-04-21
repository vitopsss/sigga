import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Pencil, Building2 } from "lucide-react";

import { Sidebar } from "@/components/dashboard/sidebar";
import { Badge, Button, Card } from "@/components/ui";
import { prisma } from "@/lib/prisma";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

function getStatusBadge(status: string | null) {
  if (!status) return <Badge variant="outline">Sem status</Badge>;
  const normalized = status.toLowerCase();
  if (normalized.includes("ativo") || normalized.includes("vigente")) return <Badge variant="success">Ativo</Badge>;
  if (normalized.includes("encerrado") || normalized.includes("concluido")) return <Badge variant="info">Encerrado</Badge>;
  if (normalized.includes("suspenso") || normalized.includes("pausado")) return <Badge variant="warning">Suspenso</Badge>;
  if (normalized.includes("cancelado")) return <Badge variant="destructive">Cancelado</Badge>;
  return <Badge variant="outline">{status}</Badge>;
}

export default async function ContratoDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const contrato = await prisma.contratoFornecedor.findUnique({
    where: { id },
    include: { fornecedor: true },
  });

  if (!contrato) {
    notFound();
  }

  return (
    <div className="flex min-h-screen bg-zinc-50">
      <Sidebar />

      <main className="flex-1 ml-64">
        <div className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-zinc-200 bg-white/80 px-6 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <Link href="/compras">
              <Button variant="secondary" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-semibold text-zinc-950">{contrato.idContrato}</h1>
              <p className="text-sm text-zinc-500">{contrato.fornecedor.nome}</p>
            </div>
          </div>

          <Link href={`/compras/${contrato.id}/editar`}>
            <Button variant="primary">
              <Pencil className="h-4 w-4" /> Editar
            </Button>
          </Link>
        </div>

        <div className="space-y-6 p-6 lg:p-8">
          <Card>
            <div className="grid gap-4 p-6 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">ID do contrato</p>
                <p className="mt-1 font-semibold text-zinc-950">{contrato.idContrato}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Status</p>
                <div className="mt-1">{getStatusBadge(contrato.status)}</div>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Valor total</p>
                <p className="mt-1 font-semibold text-zinc-950">{currencyFormatter.format(Number(contrato.valorTotal))}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Fornecedor</p>
                <p className="mt-1 font-semibold text-zinc-950">{contrato.fornecedor.tipo}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="border-b border-zinc-200/60 p-6">
              <h2 className="text-lg font-semibold text-zinc-950">Fornecedor</h2>
            </div>

            <div className="grid gap-4 p-6 md:grid-cols-2">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-zinc-950">{contrato.fornecedor.nome}</p>
                  <p className="text-sm text-zinc-500">{contrato.fornecedor.documento}</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Contato</p>
                <p className="mt-1 text-sm text-zinc-700">{contrato.fornecedor.email ?? "Sem email cadastrado"}</p>
                <p className="text-sm text-zinc-500">{contrato.fornecedor.telefone ?? "Sem telefone cadastrado"}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="border-b border-zinc-200/60 p-6">
              <h2 className="text-lg font-semibold text-zinc-950">Objeto</h2>
            </div>

            <div className="p-6">
              <p className="whitespace-pre-wrap text-sm leading-6 text-zinc-700">{contrato.objeto ?? "Sem objeto informado."}</p>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
