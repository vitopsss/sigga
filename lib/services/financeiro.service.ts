import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { BorderoService } from "./bordero.service";

export type LancamentoListItem = Prisma.LancamentoFinanceiroGetPayload<{
  include: {
    bordero: {
      include: {
        projeto: {
          select: {
            titulo: true;
          };
        };
      };
    };
    favorecido: {
      select: {
        nome: true;
        documento: true;
      };
    };
  };
}>;

export interface LancamentoFilterDTO {
  busca?: string;
  status?: string;
  borderoId?: string;
}

export class FinanceiroService {
  static async list(filters: LancamentoFilterDTO): Promise<LancamentoListItem[]> {
    const { busca, status, borderoId } = filters;
    const searchStatus = status?.toLowerCase();

    const where: Prisma.LancamentoFinanceiroWhereInput = {
      ...(borderoId ? { borderoId } : {}),
      ...(searchStatus === "conciliado"
        ? { conciliado: true }
        : searchStatus === "autorizado"
          ? { autorizado: true }
          : searchStatus === "pendente"
            ? { conciliado: false }
            : searchStatus === "vencido"
              ? { conciliado: false, dataVencimento: { lt: new Date() } }
              : {}),
      ...(busca
        ? {
            OR: [
              { nsu: { contains: busca, mode: "insensitive" } },
              { fase: { contains: busca, mode: "insensitive" } },
              { etapa: { contains: busca, mode: "insensitive" } },
              { favorecido: { nome: { contains: busca, mode: "insensitive" } } },
              { bordero: { idBordero: { contains: busca, mode: "insensitive" } } },
              { bordero: { projeto: { titulo: { contains: busca, mode: "insensitive" } } } },
            ],
          }
        : {}),
    };

    return prisma.lancamentoFinanceiro.findMany({
      where,
      include: {
        bordero: {
          include: {
            projeto: { select: { titulo: true } },
          },
        },
        favorecido: {
          select: { nome: true, documento: true },
        },
      },
      orderBy: [{ conciliado: "asc" }, { dataVencimento: "asc" }],
    });
  }

  static async autorizar(id: string) {
    const lancamento = await prisma.lancamentoFinanceiro.update({
      where: { id },
      data: { autorizado: true },
      select: { borderoId: true },
    });

    await BorderoService.sincronizarStatusBordero(lancamento.borderoId);
    return lancamento;
  }

  static async registrarPagamento(id: string, dataPagamento: Date, formaPagamento?: string | null) {
    const lancamento = await prisma.lancamentoFinanceiro.update({
      where: { id },
      data: {
        autorizado: true,
        dataPagamento,
        formaPagamento: formaPagamento || null,
      },
      select: { borderoId: true },
    });

    await BorderoService.sincronizarStatusBordero(lancamento.borderoId);
    return lancamento;
  }

  static async conciliar(id: string) {
    const lancamentoAtual = await prisma.lancamentoFinanceiro.findUnique({
      where: { id },
      select: {
        borderoId: true,
        dataPagamento: true,
        formaPagamento: true,
      },
    });

    if (!lancamentoAtual) {
      throw new Error("Lancamento nao encontrado.");
    }

    const lancamento = await prisma.lancamentoFinanceiro.update({
      where: { id },
      data: {
        autorizado: true,
        conciliado: true,
        dataPagamento: lancamentoAtual.dataPagamento ?? new Date(),
        formaPagamento: lancamentoAtual.formaPagamento ?? "Nao informado",
      },
      select: { borderoId: true },
    });

    await BorderoService.sincronizarStatusBordero(lancamento.borderoId);
    return lancamento;
  }
}
