import { prisma } from "@/lib/prisma";
import { Prisma, TipoCadastro, type Tecnico } from "@prisma/client";
import { randomUUID } from "crypto";
import { ATER_SOCIOBIO_STATUS_RASCUNHO } from "@/lib/constants/ater-sociobio";

export type FamiliaWithCadastro = Prisma.FamiliaAterGetPayload<{
  include: {
    cadastro: true;
    organizacaoColetiva: true;
    integrantes: {
      orderBy: [{ responsavelUfpa: "desc" }, { nome: "asc" }];
    };
    diagnostico: true;
    indicadores: true;
  };
}>;

export type FamiliaListItem = FamiliaWithCadastro & { _count: { atendimentos: number; integrantes: number } };

export type OrganizacaoColetivaListItem = Prisma.OrganizacaoColetivaGetPayload<{
  include: {
    _count: { select: { familias: true } };
  };
}>;

export type OrganizacaoColetivaWithFamilias = Prisma.OrganizacaoColetivaGetPayload<{
  include: {
    familias: {
      include: {
        diagnostico: true;
        indicadores: true;
        _count: { select: { atendimentos: true; integrantes: true } };
      };
      orderBy: [{ municipio: "asc" }, { nomeFamilia: "asc" }];
    };
    indicadores: true;
    _count: { select: { familias: true } };
  };
}>;

export type SiggaterDashboardItem = {
  id: string;
  nomeFamilia: string;
  municipio: string | null;
  comunidade: string | null;
  organizacaoColetiva: string | null;
  grupoInteresse: string | null;
  programaFomento: string | null;
  statusGestor: string | null;
  temDapCaf: boolean;
  temSga: boolean;
  integrantes: number;
  atendimentos: number;
  diagnosticoRegistrado: boolean;
  bioma: string | null;
  atividades: string[];
  mulheres: number;
  jovens: number;
  aguaParaConsumo: boolean | null;
  possuiInternet: boolean | null;
  aguaTratada: boolean | null;
  esgotoTratado: boolean | null;
  cadUnico: boolean | null;
  insegurancaAlimentar: boolean | null;
  politicasSociais: boolean | null;
  grupoComunitario: boolean | null;
  politicasProdutivas: boolean | null;
  praticasSustentaveis: boolean | null;
};

export type SiggaterOrganizacaoDashboardItem = {
  id: string;
  denominacao: string;
  municipio: string | null;
  numeroFamiliasPrevistas: number | null;
  familiasVinculadas: number;
  indicadoresRegistrados: boolean;
  praticasAmbientais: boolean | null;
  identidadeComercial: boolean | null;
  mulheresDiretoria: boolean | null;
  jovensDiretoria: boolean | null;
  representacaoPolitica: boolean | null;
  politicasPublicas: boolean | null;
  canaisComercializacao: number;
};

export type SiggaterAtendimentoDashboardItem = {
  id: string;
  numeroVisita: number;
  data: string | null;
  statusRelatorio: string;
  ufpa: string | null;
  organizacaoColetiva: string | null;
  tecnico: string | null;
  numeroMulheres: number;
  numeroJovens: number;
  eixosTrabalhados: string[];
  indicadoresTrabalhados: string[];
};

export type SiggaterDashboardData = {
  familias: SiggaterDashboardItem[];
  organizacoes: SiggaterOrganizacaoDashboardItem[];
  atendimentos: SiggaterAtendimentoDashboardItem[];
};

export type AtendimentoWithDetails = Prisma.AtendimentoGetPayload<{
  include: {
    familia: {
      include: {
        cadastro: true;
        organizacaoColetiva: true;
        integrantes: {
          orderBy: [{ responsavelUfpa: "desc" }, { nome: "asc" }];
        };
        diagnostico: true;
        indicadores: true;
      };
    };
    beneficiaria: {
      include: { cadastro: true };
    };
    tecnicoRef: true;
  };
}>;

export interface FamiliaFilterDTO {
  municipio?: string;
  comunidade?: string;
  busca?: string;
  sgaIncompleto?: boolean;
  indicador?: string;
}

