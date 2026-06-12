throw new Error("Script desabilitado — aguardando refatoracao para o schema V1 ATER. Nao usar ate novo aviso.");

import { prisma } from "../../lib/prisma";

import {
  getRowsFromSheet,
  pick,
  readWorkbook,
} from "./_shared";

async function main() {
  const workbookPath = process.argv[2];
  if (!workbookPath) {
    throw new Error("Informe o caminho do arquivo RELATAT.");
  }

  const workbook = readWorkbook(workbookPath);
  const rows = getRowsFromSheet(workbook, "Controle de Processos", 4, 5);

  for (const row of rows) {
    const cpf = pick(row, "cpf");
    const nome = pick(row, "nome");
    if (!cpf || !nome) {
      continue;
    }

    const cadastro = await prisma.cadastroUnico.upsert({
      where: { documento: cpf },
      update: {
        nome,
        telefone: pick(row, "telefone", "whatsapp") || undefined,
      },
      create: {
        tipo: "PF",
        documento: cpf,
        nome,
        telefone: pick(row, "telefone", "whatsapp") || null,
      },
    });

    await prisma.beneficiaria.upsert({
      where: { cadastroId: cadastro.id },
      update: {
        codigoSGA: pick(row, "codigo sga", "id sga") || undefined,
        nis: pick(row, "nis") || undefined,
        municipio: pick(row, "municipio") || undefined,
        comunidade: pick(row, "comunidade") || undefined,
        ufpa: pick(row, "ufpa") || undefined,
      },
      create: {
        cadastroId: cadastro.id,
        codigoSGA: pick(row, "codigo sga", "id sga") || undefined,
        nis: pick(row, "nis") || undefined,
        municipio: pick(row, "municipio") || undefined,
        comunidade: pick(row, "comunidade") || undefined,
        ufpa: pick(row, "ufpa") || undefined,
      },
    });
  }
}

main()
  .finally(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
