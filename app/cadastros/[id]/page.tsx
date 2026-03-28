import Link from "next/link";
import { ArrowLeft, Mail, MapPin, Pencil, Phone, WalletCards } from "lucide-react";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";

import { DeleteButton } from "../delete-button";

function getTypeClasses(tipo: string) {
  const palette: Record<string, string> = {
    PF: "bg-emerald-500/15 text-emerald-700 ring-emerald-600/20",
    PJ: "bg-sky-500/15 text-sky-700 ring-sky-700/20",
    PUBLICO: "bg-amber-500/15 text-amber-700 ring-amber-600/20",
    PRIVADO: "bg-violet-500/15 text-violet-700 ring-violet-700/20",
  };

  return palette[tipo] ?? "bg-zinc-500/10 text-zinc-700 ring-zinc-700/10";
}

export default async function CadastroDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const cadastro = await prisma.cadastroUnico.findUnique({
    where: { id },
    select: {
      id: true,
      tipo: true,
      documento: true,
      nome: true,
      email: true,
      telefone: true,
      endereco: true,
      banco: true,
      agencia: true,
      conta: true,
      pix: true,
    },
  });

  if (!cadastro) {
    notFound();
  }

  return (
    <div className="bg-[radial-gradient(circle_at_top_left,_rgba(20,184,166,0.12),_transparent_30%)]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-8 lg:px-10 lg:py-10">
        <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-[0_20px_80px_-30px_rgba(15,23,42,0.35)] backdrop-blur xl:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ring-1 ring-inset ${getTypeClasses(
                  cadastro.tipo,
                )}`}
              >
                {cadastro.tipo}
              </span>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">
                {cadastro.nome}
              </h1>
              <p className="mt-3 text-base text-zinc-600">
                Documento: <span className="font-medium text-zinc-900">{cadastro.documento}</span>
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/cadastros"
                className="inline-flex h-11 items-center gap-2 rounded-full border border-zinc-200 bg-white px-5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Link>
              <Link
                href={`/cadastros/${cadastro.id}/editar`}
                className="inline-flex h-11 items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-5 text-sm font-semibold text-amber-700 transition hover:bg-amber-100"
              >
                <Pencil className="h-4 w-4" />
                Editar
              </Link>
              <DeleteButton id={cadastro.id} />
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-[0_20px_80px_-30px_rgba(15,23,42,0.25)] backdrop-blur sm:p-8">
            <h2 className="text-lg font-semibold tracking-tight text-zinc-950">
              Informacoes de contato
            </h2>
            <div className="mt-6 grid gap-4">
              <div className="flex items-start gap-3 rounded-2xl bg-zinc-50 p-4">
                <Mail className="mt-0.5 h-4 w-4 text-zinc-400" />
                <div>
                  <p className="text-sm font-medium text-zinc-700">Email</p>
                  <p className="mt-1 text-sm text-zinc-600">{cadastro.email ?? "Nao informado"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-2xl bg-zinc-50 p-4">
                <Phone className="mt-0.5 h-4 w-4 text-zinc-400" />
                <div>
                  <p className="text-sm font-medium text-zinc-700">Telefone</p>
                  <p className="mt-1 text-sm text-zinc-600">{cadastro.telefone ?? "Nao informado"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-2xl bg-zinc-50 p-4">
                <MapPin className="mt-0.5 h-4 w-4 text-zinc-400" />
                <div>
                  <p className="text-sm font-medium text-zinc-700">Endereco</p>
                  <p className="mt-1 text-sm text-zinc-600">{cadastro.endereco ?? "Nao informado"}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-[0_20px_80px_-30px_rgba(15,23,42,0.25)] backdrop-blur sm:p-8">
            <h2 className="text-lg font-semibold tracking-tight text-zinc-950">
              Dados bancarios
            </h2>
            <div className="mt-6 grid gap-4">
              <div className="flex items-start gap-3 rounded-2xl bg-zinc-50 p-4">
                <WalletCards className="mt-0.5 h-4 w-4 text-zinc-400" />
                <div>
                  <p className="text-sm font-medium text-zinc-700">Banco</p>
                  <p className="mt-1 text-sm text-zinc-600">{cadastro.banco ?? "Nao informado"}</p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-zinc-50 p-4">
                  <p className="text-sm font-medium text-zinc-700">Agencia</p>
                  <p className="mt-1 text-sm text-zinc-600">{cadastro.agencia ?? "Nao informado"}</p>
                </div>
                <div className="rounded-2xl bg-zinc-50 p-4">
                  <p className="text-sm font-medium text-zinc-700">Conta</p>
                  <p className="mt-1 text-sm text-zinc-600">{cadastro.conta ?? "Nao informado"}</p>
                </div>
              </div>
              <div className="rounded-2xl bg-zinc-50 p-4">
                <p className="text-sm font-medium text-zinc-700">PIX</p>
                <p className="mt-1 text-sm text-zinc-600">{cadastro.pix ?? "Nao informado"}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
