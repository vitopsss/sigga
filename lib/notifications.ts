import { prisma } from "@/lib/prisma";
import { isDatabaseUnavailableError } from "@/lib/prisma-runtime";

export type AppNotification = {
  id: string;
  title: string;
  description: string;
  href: string;
  severity: "critical" | "warning" | "info";
  createdAt: string;
};

function formatDate(value: Date | null) {
  return value ? value.toLocaleDateString("pt-BR") : "sem data";
}

function byNewest(first: AppNotification, second: AppNotification) {
  return new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime();
}

export async function getAppNotifications() {
  try {
    const now = new Date();
    const dueSoonLimit = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

    const [overdueLancamentos, dueSoonLancamentos, pendingAtendimentos] = await Promise.all([
      prisma.lancamentoFinanceiro.findMany({
        where: {
          conciliado: false,
          dataVencimento: { lt: now },
        },
        include: {
          bordero: {
            select: {
              id: true,
              idBordero: true,
              projeto: { select: { titulo: true } },
            },
          },
          favorecido: {
            select: { nome: true },
          },
        },
        orderBy: { dataVencimento: "asc" },
        take: 5,
      }),
      prisma.lancamentoFinanceiro.findMany({
        where: {
          conciliado: false,
          dataVencimento: {
            gte: now,
            lte: dueSoonLimit,
          },
        },
        include: {
          bordero: {
            select: {
              id: true,
              idBordero: true,
              projeto: { select: { titulo: true } },
            },
          },
          favorecido: {
            select: { nome: true },
          },
        },
        orderBy: { dataVencimento: "asc" },
        take: 5,
      }),
      prisma.atendimento.findMany({
        where: {
          statusRelatorio: "PENDENTE",
        },
        include: {
          familia: {
            select: { nomeFamilia: true },
          },
          tecnicoRef: {
            select: { nome: true },
          },
        },
        orderBy: { data: "asc" },
        take: 5,
      }),
    ]);

    const notifications: AppNotification[] = [
      ...overdueLancamentos.map((lancamento) => ({
        id: `lancamento-overdue:${lancamento.id}`,
        title: `Lançamento ${lancamento.nsu} vencido`,
        description: `${lancamento.favorecido.nome} no borderô ${lancamento.bordero.idBordero} venceu em ${formatDate(lancamento.dataVencimento)}.`,
        href: `/financeiro?status=vencido&busca=${encodeURIComponent(lancamento.nsu)}`,
        severity: "critical" as const,
        createdAt: lancamento.dataVencimento.toISOString(),
      })),
      ...dueSoonLancamentos.map((lancamento) => ({
        id: `lancamento-due-soon:${lancamento.id}`,
        title: `Lançamento ${lancamento.nsu} vence em breve`,
        description: `${lancamento.favorecido.nome} no projeto ${lancamento.bordero.projeto.titulo} vence em ${formatDate(lancamento.dataVencimento)}.`,
        href: `/financeiro?status=pendente&busca=${encodeURIComponent(lancamento.nsu)}`,
        severity: "warning" as const,
        createdAt: lancamento.dataVencimento.toISOString(),
      })),
      ...pendingAtendimentos.map((atendimento) => ({
        id: `atendimento-pendente:${atendimento.id}`,
        title: `Atendimento #${atendimento.numeroVisita} pendente`,
        description: `${atendimento.familia?.nomeFamilia ?? "Família sem vínculo"} com relatório pendente${atendimento.tecnicoRef?.nome ? ` para ${atendimento.tecnicoRef.nome}` : ""}.`,
        href: `/ater-sociobio/atendimentos/${atendimento.id}`,
        severity: "info" as const,
        createdAt: atendimento.data?.toISOString() ?? now.toISOString(),
      })),
    ]
      .sort(byNewest)
      .slice(0, 10);

    return {
      notifications,
      databaseUnavailable: false,
    };
  } catch (error) {
    if (isDatabaseUnavailableError(error)) {
      return {
        notifications: [] as AppNotification[],
        databaseUnavailable: true,
      };
    }

    throw error;
  }
}
