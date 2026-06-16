const { PrismaClient } = require('./node_modules/@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const where = {};
  const familias = await prisma.familiaAter.findMany({
    where,
    include: {
      cadastro: true,
      organizacaoColetiva: true,
      integrantes: { orderBy: [{ responsavelUfpa: "desc" }, { nome: "asc" }] },
      diagnostico: true,
      indicadores: true,
      _count: {
        select: {
          atendimentos: true,
          integrantes: true,
        },
      },
    },
    orderBy: [{ municipio: "asc" }, { nomeFamilia: "asc" }],
    skip: 0,
    take: 10,
  });
  console.log('Returned families:', familias.length);
}

main().finally(() => prisma.$disconnect());
