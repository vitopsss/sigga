import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import * as xlsx from "xlsx";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const familias = await prisma.familiaAter.findMany({
      include: {
        integrantes: true,
        atendimentos: true,

        cadastro: true,
        indicadores: true,
      },
    });

    const data = familias.map((f) => {
      // Básico
      const base = {
        "ID da UFPA": f.id,
        "Data de Cadastro": f.dataCadastro ? new Date(f.dataCadastro).toLocaleDateString("pt-BR") : "Não informado",
        "Projeto": f.projeto || "Não informado",
        "Técnico Responsável": f.tecnico || "Não informado",
        "Nome da UFPA": f.nomeFamilia,
        "Nome do Responsável": f.nomeResponsavel || "Não informado",
        "DAP/CAF": f.dapCaf || "Não possui",
        "Código SGA": f.codigoSGA || "Sem SGA",
        "Município": f.municipio || "Não informado",
        "Comunidade": f.comunidade || "Não informado",
        "Organização Coletiva": f.organizacaoColetivaId || "Não informado",
        "Qtd Membros (Estimado)": f.quantidadeMembros || 0,
        "Qtd Membros (Cadastrados)": f.integrantes?.length || 0,
        "Qtd Atendimentos": f.atendimentos?.length || 0,
      };

      const diagnosticoData = {
        "Possui Internet": f.possuiInternet ? "Sim" : "Não",
        "Água para Consumo": f.aguaParaConsumo ? "Sim" : "Não",
        "Água Tratada": f.aguaConsumoTratada ? "Sim" : "Não",
        "Esgoto Tratado": f.esgotoTratado ? "Sim" : "Não",
      };

      // Indicadores
      const ind = f.indicadores;
      const indicadoresData = ind ? {
        "Alimentação Variada Comprometida": ind.alimentacaoVariadaComprometida ? "Sim" : "Não",
        "Comida Acabou (Sem Condição)": ind.comidaAcabouSemCondicao ? "Sim" : "Não",
        "Deixou de Fazer Refeição": ind.deixouRefeicaoSemCondicao ? "Sim" : "Não",
        "Comeu Menos": ind.comeuMenosSemCondicao ? "Sim" : "Não",
        "Sentiu Fome e Não Comeu": ind.sentiuFomeENaoComeu ? "Sim" : "Não",
        "Cadastrado no CadÚnico": ind.cadastradoCadUnico ? "Sim" : "Não",
        "Acessa Políticas Produtivas": ind.acessaPoliticasProdutivas ? "Sim" : "Não",
        "Acessou PRONAF": ind.acessouPronaf ? "Sim" : "Não",
        "Acessou PAA": ind.acessouPaa ? "Sim" : "Não",
        "Acessou PNAE": ind.acessouPnae ? "Sim" : "Não",
        "Valor Bruto Produção": ind.valorBrutoProducaoUltimos12Meses || 0,
      } : {};

      return {
        ...base,
        ...diagnosticoData,
        ...indicadoresData,
      };
    });

    const worksheet = xlsx.utils.json_to_sheet(data);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "UFPAs");

    const excelBuffer = xlsx.write(workbook, { type: "buffer", bookType: "xlsx" });

    return new NextResponse(excelBuffer, {
      headers: {
        "Content-Disposition": `attachment; filename="exportacao_ufpas_${new Date().getTime()}.xlsx"`,
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    });
  } catch (error) {
    console.error("Erro na exportação:", error);
    return NextResponse.json({ error: "Erro ao gerar exportação" }, { status: 500 });
  }
}
