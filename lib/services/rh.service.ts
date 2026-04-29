import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export type ColaboradorWithCadastro = Prisma.ColaboradorGetPayload<{
  include: { cadastro: true };
}>;

export interface SaveColaboradorDTO {
  id?: string;
  cadastroId: string;
  idRH: string;
  cargo: string;
  vinculo: string;
  salarioBase: number;
  status: string;
}

export class RHService {
  static async list(search?: string): Promise<ColaboradorWithCadastro[]> {
    const normalizedSearch = search?.trim();

    return prisma.colaborador.findMany({
      where: normalizedSearch
        ? {
            OR: [
              { idRH: { contains: normalizedSearch, mode: "insensitive" } },
              { cargo: { contains: normalizedSearch, mode: "insensitive" } },
              { vinculo: { contains: normalizedSearch, mode: "insensitive" } },
              { cadastro: { nome: { contains: normalizedSearch, mode: "insensitive" } } },
            ],
          }
        : undefined,
      include: { cadastro: true },
      orderBy: { idRH: "asc" },
    });
  }

  static async getById(id: string): Promise<ColaboradorWithCadastro | null> {
    return prisma.colaborador.findUnique({
      where: { id },
      include: { cadastro: true },
    });
  }

  static async listPeople() {
    return prisma.pessoa.findMany({
      orderBy: { nome: 'asc' }
    });
  }

  static async save(data: SaveColaboradorDTO) {
    const { id, ...payload } = data;

    if (id) {
      return prisma.colaborador.update({
        where: { id },
        data: payload,
      });
    }

    return prisma.colaborador.create({
      data: payload,
    });
  }

  static async delete(id: string) {
    return prisma.colaborador.delete({
      where: { id },
    });
  }
}
