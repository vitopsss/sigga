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
  "Proposta_Tecnica_Comercial_SIGGATER_ATERSOCIOBIO_Fase_1.pdf",
);

const totalValue = 21900;
const installments = [
  {
    label: "Marco 0: contratação, setup inicial e alinhamento final do fluxo do ATERSOCIOBIO",
    amount: 6570,
  },
  {
    label: "Entrega 1: cadastro-base, perfis de acesso e estrutura operacional do projeto",
    amount: 6570,
  },
  {
    label: "Entrega 2: visitas técnicas, controle operacional e relatórios-base",
    amount: 6570,
  },
  {
    label: "Aceite final: homologação, treinamento e entrada em produção",
    amount: 2190,
  },
];

const issueDate = new Intl.DateTimeFormat("pt-BR").format(new Date());

const styles = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingBottom: 42,
    paddingHorizontal: 42,
    fontFamily: "Helvetica",
    fontSize: 9.7,
    color: "#1f1f1f",
    lineHeight: 1.45,
  },
  title: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    textTransform: "uppercase",
    borderBottomWidth: 3,
    borderBottomColor: "#174c3c",
    paddingBottom: 8,
  },
  subtitle: {
    marginTop: 10,
    marginBottom: 14,
    textAlign: "center",
    fontSize: 10.8,
    fontFamily: "Helvetica-Bold",
  },
  section: {
    marginTop: 12,
  },
  sectionTitle: {
    marginBottom: 7,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "#f1f3f2",
    borderLeftWidth: 6,
    borderLeftColor: "#174c3c",
    fontFamily: "Helvetica-Bold",
    fontSize: 10.3,
    textTransform: "uppercase",
  },
  paragraph: {
    marginBottom: 7,
    textAlign: "justify",
  },
  metaBox: {
    borderWidth: 1,
    borderColor: "#d5d9d7",
    backgroundColor: "#fafbfa",
    padding: 11,
    marginBottom: 12,
  },
  metaLabel: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    color: "#4a4a4a",
    marginBottom: 2,
  },
  metaValue: {
    marginBottom: 6,
  },
  heroBox: {
    borderWidth: 1,
    borderColor: "#c5ddd3",
    backgroundColor: "#eaf3ef",
    padding: 11,
    marginBottom: 10,
  },
  highlightGrid: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  highlightCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#d6dbd9",
    backgroundColor: "#ffffff",
    padding: 10,
  },
  highlightTitle: {
    fontFamily: "Helvetica-Bold",
    color: "#174c3c",
    marginBottom: 5,
    fontSize: 9.5,
  },
  bulletList: {
    marginBottom: 4,
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  bullet: {
    width: 10,
    fontFamily: "Helvetica-Bold",
  },
  bulletText: {
    flex: 1,
    textAlign: "justify",
  },
  notice: {
    borderWidth: 1.2,
    borderColor: "#8b8b8b",
    borderStyle: "dashed",
    backgroundColor: "#fbfbfb",
    padding: 10,
  },
  table: {
    display: "table",
    width: "auto",
    marginTop: 6,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#303030",
  },
  tableRow: {
    flexDirection: "row",
  },
  tableHeaderCell: {
    backgroundColor: "#efefef",
    borderRightWidth: 1,
    borderRightColor: "#303030",
    paddingVertical: 6,
    paddingHorizontal: 7,
    fontFamily: "Helvetica-Bold",
    fontSize: 8.1,
    textTransform: "uppercase",
  },
  tableCell: {
    borderTopWidth: 1,
    borderTopColor: "#303030",
    borderRightWidth: 1,
    borderRightColor: "#303030",
    paddingVertical: 6,
    paddingHorizontal: 7,
    fontSize: 9,
  },
  lastCell: {
    borderRightWidth: 0,
  },
  totalBox: {
    marginTop: 4,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#174c3c",
    backgroundColor: "#f7fbf9",
    padding: 11,
    textAlign: "center",
    fontFamily: "Helvetica-Bold",
    fontSize: 10.8,
  },
  footerNote: {
    marginTop: 6,
    fontSize: 8.2,
    color: "#4a4a4a",
  },
  signatures: {
    marginTop: 42,
  },
  signatureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 42,
  },
  signatureBox: {
    width: "42%",
    borderTopWidth: 1.2,
    borderTopColor: "#1f1f1f",
    paddingTop: 6,
    textAlign: "center",
    fontFamily: "Helvetica-Bold",
  },
});

