import Link from "next/link";
import { notFound } from "next/navigation";

import { AterSetupWarning } from "@/components/ater/setup-warning";
import { Button } from "@/components/ui";
import { ATER_SETUP_ERROR } from "@/lib/ater-runtime";
import { ATER_SOCIOBIO_TERRITORY_NAME } from "@/lib/constants/ater-sociobio";
import { AterSociobioService } from "@/lib/services/ater-sociobio.service";

export const dynamic = "force-dynamic";

const statusColors: Record<string, string> = {
  PENDENTE: "bg-amber-100 text-amber-700",
  RASCUNHO: "bg-blue-100 text-blue-700",
  CONCLUIDO: "bg-emerald-100 text-emerald-700",
  ENVIADO_SGA: "bg-purple-100 text-purple-700",
};

export default async function AtendimentoDetailPage({
  params,
}: {
  params: Promise<{ atendimentoId: string }>;
}) {
  const { atendimentoId } = await params;
  
  let atendimento = null;
  let error: string | null = null;

  try {
    atendimento = await AterSociobioService.getAtendimentoById(atendimentoId);
  } catch (e: any) {
    console.error(e);
    error = e.message;
  }

  if (error === ATER_SETUP_ERROR) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-5xl flex-col gap-6">
          <div className="flex items-center gap-4">
            <Link href="/ater-sociobio/atendimentos" className="text-sm text-slate-500 hover:text-slate-700">
              Voltar
            </Link>
          </div>

          <AterSetupWarning />
        </div>
      </div>
    );
  }

  if (!atendimento) {
    notFound();
  }

  const renderEixo = (eixoData: any, label: string) => {
    if (!eixoData || Object.keys(eixoData).length === 0) return null;

    return (
      <section className="rounded-3xl border border-slate-200 bg-slate-50/80 p-6">
        <h3 className="mb-4 text-base font-semibold capitalize text-slate-900">{label}</h3>
        <dl className="grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
          <div>
            <dt className="font-medium text-slate-500">Tipo de ação</dt>
            <dd className="mt-1 text-slate-900">{eixoData.tipoAcao ?? "-"}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-500">Etapa</dt>
            <dd className="mt-1 text-slate-900">{eixoData.etapa ?? "-"}</dd>
          </div>
          <div className="md:col-span-2">
            <dt className="font-medium text-slate-500">Impactos anteriores</dt>
            <dd className="mt-1 text-slate-900">{eixoData.impactosAnteriores ?? "-"}</dd>
          </div>
          <div className="md:col-span-2">
            <dt className="font-medium text-slate-500">Desenvolvimento</dt>
            <dd className="mt-1 text-slate-900">{eixoData.desenvolvimento ?? "-"}</dd>
          </div>
          <div className="md:col-span-2">
            <dt className="font-medium text-slate-500">Recomendações</dt>
            <dd className="mt-1 text-slate-900">{eixoData.recomendacoes ?? "-"}</dd>
          </div>
        </dl>
      </section>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <div className="flex items-center gap-4">
          <Link href="/ater-sociobio/atendimentos" className="text-sm text-slate-500 hover:text-slate-700">
            Voltar
          </Link>
        </div>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">ATER Sociobio</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
                Visita #{atendimento.numeroVisita}
              </h1>
              <p className="mt-1 text-slate-600">
                {atendimento.data ? new Date(atendimento.data).toLocaleDateString("pt-BR") : "Sem data"}
              </p>
              <p className="mt-1 text-sm text-slate-500">{ATER_SOCIOBIO_TERRITORY_NAME}</p>
            </div>
            <div className="flex flex-col items-start gap-3 lg:items-end">
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${statusColors[atendimento.statusRelatorio ?? ""] ?? "bg-slate-100 text-slate-600"}`}>
                {atendimento.statusRelatorio}
              </span>
              <Link href={`/ater-sociobio/atendimentos/${atendimentoId}/pdf`} target="_blank">
                <Button variant="primary">Baixar PDF</Button>
              </Link>
              <Link href={`/ater-sociobio/atendimentos/${atendimentoId}/editar`}>
                <Button variant="ghost">Editar atendimento</Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-lg font-semibold text-slate-900">Dados do atendimento</h2>
          <dl className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
            <div>
              <dt className="font-medium text-slate-500">Família</dt>
              <dd className="mt-1 text-slate-900">{atendimento.familia?.nomeFamilia ?? "-"}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-500">Município</dt>
              <dd className="mt-1 text-slate-900">{atendimento.familia?.municipio ?? "-"}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-500">Técnico</dt>
              <dd className="mt-1 text-slate-900">{atendimento.tecnicoRef?.nome ?? atendimento.tecnico ?? "-"}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-500">Houve atendimento</dt>
              <dd className="mt-1 text-slate-900">{atendimento.houveAtendimento ? "Sim" : "Não"}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-500">Projeto</dt>
              <dd className="mt-1 text-slate-900">{atendimento.projetoTitulo ?? atendimento.projetoId ?? "-"}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-500">Enviado SGA</dt>
              <dd className="mt-1 text-slate-900">{atendimento.enviadoSGA ? "Sim" : "Não"}</dd>
            </div>
          </dl>
        </section>

        <div className="flex flex-col gap-6">
          {renderEixo(atendimento.eixoProdutivo, "Eixo Produtivo")}
          {renderEixo(atendimento.eixoSocial, "Eixo Social")}
          {renderEixo(atendimento.eixoAmbiental, "Eixo Ambiental")}
        </div>
      </div>
    </div>
  );
}
