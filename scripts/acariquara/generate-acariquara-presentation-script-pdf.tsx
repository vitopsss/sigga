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
  "reunioes",
  "Roteiro_Apresentacao_SIGGATER_Acariquara_25-05-2026.pdf",
);

const issueDate = new Intl.DateTimeFormat("pt-BR").format(new Date());

const styles = StyleSheet.create({
  page: {
    paddingTop: 34,
    paddingBottom: 42,
    paddingHorizontal: 42,
    fontFamily: "Helvetica",
    fontSize: 9.6,
    color: "#17201c",
    lineHeight: 1.43,
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
    marginTop: 9,
    marginBottom: 12,
    textAlign: "center",
    fontSize: 10.4,
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
    marginTop: 6,
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
    fontSize: 10,
    textTransform: "uppercase",
  },
  paragraph: {
    marginBottom: 5,
  },
  quote: {
    marginBottom: 6,
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: "#f9fbfa",
    borderWidth: 1,
    borderColor: "#dce4df",
    fontFamily: "Helvetica-Bold",
  },
  bullet: {
    flexDirection: "row",
    marginBottom: 3.2,
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
        `SIGGATER Web - Instituto Acariquara | Roteiro de apresentação | Página ${pageNumber} de ${totalPages}`
      }
      fixed
    />
  );
}

