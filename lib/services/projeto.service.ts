import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export type ProjetoListItem = Prisma.ProjetoGetPayload<{}>;

export type ProjetoDetail = Prisma.ProjetoGetPayload<{
  include: {
    orcamentoItens: true;
    metas: true;
  };
}>;

export interface SaveProjetoDTO {
  id?: string;
  centroCusto: string;
  titulo: string;
  abreviacao?: string | null;
  portfolio?: string | null;
  financiador?: string | null;
  numContrato?: string | null;
  status: string;
  vigenciaInicial: Date;
  vigenciaFinal?: Date | null;
  ano?: number | null;
  valorTotal: number;
}

export interface OrcamentoItemDTO {
  idOrc: string;
  descricao?: string | null;
  valorReferencia: number;
  valorTotal: number;
}

export class ProjetoService {
  static async list(search?: string): Promise<ProjetoListItem[]> {
    const normalizedSearch = search?.trim() || "";

    return prisma.projeto.findMany({
      where: normalizedSearch
        ? {
            OR: [
              { centroCusto: { contains: normalizedSearch, mode: "insensitive" } },
              { titulo: { contains: normalizedSearch, mode: "insensitive" } },
              { abreviacao: { contains: normalizedSearch, mode: "insensitive" } },
            ],
          }
        : undefined,
      orderBy: { centroCusto: "asc" },
    });
  }

  static async getById(id: string): Promise<ProjetoDetail | null> {
    return prisma.projeto.findUnique({
      where: { id },
      include: {
        orcamentoItens: true,
        metas: true,
      },
    });
  }

  static async checkCentroCustoExists(centroCusto: string, excludeId?: string): Promise<boolean> {
    const existing = await prisma.projeto.findFirst({
      where: {
        centroCusto,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
      select: { id: true },
    });
    return !!existing;
  }

  static async save(data: SaveProjetoDTO) {
    const { id, ...payload } = data;

    if (id) {
      return prisma.projeto.update({
        where: { id },
        data: payload,
      });
    }

    return prisma.projeto.create({
      data: payload,
    });
  }

  static async delete(id: string) {
    return prisma.projeto.delete({
      where: { id },
    });
  }

  static async addOrcamentoItem(projetoId: string, item: OrcamentoItemDTO) {
    return prisma.orcamentoItem.create({
      data: {
        projetoId,
        ...item,
      },
    });
  }
}
