import fs from "node:fs";
import path from "node:path";
import React, { type ReactNode } from "react";
import { Document, Page, StyleSheet, Text, View, renderToFile } from "@react-pdf/renderer";

const outputDir = path.resolve(process.cwd(), "docs", "acariquara", "reunioes");
const outputPath = path.join(outputDir, "Roteiro_Apresentacao_SIGGATER_Web_01-06-2026.pdf");

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

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Paragraph({ children }: { children: ReactNode }) {
  return <Text style={styles.paragraph}>{children}</Text>;
}

function Quote({ children }: { children: ReactNode }) {
  return <Text style={styles.quote}>{children}</Text>;
}

function Bullet({ children }: { children: ReactNode }) {
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
        `SIGGATER Web - Instituto Acariquara | Roteiro de apresentacao | Pagina ${pageNumber} de ${totalPages}`
      }
      fixed
    />
  );
}

function RoteiroDocument() {
  return (
    <Document
      title="Roteiro de Apresentacao - SIGGATER Web"
      author="Joao Victor Passos"
      subject="Roteiro para demonstracao do app SIGGATER Web ao Instituto Acariquara"
      creator="SIGGA"
      producer="SIGGA"
    >
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Roteiro de Apresentação do Projeto</Text>
        <Text style={styles.subtitle}>SIGGATER Web | Instituto Acariquara | 01/06/2026</Text>

        <View style={styles.metaBox}>
          <Text style={styles.metaText}>Preparado por: João Victor Passos</Text>
          <Text style={styles.metaText}>Data de preparação: {issueDate}</Text>
          <Text style={styles.metaText}>
            Objetivo: validar o fluxo operacional do SIGGATER Web com base nos documentos oficiais enviados pelo
            Instituto Acariquara.
          </Text>
        </View>

        <View style={styles.callout}>
          <Text style={styles.calloutText}>
            Mensagem central: apresentar como validação operacional guiada, não como sistema final fechado. O foco é
            confirmar se os campos, telas e métricas seguem os documentos enviados e a rotina real da equipe de campo.
          </Text>
        </View>

        <Section title="1. Abertura">
          <Quote>
            "Bom dia. A ideia hoje é validar com vocês se o fluxo do SIGGATER está seguindo corretamente os documentos
            enviados e a rotina real da equipe em campo."
          </Quote>
          <Quote>
            "Eu organizei o sistema a partir dos documentos enviados pelo Instituto: cadastro da organização coletiva,
            diagnóstico da UFPA, indicadores da UFPA, indicadores da organização coletiva e relatório de visita individual."
          </Quote>
          <Paragraph>
            Evite vender como produto definitivo. Trate como base de homologação para as próximas validações.
          </Paragraph>
        </Section>

        <Section title="2. Enquadramento">
          <Quote>
            "O fluxo proposto para a Fase 1 é: cadastrar a organização coletiva, cadastrar a UFPA, preencher diagnóstico
            e indicadores, registrar visitas técnicas e gerar o relatório individual por atendimento."
          </Quote>
          <Bullet>Não iniciar falando de RH, borderô ou outros módulos.</Bullet>
          <Bullet>Se a tela inicial mostrar outros módulos, dizer que a plataforma é maior, mas a Fase 1 é SIGGATER Web.</Bullet>
          <Bullet>Não discutir valor, CNPJ, MEI, SLU ou nota fiscal se ninguém perguntar.</Bullet>
          <Bullet>Reforçar que os documentos enviados são a fonte principal; as anotações da reunião entram como complemento.</Bullet>
        </Section>

        <Section title="3. Ordem da demonstração">
          <Bullet>1. Abrir o SIGGATER e explicar o fluxo geral.</Bullet>
          <Bullet>2. Mostrar Organização Coletiva.</Bullet>
          <Bullet>3. Mostrar Cadastro/Diagnóstico da UFPA.</Bullet>
          <Bullet>4. Mostrar Indicadores da UFPA.</Bullet>
          <Bullet>5. Mostrar Dashboard e métricas.</Bullet>
          <Bullet>6. Mostrar Visita Técnica.</Bullet>
          <Bullet>7. Mostrar PDF individual por atendimento.</Bullet>
          <Bullet>8. Fechar com validação dos campos obrigatórios e próximos passos.</Bullet>
        </Section>

        <Section title="4. Organização Coletiva">
          <Quote>
            "Começo pela organização coletiva porque ela agrupa as UFPAs e ajuda a coordenação a enxergar o trabalho por
            associação, cooperativa, grupo ou comunidade."
          </Quote>
          <Bullet>Mostrar entidade executora.</Bullet>
          <Bullet>Mostrar agente de ATER / agente ambiental indígena, se aplicável ao formulário.</Bullet>
          <Bullet>Mostrar local de realização da atividade.</Bullet>
          <Bullet>Mostrar características da organização social.</Bullet>
          <Bullet>Mostrar indicadores da organização coletiva: ambiental, social e econômico.</Bullet>
        </Section>

        <Footer />
      </Page>

      <Page size="A4" style={styles.page}>
        <Section title="5. Cadastro e Diagnóstico da UFPA">
          <Quote>
            "Aqui entra a Unidade Familiar de Produção Agrária. Mantive a lógica do documento: dados da UFPA, DAP/CAF,
            áreas, localização, meios de comunicação, saneamento, patrimônio, produção, integrantes e políticas
            públicas."
          </Quote>
          <Bullet>Explicar que "família" no sistema representa a UFPA para este fluxo.</Bullet>
          <Bullet>Mostrar Denominação da UFPA, DAP/CAF, órgão emissor e validade.</Bullet>
          <Bullet>Mostrar organização coletiva vinculada.</Bullet>
          <Bullet>Mostrar Programa de Fomento antes dos controles de fomento.</Bullet>
          <Bullet>Mostrar integrantes da UFPA, responsável pela UFPA e parentesco.</Bullet>
          <Bullet>Explicar que SGA/status gestor é controle operacional separado, não campo central do cadastro da UFPA.</Bullet>
        </Section>

        <Section title="6. Indicadores">
          <Quote>
            "Essa parte não é só cadastro. Ela serve para transformar o diagnóstico em leitura de gestão."
          </Quote>
          <Bullet>Segurança alimentar: alimentação variada, falta de comida, redução de refeição e fome.</Bullet>
          <Bullet>Serviços sociais básicos: documentação, CadÚnico e acesso a políticas sociais.</Bullet>
          <Bullet>Participação comunitária: associação, cooperativa e grupos informais.</Bullet>
          <Bullet>Ambiental: práticas sustentáveis e motivos quando não existem práticas.</Bullet>
          <Bullet>Econômico: valor bruto da produção, políticas produtivas e canais de comercialização.</Bullet>
        </Section>

        <Section title="7. Dashboard">
          <Quote>
            "Com esses preenchimentos, a coordenação consegue acompanhar pontos críticos sem abrir ficha por ficha."
          </Quote>
          <Bullet>Mostrar filtros por situação: sem internet, sem água tratada, sem esgoto tratado, sem CadÚnico.</Bullet>
          <Bullet>Mostrar insegurança alimentar como alerta de prioridade para plano de ação.</Bullet>
          <Bullet>Explicar que as métricas dependem da qualidade do preenchimento do diagnóstico.</Bullet>
          <Quote>
            "O painel pode evoluir visualmente, mas a lógica principal é transformar o diagnóstico em decisão prática
            para a coordenação."
          </Quote>
        </Section>

        <Section title="8. Visita Técnica">
          <Quote>
            "Depois do cadastro e diagnóstico, o técnico registra a visita. A ideia é manter o histórico do
            acompanhamento de campo."
          </Quote>
          <Bullet>Mostrar UFPA atendida.</Bullet>
          <Bullet>Mostrar técnico responsável.</Bullet>
          <Bullet>Mostrar data e número da visita.</Bullet>
          <Bullet>Mostrar eixos produtivo, social e ambiental.</Bullet>
          <Bullet>Mostrar desenvolvimento, recomendações e status do relatório.</Bullet>
        </Section>

        <Footer />
      </Page>

      <Page size="A4" style={styles.page}>
        <Section title="9. PDF individual">
          <Quote>
            "Cada visita pode gerar um relatório individual em PDF. Isso atende ao uso operacional da Fase 1, sem entrar
            ainda em geração em massa."
          </Quote>
          <Bullet>Reforçar que PDF individual por visita está dentro do recorte inicial.</Bullet>
          <Bullet>Não prometer mala direta, geração em lote ou layout oficial pixel-perfect nesta etapa.</Bullet>
        </Section>

        <Section title="10. Se perguntarem se já podem acessar do PC">
          <Quote>
            "Tecnicamente o sistema já está em ambiente local de desenvolvimento. Para vocês acessarem do computador de
            vocês, eu preciso publicar em um ambiente online, configurar banco, acesso e usuários. Depois da formalização
            e validação do fluxo mínimo, isso entra no cronograma de implantação."
          </Quote>
        </Section>

        <Section title="11. Se pedirem mais campos">
          <Quote>
            "Sem problema. Eu só preciso separar o que é obrigatório para a primeira versão do que pode entrar como
            evolução, para não atrasar a entrega inicial."
          </Quote>
          <Bullet>Pedir que confirmem quais campos são obrigatórios na primeira homologação.</Bullet>
          <Bullet>Anotar divergências entre documento e rotina real de campo.</Bullet>
          <Bullet>Não aceitar escopo aberto sem registrar como ajuste ou etapa complementar.</Bullet>
        </Section>

        <Section title="12. Fechamento">
          <Quote>
            "O que eu preciso validar com vocês hoje é: se os campos estão corretos, se a ordem faz sentido para a equipe
            e quais campos são obrigatórios logo na primeira versão."
          </Quote>
          <Bullet>Confirmar se a equipe vai preencher em papel primeiro e digitar depois.</Bullet>
          <Bullet>Confirmar quem serão os usuários-chave para homologação.</Bullet>
          <Bullet>Confirmar prioridade: cadastro/diagnóstico, indicadores, visita técnica e PDF individual.</Bullet>
          <Bullet>Sair da reunião com lista objetiva de ajustes, não com discussão solta.</Bullet>
        </Section>

        <Footer />
      </Page>
    </Document>
  );
}

async function main() {
  fs.mkdirSync(outputDir, { recursive: true });
  await renderToFile(<RoteiroDocument />, outputPath);
  console.log(`PDF gerado em: ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
