import { AterSetupWarning } from "@/components/ater/setup-warning";
import { Badge } from "@/components/ui";
import { isAterMissingTableError } from "@/lib/ater-runtime";
import { ATER_SOCIOBIO_TERRITORY_NAME } from "@/lib/constants/ater-sociobio";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function IndicesPage() {
  let rows: Array<{ municipio: string | null; _count: { _all: number } }> = [];
  let setupMissing = false;

  try {
    const grouped = await prisma.familiaAter.groupBy({
      by: ["municipio"],
      _count: { _all: true },
      orderBy: { municipio: "asc" },
    });

    rows = grouped;
  } catch (error) {
    if (isAterMissingTableError(error)) {
      setupMissing = true;
    } else {
      throw error;
    }
  }

  const totalFamilias = rows.reduce((acc, row) => acc + row._count._all, 0);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <Badge variant="success" className="w-fit mb-3">
          ATER Sociobio
        </Badge>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Índices por município</h1>
        <p className="mt-4 text-sm leading-6 text-slate-600">
          Visão consolidada da cobertura territorial do programa no lote {ATER_SOCIOBIO_TERRITORY_NAME}, por município.
        </p>

        {setupMissing && <AterSetupWarning className="mt-6" />}

        <div className="mt-6 flex items-center gap-4">
          <div className="text-sm text-slate-500">Total de famílias:</div>
          <div className="text-2xl font-bold text-emerald-600">{totalFamilias}</div>
        </div>

        <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 font-semibold">Município</th>
                <th className="px-4 py-3 font-semibold">Famílias</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={2} className="px-4 py-8 text-center text-slate-500">
                    Nenhuma família cadastrada.
                  </td>
                </tr>
              ) : (
                rows.map((item) => (
                  <tr key={item.municipio ?? "sem"} className="border-t border-slate-100">
                    <td className="px-4 py-3">{item.municipio ?? "Não informado"}</td>
                    <td className="px-4 py-3 font-semibold">{item._count._all}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
