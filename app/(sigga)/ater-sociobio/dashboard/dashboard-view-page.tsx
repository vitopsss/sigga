import Link from "next/link";
import { Suspense } from "react";

import { AterSetupWarning } from "@/components/ater/setup-warning";
import { Header } from "@/components/dashboard/header";
import { Button } from "@/components/ui";
import { isAterMissingTableError } from "@/lib/ater-runtime";
import { ATER_SOCIOBIO_TERRITORY_NAME } from "@/lib/constants/ater-sociobio";
import { AterSociobioService, type SiggaterDashboardData } from "@/lib/services/ater-sociobio.service";

import { SiggaterDashboardClient, type DashboardView } from "./dashboard-client";

const viewMeta: Record<DashboardView, {
  title: string;
  description: string;
  listHref: string;
  listLabel: string;
}> = {
  ufpas: {
    title: "Métricas de UFPAs",
    description: `Diagnóstico, vulnerabilidades e distribuição territorial das UFPAs em ${ATER_SOCIOBIO_TERRITORY_NAME}.`,
    listHref: "/ater-sociobio/familias?from=/ater-sociobio/dashboard/ufpas",
    listLabel: "Ver UFPAs",
  },
  organizacoes: {
    title: "Métricas de Organizações",
    description: "Indicadores das organizações coletivas, práticas ambientais, políticas públicas e representação.",
    listHref: "/ater-sociobio/organizacoes?from=/ater-sociobio/dashboard/organizacoes",
    listLabel: "Ver organizações",
  },
  atendimentos: {
    title: "Métricas de Atendimentos",
    description: "Acompanhamento das visitas técnicas, relatórios, eixos trabalhados e público atendido.",
    listHref: "/ater-sociobio/atendimentos?from=/ater-sociobio/dashboard/atendimentos",
    listLabel: "Ver atendimentos",
  },
};

export async function SiggaterDashboardViewPage({ view }: { view: DashboardView }) {
  let dashboardData: SiggaterDashboardData = {
    familias: [],
    organizacoes: [],
    atendimentos: [],
  };
  let setupMissing = false;
  const meta = viewMeta[view];

  try {
    dashboardData = await AterSociobioService.getDashboardData();
  } catch (error) {
    if (isAterMissingTableError(error)) {
      setupMissing = true;
    } else {
      throw error;
    }
  }

  return (
    <div className="min-h-screen bg-[#f6f7f2]">
      <Header
        title={meta.title}
        description={meta.description}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Link href="/ater-sociobio/dashboard">
              <Button variant="secondary">Central de métricas</Button>
            </Link>
            <Link href={meta.listHref}>
              <Button variant="secondary">{meta.listLabel}</Button>
            </Link>
          </div>
        }
      />

      <div className="p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          {setupMissing ? (
            <AterSetupWarning />
          ) : (
            <Suspense fallback={null}>
              <SiggaterDashboardClient data={dashboardData} view={view} />
            </Suspense>
          )}
        </div>
      </div>
    </div>
  );
}