export type FamiliaAterInput = {
  nomeFamilia: string;
  documentoResponsavel?: string | null;
  nomeResponsavel?: string | null;
  telefone?: string | null;
  quantidadeMembros?: number | null;
  municipio?: string | null;
  comunidade?: string | null;
  enderecoUfpa?: string | null;
  complementoUfpa?: string | null;
  cepUfpa?: string | null;
  ufpa?: string | null;
  dapCaf?: string | null;
  dapCafOrgaoEmissor?: string | null;
  dapCafValidade?: Date | null;
  areaEstabelecimento?: number | null;
  areaImovelPrincipal?: number | null;
  classificacaoUfpa?: string | null;
  bioma?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  grupoInteresse?: string | null;
  statusCadastro?: string | null;
  situacaoProjeto?: string | null;
  tipoAtendimento?: string | null;
  atividadeProdutiva?: string | null;
  programaFomento?: string | null;
  nis?: string | null;
  codigoSGA?: string | null;
  situacaoFomento?: string | null;
  valorProjetoATER?: number | null;
  valorInvestidoUFPA?: number | null;
  valorFomento?: number | null;
  efetividade?: string | null;
  statusSGA?: string | null;
  envioSGAPorAtividade?: Prisma.InputJsonValue;
  sgaCadastro?: boolean;
  sgaRevisao?: boolean;
  sgaIndicador?: boolean;
  sgaFotos?: boolean;
  statusGestor?: string | null;
  motivoReprovacaoGestor?: string | null;
  organizacaoColetivaId?: string | null;
  integrantes?: IntegranteUfpaInput[];
};

export type OrganizacaoColetivaInput = {
  denominacao: string;
  cnpj?: string | null;
  uf?: string | null;
  municipio?: string | null;
  dataCadastro?: Date | null;
  entidadeExecutoraNome?: string | null;
  entidadeExecutoraCnpj?: string | null;
  unidadeServicos?: string | null;
  numeroInstrumento?: string | null;
  agenteAterNome?: string | null;
  agenteAterCpf?: string | null;
  numeroFamilias?: number | null;
  atividades?: Prisma.InputJsonValue;
  grupoInteresse?: string | null;
  observacoes?: string | null;
};

export type IntegranteUfpaInput = {
  cpf?: string | null;
  nisCadUnico?: string | null;
  nome: string;
  apelido?: string | null;
  sexo?: string | null;
  orientacaoSexual?: string | null;
  identidadeGenero?: string | null;
  dataNascimento?: Date | null;
  escolaridade?: string | null;
  nomeMae?: string | null;
  nomePai?: string | null;
  classificacao?: string | null;
  email?: string | null;
  telefones?: string | null;
  responsavelUfpa?: boolean;
  parentesco?: string | null;
};

export type TecnicoAtivo = Tecnico;

function asObject(value: Prisma.JsonValue | null | undefined): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function readStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
}

function getEixoIndicadores(value: Prisma.JsonValue | null | undefined) {
  return readStringArray(asObject(value)?.indicadoresTrabalhados);
}

function hasEixoData(value: Prisma.JsonValue | null | undefined) {
  const eixo = asObject(value);
  if (!eixo) return false;
  return Object.values(eixo).some((entry) => {
    if (Array.isArray(entry)) return entry.length > 0;
    return typeof entry === "string" ? entry.trim().length > 0 : Boolean(entry);
  });
}

function readAtividadesList(value: Prisma.JsonValue | null | undefined): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const record = item as Record<string, unknown>;
      return typeof record.atividade === "string" ? record.atividade.trim() : null;
    })
    .filter((item): item is string => Boolean(item));
}

export class AterSociobioService {
  // --- FAMILIAS ---

