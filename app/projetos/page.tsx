import Link from "next/link";
import { Eye, FolderKanban, Pencil, Plus, Search } from "lucide-react";

import { prisma } from "@/lib/prisma";

import { DeleteButton } from "./delete-button";

type SearchParams = Promise<{ busca?: string }>;

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

function getStatusClasses(status: string) {
  const palette: Record<string, string> = {
    ATIVO: "bg-emerald-500/15 text-emerald-700 ring-emerald-600/20",
    "CONCLUÍDO": "bg-sky-500/15 text-sky-700 ring-sky-700/20",
    SUSPENSO: "bg-rose-500/15 text-rose-700 ring-rose-700/20",
    "EM ANÁLISE": "bg-amber-500/15 text-amber-700 ring-amber-600/20",
  };

  return palette[status] ?? "bg-zinc-500/10 text-zinc-700 ring-zinc-700/10";
}

export default async function ProjetosPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { busca = "" } = await searchParams;
  const buscaNormalizada = busca.trim();

  const projetos = await prisma.projeto.findMany({
    where: buscaNormalizada
      ? {
          OR: [
            { titulo: { contains: buscaNormalizada, mode: "insensitive" } },
            { centroCusto: { contains: buscaNormalizada, mode: "insensitive" } },
          ],
        }
      : undefined,
    orderBy: {
      vigenciaInicial: "desc",
    },
    select: {
      id: true,
      centroCusto: true,
      titulo: true,
      financiador: true,
      status: true,
      valorTotal: true,
      vigenciaInicial: true,
      vigenciaFinal: true,
    },
  });

  return (
    <div className="bg-[radial-gradient(circle_at_top_left,_rgba(20,184,166,0.14),_transparent_32%)]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-8 lg:px-10 lg:py-10">
        <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-[0_20px_80px_-30px_rgba(15,23,42,0.35)] backdrop-blur xl:p-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <span className="inline-flex items-center rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-teal-700">
                Gestao de Projetos
              </span>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">
                Projetos, contratos e vigencias centralizados em um unico modulo.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-600 sm:text-lg">
                Busque por titulo ou centro de custo e acompanhe o ciclo completo dos projetos.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="rounded-[1.5rem] border border-zinc-200/80 bg-zinc-950 px-5 py-4 text-white shadow-lg shadow-zinc-950/10">
                <p className="text-sm text-zinc-400">Total de projetos</p>
                <p className="mt-2 text-3xl font-semibold tracking-tight">{projetos.length}</p>
              </div>

              <Link
                href="/projetos/novo"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-teal-600 px-5 text-sm font-semibold text-white transition hover:bg-teal-500"
              >
                <Plus className="h-4 w-4" />
                Novo Projeto
              </Link>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/70 bg-white/90 shadow-[0_20px_80px_-30px_rgba(15,23,42,0.25)] backdrop-blur">
          <div className="flex flex-col gap-4 border-b border-zinc-200/80 px-6 py-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-zinc-950">
                Lista de projetos
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                Centro de custo, titulo, financiador, status, valor e vigencia.
              </p>
            </div>

            <form action="/projetos" method="GET" className="w-full max-w-md">
              <label className="relative block">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <input
                  type="search"
                  name="busca"
                  defaultValue={buscaNormalizada}
                  placeholder="Buscar por titulo ou centro de custo"
                  className="h-12 w-full rounded-full border border-zinc-200 bg-zinc-50 pl-11 pr-4 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                />
              </label>
            </form>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-zinc-200/80">
              <thead className="bg-zinc-50/80">
                <tr className="text-left text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  <th className="px-6 py-4 sm:px-8">C. Custo</th>
                  <th className="px-6 py-4">Titulo</th>
                  <th className="px-6 py-4">Financiador</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Valor Total</th>
                  <th className="px-6 py-4">Vigencia</th>
                  <th className="px-6 py-4 text-right">Acoes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 bg-white">
                {projetos.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-14 sm:px-8">
                      <div className="flex flex-col items-center justify-center gap-3 text-center">
                        <div className="rounded-full bg-zinc-100 p-4 text-zinc-500">
                          <FolderKanban className="h-6 w-6" />
                        </div>
                        <p className="text-base font-medium text-zinc-700">
                          Nenhum projeto encontrado.
                        </p>
                        <p className="max-w-md text-sm text-zinc-500">
                          Ajuste a busca ou crie um novo projeto para iniciar a gestao do portifolio.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  projetos.map((projeto) => (
                    <tr key={projeto.id} className="transition-colors hover:bg-zinc-50/80">
                      <td className="px-6 py-5 font-medium text-zinc-950 sm:px-8">
                        {projeto.centroCusto}
                      </td>
                      <td className="px-6 py-5 text-sm text-zinc-700">{projeto.titulo}</td>
                      <td className="px-6 py-5 text-sm text-zinc-600">
                        {projeto.financiador ?? "Nao informado"}
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${getStatusClasses(
                            projeto.status,
                          )}`}
                        >
                          {projeto.status}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-sm font-medium text-zinc-700">
                        {currencyFormatter.format(Number(projeto.valorTotal))}
                      </td>
                      <td className="px-6 py-5 text-sm text-zinc-600">
                        {projeto.vigenciaInicial.toLocaleDateString("pt-BR")} -{" "}
                        {projeto.vigenciaFinal
                          ? projeto.vigenciaFinal.toLocaleDateString("pt-BR")
                          : "Em aberto"}
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/projetos/${projeto.id}`}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-600 transition hover:bg-zinc-50"
                            aria-label="Visualizar projeto"
                            title="Visualizar projeto"
                          >
                            <Eye className="h-4 w-4" strokeWidth={2} />
                          </Link>
                          <Link
                            href={`/projetos/${projeto.id}/editar`}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-amber-200 bg-amber-50 text-amber-700 transition hover:bg-amber-100"
                            aria-label="Editar projeto"
                            title="Editar projeto"
                          >
                            <Pencil className="h-4 w-4" strokeWidth={2} />
                          </Link>
                          <DeleteButton id={projeto.id} />
                        </div>
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