function brl(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function BulletList({ items }: { items: string[] }) {
  return (
    <View style={styles.bulletList}>
      {items.map((item) => (
        <View style={styles.bulletRow} key={item}>
          <Text style={styles.bullet}>-</Text>
          <Text style={styles.bulletText}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

function Section({
  title,
  children,
  wrap = false,
}: {
  title: string;
  children: React.ReactNode;
  wrap?: boolean;
}) {
  return (
    <View style={styles.section} wrap={wrap}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function MetaLine({ label, value }: { label: string; value: string }) {
  return (
    <View>
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={styles.metaValue}>{value}</Text>
    </View>
  );
}

function TableCell({
  children,
  width,
  header = false,
  last = false,
}: {
  children: React.ReactNode;
  width: string;
  header?: boolean;
  last?: boolean;
}) {
  return (
    <Text
      style={[
        header ? styles.tableHeaderCell : styles.tableCell,
        { width },
        last ? styles.lastCell : null,
      ]}
    >
      {children}
    </Text>
  );
}

function ProposalDocument() {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Proposta Técnica e Comercial para Implantação do SIGGATER Web</Text>
        <Text style={styles.subtitle}>Fase 1 do Projeto ATERSOCIOBIO</Text>

        <View style={styles.metaBox}>
          <MetaLine
            label="Contratado"
            value="João Victor Passos, inscrito no CNPJ sob o nº 66.290.033/0001-21."
          />
          <MetaLine
            label="Contratante"
            value="Instituto Acariquara, inscrito no CNPJ sob o nº 06.284.362/0001-38, com sede em Manaus/AM."
          />
          <MetaLine label="Data de emissão" value={issueDate} />
        </View>

        <View style={styles.heroBox} wrap={false}>
          <Text style={styles.paragraph}>
            Esta proposta contempla a implantação do <Text style={{ fontFamily: "Helvetica-Bold" }}>SIGGATER Web</Text>,
            estruturado sobre a base do SIGGA v5, com foco exclusivo na primeira fase operacional do
            projeto <Text style={{ fontFamily: "Helvetica-Bold" }}>ATERSOCIOBIO</Text>.
          </Text>
          <Text style={[styles.paragraph, { marginBottom: 0 }]}>
            O objetivo é oferecer ao Instituto uma solução web enxuta, prática e escalável para
            organizar beneficiários, visitas técnicas, evidências e relatórios, reduzindo a
            dependência de controles dispersos e fortalecendo a execução operacional do projeto sem
            exigir, neste momento, a contratação do ERP completo.
          </Text>
        </View>

        <View style={styles.highlightGrid} wrap={false}>
          <View style={styles.highlightCard}>
            <Text style={styles.highlightTitle}>Condição comercial desta fase</Text>
            <BulletList
              items={[
                "Implantação por valor fechado.",
                "Sem mensalidade de licenciamento do desenvolvedor nesta fase.",
                "Custos de hospedagem, banco e infraestrutura pagos diretamente pelo Instituto.",
              ]}
            />
          </View>
          <View style={styles.highlightCard}>
            <Text style={styles.highlightTitle}>Recorte de escopo aprovado</Text>
            <BulletList
              items={[
                "Fase inicial exclusiva para o ATERSOCIOBIO.",
                "Outros projetos de ATER ficam para expansão futura.",
                "Sem app móvel nativo e sem operação offline nesta etapa.",
              ]}
            />
          </View>
        </View>

        <Section title="1. O que será entregue nesta fase">
          <BulletList
            items={[
              "Cadastro-base das famílias e/ou beneficiárias vinculadas ao ATERSOCIOBIO, com estrutura de identificação, município, comunidade, responsável e informações operacionais do projeto.",
              "Cadastro e gestão da equipe técnica responsável pelo acompanhamento de campo.",
              "Registro de visitas técnicas com número da visita, data, técnico responsável, referência do projeto e estrutura para acompanhamento dos eixos produtivo, social e ambiental.",
              "Controle operacional de informações ligadas ao SGA e aos dados de acompanhamento do projeto.",
              "Consultas, filtros e relatórios-base para apoio à coordenação e à rotina de prestação de informações do projeto.",
              "Perfis de acesso para administração, coordenação/gerência e operação.",
            ]}
          />
        </Section>

        <Section title="2. Por que esta proposta é financeiramente adequada">
          <Text style={styles.paragraph}>
            O valor desta proposta foi dimensionado para uma <Text style={{ fontFamily: "Helvetica-Bold" }}>fase 1 enxuta</Text>,
            limitada ao ATERSOCIOBIO, o que reduz o investimento em relação ao SIGGA v5 completo. Ao
            mesmo tempo, o preço não corresponde apenas a telas: ele cobre a implantação da base
            técnica, a modelagem do fluxo do projeto, a organização do banco de dados, os perfis de
            acesso, os relatórios iniciais, a homologação, o treinamento e o suporte pós-implantação.
          </Text>
          <BulletList
            items={[
              "O Instituto paga somente pela fase necessária agora, sem assumir o custo do ERP institucional completo.",
              "A solução já nasce preparada para expansão futura, evitando retrabalho e sistemas paralelos.",
              "Não há mensalidade de licenciamento do desenvolvedor nesta etapa inicial.",
              "O investimento já inclui treinamento, operação assistida e garantia corretiva após a entrada em produção.",
            ]}
          />
        </Section>

        <Section title="3. Ganhos imediatos para o Instituto">
          <BulletList
            items={[
              "Centralização das informações do ATERSOCIOBIO em ambiente web único, com acesso controlado e rastreável.",
              "Maior agilidade para registrar visitas técnicas, consultar dados e consolidar relatórios operacionais.",
              "Base estruturada para futuras expansões, sem perda do investimento já realizado nesta fase.",
            ]}
          />
        </Section>

        <Section title="4. Itens que ficam fora desta proposta">
          <View style={styles.notice}>
            <BulletList
              items={[
                "Atendimento simultâneo de outros projetos de ATER além do ATERSOCIOBIO.",
                "Parametrizações específicas do ATER União com Municípios ou de fluxos ainda não consolidados.",
                "Aplicativo móvel nativo, operação offline, integrações externas não definidas e novas automações fora do fluxo da fase 1.",
                "Permanência presencial contínua, dedicação exclusiva ou alocação fixa do contratado nas dependências do Instituto.",
              ]}
            />
          </View>
        </Section>
      </Page>

      <Page size="A4" style={styles.page}>
        <Section title="5. Prazo, treinamento e suporte inicial">
          <BulletList
            items={[
              "Prazo estimado de implantação: até 60 dias corridos, contados da confirmação contratual, do pagamento da primeira parcela e da entrega dos insumos mínimos pelo Instituto.",
              "Treinamento inicial de até 2 pontos focais internos, para administração funcional do módulo e uso dos relatórios-base.",
              "Operação assistida por 30 dias após o go-live, voltada ao apoio no uso real do sistema e à estabilização da rotina.",
              "Garantia corretiva por 90 dias após o aceite final e entrada em produção, destinada à correção de falhas vinculadas ao escopo contratado.",
              "Suporte prestado prioritariamente de forma remota.",
              "Até 2 agendas presenciais de acompanhamento incluídas durante a operação assistida, mediante agendamento prévio.",
            ]}
          />
        </Section>

        <Section title="6. Infraestrutura e responsabilidade sobre custos recorrentes">
          <Text style={styles.paragraph}>
            O SIGGATER Web será implantado como aplicação em nuvem. Os custos recorrentes de
            hospedagem, banco de dados, armazenamento e serviços correlatos de infraestrutura serão
            suportados diretamente pela Contratante, não estando incluídos no valor de implantação.
          </Text>
          <Text style={styles.paragraph}>
            Em outras palavras: <Text style={{ fontFamily: "Helvetica-Bold" }}>nesta proposta o Instituto paga a implantação do sistema</Text>,
            e os serviços técnicos de nuvem necessários à operação ficam em nome e por conta da
            própria instituição, mantendo previsibilidade e transparência sobre os gastos recorrentes.
          </Text>
        </Section>

        <Section title="7. O investimento contempla">
          <Text style={styles.paragraph}>
            Para dar transparência comercial à contratação, o valor desta fase está ancorado em
            quatro frentes de entrega. O objetivo aqui não é abrir custo interno do contratado, e
            sim deixar claro o que está efetivamente sendo contratado pelo Instituto.
          </Text>
          <BulletList
            items={[
              "Estruturação técnica da base do módulo, com setup de arquitetura, banco de dados, perfis de acesso e organização do ambiente inicial.",
              "Modelagem do fluxo operacional do ATERSOCIOBIO, com cadastro-base, parametrização dos campos e consolidação da lógica de uso do projeto.",
              "Implementação das rotinas centrais de operação, incluindo visitas técnicas, controle operacional e relatórios-base.",
              "Homologação, treinamento dos pontos focais, operação assistida pós-implantação e garantia corretiva após a entrada em produção.",
            ]}
          />
        </Section>

        <Section title="8. Investimento e forma de pagamento" wrap={false}>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <TableCell header width="75%">
                Marco de entrega
              </TableCell>
              <TableCell header width="25%" last>
                Valor
              </TableCell>
            </View>
            {installments.map((item) => (
              <View style={styles.tableRow} key={item.label}>
                <TableCell width="75%">{item.label}</TableCell>
                <TableCell width="25%" last>
                  {brl(item.amount)}
                </TableCell>
              </View>
            ))}
          </View>

          <Text style={styles.totalBox}>
            Investimento total da Fase 1 do ATERSOCIOBIO: {brl(totalValue)}
          </Text>
          <Text style={styles.paragraph}>
            A forma de pagamento por marcos protege ambas as partes: o Instituto desembolsa à medida
            que as entregas são materializadas, e o cronograma permanece vinculado à homologação e ao
            avanço real da implantação.
          </Text>
        </Section>

        <Section title="9. Premissas para expansão futura">
          <Text style={styles.paragraph}>
            A presente proposta foi dimensionada exclusivamente para o recorte já confirmado por
            e-mail. Caso o Instituto deseje posteriormente incorporar outros projetos de ATER, novos
            formulários, novos relatórios ou novas regras de negócio, essas demandas poderão ser
            adicionadas por meio de evolução contratual específica, sem necessidade de recomeçar a
            base do sistema do zero.
          </Text>
        </Section>

        <Section title="10. Validade da proposta e observação final">
          <Text style={styles.paragraph}>
            Esta proposta possui validade comercial de 15 dias corridos a partir da data de emissão.
          </Text>
          <Text style={styles.paragraph}>
            A lógica desta contratação é objetiva: entregar rapidamente ao Instituto uma solução
            aderente ao ATERSOCIOBIO, com investimento controlado, ganho operacional imediato e base
            técnica aproveitável para etapas futuras, sem impor neste momento o custo de um sistema
            institucional mais amplo do que a necessidade atual.
          </Text>
        </Section>

        <Text style={styles.footerNote}>
          Documento de proposta técnica e comercial para implantação do SIGGATER Web -
          Fase 1 do projeto ATERSOCIOBIO.
        </Text>

        <View style={styles.signatures}>
          <Text>Manaus/AM, ____ de __________________ de 2026.</Text>
          <View style={styles.signatureRow}>
            <Text style={styles.signatureBox}>João Victor Passos{"\n"}Contratado</Text>
            <Text style={styles.signatureBox}>Instituto Acariquara{"\n"}Contratante</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}

async function main() {
  await renderToFile(<ProposalDocument />, outputPath);
  console.log(`PDF gerado com sucesso em ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