  static async listFamilias(params: {
    filtros?: FamiliaFilterDTO;
    skip?: number;
    take?: number;
  }): Promise<{
    familias: FamiliaListItem[];
    total: number;
    metrics: {
      totalMunicipios: number;
      comNis: number;
      comSGA: number;
      comDapCaf: number;
      semInternet: number;
      semAguaTratada: number;
      semEsgotoTratado: number;
      insegurancaAlimentar: number;
      semCadUnico: number;
      municipios: string[];
      porMunicipio: { name: string; value: number }[];
      diagnosticoStatus: { name: string; value: number }[];
      aguaTratadaStatus: { name: string; value: number }[];
      cadUnicoStatus: { name: string; value: number }[];
      insegurancaAlimentarStatus: { name: string; value: number }[];
    };
  }> {
    const { filtros, skip, take } = params;
    const where: Prisma.FamiliaAterWhereInput = {};
    const and: Prisma.FamiliaAterWhereInput[] = [];

    if (filtros?.municipio) {
      and.push({ municipio: { equals: filtros.municipio, mode: "insensitive" } });
    }
    if (filtros?.comunidade) {
      and.push({ comunidade: { equals: filtros.comunidade, mode: "insensitive" } });
    }
    if (filtros?.busca) {
      const b = filtros.busca;
      and.push({
        OR: [
          { nomeFamilia: { contains: b, mode: "insensitive" } },
          { nomeResponsavel: { contains: b, mode: "insensitive" } },
          { organizacaoColetiva: { is: { denominacao: { contains: b, mode: "insensitive" } } } },
          { dapCaf: { contains: b, mode: "insensitive" } },
          { nis: { contains: b, mode: "insensitive" } },
          { codigoSGA: { contains: b, mode: "insensitive" } },
          { municipio: { contains: b, mode: "insensitive" } },
          { comunidade: { contains: b, mode: "insensitive" } },
          { integrantes: { some: { nome: { contains: b, mode: "insensitive" } } } },
        ],
      });
    }
    if (filtros?.sgaIncompleto) {
      and.push({
        OR: [{ sgaCadastro: false }, { sgaCadastro: null }, { sgaRevisao: false }, { sgaRevisao: null }],
      });
    }
    if (filtros?.indicador) {
      const indicatorWhere = this.getFamiliaIndicatorWhere(filtros.indicador);
      if (indicatorWhere) {
        and.push(indicatorWhere);
      }
    }

    if (and.length > 0) {
      where.AND = and;
    }

    const [familias, total, municipiosResult] = await Promise.all([
      prisma.familiaAter.findMany({
        where,
        include: {
          cadastro: true,
          organizacaoColetiva: true,
          integrantes: { orderBy: [{ responsavelUfpa: "desc" }, { nome: "asc" }] },
          diagnostico: true,
          indicadores: true,
          _count: {
            select: {
              atendimentos: { where: { statusRelatorio: { not: ATER_SOCIOBIO_STATUS_RASCUNHO } } },
              integrantes: true,
            },
          },
        },
        orderBy: [{ municipio: "asc" }, { nomeFamilia: "asc" }],
        skip,
        take,
      }),
      prisma.familiaAter.count({ where }),
      prisma.familiaAter.findMany({
        where: { municipio: { not: null } },
        select: { municipio: true },
        distinct: ["municipio"],
        orderBy: { municipio: "asc" },
      }),
    ]);

    const [comNis, comSGA, comDapCaf, semInternet, semAguaTratada] = await Promise.all([
      prisma.familiaAter.count({
        where: { ...where, nis: { not: null } },
      }),
      prisma.familiaAter.count({
        where: { ...where, codigoSGA: { not: null } },
      }),
      prisma.familiaAter.count({
        where: { ...where, dapCaf: { not: null } },
      }),
      prisma.familiaAter.count({
        where: { ...where, diagnostico: { is: { possuiInternet: false } } },
      }),
      prisma.familiaAter.count({
        where: { ...where, diagnostico: { is: { aguaConsumoTratada: false } } },
      }),
    ]);

    const [semEsgotoTratado, insegurancaAlimentar, semCadUnico, diagnosticoRegistrado, aguaTratada] =
      await Promise.all([
      prisma.familiaAter.count({
        where: { ...where, diagnostico: { is: { esgotoTratado: false } } },
      }),
      prisma.familiaAter.count({
        where: {
          ...where,
          indicadores: {
            is: {
              OR: [
                { alimentacaoVariadaComprometida: true },
                { comidaAcabouSemCondicao: true },
                { deixouRefeicaoSemCondicao: true },
                { comeuMenosSemCondicao: true },
                { sentiuFomeENaoComeu: true },
              ],
            },
          },
        },
      }),
      prisma.familiaAter.count({
        where: { ...where, indicadores: { is: { cadastradoCadUnico: false } } },
      }),
      prisma.familiaAter.count({
        where: { ...where, OR: [{ diagnostico: { isNot: null } }, { indicadores: { isNot: null } }] },
      }),
      prisma.familiaAter.count({
        where: { ...where, diagnostico: { is: { aguaConsumoTratada: true } } },
      }),
    ]);

    const [
      cadUnico,
      semDiagnostico,
      semInformacaoAguaTratada,
      semInformacaoCadUnico,
      semInformacaoInsegurancaAlimentar,
    ] = await Promise.all([
      prisma.familiaAter.count({
        where: { ...where, indicadores: { is: { cadastradoCadUnico: true } } },
      }),
      prisma.familiaAter.count({
        where: { ...where, diagnostico: { is: null }, indicadores: { is: null } },
      }),
      prisma.familiaAter.count({
        where: {
          ...where,
          OR: [{ diagnostico: { is: null } }, { diagnostico: { is: { aguaConsumoTratada: null } } }],
        },
      }),
      prisma.familiaAter.count({
        where: {
          ...where,
          OR: [{ indicadores: { is: null } }, { indicadores: { is: { cadastradoCadUnico: null } } }],
        },
      }),
      prisma.familiaAter.count({
        where: {
          ...where,
          OR: [
            { indicadores: { is: null } },
            {
              indicadores: {
                is: {
                  alimentacaoVariadaComprometida: null,
                  comidaAcabouSemCondicao: null,
                  deixouRefeicaoSemCondicao: null,
                  comeuMenosSemCondicao: null,
                  sentiuFomeENaoComeu: null,
                },
              },
            },
          ],
        },
      }),
    ]);

    const municipiosDistribuicao = await prisma.familiaAter.groupBy({
      by: ["municipio"],
      where,
      _count: { _all: true },
      orderBy: { _count: { municipio: "desc" } },
    });

    return {
      familias,
      total,
      metrics: {
        totalMunicipios: municipiosResult.length,
        comNis,
        comSGA,
        comDapCaf,
        semInternet,
        semAguaTratada,
          semEsgotoTratado,
          insegurancaAlimentar,
          semCadUnico,
          municipios: municipiosResult.map((m) => m.municipio).filter(Boolean) as string[],
          porMunicipio: municipiosDistribuicao
            .filter((item) => item.municipio)
            .map((item) => ({ name: item.municipio as string, value: item._count._all })),
          diagnosticoStatus: [
            { name: "Registrado", value: diagnosticoRegistrado },
            { name: "Pendente", value: semDiagnostico },
          ],
          aguaTratadaStatus: [
            { name: "Sim", value: aguaTratada },
            { name: "Não", value: semAguaTratada },
            { name: "Sem informação", value: semInformacaoAguaTratada },
          ],
          cadUnicoStatus: [
            { name: "Sim", value: cadUnico },
            { name: "Não", value: semCadUnico },
            { name: "Sem informação", value: semInformacaoCadUnico },
          ],
          insegurancaAlimentarStatus: [
            { name: "Com alerta", value: insegurancaAlimentar },
            {
              name: "Sem alerta registrado",
              value: Math.max(0, total - insegurancaAlimentar - semInformacaoInsegurancaAlimentar),
            },
            { name: "Sem informação", value: semInformacaoInsegurancaAlimentar },
          ],
        },
      };
    }

