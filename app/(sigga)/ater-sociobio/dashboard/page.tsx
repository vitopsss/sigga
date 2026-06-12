import Link from "next/link";
import { Suspense } from "react";

import { AterSetupWarning } from "@/components/ater/setup-warning";
import { Header } from "@/components/dashboard/header";
import { Button } from "@/components/ui";
import { isAterMissingTableError } from "@/lib/ater-runtime";
import { ATER_SOCIOBIO_TERRITORY_NAME } from "@/lib/constants/ater-sociobio";
import { AterSociobioService, type SiggaterDashboardData } from "@/lib/services/ater-sociobio.service";

import { SiggaterDashboardClient } from "./dashboard-client";

export const dynamic = "force-dynamic";

export default async function SiggaterDashboardPage() {
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

  return (
    <div className="min-h-screen bg-[#f6f7f2]">
      <Header
        title="Painel ATERSOCIOBIO"
        description={`Leitura operacional de UFPAs, diagnostico e prioridades em ${ATER_SOCIOBIO_TERRITORY_NAME}`}
        actions={
          <Link href="/ater-sociobio/familias?from=/ater-sociobio/dashboard">
            <Button variant="secondary">Ver UFPAs</Button>
          </Link>
        }
      />

      <div className="p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          {setupMissing ? (
            <AterSetupWarning />
          ) : (
            <Suspense fallback={null}>
              <SiggaterDashboardClient data={dashboardData} />
            </Suspense>
          )}
        </div>
      </div>
    </div>
  );
}
