import fs from "node:fs";
import path from "node:path";
import React, { type ReactNode } from "react";
import { Document, Page, StyleSheet, Text, View, renderToFile } from "@react-pdf/renderer";

const outputDir = path.resolve(process.cwd(), "docs", "acariquara", "contratacao");
const outputPath = path.join(outputDir, "Contrato_SIGGATER_Web_Fase_1_Adequado_Parecer_07_2026.pdf");

const totalValue = 27000;
const installments = [
  {
    marco: "Marco 0",
    descricao: "Contratação, setup inicial, estimativa de infraestrutura e alinhamento final do fluxo de implantação.",
    valor: 8100,
  },
  {
    marco: "Entrega 1",
    descricao: "Cadastro da UFPA, integrantes, equipe técnica, organização coletiva, perfis de acesso e base operacional.",
    valor: 8100,
  },
  {
    marco: "Entrega 2",
    descricao: "Visitas técnicas, diagnóstico essencial, indicadores, métricas básicas, relatórios-base e PDF individual.",
    valor: 8100,
  },
  {
    marco: "Aceite final",
    descricao: "Homologação, treinamento, ajustes corretivos de escopo e entrada em produção assistida.",
    valor: 2700,
  },
];

const issueDate = new Intl.DateTimeFormat("pt-BR", {
  timeZone: "America/Manaus",
}).format(new Date());