function PresentationScriptDocument() {
  return (
    <Document
      title="Roteiro de Apresentação - SIGGATER Web / Instituto Acariquara"
      author="João Victor Passos"
      subject="Roteiro para reunião técnica do SIGGATER Web"
      creator="SIGGA"
      producer="SIGGA"
    >
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Roteiro de Apresentação</Text>
        <Text style={styles.subtitle}>
          SIGGATER Web | Instituto Acariquara | Reunião de 25/05/2026, 10h
        </Text>

        <View style={styles.metaBox}>
          <Text style={styles.metaText}>Preparado por: João Victor Passos</Text>
          <Text style={styles.metaText}>Data de preparação: {issueDate}</Text>
          <Text style={styles.metaText}>
            Objetivo: conduzir a reunião técnica, demonstrar a base funcional e validar os insumos para a implantação.
          </Text>
        </View>

        <View style={styles.callout}>
          <Text style={styles.calloutText}>
            Objetivo da reunião: não vender de novo. Confirmar escopo, mostrar que já existe base funcional e sair com os
            insumos necessários para iniciar corretamente.
          </Text>
        </View>

        <Section title="1. Abertura">
          <Paragraph>Começar de forma curta e segura.</Paragraph>
          <Quote>
            "Orlanda, obrigado pelo horário. A ideia de hoje é eu mostrar a base do SIGGATER, validar com vocês o fluxo
            operacional da ATER e sair daqui com os próximos insumos necessários para iniciar a implantação com segurança."
          </Quote>
          <Bullet>Não comece falando de contrato, MEI, SLU ou insegurança jurídica.</Bullet>
          <Bullet>Se o contrato surgir, responda objetivamente. Se não surgir, mantenha foco no sistema e na operação.</Bullet>
        </Section>

        <Section title="2. Enquadrar o escopo">
          <Quote>
            "O que estou considerando como Fase 1 é o núcleo operacional: cadastro das famílias/beneficiários, cadastro da
            equipe técnica, registro das visitas, consulta dos atendimentos, edição das informações e geração de PDF
            individual por visita."
          </Quote>
          <Quote>
            "Mala direta, modelos oficiais mais complexos, integrações, assinatura digital avançada e dashboards mais
            sofisticados eu trataria como evolução posterior, para não atrasar a implantação inicial."
          </Quote>
        </Section>

        <Section title="3. Ordem da demonstração">
          <Bullet>Entrar direto no módulo: /ater-sociobio.</Bullet>
          <Bullet>Tela inicial SIGGATER: área central do módulo de ATER.</Bullet>
          <Bullet>Famílias: cadastro-base das famílias ou unidades atendidas.</Bullet>
          <Bullet>Nova família: validar campos obrigatórios com o Instituto.</Bullet>
          <Bullet>Atendimentos: visitas técnicas realizadas ou planejadas.</Bullet>
          <Bullet>Novo atendimento: família, data, técnico, eixo/tema e descrição técnica.</Bullet>
          <Bullet>Detalhe do atendimento: consulta, edição e organização do registro.</Bullet>
          <Bullet>PDF individual: relatório por visita, entrega documental principal da Fase 1.</Bullet>
          <Bullet>Técnicos: equipe que atuará em campo.</Bullet>
          <Bullet>Controle, fomento e indicadores: mostrar rápido como estrutura de apoio, sem vender como entrega final sofisticada.</Bullet>
        </Section>

        <Footer />
      </Page>

      <Page size="A4" style={styles.page}>
        <Section title="4. Se aparecerem outros módulos">
          <Paragraph>Se ela visualizar RH, borderô ou outras áreas, explicar sem esconder e sem ampliar escopo.</Paragraph>
          <Quote>
            "Essa é a estrutura geral da plataforma. Para este contrato, a entrega considerada é o SIGGATER/ATER. Os outros
            módulos aparecem porque a plataforma suporta outras áreas, mas não fazem parte desta fase."
          </Quote>
        </Section>

        <Section title="5. Perguntas que você deve fazer">
          <Bullet>Quem serão os usuários iniciais?</Bullet>
          <Bullet>Quem pode cadastrar famílias?</Bullet>
          <Bullet>Quem pode registrar visitas?</Bullet>
          <Bullet>Quem pode editar depois?</Bullet>
          <Bullet>Existe coordenador que valida os atendimentos?</Bullet>
          <Bullet>Quais campos são obrigatórios no cadastro da família?</Bullet>
          <Bullet>Quais campos são obrigatórios no relatório de visita?</Bullet>
          <Bullet>O PDF precisa seguir algum modelo específico agora ou basta o relatório individual operacional?</Bullet>
          <Bullet>A equipe de campo de 27/05 a 05/06 vai apenas coletar dados ou já esperam usar o sistema?</Bullet>
          <Bullet>Eles têm planilha, formulário ou modelo atual usado em campo?</Bullet>
        </Section>

        <Section title="6. Se perguntarem sobre acesso pelo PC">
          <Paragraph>Se perguntarem "consigo acessar do meu PC já?", responder:</Paragraph>
          <Quote>
            "Sim. O sistema é web e vocês vão acessar pelo navegador. O que estou mostrando agora é ambiente de
            demonstração/desenvolvimento. Para vocês acessarem, eu libero uma versão de homologação com link e usuários
            controlados."
          </Quote>
          <Paragraph>Se perguntarem "quanto tempo demora?", responder:</Paragraph>
          <Quote>
            "Para homologação, consigo liberar rápido, em poucos dias, depois de definirmos os usuários e os campos mínimos.
            Para uso oficial em produção, eu prefiro fazer após assinatura, pagamento inicial e validação do fluxo, para não
            misturar teste com operação real."
          </Quote>
          <Paragraph>Resposta ainda mais direta:</Paragraph>
          <Quote>
            "Demonstração/homologação eu consigo liberar rápido. Uso oficial em produção, eu libero de forma organizada após
            assinatura, entrada e definição dos usuários."
          </Quote>
        </Section>

        <Footer />
      </Page>

      <Page size="A4" style={styles.page}>
        <Section title="7. Equipe em campo de 27/05 a 05/06">
          <Paragraph>Se ela disser que já quer usar nas visitas, não prometer produção oficial imediata.</Paragraph>
          <Quote>
            "Podemos fazer de duas formas: ou usamos esse período como piloto assistido, com poucos usuários testando o fluxo,
            ou vocês coletam os dados no modelo atual e depois migramos/registramos no sistema. Eu só não recomendo tratar como
            produção oficial antes da validação mínima."
          </Quote>
          <Bullet>Chamar de piloto assistido se for antes da assinatura e da homologação mínima.</Bullet>
          <Bullet>Evitar dizer que a equipe inteira já pode usar oficialmente no dia 27/05.</Bullet>
        </Section>

        <Section title="8. Fechamento da reunião">
          <Paragraph>Encerrar puxando próximas ações concretas.</Paragraph>
          <Quote>
            "Então, para eu avançar, preciso de três coisas: lista dos usuários iniciais, validação dos campos obrigatórios do
            cadastro e do atendimento, e confirmação do modelo de relatório esperado nesta primeira fase."
          </Quote>
          <Quote>
            "Com isso eu organizo a homologação, ajusto o que for necessário no MVP e seguimos em paralelo com a assinatura do
            contrato."
          </Quote>
        </Section>

        <Section title="9. Postura recomendada">
          <Bullet>Falar como alguém que já está conduzindo a implantação, não como alguém pedindo permissão para começar.</Bullet>
          <Bullet>Defender o núcleo da Fase 1: famílias, técnicos, atendimentos e PDF individual.</Bullet>
          <Bullet>Quando surgir algo fora do núcleo, usar a palavra "evolução posterior".</Bullet>
          <Bullet>Não prometer produção oficial sem contrato assinado, entrada, usuários e campos mínimos definidos.</Bullet>
          <Bullet>Evitar explicações longas sobre PJ, MEI, SLU ou outros negócios. Se perguntarem, dizer apenas que os dados da PJ serão ajustados para contrato e nota fiscal corretos.</Bullet>
        </Section>

        <View style={styles.callout}>
          <Text style={styles.calloutText}>
            Mensagem central: o SIGGATER já tem direção e base funcional. A reunião serve para homologar o mínimo necessário,
            proteger o escopo e preparar uma implantação controlada.
          </Text>
        </View>

        <Footer />
      </Page>
    </Document>
  );
}

async function main() {
  await renderToFile(<PresentationScriptDocument />, outputPath);
  console.log(`PDF generated: ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
