import { createElement, type ReactElement } from "react";
import { renderToBuffer, type DocumentProps } from "@react-pdf/renderer";

import { AtendimentoReportPdf } from "@/components/ater/atendimento-report-pdf";
import { prisma } from "@/lib/prisma";
import { isDatabaseUnavailableError } from "@/lib/prisma-runtime";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ atendimentoId: string }> },
) {
  const { atendimentoId } = await params;

  try {
    const atendimento = await prisma.atendimento.findUnique({
      where: { id: atendimentoId },
      include: {
        familia: true,
        tecnicoRef: true,
      },
    });

    if (!atendimento) {
      return new Response("Atendimento não encontrado.", { status: 404 });
    }

    const buffer = await renderToBuffer(
      createElement(AtendimentoReportPdf, {
        atendimento: {
          id: atendimento.id,
          numeroVisita: atendimento.numeroVisita,
          data: atendimento.data ?? null,
          statusRelatorio: atendimento.statusRelatorio,
          houveAtendimento: atendimento.houveAtendimento ?? null,
          enviadoSGA: atendimento.enviadoSGA,
          dataEnvioSGA: atendimento.dataEnvioSGA ?? null,
          projetoId: atendimento.projetoId ?? null,
          projetoTitulo: atendimento.projetoTitulo ?? null,
          familia: atendimento.familia
            ? {
                nomeFamilia: atendimento.familia.nomeFamilia,
                nomeResponsavel: atendimento.familia.nomeResponsavel ?? null,
                municipio: atendimento.familia.municipio ?? null,
                comunidade: atendimento.familia.comunidade ?? null,
                ufpa: atendimento.familia.ufpa ?? null,
                codigoSGA: atendimento.familia.codigoSGA ?? null,
                nis: atendimento.familia.nis ?? null,
              }
            : null,
          tecnicoNome: atendimento.tecnicoRef?.nome ?? atendimento.tecnico ?? null,
          tecnicoRegistro: atendimento.tecnicoRef?.registroConselho ?? null,
          eixoProdutivo: (atendimento.eixoProdutivo as Record<string, string> | null) ?? null,
          eixoSocial: (atendimento.eixoSocial as Record<string, string> | null) ?? null,
          eixoAmbiental: (atendimento.eixoAmbiental as Record<string, string> | null) ?? null,
        },
      }) as ReactElement<DocumentProps>,
    );

    return new Response(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="ater-sociobio-visita-${atendimento.numeroVisita}.pdf"`,
      },
    });
  } catch (error) {
    if (isDatabaseUnavailableError(error)) {
      return new Response("Banco de dados indisponível no momento.", { status: 503 });
    }

    console.error(error);
    return new Response("Não foi possível gerar o PDF.", { status: 500 });
  }
}
