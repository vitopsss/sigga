import Link from "next/link";
import {
  Building2,
  ContactRound,
  Eye,
  Mail,
  Pencil,
  Phone,
  Plus,
  Search,
  UserRound,
} from "lucide-react";

import { prisma } from "@/lib/prisma";

import { DeleteButton } from "./delete-button";

type SearchParams = Promise<{
  busca?: string;
}>;

function getTypeClasses(tipo: string) {
  const palette: Record<string, string> = {
    PF: "bg-emerald-500/15 text-emerald-700 ring-emerald-600/20",
    PJ: "bg-sky-500/15 text-sky-700 ring-sky-700/20",
    PUBLICO: "bg-amber-500/15 text-amber-700 ring-amber-600/20",
    PRIVADO: "bg-violet-500/15 text-violet-700 ring-violet-700/20",
  };

  return palette[tipo] ?? "bg-zinc-500/10 text-zinc-700 ring-zinc-700/10";
}

function getTypeLabel(tipo: string) {
  const labels: Record<string, string> = {
    PF: "PF",
    PJ: "PJ",
    PUBLICO: "Publico",
    PRIVADO: "Privado",
  };

  return labels[tipo] ?? tipo;
}

export default async function CadastrosPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { busca = "" } = await searchParams;
  const buscaNormalizada = busca.trim();

  const cadastros = await prisma.cadastroUnico.findMany({
    where: buscaNormalizada
      ? {
          OR: [
            {
              nome: {
                contains: buscaNormalizada,
                mode: "insensitive",
              },
            },
            {
              documento: {
                contains: buscaNormalizada,
                mode: "insensitive",
              },
            },
          ],
        }
      : undefined,
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      nome: true,
      documento: true,
      tipo: true,
      email: true,
      telefone: true,
    },
  });

  return (
    <div className="bg-[radial-gradient(circle_at_top_left,_rgba(20,184,166,0.14),_transparent_32%)]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-8 lg:px-10 lg:py-10">
        <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-[0_20px_80px_-30px_rgba(15,23,42,0.35)] backdrop-blur xl:p-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <span className="inline-flex items-center rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-teal-700">
                Cadastro Unico
              </span>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">
                Registros centralizados de pessoas e instituicoes.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-600 sm:text-lg">
                Busque por nome ou documento e mantenha a base cadastral organizada para todo o sistema.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="rounded-[1.5rem] border border-zinc-200/80 bg-zinc-950 px-5 py-4 text-white shadow-lg shadow-zinc-950/10">
                <p className="text-sm text-zinc-400">Total de registros</p>
                <p className="mt-2 text-3xl font-semibold tracking-tight">{cadastros.length}</p>
              </div>

              <Link
                href="/cadastros/novo"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-teal-600 px-5 text-sm font-semibold text-white transition hover:bg-teal-500"
              >
                <Plus className="h-4 w-4" />
                Novo Registro
              </Link>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/70 bg-white/90 shadow-[0_20px_80px_-30px_rgba(15,23,42,0.25)] backdrop-blur">
          <div className="flex flex-col gap-4 border-b border-zinc-200/80 px-6 py-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-zinc-950">
                Lista de cadastros
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                Nome, documento, tipo de cadastro, contatos e acoes.
              </p>
            </div>

            <form action="/cadastros" method="GET" className="w-full max-w-md">
              <label className="relative block">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <input
                  type="search"
                  name="busca"
                  defaultValue={buscaNormalizada}
                  placeholder="Buscar por nome ou documento"
                  className="h-12 w-full rounded-full border border-zinc-200 bg-zinc-50 pl-11 pr-4 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                />
              </label>
            </form>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-zinc-200/80">
              <thead className="bg-zinc-50/80">
                <tr className="text-left text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  <th className="px-6 py-4 sm:px-8">Nome</th>
                  <th className="px-6 py-4">Documento</th>
                  <th className="px-6 py-4">Tipo</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Telefone</th>
                  <th className="px-6 py-4 text-right">Acoes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 bg-white">
                {cadastros.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-14 sm:px-8">
                      <div className="flex flex-col items-center justify-center gap-3 text-center">
                        <div className="rounded-full bg-zinc-100 p-4 text-zinc-500">
                          <ContactRound className="h-6 w-6" />
                        </div>
                        <p className="text-base font-medium text-zinc-700">
                          Nenhum cadastro encontrado.
                        </p>
                        <p className="max-w-md text-sm text-zinc-500">
                          Ajuste a busca ou crie um novo registro para centralizar fornecedores, beneficiarios e colaboradores.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  cadastros.map((cadastro) => (
                    <tr key={cadastro.id} className="transition-colors hover:bg-zinc-50/80">
                      <td className="px-6 py-5 align-middle sm:px-8">
                        <div className="flex items-center gap-3">
                          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-700">
                            {cadastro.tipo === "PF" ? (
                              <UserRound className="h-5 w-5" strokeWidth={2} />
                            ) : (
                              <Building2 className="h-5 w-5" strokeWidth={2} />
                            )}
                          </span>
                          <span className="font-medium text-zinc-950">{cadastro.nome}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm font-medium text-zinc-700">
                        {cadastro.documento}
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${getTypeClasses(
                            cadastro.tipo,
                          )}`}
                        >
                          {getTypeLabel(cadastro.tipo)}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-sm text-zinc-600">
                        <span className="inline-flex items-center gap-2">
                          <Mail className="h-4 w-4 text-zinc-400" strokeWidth={2} />
                          {cadastro.email ?? "Nao informado"}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-sm text-zinc-600">
                        <span className="inline-flex items-center gap-2">
                          <Phone className="h-4 w-4 text-zinc-400" strokeWidth={2} />
                          {cadastro.telefone ?? "Nao informado"}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/cadastros/${cadastro.id}`}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-600 transition hover:bg-zinc-50"
                            aria-label="Visualizar registro"
                            title="Visualizar registro"
                          >
                            <Eye className="h-4 w-4" strokeWidth={2} />
                          </Link>
                          <Link
                            href={`/cadastros/${cadastro.id}/editar`}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-amber-200 bg-amber-50 text-amber-700 transition hover:bg-amber-100"
                            aria-label="Editar registro"
                            title="Editar registro"
                          >
                            <Pencil className="h-4 w-4" strokeWidth={2} />
                          </Link>
                          <DeleteButton id={cadastro.id} />
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
