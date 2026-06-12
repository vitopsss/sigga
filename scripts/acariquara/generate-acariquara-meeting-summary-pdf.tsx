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
  "Resumo_Reuniao_SIGGATER_Acariquara_25-05-2026.pdf",
);

const issueDate = new Intl.DateTimeFormat("pt-BR").format(new Date());

const styles = StyleSheet.create({
  page: {
    paddingTop: 34,
    paddingBottom: 42,
    paddingHorizontal: 42,
    fontFamily: "Helvetica",
    fontSize: 9.8,
    color: "#17201c",
    lineHeight: 1.45,
  },
  title: {
    fontSize: 17,
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
    marginTop: 6,
    marginBottom: 9,
  },
  calloutText: {
    fontFamily: "Helvetica-Bold",
  },
  section: {
    marginTop: 10,
  },
  sectionTitle: {
    marginBottom: 6,
    paddingVertical: 5,
    paddingHorizontal: 9,
    backgroundColor: "#f1f3f2",
    borderLeftWidth: 5,
    borderLeftColor: "#174c3c",
    fontFamily: "Helvetica-Bold",
    fontSize: 10.2,
    textTransform: "uppercase",
  },
  paragraph: {
    marginBottom: 6,
  },
  bullet: {
    flexDirection: "row",
    marginBottom: 3.5,
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
    <View style={styles.section} wrap={false}>
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
        `SIGGATER Web - Instituto Acariquara | Preparação para reunião de 25/05/2026 | Página ${pageNumber} de ${totalPages}`
      }
      fixed
    />
  );
}

