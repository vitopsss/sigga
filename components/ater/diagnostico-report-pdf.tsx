import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

import {
  ATER_SOCIOBIO_MODULE_NAME,
  ATER_SOCIOBIO_TERRITORY_NAME,
} from "@/lib/constants/ater-sociobio";
import type { FamiliaWithCadastro } from "@/lib/services/ater-sociobio.service";

const styles = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingBottom: 50,
    paddingHorizontal: 36,
    fontSize: 10,
    color: "#0f172a",
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
  },
  header: {
    marginBottom: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#d1fae5",
  },
  eyebrow: {
    fontSize: 9,
    color: "#047857",
    textTransform: "uppercase",
    marginBottom: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 10,
    color: "#475569",
    lineHeight: 1.4,
  },
  section: {
    marginTop: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 10,
    color: "#0f172a",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    paddingBottom: 4,
  },
  grid: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  field: {
    width: "48%",
    marginBottom: 8,
  },
  fieldFull: {
    width: "100%",
    marginBottom: 8,
  },
  label: {
    fontSize: 8,
    color: "#64748b",
    textTransform: "uppercase",
    marginBottom: 3,
    fontWeight: 700,
  },
  value: {
    fontSize: 10,
    color: "#0f172a",
    lineHeight: 1.4,
  },
  table: {
    width: "100%",
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  tableHeader: {
    backgroundColor: "#f8fafc",
  },
  tableCol: {
    padding: 6,
    borderRightWidth: 1,
    borderRightColor: "#e2e8f0",
  },
  footer: {
    position: "absolute",
    bottom: 18,
    left: 36,
    right: 36,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    paddingTop: 8,
    fontSize: 8,
    color: "#64748b",
    textAlign: "center",
  },
  signatureRow: {
    display: "flex",
    flexDirection: "row",
    gap: 12,
    marginTop: 18,
  },
  signatureBox: {
    width: "48%",
  },
  signatureLine: {
    borderTopWidth: 1,
    borderTopColor: "#0f172a",
    paddingTop: 5,
    marginTop: 26,
  },
  signatureNote: {
    fontSize: 8,
    color: "#64748b",
    marginTop: 4,
  },
});

function formatDate(value?: Date | null | string) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("pt-BR").format(new Date(value));
}

function safeText(value?: string | null) {
  return value?.trim() ? value : "-";
}

function formatBoolean(value?: boolean | null) {
  if (value === true) return "Sim";
  if (value === false) return "Não";
  return "-";
}

function formatDecimal(value?: string | number | { toString: () => string } | null) {
  if (value === null || value === undefined) return "-";
  return Number(value.toString()).toLocaleString("pt-BR");
}

