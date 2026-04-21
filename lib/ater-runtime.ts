import { Prisma } from "@prisma/client";

const ATER_TABLE_NAMES = ["familias_ater", "atendimentos", "tecnicos_ater"];

export const ATER_SETUP_ERROR =
  "O banco conectado ainda não tem as tabelas do módulo ATER. Aplique as migrations mais recentes do Prisma nesse banco.";

export function isAterMissingTableError(error: unknown) {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
    return false;
  }

  if (error.code !== "P2021") {
    return false;
  }

  const meta = error.meta as { table?: unknown } | undefined;
  const tableName = typeof meta?.table === "string" ? meta.table.toLowerCase() : "";
  const message = error.message.toLowerCase();

  return ATER_TABLE_NAMES.some((table) => tableName.includes(table) || message.includes(table));
}

export function getAterErrorMessage(error: unknown, fallbackMessage: string) {
  if (isAterMissingTableError(error)) {
    return ATER_SETUP_ERROR;
  }

  console.error(error);
  return fallbackMessage;
}
