import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

import { ATER_SOCIOBIO_TERRITORY_NAME } from "@/lib/constants/ater-sociobio";

type EixoData = {
  tipoAcao?: string;
  etapa?: string;
  impactosAnteriores?: string;
  desenvolvimento?: string;
  recomendacoes?: string;
} | null;

type AtendimentoPdfData = {
  id: string;
  numeroVisita: number;
  data: Date | null;
  statusRelatorio: string;
  houveAtendimento: boolean | null;
  enviadoSGA: boolean;
  dataEnvioSGA: Date | null;
  projetoId: string | null;
  projetoTitulo: string | null;
  familia: {
    nomeFamilia: string;
    nomeResponsavel: string | null;
    municipio: string | null;
    comunidade: string | null;
    ufpa: string | null;
    codigoSGA: string | null;
    nis: string | null;
  } | null;
  tecnicoNome: string | null;
  tecnicoRegistro: string | null;
  eixoProdutivo: EixoData;
  eixoSocial: EixoData;
  eixoAmbiental: EixoData;
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingBottom: 40,
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
  },
  value: {
    fontSize: 10,
    color: "#0f172a",
    lineHeight: 1.4,
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
});

function formatDate(value: Date | null) {
  return value ? new Intl.DateTimeFormat("pt-BR").format(value) : "-";
}

function safeText(value: string | null | undefined) {
  return value?.trim() ? value : "-";
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

function EixoSection({
  title,
  data,
}: {
  title: string;
  data: EixoData;
}) {
  if (!data) {
    return null;
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.grid}>
        <PdfField label="Tipo de acao" value={safeText(data.tipoAcao)} />
        <PdfField label="Etapa" value={safeText(data.etapa)} />
        <PdfField label="Impactos anteriores" value={safeText(data.impactosAnteriores)} full />
        <PdfField label="Desenvolvimento" value={safeText(data.desenvolvimento)} full />
        <PdfField label="Recomendacoes" value={safeText(data.recomendacoes)} full />
      </View>
    </View>
  );
}

export function AtendimentoReportPdf({ atendimento }: { atendimento: AtendimentoPdfData }) {
  const projeto = atendimento.projetoTitulo ?? atendimento.projetoId ?? "-";

  return (
    <Document
      title={`ATER Sociobio - Visita ${atendimento.numeroVisita}`}
      author="SIGGA"
      subject="Relatorio de atendimento ATER Sociobio"
      creator="SIGGA"
      producer="SIGGA"
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>ATER Sociobio | {ATER_SOCIOBIO_TERRITORY_NAME}</Text>
          <Text style={styles.title}>Relatorio de Atendimento Tecnico</Text>
          <Text style={styles.subtitle}>
            Documento consolidado da visita tecnica para uso operacional e eventual envio institucional.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Identificacao da visita</Text>
          <View style={styles.grid}>
            <PdfField label="Numero da visita" value={`#${atendimento.numeroVisita}`} />
            <PdfField label="Data" value={formatDate(atendimento.data)} />
            <PdfField label="Status do relatorio" value={safeText(atendimento.statusRelatorio)} />
            <PdfField label="Houve atendimento" value={atendimento.houveAtendimento ? "Sim" : "Nao"} />
            <PdfField label="Enviado ao SGA" value={atendimento.enviadoSGA ? "Sim" : "Nao"} />
            <PdfField label="Data envio SGA" value={formatDate(atendimento.dataEnvioSGA)} />
            <PdfField label="Projeto" value={safeText(projeto)} full />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Familia atendida</Text>
          <View style={styles.grid}>
            <PdfField label="Nome da familia" value={safeText(atendimento.familia?.nomeFamilia)} />
            <PdfField label="Responsavel" value={safeText(atendimento.familia?.nomeResponsavel)} />
            <PdfField label="Municipio" value={safeText(atendimento.familia?.municipio)} />
            <PdfField label="Comunidade" value={safeText(atendimento.familia?.comunidade)} />
            <PdfField label="UFPA" value={safeText(atendimento.familia?.ufpa)} />
            <PdfField label="Codigo SGA" value={safeText(atendimento.familia?.codigoSGA)} />
            <PdfField label="NIS" value={safeText(atendimento.familia?.nis)} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Responsavel tecnico</Text>
          <View style={styles.grid}>
            <PdfField label="Tecnico" value={safeText(atendimento.tecnicoNome)} />
            <PdfField label="Registro" value={safeText(atendimento.tecnicoRegistro)} />
          </View>
        </View>

        <EixoSection title="Eixo Produtivo" data={atendimento.eixoProdutivo} />
        <EixoSection title="Eixo Social" data={atendimento.eixoSocial} />
        <EixoSection title="Eixo Ambiental" data={atendimento.eixoAmbiental} />

        <Text style={styles.footer}>
          SIGGA | ATER Sociobio | {ATER_SOCIOBIO_TERRITORY_NAME} | Documento gerado automaticamente
        </Text>
      </Page>
    </Document>
  );
}
