import { Prisma, PrismaClient, TipoCadastro } from "@prisma/client";

const prisma = new PrismaClient();

const PROJECT_TITLE = "ATER Sociobiodiversidade - FLONA de Tefé";
const DEMO_ORIGIN = "DEMO_SIGGATER";

function date(value: string) {
  return new Date(`${value}T00:00:00.000Z`);
}

function decimal(value: string | number) {
  return new Prisma.Decimal(value);
}

function inferSexo(nome: string) {
  const primeiroNome = nome.trim().split(/\s+/)[0]?.toLowerCase();
  const nomesFemininos = new Set([
    "ana",
    "bruna",
    "celia",
    "célia",
    "eliane",
    "francisca",
    "helena",
    "isabela",
    "lucia",
    "lúcia",
    "marcia",
    "márcia",
    "maria",
    "marilene",
    "patricia",
    "patrícia",
    "raimunda",
    "renata",
    "tereza",
  ]);

  return nomesFemininos.has(primeiroNome) ? "Feminino" : "Masculino";
}

type OrgSeed = {
  key: string;
  denominacao: string;
  municipio: string;
  grupoInteresse: string;
  numeroFamilias: number;
  atividades: string;
};

type IntegranteSeed = {
  nome: string;
  cpf: string;
  nisCadUnico?: string | null;
  parentesco: string;
  dataNascimento: string;
  escolaridade: string;
  telefones?: string | null;
  responsavelUfpa?: boolean;
};

type DiagnosticoSeed = Omit<Prisma.DiagnosticoUfpaUncheckedCreateInput, "id" | "familiaId" | "createdAt" | "updatedAt">;
type IndicadoresSeed = Omit<Prisma.IndicadoresUfpaUncheckedCreateInput, "id" | "familiaId" | "createdAt" | "updatedAt">;
type AtendimentoEixoSeed = Record<string, string | string[]>;

type AtendimentoSeed = {
  numeroVisita: number;
  data: string;
  tecnicoKey: "campo1" | "campo2" | "campo3";
  statusRelatorio: "PENDENTE" | "EM_ANALISE" | "REPROVADO_GESTOR" | "CONCLUIDO" | "ENVIADO_SGA";
  enviadoSGA: boolean;
  statusGestor?: string | null;
  atividadeNumeroTotal: string;
  codigoMeta: string;
  descricaoMeta: string;
  numeroMulheres: number;
  numeroJovens: number;
  eixoProdutivo: AtendimentoEixoSeed;
  eixoSocial: AtendimentoEixoSeed;
  eixoAmbiental: AtendimentoEixoSeed;
};

type FamiliaSeed = {
  nomeFamilia: string;
  nomeResponsavel: string;
  documentoResponsavel: string;
  telefone: string;
  quantidadeMembros: number;
  municipio: string;
  comunidade: string;
  enderecoUfpa: string;
  ufpa: string;
  orgKey: string;
  grupoInteresse: string;
  dapCaf?: string | null;
  codigoSGA?: string | null;
  statusGestor?: string | null;
  motivoReprovacaoGestor?: string | null;
  programaFomento?: string | null;
  areaEstabelecimento: string;
  areaImovelPrincipal: string;
  latitude: string;
  longitude: string;
  integrantes: IntegranteSeed[];
  diagnostico?: DiagnosticoSeed;
  indicadores?: IndicadoresSeed;
  atendimentos: AtendimentoSeed[];
};

const organizacoes: OrgSeed[] = [
  {
    key: "bauana",
    denominacao: "Núcleo Agroextrativista do Rio Bauana",
    municipio: "Alvarães",
    grupoInteresse: "Manejo de açaí",
    numeroFamilias: 22,
    atividades: "Açaí, castanha, pesca artesanal e roças de mandioca.",
  },
  {
    key: "curumita",
    denominacao: "Grupo Comunitario Curumita de Baixo",
    municipio: "Tefé",
    grupoInteresse: "Extrativismo da castanha",
    numeroFamilias: 18,
    atividades: "Castanha, manejo florestal comunitario e quintais produtivos.",
  },
  {
    key: "lago-tefe",
    denominacao: "Coletivo Ribeirinho do Lago Tefé",
    municipio: "Tefé",
    grupoInteresse: "Quintais agroecológicos",
    numeroFamilias: 16,
    atividades: "Quintais, hortas, galinhas caipiras, farinha e comercialização local.",
  },
  {
    key: "apafe",
    denominacao: "Rede de Produtores da FLONA de Tefé e Entorno",
    municipio: "Tefé",
    grupoInteresse: "Manejo florestal comunitário",
    numeroFamilias: 30,
    atividades: "Organização de produtores, beneficiamento artesanal e acesso a políticas públicas.",
  },
];

const tecnicos = [
  { key: "campo1", nome: "Ana Paula Nogueira", cpf: "90000000001" },
  { key: "campo2", nome: "Carlos Eduardo Lima", cpf: "90000000002" },
  { key: "campo3", nome: "Mariana Costa Ribeiro", cpf: "90000000003" },
] as const;

