import Link from "next/link";

import { AterSetupWarning } from "@/components/ater/setup-warning";
import { Badge, Card, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui";
import { isAterMissingTableError } from "@/lib/ater-runtime";
import { ATER_SOCIOBIO_TERRITORY_NAME } from "@/lib/constants/ater-sociobio";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function getChecklistCount(familia: {
  sgaCadastro: boolean | null;
  sgaRevisao: boolean | null;
  sgaIndicador: boolean | null;
  sgaFotos: boolean | null;
}) {
  return [familia.sgaCadastro, familia.sgaRevisao, familia.sgaIndicador, familia.sgaFotos].filter(Boolean).length;
}

export default async function ControleAterSociobioPage() {
  let familias: Array<{
    id: string;
    nomeFamilia: string;
    municipio: string | null;
    sgaCadastro: boolean | null;
    sgaRevisao: boolean | null;
    sgaIndicador: boolean | null;
    sgaFotos: boolean | null;
    sgaProjetoEnviado: boolean;
    sgaStatusAnalise: string | null;
    sgaParcela1: string | null;
    sgaParcela2: string | null;
  }> = [];
  let setupMissing = false;

  try {
    familias = await prisma.familiaAter.findMany({
      orderBy: [{ municipio: "asc" }, { nomeFamilia: "asc" }],
      select: {
        id: true,
        nomeFamilia: true,
        municipio: true,
        sgaCadastro: true,
        sgaRevisao: true,
        sgaIndicador: true,
        sgaFotos: true,
        sgaProjetoEnviado: true,
        sgaStatusAnalise: true,
        sgaParcela1: true,
        sgaParcela2: true,
      },
    });
  } catch (error) {
    if (isAterMissingTableError(error)) {
      setupMissing = true;
    } else {
      throw error;
    }
  }

  const completos = familias.filter((familia) => getChecklistCount(familia) === 4).length;
  const projetosEnviados = familias.filter((familia) => familia.sgaProjetoEnviado).length;
  const comParcelas = familias.filter((familia) => familia.sgaParcela1 || familia.sgaParcela2).length;

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <Badge variant="success" className="w-fit">
            ATER Sociobio
          </Badge>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">Controle de processos</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
            Painel operacional do fluxo SGA por família do lote {ATER_SOCIOBIO_TERRITORY_NAME}, com checklist, envio de projeto e parcelas.
          </p>
        </section>

        {setupMissing && <AterSetupWarning />}

        <div className="grid gap-4 md:grid-cols-4">
          <Card className="p-5">
            <p className="text-sm text-zinc-500">Famílias</p>
            <p className="mt-1 text-3xl font-bold text-zinc-950">{familias.length}</p>
          </Card>
          <Card className="p-5">
            <p className="text-sm text-zinc-500">Checklist completo</p>
            <p className="mt-1 text-3xl font-bold text-emerald-600">{completos}</p>
          </Card>
          <Card className="p-5">
            <p className="text-sm text-zinc-500">Projeto enviado</p>
            <p className="mt-1 text-3xl font-bold text-emerald-600">{projetosEnviados}</p>
          </Card>
          <Card className="p-5">
            <p className="text-sm text-zinc-500">Com parcelas</p>
            <p className="mt-1 text-3xl font-bold text-zinc-950">{comParcelas}</p>
          </Card>
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Família</TableHead>
                <TableHead>Município</TableHead>
                <TableHead>Checklist SGA</TableHead>
                <TableHead>Status da análise</TableHead>
                <TableHead>Projeto enviado</TableHead>
                <TableHead>Parcelas</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {familias.map((familia) => {
                const checklist = getChecklistCount(familia);
                return (
                  <TableRow key={familia.id}>
                    <TableCell>
                      <Link href={`/ater-sociobio/familias/${familia.id}`} className="font-medium text-slate-900 hover:text-emerald-700">
                        {familia.nomeFamilia}
                      </Link>
                    </TableCell>
                    <TableCell>{familia.municipio ?? "-"}</TableCell>
                    <TableCell>
                      <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
                        {checklist}/4
                      </span>
                    </TableCell>
                    <TableCell>{familia.sgaStatusAnalise ?? "-"}</TableCell>
                    <TableCell>{familia.sgaProjetoEnviado ? "Sim" : "Não"}</TableCell>
                    <TableCell>
                      {[familia.sgaParcela1, familia.sgaParcela2].filter(Boolean).join(" / ") || "-"}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
