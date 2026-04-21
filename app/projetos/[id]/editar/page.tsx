import { notFound } from "next/navigation";
import { Pencil } from "lucide-react";

import { prisma } from "@/lib/prisma";

import { salvarProjeto } from "../../actions";
import { FormProjeto } from "../../form-projeto";

function toDateInput(date: Date | null) {
  if (!date) return null;
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default async function EditarProjetoPage({
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
    <div className="bg-[radial-gradient(circle_at_top_right,_rgba(245,158,11,0.12),_transparent_34%)]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-8 lg:px-10 lg:py-10">
        <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-[0_20px_80px_-30px_rgba(15,23,42,0.35)] backdrop-blur xl:p-10">
          <div className="flex items-start gap-4">
            <span className="rounded-2xl bg-amber-50 p-3 text-amber-700">
              <Pencil className="h-5 w-5" strokeWidth={2} />
            </span>
            <div>
              <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-amber-700">
                Editar Projeto
              </span>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
                Atualize os dados do projeto
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-600 sm:text-lg">
                Revise os campos abaixo e salve as alterações deste projeto.
              </p>
            </div>
          </div>
        </section>

        <FormProjeto
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          action={salvarProjeto as any}
          projeto={{
            ...projeto,
            valorTotal: String(projeto.valorTotal),
            vigenciaInicial: toDateInput(projeto.vigenciaInicial) ?? "",
            vigenciaFinal: toDateInput(projeto.vigenciaFinal),
          }}
        />
      </div>
    </div>
  );
}
