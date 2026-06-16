import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, Building2, ClipboardList, Users } from "lucide-react";

import { AterSetupWarning } from "@/components/ater/setup-warning";
import { Header } from "@/components/dashboard/header";
import { Button, Card } from "@/components/ui";
import { isAterMissingTableError } from "@/lib/ater-runtime";
import { ATER_SOCIOBIO_TERRITORY_NAME } from "@/lib/constants/ater-sociobio";
import { AterSociobioService, type SiggaterDashboardData } from "@/lib/services/ater-sociobio.service";
import { firstSearchParam, type SearchParamValue } from "@/lib/search-params";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{
  tab?: SearchParamValue;
  focus?: SearchParamValue;
  q?: SearchParamValue;
}>;

const dashboardRoutes = {
  ufpas: "/ater-sociobio/dashboard/ufpas",
  organizacoes: "/ater-sociobio/dashboard/organizacoes",
  atendimentos: "/ater-sociobio/dashboard/atendimentos",
} as const;

function isDashboardRoute(value?: string): value is keyof typeof dashboardRoutes {
  return value === "ufpas" || value === "organizacoes" || value === "atendimentos";
}

function buildRedirectSuffix(params: { focus?: SearchParamValue; q?: SearchParamValue }) {
  const search = new URLSearchParams();
  const focus = firstSearchParam(params.focus);
  const q = firstSearchParam(params.q);
  if (focus) search.set("focus", focus);
  if (q) search.set("q", q);
  const value = search.toString();
  return value ? `?${value}` : "";
}

export default async function SiggaterDashboardPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const tab = firstSearchParam(resolvedSearchParams.tab);

  if (isDashboardRoute(tab)) {
    redirect(`${dashboardRoutes[tab]}${buildRedirectSuffix(resolvedSearchParams)}`);
  }

  let dashboardData: SiggaterDashboardData = {
    familias: [],
    organizacoes: [],
    atendimentos: [],
  };
  let setupMissing = false;

  try {
    dashboardData = await AterSociobioService.getDashboardData();
  } catch (error) {
    if (isAterMissingTableError(error)) {
      setupMissing = true;
    } else {
      throw error;
    }
  }

  const cards = [
    {
      title: "Métricas de UFPAs",
      description: "Diagnóstico familiar, vulnerabilidades, infraestrutura, comunidades e cadeias produtivas.",
      href: "/ater-sociobio/dashboard/ufpas",
      value: dashboardData.familias.length,
      label: "UFPAs cadastradas",
      icon: Users,
    },
    {
      title: "Métricas de Organizações",
      description: "Indicadores institucionais, práticas ambientais, representação e políticas públicas.",
      href: "/ater-sociobio/dashboard/organizacoes",
      value: dashboardData.organizacoes.length,
      label: "organizações",
      icon: Building2,
    },
    {
      title: "Métricas de Atendimentos",
      description: "Visitas técnicas, relatórios, eixos trabalhados, equipe e público atendido.",
      href: "/ater-sociobio/dashboard/atendimentos",
      value: dashboardData.atendimentos.length,
      label: "atendimentos válidos",
      icon: ClipboardList,
    },
  ];

  return (
    <div className="min-h-screen bg-[#f6f7f2]">
      <Header
        title="Métricas SIGGATER"
        description={`Painéis separados para leitura de UFPAs, organizações coletivas e atendimentos em ${ATER_SOCIOBIO_TERRITORY_NAME}.`}
        actions={
          <Link href="/ater-sociobio">
            <Button variant="secondary">Voltar ao SIGGATER</Button>
          </Link>
        }
      />

      <div className="p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          {setupMissing ? (
            <AterSetupWarning />
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              {cards.map((card) => {
                const Icon = card.icon;

                return (
                  <Link key={card.href} href={card.href}>
                    <Card className="h-full p-6 transition hover:border-emerald-300 hover:shadow-md">
                      <div className="flex items-start justify-between gap-4">
                        <div className="rounded-xl bg-emerald-50 p-3 text-emerald-700">
                          <Icon className="h-6 w-6" />
                        </div>
                        <ArrowRight className="h-5 w-5 text-zinc-400" />
                      </div>
                      <div className="mt-6">
                        <p className="text-3xl font-bold tracking-tight text-zinc-950">{card.value}</p>
                        <p className="mt-1 text-xs font-bold uppercase tracking-widest text-zinc-400">{card.label}</p>
                        <h2 className="mt-6 text-lg font-bold text-zinc-950">{card.title}</h2>
                        <p className="mt-2 text-sm font-medium leading-relaxed text-zinc-500">{card.description}</p>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
