"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";

import { deleteCadastro } from "./actions";

export function DeleteButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    const confirmed = window.confirm(
      "Tem certeza que deseja excluir este registro?",
    );

    if (!confirmed) {
      return;
    }

    startTransition(async () => {
      await deleteCadastro(id);
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-rose-200 bg-rose-50 text-rose-600 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
      aria-label="Excluir registro"
      title="Excluir registro"
    >
      <Trash2 className="h-4 w-4" strokeWidth={2} />
    </button>
  );
}
