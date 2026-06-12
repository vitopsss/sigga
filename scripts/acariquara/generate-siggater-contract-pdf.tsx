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
  "Contrato_SIGGATER_ATERSOCIOBIO_Fase_1.pdf",
);

const issueDate = new Intl.DateTimeFormat("pt-BR").format(new Date());

const styles = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingBottom: 42,
    paddingHorizontal: 42,
    fontFamily: "Helvetica",
    fontSize: 9.8,
    color: "#111111",
    lineHeight: 1.45,
  },
  title: {
    fontSize: 16.5,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    textTransform: "uppercase",
    borderBottomWidth: 3,
    borderBottomColor: "#111111",
    paddingBottom: 8,
  },
  subtitle: {
    marginTop: 10,
    marginBottom: 14,
    textAlign: "center",
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
  },
  metaBox: {
    borderWidth: 1,
    borderColor: "#d5d9d7",
    backgroundColor: "#fafbfa",
    padding: 11,
    marginBottom: 12,
  },
  metaLabel: {
    fontSize: 7.6,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    color: "#4a4a4a",
    marginBottom: 2,
  },
  metaValue: {
    marginBottom: 6,
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
    borderLeftColor: "#111111",
    fontFamily: "Helvetica-Bold",
    fontSize: 10.3,
    textTransform: "uppercase",
  },
  paragraph: {
    marginBottom: 7,
    textAlign: "justify",
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
    borderColor: "#111111",
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
    borderColor: "#111111",
    backgroundColor: "#f7f7f7",
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
    borderTopColor: "#111111",
    paddingTop: 6,
    textAlign: "center",
    fontFamily: "Helvetica-Bold",
  },
});

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
  wrap = true,
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

