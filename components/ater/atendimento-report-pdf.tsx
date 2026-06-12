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
  getAterSociobioStatusRelatorioLabel,
} from "@/lib/constants/ater-sociobio";

type EixoData = {
  tecnologiaProducao?: string;
  atividadeProdutiva?: string;
  orientacoes?: string;
  outrasAtividadesUfpa?: string;
  orientacoesEncaminhamentos?: string;
  atividadeSocial?: string;
  tecnologiaAmbiental?: string;
  atividadeAmbiental?: string;
  resultadosParciaisFinais?: string[];
  indicadoresTrabalhados?: string[];
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
  atividadeNumeroTotal: string | null;
  codigoMeta: string | null;
  descricaoMeta: string | null;
  numeroMulheres: number | null;
  numeroJovens: number | null;
  familia: {
    nomeFamilia: string;
    nomeResponsavel: string | null;
    documentoResponsavel: string | null;
    municipio: string | null;
    comunidade: string | null;
    ufpa: string | null;
    codigoSGA: string | null;
    nis: string | null;
    dapCaf: string | null;
    grupoInteresse: string | null;
    organizacaoColetivaNome: string | null;
    programaFomento: string | null;
    statusGestor: string | null;
    quantidadeIntegrantes: number | null;
    diagnostico: {
      dataDiagnostico: Date | null;
      possuiInternet: boolean | null;
      aguaParaConsumo: boolean | null;
      aguaConsumoTratada: boolean | null;
      esgotoTratado: boolean | null;
    } | null;
    indicadores: {
      alimentacaoVariadaComprometida: boolean | null;
      comidaAcabouSemCondicao: boolean | null;
      deixouRefeicaoSemCondicao: boolean | null;
      comeuMenosSemCondicao: boolean | null;
      sentiuFomeENaoComeu: boolean | null;
      cadastradoCadUnico: boolean | null;
      acessaPoliticasSociais: boolean | null;
      participaGrupoComunitario: boolean | null;
      possuiPraticasSustentaveis: boolean | null;
    } | null;
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

function formatDate(value: Date | null) {
  return value ? new Intl.DateTimeFormat("pt-BR").format(value) : "-";
}

function safeText(value: string | null | undefined) {
  return value?.trim() ? value : "-";
}

function formatBoolean(value: boolean | null | undefined) {
  if (value === true) return "Sim";
  if (value === false) return "Não";
  return "-";
}

function formatNumber(value: number | null | undefined) {
  return typeof value === "number" ? String(value) : "-";
}

function formatList(value: string[] | undefined) {
  if (!Array.isArray(value) || value.length === 0) return "-";
  return value.join("; ");
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
  const isProdutivo = title.toLowerCase().includes("produtivo");
  const isSocial = title.toLowerCase().includes("social");
  const fields: Array<[string, string | undefined]> = isProdutivo
    ? [
        ["Tecnologia de produção", data.tecnologiaProducao],
        ["Atividade produtiva", data.atividadeProdutiva],
        ["Orientações", data.orientacoes],
        ["Outras atividades da UFPA", data.outrasAtividadesUfpa],
      ]
    : isSocial
      ? [
          ["Orientações / encaminhamentos", data.orientacoesEncaminhamentos],
          ["Atividade social", data.atividadeSocial],
          ["Orientações", data.orientacoes],
        ]
      : [
          ["Tecnologia ambiental", data.tecnologiaAmbiental],
          ["Atividade ambiental", data.atividadeAmbiental],
          ["Orientações", data.orientacoes],
        ];
  const hasLegacyData = Boolean(
    data.tipoAcao || data.etapa || data.impactosAnteriores || data.desenvolvimento || data.recomendacoes,
  );

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.grid}>
        {fields.map(([fieldLabel, value]) => (
          <PdfField key={fieldLabel} label={fieldLabel} value={safeText(value)} full />
        ))}
        <PdfField label="Resultados parciais/finais" value={formatList(data.resultadosParciaisFinais)} full />
        <PdfField label="Indicadores trabalhados" value={formatList(data.indicadoresTrabalhados)} full />
        {hasLegacyData && (
          <>
            <PdfField label="Tipo de ação anterior" value={safeText(data.tipoAcao)} />
            <PdfField label="Etapa anterior" value={safeText(data.etapa)} />
            <PdfField label="Impactos anteriores" value={safeText(data.impactosAnteriores)} full />
            <PdfField label="Desenvolvimento anterior" value={safeText(data.desenvolvimento)} full />
            <PdfField label="Recomendações anteriores" value={safeText(data.recomendacoes)} full />
          </>
        )}
      </View>
    </View>
  );
}

