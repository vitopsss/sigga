import "server-only";

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

// Retry logic for Supabase Nano Connection Limits (EMAXCONNSESSION or timeouts)
const withRetry = (prismaClient: PrismaClient) => {
  return prismaClient.$extends({
    query: {
      $allModels: {
        async $allOperations({ operation, model, args, query }) {
          const maxRetries = 3;
          let attempt = 0;
          let delay = 500; // ms

          while (true) {
            try {
              return await query(args);
            } catch (error: any) {
              attempt++;
              const isConnectionError =
                error?.message?.includes("EMAXCONNSESSION") ||
                error?.message?.includes("timeout") ||
                error?.message?.includes("pool") ||
                error?.code === "P1001" ||
                error?.code === "P2024" ||
                error?.code === "53300"; // too_many_connections

              if (isConnectionError && attempt < maxRetries) {
                console.warn(`[Prisma Retry] Tentativa ${attempt}/${maxRetries} falhou para ${model}.${operation}. Retentando em ${delay}ms...`);
                await new Promise((res) => setTimeout(res, delay));
                delay *= 2; // Exponential backoff
              } else {
                throw error;
              }
            }
          }
        },
      },
    },
  });
};

const basePrisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

export const prisma = withRetry(basePrisma) as unknown as PrismaClient;

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = basePrisma;
}