function brl(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

const styles = StyleSheet.create({
  page: {
    paddingTop: 34,
    paddingBottom: 38,
    paddingHorizontal: 40,
    fontFamily: "Helvetica",
    fontSize: 9.1,
    color: "#111111",
    lineHeight: 1.38,
  },
  title: {
    fontSize: 15.6,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    textTransform: "uppercase",
    borderBottomWidth: 3,
    borderBottomColor: "#111111",
    paddingBottom: 8,
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 10,
    textAlign: "center",
    fontSize: 10.4,
    fontFamily: "Helvetica-Bold",
  },
  metaBox: {
    borderWidth: 1,
    borderColor: "#d5d9d7",
    backgroundColor: "#fafbfa",
    padding: 10,
    marginBottom: 9,
  },
  metaLabel: {
    fontSize: 7.4,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    color: "#4a4a4a",
    marginBottom: 1.5,
  },
  metaValue: {
    marginBottom: 5,
  },
  section: {
    marginTop: 8,
  },
  sectionTitle: {
    marginBottom: 5,
    paddingVertical: 5,
    paddingHorizontal: 8,
    backgroundColor: "#f1f3f2",
    borderLeftWidth: 5,
    borderLeftColor: "#111111",
    fontFamily: "Helvetica-Bold",
    fontSize: 9.6,
    textTransform: "uppercase",
  },
  paragraph: {
    marginBottom: 5,
    textAlign: "justify",
  },
  bold: {
    fontFamily: "Helvetica-Bold",
  },
  notice: {
    borderWidth: 1.2,
    borderColor: "#111111",
    borderStyle: "dashed",
    backgroundColor: "#fbfbfb",
    padding: 8,
    marginBottom: 4,
  },
  bulletList: {
    marginBottom: 2,
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 3,
  },
  bullet: {
    width: 10,
    fontFamily: "Helvetica-Bold",
  },
  bulletText: {
    flex: 1,
    textAlign: "justify",
  },
  table: {
    display: "table",
    width: "auto",
    marginTop: 5,
    marginBottom: 8,
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
    paddingVertical: 5,
    paddingHorizontal: 6,
    fontFamily: "Helvetica-Bold",
    fontSize: 7.8,
    textTransform: "uppercase",
  },
  tableCell: {
    borderTopWidth: 1,
    borderTopColor: "#303030",
    borderRightWidth: 1,
    borderRightColor: "#303030",
    paddingVertical: 5,
    paddingHorizontal: 6,
    fontSize: 8.3,
  },
  lastCell: {
    borderRightWidth: 0,
  },
  totalBox: {
    marginTop: 3,
    marginBottom: 7,
    borderWidth: 2,
    borderColor: "#111111",
    backgroundColor: "#f7f7f7",
    padding: 9,
    textAlign: "center",
    fontFamily: "Helvetica-Bold",
    fontSize: 10.2,
  },
  footerNote: {
    marginTop: 6,
    fontSize: 8,
    color: "#4a4a4a",
  },
  signatures: {
    marginTop: 30,
  },
  signatureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 36,
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

function Section({ title, children, wrap = true }: { title: string; children: ReactNode; wrap?: boolean }) {
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
  children: ReactNode;
  width: string;
  header?: boolean;
  last?: boolean;
}) {
  return (
    <Text style={[header ? styles.tableHeaderCell : styles.tableCell, { width }, last ? styles.lastCell : null]}>
      {children}
    </Text>
  );
}

function ContractDocument() {
  return (
    <Document
      title="Contrato SIGGATER Web - Adequado ao Parecer Juridico 07/2026"
      author="Joao Victor Passos"
      subject="Instrumento particular de prestacao de servicos de implantacao de software"
      creator="SIGGA"
      producer="SIGGA"
    >
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Instrumento Particular de Prestação de Serviços de Implantação de Software</Text>
        <Text style={styles.subtitle}>SIGGATER Web - Fase 1 | Adequado ao Parecer Jurídico nº 07/2026</Text>

        <View style={styles.metaBox}>
          <MetaLine label="Contratado" value="João Victor Passos, inscrito no CNPJ sob o nº 66.290.033/0001-21." />
          <MetaLine
            label="Contratante"
            value="Instituto Acariquara, inscrito no CNPJ sob o nº 06.284.362/0001-38, com sede em Manaus/AM."
          />
          <MetaLine label="Data de emissão" value={issueDate} />
          <MetaLine
            label="Referência"
            value="Versão ajustada a partir da Proposta Técnica e Comercial Revisada e das observações do Parecer Jurídico nº 07/2026."
          />
        </View>

        <Section title="1. Definições e premissas">
          <Text style={styles.paragraph}>
            Para fins deste contrato: (i) "Sistema" significa o módulo web denominado SIGGATER Web; (ii) "Fase 1"
            significa o recorte inicial de implantação para apoio às atividades de ATER do Instituto, com implantação
            prática orientada ao modelo operacional do ATERSOCIOBIO; (iii) "Go-live" significa a entrada em produção
            para uso real; e (iv) "Aceite" significa a aprovação formal de entrega, conforme critérios da Cláusula 6.
          </Text>
          <Text style={styles.paragraph}>
            Outros projetos, programas ou contratos de ATER poderão aproveitar a base institucional implantada, desde
            que suas regras, formulários, relatórios, integrações ou fluxos específicos sejam previamente avaliados e,
            quando alterarem o escopo, formalizados por aditivo.
          </Text>
        </Section>

        <Section title="2. Escopo da Fase 1">
          <BulletList
            items={[
              "Cadastro da UFPA, isto é, Unidade Familiar de Produção Agrária, com identificação, responsável, município, comunidade, DAP/CAF, programa de fomento e informações operacionais.",
              "Cadastro inicial dos integrantes da UFPA, permitindo registrar membros da unidade familiar e identificar o responsável.",
              "Cadastro e vínculo com Organização Coletiva ou Grupo de Interesse, quando aplicável.",
              "Cadastro e gestão da equipe técnica responsável pelo acompanhamento de campo.",
              "Estrutura inicial para diagnóstico da UFPA e indicadores essenciais, usando como referência os modelos enviados pelo Instituto.",
              "Métricas básicas para apoio à coordenação, incluindo situações de água/saneamento, CadÚnico, insegurança alimentar, políticas públicas, práticas ambientais e status de acompanhamento.",
              "Registro de visitas técnicas com número da visita, data, técnico responsável, referência do projeto e acompanhamento dos eixos produtivo, social e ambiental.",
              "Controle operacional de informações ligadas ao SGA e à validação interna, incluindo status como enviado, aprovado ou reprovado pelo gestor.",
              "Consultas, filtros, relatórios-base e geração de PDF individual por visita técnica.",
              "Perfis de acesso para administração, coordenação/gerência e operação.",
            ]}
          />
        </Section>

        <Section title="3. Itens fora de escopo e exigências supervenientes">
          <View style={styles.notice}>
            <BulletList
              items={[
                "Integração automática com SGA/ANATER ou outros sistemas externos.",
                "Geração de documentos em lote, mala direta, automação massiva de PDFs ou preenchimento automático em grande volume.",
                "Aplicativo móvel nativo, operação offline em campo e sincronização posterior sem internet.",
                "Assinatura digital dentro do sistema.",
                "Painéis gerenciais avançados, mapas, rankings, análises comparativas complexas ou business intelligence completo.",
                "Reprodução integral/pixel-perfect de todos os formulários oficiais no mesmo formato visual dos documentos originais.",
                "Fluxos específicos de outros projetos/programas de ATER que demandem regras, formulários, relatórios ou rotinas próprias não previstos nesta Fase 1.",
                "Permanência presencial contínua, dedicação exclusiva ou alocação fixa do Contratado no Instituto.",
              ]}
            />
          </View>
          <Text style={styles.paragraph}>
            Caso surjam exigências normativas supervenientes de órgão financiador, parceiro público ou autoridade
            competente, as partes avaliarão por escrito se a adequação: (i) é compatível com o escopo e esforço já
            contratado; ou (ii) exige aditivo com novo prazo, orçamento e critério de aceite. Tais exigências não serão
            presumidas automaticamente como serviço extra nem como obrigação gratuita, devendo ser disciplinadas
            contratualmente antes da execução quando afetarem escopo, custo ou cronograma.
          </Text>
        </Section>

        <Section title="4. Infraestrutura, custos recorrentes e acessos">
          <Text style={styles.paragraph}>
            Antes do início da implantação em ambiente de produção, o Contratado apresentará por escrito a recomendação
            técnica de provedores e serviços de nuvem, incluindo, quando aplicável, aplicação web, banco de dados,
            armazenamento, domínio e serviços auxiliares.
          </Text>
          <Text style={styles.paragraph}>
            Como referência inicial para ambiente de baixa/média utilização, recomenda-se arquitetura com provedor de
            aplicação web e banco PostgreSQL gerenciado, tais como Vercel/Supabase ou equivalentes, com estimativa
            operacional inicial de até R$ 150,00 mensais, salvo aumento de volume, escolha de plano superior, domínio,
            e-mail, storage, backups adicionais ou exigência técnica específica da Contratante.
          </Text>
          <Text style={styles.paragraph}>
            Qualquer contratação de infraestrutura que ultrapasse a estimativa acima deverá ser previamente aprovada
            pela Contratante. Os custos recorrentes serão suportados diretamente pela Contratante e não integram o valor
            de implantação.
          </Text>
        </Section>

        <FooterNote />
      </Page>

      <Page size="A4" style={styles.page}>
        <Section title="5. Prazo, treinamento, operação assistida e garantia">
          <BulletList
            items={[
              "Prazo estimado de implantação: até 45 dias corridos, contados do cumprimento cumulativo de assinatura do contrato, pagamento do Marco 0 e disponibilização dos insumos mínimos pela Contratante.",
              "O prazo depende da validação dos campos obrigatórios, fluxos de atendimento, documentos de referência, usuários-chave e retornos de homologação dentro do cronograma combinado.",
              "Treinamento inicial de até 2 pontos focais internos.",
              "Operação assistida por 30 dias após o Go-live.",
              "Garantia corretiva por 90 dias após o aceite final e entrada em produção, limitada à correção de falhas vinculadas ao escopo contratado.",
              "Suporte prestado prioritariamente de forma remota.",
              "Até 2 agendas presenciais durante a operação assistida, mediante agendamento prévio.",
            ]}
          />
          <Text style={styles.paragraph}>
            Atrasos na entrega de insumos, indisponibilidade de pontos focais ou atrasos de homologação pela Contratante
            suspendem o cronograma pelo período correspondente, sem caracterizar atraso do Contratado.
          </Text>
        </Section>

        <Section title="6. Homologação, aceite e critérios objetivos">
          <Text style={styles.paragraph}>
            A cada marco, o Contratado disponibilizará a entrega para homologação. A Contratante deverá responder em até
            7 dias corridos com aceite ou lista objetiva de ajustes vinculados ao escopo do marco.
          </Text>
          <BulletList
            items={[
              "Marco 0: aceite mediante apresentação do plano de implantação, estimativa de infraestrutura, validação dos acessos necessários e consolidação do fluxo operacional mínimo.",
              "Entrega 1: aceite mediante funcionamento dos cadastros de UFPA, integrantes, equipe técnica, organização coletiva e perfis de acesso.",
              "Entrega 2: aceite mediante funcionamento de visitas técnicas, diagnóstico essencial, indicadores, métricas básicas, relatórios-base e PDF individual.",
              "Aceite final: aceite mediante treinamento dos pontos focais, correção dos ajustes de escopo registrados na homologação e liberação para Go-live.",
            ]}
          />
          <Text style={styles.paragraph}>
            Ajustes de preferência visual, alteração de regra, inclusão de campo não previsto ou adaptação a novo fluxo
            não serão considerados correção obrigatória, salvo se estiverem vinculados aos critérios acima ou forem
            formalizados por aditivo.
          </Text>
        </Section>

        <Section title="7. Investimento e forma de pagamento" wrap={false}>
          <Text style={styles.paragraph}>
            O investimento total desta Fase 1 é de R$ 27.000,00 (vinte e sete mil reais), em valor fechado para o
            escopo contratado, pago por marcos de entrega:
          </Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <TableCell header width="20%">
                Marco
              </TableCell>
              <TableCell header width="60%">
                Descrição
              </TableCell>
              <TableCell header width="20%" last>
                Valor
              </TableCell>
            </View>
            {installments.map((item) => (
              <View style={styles.tableRow} key={item.marco}>
                <TableCell width="20%">{item.marco}</TableCell>
                <TableCell width="60%">{item.descricao}</TableCell>
                <TableCell width="20%" last>
                  {brl(item.valor)}
                </TableCell>
              </View>
            ))}
          </View>
          <Text style={styles.totalBox}>VALOR TOTAL: {brl(totalValue)}</Text>
          <Text style={styles.paragraph}>
            O atraso no pagamento suspende o cronograma até regularização. Despesas de infraestrutura, domínio,
            certificados, serviços de terceiros e custos de eventual escrow não estão incluídos no valor de implantação,
            salvo disposição expressa em contrário.
          </Text>
        </Section>

        <Section title="8. Mudanças de escopo e aditivos">
          <Text style={styles.paragraph}>
            Demandas que excedam o escopo da Cláusula 2, envolvam os itens da Cláusula 3 ou alterem substancialmente
            complexidade, prazo, volume de dados, integrações, modelos oficiais, responsabilidades ou infraestrutura
            deverão ser tratadas por aditivo contratual, com orçamento e cronograma específicos, aprovados previamente
            pela Contratante.
          </Text>
        </Section>

        <FooterNote />
      </Page>

      <Page size="A4" style={styles.page}>
        <Section title="9. Confidencialidade, LGPD e entrega dos dados">
          <Text style={styles.paragraph}>
            As partes reconhecem a aplicação da Lei Geral de Proteção de Dados. Para fins operacionais, a Contratante
            atua como Controladora dos dados e o Contratado como Operador, no que couber.
          </Text>
          <Text style={styles.paragraph}>O Contratado compromete-se, no âmbito do serviço contratado, a:</Text>
          <BulletList
            items={[
              "utilizar controle de acesso por usuário e perfis compatíveis com administração, coordenação/gerência e operação;",
              "restringir o acesso técnico aos dados ao mínimo necessário para implantação, suporte e correção de falhas;",
              "manter confidencialidade sobre dados, documentos e informações acessadas em razão do contrato;",
              "utilizar conexão segura HTTPS quando o sistema estiver publicado em ambiente de produção;",
              "manter ou orientar configuração de backups compatíveis com os recursos do provedor escolhido;",
              "registrar, quando tecnicamente disponível no ambiente contratado, logs básicos de acesso ou operação relevantes;",
              "comunicar a Contratante, em até 72 horas após ciência, sobre incidente de segurança relevante que possa afetar dados pessoais tratados no sistema;",
              "entregar, em até 15 dias após encerramento contratual solicitado pela Contratante, exportação dos dados acessíveis em formato estruturado, como CSV, XLSX, JSON ou dump de banco, conforme viabilidade técnica.",
            ]}
          />
          <Text style={styles.paragraph}>
            A exclusão de dados em provedores de terceiros observará as políticas do provedor e as permissões disponíveis
            nas contas mantidas pela Contratante.
          </Text>
        </Section>

        <Section title="10. Propriedade intelectual, licença de uso e escrow limitado">
          <Text style={styles.paragraph}>
            O Contratado permanece titular da propriedade intelectual do código-fonte, arquitetura, componentes
            reutilizáveis, bibliotecas, métodos, rotinas, padrões técnicos, experiências e know-how empregados ou
            desenvolvidos durante a execução do contrato, salvo cessão expressa em instrumento próprio.
          </Text>
          <Text style={styles.paragraph}>
            A Contratante recebe licença de uso da versão entregue do Sistema, por prazo indeterminado, para uso interno
            em suas atividades institucionais de ATER contempladas por esta Fase 1, sem direito de comercialização,
            sublicenciamento, cessão a terceiros, engenharia reversa ou criação de produto concorrente com base no
            código-fonte do Contratado.
          </Text>
          <Text style={styles.paragraph}>
            A licença por prazo indeterminado não inclui, após o período de garantia/operação assistida, suporte gratuito,
            novas funcionalidades, integrações, atualizações evolutivas, hospedagem, manutenção recorrente ou adequações
            futuras, que poderão ser contratadas em instrumento próprio.
          </Text>
          <Text style={styles.paragraph}>
            Caso a Contratante exija mecanismo de escrow, as partes poderão formalizar termo específico prevendo depósito
            de pacote técnico de continuidade por até 12 meses após o Go-live, com custos do serviço de escrow suportados
            pela Contratante. O acesso ao material somente poderá ocorrer em hipóteses excepcionais de encerramento
            definitivo das atividades do Contratado, incapacidade de continuidade, descumprimento grave não sanado em 30
            dias ou impossibilidade comprovada de exportação dos dados. O uso do material ficará limitado à manutenção
            interna e continuidade operacional da Contratante, sem transferência de titularidade ou know-how.
          </Text>
          <Text style={styles.paragraph}>
            Dados, regras de negócio, formulários, documentos e conteúdos inseridos pela Contratante permanecem de
            titularidade da Contratante.
          </Text>
        </Section>

        <Section title="11. Responsabilidade">
          <Text style={styles.paragraph}>
            A responsabilidade direta do Contratado, quando comprovadamente aplicável, fica limitada ao valor total
            efetivamente pago pela Contratante no âmbito deste contrato até a data do evento que originou o pedido.
          </Text>
          <Text style={styles.paragraph}>
            O Contratado responderá por falhas diretamente decorrentes de erro técnico seu na configuração, implantação
            ou orientação de infraestrutura por ele indicada, observado o limite acima.
          </Text>
          <Text style={styles.paragraph}>
            O Contratado não responderá por indisponibilidade ou falhas causadas por provedores terceiros, mau uso,
            alteração feita por terceiros, ausência de pagamento de infraestrutura pela Contratante, perda de credenciais
            fora de seu controle, caso fortuito, força maior, danos indiretos, lucros cessantes ou perda de oportunidade.
          </Text>
        </Section>

        <FooterNote />
      </Page>

      <Page size="A4" style={styles.page}>
        <Section title="12. Rescisão, marcos em andamento e mediação prévia">
          <Text style={styles.paragraph}>
            O contrato poderá ser rescindido por qualquer parte mediante notificação por escrito com antecedência mínima
            de 15 dias. Em caso de inadimplência, a parte adimplente poderá rescindir após notificação e não regularização
            em 5 dias.
          </Text>
          <BulletList
            items={[
              "Marcos já entregues e aceitos permanecem integralmente devidos.",
              "Marcos ainda não iniciados não serão devidos, salvo despesas previamente autorizadas e comprovadas.",
              "Marcos em andamento serão apurados com base nos critérios objetivos de aceite da Cláusula 6, nas evidências de entrega e na proporção material já disponibilizada à Contratante.",
              "Antes de qualquer disputa judicial sobre valores ou aceite, as partes deverão realizar reunião de mediação/negociação em até 5 dias úteis da notificação, registrando pendências e proposta de solução.",
            ]}
          />
        </Section>

        <Section title="13. Disposições gerais e foro">
          <Text style={styles.paragraph}>
            Este contrato representa o acordo integral entre as partes quanto ao objeto aqui tratado. Eventuais tolerâncias
            não constituem renúncia de direitos. Alterações deverão ser feitas por escrito. O foro eleito é o da comarca
            de Manaus/AM, com renúncia a qualquer outro, por mais privilegiado que seja.
          </Text>
        </Section>

        <Text style={styles.footerNote}>Manaus/AM, ____ de __________________ de 2026.</Text>

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

function FooterNote() {
  return (
    <Text style={styles.footerNote}>
      Minuta ajustada para análise das partes. Recomenda-se revisão final pelo jurídico antes da assinatura.
    </Text>
  );
}

async function main() {
  fs.mkdirSync(outputDir, { recursive: true });
  await renderToFile(<ContractDocument />, outputPath);
  console.log(`PDF gerado com sucesso em ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
