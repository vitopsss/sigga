import * as XLSX from "xlsx";
import { SiggaterDashboardItem } from "@/lib/services/ater-sociobio.service";

/**
 * Utilitário para formatar arrays em strings amigáveis
 */
function formatArray(arr: any): string {
  if (!Array.isArray(arr)) return "";
  return arr.filter(Boolean).join(", ");
}

/**
 * Converte booleanos em "Sim" ou "Não"
 */
function formatBool(val: any): string {
  if (val === true) return "Sim";
  if (val === false) return "Não";
  return "";
}

/**
 * Ajusta a largura das colunas baseada no conteúdo
 */
function autoFitColumns(data: any[], worksheet: XLSX.WorkSheet) {
  if (!data || data.length === 0) return;
  const keys = Object.keys(data[0]);
  const colWidths = keys.map((key) => {
    let maxLength = key.toString().length;
    data.forEach((row) => {
      const val = row[key];
      if (val !== undefined && val !== null) {
        const len = val.toString().length;
        if (len > maxLength) {
          maxLength = len;
        }
      }
    });
    return { wch: Math.min(maxLength + 4, 80) };
  });
  worksheet["!cols"] = colWidths;
}

/**
 * Mapeia os dados do sistema para um formato plano, ideal para Excel.
 */
export function mapUfpasToExcelData(familias: SiggaterDashboardItem[]) {
  return familias.map((f) => {
    return {
      "ID SIGGA": f.id,
      "Nome da UFPA / Responsável": f.nomeFamilia,
      "Comunidade / Organização": f.comunidade || f.organizacaoColetiva,
      "Município": f.municipio,
      "Membros da Família": f.integrantes,
      "Cadastro e Diagnóstico Preenchido?": formatBool(f.diagnosticoRegistrado),
      
      // Saneamento e Comunicação (Cadastro)
      "Possui Rádio?": formatBool(f.possuiRadio),
      "Possui Televisão?": formatBool(f.possuiTelevisao),
      "Possui Celular?": formatBool(f.possuiCelular),
      "Usa Redes Sociais?": formatBool(f.usaRedesSociais),
      "Possui Internet?": formatBool(f.possuiInternet),
      "Água Tratada?": formatBool(f.aguaTratada),
      "Esgoto Tratado?": formatBool(f.esgotoTratado),
      "Fontes Protegidas?": formatBool(f.fontesProtegidas),
      
      // Econômico (Indicadores)
      "Valor Bruto Produção (12 meses)": f.valorBrutoProducaoUltimos12Meses ? `R$ ${f.valorBrutoProducaoUltimos12Meses}` : "",
      "Acessa Políticas Produtivas?": formatBool(f.politicasProdutivas),
      "Acessou PRONAF?": formatBool(f.acessouPronaf),
      "Linhas do PRONAF": formatArray(f.linhasPronaf),
      "Acessou PAA?": formatBool(f.acessouPaa),
      "Acessou PNAE?": formatBool(f.acessouPnae),
      "Acessou PGPM-Bio?": formatBool(f.acessouPgpmBio),
      
      // Social (Indicadores)
      "Insegurança Alimentar?": formatBool(f.insegurancaAlimentar),
      "Faltou comida (sem condição)?": formatBool(f.comidaAcabouSemCondicao),
      "Cadastrado no CadÚnico?": formatBool(f.cadUnico),
      "Acessa Políticas Sociais?": formatBool(f.politicasSociais),
      "Participa de Grupo Comunitário?": formatBool(f.grupoComunitario),
      
      // Ambiental (Indicadores)
      "Práticas Sustentáveis?": formatBool(f.praticasSustentaveis),
      
      // Listas Livres
      "Ações Potenciais (Produtivo)": formatArray(f.acoesPotenciaisProdutivo),
      "Ações Potenciais (Social)": formatArray(f.acoesPotenciaisSocial),
      "Ações Potenciais (Ambiental)": formatArray(f.acoesPotenciaisAmbiental),
      "Limitações (Produtivo)": formatArray(f.limitacoesProdutivo),
      "Limitações (Social)": formatArray(f.limitacoesSocial),
      "Limitações (Ambiental)": formatArray(f.limitacoesAmbiental),
      
      // Recursos e Atividades Coletivas
      "Recursos Disponíveis": formatArray(f.recursosDisponiveis),
      "Atividades Coletivas": formatArray(f.atividadesColetivas),

      // Patrimônio e Atividades Produtivas (Estruturado)
      "Patrimônio": Array.isArray(f.patrimonios) 
        ? f.patrimonios.map((p: any) => {
            if (typeof p === 'string') return p;
            return `${p.quantidade || ''} ${p.unidade || ''} - ${p.descricao || ''}`.trim();
          }).filter(Boolean).join(" | ") 
        : "",
      "Atividades Produtivas": Array.isArray(f.atividadesProdutivas)
        ? f.atividadesProdutivas.map((a: any) => {
            if (typeof a === 'string') return a;
            return `${a.producaoAnual || ''} ${a.unidade || ''} - ${a.atividade || ''}`.trim();
          }).filter(Boolean).join(" | ")
        : "",
    };
  });
}

/**
 * Exporta qualquer array de objetos (tabela genérica) para Excel com formatação.
 */
export function exportTableToExcel(data: any[], filename: string, sheetName = "Dados") {
  if (!data || data.length === 0) return;

  // Remove invalid XML characters (control characters) from all string values
  // which causes the "Encontramos um problema em um conteúdo" error in Excel.
  const cleanData = data.map(row => {
    const newRow: any = {};
    for (const key in row) {
      let val = row[key];
      if (typeof val === 'string') {
        // Remove chars 0x00-0x1F (except 0x09 tab, 0x0A LF, 0x0D CR)
        val = val.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F]/g, '');
      }
      newRow[key] = val;
    }
    return newRow;
  });

  const worksheet = XLSX.utils.json_to_sheet(cleanData);
  autoFitColumns(cleanData, worksheet);
  
  const workbook = XLSX.utils.book_new();
  const safeSheetName = sheetName.replace(/[\\/*?:[\]]/g, '').substring(0, 31) || "Dados";
  XLSX.utils.book_append_sheet(workbook, worksheet, safeSheetName);
  XLSX.writeFile(workbook, filename);
}

/**
 * Prepara e baixa os dados das UFPAs (Dashboard) para Excel
 */
export function exportUfpasToExcel(familias: SiggaterDashboardItem[], filename = "Relatorio_UFPAs.xlsx") {
  const data = mapUfpasToExcelData(familias);
  exportTableToExcel(data, filename, "UFPAs");
}