function ContractDocument() {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>
          Instrumento Particular de Prestação de Serviços de Implantação de
          Software (Web App)
        </Text>
        <Text style={styles.subtitle}>
          SIGGATER Web - Fase 1 do Projeto ATERSOCIOBIO
        </Text>

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

        <Section title="1. Definições e Premissas">
          <Text style={styles.paragraph}>
            Para fins deste contrato: (i) “Sistema” significa o módulo web
            denominado SIGGATER Web; (ii) “Fase 1” significa o recorte
            operacional exclusivo para o projeto ATERSOCIOBIO; (iii) “Go-live”
            significa a entrada em produção para uso real; (iv) “Aceite”
            significa a aprovação formal da entrega de um marco, conforme
            critérios definidos na Cláusula 6.
          </Text>
          <Text style={styles.paragraph}>
            Este contrato foi dimensionado para uma fase enxuta, com entregas
            por marcos, preservando base técnica compatível com expansões futuras
            por aditivo. A proposta técnica e comercial SIGGATER/ATERSOCIOBIO
            (Fase 1) integra este instrumento como referência de escopo e
            condições, no que for compatível com as cláusulas contratuais aqui
            estabelecidas.
          </Text>
        </Section>

        <Section title="2. Escopo da Fase 1 (Entregáveis)">
          <Text style={styles.paragraph}>
            O Contratado se obriga a entregar, no âmbito desta Fase 1:
          </Text>
          <BulletList
            items={[
              "Cadastro-base de famílias e/ou beneficiárias vinculadas ao ATERSOCIOBIO, com identificação, município, comunidade, responsável e informações operacionais do projeto.",
              "Cadastro e gestão da equipe técnica responsável pelo acompanhamento de campo.",
              "Registro de visitas técnicas com número da visita, data, técnico responsável, referência do projeto e estrutura para acompanhamento dos eixos produtivo, social e ambiental.",
              "Controle operacional de informações ligadas ao SGA e dados de acompanhamento do projeto.",
              "Consultas, filtros e relatórios-base para apoio à coordenação e rotina do projeto.",
              "Geração de PDF individual por visita técnica (relatório por atendimento), para uso operacional.",
              "Perfis de acesso para administração, coordenação/gerência e operação.",
            ]}
          />
        </Section>

        <Section title="3. Itens Fora de Escopo">
          <View style={styles.notice}>
            <BulletList
              items={[
                "Atendimento simultâneo de outros projetos de ATER além do ATERSOCIOBIO.",
                "Parametrizações específicas de fluxos não consolidados (ex.: ATER União com Municípios) nesta fase.",
                "Aplicativo móvel nativo, operação offline e integrações externas não definidas.",
                "Permanência presencial contínua, dedicação exclusiva ou alocação fixa do Contratado no Instituto.",
                "Geração de documentos em lote (mala direta), automação de preenchimento e emissão massiva de PDFs, bem como adequação “pixel perfect” a layouts oficiais específicos (ANATER/ATER) e suas variações, quando aplicável.",
              ]}
            />
          </View>
        </Section>

        <Section title="4. Infraestrutura, Custos Recorrentes e Acessos" wrap={false}>
          <Text style={styles.paragraph}>
            O Sistema será implantado como aplicação em nuvem. Os custos
            recorrentes de hospedagem, banco de dados, armazenamento e serviços
            correlatos serão suportados diretamente pela Contratante, não
            estando incluídos no valor de implantação.
          </Text>
          <Text style={styles.paragraph}>
            A Contratante se compromete a providenciar e manter acessos
            necessários (contas/credenciais) para infraestrutura e ambiente,
            quando aplicável. O Contratado deverá receber acessos técnicos
            mínimos para operação e suporte durante a vigência deste contrato.
          </Text>
        </Section>
      </Page>

      <Page size="A4" style={styles.page}>
        <Section title="5. Prazo, Treinamento, Operação Assistida e Garantia">
          <BulletList
            items={[
              "Prazo estimado de implantação: até 60 (sessenta) dias corridos, contados do cumprimento cumulativo de: (i) assinatura do contrato; (ii) pagamento do Marco 0; e (iii) entrega, pela Contratante, dos insumos mínimos e do modelo operacional/plano de trabalho do SIGGAATER/ATERSOCIOBIO (rotinas, campos obrigatórios, regras de validação, modelo de relatório e critérios de homologação).",
              "Treinamento inicial de até 2 (dois) pontos focais internos.",
              "Operação assistida por 30 (trinta) dias após o Go-live.",
              "Garantia corretiva por 90 (noventa) dias após o aceite final e entrada em produção, destinada à correção de falhas vinculadas ao escopo contratado.",
              "Suporte prestado prioritariamente de forma remota.",
              "Até 2 (duas) agendas presenciais durante a operação assistida, mediante agendamento.",
            ]}
          />
          <Text style={styles.paragraph}>
            Atrasos na entrega de insumos, indisponibilidade de pontos focais, ou atrasos de homologação pela
            Contratante suspendem o cronograma pelo período correspondente, sem caracterizar atraso do Contratado.
          </Text>
        </Section>

        <Section title="6. Homologação e Aceite">
          <Text style={styles.paragraph}>
            A cada marco, o Contratado disponibilizará a entrega para homologação
            pela Contratante. A Contratante deverá responder em até 7 (sete)
            dias corridos, com: (i) aceite; ou (ii) lista objetiva de
            ajustes/correções vinculados ao escopo do marco.
          </Text>
          <Text style={styles.paragraph}>
            Caso a Contratante não se manifeste no prazo acima, as partes
            deverão agendar uma validação conjunta em até 5 (cinco) dias
            corridos. Enquanto não houver validação e aceite formal, o marco
            permanecerá em homologação.
          </Text>
        </Section>

        <Section title="7. Investimento e Forma de Pagamento" wrap={false}>
          <Text style={styles.paragraph}>
            O investimento total desta Fase 1 é de R$ 21.900,00 (vinte e um mil e
            novecentos reais), pago por marcos de entrega:
          </Text>
          <Text style={styles.paragraph}>
            As partes reconhecem que o valor desta Fase 1 contempla não apenas funcionalidades, mas também a
            estruturação técnica inicial do ambiente, parametrização do recorte ATERSOCIOBIO, apoio à homologação,
            treinamento, operação assistida e garantia corretiva, sendo preço fechado para o escopo contratado.
          </Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <TableCell header width="22%">
                Marco
              </TableCell>
              <TableCell header width="58%">
                Descrição
              </TableCell>
              <TableCell header width="20%" last>
                Valor
              </TableCell>
            </View>
            <View style={styles.tableRow}>
              <TableCell width="22%">Marco 0</TableCell>
              <TableCell width="58%">
                Contratação, setup inicial e alinhamento final do fluxo do
                ATERSOCIOBIO.
              </TableCell>
              <TableCell width="20%" last>
                R$ 6.570,00
              </TableCell>
            </View>
            <View style={styles.tableRow}>
              <TableCell width="22%">Entrega 1</TableCell>
              <TableCell width="58%">
                Cadastro-base, perfis de acesso e estrutura operacional do
                projeto.
              </TableCell>
              <TableCell width="20%" last>
                R$ 6.570,00
              </TableCell>
            </View>
            <View style={styles.tableRow}>
              <TableCell width="22%">Entrega 2</TableCell>
              <TableCell width="58%">
                Visitas técnicas, controle operacional e relatórios-base.
              </TableCell>
              <TableCell width="20%" last>
                R$ 6.570,00
              </TableCell>
            </View>
            <View style={styles.tableRow}>
              <TableCell width="22%">Aceite Final</TableCell>
              <TableCell width="58%">
                Homologação, treinamento e entrada em produção.
              </TableCell>
              <TableCell width="20%" last>
                R$ 2.190,00
              </TableCell>
            </View>
          </View>
          <Text style={styles.totalBox}>VALOR TOTAL: R$ 21.900,00</Text>
          <Text style={styles.paragraph}>
            O pagamento de cada marco deverá ocorrer mediante aceite formal do
            respectivo marco. O atraso no pagamento suspende o cronograma até
            regularização.
          </Text>
        </Section>

        <Text style={styles.footerNote}>
          Instrumento contratual referente à implantação do SIGGATER Web (Fase 1
          do ATERSOCIOBIO).
        </Text>
      </Page>

      <Page size="A4" style={styles.page}>
        <Section title="8. Mudanças de Escopo (Aditivos)">
          <Text style={styles.paragraph}>
            Demandas que excedam o escopo da Cláusula 2 ou que envolvam itens
            expressamente fora de escopo (Cláusula 3) deverão ser tratadas por
            aditivo contratual, com orçamento e cronograma específicos,
            aprovados previamente pela Contratante.
          </Text>
          <Text style={styles.paragraph}>
            Em especial, funcionalidades de geração de documentos em lote (mala
            direta), templates oficiais e automações de relatórios em PDF
            poderão ser contratadas como etapa posterior, mediante fornecimento
            dos modelos finais (layouts) e critérios objetivos de aceite.
          </Text>
        </Section>

        <Section title="9. Confidencialidade e LGPD">
          <Text style={styles.paragraph}>
            As partes se obrigam a manter sigilo sobre informações técnicas,
            dados e documentos acessados em razão deste contrato, não os
            divulgando a terceiros sem autorização, exceto por obrigação legal.
          </Text>
          <Text style={styles.paragraph}>
            As partes reconhecem a aplicação da Lei Geral de Proteção de Dados
            (Lei nº 13.709/2018). Para fins operacionais, a Contratante atua
            como Controladora dos dados e o Contratado como Operador, no que
            couber, comprometendo-se a adotar medidas razoáveis de segurança,
            acesso mínimo necessário e confidencialidade.
          </Text>
          <Text style={styles.paragraph}>
            Em caso de encerramento, a Contratante poderá solicitar a
            devolução/transferência de dados acessíveis do ambiente sob sua
            titularidade. A exclusão de dados em provedores de terceiros
            observará as políticas do provedor e as responsabilidades definidas
            na Cláusula 4.
          </Text>
        </Section>

        <Section title="10. Propriedade Intelectual, Know-how e Licença de Uso">
          <Text style={styles.paragraph}>
            O Contratado permanece titular da propriedade intelectual do
            código-fonte, arquitetura, componentes genéricos, bibliotecas,
            métodos, rotinas, padrões, experiências e know-how empregados (ou
            desenvolvidos) durante a execução deste contrato, exceto quando
            houver cessão expressa por escrito.
          </Text>
          <Text style={styles.paragraph}>
            A Contratante recebe licença de uso do Sistema, para uso
            institucional no âmbito do ATERSOCIOBIO, pelo prazo deste contrato,
            para fins operacionais. A licença não implica transferência de
            titularidade do código-fonte ou do know-how do Contratado.
          </Text>
          <Text style={styles.paragraph}>
            Regras de negócio, dados e conteúdos inseridos pela Contratante no
            Sistema permanecem de titularidade da Contratante.
          </Text>
        </Section>

        <Section title="11. Limitação de Responsabilidade">
          <Text style={styles.paragraph}>
            O Contratado não se responsabiliza por indisponibilidades
            decorrentes de falhas de provedores terceiros (hospedagem, banco,
            rede, energia, serviços externos) sob responsabilidade da
            Contratante, nem por danos indiretos, lucros cessantes ou perda de
            oportunidade.
          </Text>
          <Text style={styles.paragraph}>
            A responsabilidade direta do Contratado, quando aplicável, fica
            limitada ao valor efetivamente pago pela Contratante nos últimos 3
            (três) meses anteriores ao evento que deu causa ao pedido.
          </Text>
        </Section>
      </Page>

      <Page size="A4" style={styles.page}>
        <Section title="12. Rescisão">
          <Text style={styles.paragraph}>
            O contrato poderá ser rescindido por qualquer parte mediante
            notificação por escrito com antecedência mínima de 15 (quinze)
            dias. Em caso de rescisão por inadimplência, a parte adimplente
            poderá rescindir após notificação e não regularização em 5 (cinco)
            dias.
          </Text>
          <Text style={styles.paragraph}>
            Valores relativos a marcos já entregues e aceitos permanecem
            devidos. Marcos em andamento poderão ser ajustados proporcionalmente,
            mediante registro do status e evidências do trabalho executado.
          </Text>
        </Section>

        <Section title="13. Disposições Gerais e Foro">
          <Text style={styles.paragraph}>
            Este contrato representa o acordo integral entre as partes quanto
            ao objeto aqui tratado. Eventuais tolerâncias não constituem
            renúncia de direitos. O foro eleito é o da comarca de Manaus/AM,
            com renúncia a qualquer outro, por mais privilegiado que seja.
          </Text>
        </Section>

        <Text style={styles.footerNote}>
          Manaus/AM, ____ de __________________ de 2026.
        </Text>

        <View style={styles.signatures}>
          <View style={styles.signatureRow}>
            <Text style={styles.signatureBox}>
              João Victor Passos{"\n"}Contratado
            </Text>
            <Text style={styles.signatureBox}>
              Instituto Acariquara{"\n"}Contratante
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}

async function main() {
  await renderToFile(<ContractDocument />, outputPath);
  console.log(`PDF gerado com sucesso em ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
