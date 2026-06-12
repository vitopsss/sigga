"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

import { Button } from "@/components/ui";

export type TecnicoSnap = {
  nome: string | null;
  cpf: string | null;
};

export type TecnicoOption = {
  id: string;
  nome: string;
  cpf: string;
  conselho?: string | null;
};

interface TecnicosSelectorProps {
  options: TecnicoOption[];
  defaultValues?: TecnicoSnap[];
  max?: number;
  prefix: string; // Ex: 'agenteAter' ou 'indicadorAgenteAter'
}

export function TecnicosSelector({
  options,
  defaultValues = [],
  max = 3,
  prefix,
}: TecnicosSelectorProps) {
  const [selected, setSelected] = useState<TecnicoSnap[]>(
    defaultValues.filter((t) => t.nome && t.cpf)
  );
  const [adding, setAdding] = useState(false);

  function handleSelect(id: string) {
    const tecnico = options.find((t) => t.id === id);
    if (!tecnico) return;

    if (selected.length < max) {
      setSelected([...selected, { nome: tecnico.nome, cpf: tecnico.cpf }]);
    }
    setAdding(false);
  }

  function removeTecnico(index: number) {
    const next = [...selected];
    next.splice(index, 1);
    setSelected(next);
  }

  return (
    <div className="space-y-4">
      {selected.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {selected.map((tecnico, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3"
            >
              <div>
                <p className="text-sm font-bold text-emerald-950">{tecnico.nome}</p>
                <p className="text-xs font-medium text-emerald-700">{tecnico.cpf}</p>
              </div>
              <button
                type="button"
                onClick={() => removeTecnico(index)}
                className="rounded-lg p-1.5 text-emerald-600 transition hover:bg-emerald-100 hover:text-emerald-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {selected.length < max && !adding && (
        <Button
          type="button"
          variant="outline"
          onClick={() => setAdding(true)}
          className="w-full sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          Adicionar Técnico
        </Button>
      )}

      {adding && (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <select
            className="h-11 flex-1 rounded-xl border border-zinc-300 bg-white px-4 text-sm text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/15"
            onChange={(e) => handleSelect(e.target.value)}
            defaultValue=""
          >
            <option value="" disabled>
              Selecione um técnico...
            </option>
            {options.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.nome} ({opt.conselho ? `${opt.conselho} - ` : ""}{opt.cpf})
              </option>
            ))}
          </select>
          <Button type="button" variant="ghost" onClick={() => setAdding(false)}>
            Cancelar
          </Button>
        </div>
      )}

      {/* Hidden inputs to send to Server Action */}
      {Array.from({ length: max }).map((_, i) => (
        <div key={i} className="hidden">
          <input type="hidden" name={`${prefix}Nome${i + 1}`} value={selected[i]?.nome || ""} />
          <input type="hidden" name={`${prefix}Cpf${i + 1}`} value={selected[i]?.cpf || ""} />
        </div>
      ))}
    </div>
  );
}
