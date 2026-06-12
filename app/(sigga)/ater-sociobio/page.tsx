import Link from "next/link";
import { BarChart3, Building2, ClipboardList, KeyRound, Leaf, Users } from "lucide-react";

import { AterSetupWarning } from "@/components/ater/setup-warning";
import { Card } from "@/components/ui";
import { isAterMissingTableError } from "@/lib/ater-runtime";
import {
  ATER_SOCIOBIO_MODULE_NAME,
  ATER_SOCIOBIO_STATUS_RASCUNHO,
  ATER_SOCIOBIO_TERRITORY_NAME,
} from "@/lib/constants/ater-sociobio";
import { prisma } from "@/lib/prisma";
import { Header } from "@/components/dashboard/header";

export const dynamic = "force-dynamic";

export default async function AterSociobioPage() {
  let totalFamilias = 0;
  let totalAtendimentos = 0;
  let totalTecnicos = 0;
  let totalMunicipios = 0;
  let totalOrganizacoes = 0;
  let setupMissing = false;

  try {
    [totalFamilias, totalAtendimentos, totalTecnicos, totalOrganizacoes] = await Promise.all([
      prisma.familiaAter.count(),
      prisma.atendimento.count({ where: { statusRelatorio: { not: ATER_SOCIOBIO_STATUS_RASCUNHO } } }),
      prisma.tecnico.count({ where: { ativo: true } }),
      prisma.organizacaoColetiva.count(),
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
    <div className="min-h-screen bg-zinc-50/50">
      <Header
        title={ATER_SOCIOBIO_MODULE_NAME}
        description={`Acompanhamento técnico de UFPAs, organizações coletivas, visitas e relatórios nas atividades de ${ATER_SOCIOBIO_TERRITORY_NAME}`}
      />

      <div className="p-6 lg:p-8">
        {setupMissing && <AterSetupWarning className="mb-8" />}

        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-5">
          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                <Users className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-zinc-500">UFPAs</p>
                <p className="mt-1 text-2xl font-bold text-zinc-950">{totalFamilias}</p>
              </div>
            </div>
          </Card>
          <Card className="p-5">
            <p className="text-sm text-zinc-500">Municípios</p>
            <p className="mt-1 text-2xl font-bold text-zinc-950">{totalMunicipios}</p>
          </Card>
          <Card className="p-5">
            <p className="text-sm text-zinc-500">Atendimentos válidos</p>
            <p className="mt-1 text-2xl font-bold text-zinc-950">{totalAtendimentos}</p>
          </Card>
          <Card className="p-5">
            <p className="text-sm text-zinc-500">Organizações</p>
            <p className="mt-1 text-2xl font-bold text-zinc-950">{totalOrganizacoes}</p>
          </Card>
          <Card className="p-5">
            <p className="text-sm text-zinc-500">Técnicos ativos</p>
            <p className="mt-1 text-2xl font-bold text-zinc-950">{totalTecnicos}</p>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[
            { label: "Painel", href: "/ater-sociobio/dashboard", desc: "Indicadores interativos de diagnóstico, território e prioridades", icon: BarChart3 },
            { label: "UFPAs", href: "/ater-sociobio/familias", desc: `Cadastro e acompanhamento de UFPAs em ${ATER_SOCIOBIO_TERRITORY_NAME}`, icon: Users },
            { label: "Organizações coletivas", href: "/ater-sociobio/organizacoes", desc: "Associações, cooperativas e grupos vinculados às UFPAs", icon: Building2 },
            { label: "Atendimentos", href: "/ater-sociobio/atendimentos", desc: "Visitas técnicas, relatório individual e fluxo de análise", icon: ClipboardList },
            { label: "Técnicos", href: "/ater-sociobio/tecnicos", desc: "Equipe de campo e responsáveis técnicos", icon: Leaf },
            { label: "Acessos", href: "/ater-sociobio/acessos", desc: "Perfis de administração, coordenação e operação do SIGGATER", icon: KeyRound },
          ].map((item) => {
            const Icon = item.icon;

            return (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:border-emerald-300 hover:shadow-md"
            >
              <span className="flex items-center gap-2 text-base font-medium text-slate-700">
                {Icon ? <Icon className="h-4 w-4 text-emerald-700" /> : null}
                {item.label}
              </span>
              <p className="mt-1 text-sm text-slate-500">{item.desc}</p>
            </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
