const { PrismaClient } = require('./node_modules/@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const count = await prisma.familiaAter.count();
  console.log('Count:', count);
  const ufpas = await prisma.familiaAter.findMany({ select: { nomeFamilia: true, id: true } });
  console.log(ufpas);
}

main().finally(() => prisma.$disconnect());
