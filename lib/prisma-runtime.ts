import { Prisma } from "@prisma/client";

export const DATABASE_UNAVAILABLE_ERROR =
  "Não foi possível conectar ao banco de dados no momento. Verifique a DATABASE_URL, a rede e a disponibilidade do servidor.";

export function isDatabaseUnavailableError(error: unknown) {
  if (error instanceof Prisma.PrismaClientInitializationError) {
    return true;
  }

  const message = error instanceof Error ? error.message.toLowerCase() : String(error ?? "").toLowerCase();

  return (
    message.includes("can't reach database server") ||
    message.includes("cannot reach database server") ||
    message.includes("failed to connect") ||
    message.includes("connection refused") ||
    message.includes("timeout") ||
    message.includes("database server")
  );
}

export function getDatabaseErrorMessage(error: unknown, fallbackMessage: string) {
  if (isDatabaseUnavailableError(error)) {
    return DATABASE_UNAVAILABLE_ERROR;
  }

  console.error(error);
  return fallbackMessage;
}
