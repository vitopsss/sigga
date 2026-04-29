import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export type ContratoListItem = Prisma.ContratoFornecedorGetPayload<{
  include: { fornecedor: true };
}>;

export interface SaveContratoDTO {
  id?: string;
  idContrato: string;
  fornecedorId: string;
  objeto: string | null;
  status: string | null;
  valorTotal: number;
}

export class CompraService {
  static async list(search?: string): Promise<ContratoListItem[]> {
    const normalizedSearch = search?.trim() || "";

    return prisma.contratoFornecedor.findMany({
      where: normalizedSearch
        ? {
            OR: [
              { idContrato: { contains: normalizedSearch, mode: "insensitive" } },
              { objeto: { contains: normalizedSearch, mode: "insensitive" } },
              { fornecedor: { nome: { contains: normalizedSearch, mode: "insensitive" } } },
            ],
          }
        : undefined,
      include: { fornecedor: true },
      orderBy: { idContrato: "desc" },
    });
  }

  static async getById(id: string) {
    return prisma.contratoFornecedor.findUnique({
      where: { id },
      include: { fornecedor: true },
    });
  }

  static async listFornecedores() {
    return prisma.cadastroUnico.findMany({
      select: { id: true, nome: true, documento: true, tipo: true },
      orderBy: { nome: "asc" },
    });
  }

  static async save(data: SaveContratoDTO): Promise<string> {
    const { id, ...payload } = data;

    try {
      if (id) {
        await prisma.contratoFornecedor.update({
          where: { id },
          data: payload,
        });
        return id;
      }

      const created = await prisma.contratoFornecedor.create({
        data: payload,
      });
      return created.id;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        throw new Error("Já existe um contrato com esse identificador.");
      }
      throw error;
    }
  }
}
