import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Header } from "@/components/dashboard/header";
import { AterSociobioService } from "@/lib/services/ater-sociobio.service";
import { IndicadoresForm } from "@/components/ater-sociobio/familias/indicadores-form";
import { salvarIndicadoresUfpa } from "@/lib/actions/indicadores";

export const dynamic = "force-dynamic";

export default async function IndicadoresFamiliaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const familia = await AterSociobioService.getFamiliaById(id);

  if (!familia) {
    notFound();
  }

  // Fetch existing indicadores if any
  const indicadores = familia.indicadores;

  const defaultValues = {
    projeto: familia.projeto ?? "",
    tecnico: familia.tecnico ?? "",
    dataCadastro: familia.dataCadastro ? new Date(familia.dataCadastro).toISOString().split('T')[0] : "",
    ...indicadores,
  };

  // Convert Decimal to Number for Client Component
  const safeDefaultValues: any = { ...defaultValues };
  if (safeDefaultValues.valorBrutoProducaoUltimos12Meses && typeof safeDefaultValues.valorBrutoProducaoUltimos12Meses === "object") {
    safeDefaultValues.valorBrutoProducaoUltimos12Meses = Number(safeDefaultValues.valorBrutoProducaoUltimos12Meses);
  }

  async function handleSubmit(data: any) {
    "use server";
    const result = await salvarIndicadoresUfpa(id, data);
    if (result.error) {
      throw new Error(result.error);
    }
    redirect(`/ater-sociobio/familias/${id}`);
  }

  return (
    <div className="min-h-screen bg-zinc-50/50">
      <Header
        title="Indicadores da UFPA"
        description={`Preenchimento dos indicadores para ${familia.nomeFamilia}`}
        actions={
          <Link href={`/ater-sociobio/familias/${id}`} className="text-sm font-bold text-zinc-500 hover:text-zinc-700">
            Voltar para detalhes
          </Link>
        }
      />

      <div className="p-6 lg:p-8">
        <div className="mx-auto max-w-6xl">
          <section className="rounded-[2.5rem] border border-zinc-200 bg-white p-6 shadow-sm sm:p-10 lg:p-12">
            <IndicadoresForm 
              familiaId={id} 
              defaultValues={safeDefaultValues} 
              onSubmit={handleSubmit} 
            />
          </section>
        </div>
      </div>
    </div>
  );
}
