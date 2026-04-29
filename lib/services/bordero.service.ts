import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export type BorderoListItem = Prisma.BorderoGetPayload<{
  include: {
    projeto: { select: { titulo: true; centroCusto: true } };
    lancamentos: { select: { valor: true } };
  };
}>;

export type BorderoDetail = Prisma.BorderoGetPayload<{
  include: {
    projeto: { select: { titulo: true; centroCusto: true } };
    lancamentos: {
      include: { favorecido: true };
    };
  };
}>;

export interface BorderoInputDTO {
  idBordero: string;
  projetoId: string;
  tipoBordero: string | null;
  data: Date;
}

export interface LancamentoInputDTO {
  nsu: string;
  favorecidoId: string;
  fase: string | null;
  etapa: string | null;
  valor: number;
  dataVencimento: Date;
  formaPagamento: string | null;
}

export class BorderoService {
  static async list(params: { busca?: string; projetoId?: string; status?: string }): Promise<[BorderoListItem[], Array<{ id: string; titulo: string; centroCusto: string }>]> {
    const { busca, projetoId, status } = params;
    const buscaNorm = busca?.trim() || "";

    const where: Prisma.BorderoWhereInput = {};
    const and: Prisma.BorderoWhereInput[] = [];

    if (buscaNorm) {
      and.push({
        OR: [
          { idBordero: { contains: buscaNorm, mode: "insensitive" } },
          { tipoBordero: { contains: buscaNorm, mode: "insensitive" } },
          { projeto: { titulo: { contains: buscaNorm, mode: "insensitive" } } },
        ],
      });
    }

    if (projetoId) {
      and.push({ projetoId });
    }

    if (status) {
      and.push({ status: { equals: status, mode: "insensitive" } });
    }

    if (and.length > 0) {
      where.AND = and;
    }

    return Promise.all([
      prisma.bordero.findMany({
        where,
        include: {
          projeto: { select: { titulo: true, centroCusto: true } },
          lancamentos: { select: { valor: true } },
        },
        orderBy: { data: "desc" },
      }),
      prisma.projeto.findMany({
        select: { id: true, titulo: true, centroCusto: true },
        orderBy: { centroCusto: "asc" },
      }),
    ]);
  }

  static async getById(id: string): Promise<BorderoDetail | null> {
    return prisma.bordero.findUnique({
      where: { id },
      include: {
        projeto: { select: { titulo: true, centroCusto: true } },
        lancamentos: {
          include: { favorecido: true },
          orderBy: { dataVencimento: "asc" },
        },
      },
    });
  }

  static async listProjetos() {
    return prisma.projeto.findMany({
      select: { id: true, centroCusto: true, titulo: true },
      orderBy: { centroCusto: "asc" },
    });
  }

  static async listFavorecidos() {
    return prisma.cadastroUnico.findMany({
      select: { id: true, nome: true, documento: true, tipo: true },
      orderBy: { nome: "asc" },
    });
  }

  static async gerarProximoIdBordero(): Promise<string> {
    const ultimo = await prisma.bordero.findFirst({
      where: {
        idBordero: { startsWith: "BOR" },
      },
      orderBy: { idBordero: "desc" },
      select: { idBordero: true },
    });

    if (!ultimo) return "BOR000001";

    const numStr = ultimo.idBordero.replace(/\D/g, "");
    const nextNum = parseInt(numStr, 10) + 1;
    return `BOR${String(nextNum).padStart(6, "0")}`;
  }

  static async sincronizarStatusBordero(borderoId: string, tx?: Prisma.TransactionClient): Promise<string> {
    const executor = tx || prisma;
    const lancamentos = await executor.lancamentoFinanceiro.findMany({
      where: { borderoId },
      select: {
        conciliado: true,
        autorizado: true,
        dataPagamento: true,
      },
    });

    let status = "Pendente";

    if (lancamentos.length > 0 && lancamentos.every((lancamento) => lancamento.conciliado)) {
      status = "Conciliado";
    } else if (
      lancamentos.some(
        (lancamento) => lancamento.conciliado || lancamento.autorizado || lancamento.dataPagamento !== null
      )
    ) {
      status = "Em processamento";
    }

    await executor.bordero.update({
      where: { id: borderoId },
      data: { status },
    });

    return status;
  }

