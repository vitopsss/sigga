import Link from "next/link";
import {
  ArrowLeft,
  CircleDollarSign,
  Landmark,
  ListTodo,
  Pencil,
  Tags,
  Wallet,
} from "lucide-react";
import { notFound } from "next/navigation";
import type { Decimal } from "@prisma/client/runtime/library";

import { adicionarAtividade, adicionarOrcamento } from "@/app/projetos/acoes-itens";
import { prisma } from "@/lib/prisma";

const formatCurrency = (value: number | Decimal) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value));

const formatDate = (value: Date | null) =>
  value ? value.toLocaleDateString("pt-BR") : "Em aberto";

const getStatusBadgeClass = (status: string) => {
  const normalizedStatus = status.trim().toLowerCase();

  if (normalizedStatus === "em execução" || normalizedStatus === "em execucao") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (normalizedStatus === "não iniciado" || normalizedStatus === "nao iniciado") {
    return "border-zinc-200 bg-zinc-100 text-zinc-600";
  }

  return "border-sky-200 bg-sky-50 text-sky-700";
};

const inputClassName =
  "h-11 rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100";

const textareaClassName =
  "min-h-24 rounded-xl border border-zinc-200 bg-white px-3 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100";

export default async function ProjetoDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const projeto = await prisma.projeto.findUnique({
    where: { id },
    include: {
      orcamentos: true,
      atividadesATER: true,
    },
  });

  if (!projeto) {
    notFound();
  }

  const adicionarOrcamentoAction = adicionarOrcamento.bind(null, projeto.id);
  const adicionarAtividadeAction = adicionarAtividade.bind(null, projeto.id);

  return (
    <div className="bg-[radial-gradient(circle_at_top_left,_rgba(20,184,166,0.12),_transparent_28%),linear-gradient(180deg,_rgba(244,244,245,0.7)_0%,_rgba(255,255,255,0.95)_45%,_rgba(240,253,250,0.6)_100%)]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-8 lg:px-10 lg:py-10">
        <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-[0_20px_80px_-30px_rgba(15,23,42,0.35)] backdrop-blur xl:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-4">
              <span className="inline-flex rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">
                Projeto
              </span>
              <div>
                <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">
                  {projeto.titulo}
                </h1>
                <p className="mt-3 text-base text-zinc-600">
                  Centro de Custo:{" "}
                  <span className="font-medium text-zinc-900">{projeto.centroCusto}</span>
                </p>
              </div>
              <div className="flex flex-wrap gap-3 text-sm text-zinc-600">
                <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5">
                  <Tags className="h-4 w-4 text-teal-700" />
                  Abreviação: {projeto.abreviacao ?? "Não informada"}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5">
                  <Landmark className="h-4 w-4 text-teal-700" />
                  Contrato: {projeto.numContrato ?? "Não informado"}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5">
                  <CircleDollarSign className="h-4 w-4 text-teal-700" />
                  Status: {projeto.status}
                </span>
              </div>
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

        <nav className="flex flex-wrap gap-3">
          <a
            href="#resumo-projeto"
            className="inline-flex items-center rounded-full border border-teal-200 bg-teal-50 px-4 py-2 text-sm font-medium text-teal-700 transition hover:bg-teal-100"
          >
            B1 · Resumo do Projeto
          </a>
          <a
            href="#plano-trabalho"
            className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
          >
            B2 · Plano de Trabalho
          </a>
          <a
            href="#planejamento-atividades"
            className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
          >
            B3 · Planejamento de Atividades
          </a>
        </nav>

        <section
          id="resumo-projeto"
          className="rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-[0_20px_80px_-30px_rgba(15,23,42,0.25)] backdrop-blur lg:p-8"
        >
          <div className="flex items-center gap-3">
            <CircleDollarSign className="h-5 w-5 text-teal-700" />
            <div>
              <h2 className="text-xl font-semibold text-zinc-950">Resumo do Projeto</h2>
              <p className="text-sm text-zinc-500">B1 · Indicadores principais do projeto.</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-[1.5rem] border border-zinc-200/80 bg-zinc-50/80 p-5">
              <p className="text-sm font-medium text-zinc-500">C. Custo</p>
              <p className="mt-2 text-lg font-semibold text-zinc-950">{projeto.centroCusto}</p>
            </div>

            <div className="rounded-[1.5rem] border border-zinc-200/80 bg-zinc-50/80 p-5">
              <p className="text-sm font-medium text-zinc-500">Financiador</p>
              <p className="mt-2 text-lg font-semibold text-zinc-950">
                {projeto.financiador ?? "Não informado"}
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-zinc-200/80 bg-zinc-50/80 p-5">
              <p className="text-sm font-medium text-zinc-500">Vigência</p>
              <p className="mt-2 text-lg font-semibold text-zinc-950">
                {formatDate(projeto.vigenciaInicial)} até {formatDate(projeto.vigenciaFinal)}
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-teal-200 bg-teal-50/70 p-5">
              <p className="text-sm font-medium text-teal-700">Valor Total</p>
              <p className="mt-2 text-lg font-semibold text-zinc-950">
                {formatCurrency(projeto.valorTotal)}
              </p>
            </div>
          </div>
        </section>

        <section
          id="plano-trabalho"
          className="rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-[0_20px_80px_-30px_rgba(15,23,42,0.25)] backdrop-blur lg:p-8"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-center gap-3">
              <Wallet className="h-5 w-5 text-teal-700" />
              <div>
                <h2 className="text-xl font-semibold text-zinc-950">Plano de Trabalho / Orçamento</h2>
                <p className="text-sm text-zinc-500">B2 · Itens orçamentários vinculados ao projeto.</p>
              </div>
            </div>

            <details className="group rounded-2xl border border-zinc-200 bg-zinc-50/80 p-4 lg:w-full lg:max-w-3xl">
              <summary className="cursor-pointer list-none text-sm font-semibold text-zinc-800 marker:hidden">
                <span className="inline-flex items-center rounded-full border border-teal-200 bg-teal-50 px-4 py-2 text-teal-700 transition group-open:bg-teal-100">
                  Adicionar item orçamentário
                </span>
              </summary>

              <form action={adicionarOrcamentoAction} className="mt-4 grid gap-4 md:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm font-medium text-zinc-700">
                  ID Orc
                  <input name="idOrc" required className={inputClassName} />
                </label>

                <label className="flex flex-col gap-2 text-sm font-medium text-zinc-700">
                  Plano Gerencial
                  <input name="planoGerencial" className={inputClassName} />
                </label>

                <label className="flex flex-col gap-2 text-sm font-medium text-zinc-700 md:col-span-2">
                  Descrição
                  <textarea name="descricao" className={textareaClassName} />
                </label>

                <label className="flex flex-col gap-2 text-sm font-medium text-zinc-700">
                  Valor Ref.
                  <input
                    name="valorReferencia"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    className={inputClassName}
                  />
                </label>

                <label className="flex flex-col gap-2 text-sm font-medium text-zinc-700">
                  Valor Total
                  <input
                    name="valorTotal"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    className={inputClassName}
                  />
                </label>

                <div className="md:col-span-2">
                  <button
                    type="submit"
                    className="inline-flex h-11 items-center justify-center rounded-xl bg-teal-600 px-5 text-sm font-semibold text-white transition hover:bg-teal-700"
                  >
                    Salvar orçamento
                  </button>
                </div>
              </form>
            </details>
          </div>

          {projeto.orcamentos.length === 0 ? (
            <div className="mt-6 rounded-[1.5rem] border border-dashed border-zinc-300 bg-zinc-50 px-6 py-10 text-center text-sm text-zinc-500">
              Nenhum item orçamentário cadastrado
            </div>
          ) : (
            <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-zinc-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-zinc-200 text-sm">
                  <thead className="bg-zinc-50 text-left text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                    <tr>
                      <th className="px-4 py-4">Plano Gerencial</th>
                      <th className="px-4 py-4">Descrição</th>
                      <th className="px-4 py-4">Quantidade</th>
                      <th className="px-4 py-4">Valor Ref. (Moeda)</th>
                      <th className="px-4 py-4">Valor Total (Moeda)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 bg-white">
                    {projeto.orcamentos.map((item) => (
                      <tr key={item.id} className="align-top transition hover:bg-zinc-50/80">
                        <td className="px-4 py-4 font-medium text-zinc-900">
                          {item.planoGerencial ?? "Não informado"}
                        </td>
                        <td className="px-4 py-4 text-zinc-600">
                          {item.descricao ?? "Sem descrição"}
                        </td>
                        <td className="px-4 py-4 text-zinc-600">{item.quantidade ?? "—"}</td>
                        <td className="px-4 py-4 text-zinc-900">
                          {formatCurrency(item.valorReferencia)}
                        </td>
                        <td className="px-4 py-4 font-semibold text-zinc-950">
                          {formatCurrency(item.valorTotal)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>

        <section
          id="planejamento-atividades"
          className="rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-[0_20px_80px_-30px_rgba(15,23,42,0.25)] backdrop-blur lg:p-8"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-center gap-3">
              <ListTodo className="h-5 w-5 text-teal-700" />
              <div>
                <h2 className="text-xl font-semibold text-zinc-950">Planejamento de Atividades</h2>
                <p className="text-sm text-zinc-500">B3 · Metas e status de execução do projeto.</p>
              </div>
            </div>

            <details className="group rounded-2xl border border-zinc-200 bg-zinc-50/80 p-4 lg:w-full lg:max-w-3xl">
              <summary className="cursor-pointer list-none text-sm font-semibold text-zinc-800 marker:hidden">
                <span className="inline-flex items-center rounded-full border border-teal-200 bg-teal-50 px-4 py-2 text-teal-700 transition group-open:bg-teal-100">
                  Adicionar atividade
                </span>
              </summary>

              <form action={adicionarAtividadeAction} className="mt-4 grid gap-4 md:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm font-medium text-zinc-700">
                  Nº Meta
                  <input
                    name="numMeta"
                    type="number"
                    min="1"
                    required
                    className={inputClassName}
                  />
                </label>

                <label className="flex flex-col gap-2 text-sm font-medium text-zinc-700">
                  Status
                  <select name="status" defaultValue="Não iniciado" className={inputClassName}>
                    <option>Não iniciado</option>
                    <option>Em execução</option>
                    <option>Concluído</option>
                  </select>
                </label>

                <label className="flex flex-col gap-2 text-sm font-medium text-zinc-700 md:col-span-2">
                  Descrição
                  <textarea name="descricao" required className={textareaClassName} />
                </label>

                <label className="flex flex-col gap-2 text-sm font-medium text-zinc-700">
                  Valor Unitário
                  <input
                    name="valorUnitario"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    className={inputClassName}
                  />
                </label>

                <div className="flex items-end md:col-span-2">
                  <button
                    type="submit"
                    className="inline-flex h-11 items-center justify-center rounded-xl bg-teal-600 px-5 text-sm font-semibold text-white transition hover:bg-teal-700"
                  >
                    Salvar atividade
                  </button>
                </div>
              </form>
            </details>
          </div>

          {projeto.atividadesATER.length === 0 ? (
            <div className="mt-6 rounded-[1.5rem] border border-dashed border-zinc-300 bg-zinc-50 px-6 py-10 text-center text-sm text-zinc-500">
              Nenhuma atividade cadastrada
            </div>
          ) : (
            <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-zinc-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-zinc-200 text-sm">
                  <thead className="bg-zinc-50 text-left text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                    <tr>
                      <th className="px-4 py-4">Nº Meta</th>
                      <th className="px-4 py-4">Descrição</th>
                      <th className="px-4 py-4">Status</th>
                      <th className="px-4 py-4">Valor Unitário (Moeda)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 bg-white">
                    {projeto.atividadesATER.map((atividade) => (
                      <tr key={atividade.id} className="align-top transition hover:bg-zinc-50/80">
                        <td className="px-4 py-4 font-medium text-zinc-900">{atividade.numMeta}</td>
                        <td className="px-4 py-4 text-zinc-600">{atividade.descricao}</td>
                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getStatusBadgeClass(atividade.status)}`}
                          >
                            {atividade.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 font-semibold text-zinc-950">
                          {formatCurrency(atividade.valorUnitario)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
