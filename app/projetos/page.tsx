import Link from "next/link";
import { Eye, Pencil, Plus, Search, Building2 } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { isDatabaseUnavailableError } from "@/lib/prisma-runtime";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { MetricCard, MetricGrid } from "@/components/dashboard/metric-cards";
import { Card, Badge, Button } from "@/components/ui";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { DatabaseWarning } from "@/components/system/database-warning";

type SearchParams = Promise<{ busca?: string }>;

export default async function ProjetosPage({ searchParams }: { searchParams: SearchParams }) {
  const { busca = "" } = await searchParams;
  const buscaNormalizada = busca.trim();

  let projetos: Awaited<ReturnType<typeof prisma.projeto.findMany>> = [];
  let databaseUnavailable = false;

  try {
    projetos = await prisma.projeto.findMany({
      where: buscaNormalizada
        ? {
            OR: [
              { titulo: { contains: buscaNormalizada, mode: "insensitive" } },
              { centroCusto: { contains: buscaNormalizada, mode: "insensitive" } },
              { financiador: { contains: buscaNormalizada, mode: "insensitive" } },
            ],
          }
        : undefined,
      orderBy: { vigenciaInicial: "desc" },
    });
  } catch (error) {
    if (isDatabaseUnavailableError(error)) {
      databaseUnavailable = true;
    } else {
      throw error;
    }
  }

  const totalValor = projetos.reduce((t, p) => t + Number(p.valorTotal), 0);
  const ativos = projetos.filter((p) => p.status.toLowerCase().includes("ativo")).length;

  return (
    <div className="flex min-h-screen bg-zinc-50">
      <Sidebar />

      <main className="ml-64 flex-1">
        <Header
          title="Projetos"
          description="Gestão de projetos institucionais"
          actions={
            <Link href="/projetos/novo">
              <Button variant="primary">
                <Plus className="h-4 w-4" /> Novo Projeto
              </Button>
            </Link>
          }
        />

        <div className="space-y-6 p-6 lg:p-8">
          {databaseUnavailable ? (
            <DatabaseWarning
              title="Projetos carregados em modo reduzido"
              description="A lista e os indicadores de projetos ficaram vazios porque a conexão com o banco falhou temporariamente."
              actionHref="/"
              actionLabel="Voltar ao painel"
            />
          ) : null}

          <MetricGrid>
            <MetricCard
              title="Projetos"
              value={projetos.length}
              subtitle="cadastrados"
              icon={Building2}
              iconBg="bg-teal-100"
              iconColor="text-teal-600"
            />
            <MetricCard
              title="Ativos"
              value={ativos}
              subtitle="em execução"
              icon={Building2}
              iconBg="bg-emerald-100"
              iconColor="text-emerald-600"
            />
            <MetricCard
              title="Valor Total"
              value={new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(totalValor)}
              icon={Building2}
              iconBg="bg-sky-100"
              iconColor="text-sky-600"
            />
          </MetricGrid>

          <Card>
            <div className="flex flex-col gap-4 border-b border-zinc-200/60 p-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-zinc-950">Lista de Projetos</h2>
                <p className="text-sm text-zinc-500">Busca por título, centro de custo e financiador</p>
              </div>

              <form action="/projetos" method="GET" className="relative">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <input
                  type="search"
                  name="busca"
                  defaultValue={buscaNormalizada}
                  placeholder="Buscar projeto..."
                  className="h-11 w-full rounded-xl border border-zinc-300 bg-zinc-50 pl-11 pr-4 text-sm placeholder:text-zinc-400 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/15 lg:w-72"
                />
              </form>
            </div>

            {projetos.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-400">
                  <Building2 className="h-8 w-8" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-zinc-900">Nenhum projeto encontrado</h3>
                <p className="mt-1 max-w-sm text-sm text-zinc-500">
                  {buscaNormalizada
                    ? "Ajuste a busca para localizar projetos."
                    : "Cadastre o primeiro projeto para iniciar."}
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>C. Custo</TableHead>
                    <TableHead>Financiador</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Vigência</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projetos.map((projeto) => {
                    const statusVariant = projeto.status.toLowerCase().includes("ativo")
                      ? "success"
                      : projeto.status.toLowerCase().includes("concluido")
                      ? "info"
                      : projeto.status.toLowerCase().includes("pausado")
                      ? "warning"
                      : "outline";

                    return (
                      <TableRow key={projeto.id}>
                        <TableCell>
                          <div>
                            <Link href={`/projetos/${projeto.id}`} className="font-medium text-zinc-950 hover:text-teal-600">
                              {projeto.titulo}
                            </Link>
                            <p className="text-xs text-zinc-500">{projeto.abreviacao ?? "—"}</p>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{projeto.centroCusto}</TableCell>
                        <TableCell className="text-zinc-600">{projeto.financiador ?? "—"}</TableCell>
                        <TableCell>
                          <Badge variant={statusVariant}>{projeto.status}</Badge>
                        </TableCell>
                        <TableCell className="text-zinc-600">
                          {projeto.vigenciaInicial.toLocaleDateString("pt-BR")}
                        </TableCell>
                        <TableCell className="font-semibold text-zinc-950">
                          {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(projeto.valorTotal))}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Link href={`/projetos/${projeto.id}`}>
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Link href={`/projetos/${projeto.id}/editar`}>
                              <Button variant="ghost" size="icon">
                                <Pencil className="h-4 w-4" />
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
              <p className="text-sm text-zinc-500">{projetos.length} projetos na listagem</p>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