function MeetingSummaryDocument() {
  return (
    <Document
      title="Resumo para Reunião - SIGGATER Web / Instituto Acariquara"
      author="João Victor Passos"
      subject="Preparação para reunião técnica do SIGGATER Web"
      creator="SIGGA"
      producer="SIGGA"
    >
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Resumo para Reunião Técnica</Text>
        <Text style={styles.subtitle}>
          SIGGATER Web | Instituto Acariquara | 25/05/2026, 10h
        </Text>

        <View style={styles.metaBox}>
          <Text style={styles.metaText}>Preparado por: João Victor Passos</Text>
          <Text style={styles.metaText}>Data de preparação: {issueDate}</Text>
          <Text style={styles.metaText}>
            Objetivo: alinhar MVP, escopo, acessos e insumos para implantação inicial.
          </Text>
        </View>

        <View style={styles.callout}>
          <Text style={styles.calloutText}>
            Postura recomendada: chegar com direção técnica, mas apresentar a estrutura como proposta mínima para validação,
            não como solução definitiva fechada.
          </Text>
        </View>

        <Section title="1. Situação atual">
          <Paragraph>
            O Instituto Acariquara sinalizou avanço no contrato e solicitou reunião técnica. Comercialmente, o projeto está
            quase fechado. Juridicamente, ainda faltam contrato assinado, dados corretos da pessoa jurídica e pagamento inicial.
          </Paragraph>
          <Bullet>Valor comercial alinhado: R$ 21.900,00.</Bullet>
          <Bullet>Condições: 30% / 30% / 30% / 10%, por marcos.</Bullet>
          <Bullet>Prazo de referência: até 45 dias, condicionado a assinatura, pagamento inicial, insumos e homologação.</Bullet>
          <Bullet>Até assinatura e marco inicial, tratar a reunião como levantamento técnico e validação de escopo.</Bullet>
        </Section>

        <Section title="2. Frase de abertura">
          <Paragraph>
            "Trouxe uma proposta de estrutura mínima para validarmos juntos e iniciar a implantação com segurança. A ideia é
            confirmar o que é obrigatório, o que pode ser opcional e o que fica para evolução."
          </Paragraph>
        </Section>

        <Section title="3. Escopo que deve ser defendido">
          <Bullet>Cadastro de famílias, beneficiários ou unidades atendidas.</Bullet>
          <Bullet>Registro de visitas técnicas e atendimentos.</Bullet>
          <Bullet>Registros técnicos por eixo produtivo, social e ambiental.</Bullet>
          <Bullet>Acompanhamento operacional pela coordenação.</Bullet>
          <Bullet>Relatório individual em PDF por visita ou atendimento.</Bullet>
          <Bullet>Filtros básicos por município, técnico, período, status e família.</Bullet>
        </Section>

        <Section title="4. MVP - cadastro">
          <Bullet>Obrigatórios: nome da família/unidade, responsável, município, comunidade/localidade, telefone quando houver e projeto/atividade ATER vinculada.</Bullet>
          <Bullet>Recomendados: CPF, NIS, UFPA, grupo de interesse, atividade produtiva principal e status do cadastro.</Bullet>
          <Bullet>Para evolução: composição familiar completa, documentos anexos, georreferenciamento e histórico socioeconômico detalhado.</Bullet>
        </Section>

        <Footer />
      </Page>

      <Page size="A4" style={styles.page}>
        <Section title="5. MVP - visita técnica">
          <Bullet>Família ou unidade atendida.</Bullet>
          <Bullet>Data da visita.</Bullet>
          <Bullet>Técnico responsável.</Bullet>
          <Bullet>Houve atendimento: sim ou não.</Bullet>
          <Bullet>Tipo de atendimento: individual ou coletivo.</Bullet>
          <Bullet>Status do relatório: rascunho, pendente, concluído ou enviado.</Bullet>
          <Bullet>Descrição do que foi realizado.</Bullet>
          <Bullet>Recomendações e encaminhamentos.</Bullet>
        </Section>

        <Section title="6. Eixos técnicos">
          <Paragraph>
            Para o MVP, manter três eixos flexíveis. Não é obrigatório preencher todos em toda visita. O técnico preenche
            apenas os eixos aplicáveis.
          </Paragraph>
          <Bullet>Eixo produtivo.</Bullet>
          <Bullet>Eixo social.</Bullet>
          <Bullet>Eixo ambiental.</Bullet>
          <Bullet>Campos por eixo: tipo de ação, etapa, situação encontrada, desenvolvimento/orientação, recomendações e encaminhamentos.</Bullet>
        </Section>

        <Section title="7. Relatório individual em PDF">
          <Bullet>Identificação do SIGGATER Web e do Instituto.</Bullet>
          <Bullet>Família/unidade, município, comunidade, data e técnico responsável.</Bullet>
          <Bullet>Tipo de atendimento, resumo técnico, recomendações e status do relatório.</Bullet>
          <Bullet>Validar na reunião se precisa de logotipo, assinatura, fotos, anexos ou modelo oficial.</Bullet>
          <Bullet>Manter geração individual por atendimento na Fase 1.</Bullet>
        </Section>

        <Section title="8. Acessos ao sistema">
          <Paragraph>Propor perfis simples para a primeira entrega.</Paragraph>
          <Bullet>Administrador: cadastra usuários, ajusta dados e vê tudo.</Bullet>
          <Bullet>Coordenação: acompanha famílias, visitas, relatórios, técnicos e pendências.</Bullet>
          <Bullet>Técnico de campo: registra visitas e consulta famílias.</Bullet>
          <Bullet>Consulta: diretoria ou jurídico visualizam dados e relatórios sem alterar.</Bullet>
          <Paragraph>
            Deixar para evolução: permissões por município/projeto, auditoria avançada, autenticação em dois fatores,
            login Google/Microsoft e assinatura digital.
          </Paragraph>
        </Section>

        <Section title="9. Fora da Fase 1">
          <Paragraph>Não apresentar como recusa. Apresentar como evolução posterior após validação do fluxo principal.</Paragraph>
          <Bullet>Mala direta e geração em lote.</Bullet>
          <Bullet>Modelos oficiais complexos ainda não fornecidos e homologados.</Bullet>
          <Bullet>Anexos obrigatórios e gestão documental avançada.</Bullet>
          <Bullet>Assinatura digital avançada.</Bullet>
          <Bullet>Integrações externas.</Bullet>
          <Bullet>Dashboards analíticos sofisticados.</Bullet>
        </Section>

        <Footer />
      </Page>

      <Page size="A4" style={styles.page}>
        <Section title="10. Formalização e contrato">
          <Paragraph>
            Não entrar em detalhes sobre MEI, marketplace ou margem operacional. Se perguntarem sobre assinatura:
          </Paragraph>
          <Paragraph>
            "Estou ajustando os dados cadastrais da pessoa jurídica responsável pela prestação do serviço, para que contrato
            e nota fiscal fiquem formalizados corretamente. Isso não altera valor, escopo ou condições já alinhadas."
          </Paragraph>
        </Section>

        <Section title="11. Perguntas obrigatórias na reunião">
          <Bullet>Quais campos são realmente obrigatórios em campo?</Bullet>
          <Bullet>O lançamento será feito durante a visita ou depois pela equipe administrativa?</Bullet>
          <Bullet>Quem serão os usuários-chave e quem homologa o sistema?</Bullet>
          <Bullet>Quem valida o modelo do PDF?</Bullet>
          <Bullet>A ida a campo de 27/05 a 05/06 pode ser usada como referência real do fluxo?</Bullet>
          <Bullet>A mala direta continua como evolução posterior?</Bullet>
          <Bullet>Quais fichas, planilhas, relatórios ou documentos eles usam hoje?</Bullet>
          <Bullet>Existe restrição de acesso por projeto, município ou equipe nesta primeira fase?</Bullet>
        </Section>

        <Section title="12. Situação técnica atual">
          <Bullet>O sistema já possui base funcional para famílias, atendimentos, técnicos e PDF individual.</Bullet>
          <Bullet>Build validado com sucesso.</Bullet>
          <Bullet>Fluxo testado localmente: família, atendimento, edição e PDF retornaram status 200.</Bullet>
          <Bullet>URL local de referência: http://127.0.0.1:3000/ater-sociobio</Bullet>
        </Section>

        <View style={styles.callout}>
          <Text style={styles.calloutText}>
            Objetivo da reunião: mostrar direção, validar o mínimo necessário e proteger o escopo sem parecer que algo está
            sendo negado. A mensagem central é faseamento: primeiro fluxo principal, depois evoluções.
          </Text>
        </View>

        <Footer />
      </Page>
    </Document>
  );
}

async function main() {
  await renderToFile(<MeetingSummaryDocument />, outputPath);
  console.log(`PDF generated: ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