  private static getFamiliaIndicatorWhere(indicador: string): Prisma.FamiliaAterWhereInput | null {
    switch (indicador) {
      case "com-dap-caf":
        return { dapCaf: { not: null } };
      case "sem-dap-caf":
        return { OR: [{ dapCaf: null }, { dapCaf: "" }] };
      case "com-sga":
        return { codigoSGA: { not: null } };
      case "sem-sga":
        return { OR: [{ codigoSGA: null }, { codigoSGA: "" }] };
      case "sem-internet":
        return { diagnostico: { is: { possuiInternet: false } } };
      case "com-internet":
        return { diagnostico: { is: { possuiInternet: true } } };
      case "sem-agua-tratada":
        return { diagnostico: { is: { aguaConsumoTratada: false } } };
      case "com-agua-tratada":
        return { diagnostico: { is: { aguaConsumoTratada: true } } };
      case "sem-esgoto-tratado":
        return { diagnostico: { is: { esgotoTratado: false } } };
      case "com-esgoto-tratado":
        return { diagnostico: { is: { esgotoTratado: true } } };
      case "inseguranca-alimentar":
        return {
          indicadores: {
            is: {
              OR: [
                { alimentacaoVariadaComprometida: true },
                { comidaAcabouSemCondicao: true },
                { deixouRefeicaoSemCondicao: true },
                { comeuMenosSemCondicao: true },
                { sentiuFomeENaoComeu: true },
              ],
            },
          },
        };
      case "sem-cadunico":
        return { indicadores: { is: { cadastradoCadUnico: false } } };
      case "com-cadunico":
        return { indicadores: { is: { cadastradoCadUnico: true } } };
      case "sem-diagnostico":
        return { diagnostico: { is: null }, indicadores: { is: null } };
      case "com-diagnostico":
        return { OR: [{ diagnostico: { isNot: null } }, { indicadores: { isNot: null } }] };
      default:
        return null;
    }
  }

