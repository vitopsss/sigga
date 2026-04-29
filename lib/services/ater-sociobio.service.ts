import { prisma } from "@/lib/prisma";
import { Prisma, TipoCadastro } from "@prisma/client";
import { randomUUID } from "crypto";

export type FamiliaWithCadastro = Prisma.FamiliaAterGetPayload<{
  include: { cadastro: true };
}>;

export type AtendimentoWithDetails = Prisma.AtendimentoGetPayload<{
  include: {
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
}

export class AterSociobioService {
  // --- FAMILIAS ---

  static async listFamilias(params: {
    filtros?: FamiliaFilterDTO;
    skip?: number;
    take?: number;
  }): Promise<{
    familias: (FamiliaWithCadastro & { _count: { atendimentos: number } })[];
    total: number;
    metrics: {
      totalMunicipios: number;
      comNis: number;
      comSGA: number;
      municipios: string[];
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
          { nis: { contains: b, mode: "insensitive" } },
          { codigoSGA: { contains: b, mode: "insensitive" } },
          { municipio: { contains: b, mode: "insensitive" } },
          { comunidade: { contains: b, mode: "insensitive" } },
        ],
      });
    }
    if (filtros?.sgaIncompleto) {
      and.push({
        OR: [{ sgaCadastro: false }, { sgaCadastro: null }, { sgaRevisao: false }, { sgaRevisao: null }],
      });
    }

    if (and.length > 0) {
      where.AND = and;
    }

    const [familias, total, municipiosResult, comNis, comSGA] = await Promise.all([
      prisma.familiaAter.findMany({
        where,
        include: {
          cadastro: true,
          _count: { select: { atendimentos: true } },
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
      prisma.familiaAter.count({
        where: { ...where, nis: { not: null } },
      }),
      prisma.familiaAter.count({
        where: { ...where, codigoSGA: { not: null } },
      }),
    ]);

    return {
      familias,
      total,
      metrics: {
        totalMunicipios: municipiosResult.length,
        comNis,
        comSGA,
        municipios: municipiosResult.map((m) => m.municipio).filter(Boolean) as string[],
      },
    };
  }

  static async getFamiliaById(id: string): Promise<FamiliaWithCadastro | null> {
    return prisma.familiaAter.findUnique({
      where: { id },
      include: { cadastro: true },
    });
  }

  static async createFamilia(data: any) {
    const { nomeFamilia, documentoResponsavel, ...rest } = data;
    
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
            ...rest
          },
        },
      },
      include: { familia: true },
    });
  }

  static async updateFamilia(id: string, data: any) {
    const { nomeFamilia, telefone, ...rest } = data;

    return prisma.$transaction(async (tx) => {
      const familia = await tx.familiaAter.update({
        where: { id },
        data: rest,
        include: { cadastro: true },
      });

      await tx.cadastroUnico.update({
        where: { id: familia.cadastroId },
        data: {
          nome: nomeFamilia || familia.nomeFamilia,
          telefone: telefone || null,
        },
      });

      return familia;
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
          include: { cadastro: true },
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
        beneficiaria: {
          include: { cadastro: true },
        },
        tecnicoRef: true,
      },
    });
  }

  static async createAtendimento(data: any) {
    return prisma.atendimento.create({
      data,
      include: {
        beneficiaria: { include: { cadastro: true } },
        tecnicoRef: true,
      },
    });
  }

  static async updateAtendimento(id: string, data: any) {
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
