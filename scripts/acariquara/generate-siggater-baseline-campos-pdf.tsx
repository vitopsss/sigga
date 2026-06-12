import path from "node:path";
import React from "react";
import { Document, Page, StyleSheet, Text, View, renderToFile } from "@react-pdf/renderer";

const outputPath = path.resolve(
  process.cwd(),
  "docs",
  "acariquara",
  "contratacao",
  "Baseline_Campos_Essenciais.pdf",
);

const styles = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingBottom: 42,
    paddingHorizontal: 42,
    fontFamily: "Helvetica",
    fontSize: 9.4,
    color: "#1f2933",
    lineHeight: 1.45,
  },
  title: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    textTransform: "uppercase",
    borderBottomWidth: 3,
    borderBottomColor: "#174c3c",
    paddingBottom: 8,
  },
  subtitle: {
    marginTop: 10,
    marginBottom: 12,
    textAlign: "center",
    fontSize: 10.4,
    fontFamily: "Helvetica-Bold",
  },
  section: {
    marginTop: 10,
  },
  sectionTitle: {
    marginBottom: 6,
    paddingVertical: 5,
    paddingHorizontal: 9,
    backgroundColor: "#eef6f1",
    borderLeftWidth: 5,
    borderLeftColor: "#174c3c",
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    textTransform: "uppercase",
  },
  paragraph: {
    marginBottom: 6,
    textAlign: "justify",
  },
  bulletRow: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 4,
    gap: 5,
  },
  bullet: {
    width: 9,
    color: "#174c3c",
    fontFamily: "Helvetica-Bold",
  },
  bulletText: {
    flex: 1,
  },
  notice: {
    marginTop: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    backgroundColor: "#f8fafc",
  },
  footer: {
    position: "absolute",
    bottom: 18,
    left: 42,
    right: 42,
    borderTopWidth: 1,
    borderTopColor: "#d1d5db",
    paddingTop: 6,
    textAlign: "center",
    fontSize: 7.6,
    color: "#64748b",
  },
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <View>
      {items.map((item) => (
        <View key={item} style={styles.bulletRow}>
          <Text style={styles.bullet}>-</Text>
          <Text style={styles.bulletText}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

export function BaselinePages() {
  return (
    <>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Anexo I - Baseline de Escopo</Text>
        <Text style={styles.subtitle}>Baseline operacional de homologação - Fase 1 SIGGATER Web</Text>

        <Section title="1. Objetivo">
          <Text style={styles.paragraph}>
            Este anexo delimita o baseline operacional mínimo da Fase 1 do SIGGATER Web, conforme as prioridades discutidas
            nas reuniões técnicas com o Instituto Acariquara e os modelos encaminhados para referência do ATERSOCIOBIO.
          </Text>
          <Text style={styles.paragraph}>
            O objetivo do baseline é orientar a homologação inicial e evitar dúvida sobre o núcleo de entrega da Fase 1. Ele
            não incorpora automaticamente todas as regras, exigências, campos complementares, validações ou rotinas previstas
            em editais, contratos de ATER ou documentos oficiais que não estejam expressamente priorizados nesta fase.
          </Text>
        </Section>

        <Section title="2. Diretriz técnica">
          <BulletList
            items={[
              "Os campos serão implementados por meio de texto livre, números, datas, listas suspensas, seleção simples, seleção múltipla, anexos simples e botões de salvar/consultar/exportar.",
              "As métricas serão derivadas dos dados preenchidos no sistema, sem validação automática contra bases externas, SGA, ANATER ou sistemas de terceiros.",
              "A homologação da Fase 1 deve considerar a existência e funcionamento operacional dos campos, fluxos e métricas previstos neste baseline.",
              "Campos complementares dos modelos oficiais poderão ser avaliados durante a homologação e priorizados quando compatíveis com o cronograma e esforço da Fase 1.",
              "A reprodução visual integral, pixel-perfect ou oficial de todos os formulários originais permanece fora da Fase 1, salvo quando pactuada por aditivo.",
            ]}
          />
        </Section>

        <Section title="3. Cadastro e diagnóstico da UFPA">
          <BulletList
            items={[
              "Identificação da UFPA: denominação, responsável, documento do responsável, DAP/CAF quando informado, município, comunidade, endereço, organização coletiva ou grupo de interesse e programa de fomento.",
              "Localização e enquadramento operacional: informações de território, classificação, bioma, coordenadas geográficas e dados complementares necessários ao acompanhamento de campo.",
              "Diagnóstico socioambiental priorizado: água para consumo, água tratada, esgoto/saneamento, internet, CadÚnico, políticas públicas, segurança alimentar, participação comunitária e práticas ambientais.",
              "Diagnóstico produtivo priorizado: atividade produtiva, produção, unidade, atividade principal, recursos disponíveis e informações necessárias para apoiar o plano de ação da UFPA.",
              "Campos complementares de patrimônio, plantel, áreas, recursos, participação, ações potenciais e limitações poderão ser registrados quando priorizados na homologação e compatíveis com a Fase 1.",
              "Anexo simples do termo LGPD assinado, com registro operacional vinculado à UFPA quando disponibilizado pela equipe.",
            ]}
          />
        </Section>

        <Section title="4. Integrantes e políticas públicas">
          <BulletList
            items={[
              "Integrantes da UFPA: dados de identificação, CPF, NIS/CadÚnico quando informado, nome, data de nascimento, escolaridade, telefones, responsável pela UFPA e parentesco.",
              "Dados complementares de integrantes previstos no modelo oficial poderão ser registrados quando necessários à rotina de homologação da Fase 1.",
              "Políticas públicas por integrante: integrante, política pública acessada e último ano de adesão, quando informado pela equipe.",
              "O sistema permitirá múltiplos integrantes por UFPA, sem limite rígido de quantidade definido no baseline da Fase 1.",
            ]}
          />
        </Section>

        <Section title="5. Indicadores da UFPA">
          <BulletList
            items={[
              "Segurança Alimentar e Nutricional: respostas do bloco de alimentação previsto no modelo, incluindo ocorrência de restrição alimentar, falta de comida, redução de refeições e fome.",
              "Serviços sociais básicos: documentação pessoal, CadÚnico e acesso a políticas públicas sociais, com campo de quais quando aplicável.",
              "Participação comunitária: participação em grupo comunitário e tipo de grupo quando informado.",
              "Ambiental: existência de práticas sustentáveis, tipos de práticas e motivos de não adoção quando aplicável.",
              "Econômico e produtivo: valor bruto da produção, acesso a políticas públicas produtivas, PAA, PNAE, PGPM-Bio, PRONAF e canais de comercialização quando priorizados na Fase 1.",
            ]}
          />
        </Section>

        <Text style={styles.footer}>SIGGATER Web - Baseline de Escopo - Fase 1 Instituto Acariquara</Text>
      </Page>

      <Page size="A4" style={styles.page}>
        <Section title="6. Organização coletiva">
          <BulletList
            items={[
              "Cadastro da organização social: denominação, município, data, número de famílias, agente de ATER quando informado e atividades produtivas, extrativismo ou serviços da organização.",
              "Vínculo com UFPAs: associação de famílias/UFPAs à organização coletiva ou grupo de interesse correspondente.",
              "Indicadores ambientais priorizados: práticas ambientais, descarte de lixo, tratamento de dejetos, captação de água, educação ambiental e prevenção de riscos quando informados.",
              "Indicadores sociais priorizados: identidade comercial, participação de mulheres e jovens na direção ou conselho, representação política e selos/marcas quando informados.",
              "Indicadores econômicos priorizados: acesso a políticas públicas e canais de comercialização utilizados pela organização.",
              "Campos complementares do modelo oficial da organização coletiva poderão ser registrados quando priorizados na homologação e compatíveis com a Fase 1.",
            ]}
          />
        </Section>

        <Section title="7. Atendimento e relatório técnico de visita individual">
          <BulletList
            items={[
              "Identificação do atendimento: UFPA, técnico responsável, data, número da visita, status do relatório, projeto/referência operacional, houve atendimento e vínculo com organização coletiva quando disponível.",
              "Campos de atividade: atividade número/total planejado, código da meta, descrição da meta, número de mulheres no atendimento e número de jovens no atendimento.",
              "Eixo produtivo: tecnologia de produção, atividade produtiva, orientações, outras atividades da UFPA, resultados parciais/finais e indicadores trabalhados.",
              "Eixo social: orientações/encaminhamentos, atividade social, orientações, resultados parciais/finais e indicadores trabalhados.",
              "Eixo ambiental: tecnologia ambiental, atividade ambiental, orientações, resultados parciais/finais e indicadores trabalhados.",
              "PDF individual por visita técnica em layout operacional do SIGGATER Web, com área de assinaturas para responsável pela UFPA e profissional responsável pela orientação.",
            ]}
          />
        </Section>

        <Section title="8. Métricas operacionais da Fase 1">
          <BulletList
            items={[
              "UFPAs: total de UFPAs, UFPAs com/sem diagnóstico, com/sem DAP/CAF quando informado, com/sem SGA quando informado, por território, organização coletiva e status de acompanhamento.",
              "Diagnóstico da UFPA: água, saneamento, internet, CadÚnico, insegurança alimentar, políticas públicas, práticas ambientais e demais indicadores priorizados pela coordenação na homologação.",
              "Organizações coletivas: total de organizações, famílias vinculadas, práticas ambientais, identidade comercial, participação de mulheres/jovens na direção, políticas públicas e canais de comercialização quando informados.",
              "Atendimentos: total de visitas, visitas por período, técnico, UFPA e organização coletiva, mulheres atendidas, jovens atendidos, eixos trabalhados e indicadores trabalhados no atendimento.",
              "As métricas serão apresentadas como painéis operacionais, filtros e consultas de apoio à coordenação, não como BI avançado, auditoria automatizada ou prestação de contas oficial automatizada.",
            ]}
          />
        </Section>

        <Section title="9. Itens não abrangidos por este baseline">
          <View style={styles.notice}>
            <BulletList
              items={[
                "Validação automática de documentos em bases externas, conferência documental automatizada ou bloqueio de fluxo por ausência de documento.",
                "Cálculo automático de cumprimento de cotas, metas físicas ou exigências normativas externas fora dos campos e métricas operacionais descritos neste anexo.",
                "Integração com SGA, ANATER, sistemas públicos ou plataformas de terceiros.",
                "Uso offline, aplicativo móvel nativo, importação massiva automatizada, assinatura digital avançada, mala direta, geração massiva de PDFs ou dashboards avançados.",
                "Campos, formulários, regras, relatórios ou rotinas de outros projetos de ATER que não tenham sido expressamente incorporados à Fase 1 por escrito.",
              ]}
            />
          </View>
        </Section>

        <Section title="10. Observação final">
          <Text style={styles.paragraph}>
            Este baseline integra a interpretação operacional da Fase 1. Demandas compatíveis com os campos e fluxos aqui
            descritos serão tratadas como parte da homologação. Demandas que ampliem regras, validações, integrações, layouts,
            automações, projetos atendidos ou complexidade de análise deverão ser avaliadas como evolução, ajuste de escopo ou
            aditivo contratual específico.
          </Text>
        </Section>

        <Text style={styles.footer}>SIGGATER Web - Baseline de Escopo - Fase 1 Instituto Acariquara</Text>
      </Page>
    </>
  );
}

function BaselineDocument() {
  return (
    <Document
      title="Baseline de Escopo - Campos Essenciais SIGGATER Web"
      author="João Victor Passos"
      subject="Anexo I da Proposta Técnica e Comercial Revisada - SIGGATER Web Fase 1"
      creator="SIGGA"
      producer="SIGGA"
    >
      <BaselinePages />
    </Document>
  );
}

async function main() {
  await renderToFile(<BaselineDocument />, outputPath);
  console.log(`PDF gerado com sucesso em ${outputPath}`);
}

if (path.basename(process.argv[1] ?? "") === "generate-siggater-baseline-campos-pdf.tsx") {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
