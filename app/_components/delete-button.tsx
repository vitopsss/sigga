"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

interface DeleteButtonProps {
  id: string;
  apiEndpoint: string;
  onSuccess?: () => void;
  className?: string;
}

export function DeleteButton({
  id,
  apiEndpoint,
  onSuccess,
  className = "",
}: DeleteButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Tem certeza que deseja excluir este registro?")) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`${apiEndpoint}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erro ao deletar");
      }

      if (onSuccess) {
        onSuccess();
      } else {
        window.location.reload();
      }
    } catch (error) {
      console.error("Erro ao deletar:", error);
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border border-rose-200 bg-rose-50 text-rose-700 transition hover:bg-rose-100 disabled:opacity-50 ${className}`}
      title="Excluir"
    >
      <Trash2 className="h-4 w-4" strokeWidth={2} />
    </button>
  );
}