function PdfField({
  label,
  value,
  full = false,
}: {
  label: string;
  value: string;
  full?: boolean;
}) {
  return (
    <View style={full ? styles.fieldFull : styles.field}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

export function DiagnosticoReportPdf({ familia }: { familia: FamiliaWithCadastro }) {
  const diagnostico = familia.diagnostico;
  const indicadores = familia.indicadores;

  const getAtividadesRows = (value: unknown) => {
    if (Array.isArray(value)) {
      return value.filter((item): item is Record<string, unknown> =>
        item !== null && typeof item === "object" && !Array.isArray(item) &&
        (typeof (item as Record<string, unknown>).atividade === 'string' || typeof (item as Record<string, unknown>).producaoAnual === 'string')
      );
    }
    return [];
  };

  const atividades = getAtividadesRows(familia.envioSGAPorAtividade);

  return (
    <Document
      title={`${ATER_SOCIOBIO_MODULE_NAME} - Diagnóstico UFPA`}
      author="SIGGA"
      subject="Diagnóstico da Unidade Familiar de Produção Agrária"
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>{ATER_SOCIOBIO_MODULE_NAME} | {ATER_SOCIOBIO_TERRITORY_NAME}</Text>
          <Text style={styles.title}>Diagnóstico da UFPA - Sociobiodiversidade</Text>
          <Text style={styles.subtitle}>
            Documento consolidado do diagnóstico socioambiental e produtivo da unidade familiar.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Identificação da UFPA</Text>
          <View style={styles.grid}>
            <PdfField label="Nome da UFPA" value={safeText(familia.nomeFamilia)} full />
            <PdfField label="Responsável" value={safeText(familia.nomeResponsavel)} />
            <PdfField label="CPF do responsável" value={safeText(familia.documentoResponsavel)} />
            <PdfField label="Município" value={safeText(familia.municipio)} />
            <PdfField label="Comunidade" value={safeText(familia.comunidade)} />
            <PdfField label="Endereço" value={safeText(familia.enderecoUfpa)} full />
            <PdfField label="DAP/CAF" value={safeText(familia.dapCaf)} />
            <PdfField label="Validade DAP/CAF" value={formatDate(familia.dapCafValidade)} />
            <PdfField label="Código SGA" value={safeText(familia.codigoSGA)} />
            <PdfField label="Programa de Fomento" value={safeText(familia.programaFomento)} />
            <PdfField label="Área total (ha)" value={formatDecimal(familia.areaEstabelecimento)} />
            <PdfField label="Bioma" value={safeText(familia.bioma)} />
            <PdfField label="Organização Coletiva" value={safeText(familia.organizacaoColetiva?.denominacao)} full />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Composição Familiar</Text>
          {familia.integrantes.length === 0 ? (
            <Text style={styles.value}>Nenhum integrante cadastrado.</Text>
          ) : (
            <View style={styles.table}>
              <View style={[styles.tableRow, styles.tableHeader]}>
                <View style={[styles.tableCol, { width: "40%" }]}><Text style={styles.label}>Nome</Text></View>
                <View style={[styles.tableCol, { width: "25%" }]}><Text style={styles.label}>CPF/NIS</Text></View>
                <View style={[styles.tableCol, { width: "20%" }]}><Text style={styles.label}>Nascimento</Text></View>
                <View style={[styles.tableCol, { width: "15%", borderRightWidth: 0 }]}><Text style={styles.label}>Resp?</Text></View>
              </View>
              {familia.integrantes.map((i) => (
                <View key={i.id} style={styles.tableRow}>
                  <View style={[styles.tableCol, { width: "40%" }]}><Text style={styles.value}>{safeText(i.nome)}</Text></View>
                  <View style={[styles.tableCol, { width: "25%" }]}><Text style={styles.value}>{safeText(i.cpf || i.nisCadUnico)}</Text></View>
                  <View style={[styles.tableCol, { width: "20%" }]}><Text style={styles.value}>{formatDate(i.dataNascimento)}</Text></View>
                  <View style={[styles.tableCol, { width: "15%", borderRightWidth: 0 }]}><Text style={styles.value}>{formatBoolean(i.responsavelUfpa)}</Text></View>
                </View>
              ))}
            </View>
          )}
        </View>

        {atividades.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Atividades Produtivas</Text>
            <View style={styles.table}>
              <View style={[styles.tableRow, styles.tableHeader]}>
                <View style={[styles.tableCol, { width: "50%" }]}><Text style={styles.label}>Atividade</Text></View>
                <View style={[styles.tableCol, { width: "30%" }]}><Text style={styles.label}>Produção Anual</Text></View>
                <View style={[styles.tableCol, { width: "20%", borderRightWidth: 0 }]}><Text style={styles.label}>Principal</Text></View>
              </View>
              {atividades.map((a, i) => (
                <View key={i} style={styles.tableRow}>
                  <View style={[styles.tableCol, { width: "50%" }]}><Text style={styles.value}>{safeText(a.atividade as string)}</Text></View>
                  <View style={[styles.tableCol, { width: "30%" }]}><Text style={styles.value}>{safeText(a.producaoAnual as string)} {safeText(a.unidade as string)}</Text></View>
                  <View style={[styles.tableCol, { width: "20%", borderRightWidth: 0 }]}><Text style={styles.value}>{formatBoolean(a.atividadePrincipal as boolean)}</Text></View>
                </View>
              ))}
            </View>
          </View>
        )}

        {diagnostico && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Diagnóstico Socioambiental (Resumo)</Text>
            <View style={styles.grid}>
              <PdfField label="Água para consumo humano" value={formatBoolean(diagnostico.aguaParaConsumo)} />
              <PdfField label="Água tratada" value={formatBoolean(diagnostico.aguaConsumoTratada)} />
              <PdfField label="Esgoto tratado" value={formatBoolean(diagnostico.esgotoTratado)} />
              <PdfField label="Internet" value={formatBoolean(diagnostico.possuiInternet)} />
              <PdfField label="Consentimento LGPD" value={formatBoolean(diagnostico.lgpdConsentimento)} />
              <PdfField label="Referência LGPD" value={safeText(diagnostico.referenciaAnexoLgpd)} />
              <PdfField label="Data Diagnóstico" value={formatDate(diagnostico.dataDiagnostico)} />
            </View>
          </View>
        )}

        {indicadores && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Indicadores Socioeconômicos</Text>
            <View style={styles.grid}>
              <PdfField label="Cadastrado no CadÚnico" value={formatBoolean(indicadores.cadastradoCadUnico)} />
              <PdfField label="Acessa Políticas Sociais" value={formatBoolean(indicadores.acessaPoliticasSociais)} />
              <PdfField label="Acessa Políticas Produtivas" value={formatBoolean(indicadores.acessaPoliticasProdutivas)} />
              <PdfField label="Participa de Grupo Comunitário" value={formatBoolean(indicadores.participaGrupoComunitario)} />
              <PdfField label="Práticas Sustentáveis" value={formatBoolean(indicadores.possuiPraticasSustentaveis)} />
              <PdfField label="Práticas Descrição" value={safeText(indicadores.praticasSustentaveisQuais)} full />
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Assinaturas e Responsabilidade</Text>
          <View style={styles.signatureRow}>
            <View style={styles.signatureBox}>
              <View style={styles.signatureLine}>
                <Text style={styles.value}>Responsável pela UFPA</Text>
                <Text style={styles.signatureNote}>Assinatura ou impressão digital</Text>
              </View>
            </View>
            <View style={styles.signatureBox}>
              <View style={styles.signatureLine}>
                <Text style={styles.value}>Técnico Responsável</Text>
                <Text style={styles.signatureNote}>Sigla e Registro do Conselho Profissional / UF</Text>
              </View>
            </View>
          </View>
        </View>

        <Text style={styles.footer}>
          SIGGA | {ATER_SOCIOBIO_MODULE_NAME} | {ATER_SOCIOBIO_TERRITORY_NAME} | Gerado em {formatDate(new Date())}
        </Text>
      </Page>
    </Document>
  );
}
