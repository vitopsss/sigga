import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function clearSiggaterData() {
  const existingFamilias = await prisma.familiaAter.findMany({ select: { id: true, cadastroId: true } });
  const familiaIds = existingFamilias.map((familia) => familia.id);
  const cadastroIds = existingFamilias.map((familia) => familia.cadastroId);

  const deleted = {
    atendimentos: 0,
    indicadoresUfpa: 0,
    diagnosticosUfpa: 0,
    integrantes: 0,
    familias: 0,
    cadastrosUfpa: 0,
    indicadoresOrganizacao: 0,
    organizacoes: 0,
    tecnicosDemo: 0,
    atendimentosOrfaos: 0,
  };

  if (familiaIds.length > 0) {
    deleted.atendimentos = (await prisma.atendimento.deleteMany({ where: { familiaId: { in: familiaIds } } })).count;
    deleted.indicadoresUfpa = (await prisma.indicadoresUfpa.deleteMany({ where: { familiaId: { in: familiaIds } } })).count;
    deleted.diagnosticosUfpa = (await prisma.diagnosticoUfpa.deleteMany({ where: { familiaId: { in: familiaIds } } })).count;
    deleted.integrantes = (await prisma.integranteUfpa.deleteMany({ where: { familiaId: { in: familiaIds } } })).count;
    deleted.familias = (await prisma.familiaAter.deleteMany({ where: { id: { in: familiaIds } } })).count;
    deleted.cadastrosUfpa = (await prisma.cadastroUnico.deleteMany({ where: { id: { in: cadastroIds } } })).count;
  }

  deleted.indicadoresOrganizacao = (await prisma.indicadoresOrganizacaoColetiva.deleteMany()).count;
  deleted.organizacoes = (await prisma.organizacaoColetiva.deleteMany()).count;
  deleted.tecnicosDemo = (
    await prisma.tecnico.deleteMany({
      where: {
        OR: [
          { cpf: { in: ["90000000001", "90000000002", "90000000003"] } },
          { nome: { contains: "ATER Campo" } },
        ],
      },
    })
  ).count;
  deleted.atendimentosOrfaos = (
    await prisma.atendimento.deleteMany({
      where: {
        familiaId: null,
        projetoTitulo: null,
        tecnico: null,
      },
    })
  ).count;

  return deleted;
}

async function main() {
  if (!process.argv.includes("--yes")) {
    throw new Error("Este script apaga os cadastros SIGGATER. Execute com --yes para confirmar.");
  }

  const deleted = await clearSiggaterData();
  console.log("Registros SIGGATER removidos:", deleted);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
