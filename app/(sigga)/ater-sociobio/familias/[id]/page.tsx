import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, Hash, MapPin, Users } from "lucide-react";

import { AterSetupWarning } from "@/components/ater/setup-warning";
import { Button, Card } from "@/components/ui";
import { ATER_SETUP_ERROR, isAterMissingTableError } from "@/lib/ater-runtime";
import { Header } from "@/components/dashboard/header";
import { AterSociobioService } from "@/lib/services/ater-sociobio.service";

type Params = Promise<{ id: string }>;

export const dynamic = "force-dynamic";

export default async function FamiliaDetailPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;
  
  let familia = null;
  let atendimentos: any[] = [];
  let error: string | null = null;
  let setupMissing = false;

  try {
    [familia, atendimentos] = await Promise.all([
      AterSociobioService.getFamiliaById(id),
      AterSociobioService.listAtendimentos({ familiaId: id })
    ]);
  } catch (e: any) {
    if (isAterMissingTableError(e)) {
      setupMissing = true;
    } else {
      console.error(e);
      error = e.message;
    }
  }

  if (error === ATER_SETUP_ERROR || setupMissing) {
    return (
      <div className="min-h-screen bg-zinc-50/50">
        <Header title="Erro de Configuração" />
        <div className="p-6 lg:p-8">
          <div className="mx-auto max-w-6xl">
            <AterSetupWarning />
          </div>
        </div>
      </div>
    );
  }

  if (!familia) {
    notFound();
  }

  const statusColors: Record<string, string> = {
    PENDENTE: "bg-amber-100 text-amber-700",
    RASCUNHO: "bg-blue-100 text-blue-700",
    CONCLUIDO: "bg-emerald-100 text-emerald-700",
    ENVIADO_SGA: "bg-purple-100 text-purple-700",
  };

  return (
    <div className="min-h-screen bg-zinc-50/50">
      <Header
        title={familia.nomeFamilia}
        description={familia.nomeResponsavel ? `Responsável: ${familia.nomeResponsavel}` : "Detalhes da família"}
        actions={
          <div className="flex gap-2">
            <Link href={`/ater-sociobio/familias/${familia.id}/editar`}>
              <Button variant="ghost">Editar família</Button>
            </Link>
            <Link href={`/ater-sociobio/atendimentos/nova?familiaId=${familia.id}`}>
              <Button variant="primary">Novo atendimento</Button>
            </Link>
          </div>
        }
      />

      <div className="p-6 lg:p-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-6">

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Card className="p-5">
            <p className="flex items-center gap-1 text-sm text-zinc-500">
              <Users className="h-4 w-4" />
              Membros
            </p>
            <p className="mt-1 text-2xl font-bold text-zinc-950">{familia.quantidadeMembros ?? "-"}</p>
          </Card>
          <Card className="p-5">
            <p className="flex items-center gap-1 text-sm text-zinc-500">
              <MapPin className="h-4 w-4" />
              Município
            </p>
            <p className="mt-1 text-2xl font-bold text-zinc-950">{familia.municipio ?? "-"}</p>
          </Card>
          <Card className="p-5">
            <p className="flex items-center gap-1 text-sm text-zinc-500">
              <Hash className="h-4 w-4" />
              NIS
            </p>
            <p className="mt-1 text-2xl font-bold text-zinc-950">{familia.nis ?? "-"}</p>
          </Card>
          <Card className="p-5">
            <p className="flex items-center gap-1 text-sm text-zinc-500">
              <Calendar className="h-4 w-4" />
              Atendimentos
            </p>
            <p className="mt-1 text-2xl font-bold text-zinc-950">{atendimentos.length}</p>
          </Card>
        </div>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-lg font-semibold text-slate-900">Dados da família</h2>
          <dl className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
            <div>
              <dt className="font-medium text-slate-500">Município</dt>
              <dd className="mt-1 text-slate-900">{familia.municipio ?? "-"}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-500">Comunidade</dt>
              <dd className="mt-1 text-slate-900">{familia.comunidade ?? "-"}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-500">UFPA</dt>
              <dd className="mt-1 text-slate-900">{familia.ufpa ?? "-"}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-500">Telefone</dt>
              <dd className="mt-1 text-slate-900">{familia.telefone ?? "-"}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-500">Código SGA</dt>
              <dd className="mt-1 text-slate-900">{familia.codigoSGA ?? "-"}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-500">Status do cadastro</dt>
              <dd className="mt-1 text-slate-900">{familia.statusCadastro ?? "-"}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-500">Atividade produtiva</dt>
              <dd className="mt-1 text-slate-900">{familia.atividadeProdutiva ?? "-"}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-500">Situação do fomento</dt>
              <dd className="mt-1 text-slate-900">{familia.situacaoFomento ?? "-"}</dd>
            </div>
            {familia.valorProjetoATER && (
              <div>
                <dt className="font-medium text-slate-500">Valor projeto ATER</dt>
                <dd className="mt-1 text-slate-900">R$ {Number(familia.valorProjetoATER).toLocaleString("pt-BR")}</dd>
              </div>
            )}
            {familia.valorFomento && (
              <div>
                <dt className="font-medium text-slate-500">Valor fomento</dt>
                <dd className="mt-1 text-slate-900">R$ {Number(familia.valorFomento).toLocaleString("pt-BR")}</dd>
              </div>
            )}
            <div>
              <dt className="font-medium text-slate-500">Status SGA</dt>
              <dd className="mt-1 text-slate-900">{familia.statusSGA ?? "-"}</dd>
            </div>
          </dl>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-lg font-semibold text-slate-900">Histórico de atendimentos</h2>
          {atendimentos.length === 0 ? (
            <p className="text-slate-500">Nenhum atendimento registrado para esta família.</p>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50 text-left">
                    <th className="px-6 py-4 font-medium text-slate-600">Visita</th>
                    <th className="px-6 py-4 font-medium text-slate-600">Data</th>
                    <th className="px-6 py-4 font-medium text-slate-600">Técnico</th>
                    <th className="px-6 py-4 font-medium text-slate-600">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {atendimentos.map((at) => {
                    const tecnicoNome = at.tecnicoRef?.nome ?? at.tecnico;
                    return (
                      <tr key={at.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 font-medium text-slate-900">#{at.numeroVisita}</td>
                        <td className="px-6 py-4 text-slate-600">
                          {at.data ? new Date(at.data).toLocaleDateString("pt-BR") : "-"}
                        </td>
                        <td className="px-6 py-4 text-slate-600">{tecnicoNome ?? "-"}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[at.statusRelatorio] ?? "bg-slate-100 text-slate-600"}`}
                          >
                            {at.statusRelatorio}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
        </div>
      </div>
    </div>
  );
}
