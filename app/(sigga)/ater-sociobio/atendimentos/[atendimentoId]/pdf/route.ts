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
        familia: {
          include: {
            diagnostico: true,
            indicadores: true,
            integrantes: true,
            organizacaoColetiva: true,
          },
        },
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
          atividadeNumeroTotal: atendimento.atividadeNumeroTotal ?? null,
          codigoMeta: atendimento.codigoMeta ?? null,
          descricaoMeta: atendimento.descricaoMeta ?? null,
          numeroMulheres: atendimento.numeroMulheres ?? null,
          numeroJovens: atendimento.numeroJovens ?? null,
          familia: atendimento.familia
            ? {
                nomeFamilia: atendimento.familia.nomeFamilia,
                nomeResponsavel: atendimento.familia.nomeResponsavel ?? null,
                documentoResponsavel: atendimento.familia.documentoResponsavel ?? null,
                municipio: atendimento.familia.municipio ?? null,
                comunidade: atendimento.familia.comunidade ?? null,
                ufpa: atendimento.familia.ufpa ?? null,
                codigoSGA: atendimento.familia.codigoSGA ?? null,
                nis: atendimento.familia.nis ?? null,
                dapCaf: atendimento.familia.dapCaf ?? null,
                grupoInteresse: atendimento.familia.grupoInteresse ?? null,
                organizacaoColetivaNome: atendimento.familia.organizacaoColetiva?.denominacao ?? null,
                programaFomento: atendimento.familia.programaFomento ?? null,
                statusGestor: atendimento.familia.statusGestor ?? null,
                quantidadeIntegrantes:
                  atendimento.familia.integrantes.length || atendimento.familia.quantidadeMembros || null,
                diagnostico: atendimento.familia.diagnostico
                  ? {
                      dataDiagnostico: atendimento.familia.diagnostico.dataDiagnostico ?? null,
                      possuiInternet: atendimento.familia.diagnostico.possuiInternet ?? null,
                      aguaParaConsumo: atendimento.familia.diagnostico.aguaParaConsumo ?? null,
                      aguaConsumoTratada: atendimento.familia.diagnostico.aguaConsumoTratada ?? null,
                      esgotoTratado: atendimento.familia.diagnostico.esgotoTratado ?? null,
                    }
                  : null,
                indicadores: atendimento.familia.indicadores
                  ? {
                      alimentacaoVariadaComprometida:
                        atendimento.familia.indicadores.alimentacaoVariadaComprometida ?? null,
                      comidaAcabouSemCondicao: atendimento.familia.indicadores.comidaAcabouSemCondicao ?? null,
                      deixouRefeicaoSemCondicao:
                        atendimento.familia.indicadores.deixouRefeicaoSemCondicao ?? null,
                      comeuMenosSemCondicao: atendimento.familia.indicadores.comeuMenosSemCondicao ?? null,
                      sentiuFomeENaoComeu: atendimento.familia.indicadores.sentiuFomeENaoComeu ?? null,
                      cadastradoCadUnico: atendimento.familia.indicadores.cadastradoCadUnico ?? null,
                      acessaPoliticasSociais: atendimento.familia.indicadores.acessaPoliticasSociais ?? null,
                      participaGrupoComunitario:
                        atendimento.familia.indicadores.participaGrupoComunitario ?? null,
                      possuiPraticasSustentaveis:
                        atendimento.familia.indicadores.possuiPraticasSustentaveis ?? null,
                    }
                  : null,
              }
            : null,
          tecnicoNome: atendimento.tecnicoRef?.nome ?? atendimento.tecnico ?? null,
          tecnicoRegistro: atendimento.tecnicoRef?.registroConselho ?? null,
          eixoProdutivo: (atendimento.eixoProdutivo as Record<string, string | string[]> | null) ?? null,
          eixoSocial: (atendimento.eixoSocial as Record<string, string | string[]> | null) ?? null,
          eixoAmbiental: (atendimento.eixoAmbiental as Record<string, string | string[]> | null) ?? null,
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