function diagnosticoBase(overrides: Partial<DiagnosticoSeed>): DiagnosticoSeed {
  return {
    dataDiagnostico: date("2026-05-27"),
    agenteAterNome1: "Ana Paula Nogueira",
    agenteAterCpf1: "90000000001",
    possuiRadio: true,
    possuiTelevisao: false,
    possuiCelular: true,
    usaRedesSociais: true,
    outroMeioComunicacao: "Rádio comunitária e recados por embarcação.",
    aguaParaConsumo: true,
    aguaParaProducao: true,
    captacaoAguaChuva: true,
    fontesProtegidas: false,
    qtdMaquinasAgricolas: 0,
    qtdImplementosAgricolas: 1,
    qtdVeiculosPasseio: 0,
    qtdConstrucoesRurais: 2,
    qtdBovinos: 0,
    qtdOvinos: 0,
    qtdCaprinos: 0,
    qtdSuinos: 2,
    qtdAves: 18,
    qtdColmeias: 0,
    qtdPequenosAnimaisOutros: 0,
    areaPastagens: decimal("0.00"),
    areaCulturasTemporarias: decimal("0.60"),
    areaCulturasPermanentes: decimal("0.80"),
    areaLaminaAgua: decimal("0.00"),
    areaExtrativismo: decimal("4.50"),
    areaReservaLegal: decimal("8.00"),
    areaOutrosUsos: decimal("0.30"),
    acoesPotenciaisProdutivo: "Organizar produção de farinha, açaí e castanha com agenda de visitas técnicas.",
    acoesPotenciaisSocial: "Atualizar documentação, CadÚnico e acesso a políticas sociais.",
    acoesPotenciaisAmbiental: "Orientar tratamento de água, saneamento rural e manejo de resíduos.",
    limitacoesProdutivo: "Distância, transporte fluvial e baixa regularidade de insumos.",
    limitacoesSocial: "Acesso limitado a internet, documentos e serviços públicos.",
    limitacoesAmbiental: "Saneamento rural precário e baixa estrutura para tratamento de água.",
    lgpdConsentimento: true,
    lgpdDataConsentimento: date("2026-05-27"),
    representanteNome: "Ana Paula Nogueira",
    representanteCpf: "90000000001",
    observacoes: "Cadastro demonstrativo fictício, criado para validar fluxo operacional do SIGGATER.",
    ...overrides,
  };
}

function indicadoresBase(overrides: Partial<IndicadoresSeed>): IndicadoresSeed {
  return {
    dataReferencia: date("2026-05-27"),
    alimentacaoVariadaComprometida: false,
    comidaAcabouSemCondicao: false,
    deixouRefeicaoSemCondicao: false,
    comeuMenosSemCondicao: false,
    qtdVezesComeuMenos: 0,
    sentiuFomeENaoComeu: false,
    documentacaoPessoalCompleta: true,
    cadastradoCadUnico: true,
    acessaPoliticasSociais: true,
    politicasSociaisQuais: "Bolsa Família e acompanhamento CRAS quando disponível.",
    participaGrupoComunitario: true,
    qualGrupoComunitario: "Grupo comunitario local",
    participaAssociacao: true,
    participaCooperativa: false,
    participaGrupoInformalProdutivo: true,
    participaGrupoInformalSocial: true,
    possuiPraticasSustentaveis: true,
    praticaIntegracaoAtividades: true,
    praticaDescarteCorretoEmbalagens: false,
    praticaControleQueimadas: true,
    praticaAdubacaoVerde: true,
    praticaRecuperacaoPastagens: false,
    praticaCoberturaSolo: true,
    praticaManejoIntegradoPragas: false,
    praticaProtecaoNascentes: false,
    praticaPreservacaoApps: true,
    praticaManejoFlorestal: true,
    valorBrutoProducaoUltimos12Meses: decimal("9800.00"),
    acessaPoliticasProdutivas: false,
    motivoNaoAcessaPoliticasFaltaInfo: true,
    motivoNaoAcessaPoliticasDificilAcesso: true,
    motivoNaoAcessaPoliticasSemInteresse: false,
    acessouPaa: false,
    acessouPnae: false,
    acessouPgpmBio: false,
    acessouPronaf: false,
    canalVendaPropriedade: true,
    canalVendaDiretaConsumidor: true,
    canalFeira: false,
    canalMercadoLocal: true,
    canalAtravessador: true,
    canalPaa: false,
    canalPnae: false,
    canalCooperativaEntreposto: false,
    observacoes: "Indicadores fictícios realistas para demonstração e validação.",
    ...overrides,
  };
}

function visita(
  numeroVisita: number,
  dataVisita: string,
  tecnicoKey: AtendimentoSeed["tecnicoKey"],
  statusRelatorio: AtendimentoSeed["statusRelatorio"],
  enviadoSGA: boolean,
  eixoProdutivo: string,
  eixoSocial: string,
  eixoAmbiental: string,
): AtendimentoSeed {
  return {
    numeroVisita,
    data: dataVisita,
    tecnicoKey,
    statusRelatorio,
    enviadoSGA,
    statusGestor: statusRelatorio === "REPROVADO_GESTOR" ? "REPROVADO_GESTOR" : enviadoSGA ? "ENVIADO_SGA" : null,
    atividadeNumeroTotal: `${numeroVisita}/16`,
    codigoMeta: numeroVisita % 2 === 0 ? "META-SBDV-02" : "META-SBDV-01",
    descricaoMeta: "Atendimento técnico individual para acompanhamento da UFPA no plano de trabalho da sociobiodiversidade.",
    numeroMulheres: numeroVisita % 2 === 0 ? 2 : 1,
    numeroJovens: numeroVisita % 2 === 0 ? 1 : 0,
    eixoProdutivo: {
      tecnologiaProducao: "Organização produtiva da UFPA",
      atividadeProdutiva: "Extrativismo, quintal produtivo e produção familiar",
      orientacoes: eixoProdutivo,
      outrasAtividadesUfpa: "Registrar volume produzido, canais de venda e necessidades de apoio técnico.",
      resultadosParciaisFinais: ["Incremento na produção/serviço", "Diversificação da produção/serviço"],
      indicadoresTrabalhados: ["Valor bruto da produção", "Canais de comercialização"],
    },
    eixoSocial: {
      orientacoesEncaminhamentos: eixoSocial,
      atividadeSocial: "Documentação, CadÚnico, segurança alimentar e participação comunitária",
      orientacoes: "Conferir documentação, orientar acesso a políticas públicas e registrar alertas sociais.",
      resultadosParciaisFinais: ["Acesso à Política Pública", "Orientação/encaminhamento social", "Documentação"],
      indicadoresTrabalhados: ["Segurança Alimentar e Nutricional"],
    },
    eixoAmbiental: {
      tecnologiaAmbiental: "Saneamento rural e práticas sustentáveis",
      atividadeAmbiental: "Água, esgoto, resíduos e conservação no entorno da UFPA",
      orientacoes: eixoAmbiental,
      resultadosParciaisFinais: ["Saneamento rural", "Preservação/Conservação ambiental"],
      indicadoresTrabalhados: ["Propriedade com práticas sustentáveis"],
    },
  };
}

