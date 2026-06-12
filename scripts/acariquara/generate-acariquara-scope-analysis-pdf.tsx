import path from "node:path";
import React from "react";
import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
  renderToFile,
} from "@react-pdf/renderer";

const outputPath = path.resolve(
  process.cwd(),
  "docs",
  "acariquara",
  "contratacao",
  "Analise_Escopo_SIGGATER_para_Avaliacao.pdf",
);

const issueDate = new Intl.DateTimeFormat("pt-BR").format(new Date());

const styles = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingBottom: 42,
    paddingHorizontal: 44,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#18221d",
    lineHeight: 1.45,
  },
  title: {
    fontSize: 16.5,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    textTransform: "uppercase",
    color: "#174c3c",
    borderBottomWidth: 3,
    borderBottomColor: "#174c3c",
    paddingBottom: 8,
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 12,
    textAlign: "center",
    fontSize: 10.5,
    fontFamily: "Helvetica-Bold",
  },
  metaBox: {
    borderWidth: 1,
    borderColor: "#cfd8d2",
    backgroundColor: "#f7faf8",
    padding: 10,
    marginBottom: 10,
  },
  metaText: {
    marginBottom: 3,
  },
  callout: {
    borderLeftWidth: 5,
    borderLeftColor: "#174c3c",
    backgroundColor: "#eef6f1",
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginTop: 5,
    marginBottom: 9,
  },
  calloutText: {
    fontFamily: "Helvetica-Bold",
  },
  section: {
    marginTop: 9,
  },
  sectionTitle: {
    marginBottom: 5,
    paddingVertical: 5,
    paddingHorizontal: 9,
    backgroundColor: "#f1f3f2",
    borderLeftWidth: 5,
    borderLeftColor: "#174c3c",
    fontFamily: "Helvetica-Bold",
    fontSize: 10.4,
    textTransform: "uppercase",
  },
  paragraph: {
    marginBottom: 5,
  },
  bullet: {
    flexDirection: "row",
    marginBottom: 3,
  },
  bulletMarker: {
    width: 10,
    fontFamily: "Helvetica-Bold",
  },
  bulletText: {
    flex: 1,
  },
  footer: {
    position: "absolute",
    left: 44,
    right: 44,
    bottom: 20,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: "#d9dfdc",
    color: "#607068",
    fontSize: 8,
    textAlign: "center",
  },
});

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Paragraph({ children }: { children: React.ReactNode }) {
  return <Text style={styles.paragraph}>{children}</Text>;
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.bullet}>
      <Text style={styles.bulletMarker}>-</Text>
      <Text style={styles.bulletText}>{children}</Text>
    </View>
  );
}

function Footer() {
  return (
    <Text
      style={styles.footer}
      render={({ pageNumber, totalPages }) =>
        `SIGGATER Web - Analise de escopo e proposta | Pagina ${pageNumber} de ${totalPages}`
      }
      fixed
    />
  );
}

