import { BriefcaseBusiness, Users, WalletCards } from "lucide-react";

import { prisma } from "@/lib/prisma";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

function formatProjectStatus(status: string) {
  return status
    .toLowerCase()
    .split("_")
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(" ");
}

function getStatusClasses(status: string) {
  const palette: Record<string, string> = {
    ATIVO: "bg-emerald-500/15 text-emerald-700 ring-emerald-600/20",
    EM_ELABORACAO: "bg-amber-500/15 text-amber-700 ring-amber-600/20",
    PAUSADO: "bg-orange-500/15 text-orange-700 ring-orange-600/20",
    CONCLUIDO: "bg-sky-500/15 text-sky-700 ring-sky-700/20",
    CANCELADO: "bg-rose-500/15 text-rose-700 ring-rose-700/20",
  };

  return palette[status] ?? "bg-zinc-500/10 text-zinc-700 ring-zinc-700/10";
}

export default async function Home() {
  const [totalProjetos, totalColaboradores, borderosAggregate, projetosRecentes] =
    await Promise.all([
      prisma.projeto.count(),
      prisma.colaborador.count(),
      prisma.lancamentoFinanceiro.aggregate({
        _sum: {
          valor: true,
        },
      }),
      prisma.projeto.findMany({
        take: 5,
        orderBy: {
          vigenciaInicial: "desc",
        },
        select: {
          id: true,
          titulo: true,
          centroCusto: true,
          status: true,
          vigenciaInicial: true,
          vigenciaFinal: true,
        },
      }),
    ]);

  const saldoBorderos = Number(borderosAggregate._sum.valor ?? 0);

  return (
    <div className="bg-[radial-gradient(circle_at_top,_rgba(20,184,166,0.14),_transparent_35%)]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-8 lg:px-10 lg:py-10">
        <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-[0_20px_80px_-30px_rgba(15,23,42,0.35)] backdrop-blur xl:p-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <span className="inline-flex items-center rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-teal-700">
                Painel SIGGA
              </span>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">
                Visão consolidada dos projetos, equipe e financeiro.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-600 sm:text-lg">
                Dados carregados diretamente do banco com Prisma Client no servidor.
              </p>
            </div>

            <div className="grid min-w-full gap-4 sm:grid-cols-3 lg:min-w-[560px]">
              <div className="rounded-[1.5rem] border border-zinc-200/80 bg-zinc-950 p-5 text-white shadow-lg shadow-zinc-950/10">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-300">Projetos</span>
                  <span className="rounded-full bg-white/10 p-2 text-teal-300">
                    <BriefcaseBusiness className="h-5 w-5" strokeWidth={2} />
                  </span>
                </div>
                <p className="mt-6 text-3xl font-semibold tracking-tight">{totalProjetos}</p>
                <p className="mt-2 text-sm text-zinc-400">Total cadastrados na base.</p>
              </div>

              <div className="rounded-[1.5rem] border border-teal-200 bg-teal-50 p-5 shadow-lg shadow-teal-900/5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-teal-800">Colaboradores</span>
                  <span className="rounded-full bg-white p-2 text-teal-700 shadow-sm">
                    <Users className="h-5 w-5" strokeWidth={2} />
                  </span>
                </div>
                <p className="mt-6 text-3xl font-semibold tracking-tight text-zinc-950">{totalColaboradores}</p>
                <p className="mt-2 text-sm text-zinc-600">Equipe vinculada ao sistema.</p>
              </div>

              <div className="rounded-[1.5rem] border border-sky-200 bg-sky-50 p-5 shadow-lg shadow-sky-900/5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-sky-800">Saldo de borderôs</span>
                  <span className="rounded-full bg-white p-2 text-sky-700 shadow-sm">
                    <WalletCards className="h-5 w-5" strokeWidth={2} />
                  </span>
                </div>
                <p className="mt-6 text-3xl font-semibold tracking-tight text-zinc-950">
                  {currencyFormatter.format(saldoBorderos)}
                </p>
                <p className="mt-2 text-sm text-zinc-600">Soma de `valorTotal` dos borderôs.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/70 bg-white/85 shadow-[0_20px_80px_-30px_rgba(15,23,42,0.25)] backdrop-blur">
          <div className="flex items-center justify-between border-b border-zinc-200/80 px-6 py-5 sm:px-8">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-zinc-950">
                Últimos 5 projetos
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                Ordenados pela vigência inicial mais recente.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-zinc-200/80">
              <thead className="bg-zinc-50/80">
                <tr className="text-left text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  <th className="px-6 py-4 sm:px-8">Projeto</th>
                  <th className="px-6 py-4">Código</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Início</th>
                  <th className="px-6 py-4">Fim</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 bg-white">
                {projetosRecentes.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-sm text-zinc-500 sm:px-8">
                      Nenhum projeto encontrado.
                    </td>
                  </tr>
                ) : (
                  projetosRecentes.map((projeto) => (
                    <tr key={projeto.id} className="transition-colors hover:bg-zinc-50/80">
                      <td className="px-6 py-5 align-middle sm:px-8">
                        <span className="font-medium text-zinc-950">{projeto.titulo}</span>
                      </td>
                      <td className="px-6 py-5 text-sm font-medium text-zinc-700">
                        {projeto.centroCusto}
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${getStatusClasses(
                            projeto.status,
                          )}`}
                        >
                          {formatProjectStatus(projeto.status)}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-sm text-zinc-600">
                        {dateFormatter.format(projeto.vigenciaInicial)}
                      </td>
                      <td className="px-6 py-5 text-sm text-zinc-600">
                        {projeto.vigenciaFinal ? dateFormatter.format(projeto.vigenciaFinal) : "Em aberto"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
