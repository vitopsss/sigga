import path from "node:path";
import React from "react";
import { Document, Page, StyleSheet, Text, View, renderToFile } from "@react-pdf/renderer";

const outputPath = path.resolve(
  process.cwd(),
  "docs",
  "acariquara",
  "reunioes",
  "Roteiro_Apresentacao_Software_SIGGATER_Acariquara_27-05-2026.pdf",
);

const issueDate = new Intl.DateTimeFormat("pt-BR", {
  timeZone: "America/Manaus",
}).format(new Date());

const styles = StyleSheet.create({
  page: {
    paddingTop: 34,
    paddingBottom: 42,
    paddingHorizontal: 42,
    fontFamily: "Helvetica",
    fontSize: 9.4,
    color: "#17201c",
    lineHeight: 1.42,
  },
  title: {
    fontSize: 15.5,
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
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
  },
  metaBox: {
    borderWidth: 1,
    borderColor: "#cfd8d2",
    backgroundColor: "#f7faf8",
    padding: 10,
    marginBottom: 9,
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
    marginBottom: 9,
  },
  calloutText: {
    fontFamily: "Helvetica-Bold",
  },
  section: {
    marginTop: 8,
  },
  sectionTitle: {
    marginBottom: 5,
    paddingVertical: 5,
    paddingHorizontal: 9,
    backgroundColor: "#f1f3f2",
    borderLeftWidth: 5,
    borderLeftColor: "#174c3c",
    fontFamily: "Helvetica-Bold",
    fontSize: 9.8,
    textTransform: "uppercase",
  },
  paragraph: {
    marginBottom: 4.5,
  },
  quote: {
    marginBottom: 5.5,
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: "#f9fbfa",
    borderWidth: 1,
    borderColor: "#dce4df",
    fontFamily: "Helvetica-Bold",
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
  twoCol: {
    flexDirection: "row",
    gap: 10,
  },
  col: {
    flex: 1,
  },
  footer: {
    position: "absolute",
    left: 42,
    right: 42,
    bottom: 20,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: "#d9dfdc",
    color: "#607068",
    fontSize: 8,
    textAlign: "center",
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

function Paragraph({ children }: { children: React.ReactNode }) {
  return <Text style={styles.paragraph}>{children}</Text>;
}

function Quote({ children }: { children: React.ReactNode }) {
  return <Text style={styles.quote}>{children}</Text>;
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
        `SIGGATER Web - Instituto Acariquara | Roteiro de apresentacao do software | Pagina ${pageNumber} de ${totalPages}`
      }
      fixed
    />
  );
}

function SoftwareDemoScriptDocument() {
  return (
    <Document
      title="Roteiro de Apresentacao do Software - SIGGATER Web / Instituto Acariquara"
      author="Joao Victor Passos"
      subject="Roteiro pessoal para demonstracao do SIGGATER Web"
      creator="SIGGA"
      producer="SIGGA"
    >
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Roteiro de Apresentação do Software</Text>
        <Text style={styles.subtitle}>SIGGATER Web | Instituto Acariquara | 27/05/2026</Text>

        <View style={styles.metaBox}>
          <Text style={styles.metaText}>Preparado por: João Victor Passos</Text>
          <Text style={styles.metaText}>Data de preparação: {issueDate}</Text>
          <Text style={styles.metaText}>
            Objetivo: apresentar a base funcional do SIGGATER Web, validar aderência aos modelos enviados e sair com
            próximos passos claros para homologação.
          </Text>
        </View>

        <View style={styles.callout}>
          <Text style={styles.calloutText}>
            Mensagem central: o sistema já está organizado em torno de UFPA, Organização Coletiva, diagnóstico,
            indicadores, visitas técnicas e PDF individual. A reunião serve para validar o fluxo e priorizar ajustes,
            não para abrir escopo novo sem controle.
          </Text>
        </View>

        <Section title="1. Abertura">
          <Paragraph>Entrar direto, sem justificar demais.</Paragraph>
          <Quote>
            "Orlanda, obrigado pelo retorno e pelos modelos enviados. Hoje eu quero mostrar a base do SIGGATER Web e
            validar com vocês se a organização das telas está seguindo o fluxo real de campo: cadastro da UFPA,
            diagnóstico, indicadores, visita técnica e relatório individual."
          </Quote>
          <Quote>
            "Vou apresentar como ambiente de demonstração/homologação. O uso oficial em produção entra depois da
            formalização, definição dos usuários e validação mínima dos dados."
          </Quote>
        </Section>

        <Section title="2. Antes de compartilhar a tela">
          <Bullet>Fechar abas pessoais e deixar apenas o sistema aberto.</Bullet>
          <Bullet>Entrar diretamente no módulo SIGGATER/ATER, sem gastar tempo explicando RH, borderô ou outros módulos.</Bullet>
          <Bullet>Se aparecer outro módulo na tela inicial, explicar que a plataforma é maior, mas a Fase 1 é SIGGATER Web.</Bullet>
          <Bullet>Evitar falar de valor, CNPJ, MEI, SLU ou nota fiscal se ninguém perguntar.</Bullet>
        </Section>

        <Section title="3. Enquadramento do que será mostrado">
          <Quote>
            "Eu organizei a apresentação em cinco blocos: painel de acompanhamento, cadastro da UFPA, diagnóstico e
            indicadores, organizações coletivas e visitas técnicas com PDF individual."
          </Quote>
          <Quote>
            "A prioridade agora é garantir dado confiável para o plano de ação das famílias. Painéis mais avançados,
            automações em lote, integrações e uso offline ficam como evolução posterior."
          </Quote>
        </Section>

        <Section title="4. Ordem da demonstração">
          <Bullet>1. Abrir o painel do SIGGATER: mostrar visão geral, indicadores e filtros.</Bullet>
          <Bullet>2. Abrir UFPAs: mostrar lista, busca, situação de diagnóstico e indicadores críticos.</Bullet>
          <Bullet>3. Abrir cadastro/edição da UFPA: mostrar Denominação da UFPA, DAP/CAF, Organização Coletiva, Programa de Fomento e integrantes.</Bullet>
          <Bullet>4. Abrir diagnóstico da UFPA: mostrar comunicação, saneamento, patrimônio, plantel, área, recursos, participação e LGPD.</Bullet>
          <Bullet>5. Abrir indicadores: segurança alimentar, CadÚnico, políticas públicas, práticas sustentáveis e canais de comercialização.</Bullet>
          <Bullet>6. Abrir Organizações Coletivas: mostrar vínculo entre organização e várias UFPAs.</Bullet>
          <Bullet>7. Abrir visitas técnicas: mostrar registro por atendimento e geração de PDF individual.</Bullet>
        </Section>

        <Footer />
      </Page>

      <Page size="A4" style={styles.page}>
        <Section title="5. Como explicar o painel">
          <Quote>
            "Esse painel não é só gráfico bonito. A ideia é a coordenação conseguir enxergar prioridades: quem está sem
            diagnóstico, quem não tem internet, quem não tem água tratada, quem está em insegurança alimentar, quem não
            está no CadÚnico e onde precisa de plano de ação."
          </Quote>
          <Paragraph>Se o painel ainda estiver simples visualmente, não vender como produto final.</Paragraph>
          <Quote>
            "O painel vai evoluir visualmente, mas a lógica principal já é essa: transformar o diagnóstico em métrica
            útil para decisão."
          </Quote>
          <Bullet>Mostrar filtros por situação: sem internet, sem água tratada, insegurança alimentar, sem CadÚnico.</Bullet>
          <Bullet>Explicar que as métricas dependem da qualidade dos dados lançados no diagnóstico.</Bullet>
        </Section>

        <Section title="6. Como explicar a UFPA">
          <Quote>
            "Aqui eu estou tratando 'família' como UFPA, Unidade Familiar de Produção Agrária, conforme o modelo que
            vocês enviaram. A Denominação da UFPA vira o nome principal do cadastro."
          </Quote>
          <Bullet>Mostrar DAP/CAF, órgão emissor e validade.</Bullet>
          <Bullet>Mostrar Organização Coletiva vinculada.</Bullet>
          <Bullet>Mostrar Programa de Fomento antes dos campos de situação/valor do fomento.</Bullet>
          <Bullet>Mostrar integrantes da UFPA, com responsável pela UFPA e parentesco.</Bullet>
          <Bullet>Separar o que veio do documento oficial do que é controle operacional, como SGA e status gestor.</Bullet>
        </Section>

        <Section title="7. Como explicar diagnóstico e indicadores">
          <Quote>
            "O ponto mais importante não é apenas cadastrar texto. O diagnóstico precisa virar campo estruturado para o
            Instituto conseguir responder perguntas de gestão: quantas UFPAs não têm água tratada, quantas estão sem
            internet, quantas têm insegurança alimentar, quantas acessam políticas públicas."
          </Quote>
          <View style={styles.twoCol}>
            <View style={styles.col}>
              <Bullet>Comunicação: rádio, televisão, celular, internet, redes sociais.</Bullet>
              <Bullet>Saneamento: água para consumo, água tratada, água para produção, esgoto tratado.</Bullet>
              <Bullet>Patrimônio e plantel: máquinas, implementos, animais, área produtiva.</Bullet>
            </View>
            <View style={styles.col}>
              <Bullet>Social: alimentação, documentação, CadÚnico, políticas sociais.</Bullet>
              <Bullet>Ambiental: práticas sustentáveis e motivos de não adoção.</Bullet>
              <Bullet>Econômico: produção, políticas produtivas, PRONAF e comercialização.</Bullet>
            </View>
          </View>
        </Section>

        <Section title="8. Como explicar visitas técnicas e PDF">
          <Quote>
            "A visita técnica é o registro do atendimento. Ela junta UFPA, técnico, data, atividade, meta e os eixos
            produtivo, social e ambiental. A entrega documental da Fase 1 é o PDF individual por atendimento."
          </Quote>
          <Bullet>Mostrar que cada visita fica no histórico da UFPA.</Bullet>
          <Bullet>Mostrar que o PDF individual é por atendimento, não geração em massa.</Bullet>
          <Bullet>Explicar que layout oficial perfeito e emissão em lote podem ser evolução posterior, se necessário.</Bullet>
        </Section>

        <Footer />
      </Page>

      <Page size="A4" style={styles.page}>
        <Section title="9. Perguntas difíceis e respostas">
          <Paragraph>Se perguntarem: "Já consigo acessar do meu PC?"</Paragraph>
          <Quote>
            "Sim, o sistema é web e será acessado pelo navegador. O que estou mostrando agora é ambiente de
            demonstração/homologação. Para vocês acessarem com segurança, eu libero um link com usuários controlados."
          </Quote>

          <Paragraph>Se perguntarem: "Quanto tempo para acessar?"</Paragraph>
          <Quote>
            "Para homologação, depois de definidos usuários e campos mínimos, consigo liberar rápido. Para uso oficial
            em produção, eu prefiro liberar após contrato, entrada e validação do fluxo, para não misturar teste com
            operação real."
          </Quote>

          <Paragraph>Se perguntarem por que outros módulos aparecem:</Paragraph>
          <Quote>
            "Essa é a estrutura geral da plataforma. Para este contrato, a entrega é o SIGGATER Web/ATER. RH, borderô e
            outros módulos não fazem parte desta Fase 1."
          </Quote>

          <Paragraph>Se pedirem algo fora do escopo na hora:</Paragraph>
          <Quote>
            "Faz sentido, mas eu separaria isso como evolução. Para a Fase 1, minha recomendação é primeiro fechar o
            fluxo de cadastro, diagnóstico, visita e PDF individual."
          </Quote>
        </Section>

        <Section title="10. Perguntas que você deve fazer no final">
          <Bullet>Quem serão os usuários iniciais para homologação?</Bullet>
          <Bullet>Quem pode cadastrar UFPA e quem pode editar depois?</Bullet>
          <Bullet>Quem valida o diagnóstico e os indicadores antes de uso oficial?</Bullet>
          <Bullet>Quem será responsável por digitar os dados coletados em papel?</Bullet>
          <Bullet>Os campos obrigatórios serão exatamente os dos modelos enviados ou haverá campos mínimos para primeira carga?</Bullet>
          <Bullet>Qual retorno vocês esperam do piloto/campo de 27/05 a 05/06?</Bullet>
          <Bullet>Qual será o canal de homologação: reunião, planilha de ajustes ou lista por WhatsApp/e-mail?</Bullet>
        </Section>

        <Section title="11. Fechamento">
          <Quote>
            "Então o encaminhamento que eu proponho é: eu sigo consolidando as telas com base nos modelos oficiais,
            vocês definem os usuários-chave e validadores, e usamos a primeira homologação para ajustar o que for
            essencial antes de produção."
          </Quote>
          <Quote>
            "Com isso a gente protege o prazo, evita retrabalho e garante que o sistema nasça alinhado ao plano de
            trabalho real do ATERSOCIOBIO e das atividades de ATER do Instituto."
          </Quote>
        </Section>

        <View style={styles.callout}>
          <Text style={styles.calloutText}>
            Regra para a apresentação: mostre direção, não perfeição. O que passa segurança é demonstrar que você
            entendeu o fluxo real, sabe separar Fase 1 de evolução e está conduzindo a homologação com método.
          </Text>
        </View>

        <Footer />
      </Page>
    </Document>
  );
}

async function main() {
  await renderToFile(<SoftwareDemoScriptDocument />, outputPath);
  console.log(`PDF generated: ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
