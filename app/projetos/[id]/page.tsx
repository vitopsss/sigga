import Link from "next/link";
import { ArrowLeft, CalendarDays, CircleDollarSign, Landmark, Pencil, Tags } from "lucide-react";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export default async function ProjetoDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const projeto = await prisma.projeto.findUnique({
    where: { id },
    select: {
      id: true,
      centroCusto: true,
      titulo: true,
      abreviacao: true,
      portfolio: true,
      financiador: true,
      numContrato: true,
      ano: true,
      valorTotal: true,
      status: true,
      vigenciaInicial: true,
      vigenciaFinal: true,
    },
  });

  if (!projeto) {
    notFound();
  }

  return (
    <div className="bg-[radial-gradient(circle_at_top_left,_rgba(20,184,166,0.12),_transparent_30%)]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-8 lg:px-10 lg:py-10">
        <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-[0_20px_80px_-30px_rgba(15,23,42,0.35)] backdrop-blur xl:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <span className="inline-flex rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">
                Projeto
              </span>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">
                {projeto.titulo}
              </h1>
              <p className="mt-3 text-base text-zinc-600">
                Centro de Custo: <span className="font-medium text-zinc-900">{projeto.centroCusto}</span>
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/projetos"
                className="inline-flex h-11 items-center gap-2 rounded-full border border-zinc-200 bg-white px-5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Link>
              <Link
                href={`/projetos/${projeto.id}/editar`}
                className="inline-flex h-11 items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-5 text-sm font-semibold text-amber-700 transition hover:bg-amber-100"
              >
                <Pencil className="h-4 w-4" />
                Editar
              </Link>
            </div>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-[0_20px_80px_-30px_rgba(15,23,42,0.25)] backdrop-blur">
            <div className="flex items-center gap-3">
              <Tags className="h-5 w-5 text-teal-700" />
              <h2 className="text-lg font-semibold text-zinc-950">Identificacao</h2>
            </div>
            <div className="mt-6 space-y-4 text-sm text-zinc-600">
              <p><span className="font-medium text-zinc-900">Abreviacao:</span> {projeto.abreviacao ?? "Nao informada"}</p>
              <p><span className="font-medium text-zinc-900">Portfolio:</span> {projeto.portfolio ?? "Nao informado"}</p>
              <p><span className="font-medium text-zinc-900">Status:</span> {projeto.status}</p>
              <p><span className="font-medium text-zinc-900">Ano:</span> {projeto.ano ?? "Nao informado"}</p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-[0_20px_80px_-30px_rgba(15,23,42,0.25)] backdrop-blur">
            <div className="flex items-center gap-3">
              <Landmark className="h-5 w-5 text-teal-700" />
              <h2 className="text-lg font-semibold text-zinc-950">Contrato e financiador</h2>
            </div>
            <div className="mt-6 space-y-4 text-sm text-zinc-600">
              <p><span className="font-medium text-zinc-900">Financiador:</span> {projeto.financiador ?? "Nao informado"}</p>
              <p><span className="font-medium text-zinc-900">Nº do Contrato:</span> {projeto.numContrato ?? "Nao informado"}</p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-[0_20px_80px_-30px_rgba(15,23,42,0.25)] backdrop-blur">
            <div className="flex items-center gap-3">
              <CircleDollarSign className="h-5 w-5 text-teal-700" />
              <h2 className="text-lg font-semibold text-zinc-950">Financeiro</h2>
            </div>
            <div className="mt-6 space-y-4 text-sm text-zinc-600">
              <p><span className="font-medium text-zinc-900">Valor Total:</span> {currencyFormatter.format(Number(projeto.valorTotal))}</p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-[0_20px_80px_-30px_rgba(15,23,42,0.25)] backdrop-blur md:col-span-2 xl:col-span-3">
            <div className="flex items-center gap-3">
              <CalendarDays className="h-5 w-5 text-teal-700" />
              <h2 className="text-lg font-semibold text-zinc-950">Vigencia</h2>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2 text-sm text-zinc-600">
              <p><span className="font-medium text-zinc-900">Vigencia Inicial:</span> {projeto.vigenciaInicial.toLocaleDateString("pt-BR")}</p>
              <p><span className="font-medium text-zinc-900">Vigencia Final:</span> {projeto.vigenciaFinal ? projeto.vigenciaFinal.toLocaleDateString("pt-BR") : "Em aberto"}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
