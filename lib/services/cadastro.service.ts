import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export type CadastroListItem = Prisma.PessoaGetPayload<{
  select: {
    id: true;
    nome: true;
    documento: true;
    tipo: true;
    email: true;
    telefone: true;
  };
}>;

export type CadastroDetail = Prisma.PessoaGetPayload<{
  select: {
    id: true;
    tipo: true;
    documento: true;
    nome: true;
    email: true;
    telefone: true;
    endereco: true;
    banco: true;
    agencia: true;
    conta: true;
    pix: true;
  };
}>;

export interface SaveCadastroDTO {
  id?: string;
  tipo: "PF" | "PJ" | "PUBLICO" | "PRIVADO";
  documento: string;
  nome: string;
  email?: string | null;
  telefone?: string | null;
  endereco?: string | null;
  banco?: string | null;
  agencia?: string | null;
  conta?: string | null;
  pix?: string | null;
  origemCadastro?: string;
}

export class CadastroService {
  static async list(search?: string): Promise<CadastroListItem[]> {
    const normalizedSearch = search?.trim() || "";

    return prisma.pessoa.findMany({
      where: normalizedSearch
        ? {
            OR: [
              { nome: { contains: normalizedSearch, mode: "insensitive" } },
              { documento: { contains: normalizedSearch, mode: "insensitive" } },
            ],
          }
        : undefined,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        nome: true,
        documento: true,
        tipo: true,
        email: true,
        telefone: true,
      },
    });
  }

  static async getById(id: string): Promise<CadastroDetail | null> {
    return prisma.pessoa.findUnique({
      where: { id },
      select: {
        id: true,
        tipo: true,
        documento: true,
        nome: true,
        email: true,
        telefone: true,
        endereco: true,
        banco: true,
        agencia: true,
        conta: true,
        pix: true,
      },
    });
  }

  static async checkDocumentoExists(documento: string, excludeId?: string): Promise<boolean> {
    const doc = await prisma.pessoa.findFirst({
      where: {
        documento,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
      select: { id: true },
    });
    return !!doc;
  }

  static async save(data: SaveCadastroDTO) {
    const { id, ...payload } = data;

    if (id) {
      return prisma.pessoa.update({
        where: { id },
        data: payload,
      });
    }

    return prisma.pessoa.create({
      data: payload,
    });
  }

  static async delete(id: string) {
    return prisma.pessoa.delete({
      where: { id },
    });
  }
}
