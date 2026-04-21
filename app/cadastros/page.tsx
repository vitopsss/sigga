import Link from "next/link";
import { Eye, Mail, Pencil, Phone, Plus, Search, UserRound, Building2 } from "lucide-react";
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
type CadastroListItem = Prisma.PessoaGetPayload<{
  select: {
    id: true;
    nome: true;
    documento: true;
    tipo: true;
    email: true;
    telefone: true;
  };
}>;

function getTipoBadge(tipo: string) {
  if (tipo === "PF") return <Badge variant="success">Pessoa Física</Badge>;
  if (tipo === "PJ") return <Badge variant="info">Pessoa Jurídica</Badge>;
  if (tipo === "PUBLICO") return <Badge variant="warning">Público</Badge>;
  if (tipo === "PRIVADO") return <Badge variant="outline">Privado</Badge>;
  return <Badge variant="outline">{tipo}</Badge>;
}

export default async function CadastrosPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { busca = "" } = await searchParams;
  const buscaNormalizada = busca.trim();

  let cadastros: CadastroListItem[] = [];
  let databaseUnavailable = false;

  try {
    cadastros = await prisma.pessoa.findMany({
      where: buscaNormalizada
        ? {
            OR: [
              { nome: { contains: buscaNormalizada, mode: "insensitive" } },
              { documento: { contains: buscaNormalizada, mode: "insensitive" } },
            ],
          }
        : undefined,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        nome: true,
        documento: true,
        tipo: true,
        email: true,
        telefone: true,
      },
    });
  } catch (error) {
    if (isDatabaseUnavailableError(error)) {
      databaseUnavailable = true;
    } else {
      throw error;
    }
  }

  const pfs = cadastros.filter((c) => c.tipo === "PF").length;
  const pjs = cadastros.filter((c) => c.tipo === "PJ").length;

  return (
    <div className="flex min-h-screen bg-zinc-50">
      <Sidebar />

      <main className="flex-1 ml-64">
        <Header
          title="Cadastro Único"
          description="Pessoas e instituições"
          actions={
            <Link href="/cadastros/novo">
              <Button variant="primary">
                <Plus className="h-4 w-4" /> Novo Registro
              </Button>
            </Link>
          }
        />

        <div className="p-6 lg:p-8 space-y-6">
          {databaseUnavailable ? (
            <DatabaseWarning
              title="Cadastros carregados em modo reduzido"
              description="A lista de pessoas e instituições ficou indisponível agora porque a conexão com o banco falhou temporariamente."
              actionHref="/"
              actionLabel="Voltar ao painel"
            />
          ) : null}

          <MetricGrid>
            <MetricCard
              title="Total"
              value={cadastros.length}
              subtitle="registros"
              icon={Building2}
              iconBg="bg-teal-100"
              iconColor="text-teal-600"
            />
            <MetricCard
              title="Pessoas Físicas"
              value={pfs}
              icon={UserRound}
              iconBg="bg-emerald-100"
              iconColor="text-emerald-600"
            />
            <MetricCard
              title="Pessoas Jurídicas"
              value={pjs}
              icon={Building2}
              iconBg="bg-sky-100"
              iconColor="text-sky-600"
            />
          </MetricGrid>

          <Card>
            <div className="flex flex-col gap-4 border-b border-zinc-200/60 p-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-zinc-950">Lista de Cadastros</h2>
                <p className="text-sm text-zinc-500">Busca por nome e documento</p>
              </div>

              <form action="/cadastros" method="GET" className="relative">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <input
                  type="search"
                  name="busca"
                  defaultValue={buscaNormalizada}
                  placeholder="Buscar cadastro..."
                  className="h-11 w-full rounded-xl border border-zinc-300 bg-zinc-50 pl-11 pr-4 text-sm placeholder:text-zinc-400 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/15 lg:w-72"
                />
              </form>
            </div>

            {cadastros.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-400">
                  <UserRound className="h-8 w-8" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-zinc-900">Nenhum cadastro encontrado</h3>
                <p className="mt-1 max-w-sm text-sm text-zinc-500">
                  {buscaNormalizada
                    ? "Ajuste a busca ou cadastre um novo registro."
                    : "Cadastre o primeiro cadastro para iniciar."}
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Documento</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cadastros.map((cadastro) => (
                    <TableRow key={cadastro.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600">
                            {cadastro.tipo === "PF" ? (
                              <UserRound className="h-5 w-5" />
                            ) : (
                              <Building2 className="h-5 w-5" />
                            )}
                          </div>
                          <span className="font-medium text-zinc-950">{cadastro.nome}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{cadastro.documento}</TableCell>
                      <TableCell>{getTipoBadge(cadastro.tipo)}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center gap-1 text-zinc-600">
                          <Mail className="h-4 w-4 text-zinc-400" />
                          {cadastro.email ?? "—"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center gap-1 text-zinc-600">
                          <Phone className="h-4 w-4 text-zinc-400" />
                          {cadastro.telefone ?? "—"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Link href={`/cadastros/${cadastro.id}`}>
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={`/cadastros/${cadastro.id}/editar`}>
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
              <p className="text-sm text-zinc-500">{cadastros.length} cadastros na listagem</p>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
