import { RHService, ColaboradorWithCadastro } from "@/lib/services/rh.service";
import { isDatabaseUnavailableError } from "@/lib/prisma-runtime";
import Link from "next/link";
import { Plus, Search, User, Building2 } from "lucide-react";
import { 
  Badge, 
  Button, 
  Card, 
  Empty, 
  EmptyIcon, 
  EmptyTitle, 
  EmptyDescription, 
  EmptyActions, 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from "@/components/ui";
import { DeleteButton } from "@/app/_components/delete-button";
import { DatabaseWarning } from "@/components/system/database-warning";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { MetricCard, MetricGrid } from "@/components/dashboard/metric-cards";

type SearchParams = Promise<{ busca?: string }>;

const currencyFormatter = new Intl.NumberFormat("pt-BR", { 
  style: "currency", 
  currency: "BRL" 
});

function getVinculoBadge(vinculo: string | null) {
  if (!vinculo) return <Badge variant="outline">Não informado</Badge>;
  const normalized = vinculo.toLowerCase();
  
  if (normalized.includes("clt") || normalized.includes("contratado")) 
    return <Badge variant="success">CLT</Badge>;
  if (normalized.includes("bolsa") || normalized.includes("bolsista")) 
    return <Badge variant="info">Bolsista</Badge>;
  if (normalized.includes("pj")) 
    return <Badge variant="warning">PJ</Badge>;
    
  return <Badge variant="outline">{vinculo}</Badge>;
}

export default async function RHPage({ searchParams }: { searchParams: SearchParams }) {
  const { busca = "" } = await searchParams;
  const buscaNormalizada = busca.trim();

  let colaboradores: ColaboradorWithCadastro[] = [];
  let databaseUnavailable = false;

  try {
    colaboradores = await RHService.list(buscaNormalizada);
  } catch (error) {
    if (isDatabaseUnavailableError(error)) {
      databaseUnavailable = true;
    } else {
      throw error;
    }
  }

  const totalSalarios = colaboradores.reduce((total, colab) => total + Number(colab.salarioBase), 0);
  const totalAtivos = colaboradores.filter((colab) => colab.status?.toLowerCase() === "ativo").length;

  return (
    <div className="flex min-h-screen bg-zinc-50">
      <Sidebar />

      <main className="flex-1 ml-64">
        <Header
          title="Recursos Humanos"
          description="Gestão de equipe técnica e colaboradores"
          actions={
            <Link href="/rh/novo">
              <Button variant="primary">
                <Plus className="h-4 w-4" /> Novo
              </Button>
            </Link>
          }
        />

        <div className="p-6 lg:p-8 space-y-6">
          <MetricGrid>
            <MetricCard
              title="Colaboradores"
              value={colaboradores.length}
              subtitle="registrados"
              icon={User}
              iconBg="bg-teal-100"
              iconColor="text-teal-600"
            />
            <MetricCard
              title="Ativos"
              value={totalAtivos}
              icon={User}
              iconBg="bg-emerald-100"
              iconColor="text-emerald-600"
            />
            <MetricCard
              title="Folha base"
              value={currencyFormatter.format(totalSalarios)}
              icon={Building2}
              iconBg="bg-sky-100"
              iconColor="text-sky-600"
            />
          </MetricGrid>

          <Card>
            {databaseUnavailable && (
              <div className="p-6">
                <DatabaseWarning
                  title="RH carregado em modo reduzido"
                  description="A equipe técnica ficou indisponível agora porque a conexão com o banco falhou temporariamente."
                  actionHref="/"
                  actionLabel="Voltar ao painel"
                />
              </div>
            )}

            <div className="flex flex-col gap-4 border-b border-zinc-200/60 p-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-zinc-950">Lista de colaboradores</h2>
                <p className="text-sm text-zinc-500">ID interno, nome, cargo, vínculo e salário base.</p>
              </div>

              <div className="flex gap-3">
                <form action="/rh" method="GET" className="relative">
                  <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="search"
                    name="busca"
                    defaultValue={buscaNormalizada}
                    placeholder="Buscar..."
                    className="h-11 w-full rounded-xl border border-zinc-300 bg-zinc-50 pl-11 pr-4 text-sm placeholder:text-zinc-400 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/15 lg:w-72"
                  />
                </form>
                <Link href="/rh/novo">
                  <Button variant="primary">
                    <Plus className="h-4 w-4" />
                    Novo
                  </Button>
                </Link>
              </div>
            </div>

            {colaboradores.length === 0 ? (
              <Empty>
                <EmptyIcon><User className="h-10 w-10" /></EmptyIcon>
                <EmptyTitle>Nenhum colaborador encontrado</EmptyTitle>
                <EmptyDescription>
                  {buscaNormalizada ? "Ajuste a busca ou cadastre um novo colaborador." : "Cadastre o primeiro colaborador para iniciar."}
                </EmptyDescription>
                <EmptyActions>
                  <Link href="/rh/novo">
                    <Button variant="primary">Novo Colaborador</Button>
                  </Link>
                </EmptyActions>
              </Empty>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID RH</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Cargo</TableHead>
                    <TableHead>Vínculo</TableHead>
                    <TableHead>Salário</TableHead>
                    <TableHead>Projetos</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {colaboradores.map((colab) => (
                    <TableRow key={colab.id}>
                      <TableCell>
                        <span className="font-mono text-xs font-medium">{colab.idRH}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100">
                            <User className="h-5 w-5 text-zinc-600" />
                          </div>
                          <div>
                            <p className="font-medium text-zinc-950">{colab.cadastro.nome}</p>
                            <p className="text-xs text-zinc-500">{colab.cadastro.documento}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-zinc-700">{colab.cargo ?? "—"}</TableCell>
                      <TableCell>{getVinculoBadge(colab.vinculo)}</TableCell>
                      <TableCell className="font-semibold text-zinc-950">
                        {currencyFormatter.format(Number(colab.salarioBase))}
                      </TableCell>
                      <TableCell>
                        <span className="text-xs text-zinc-400">—</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/cadastros/${colab.cadastro.id}`}>
                            <Button variant="ghost" size="icon">
                              <Building2 className="h-4 w-4" />
                            </Button>
                          </Link>
                          <DeleteButton id={colab.id} apiEndpoint="/api/rh" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            <div className="border-t border-zinc-200/60 px-6 py-4">
              <p className="text-sm text-zinc-500">{colaboradores.length} colaboradores na listagem atual.</p>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
