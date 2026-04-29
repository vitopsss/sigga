import Link from "next/link";
import { Plus, Search, FolderKanban, Briefcase, Calendar, Building2 } from "lucide-react";

import { isDatabaseUnavailableError } from "@/lib/prisma-runtime";
import { ProjetoService, ProjetoListItem } from "@/lib/services/projeto.service";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { MetricCard, MetricGrid } from "@/components/dashboard/metric-cards";
import { Card, Badge, Button } from "@/components/ui";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { DatabaseWarning } from "@/components/system/database-warning";

type SearchParams = Promise<{ busca?: string }>;

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

function getStatusBadge(status: string) {
  const s = status.toLowerCase();
  if (s === "ativo" || s === "em execução") return <Badge variant="success">Ativo</Badge>;
  if (s === "planejamento") return <Badge variant="warning">Planejamento</Badge>;
  if (s === "concluído") return <Badge variant="info">Concluído</Badge>;
  return <Badge variant="outline">{status}</Badge>;
}

export default async function ProjetosPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { busca = "" } = await searchParams;
  const buscaNormalizada = busca.trim();

  let projetos: ProjetoListItem[] = [];
  let databaseUnavailable = false;

  try {
    projetos = await ProjetoService.list(buscaNormalizada);
  } catch (error) {
    if (isDatabaseUnavailableError(error)) {
      databaseUnavailable = true;
    } else {
      throw error;
    }
  }

  const valorTotalGeral = projetos.reduce((acc, p) => acc + Number(p.valorTotal), 0);
  const totalAtivos = projetos.filter(p => p.status.toLowerCase() === "ativo").length;

  return (
    <div className="flex min-h-screen bg-zinc-50">
      <Sidebar />

      <main className="flex-1 ml-64">
        <Header
          title="Projetos"
          description="Gestão de portfólio e centros de custo"
          actions={
            <Link href="/projetos/novo">
              <Button variant="primary">
                <Plus className="h-4 w-4" /> Novo Projeto
              </Button>
            </Link>
          }
        />

        <div className="p-6 lg:p-8 space-y-6">
          {databaseUnavailable ? (
            <DatabaseWarning
              title="Projetos carregados em modo reduzido"
              description="A lista de projetos ficou indisponível agora porque a conexão com o banco falhou temporariamente."
              actionHref="/"
              actionLabel="Voltar ao painel"
            />
          ) : null}

          <MetricGrid>
            <MetricCard
              title="Total de Projetos"
              value={projetos.length}
              subtitle="registrados"
              icon={FolderKanban}
              iconBg="bg-teal-100"
              iconColor="text-teal-600"
            />
            <MetricCard
              title="Ativos"
              value={totalAtivos}
              icon={Briefcase}
              iconBg="bg-emerald-100"
              iconColor="text-emerald-600"
            />
            <MetricCard
              title="Valor em Carteira"
              value={currencyFormatter.format(valorTotalGeral)}
              icon={Building2}
              iconBg="bg-sky-100"
              iconColor="text-sky-600"
            />
          </MetricGrid>

          <Card>
            <div className="flex flex-col gap-4 border-b border-zinc-200/60 p-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-zinc-950">Lista de Projetos</h2>
                <p className="text-sm text-zinc-500">Centros de custo e portfólio</p>
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
                  <FolderKanban className="h-8 w-8" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-zinc-900">Nenhum projeto encontrado</h3>
                <p className="mt-1 max-w-sm text-sm text-zinc-500">
                  {buscaNormalizada ? "Ajuste a busca ou cadastre um novo projeto." : "Cadastre o primeiro projeto para iniciar."}
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>C. Custo</TableHead>
                    <TableHead>Projeto</TableHead>
                    <TableHead>Financiador</TableHead>
                    <TableHead>Vigência</TableHead>
                    <TableHead>Valor Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projetos.map((projeto) => (
                    <TableRow key={projeto.id}>
                      <TableCell>
                        <span className="font-mono text-xs font-bold bg-zinc-100 px-2 py-1 rounded">
                          {projeto.centroCusto}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-zinc-950">{projeto.abreviacao || projeto.titulo.slice(0, 30)}</p>
                          <p className="text-xs text-zinc-500 max-w-[200px] truncate">{projeto.titulo}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-zinc-600 text-sm">{projeto.financiador ?? "—"}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-zinc-600">
                          <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                          <span className="text-xs">
                            {projeto.vigenciaInicial.toLocaleDateString("pt-BR", { year: "2-digit", month: "2-digit" })} — 
                            {projeto.vigenciaFinal?.toLocaleDateString("pt-BR", { year: "2-digit", month: "2-digit" }) ?? "Indef."}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold text-zinc-950">
                        {currencyFormatter.format(Number(projeto.valorTotal))}
                      </TableCell>
                      <TableCell>{getStatusBadge(projeto.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Link href={`/projetos/${projeto.id}`}>
                            <Button variant="ghost" size="icon">
                              <Search className="h-4 w-4" />
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
                  ))}
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
