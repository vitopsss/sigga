const tsNode = require('ts-node');
tsNode.register({ transpileOnly: true });

const { AterSociobioService } = require('./lib/services/ater-sociobio.service.ts');

async function main() {
  try {
    const result = await AterSociobioService.listFamilias({
      filtros: {
        busca: "",
        municipio: "",
        comunidade: "",
        organizacaoId: "",
        sgaIncompleto: false,
        indicador: "",
      },
      skip: 0,
      take: 10,
    });
    console.log("Total returned:", result.total);
  } catch (e) {
    console.error("ERROR CAUGHT:", e);
  }
}

main().finally(() => process.exit(0));