const familias: FamiliaSeed[] = [
  {
    nomeFamilia: "Maria do Socorro Souza",
    nomeResponsavel: "Maria do Socorro Souza",
    documentoResponsavel: "91000000001",
    telefone: "92991000001",
    quantidadeMembros: 5,
    municipio: "Alvarães",
    comunidade: "São Francisco do Bauana",
    enderecoUfpa: "Margem do rio Bauana, proximo ao porto comunitario",
    ufpa: "UFPA-FLONA-001",
    orgKey: "bauana",
    grupoInteresse: "Manejo de açaí",
    dapCaf: "CAF-AM-TEF-2026-001",
    codigoSGA: "SGA-FLONA-2026-001",
    statusGestor: "ENVIADO_SGA",
    programaFomento: "Fomento Rural Sociobiodiversidade",
    areaEstabelecimento: "12.50",
    areaImovelPrincipal: "10.00",
    latitude: "-3.4762000",
    longitude: "-64.8143000",
    integrantes: [
      { nome: "Maria do Socorro Souza", cpf: "91000000001", nisCadUnico: "17000000001", parentesco: "Responsável", dataNascimento: "1984-03-12", escolaridade: "Ensino fundamental", telefones: "92991000001", responsavelUfpa: true },
      { nome: "José Raimundo Souza", cpf: "91000000002", parentesco: "Cônjuge", dataNascimento: "1981-08-19", escolaridade: "Ensino fundamental" },
      { nome: "Ana Beatriz Souza", cpf: "91000000003", nisCadUnico: "17000000003", parentesco: "Filha", dataNascimento: "2009-11-04", escolaridade: "Ensino fundamental" },
    ],
    diagnostico: diagnosticoBase({ possuiInternet: false, aguaConsumoTratada: false, esgotoTratado: false, qtdAves: 22, areaExtrativismo: decimal("6.20") }),
    indicadores: indicadoresBase({ alimentacaoVariadaComprometida: true, comidaAcabouSemCondicao: true, comeuMenosSemCondicao: true, qtdVezesComeuMenos: 3, cadastradoCadUnico: true, valorBrutoProducaoUltimos12Meses: decimal("8700.00") }),
    atendimentos: [
      visita(1, "2026-05-27", "campo1", "EM_ANALISE", true, "Levantada produção de açaí, mandioca e castanha.", "Família com CadÚnico ativo, mas com alerta alimentar recente.", "Água consumida sem tratamento regular."),
      visita(2, "2026-06-03", "campo2", "PENDENTE", false, "Orientação sobre organização da produção para venda local.", "Reforçada orientação para CRAS e atualização documental.", "Recomendado hipoclorito e proteção de fonte."),
    ],
  },
  {
    nomeFamilia: "Antonio Carlos Pereira",
    nomeResponsavel: "Antonio Carlos Pereira",
    documentoResponsavel: "91000000004",
    telefone: "92991000004",
    quantidadeMembros: 4,
    municipio: "Alvarães",
    comunidade: "Bom Jesus do Lago Tefé",
    enderecoUfpa: "Lago Tefé, área de várzea próxima à escola comunitária",
    ufpa: "UFPA-FLONA-002",
    orgKey: "lago-tefe",
    grupoInteresse: "Pesca artesanal",
    dapCaf: null,
    codigoSGA: "SGA-FLONA-2026-002",
    statusGestor: "APROVADO_GESTOR",
    programaFomento: "Quintais Produtivos",
    areaEstabelecimento: "8.20",
    areaImovelPrincipal: "7.50",
    latitude: "-3.3941000",
    longitude: "-64.7095000",
    integrantes: [
      { nome: "Antonio Carlos Pereira", cpf: "91000000004", nisCadUnico: "17000000004", parentesco: "Responsável", dataNascimento: "1979-04-22", escolaridade: "Ensino médio", telefones: "92991000004", responsavelUfpa: true },
      { nome: "Francisca Lima Pereira", cpf: "91000000005", nisCadUnico: "17000000005", parentesco: "Cônjuge", dataNascimento: "1982-01-17", escolaridade: "Ensino fundamental" },
      { nome: "Lucas Pereira", cpf: "91000000006", parentesco: "Filho", dataNascimento: "2012-07-13", escolaridade: "Ensino fundamental" },
    ],
    diagnostico: diagnosticoBase({ possuiInternet: true, aguaConsumoTratada: true, esgotoTratado: false, qtdAves: 14, areaExtrativismo: decimal("2.80") }),
    indicadores: indicadoresBase({ cadastradoCadUnico: true, acessaPoliticasProdutivas: true, acessouPaa: true, canalPaa: true, valorBrutoProducaoUltimos12Meses: decimal("12600.00") }),
    atendimentos: [visita(1, "2026-05-28", "campo2", "CONCLUIDO", true, "Mapeada pesca artesanal e horta familiar.", "Família acessa política social e participa do grupo local.", "Há tratamento de água, mas saneamento ainda é frágil.")],
  },
  {
    nomeFamilia: "Raimunda Nonata Costa",
    nomeResponsavel: "Raimunda Nonata Costa",
    documentoResponsavel: "91000000007",
    telefone: "92991000007",
    quantidadeMembros: 6,
    municipio: "Tefé",
    comunidade: "Vila Moura",
    enderecoUfpa: "Alto rio Tefé, localidade Vila Moura",
    ufpa: "UFPA-FLONA-003",
    orgKey: "apafe",
    grupoInteresse: "Manejo florestal comunitário",
    dapCaf: "CAF-AM-TEF-2026-003",
    codigoSGA: null,
    statusGestor: null,
    programaFomento: "Manejo Florestal Comunitario",
    areaEstabelecimento: "18.00",
    areaImovelPrincipal: "15.20",
    latitude: "-3.2975000",
    longitude: "-65.0188000",
    integrantes: [
      { nome: "Raimunda Nonata Costa", cpf: "91000000007", nisCadUnico: null, parentesco: "Responsável", dataNascimento: "1974-09-09", escolaridade: "Ensino fundamental", telefones: "92991000007", responsavelUfpa: true },
      { nome: "Manoel Costa", cpf: "91000000008", parentesco: "Cônjuge", dataNascimento: "1971-12-01", escolaridade: "Ensino fundamental" },
      { nome: "Bruna Costa", cpf: "91000000009", parentesco: "Filha", dataNascimento: "2004-05-29", escolaridade: "Ensino médio" },
    ],
    diagnostico: diagnosticoBase({ possuiInternet: false, aguaConsumoTratada: false, esgotoTratado: false, qtdColmeias: 8, areaExtrativismo: decimal("8.50"), areaReservaLegal: decimal("13.00") }),
    indicadores: indicadoresBase({ cadastradoCadUnico: false, acessaPoliticasSociais: false, documentacaoPessoalCompleta: false, participaCooperativa: true, possuiPraticasSustentaveis: true, valorBrutoProducaoUltimos12Meses: decimal("14200.00") }),
    atendimentos: [visita(1, "2026-05-29", "campo3", "EM_ANALISE", false, "Registrado potencial para castanha e manejo florestal.", "Pendência de documentação e CadÚnico.", "Fonte de água precisa de proteção e tratamento.")],
  },
  {
    nomeFamilia: "João Batista Oliveira",
    nomeResponsavel: "João Batista Oliveira",
    documentoResponsavel: "91000000010",
    telefone: "92991000010",
    quantidadeMembros: 3,
    municipio: "Tefé",
    comunidade: "Santa Luzia do Curumita",
    enderecoUfpa: "Rio Curumita de Baixo, ramal comunitario",
    ufpa: "UFPA-FLONA-004",
    orgKey: "curumita",
    grupoInteresse: "Extrativismo da castanha",
    dapCaf: "CAF-AM-TEF-2026-004",
    codigoSGA: "SGA-FLONA-2026-004",
    statusGestor: "APROVADO_GESTOR",
    programaFomento: "PGPM-Bio",
    areaEstabelecimento: "10.10",
    areaImovelPrincipal: "9.40",
    latitude: "-3.5881000",
    longitude: "-64.9631000",
    integrantes: [
      { nome: "João Batista Oliveira", cpf: "91000000010", nisCadUnico: "17000000010", parentesco: "Responsável", dataNascimento: "1988-02-25", escolaridade: "Ensino médio", telefones: "92991000010", responsavelUfpa: true },
      { nome: "Eliane Oliveira", cpf: "91000000011", parentesco: "Cônjuge", dataNascimento: "1990-06-18", escolaridade: "Ensino médio" },
    ],
    diagnostico: diagnosticoBase({ possuiInternet: true, aguaConsumoTratada: true, esgotoTratado: true, qtdAves: 20, areaExtrativismo: decimal("5.30") }),
    indicadores: indicadoresBase({ acessaPoliticasProdutivas: true, acessouPgpmBio: true, canalCooperativaEntreposto: true, valorBrutoProducaoUltimos12Meses: decimal("16400.00") }),
    atendimentos: [visita(1, "2026-05-30", "campo1", "ENVIADO_SGA", true, "Potencial produtivo ligado a castanha e rocas de mandioca.", "Documentacao organizada e participacao comunitaria ativa.", "Boas praticas de manejo ja registradas.")],
  },
  {
    nomeFamilia: "Célia Regina Almeida",
    nomeResponsavel: "Célia Regina Almeida",
    documentoResponsavel: "91000000012",
    telefone: "92991000012",
    quantidadeMembros: 4,
    municipio: "Alvarães",
    comunidade: "Boa Vista do Bauana",
    enderecoUfpa: "Comunidade Boa Vista, margem esquerda do rio Bauana",
    ufpa: "UFPA-FLONA-005",
    orgKey: "bauana",
    grupoInteresse: "Meliponicultura",
    dapCaf: null,
    codigoSGA: null,
    statusGestor: null,
    programaFomento: "Meliponicultura comunitaria",
    areaEstabelecimento: "6.70",
    areaImovelPrincipal: "5.90",
    latitude: "-3.5129000",
    longitude: "-64.8680000",
    integrantes: [
      { nome: "Célia Regina Almeida", cpf: "91000000012", nisCadUnico: "17000000012", parentesco: "Responsável", dataNascimento: "1992-10-10", escolaridade: "Ensino médio", telefones: "92991000012", responsavelUfpa: true },
      { nome: "Paulo Almeida", cpf: "91000000013", parentesco: "Cônjuge", dataNascimento: "1987-03-14", escolaridade: "Ensino fundamental" },
      { nome: "Marcos Almeida", cpf: "91000000014", parentesco: "Filho", dataNascimento: "2015-01-20", escolaridade: "Ensino fundamental" },
    ],
    diagnostico: diagnosticoBase({ possuiInternet: false, aguaConsumoTratada: true, esgotoTratado: false, qtdColmeias: 12, areaExtrativismo: decimal("3.40") }),
    indicadores: indicadoresBase({ cadastradoCadUnico: true, participaAssociacao: false, possuiPraticasSustentaveis: false, motivoSemPraticaFaltaInformacao: true, valorBrutoProducaoUltimos12Meses: decimal("7600.00") }),
    atendimentos: [visita(1, "2026-06-01", "campo2", "PENDENTE", false, "Interesse em iniciar meliponicultura com apoio técnico.", "Família participa pouco das instâncias comunitárias.", "Necessita orientação sobre descarte e manejo de embalagens.")],
  },
  {
    nomeFamilia: "Sebastião Rodrigues",
    nomeResponsavel: "Sebastião Rodrigues",
    documentoResponsavel: "91000000015",
    telefone: "92991000015",
    quantidadeMembros: 5,
    municipio: "Tefé",
    comunidade: "Nova Esperança do Curumita",
    enderecoUfpa: "Rio Curumita de Baixo, area de terra firme",
    ufpa: "UFPA-FLONA-006",
    orgKey: "curumita",
    grupoInteresse: "Quintais agroecológicos",
    dapCaf: "CAF-AM-TEF-2026-006",
    codigoSGA: "SGA-FLONA-2026-006",
    statusGestor: "ENVIADO_SGA",
    programaFomento: "Quintais Produtivos",
    areaEstabelecimento: "9.30",
    areaImovelPrincipal: "8.10",
    latitude: "-3.6120000",
    longitude: "-64.9224000",
    integrantes: [
      { nome: "Sebastião Rodrigues", cpf: "91000000015", nisCadUnico: "17000000015", parentesco: "Responsável", dataNascimento: "1969-07-07", escolaridade: "Ensino fundamental", telefones: "92991000015", responsavelUfpa: true },
      { nome: "Lúcia Rodrigues", cpf: "91000000016", parentesco: "Cônjuge", dataNascimento: "1973-02-03", escolaridade: "Ensino fundamental" },
      { nome: "Daniel Rodrigues", cpf: "91000000017", parentesco: "Filho", dataNascimento: "2007-12-11", escolaridade: "Ensino médio" },
    ],
    diagnostico: diagnosticoBase({ possuiInternet: true, aguaConsumoTratada: false, esgotoTratado: false, qtdAves: 30, qtdSuinos: 3, areaCulturasTemporarias: decimal("1.20") }),
    indicadores: indicadoresBase({ alimentacaoVariadaComprometida: true, cadastradoCadUnico: true, acessaPoliticasProdutivas: false, valorBrutoProducaoUltimos12Meses: decimal("11200.00") }),
    atendimentos: [visita(1, "2026-06-02", "campo3", "EM_ANALISE", true, "Horta e criação de aves com boa aderência ao fomento.", "Alerta de alimentação variada no período de cheia.", "Água não tratada apesar de haver fonte disponível.")],
  },
  {
    nomeFamilia: "Pedro Henrique Martins",
    nomeResponsavel: "Pedro Henrique Martins",
    documentoResponsavel: "91000000018",
    telefone: "92991000018",
    quantidadeMembros: 2,
    municipio: "Tefé",
    comunidade: "São José do Lago Tefé",
    enderecoUfpa: "Lago Tefé, proximidade de área de pesca comunitária",
    ufpa: "UFPA-FLONA-007",
    orgKey: "lago-tefe",
    grupoInteresse: "Pesca artesanal",
    dapCaf: null,
    codigoSGA: "SGA-FLONA-2026-007",
    statusGestor: "ENVIADO_SGA",
    programaFomento: null,
    areaEstabelecimento: "5.00",
    areaImovelPrincipal: "4.30",
    latitude: "-3.4302000",
    longitude: "-64.7423000",
    integrantes: [
      { nome: "Pedro Henrique Martins", cpf: "91000000018", nisCadUnico: null, parentesco: "Responsável", dataNascimento: "1995-09-21", escolaridade: "Ensino médio", telefones: "92991000018", responsavelUfpa: true },
      { nome: "Renata Martins", cpf: "91000000019", parentesco: "Cônjuge", dataNascimento: "1997-04-08", escolaridade: "Ensino médio" },
    ],
    diagnostico: diagnosticoBase({ possuiInternet: true, aguaConsumoTratada: true, esgotoTratado: false, qtdAves: 8, areaExtrativismo: decimal("1.40") }),
    indicadores: indicadoresBase({ cadastradoCadUnico: false, acessaPoliticasSociais: false, acessaPoliticasProdutivas: true, canalVendaDiretaConsumidor: true, valorBrutoProducaoUltimos12Meses: decimal("6900.00") }),
    atendimentos: [visita(1, "2026-06-03", "campo1", "PENDENTE", true, "Pesca artesanal com venda direta eventual.", "Casal jovem sem CadÚnico cadastrado.", "Precisa melhorar registro de saneamento e resíduos.")],
  },
  {
    nomeFamilia: "Ana Cláudia Batista",
    nomeResponsavel: "Ana Cláudia Batista",
    documentoResponsavel: "91000000020",
    telefone: "92991000020",
    quantidadeMembros: 4,
    municipio: "Tefé",
    comunidade: "Igarape Preto",
    enderecoUfpa: "Igarape Preto, area de acesso por rabeta",
    ufpa: "UFPA-FLONA-008",
    orgKey: "apafe",
    grupoInteresse: "Beneficiamento artesanal",
    dapCaf: "CAF-AM-TEF-2026-008",
    codigoSGA: "SGA-FLONA-2026-008",
    statusGestor: "REPROVADO_GESTOR",
    motivoReprovacaoGestor: "Necessário complementar dados de diagnóstico e fotos do atendimento.",
    programaFomento: "Beneficiamento artesanal",
    areaEstabelecimento: "7.80",
    areaImovelPrincipal: "6.20",
    latitude: "-3.5018000",
    longitude: "-64.7709000",
    integrantes: [
      { nome: "Ana Cláudia Batista", cpf: "91000000020", nisCadUnico: "17000000020", parentesco: "Responsável", dataNascimento: "1989-11-30", escolaridade: "Ensino médio", telefones: "92991000020", responsavelUfpa: true },
      { nome: "Márcia Batista", cpf: "91000000021", parentesco: "Irmã", dataNascimento: "1993-06-06", escolaridade: "Ensino médio" },
    ],
    diagnostico: diagnosticoBase({ possuiInternet: false, aguaConsumoTratada: false, esgotoTratado: false, qtdAves: 10, areaCulturasPermanentes: decimal("1.10") }),
    indicadores: indicadoresBase({ alimentacaoVariadaComprometida: true, comidaAcabouSemCondicao: false, cadastradoCadUnico: true, possuiPraticasSustentaveis: false, valorBrutoProducaoUltimos12Meses: decimal("10400.00") }),
    atendimentos: [visita(1, "2026-06-04", "campo2", "REPROVADO_GESTOR", false, "Interesse em beneficiamento de farinha e polpas.", "Há alerta social leve e necessidade de validação documental.", "Água sem tratamento e saneamento pendente.")],
  },
  {
    nomeFamilia: "Francisco Chagas Mendes",
    nomeResponsavel: "Francisco Chagas Mendes",
    documentoResponsavel: "91000000022",
    telefone: "92991000022",
    quantidadeMembros: 7,
    municipio: "Alvarães",
    comunidade: "Nossa Senhora de Fátima do Bauana",
    enderecoUfpa: "Rio Bauana, comunidade Nossa Senhora de Fátima",
    ufpa: "UFPA-FLONA-009",
    orgKey: "bauana",
    grupoInteresse: "Extrativismo da castanha",
    dapCaf: "CAF-AM-TEF-2026-009",
    codigoSGA: "SGA-FLONA-2026-009",
    statusGestor: "APROVADO_GESTOR",
    programaFomento: "PGPM-Bio",
    areaEstabelecimento: "14.20",
    areaImovelPrincipal: "11.00",
    latitude: "-3.5445000",
    longitude: "-64.8891000",
    integrantes: [
      { nome: "Francisco Chagas Mendes", cpf: "91000000022", nisCadUnico: "17000000022", parentesco: "Responsável", dataNascimento: "1968-05-03", escolaridade: "Ensino fundamental", telefones: "92991000022", responsavelUfpa: true },
      { nome: "Tereza Mendes", cpf: "91000000023", parentesco: "Cônjuge", dataNascimento: "1970-08-16", escolaridade: "Ensino fundamental" },
      { nome: "Mateus Mendes", cpf: "91000000024", parentesco: "Filho", dataNascimento: "2001-02-01", escolaridade: "Ensino médio" },
    ],
    diagnostico: diagnosticoBase({ possuiInternet: false, aguaConsumoTratada: true, esgotoTratado: false, qtdAves: 25, areaExtrativismo: decimal("7.90"), areaReservaLegal: decimal("10.00") }),
    indicadores: indicadoresBase({ acessaPoliticasProdutivas: true, acessouPgpmBio: true, canalCooperativaEntreposto: true, valorBrutoProducaoUltimos12Meses: decimal("18100.00") }),
    atendimentos: [visita(1, "2026-06-05", "campo3", "CONCLUIDO", true, "Castanha com potencial de acesso a PGPM-Bio.", "Família com CadÚnico e organização comunitária ativa.", "Boa prática produtiva; saneamento ainda incompleto.")],
  },
  {
    nomeFamilia: "Helena Cristina Nascimento",
    nomeResponsavel: "Helena Cristina Nascimento",
    documentoResponsavel: "91000000025",
    telefone: "92991000025",
    quantidadeMembros: 3,
    municipio: "Tefé",
    comunidade: "Bela Vista do Rio Tefé",
    enderecoUfpa: "Margem do rio Tefé, área de terra firme",
    ufpa: "UFPA-FLONA-010",
    orgKey: "lago-tefe",
    grupoInteresse: "Quintais agroecológicos",
    dapCaf: null,
    codigoSGA: null,
    statusGestor: null,
    programaFomento: "Quintais Produtivos",
    areaEstabelecimento: "4.90",
    areaImovelPrincipal: "4.10",
    latitude: "-3.3689000",
    longitude: "-64.8103000",
    integrantes: [
      { nome: "Helena Cristina Nascimento", cpf: "91000000025", nisCadUnico: "17000000025", parentesco: "Responsável", dataNascimento: "1991-12-18", escolaridade: "Ensino médio", telefones: "92991000025", responsavelUfpa: true },
      { nome: "Isabela Nascimento", cpf: "91000000026", parentesco: "Filha", dataNascimento: "2014-09-04", escolaridade: "Ensino fundamental" },
    ],
    diagnostico: diagnosticoBase({ possuiInternet: true, aguaConsumoTratada: true, esgotoTratado: true, qtdAves: 16, areaCulturasTemporarias: decimal("0.90") }),
    indicadores: indicadoresBase({ acessaPoliticasProdutivas: false, possuiPraticasSustentaveis: true, valorBrutoProducaoUltimos12Meses: decimal("6200.00") }),
    atendimentos: [visita(1, "2026-06-05", "campo1", "PENDENTE", false, "Quintal produtivo com hortas e criação pequena.", "Família com documentação organizada.", "Conservação adequada no entorno da UFPA.")],
  },
  {
    nomeFamilia: "Edson Moraes Silva",
    nomeResponsavel: "Edson Moraes Silva",
    documentoResponsavel: "91000000027",
    telefone: "92991000027",
    quantidadeMembros: 5,
    municipio: "Tefé",
    comunidade: "Porto Praia",
    enderecoUfpa: "Porto Praia, acesso pelo Lago Tefé",
    ufpa: "UFPA-FLONA-011",
    orgKey: "apafe",
    grupoInteresse: "Turismo de base comunitaria",
    dapCaf: "CAF-AM-TEF-2026-011",
    codigoSGA: null,
    statusGestor: null,
    programaFomento: null,
    areaEstabelecimento: "11.60",
    areaImovelPrincipal: "9.00",
    latitude: "-3.4125000",
    longitude: "-64.8202000",
    integrantes: [
      { nome: "Edson Moraes Silva", cpf: "91000000027", nisCadUnico: null, parentesco: "Responsável", dataNascimento: "1980-10-02", escolaridade: "Ensino fundamental", telefones: "92991000027", responsavelUfpa: true },
      { nome: "Patrícia Silva", cpf: "91000000028", parentesco: "Cônjuge", dataNascimento: "1986-07-14", escolaridade: "Ensino médio" },
    ],
    diagnostico: undefined,
    indicadores: undefined,
    atendimentos: [],
  },
  {
    nomeFamilia: "Marilene Ferreira",
    nomeResponsavel: "Marilene Ferreira",
    documentoResponsavel: "91000000029",
    telefone: "92991000029",
    quantidadeMembros: 4,
    municipio: "Tefé",
    comunidade: "São Raimundo do Rio Tefé",
    enderecoUfpa: "Rio Tefé, localidade São Raimundo",
    ufpa: "UFPA-FLONA-012",
    orgKey: "apafe",
    grupoInteresse: "Manejo florestal comunitário",
    dapCaf: null,
    codigoSGA: null,
    statusGestor: null,
    programaFomento: "Manejo Florestal Comunitario",
    areaEstabelecimento: "13.40",
    areaImovelPrincipal: "10.80",
    latitude: "-3.3365000",
    longitude: "-64.9401000",
    integrantes: [
      { nome: "Marilene Ferreira", cpf: "91000000029", nisCadUnico: "17000000029", parentesco: "Responsável", dataNascimento: "1985-01-09", escolaridade: "Ensino fundamental", telefones: "92991000029", responsavelUfpa: true },
      { nome: "Carlos Ferreira", cpf: "91000000030", parentesco: "Cônjuge", dataNascimento: "1983-06-22", escolaridade: "Ensino fundamental" },
    ],
    diagnostico: undefined,
    indicadores: undefined,
    atendimentos: [],
  },
];