export function AtendimentoReportPdf({ atendimento }: { atendimento: AtendimentoPdfData }) {
  const projeto = atendimento.projetoTitulo ?? atendimento.projetoId ?? "-";
  const diagnostico = atendimento.familia?.diagnostico;
  const indicadores = atendimento.familia?.indicadores;
  const hasResumoDiagnostico = Boolean(diagnostico || indicadores);
  const insegurancaAlimentar = indicadores
    ? [
        indicadores.alimentacaoVariadaComprometida,
        indicadores.comidaAcabouSemCondicao,
        indicadores.deixouRefeicaoSemCondicao,
        indicadores.comeuMenosSemCondicao,
        indicadores.sentiuFomeENaoComeu,
      ].some(Boolean)
    : null;

  return (
    <Document
      title={`${ATER_SOCIOBIO_MODULE_NAME} - Visita ${atendimento.numeroVisita}`}
      author="SIGGA"
      subject={`Relatório técnico de visita individual - ${ATER_SOCIOBIO_MODULE_NAME}`}
      creator="SIGGA"
      producer="SIGGA"
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>{ATER_SOCIOBIO_MODULE_NAME} | {ATER_SOCIOBIO_TERRITORY_NAME}</Text>
          <Text style={styles.title}>Relatório Técnico de Visita Individual de ATER - Sociobiodiversidade</Text>
          <Text style={styles.subtitle}>
            Documento consolidado da visita técnica individual, com UFPA, atividade, meta e eixos trabalhados.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Identificação da visita</Text>
          <View style={styles.grid}>
            <PdfField label="Número da visita" value={`#${atendimento.numeroVisita}`} />
            <PdfField label="Data" value={formatDate(atendimento.data)} />
            <PdfField label="Status do relatório" value={getAterSociobioStatusRelatorioLabel(atendimento.statusRelatorio)} />
            <PdfField label="Houve atendimento" value={formatBoolean(atendimento.houveAtendimento)} />
            <PdfField label="Enviado ao SGA" value={formatBoolean(atendimento.enviadoSGA)} />
            <PdfField label="Data envio SGA" value={formatDate(atendimento.dataEnvioSGA)} />
            <PdfField label="Projeto" value={safeText(projeto)} full />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Atividade</Text>
          <View style={styles.grid}>
            <PdfField label="Atividade número / total planejado" value={safeText(atendimento.atividadeNumeroTotal)} />
            <PdfField label="Código da Meta" value={safeText(atendimento.codigoMeta)} />
            <PdfField label="Descrição da Meta" value={safeText(atendimento.descricaoMeta)} full />
            <PdfField label="Nº Mulheres no atendimento" value={formatNumber(atendimento.numeroMulheres)} />
            <PdfField label="Nº Jovens no atendimento" value={formatNumber(atendimento.numeroJovens)} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>UFPA atendida</Text>
          <View style={styles.grid}>
            <PdfField label="Denominação da UFPA" value={safeText(atendimento.familia?.nomeFamilia)} />
            <PdfField label="Responsável" value={safeText(atendimento.familia?.nomeResponsavel)} />
            <PdfField label="CPF do responsável" value={safeText(atendimento.familia?.documentoResponsavel)} />
            <PdfField label="Município" value={safeText(atendimento.familia?.municipio)} />
            <PdfField label="Comunidade" value={safeText(atendimento.familia?.comunidade)} />
            <PdfField label="Código/identificação UFPA" value={safeText(atendimento.familia?.ufpa)} />
            <PdfField label="Código SGA" value={safeText(atendimento.familia?.codigoSGA)} />
            <PdfField label="NIS" value={safeText(atendimento.familia?.nis)} />
            <PdfField label="DAP/CAF" value={safeText(atendimento.familia?.dapCaf)} />
            <PdfField label="Grupo de interesse" value={safeText(atendimento.familia?.grupoInteresse)} />
            <PdfField label="Organização coletiva" value={safeText(atendimento.familia?.organizacaoColetivaNome)} />
            <PdfField label="Integrantes" value={atendimento.familia?.quantidadeIntegrantes?.toString() ?? "-"} />
            <PdfField label="Programa de fomento" value={safeText(atendimento.familia?.programaFomento)} />
            <PdfField label="Status gestor" value={safeText(atendimento.familia?.statusGestor)} />
          </View>
        </View>

        {hasResumoDiagnostico && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Resumo do diagnóstico da UFPA</Text>
            <View style={styles.grid}>
              <PdfField label="Data do diagnóstico" value={formatDate(diagnostico?.dataDiagnostico ?? null)} />
              <PdfField label="Tem internet" value={formatBoolean(diagnostico?.possuiInternet)} />
              <PdfField label="Água para consumo" value={formatBoolean(diagnostico?.aguaParaConsumo)} />
              <PdfField label="Água tratada" value={formatBoolean(diagnostico?.aguaConsumoTratada)} />
              <PdfField label="Esgoto tratado" value={formatBoolean(diagnostico?.esgotoTratado)} />
              <PdfField label="Cadastrado no CadÚnico" value={formatBoolean(indicadores?.cadastradoCadUnico)} />
              <PdfField label="Acessa políticas sociais" value={formatBoolean(indicadores?.acessaPoliticasSociais)} />
              <PdfField label="Participa de grupo comunitário" value={formatBoolean(indicadores?.participaGrupoComunitario)} />
              <PdfField label="Possui práticas sustentáveis" value={formatBoolean(indicadores?.possuiPraticasSustentaveis)} />
              <PdfField label="Indicador de insegurança alimentar" value={formatBoolean(insegurancaAlimentar)} />
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Responsável técnico</Text>
          <View style={styles.grid}>
            <PdfField label="Técnico" value={safeText(atendimento.tecnicoNome)} />
            <PdfField label="Registro" value={safeText(atendimento.tecnicoRegistro)} />
          </View>
        </View>

        <EixoSection title="Eixo Produtivo" data={atendimento.eixoProdutivo} />
        <EixoSection title="Eixo Social" data={atendimento.eixoSocial} />
        <EixoSection title="Eixo Ambiental" data={atendimento.eixoAmbiental} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Assinaturas</Text>
          <View style={styles.signatureRow}>
            <View style={styles.signatureBox}>
              <View style={styles.signatureLine}>
                <Text style={styles.value}>Responsável pela UFPA</Text>
                <Text style={styles.signatureNote}>Assinatura ou impressão digital</Text>
              </View>
            </View>
            <View style={styles.signatureBox}>
              <View style={styles.signatureLine}>
                <Text style={styles.value}>Profissional responsável pela orientação</Text>
                <Text style={styles.signatureNote}>Sigla e Registro do Conselho Profissional / UF</Text>
              </View>
            </View>
          </View>
        </View>

        <Text style={styles.footer}>
          SIGGA | {ATER_SOCIOBIO_MODULE_NAME} | {ATER_SOCIOBIO_TERRITORY_NAME} | Documento gerado automaticamente
        </Text>
      </Page>
    </Document>
  );
}
