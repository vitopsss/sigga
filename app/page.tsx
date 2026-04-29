import Link from "next/link";
import {
  BriefcaseBusiness,
  Users,
  WalletCards,
  ShoppingCart,
  Building2,
  ArrowRight,
} from "lucide-react";

import { prisma } from "@/lib/prisma";
import { DATABASE_UNAVAILABLE_ERROR, isDatabaseUnavailableError } from "@/lib/prisma-runtime";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { MetricCard, MetricGrid } from "@/components/dashboard/metric-cards";
import { Card, Badge } from "@/components/ui";

export const dynamic = "force-dynamic";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
});

function formatProjectStatus(status: string) {
  return status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function getStatusBadge(status: string) {
  const normalized = status.toLowerCase();
  if (normalized.includes("ativo")) return <Badge variant="success">Ativo</Badge>;
  if (normalized.includes("elaboracao") || normalized.includes("analise")) return <Badge variant="warning">Em elaboração</Badge>;
  if (normalized.includes("concluido")) return <Badge variant="info">Concluído</Badge>;
  if (normalized.includes("pausado") || normalized.includes("suspenso")) return <Badge variant="warning">Pausado</Badge>;
  return <Badge variant="outline">{formatProjectStatus(status)}</Badge>;
}

export default async function Home() {
  let totalProjetos = 0;
  let totalColaboradores = 0;
  let totalCadastros = 0;
  let totalBorderos = 0;
  let totalContratos = 0;
  let borderosAggregate: { _sum: { valor: unknown } } = { _sum: { valor: 0 } };
  let projetosRecentes: Array<{
    id: string;
    titulo: string;
    centroCusto: string;
    status: string;
    vigenciaInicial: Date;
    abreviacao: string | null;
  }> = [];
  let borderosRecentes: Array<{
    id: string;
    idBordero: string;
    data: Date | null;
    projeto: { titulo: string };
    lancamentos: Array<{ valor: unknown }>;
  }> = [];
  let databaseUnavailable = false;

  try {
    [
      totalProjetos,
      totalColaboradores,
      totalCadastros,
      totalBorderos,
      totalContratos,
      borderosAggregate,
      projetosRecentes,
      borderosRecentes,
    ] = await Promise.all([
      prisma.projeto.count(),
      prisma.colaborador.count(),
      prisma.pessoa.count(),
      prisma.bordero.count(),
      prisma.contratoFornecedor.count(),
      prisma.lancamentoFinanceiro.aggregate({
        _sum: { valor: true },
      }),
      prisma.projeto.findMany({
        take: 5,
        orderBy: { vigenciaInicial: "desc" },
        select: {
          id: true,
          titulo: true,
          centroCusto: true,
          status: true,
          vigenciaInicial: true,
          abreviacao: true,
        },
      }),
      prisma.bordero.findMany({
        take: 5,
        orderBy: { data: "desc" },
        include: {
          projeto: { select: { titulo: true } },
          lancamentos: { select: { valor: true } },
        },
      }),
    ]);
  } catch (error) {
    if (isDatabaseUnavailableError(error)) {
      databaseUnavailable = true;
    } else {
      throw error;
    }
  }

  const saldoBorderos = Number(borderosAggregate._sum.valor ?? 0);

  return (
    <div className="flex min-h-screen bg-zinc-50">
      <Sidebar />

      <main className="flex-1 ml-64">
        <Header
          title="Painel Geral"
          description="Instituto Acariquara - visão consolidada da operação"
        />

        <div className="p-6 lg:p-8">
          {databaseUnavailable ? (
            <Card className="mb-8 border-amber-200 bg-amber-50/80">
              <div className="p-6">
                <div className="flex items-center gap-3">
                  <Badge variant="warning">Banco indisponível</Badge>
                  <p className="text-sm font-medium text-amber-900">{DATABASE_UNAVAILABLE_ERROR}</p>
                </div>
                <p className="mt-3 text-sm text-amber-800">
                  O painel foi carregado sem os indicadores do banco. Assim que a conexão voltar, os números e listas recentes reaparecem.
                </p>
              </div>
            </Card>
          ) : null}

          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-zinc-950">Bem-vindo ao SIGGA</h2>
            <p className="mt-2 text-zinc-500">
              Gestão integrada de projetos, finanças, compras e patrimônio.
            </p>
          </div>

          {/* Metrics */}
          <MetricGrid>
            <MetricCard
              title="Projetos"
              value={totalProjetos}
              subtitle="ativos no sistema"
              icon={BriefcaseBusiness}
              iconBg="bg-teal-100"
              iconColor="text-teal-600"
              trend={{ value: 12, label: "este mês" }}
            />
            <MetricCard
              title="Colaboradores"
              value={totalColaboradores}
              subtitle={`${totalCadastros} cadastros únicos`}
              icon={Users}
              iconBg="bg-sky-100"
              iconColor="text-sky-600"
            />
            <MetricCard
              title="Borderôs"
              value={currencyFormatter.format(saldoBorderos)}
              subtitle={`${totalBorderos} borderôs cadastrados`}
              icon={WalletCards}
              iconBg="bg-amber-100"
              iconColor="text-amber-600"
              trend={{ value: 8, label: "vs mês anterior" }}
            />
            <MetricCard
              title="Contratos"
              value={totalContratos}
              subtitle="fornecedores ativos"
              icon={ShoppingCart}
              iconBg="bg-violet-100"
              iconColor="text-violet-600"
            />
          </MetricGrid>

          {/* Tables Section */}
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {/* Recent Projects */}
            <Card>
              <div className="flex items-center justify-between border-b border-zinc-200/60 p-6">
                <div>
                  <h3 className="text-lg font-semibold text-zinc-950">Projetos Recentes</h3>
                  <p className="text-sm text-zinc-500">Últimos projetos cadastrados</p>
                </div>
                <Link href="/projetos">
                  <button className="flex items-center gap-1 text-sm font-medium text-teal-600 hover:text-teal-700">
                    Ver todos <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
              </div>
              <div className="divide-y divide-zinc-100">
                {projetosRecentes.length === 0 ? (
                  <div className="p-6 text-center text-sm text-zinc-500">
                    Nenhum projeto encontrado
                  </div>
                ) : (
                  projetosRecentes.map((projeto) => (
                    <Link
                      key={projeto.id}
                      href={`/projetos/${projeto.id}`}
                      className="flex items-center justify-between p-4 transition-colors hover:bg-zinc-50"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-zinc-950 truncate">{projeto.titulo}</p>
                        <p className="text-sm text-zinc-500">{projeto.centroCusto}</p>
                      </div>
                      <div className="ml-4 flex items-center gap-3">
                        {getStatusBadge(projeto.status)}
                        <span className="text-xs text-zinc-400">
                          {dateFormatter.format(projeto.vigenciaInicial)}
                        </span>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </Card>

            {/* Recent Borderos */}
            <Card>
              <div className="flex items-center justify-between border-b border-zinc-200/60 p-6">
                <div>
                  <h3 className="text-lg font-semibold text-zinc-950">Borderôs Recentes</h3>
                  <p className="text-sm text-zinc-500">Últimas movimentações financeiras</p>
                </div>
                <Link href="/borderos">
                  <button className="flex items-center gap-1 text-sm font-medium text-teal-600 hover:text-teal-700">
                    Ver todos <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
              </div>
              <div className="divide-y divide-zinc-100">
                {borderosRecentes.length === 0 ? (
                  <div className="p-6 text-center text-sm text-zinc-500">
                    Nenhum borderô encontrado
                  </div>
                ) : (
                  borderosRecentes.map((bordero) => {
                    const valor = bordero.lancamentos.reduce((t, l) => t + Number(l.valor), 0);
                    return (
                      <Link
                        key={bordero.id}
                        href={`/borderos/${bordero.id}`}
                        className="flex items-center justify-between p-4 transition-colors hover:bg-zinc-50"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-zinc-950">{bordero.idBordero}</p>
                          <p className="text-sm text-zinc-500 truncate">{bordero.projeto.titulo}</p>
                        </div>
                        <span className="ml-4 text-sm font-semibold text-zinc-950">
                          {currencyFormatter.format(valor)}
                        </span>
                      </Link>
                    );
                  })
                )}
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <h3 className="mb-4 text-lg font-semibold text-zinc-950">Ações Rápidas</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Link
                href="/projetos/novo"
                className="flex items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-5 transition-all hover:border-teal-200 hover:shadow-lg hover:shadow-teal-500/10"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100 text-teal-600">
                  <BriefcaseBusiness className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-medium text-zinc-950">Novo Projeto</p>
                  <p className="text-sm text-zinc-500">Cadastrar projeto</p>
                </div>
              </Link>

              <Link
                href="/ater-sociobio/familias/nova"
                className="flex items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-5 transition-all hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-500/10"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-medium text-zinc-950">Nova Família Beneficiária</p>
                  <p className="text-sm text-zinc-500">Cadastrar família no módulo ATER</p>
                </div>
              </Link>

              <Link
                href="/compras"
                className="flex items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-5 transition-all hover:border-amber-200 hover:shadow-lg hover:shadow-amber-500/10"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                  <ShoppingCart className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-medium text-zinc-950">Contratos</p>
                  <p className="text-sm text-zinc-500">Gerenciar compras</p>
                </div>
              </Link>

              <Link
                href="/cadastros"
                className="flex items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-5 transition-all hover:border-sky-200 hover:shadow-lg hover:shadow-sky-500/10"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-100 text-sky-600">
                  <Building2 className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-medium text-zinc-950">Cadastro Único</p>
                  <p className="text-sm text-zinc-500">Pessoas e instituições</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