async function clearSiggaterData() {
  const demoFamiliaDocumentos = familias.map((familia) => familia.documentoResponsavel);
  const existingFamilias = await prisma.familiaAter.findMany({
    where: {
      OR: [
        { cadastro: { origemCadastro: DEMO_ORIGIN } },
        { cadastro: { documento: { in: demoFamiliaDocumentos } } },
        { documentoResponsavel: { in: demoFamiliaDocumentos } },
      ],
    },
    select: { id: true, cadastroId: true },
  });
  const familiaIds = existingFamilias.map((familia) => familia.id);
  const cadastroIds = existingFamilias.map((familia) => familia.cadastroId);
  const demoOrgNames = organizacoes.map((organizacao) => organizacao.denominacao);

  const deleted = {
    atendimentos: 0,
    indicadoresUfpa: 0,
    diagnosticosUfpa: 0,
    integrantes: 0,
    familias: 0,
    cadastros: 0,
    indicadoresOrganizacao: 0,
    organizacoes: 0,
    tecnicos: 0,
  };

  if (familiaIds.length > 0) {
    deleted.atendimentos = (await prisma.atendimento.deleteMany({ where: { familiaId: { in: familiaIds } } })).count;
    deleted.indicadoresUfpa = (await prisma.indicadoresUfpa.deleteMany({ where: { familiaId: { in: familiaIds } } })).count;
    deleted.diagnosticosUfpa = (await prisma.diagnosticoUfpa.deleteMany({ where: { familiaId: { in: familiaIds } } })).count;
    deleted.integrantes = (await prisma.integranteUfpa.deleteMany({ where: { familiaId: { in: familiaIds } } })).count;
    deleted.familias = (await prisma.familiaAter.deleteMany({ where: { id: { in: familiaIds } } })).count;
    deleted.cadastros = (
      await prisma.cadastroUnico.deleteMany({
        where: {
          OR: [
            { id: { in: cadastroIds } },
            { documento: { in: demoFamiliaDocumentos } },
          ],
        },
      })
    ).count;
  } else {
    deleted.cadastros = (
      await prisma.cadastroUnico.deleteMany({ where: { documento: { in: demoFamiliaDocumentos } } })
    ).count;
  }

  const demoOrgs = await prisma.organizacaoColetiva.findMany({
    where: {
      OR: [
        { observacoes: { contains: DEMO_ORIGIN } },
        { denominacao: { in: demoOrgNames } },
      ],
      familias: { none: {} },
    },
    select: { id: true },
  });
  const demoOrgIds = demoOrgs.map((organizacao) => organizacao.id);

  if (demoOrgIds.length > 0) {
    deleted.indicadoresOrganizacao = (
      await prisma.indicadoresOrganizacaoColetiva.deleteMany({ where: { organizacaoColetivaId: { in: demoOrgIds } } })
    ).count;
    deleted.organizacoes = (await prisma.organizacaoColetiva.deleteMany({ where: { id: { in: demoOrgIds } } })).count;
  }

  deleted.tecnicos = (
    await prisma.tecnico.deleteMany({ where: { cpf: { startsWith: "900000000" }, atendimentos: { none: {} } } })
  ).count;

  return deleted;
}

