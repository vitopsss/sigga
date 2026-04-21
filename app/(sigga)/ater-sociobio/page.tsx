import Link from "next/link";
import { Users } from "lucide-react";

import { AterSetupWarning } from "@/components/ater/setup-warning";
import { Badge, Card } from "@/components/ui";
import { isAterMissingTableError } from "@/lib/ater-runtime";
import { ATER_SOCIOBIO_TERRITORY_NAME } from "@/lib/constants/ater-sociobio";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AterSociobioPage() {
  let totalFamilias = 0;
  let totalAtendimentos = 0;
  let totalTecnicos = 0;
  let totalMunicipios = 0;
  let setupMissing = false;

  try {
    [totalFamilias, totalAtendimentos, totalTecnicos] = await Promise.all([
      prisma.familiaAter.count(),
      prisma.atendimento.count(),
      prisma.tecnico.count({ where: { ativo: true } }),
    ]);

    const municipios = await prisma.familiaAter.groupBy({
      by: ["municipio"],
      _count: { _all: true },
    });

    totalMunicipios = municipios.length;
  } catch (error) {
    if (isAterMissingTableError(error)) {
      setupMissing = true;
    } else {
      throw error;
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/50 via-slate-50 to-teal-50/30">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10 lg:py-10">
        <div className="mb-8">
          <Badge variant="success" className="w-fit">
            ATER Sociobio
          </Badge>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
            Acompanhamento Territorial
          </h1>
          <p className="mt-2 text-slate-600">
            Acompanhamento técnico de famílias do lote {ATER_SOCIOBIO_TERRITORY_NAME}, com foco em ATER Sociobiodiversidade.
          </p>
        </div>

        {setupMissing && <AterSetupWarning className="mb-8" />}

        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                <Users className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-zinc-500">Famílias</p>
                <p className="mt-1 text-2xl font-bold text-zinc-950">{totalFamilias}</p>
              </div>
            </div>
          </Card>
          <Card className="p-5">
            <p className="text-sm text-zinc-500">Municípios</p>
            <p className="mt-1 text-2xl font-bold text-zinc-950">{totalMunicipios}</p>
          </Card>
          <Card className="p-5">
            <p className="text-sm text-zinc-500">Atendimentos</p>
            <p className="mt-1 text-2xl font-bold text-zinc-950">{totalAtendimentos}</p>
          </Card>
          <Card className="p-5">
            <p className="text-sm text-zinc-500">Técnicos ativos</p>
            <p className="mt-1 text-2xl font-bold text-zinc-950">{totalTecnicos}</p>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[
            { label: "Famílias", href: "/ater-sociobio/familias", desc: `Cadastro e acompanhamento de famílias da ${ATER_SOCIOBIO_TERRITORY_NAME}` },
            { label: "Atendimentos", href: "/ater-sociobio/atendimentos", desc: "Visitas técnicas e histórico do lote" },
            { label: "Controle de Processos", href: "/ater-sociobio/controle", desc: "Fluxo SGA por família da FLONA" },
            { label: "Fomento", href: "/ater-sociobio/fomento", desc: "Apoio financeiro e contrapartida por família" },
            { label: "Técnicos", href: "/ater-sociobio/tecnicos", desc: "Equipe de campo da FLONA de Tefé" },
            { label: "Índices", href: "/ater-sociobio/indices", desc: "Visão por município do lote" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-emerald-300 hover:shadow-md"
            >
              <span className="text-base font-medium text-slate-700">{item.label}</span>
              <p className="mt-1 text-sm text-slate-500">{item.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
