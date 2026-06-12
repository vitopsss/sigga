import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const projetos = await prisma.projeto.findMany({
    select: { id: true, titulo: true, centroCusto: true },
    orderBy: { centroCusto: "asc" }
  });
  console.log(JSON.stringify(projetos, null, 2));
}

main().finally(() => prisma.$disconnect());