  static async getDashboardFamilias(): Promise<SiggaterDashboardItem[]> {
    const familias = await prisma.familiaAter.findMany({
      select: {
        id: true,
        nomeFamilia: true,
        municipio: true,
        comunidade: true,
        grupoInteresse: true,
        programaFomento: true,
        statusGestor: true,
        dapCaf: true,
        codigoSGA: true,
        quantidadeMembros: true,
        bioma: true,
        envioSGAPorAtividade: true,
        organizacaoColetiva: {
          select: { denominacao: true },
        },
        integrantes: {
          select: {
            sexo: true,
            dataNascimento: true,
          },
        },
        diagnostico: {
          select: {
            aguaParaConsumo: true,
            possuiInternet: true,
            aguaConsumoTratada: true,
            esgotoTratado: true,
          },
        },
        indicadores: {
          select: {
            alimentacaoVariadaComprometida: true,
            comidaAcabouSemCondicao: true,
            deixouRefeicaoSemCondicao: true,
            comeuMenosSemCondicao: true,
            sentiuFomeENaoComeu: true,
            cadastradoCadUnico: true,
            acessaPoliticasSociais: true,
            participaGrupoComunitario: true,
            acessaPoliticasProdutivas: true,
            possuiPraticasSustentaveis: true,
          },
        },
        _count: {
          select: {
            atendimentos: { where: { statusRelatorio: { not: ATER_SOCIOBIO_STATUS_RASCUNHO } } },
            integrantes: true,
          },
        },
      },
      orderBy: [{ municipio: "asc" }, { nomeFamilia: "asc" }],
    });

    return familias.map((familia) => {
      const indicadores = familia.indicadores;
      const integrantes = familia.integrantes || [];

      // Contagem de Mulheres (Sexo Feminino)
      const mulheres = integrantes.filter(i =>
        String(i.sexo).toLowerCase().startsWith("f") ||
        String(i.sexo).toLowerCase() === "mulher" ||
        String(i.sexo).toLowerCase() === "feminino"
      ).length;

      // Contagem de Jovens (Idade entre 15 e 29 anos, padrão oficial Brasil)
      const hoje = new Date();
      const jovens = integrantes.filter(i => {
        if (!i.dataNascimento) return false;
        const nascimento = new Date(i.dataNascimento);
        let idade = hoje.getFullYear() - nascimento.getFullYear();
        const m = hoje.getMonth() - nascimento.getMonth();
        if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
          idade--;
        }
        return idade >= 15 && idade <= 29;
      }).length;

      const indicadorAlimentar = indicadores
        ? [
            indicadores.alimentacaoVariadaComprometida,
            indicadores.comidaAcabouSemCondicao,
            indicadores.deixouRefeicaoSemCondicao,
            indicadores.comeuMenosSemCondicao,
            indicadores.sentiuFomeENaoComeu,
          ]
        : [];

      return {
        id: familia.id,
        nomeFamilia: familia.nomeFamilia,
        municipio: familia.municipio,
        comunidade: familia.comunidade,
        organizacaoColetiva: familia.organizacaoColetiva?.denominacao ?? null,
        grupoInteresse: familia.grupoInteresse,
        programaFomento: familia.programaFomento,
        statusGestor: familia.statusGestor,
        temDapCaf: Boolean(familia.dapCaf?.trim()),
        temSga: Boolean(familia.codigoSGA?.trim()),
        integrantes: familia._count.integrantes || familia.quantidadeMembros || 0,
        atendimentos: familia._count.atendimentos,
        diagnosticoRegistrado: Boolean(familia.diagnostico || familia.indicadores),
        aguaParaConsumo: familia.diagnostico?.aguaParaConsumo ?? null,
        possuiInternet: familia.diagnostico?.possuiInternet ?? null,
        aguaTratada: familia.diagnostico?.aguaConsumoTratada ?? null,
        esgotoTratado: familia.diagnostico?.esgotoTratado ?? null,
        cadUnico: indicadores?.cadastradoCadUnico ?? null,
        insegurancaAlimentar: indicadores ? indicadorAlimentar.some(Boolean) : null,
        politicasSociais: indicadores?.acessaPoliticasSociais ?? null,
        grupoComunitario: indicadores?.participaGrupoComunitario ?? null,
        politicasProdutivas: indicadores?.acessaPoliticasProdutivas ?? null,
        praticasSustentaveis: indicadores?.possuiPraticasSustentaveis ?? null,
        bioma: familia.bioma,
        atividades: readAtividadesList(familia.envioSGAPorAtividade),
        mulheres,
        jovens,
      };
    });
  }

  static async getDashboardData(): Promise<SiggaterDashboardData> {
    const [familias, organizacoes, atendimentos] = await Promise.all([
      this.getDashboardFamilias(),
      prisma.organizacaoColetiva.findMany({
        include: {
          indicadores: true,
          _count: { select: { familias: true } },
        },
        orderBy: [{ municipio: "asc" }, { denominacao: "asc" }],
      }),
      prisma.atendimento.findMany({
        where: { statusRelatorio: { not: ATER_SOCIOBIO_STATUS_RASCUNHO } },
        include: {
          familia: {
            include: {
              organizacaoColetiva: true,
            },
          },
          tecnicoRef: true,
        },
        orderBy: [{ data: "desc" }, { numeroVisita: "desc" }],
      }),
    ]);

    return {
      familias,
      organizacoes: organizacoes.map((organizacao) => {
        const indicadores = organizacao.indicadores;
        const canaisComercializacao = indicadores
          ? [
              indicadores.canalTrocaProdutoServico,
              indicadores.canalVendaOrganizacao,
              indicadores.canalVendaDiretaConsumidor,
              indicadores.canalFeira,
              indicadores.canalMercadoLocal,
              indicadores.canalAtravessador,
              indicadores.canalPaa,
              indicadores.canalPnae,
              indicadores.canalMercadoJustoSolidario,
            ].filter(Boolean).length
          : 0;

        return {
          id: organizacao.id,
          denominacao: organizacao.denominacao,
          municipio: organizacao.municipio,
          numeroFamiliasPrevistas: organizacao.numeroFamilias,
          familiasVinculadas: organizacao._count.familias,
          indicadoresRegistrados: Boolean(indicadores),
          praticasAmbientais: indicadores?.possuiPraticasAmbientais ?? null,
          identidadeComercial: indicadores?.usaIdentidadeComercial ?? null,
          mulheresDiretoria: indicadores?.possuiMulheresDiretoriaConselho ?? null,
          jovensDiretoria: indicadores?.possuiJovensDiretoriaConselho ?? null,
          representacaoPolitica: indicadores?.filiadaOrganizacao ?? null,
          politicasPublicas: indicadores?.acessaPoliticasPublicas ?? null,
          canaisComercializacao,
        };
      }),
      atendimentos: atendimentos.map((atendimento) => {
        const eixosTrabalhados = [
          hasEixoData(atendimento.eixoProdutivo) ? "Produtivo" : null,
          hasEixoData(atendimento.eixoSocial) ? "Social" : null,
          hasEixoData(atendimento.eixoAmbiental) ? "Ambiental" : null,
        ].filter((item): item is string => Boolean(item));

        const indicadoresTrabalhados = [
          ...getEixoIndicadores(atendimento.eixoProdutivo),
          ...getEixoIndicadores(atendimento.eixoSocial),
          ...getEixoIndicadores(atendimento.eixoAmbiental),
        ];

        return {
          id: atendimento.id,
          numeroVisita: atendimento.numeroVisita,
          data: atendimento.data ? atendimento.data.toISOString() : null,
          statusRelatorio: atendimento.statusRelatorio,
          ufpa: atendimento.familia?.nomeFamilia ?? null,
          organizacaoColetiva: atendimento.familia?.organizacaoColetiva?.denominacao ?? null,
          tecnico: atendimento.tecnicoRef?.nome ?? atendimento.tecnico ?? null,
          numeroMulheres: atendimento.numeroMulheres ?? 0,
          numeroJovens: atendimento.numeroJovens ?? 0,
          eixosTrabalhados,
          indicadoresTrabalhados: [...new Set(indicadoresTrabalhados)],
        };
      }),
    };
  }

  static async getFamiliaById(id: string): Promise<FamiliaWithCadastro | null> {
    return prisma.familiaAter.findUnique({
      where: { id },
      include: {
        cadastro: true,
        organizacaoColetiva: true,
        integrantes: { orderBy: [{ responsavelUfpa: "desc" }, { nome: "asc" }] },
        diagnostico: true,
        indicadores: true,
      },
    });
  }

  static async createFamilia(data: FamiliaAterInput) {
    const { nomeFamilia, documentoResponsavel, integrantes, organizacaoColetivaId, ...rest } = data;

    return prisma.cadastroUnico.create({
      data: {
        tipo: TipoCadastro.PF,
        documento: documentoResponsavel || `fam-${randomUUID()}`,
        nome: nomeFamilia,
        telefone: rest.telefone || null,
        familia: {
          create: {
            nomeFamilia,
            documentoResponsavel: documentoResponsavel || null,
            ...rest,
            organizacaoColetiva: organizacaoColetivaId
              ? {
                  connect: { id: organizacaoColetivaId },
                }
              : undefined,
            integrantes: integrantes?.length
              ? {
                  create: integrantes,
                }
              : undefined,
          },
        },
      },
      include: { familia: { include: { integrantes: true } } },
    });
  }

  static async updateFamilia(id: string, data: FamiliaAterInput) {
    const { nomeFamilia, documentoResponsavel, telefone, integrantes, organizacaoColetivaId, ...rest } = data;

    return prisma.$transaction(async (tx) => {
      const familia = await tx.familiaAter.update({
        where: { id },
        data: {
          nomeFamilia,
          documentoResponsavel,
          telefone,
          ...rest,
          organizacaoColetiva:
            organizacaoColetivaId === undefined
              ? undefined
              : organizacaoColetivaId
                ? { connect: { id: organizacaoColetivaId } }
                : { disconnect: true },
        },
        include: { cadastro: true },
      });

      if (integrantes) {
        await tx.integranteUfpa.deleteMany({ where: { familiaId: id } });

        if (integrantes.length > 0) {
          await tx.integranteUfpa.createMany({
            data: integrantes.map((integrante) => ({
              ...integrante,
              familiaId: id,
            })),
          });
        }
      }

      await tx.cadastroUnico.update({
        where: { id: familia.cadastroId },
        data: {
          nome: nomeFamilia || familia.nomeFamilia,
          documento: documentoResponsavel || familia.documentoResponsavel || familia.cadastro.documento,
          telefone: telefone || null,
        },
      });

      return familia;
    });
  }

  static async upsertDiagnosticoUfpa(
    familiaId: string,
    data: {
      diagnostico: Omit<Prisma.DiagnosticoUfpaUncheckedCreateInput, "id" | "familiaId" | "createdAt" | "updatedAt">;
      indicadores: Omit<Prisma.IndicadoresUfpaUncheckedCreateInput, "id" | "familiaId" | "createdAt" | "updatedAt">;
    },
  ) {
    const { diagnostico, indicadores } = data;

    return prisma.$transaction(async (tx) => {
      const savedDiagnostico = await tx.diagnosticoUfpa.upsert({
        where: { familiaId },
        create: {
          ...diagnostico,
          familiaId,
        },
        update: diagnostico,
      });

      const savedIndicadores = await tx.indicadoresUfpa.upsert({
        where: { familiaId },
        create: {
          ...indicadores,
          familiaId,
        },
        update: indicadores,
      });

      return { diagnostico: savedDiagnostico, indicadores: savedIndicadores };
    });
  }

  // --- ORGANIZACOES COLETIVAS ---

  static async listOrganizacoesColetivas(): Promise<OrganizacaoColetivaListItem[]> {
    return prisma.organizacaoColetiva.findMany({
      include: {
        _count: { select: { familias: true } },
      },
      orderBy: [{ municipio: "asc" }, { denominacao: "asc" }],
    });
  }

  static async getOrganizacaoColetivaById(id: string): Promise<OrganizacaoColetivaWithFamilias | null> {
    return prisma.organizacaoColetiva.findUnique({
      where: { id },
      include: {
        familias: {
          include: {
            diagnostico: true,
            indicadores: true,
            _count: {
              select: {
                atendimentos: { where: { statusRelatorio: { not: ATER_SOCIOBIO_STATUS_RASCUNHO } } },
                integrantes: true,
              },
            },
          },
          orderBy: [{ municipio: "asc" }, { nomeFamilia: "asc" }],
        },
        indicadores: true,
        _count: { select: { familias: true } },
      },
    });
  }

  static async createOrganizacaoColetiva(data: OrganizacaoColetivaInput) {
    return prisma.organizacaoColetiva.create({
      data,
      include: {
        _count: { select: { familias: true } },
      },
    });
  }

  static async updateOrganizacaoColetiva(id: string, data: OrganizacaoColetivaInput) {
    return prisma.organizacaoColetiva.update({
      where: { id },
      data,
      include: {
        _count: { select: { familias: true } },
      },
    });
  }

  static async upsertIndicadoresOrganizacaoColetiva(
    organizacaoColetivaId: string,
    data: Omit<
      Prisma.IndicadoresOrganizacaoColetivaUncheckedCreateInput,
      "id" | "organizacaoColetivaId" | "createdAt" | "updatedAt"
    >,
  ) {
    return prisma.indicadoresOrganizacaoColetiva.upsert({
      where: { organizacaoColetivaId },
      create: {
        ...data,
        organizacaoColetivaId,
      },
      update: data,
    });
  }

  // --- ATENDIMENTOS ---

  static async listAtendimentos(filtros?: { familiaId?: string; beneficiariaId?: string }): Promise<AtendimentoWithDetails[]> {
    return prisma.atendimento.findMany({
      where: {
        ...(filtros?.familiaId ? { familiaId: filtros.familiaId } : {}),
        ...(filtros?.beneficiariaId ? { beneficiariaId: filtros.beneficiariaId } : {}),
      },
      include: {
        familia: {
          include: {
            cadastro: true,
            organizacaoColetiva: true,
            integrantes: { orderBy: [{ responsavelUfpa: "desc" }, { nome: "asc" }] },
            diagnostico: true,
            indicadores: true,
          },
        },
        beneficiaria: {
          include: { cadastro: true },
        },
        tecnicoRef: true,
      },
      orderBy: { data: "desc" },
    });
  }

  static async getAtendimentoById(id: string): Promise<AtendimentoWithDetails | null> {
    return prisma.atendimento.findUnique({
      where: { id },
      include: {
        familia: {
          include: {
            cadastro: true,
            organizacaoColetiva: true,
            integrantes: { orderBy: [{ responsavelUfpa: "desc" }, { nome: "asc" }] },
            diagnostico: true,
            indicadores: true,
          },
        },
        beneficiaria: {
          include: { cadastro: true },
        },
        tecnicoRef: true,
      },
    });
  }

  static async createAtendimento(data: Prisma.AtendimentoUncheckedCreateInput) {
    return prisma.atendimento.create({
      data,
      include: {
        beneficiaria: { include: { cadastro: true } },
        tecnicoRef: true,
      },
    });
  }

  static async updateAtendimento(id: string, data: Prisma.AtendimentoUncheckedUpdateInput) {
    return prisma.atendimento.update({
      where: { id },
      data,
      include: {
        beneficiaria: { include: { cadastro: true } },
        tecnicoRef: true,
      },
    });
  }

  // --- TECNICOS ---

  static async listTecnicos() {
    return prisma.tecnico.findMany({
      where: { ativo: true },
      orderBy: { nome: "asc" },
    });
  }
}