  static async create(borderoInput: BorderoInputDTO, lancamentosInput: LancamentoInputDTO[]): Promise<string> {
    let createdId: string | undefined;

    try {
      const bordero = await prisma.$transaction(async (tx) => {
        const created = await tx.bordero.create({
          data: {
            idBordero: borderoInput.idBordero,
            projetoId: borderoInput.projetoId,
            tipoBordero: borderoInput.tipoBordero,
            data: borderoInput.data,
            status: "Pendente",
          },
        });

        for (const lancamento of lancamentosInput) {
          await tx.lancamentoFinanceiro.create({
            data: {
              nsu: lancamento.nsu,
              borderoId: created.id,
              favorecidoId: lancamento.favorecidoId,
              fase: lancamento.fase,
              etapa: lancamento.etapa,
              valor: lancamento.valor,
              dataVencimento: lancamento.dataVencimento,
              formaPagamento: lancamento.formaPagamento,
              conciliado: false,
            },
          });
        }

        await this.sincronizarStatusBordero(created.id, tx);
        return created;
      });

      createdId = bordero.id;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          const target = (error.meta?.target as string[]) || [];
          if (target.includes("idBordero")) {
            throw new Error(`O ID de borderô "${borderoInput.idBordero}" já está sendo usado por outro registro.`);
          }
          if (target.includes("nsu")) {
            throw new Error("Um ou mais NSUs informados já estão em uso em outros lançamentos. O NSU deve ser único.");
          }
        }
        if (error.code === "P2003") {
          throw new Error("Erro de referência: Verifique se o Projeto e os Favorecidos selecionados são válidos.");
        }
      }
      console.error("Erro ao salvar borderô:", error);
      throw new Error("Erro ao salvar borderô. Verifique os dados.");
    }

    return createdId;
  }

  static async update(id: string, borderoInput: BorderoInputDTO): Promise<void> {
    try {
      await prisma.bordero.update({
        where: { id },
        data: {
          idBordero: borderoInput.idBordero,
          projetoId: borderoInput.projetoId,
          tipoBordero: borderoInput.tipoBordero,
          data: borderoInput.data,
        },
      });

      await this.sincronizarStatusBordero(id);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        const target = (error.meta?.target as string[]) || [];
        if (target.includes("idBordero")) {
          throw new Error(`O ID de borderô "${borderoInput.idBordero}" já está sendo usado por outro registro.`);
        }
      }
      console.error("Erro ao atualizar borderô:", error);
      throw new Error("Erro ao atualizar borderô. Verifique os dados.");
    }
  }

  static async adicionarLancamento(borderoId: string, lancamentoInput: LancamentoInputDTO): Promise<void> {
    try {
      await prisma.$transaction(async (tx) => {
        await tx.lancamentoFinanceiro.create({
          data: {
            borderoId,
            nsu: lancamentoInput.nsu,
            favorecidoId: lancamentoInput.favorecidoId,
            fase: lancamentoInput.fase,
            etapa: lancamentoInput.etapa,
            valor: lancamentoInput.valor,
            dataVencimento: lancamentoInput.dataVencimento,
            formaPagamento: lancamentoInput.formaPagamento,
            autorizado: false,
            conciliado: false,
          },
        });

        await this.sincronizarStatusBordero(borderoId, tx);
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        const target = (error.meta?.target as string[]) || [];
        if (target.includes("nsu")) {
          throw new Error(`O NSU "${lancamentoInput.nsu}" já está sendo usado em outro lançamento.`);
        }
      }
      console.error("Erro ao adicionar lançamento:", error);
      throw new Error("Erro ao adicionar lançamento.");
    }
  }

  static async removerLancamento(borderoId: string, lancamentoId: string): Promise<void> {
    await prisma.$transaction(async (tx) => {
      await tx.lancamentoFinanceiro.delete({
        where: { id: lancamentoId },
      });

      await this.sincronizarStatusBordero(borderoId, tx);
    });
  }
}
