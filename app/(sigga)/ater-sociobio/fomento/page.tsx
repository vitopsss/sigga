import Link from "next/link";

import { AterSetupWarning } from "@/components/ater/setup-warning";
import { Badge, Card, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui";
import { isAterMissingTableError } from "@/lib/ater-runtime";
import { ATER_SOCIOBIO_TERRITORY_NAME } from "@/lib/constants/ater-sociobio";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function FomentoAterSociobioPage() {
  let familias: Array<{
    id: string;
    nomeFamilia: string;
    municipio: string | null;
    atividadeProdutiva: string | null;
    situacaoFomento: string | null;
    valorFomento: unknown;
    valorInvestidoUFPA: unknown;
  }> = [];
  let setupMissing = false;

  try {
    familias = await prisma.familiaAter.findMany({
      orderBy: [{ situacaoFomento: "asc" }, { nomeFamilia: "asc" }],
      select: {
        id: true,
        nomeFamilia: true,
        municipio: true,
        atividadeProdutiva: true,
        situacaoFomento: true,
        valorFomento: true,
        valorInvestidoUFPA: true,
      },
    });
  } catch (error) {
    if (isAterMissingTableError(error)) {
      setupMissing = true;
    } else {
      throw error;
    }
  }

  const aprovados = familias.filter((familia) => familia.situacaoFomento?.toLowerCase().includes("aprov")).length;
  const emAnalise = familias.filter((familia) => familia.situacaoFomento?.toLowerCase().includes("anal")).length;
  const valorTotalFomento = familias.reduce((acc, familia) => acc + Number(familia.valorFomento ?? 0), 0);
  const valorTotalInvestido = familias.reduce((acc, familia) => acc + Number(familia.valorInvestidoUFPA ?? 0), 0);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <Badge variant="success" className="w-fit">
            ATER Sociobio
          </Badge>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">Fomento</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
            Visão consolidada do fomento por família no lote {ATER_SOCIOBIO_TERRITORY_NAME}, incluindo situação, valor apoiado e contrapartida registrada.
          </p>
        </section>

        {setupMissing && <AterSetupWarning />}

        <div className="grid gap-4 md:grid-cols-4">
          <Card className="p-5">
            <p className="text-sm text-zinc-500">Famílias</p>
            <p className="mt-1 text-3xl font-bold text-zinc-950">{familias.length}</p>
          </Card>
          <Card className="p-5">
            <p className="text-sm text-zinc-500">Aprovados</p>
            <p className="mt-1 text-3xl font-bold text-emerald-600">{aprovados}</p>
          </Card>
          <Card className="p-5">
            <p className="text-sm text-zinc-500">Em análise</p>
            <p className="mt-1 text-3xl font-bold text-amber-600">{emAnalise}</p>
          </Card>
          <Card className="p-5">
            <p className="text-sm text-zinc-500">Valor fomento</p>
            <p className="mt-1 text-2xl font-bold text-zinc-950">
              {valorTotalFomento.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </p>
          </Card>
        </div>

        <Card className="p-5">
          <p className="text-sm text-zinc-500">Contrapartida total UFPA</p>
          <p className="mt-1 text-2xl font-bold text-zinc-950">
            {valorTotalInvestido.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          </p>
        </Card>

        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Família</TableHead>
                <TableHead>Município</TableHead>
                <TableHead>Atividade produtiva</TableHead>
                <TableHead>Situação</TableHead>
                <TableHead>Valor fomento</TableHead>
                <TableHead>Investido UFPA</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {familias.map((familia) => (
                <TableRow key={familia.id}>
                  <TableCell>
                    <Link href={`/ater-sociobio/familias/${familia.id}`} className="font-medium text-slate-900 hover:text-emerald-700">
                      {familia.nomeFamilia}
                    </Link>
                  </TableCell>
                  <TableCell>{familia.municipio ?? "-"}</TableCell>
                  <TableCell>{familia.atividadeProdutiva ?? "-"}</TableCell>
                  <TableCell>{familia.situacaoFomento ?? "-"}</TableCell>
                  <TableCell>
                    {Number(familia.valorFomento ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </TableCell>
                  <TableCell>
                    {Number(familia.valorInvestidoUFPA ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
