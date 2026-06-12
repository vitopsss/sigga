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
  "Proposta_Tecnica_Comercial_SIGGATER_Web_Fase_1_Revisada_Adequada_Parecer_07_2026.pdf",
);

const totalValue = 27000;
const installments = [
  {
    label: "Marco 0: contratação, setup inicial e alinhamento final do fluxo de implantação",
    amount: 8100,
  },
  {
    label: "Entrega 1: cadastro da UFPA, equipe técnica, organização coletiva e base operacional",
    amount: 8100,
  },
  {
    label: "Entrega 2: visitas técnicas, diagnóstico essencial, indicadores, métricas operacionais essenciais e relatórios-base",
    amount: 8100,
  },
  {
    label: "Aceite final: homologação, treinamento e entrada em produção assistida",
    amount: 2700,
  },
];

const issueDate = new Intl.DateTimeFormat("pt-BR").format(new Date());

const styles = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingBottom: 42,
    paddingHorizontal: 42,
    fontFamily: "Helvetica",
    fontSize: 9.6,
    color: "#1f1f1f",
    lineHeight: 1.45,
  },
  title: {
    fontSize: 17.5,
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
    marginTop: 11,
  },
  sectionTitle: {
    marginBottom: 7,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "#f1f3f2",
    borderLeftWidth: 6,
    borderLeftColor: "#174c3c",
    fontFamily: "Helvetica-Bold",
    fontSize: 10.2,
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
  explanationBox: {
    borderWidth: 1.4,
    borderColor: "#174c3c",
    backgroundColor: "#f5fbf8",
    padding: 11,
    marginBottom: 10,
  },
  explanationTitle: {
    fontFamily: "Helvetica-Bold",
    color: "#174c3c",
    marginBottom: 6,
    fontSize: 10.2,
    textTransform: "uppercase",
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
    fontSize: 9.4,
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
    fontSize: 8,
    textTransform: "uppercase",
  },
  tableCell: {
    borderTopWidth: 1,
    borderTopColor: "#303030",
    borderRightWidth: 1,
    borderRightColor: "#303030",
    paddingVertical: 6,
    paddingHorizontal: 7,
    fontSize: 8.8,
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
    marginTop: 26,
  },
  signatureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 22,
  },
  signatureBox: {
    width: "47%",
    minHeight: 104,
    borderWidth: 1,
    borderColor: "#8f9893",
    padding: 8,
  },
  signatureHint: {
    fontSize: 7.6,
    color: "#6b7280",
    textAlign: "center",
  },
  signatureLine: {
    marginTop: 50,
    marginBottom: 7,
    borderTopWidth: 1.1,
    borderTopColor: "#1f1f1f",
  },
  signatureName: {
    textAlign: "center",
    fontFamily: "Helvetica-Bold",
  },
  signatureRole: {
    marginTop: 2,
    textAlign: "center",
    fontSize: 8.4,
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

export function ProposalPages() {
  return (
    <>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Proposta Técnica e Comercial Revisada</Text>
        <Text style={styles.subtitle}>SIGGATER Web | Fase 1 das atividades de ATER do Instituto Acariquara</Text>

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
          <MetaLine
            label="Referência"
            value="Versão revisada após reunião técnica com Orlanda Machado em 25/05/2026, análise dos modelos de cadastro, diagnóstico, indicadores e relatório do ATERSOCIOBIO, e adequada às observações do Parecer Jurídico nº 07/2026."
          />
        </View>

        <View style={styles.heroBox} wrap={false}>
          <Text style={styles.paragraph}>
            Esta proposta contempla a implantação da Fase 1 do{" "}
            <Text style={{ fontFamily: "Helvetica-Bold" }}>SIGGATER Web</Text>, estruturado sobre a base do SIGGA v5,
            para apoiar as atividades de Assistência Técnica e Extensão Rural (ATER) do Instituto Acariquara, com implantação
            inicial orientada ao projeto <Text style={{ fontFamily: "Helvetica-Bold" }}>ATERSOCIOBIO</Text>.
          </Text>
          <Text style={[styles.paragraph, { marginBottom: 0 }]}>
            O objetivo é oferecer ao Instituto uma solução web enxuta, prática e escalável para organizar UFPAs, integrantes,
            equipe técnica, visitas, diagnóstico, indicadores, métricas essenciais e relatório individual por atendimento.
          </Text>
        </View>

        <View style={styles.explanationBox} wrap={false}>
          <Text style={styles.explanationTitle}>Justificativa da revisão da proposta</Text>
          <Text style={styles.paragraph}>
            A proposta inicial foi construída com base no entendimento disponível naquele momento, considerando principalmente
            o núcleo operacional: cadastro-base, registro de visitas técnicas, relatórios-base e geração de PDF individual por
            atendimento.
          </Text>
          <Text style={styles.paragraph}>
            Após a reunião técnica realizada com Orlanda Machado em 25/05/2026 e o recebimento dos modelos de cadastro,
            diagnóstico, indicadores e relatório do ATERSOCIOBIO, ficou mais claro o plano de trabalho real da Fase 1.
          </Text>
          <Text style={[styles.paragraph, { marginBottom: 0 }]}>
            Por isso, esta versão revisada ajusta o escopo e o valor para contemplar também a organização das UFPAs, seus
            integrantes, vínculo com organização coletiva, diagnóstico estruturado e métricas essenciais para apoiar o
            acompanhamento técnico e o plano de ação das unidades atendidas.
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
            <Text style={styles.highlightTitle}>Recorte de escopo revisado</Text>
            <BulletList
              items={[
                "Uso institucional nas atividades de ATER do Instituto.",
                "Implantação inicial orientada ao ATERSOCIOBIO.",
                "Foco em dados essenciais, métricas operacionais essenciais e relatório individual.",
              ]}
            />
          </View>
        </View>

        <Section title="1. O que será entregue nesta fase">
          <BulletList
            items={[
              "Cadastro da UFPA, isto é, Unidade Familiar de Produção Agrária, com identificação, responsável, município, comunidade, DAP/CAF, programa de fomento e informações operacionais.",
              "Cadastro inicial dos integrantes da UFPA, permitindo registrar membros da unidade familiar e identificar o responsável.",
              "Cadastro e vínculo básico com Organização Coletiva ou Grupo de Interesse, quando aplicável.",
              "Cadastro e gestão da equipe técnica responsável pelo acompanhamento de campo.",
              "Registro de visitas técnicas com número da visita, data, técnico responsável, referência do projeto e acompanhamento dos eixos produtivo, social e ambiental.",
              "Estrutura inicial para diagnóstico da UFPA e indicadores operacionais previstos no Anexo I - Baseline de Escopo, usando como referência os modelos enviados pelo Instituto.",
              "Armazenamento de anexo do termo LGPD assinado vinculado ao cadastro da UFPA, para controle interno e comprovação documental.",
              "Métricas operacionais essenciais para apoiar a coordenação, como total de UFPAs, situações de água/saneamento, CadÚnico, insegurança alimentar, políticas públicas, práticas ambientais e status de acompanhamento.",
              "Controle operacional de informações ligadas ao SGA e à validação interna, incluindo status como enviado, aprovado ou reprovado pelo gestor.",
              "Consultas, filtros e relatórios-base para apoio à coordenação e rotina do projeto.",
              "Geração de PDF individual por visita técnica, para uso operacional.",
              "Perfis de acesso para administração, coordenação/gerência e operação.",
            ]}
          />
        </Section>
      </Page>

      <Page size="A4" style={styles.page}>
        <Section title="2. Por que esta proposta continua financeiramente adequada">
          <Text style={styles.paragraph}>
            O valor desta proposta foi revisado para refletir melhor o plano de trabalho compreendido após a reunião técnica
            e o recebimento dos modelos oficiais. Ainda assim, a proposta mantém um recorte reduzido em relação ao MVP completo
            originalmente apresentado, pois concentra a Fase 1 no que é necessário para iniciar a operação com segurança.
          </Text>
          <BulletList
            items={[
              "O Instituto contrata uma primeira fase útil e implantável, sem assumir agora o custo de um sistema institucional completo.",
              "A solução já nasce preparada para expansão futura, evitando retrabalho e sistemas paralelos.",
              "O investimento contempla estrutura de dados, telas operacionais, relatório individual, métricas operacionais essenciais, treinamento e operação assistida.",
              "Não há mensalidade de licenciamento do desenvolvedor nesta etapa inicial.",
            ]}
          />
        </Section>

        <Section title="3. Ganhos imediatos para o Instituto">
          <BulletList
            items={[
              "Centralização das informações de ATER em ambiente web único, com acesso controlado.",
              "Melhor organização das UFPAs, integrantes, equipe técnica e visitas.",
              "Registro estruturado de informações importantes para diagnóstico e acompanhamento.",
              "Métricas iniciais para apoiar decisões, priorização de famílias e elaboração de plano de ação.",
              "Base preparada para futuras expansões, sem perda do investimento já realizado nesta fase.",
            ]}
          />
        </Section>

        <Section title="4. Itens que ficam fora desta fase">
          <View style={styles.notice}>
            <BulletList
              items={[
                "Geração de vários documentos de uma só vez, quando o objetivo for emitir relatórios em grande quantidade automaticamente.",
                "Integração automática com outros sistemas externos, como SGA/ANATER ou plataformas de terceiros.",
                "Uso offline em campo, ou seja, preenchimento sem internet para sincronização posterior.",
                "Assinatura digital dentro do sistema.",
                "Painéis gerenciais mais avançados, com gráficos complexos, comparativos, mapas, rankings ou análises detalhadas.",
                "Reprodução completa de todos os formulários oficiais no mesmo formato visual dos documentos originais.",
                "Importação em massa de dados coletados em papel, planilhas ou outros arquivos, quando exigir tratamento automatizado.",
                "Permanência presencial contínua, dedicação exclusiva ou alocação fixa do contratado no Instituto.",
                "Fluxos específicos de outros projetos, programas ou contratos de ATER que demandem regras, formulários, relatórios ou rotinas próprias não previstas nesta Fase 1.",
              ]}
            />
          </View>
          <Text style={[styles.paragraph, { marginTop: 8 }]}>
            Caso surjam exigências normativas supervenientes de órgão financiador, parceiro público ou autoridade competente,
            as partes avaliarão por escrito se a adequação é compatível com o escopo já contratado ou se exigirá aditivo com
            novo prazo, orçamento e critério de aceite. Essas exigências não serão presumidas automaticamente como obrigação
            gratuita, nem executadas sem disciplina contratual clara quando afetarem escopo, custo ou cronograma.
          </Text>
        </Section>

        <Section title="5. Prazo, treinamento e suporte inicial">
          <BulletList
            items={[
              "Prazo estimado de implantação: até 45 dias corridos, contados da confirmação contratual, do pagamento da primeira parcela e da entrega dos insumos mínimos pelo Instituto.",
              "O prazo depende da validação dos campos obrigatórios, fluxos de atendimento, usuários-chave e retornos de homologação dentro do cronograma combinado.",
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
            O SIGGATER Web será implantado como aplicação em nuvem. Os custos recorrentes de hospedagem, banco de dados,
            armazenamento e serviços correlatos de infraestrutura serão suportados diretamente pela Contratante, não estando
            incluídos no valor de implantação.
          </Text>
          <Text style={styles.paragraph}>
            Em outras palavras: nesta proposta o Instituto paga a implantação do sistema, e os serviços técnicos de nuvem
            necessários à operação ficam em nome e por conta da própria instituição, mantendo previsibilidade e transparência
            sobre os gastos recorrentes.
          </Text>
          <Text style={styles.paragraph}>
            Antes da implantação em produção, o Contratado apresentará por escrito a recomendação de provedores e serviços
            necessários, com estimativa mensal de custo. Como referência inicial para ambiente de baixa/média utilização,
            considera-se uma estimativa operacional de até R$ 150,00 mensais, salvo aumento de volume, escolha de plano
            superior, domínio, e-mail, armazenamento adicional, backups adicionais ou exigência técnica específica aprovada
            pelo Instituto.
          </Text>
        </Section>
      </Page>

      <Page size="A4" style={styles.page}>
        <Section title="7. Propriedade intelectual, know-how e licença de uso">
          <Text style={styles.paragraph}>
            O Instituto recebe licença de uso da versão entregue do SIGGATER Web, por prazo indeterminado, para suas
            atividades institucionais de ATER contempladas nesta Fase 1, conforme o escopo contratado.
          </Text>
          <Text style={styles.paragraph}>
            Essa licença de uso não transfere ao Instituto a titularidade do código-fonte, arquitetura, componentes
            reutilizáveis, bibliotecas, métodos, rotinas, padrões técnicos, experiências ou know-how do Contratado, salvo
            se houver cessão expressa por escrito em instrumento próprio.
          </Text>
          <Text style={styles.paragraph}>
            A licença não autoriza comercialização, sublicenciamento, cessão a terceiros, engenharia reversa, criação de
            produto concorrente, desenvolvimento de obras derivadas ou criação de módulos paralelos por terceiros com base no
            código-fonte, arquitetura, componentes, rotinas, métodos, padrões técnicos ou documentação técnica proprietária do
            Contratado. Também não inclui, após o período de garantia e operação assistida, suporte gratuito, novas
            funcionalidades, hospedagem, integrações, manutenção recorrente ou adequações futuras, que poderão ser contratadas
            em instrumento próprio.
          </Text>
          <Text style={styles.paragraph}>
            Os dados, regras de negócio, informações, formulários, documentos e conteúdos inseridos pelo Instituto no
            sistema permanecem de titularidade da Contratante.
          </Text>
          <Text style={styles.paragraph}>
            Caso o Instituto exija mecanismo de escrow de código-fonte, as partes poderão formalizar termo específico,
            limitado a pacote técnico de continuidade por até 12 meses após a entrada em produção, com custos suportados pela
            Contratante. O acesso ao material, se pactuado, ficará limitado a hipóteses excepcionais de continuidade interna,
            sem transferência de titularidade ou know-how.
          </Text>
        </Section>

        <Section title="8. O investimento contempla">
          <Text style={styles.paragraph}>
            Para dar transparência comercial à contratação, o valor desta fase está ancorado em quatro frentes de entrega.
            O objetivo não é abrir custo interno do contratado, e sim deixar claro o que está efetivamente sendo contratado
            pelo Instituto.
          </Text>
          <BulletList
            items={[
              "Estruturação técnica da base do módulo, com banco de dados, perfis de acesso, organização do ambiente inicial e preparação para expansão futura.",
              "Modelagem do fluxo operacional com base nos modelos enviados, contemplando UFPA, integrantes, organização coletiva, diagnóstico e indicadores previstos no Baseline de Escopo.",
              "Implementação das rotinas centrais de operação, incluindo visitas técnicas, controle operacional, métricas operacionais essenciais e relatórios-base.",
              "Homologação, treinamento dos pontos focais, operação assistida pós-implantação e garantia corretiva após a entrada em produção.",
            ]}
          />
        </Section>

        <Section title="9. Investimento e forma de pagamento" wrap={false}>
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

          <Text style={styles.totalBox}>Investimento total da Fase 1 revisada: {brl(totalValue)}</Text>
          <Text style={styles.paragraph}>
            A forma de pagamento por marcos protege ambas as partes: o Instituto desembolsa à medida que as entregas são
            materializadas, e o cronograma permanece vinculado à homologação e ao avanço real da implantação.
          </Text>
          <Text style={styles.paragraph}>
            Este valor harmoniza a Proposta Técnica e Comercial Revisada com os instrumentos de formalização da Fase 1,
            mantendo o investimento total de R$ 27.000,00 para o escopo descrito neste documento.
          </Text>
          <Text style={styles.paragraph}>
            Após o aceite expresso ou tácito de cada marco, o pagamento da respectiva parcela deverá ocorrer em até 5 (cinco)
            dias úteis contados da apresentação da Nota Fiscal de Serviço pela Contratada.
          </Text>
        </Section>
      </Page>

      <Page size="A4" style={styles.page}>
        <Section title="10. Premissas para expansão futura">
          <Text style={styles.paragraph}>
            A presente proposta foi dimensionada para a Fase 1 revisada, com foco em operação, diagnóstico estruturado e
            métricas operacionais previstas no Baseline de Escopo. Caso o Instituto deseje posteriormente incorporar novos projetos de ATER, novos formulários,
            relatórios mais complexos, automações ou integrações, essas demandas poderão ser adicionadas por meio de evolução
            contratual específica.
          </Text>
        </Section>

        <Section title="11. Segurança, LGPD e entrega dos dados">
          <Text style={styles.paragraph}>
            A Contratante permanece titular dos dados inseridos no sistema. No âmbito da implantação, o Contratado adotará
            controles objetivos compatíveis com a Fase 1, incluindo acesso por usuário e perfil, restrição de acesso técnico
            ao mínimo necessário, uso de conexão segura em produção, orientação/configuração de backups conforme os recursos
            do provedor escolhido e manutenção de confidencialidade sobre dados e documentos acessados.
          </Text>
          <Text style={styles.paragraph}>
            Em caso de incidente de segurança relevante de que tenha ciência e que possa afetar dados pessoais tratados no
            sistema, o Contratado comunicará a Contratante em até 72 horas. Ao término da contratação, quando solicitado, os
            dados acessíveis serão exportados em até 15 dias em formato estruturado, conforme viabilidade técnica, como CSV,
            XLSX, JSON ou cópia de banco de dados.
          </Text>
        </Section>

        <Section title="12. Responsabilidade e critérios de aceite">
          <Text style={styles.paragraph}>
            A responsabilidade direta do Contratado, quando comprovadamente aplicável, ficará limitada ao valor total
            efetivamente pago pela Contratante no âmbito desta Fase 1. O Contratado responderá por falhas diretamente
            decorrentes de erro técnico seu na configuração, implantação ou orientação de infraestrutura por ele indicada,
            observado esse limite.
          </Text>
          <Text style={styles.paragraph}>
            Os marcos de entrega serão homologados com base em critérios objetivos: funcionamento dos cadastros previstos,
            registro de visitas, estrutura de diagnóstico e indicadores operacionais previstos no Anexo I - Baseline de Escopo,
            métricas operacionais essenciais, relatórios-base, PDF individual, treinamento dos pontos focais e correção dos
            ajustes vinculados ao escopo contratado.
          </Text>
          <Text style={styles.paragraph}>
            A Contratante terá até 5 (cinco) dias úteis para avaliar cada marco disponibilizado para homologação, apresentando
            aceite formal ou lista objetiva de correções vinculadas exclusivamente ao escopo desta Fase 1. Decorrido esse prazo
            sem manifestação formal, o respectivo marco será considerado tacitamente aceito para fins de continuidade do
            cronograma e faturamento. Marcos em andamento, se houver rescisão, serão apurados com base nesses critérios e nas
            evidências de entrega, com tentativa prévia de mediação/negociação antes de eventual disputa formal.
          </Text>
        </Section>

        <Section title="13. Adequações incorporadas ao parecer jurídico">
          <BulletList
            items={[
              "Disciplina expressa para exigências normativas supervenientes, com avaliação escrita e aditivo quando houver impacto de escopo, custo ou prazo.",
              "Previsão de especificação escrita dos provedores de nuvem e estimativa mensal antes da implantação em produção.",
              "Harmonização do investimento total da Fase 1 revisada em R$ 27.000,00.",
              "Obrigações objetivas de segurança, confidencialidade, comunicação de incidente e exportação de dados em até 15 dias.",
              "Licença de uso por prazo indeterminado, sem transferência de código-fonte, arquitetura, componentes ou know-how.",
              "Vedação expressa à criação de obras derivadas, módulos paralelos ou produtos concorrentes baseados em ativos técnicos proprietários do Contratado.",
              "Escrow apenas se exigido em termo próprio, limitado à continuidade interna e sem transferência de titularidade.",
              "Aceite tácito por ausência de manifestação em até 5 dias úteis e pagamento condicionado ao aceite e à apresentação da Nota Fiscal de Serviço.",
              "Responsabilidade limitada ao valor total efetivamente pago e vinculada a falhas diretamente causadas pelo Contratado.",
              "Critérios objetivos de aceite por marcos e mediação/negociação prévia para divergências sobre entrega ou valores.",
            ]}
          />
        </Section>

        <Section title="14. Validade da proposta e observação final">
          <Text style={styles.paragraph}>Esta proposta possui validade comercial de 15 dias corridos a partir da data de emissão.</Text>
          <Text style={styles.paragraph}>
            A lógica desta contratação é objetiva: entregar rapidamente ao Instituto uma solução aderente à rotina de ATER,
            com investimento controlado, ganho operacional imediato, diagnóstico estruturado, métricas úteis e base técnica
            aproveitável para etapas futuras.
          </Text>
        </Section>

        <Text style={styles.footerNote}>
          Documento de proposta técnica e comercial revisada para implantação do SIGGATER Web - Fase 1 das atividades de ATER
          do Instituto Acariquara.
        </Text>

        <View style={styles.signatures}>
          <Text>Manaus/AM, ____ de __________________ de 2026.</Text>
          <View style={styles.signatureRow}>
            <View style={styles.signatureBox}>
              <Text style={styles.signatureHint}>Campo reservado para assinatura física ou eletrônica da proposta</Text>
              <View style={styles.signatureLine} />
              <Text style={styles.signatureName}>João Victor Passos</Text>
              <Text style={styles.signatureRole}>Contratado</Text>
            </View>
            <View style={styles.signatureBox}>
              <Text style={styles.signatureHint}>Campo reservado para assinatura física ou eletrônica da proposta</Text>
              <View style={styles.signatureLine} />
              <Text style={styles.signatureName}>Instituto Acariquara</Text>
              <Text style={styles.signatureRole}>Contratante</Text>
            </View>
          </View>
        </View>
      </Page>
    </>
  );
}

function ProposalDocument() {
  return (
    <Document
      title="Proposta Técnica e Comercial Revisada - SIGGATER Web - Adequada ao Parecer Jurídico 07/2026"
      author="João Victor Passos"
      subject="Proposta revisada e adequada ao Parecer Jurídico 07/2026 para implantação da Fase 1 do SIGGATER Web"
      creator="SIGGA"
      producer="SIGGA"
    >
      <ProposalPages />
    </Document>
  );
}

async function main() {
  await renderToFile(<ProposalDocument />, outputPath);
  console.log(`PDF gerado com sucesso em ${outputPath}`);
}

if (path.basename(process.argv[1] ?? "") === "generate-siggater-revised-proposal-pdf.tsx") {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
