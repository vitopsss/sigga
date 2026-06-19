"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DynamicLists({ defaultPatrimonios = [], defaultAtividades = [] }: any) {
  const { register, control, watch } = useForm({
    defaultValues: {
      patrimonios: defaultPatrimonios,
      atividadesProdutivas: defaultAtividades
    }
  });

  const { fields: patrimonios, append: appendPatrimonio, remove: removePatrimonio } = useFieldArray({
    control,
    name: "patrimonios"
  });

  const { fields: atividades, append: appendAtividade, remove: removeAtividade } = useFieldArray({
    control,
    name: "atividadesProdutivas"
  });

  const inputClassName =
    "mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15";

  const patrimoniosWatch = watch("patrimonios");
  const atividadesWatch = watch("atividadesProdutivas");

  return (
    <div className="space-y-12">
      <section>
        <div className="mb-8">
          <h2 className="text-xl font-bold text-zinc-900">Patrimônios</h2>
          <p className="mt-2 text-sm text-zinc-500">Bens da unidade familiar.</p>
        </div>
        <div className="space-y-4">
          {patrimonios.map((item, index) => (
            <div key={item.id} className="flex gap-4 items-end">
              <label className="block w-32">
                <span className="text-sm font-medium text-zinc-700">Quantidade</span>
                <input type="number" {...register(`patrimonios.${index}.quantidade`)} className={inputClassName} />
              </label>
              <label className="block w-48">
                <span className="text-sm font-medium text-zinc-700">Unidade</span>
                <input type="text" {...register(`patrimonios.${index}.unidade`)} className={inputClassName} />
              </label>
              <label className="block flex-1">
                <span className="text-sm font-medium text-zinc-700">Descrição</span>
                <input type="text" {...register(`patrimonios.${index}.descricao`)} className={inputClassName} />
              </label>
              <label className="flex items-center gap-2 w-32 pb-4 text-sm font-medium">
                <input type="checkbox" {...register(`patrimonios.${index}.atividadePrincipal`)} className="h-4 w-4" /> Principal
              </label>
              <Button type="button" variant="destructive" onClick={() => removePatrimonio(index)} className="mb-1">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={() => appendPatrimonio({ quantidade: 1, unidade: "", descricao: "" })}>
            <Plus className="mr-2 h-4 w-4" /> Adicionar Patrimônio
          </Button>
        </div>
        <input type="hidden" name="patrimonios_json" value={JSON.stringify(patrimoniosWatch)} />
      </section>

      <section>
        <div className="mb-8">
          <h2 className="text-xl font-bold text-zinc-900">Atividades Produtivas</h2>
          <p className="mt-2 text-sm text-zinc-500">Produção anual da unidade familiar.</p>
        </div>
        <div className="space-y-4">
          {atividades.map((item, index) => (
            <div key={item.id} className="flex gap-4 items-end">
              <label className="block flex-1">
                <span className="text-sm font-medium text-zinc-700">Atividade</span>
                <input type="text" {...register(`atividadesProdutivas.${index}.atividade`)} className={inputClassName} />
              </label>
              <label className="block w-48">
                <span className="text-sm font-medium text-zinc-700">Produção Anual</span>
                <input type="number" {...register(`atividadesProdutivas.${index}.producaoAnual`)} className={inputClassName} />
              </label>
              <label className="block w-48">
                <span className="text-sm font-medium text-zinc-700">Unidade</span>
                <input type="text" {...register(`atividadesProdutivas.${index}.unidade`)} className={inputClassName} />
              </label>
              <label className="flex items-center gap-2 w-32 pb-4 text-sm font-medium">
                <input type="checkbox" {...register(`atividadesProdutivas.${index}.atividadePrincipal`)} className="h-4 w-4" /> Principal
              </label>
              <Button type="button" variant="destructive" onClick={() => removeAtividade(index)} className="mb-1">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={() => appendAtividade({ producaoAnual: 0, unidade: "", atividade: "" })}>
            <Plus className="mr-2 h-4 w-4" /> Adicionar Atividade
          </Button>
        </div>
        <input type="hidden" name="atividadesProdutivas_json" value={JSON.stringify(atividadesWatch)} />
      </section>
    </div>
  );
}