async function seedSiggaterData() {
  const tecnicoMap = new Map<string, string>();

  for (const tecnico of tecnicos) {
    const saved = await prisma.tecnico.upsert({
      where: { cpf: tecnico.cpf },
      update: { nome: tecnico.nome, uf: "AM", ativo: true },
      create: { nome: tecnico.nome, cpf: tecnico.cpf, uf: "AM", ativo: true },
    });
    tecnicoMap.set(tecnico.key, saved.id);
  }

  const orgMap = new Map<string, string>();

  for (const org of organizacoes) {
    const saved = await prisma.organizacaoColetiva.create({
      data: {
        denominacao: org.denominacao,
        uf: "AM",
        municipio: org.municipio,
        dataCadastro: date("2026-05-26"),
        entidadeExecutoraNome: "Instituto Acariquara",
        unidadeServicos: "ATER Sociobiodiversidade",
        numeroInstrumento: "ATER-SOCIOBIO-2026",
        agenteAterNome1: "Ana Paula Nogueira",
        agenteAterCpf1: "90000000001",
        numeroFamilias: org.numeroFamilias,
        grupoInteresse: org.grupoInteresse,
        atividades: [
          { descricao: org.atividades, unidade: "organização" },
          { descricao: "Extrativismo de produtos da sociobiodiversidade", unidade: "atividade" },
          { descricao: "Comercialização coletiva em território da FLONA de Tefé", unidade: "serviço" },
        ],
        observacoes: `${DEMO_ORIGIN}: organização fictícia realista para demonstração do fluxo SIGGATER.`,
      },
    });

    if (org.key !== "lago-tefe") {
      await prisma.indicadoresOrganizacaoColetiva.create({
        data: {
          organizacaoColetivaId: saved.id,
          dataReferencia: date("2026-05-27"),
          possuiPraticasAmbientais: org.key !== "curumita",
          praticaSeparacaoLixo: org.key === "apafe",
          praticaDescarteCorretoLixo: org.key === "apafe",
          praticaCaptacaoAguaChuva: org.key !== "curumita",
          praticaEducacaoAmbiental: org.key !== "curumita",
          usaIdentidadeComercial: org.key === "apafe",
          identidadeMarcaPropria: org.key === "apafe",
          possuiMulheresDiretoriaConselho: org.key !== "curumita",
          possuiJovensDiretoriaConselho: org.key === "apafe",
          filiadaOrganizacao: org.key !== "bauana",
          acessaPoliticasPublicas: org.key === "apafe" || org.key === "curumita",
          possuiCafJuridica: org.key === "apafe",
          acessouPaa: org.key === "apafe",
          acessouPnae: false,
          acessouPgpmSociobiodiversidade: org.key === "curumita" || org.key === "bauana",
          canalVendaOrganizacao: true,
          canalVendaDiretaConsumidor: true,
          canalMercadoLocal: true,
          canalAtravessador: org.key !== "apafe",
          observacoes: `${DEMO_ORIGIN}: indicadores coletivos fictícios realistas para teste de métricas.`,
        },
      });
    }

    orgMap.set(org.key, saved.id);
  }

  let atendimentosCriados = 0;

  for (const familia of familias) {
    const cadastro = await prisma.cadastroUnico.create({
      data: {
        tipo: TipoCadastro.PF,
        documento: familia.documentoResponsavel,
        nome: familia.nomeFamilia,
        telefone: familia.telefone,
        origemCadastro: DEMO_ORIGIN,
        familia: {
          create: {
            nomeFamilia: familia.nomeFamilia,
            nomeResponsavel: familia.nomeResponsavel,
            documentoResponsavel: familia.documentoResponsavel,
            telefone: familia.telefone,
            quantidadeMembros: familia.quantidadeMembros,
            municipio: familia.municipio,
            comunidade: familia.comunidade,
            enderecoUfpa: familia.enderecoUfpa,
            ufpa: familia.ufpa,
            dapCaf: familia.dapCaf ?? null,
            dapCafOrgaoEmissor: familia.dapCaf ? "IDAM/AM" : null,
            dapCafValidade: familia.dapCaf ? date("2028-12-31") : null,
            areaEstabelecimento: decimal(familia.areaEstabelecimento),
            areaImovelPrincipal: decimal(familia.areaImovelPrincipal),
            classificacaoUfpa: "Agricultura familiar ribeirinha",
            bioma: "Amazonia",
            latitude: decimal(familia.latitude),
            longitude: decimal(familia.longitude),
            grupoInteresse: familia.grupoInteresse,
            programaFomento: familia.programaFomento ?? null,
            envioSGAPorAtividade: [
              {
                atividade: familia.grupoInteresse,
                producaoAnual: familia.indicadores?.valorBrutoProducaoUltimos12Meses?.toString() ?? "",
                unidade: "R$/ano",
                atividadePrincipal: true,
              },
            ],
            codigoSGA: familia.codigoSGA ?? null,
            sgaCadastro: Boolean(familia.codigoSGA),
            sgaRevisao: familia.statusGestor === "APROVADO_GESTOR",
            sgaIndicador: Boolean(familia.codigoSGA && familia.diagnostico),
            sgaFotos: Boolean(familia.codigoSGA && familia.atendimentos.length),
            statusGestor: familia.statusGestor ?? null,
            motivoReprovacaoGestor: familia.motivoReprovacaoGestor ?? null,
            dataStatusGestor: familia.statusGestor ? date("2026-06-05") : null,
            organizacaoColetivaId: orgMap.get(familia.orgKey),
            integrantes: {
              create: familia.integrantes.map((integrante) => ({
                nome: integrante.nome,
                cpf: integrante.cpf,
                nisCadUnico: integrante.nisCadUnico ?? null,
                sexo: inferSexo(integrante.nome),
                parentesco: integrante.parentesco,
                dataNascimento: date(integrante.dataNascimento),
                escolaridade: integrante.escolaridade,
                telefones: integrante.telefones ?? null,
                responsavelUfpa: Boolean(integrante.responsavelUfpa),
              })),
            },
          },
        },
      },
      include: { familia: true },
    });

    const familiaId = cadastro.familia?.id;
    if (!familiaId) {
      throw new Error(`UFPA não criada para ${familia.nomeFamilia}`);
    }

    if (familia.diagnostico) {
      await prisma.diagnosticoUfpa.create({
        data: {
          ...familia.diagnostico,
          familiaId,
        },
      });
    }

    if (familia.indicadores) {
      await prisma.indicadoresUfpa.create({
        data: {
          ...familia.indicadores,
          familiaId,
        },
      });
    }

    for (const atendimento of familia.atendimentos) {
      const tecnicoId = tecnicoMap.get(atendimento.tecnicoKey);
      const tecnico = tecnicos.find((item) => item.key === atendimento.tecnicoKey);

      await prisma.atendimento.create({
        data: {
          familiaId,
          numeroVisita: atendimento.numeroVisita,
          data: date(atendimento.data),
          tecnicoId,
          tecnico: tecnico?.nome ?? "Ana Paula Nogueira",
          projetoTitulo: PROJECT_TITLE,
          statusRelatorio: atendimento.statusRelatorio,
          houveAtendimento: true,
          enviadoSGA: atendimento.enviadoSGA,
          dataEnvioSGA: atendimento.enviadoSGA ? date("2026-06-06") : null,
          statusGestor: atendimento.statusGestor ?? null,
          atividadeNumeroTotal: atendimento.atividadeNumeroTotal,
          codigoMeta: atendimento.codigoMeta,
          descricaoMeta: atendimento.descricaoMeta,
          numeroMulheres: atendimento.numeroMulheres,
          numeroJovens: atendimento.numeroJovens,
          eixoProdutivo: atendimento.eixoProdutivo,
          eixoSocial: atendimento.eixoSocial,
          eixoAmbiental: atendimento.eixoAmbiental,
        },
      });
      atendimentosCriados += 1;
    }
  }

  return {
    tecnicos: tecnicos.length,
    organizacoes: organizacoes.length,
    familias: familias.length,
    atendimentos: atendimentosCriados,
  };
}

async function main() {
  if (!process.argv.includes("--yes")) {
    throw new Error("Este script apaga os cadastros SIGGATER. Execute com --yes para confirmar.");
  }

  console.log("Limpando cadastros SIGGATER existentes...");
  const deleted = await clearSiggaterData();
  console.log("Registros removidos:", deleted);

  console.log("Gerando cadastros fictícios realistas da FLONA de Tefé...");
  const created = await seedSiggaterData();
  console.log("Registros criados:", created);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