function ScopeAnalysisDocument() {
  return (
    <Document
      title="Analise de Escopo - SIGGATER Web"
      author="Joao Victor Passos"
      subject="Analise da proposta SIGGATER para avaliacao familiar"
      creator="SIGGA"
      producer="SIGGA"
    >
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Análise de Escopo e Risco Comercial</Text>
        <Text style={styles.subtitle}>
          SIGGATER Web | Instituto Acariquara | Preparado em {issueDate}
        </Text>

        <View style={styles.metaBox}>
          <Text style={styles.metaText}>Objetivo: explicar a situação para avaliação antes de atualizar a proposta.</Text>
          <Text style={styles.metaText}>Valor inicialmente apresentado: R$ 21.900,00.</Text>
          <Text style={styles.metaText}>Ponto central: a compreensão do plano de trabalho ficou mais completa após a reunião e os modelos enviados.</Text>
        </View>

        <View style={styles.callout}>
          <Text style={styles.calloutText}>
            A dúvida principal é decidir entre manter o valor com uma Fase 1 bem delimitada, ou atualizar o valor porque agora
            ficou mais claro que o plano de trabalho exige diagnóstico estruturado, indicadores e métricas.
          </Text>
        </View>

        <Section title="1. Situação resumida">
          <Paragraph>
            O João enviou uma proposta inicial para o Instituto Acariquara, no valor de R$ 21.900,00, para a Fase 1 do
            SIGGATER Web. A proposta original tinha um escopo controlado: cadastro-base, equipe técnica, registro de visitas,
            controle operacional, relatórios-base e PDF individual por visita.
          </Paragraph>
          <Paragraph>
            Depois disso, o Instituto pediu que o sistema não ficasse limitado apenas ao projeto ATERSOCIOBIO, mas pudesse
            atender as atividades de ATER do Instituto de forma mais ampla.
          </Paragraph>
          <Paragraph>
            Na reunião técnica, a equipe enviou modelos oficiais de cadastro, diagnóstico, indicadores e relatório. A partir
            desses documentos, ficou claro que o entendimento inicial do plano de trabalho ainda estava incompleto.
          </Paragraph>
        </Section>

        <Section title="2. O que estava na proposta original">
          <Bullet>Cadastro-base de famílias/beneficiários.</Bullet>
          <Bullet>Cadastro e gestão da equipe técnica.</Bullet>
          <Bullet>Registro de visitas técnicas.</Bullet>
          <Bullet>Acompanhamento dos eixos produtivo, social e ambiental.</Bullet>
          <Bullet>Controle operacional ligado ao SGA.</Bullet>
          <Bullet>Consultas, filtros e relatórios-base.</Bullet>
          <Bullet>PDF individual por visita técnica.</Bullet>
          <Bullet>Perfis de acesso para administração, coordenação e operação.</Bullet>
        </Section>

        <Footer />
      </Page>

      <Page size="A4" style={styles.page}>
        <Section title="3. O que ficou claro depois da reunião">
          <Paragraph>
            Com os modelos enviados, ficou mais claro que o ATERSOCIOBIO não é apenas um fluxo de cadastro e visita. Ele possui
            uma lógica própria de cadastro, diagnóstico, indicadores e acompanhamento.
          </Paragraph>
          <Bullet>Cadastro da UFPA, isto é, Unidade Familiar de Produção Agrária.</Bullet>
          <Bullet>Cadastro de integrantes/membros da unidade familiar.</Bullet>
          <Bullet>Vínculo com organização coletiva, associação, cooperativa ou grupo de interesse.</Bullet>
          <Bullet>DAP/CAF, órgão emissor, validade e programa de fomento.</Bullet>
          <Bullet>Diagnóstico social, produtivo/econômico e ambiental.</Bullet>
          <Bullet>Indicadores da UFPA.</Bullet>
          <Bullet>Indicadores da organização coletiva.</Bullet>
          <Bullet>Status como enviado ao SGA, aprovado pelo gestor e reprovado pelo gestor.</Bullet>
          <Bullet>Métricas para entender vulnerabilidades e orientar plano de ação.</Bullet>
        </Section>

        <Section title="4. Por que isso muda a leitura do projeto">
          <Paragraph>
            A proposta original parecia mais próxima de um sistema operacional para registrar visitas e gerar relatório. O
            plano de trabalho completo se aproxima de uma base de diagnóstico e inteligência operacional para gestão da ATER.
          </Paragraph>
          <Paragraph>
            Isso significa mais telas, mais campos, mais regras, mais validação, mais estrutura de banco de dados e mais
            responsabilidade sobre a qualidade das métricas.
          </Paragraph>
          <Paragraph>
            Exemplos de métricas esperadas: quantas UFPAs não têm água tratada, quantas têm insegurança alimentar, quantas não
            têm internet, quantas não têm CadÚnico, quantas acessam políticas públicas, quantas têm DAP/CAF, quantas estão
            vinculadas a organização coletiva e quais precisam de plano de ação prioritário.
          </Paragraph>
        </Section>

        <Section title="5. Risco comercial">
          <Paragraph>
            O risco não é dizer que o Instituto pediu algo indevido. O ponto é que a proposta inicial foi precificada antes de
            o João compreender completamente o plano de trabalho, os modelos oficiais e a importância das métricas.
          </Paragraph>
          <Paragraph>
            Se o preço de R$ 21.900,00 for mantido sem delimitação, o João pode assumir uma entrega maior do que a que havia
            sido entendida inicialmente, sem ajuste de prazo, valor ou limite funcional.
          </Paragraph>
          <Paragraph>
            Ao mesmo tempo, eles já tinham aceitado comercialmente a proposta original. Por isso, qualquer ajuste precisa ser
            apresentado como refinamento após análise técnica dos modelos, não como cobrança de última hora.
          </Paragraph>
        </Section>

        <Footer />
      </Page>

      <Page size="A4" style={styles.page}>
        <Section title="6. Caminho seguro">
          <Paragraph>
            A saída mais segura é atualizar a proposta separando a Fase 1 das evoluções posteriores.
          </Paragraph>
          <Paragraph>
            Fase 1 dentro do valor original, se for o caminho escolhido:
          </Paragraph>
          <Bullet>Cadastro da UFPA.</Bullet>
          <Bullet>Integrantes básicos.</Bullet>
          <Bullet>Organização coletiva básica.</Bullet>
          <Bullet>Diagnóstico estruturado essencial.</Bullet>
          <Bullet>Indicadores essenciais.</Bullet>
          <Bullet>Métricas operacionais básicas.</Bullet>
          <Bullet>Relatório individual por visita.</Bullet>
          <Paragraph>
            Evoluções ou aditivos:
          </Paragraph>
          <Bullet>Implementação integral de todos os campos dos cinco modelos.</Bullet>
          <Bullet>Dashboards avançados.</Bullet>
          <Bullet>PDF oficial fiel ao layout original.</Bullet>
          <Bullet>Mala direta e geração em lote.</Bullet>
          <Bullet>Importação em massa.</Bullet>
          <Bullet>Integração com SGA/ANATER.</Bullet>
          <Bullet>Aplicativo offline.</Bullet>
          <Bullet>Assinatura digital e anexos obrigatórios.</Bullet>
        </Section>

        <Section title="7. Se for ajustar o valor">
          <Paragraph>
            Existe justificativa técnica para ajustar o valor, mas o argumento precisa ser formulado com cuidado. A ideia não é
            dizer que o Instituto mudou tudo, e sim que a análise dos modelos permitiu compreender melhor a complexidade real
            da Fase 1.
          </Paragraph>
          <Paragraph>
            Frase possível:
          </Paragraph>
          <View style={styles.callout}>
            <Text style={styles.calloutText}>
              "Após a reunião técnica e análise dos modelos enviados, consegui compreender melhor o plano de trabalho do
              ATERSOCIOBIO e o nível de estruturação necessário para cadastro, diagnóstico, indicadores e métricas. Por isso,
              encaminharei a proposta revisada com o escopo atualizado para validação."
            </Text>
          </View>
        </Section>

        <Section title="8. Pergunta para decidir">
          <Paragraph>
            A decisão principal é:
          </Paragraph>
          <Bullet>Manter os R$ 21.900,00 e limitar bem a Fase 1; ou</Bullet>
          <Bullet>Atualizar o valor para refletir diagnóstico estruturado, indicadores e métricas.</Bullet>
          <Paragraph>
            O erro não seria manter o preço. O erro seria manter o preço e aceitar tudo completo sem delimitar o que entra agora
            e o que fica para aditivo.
          </Paragraph>
        </Section>

        <Footer />
      </Page>
    </Document>
  );
}

async function main() {
  await renderToFile(<ScopeAnalysisDocument />, outputPath);
  console.log(`PDF generated: ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
