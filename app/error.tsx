"use client";

import Link from "next/link";
import { useEffect } from "react";

function isDatabaseErrorMessage(message: string) {
  const normalized = message.toLowerCase();

  return (
    normalized.includes("can't reach database server") ||
    normalized.includes("cannot reach database server") ||
    normalized.includes("database server") ||
    normalized.includes("prismaclientinitializationerror") ||
    normalized.includes("failed to connect") ||
    normalized.includes("connection refused") ||
    normalized.includes("timeout")
  );
}

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const databaseError = isDatabaseErrorMessage(error.message);

  return (
    <div className="mx-auto flex min-h-screen max-w-3xl items-center px-6 py-10">
      <div className="w-full rounded-[2rem] border border-zinc-200 bg-white p-8 shadow-sm">
        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${databaseError ? "bg-amber-100 text-amber-800" : "bg-rose-100 text-rose-800"}`}>
          {databaseError ? "Banco indisponível" : "Erro do sistema"}
        </span>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-950">
          {databaseError ? "Não foi possível carregar os dados agora" : "Ocorreu um erro inesperado"}
        </h1>
        <p className="mt-3 text-sm leading-6 text-zinc-600">
          {databaseError
            ? "A aplicação continua no ar, mas a conexão com o banco falhou temporariamente. Tente novamente em instantes."
            : "A tela falhou durante o carregamento. Tente novamente ou volte para a página inicial."}
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center justify-center rounded-2xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-700"
          >
            Tentar novamente
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-2xl border border-zinc-300 px-5 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
          >
            Voltar ao painel
          </Link>
        </div>
      </div>
    </div>
  );
}
