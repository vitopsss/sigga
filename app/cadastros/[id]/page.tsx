import Link from "next/link";
import { Mail, MapPin, Pencil, Phone, WalletCards } from "lucide-react";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";

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

  const cadastro = await prisma.pessoa.findUnique({
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
    <div className="flex min-h-screen bg-zinc-50">
      <Sidebar />

      <main className="flex-1 ml-64">
        <Header
          title={cadastro.nome}
          description={`Documento: ${cadastro.documento}`}
          actions={
            <div className="flex flex-wrap gap-3">
              <Link
                href={`/cadastros/${cadastro.id}/editar`}
                className="inline-flex h-11 items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-5 text-sm font-semibold text-amber-700 transition hover:bg-amber-100"
              >
                <Pencil className="h-4 w-4" />
                Editar
              </Link>
              <DeleteButton id={cadastro.id} />
            </div>
          }
        />

        <div className="p-6 lg:p-8 space-y-8">
          <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-sm backdrop-blur xl:p-10">
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
              </div>
            </div>
          </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-[0_20px_80px_-30px_rgba(15,23,42,0.25)] backdrop-blur sm:p-8">
            <h2 className="text-lg font-semibold tracking-tight text-zinc-950">
              Informações de contato
            </h2>
            <div className="mt-6 grid gap-4">
              <div className="flex items-start gap-3 rounded-2xl bg-zinc-50 p-4">
                <Mail className="mt-0.5 h-4 w-4 text-zinc-400" />
                <div>
                  <p className="text-sm font-medium text-zinc-700">Email</p>
                  <p className="mt-1 text-sm text-zinc-600">{cadastro.email ?? "Não informado"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-2xl bg-zinc-50 p-4">
                <Phone className="mt-0.5 h-4 w-4 text-zinc-400" />
                <div>
                  <p className="text-sm font-medium text-zinc-700">Telefone</p>
                  <p className="mt-1 text-sm text-zinc-600">{cadastro.telefone ?? "Não informado"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-2xl bg-zinc-50 p-4">
                <MapPin className="mt-0.5 h-4 w-4 text-zinc-400" />
                <div>
                  <p className="text-sm font-medium text-zinc-700">Endereço</p>
                  <p className="mt-1 text-sm text-zinc-600">{cadastro.endereco ?? "Não informado"}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-[0_20px_80px_-30px_rgba(15,23,42,0.25)] backdrop-blur sm:p-8">
            <h2 className="text-lg font-semibold tracking-tight text-zinc-950">
              Dados bancários
            </h2>
            <div className="mt-6 grid gap-4">
              <div className="flex items-start gap-3 rounded-2xl bg-zinc-50 p-4">
                <WalletCards className="mt-0.5 h-4 w-4 text-zinc-400" />
                <div>
                  <p className="text-sm font-medium text-zinc-700">Banco</p>
                  <p className="mt-1 text-sm text-zinc-600">{cadastro.banco ?? "Não informado"}</p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-zinc-50 p-4">
                  <p className="text-sm font-medium text-zinc-700">Agência</p>
                  <p className="mt-1 text-sm text-zinc-600">{cadastro.agencia ?? "Não informado"}</p>
                </div>
                <div className="rounded-2xl bg-zinc-50 p-4">
                  <p className="text-sm font-medium text-zinc-700">Conta</p>
                  <p className="mt-1 text-sm text-zinc-600">{cadastro.conta ?? "Não informado"}</p>
                </div>
              </div>
              <div className="rounded-2xl bg-zinc-50 p-4">
                <p className="text-sm font-medium text-zinc-700">PIX</p>
                <p className="mt-1 text-sm text-zinc-600">{cadastro.pix ?? "Não informado"}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  </div>
);
}
