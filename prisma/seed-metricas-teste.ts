/**
 * seed-metricas-teste.ts
 * Seed CONTROLADO para validar metricas do dashboard UFPA.
 *
 * Cenarios:
 *   UFPA A - "Familia Verde"    -> agua tratada OK, esgoto OK, internet OK, sem inseguranca
 *   UFPA B - "Familia Alerta"   -> sem agua tratada, sem esgoto, inseguranca alimentar, sem CadUnico
 *   UFPA C - "Familia Produtiva"-> politicas produtivas OK, PRONAF OK, VBP R$18500, canais variados
 *
 * Valores esperados no dashboard (excluindo UFPAs reais do banco):
 *   agua tratada (sim)  : 2 (Verde + Produtiva)
 *   esgoto tratado (sim): 1 (Verde)
 *   inseg. alimentar    : 1 (Alerta)
 *   sem CadUnico        : 1 (Alerta)
 *   politicas produtivas: 1 (Produtiva)
 *   PRONAF acessado     : 1 (Produtiva)
 *   VBP informado       : 1 (Produtiva) = R$ 18.500,00
 *   UFPAs prioritarias  : Alerta (score alto), Verde (sem pol.prod.)
 *
 * ATENCAO: Nao executar em producao. Documentos prefixados com TEST-.
 * Limpeza: DELETE FROM familias_ater WHERE nome_familia LIKE '%-Teste'
 *
 * USO:
 *   npx.cmd tsx prisma/seed-metricas-teste.ts
 */
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seed de metricas -- iniciando...");

  const projeto = await prisma.projeto.upsert({
    where: { centroCusto: "TEST-1000" },
    update: {},
    create: {
      centroCusto: "TEST-1000",
      titulo: "Projeto Teste Metricas",
      status: "ATIVO",
      valorTotal: new Prisma.Decimal(0),
      vigenciaInicial: new Date("2025-01-01T00:00:00Z"),
    },
  });
  console.log("  OK Projeto: " + projeto.titulo);

  const org = await prisma.organizacaoColetiva.upsert({
    where: { id: "test-org-metricas-0001" },
    update: {},
    create: {
      id: "test-org-metricas-0001",
      denominacao: "Associacao Teste Metricas",
      municipio: "Belem",
      uf: "PA",
    },
  });
  console.log("  OK Organizacao: " + org.denominacao);

  type CriarUfpaOpts = {
    doc: string;
    nome: string;
    aguaTratada: boolean;
    esgoto: boolean;
    internet: boolean;
    insegurancaAlimentar: boolean;
    cadUnico: boolean;
    politicasProdutivas: boolean;
    pronaf: boolean;
    linhasPronaf: string[];
    vbp: number | null;
    canais: { feira?: boolean; mercadoLocal?: boolean; vendaDireta?: boolean; paa?: boolean; pnae?: boolean };
    codigoSGA?: string;
    dapCaf?: string;
  };

  async function criarUfpa(opts: CriarUfpaOpts) {
    const cadastro = await prisma.cadastroUnico.upsert({
      where: { documento: opts.doc },
      update: {},
      create: {
        documento: opts.doc,
        nome: opts.nome,
        tipo: "PF",
        origemCadastro: "TESTE",
      },
    });

    const familia = await prisma.familiaAter.upsert({
      where: { cadastroId: cadastro.id },
      update: {},
      create: {
        nomeFamilia: opts.nome,
        municipio: "Belem",
        comunidade: "Comunidade Teste",
        cadastroId: cadastro.id,
        organizacaoColetivaId: org.id,
        codigoSGA: opts.codigoSGA ?? null,
        dapCaf: opts.dapCaf ?? null,
        bioma: "Amazonia",
        statusCadastro: "ATIVO",
        statusGestor: "APROVADO",
      },
    });

    await prisma.familiaAter.update({
      where: { id: familia.id },
      data: {
        dataCadastro: new Date("2025-03-01"),
        aguaParaConsumo: true,
        aguaConsumoTratada: opts.aguaTratada,
        aguaParaProducao: true,
        esgotoTratado: opts.esgoto,
        possuiInternet: opts.internet,
        possuiCelular: true,
        possuiRadio: false,
        possuiTelevisao: true,
        lgpdConsentimento: true,
        lgpdDataConsentimento: new Date("2025-03-01"),
      },
    });

    const inseg = opts.insegurancaAlimentar;
    await prisma.indicadoresUfpa.upsert({
      where: { familiaId: familia.id },
      update: {},
      create: {
        familiaId: familia.id,
        dataReferencia: new Date("2025-03-01"),
        alimentacaoVariadaComprometida: inseg,
        comidaAcabouSemCondicao: inseg,
        deixouRefeicaoSemCondicao: false,
        comeuMenosSemCondicao: inseg,
        qtdVezesComeuMenos: inseg ? 3 : 0,
        sentiuFomeENaoComeu: false,
        documentacaoPessoalCompleta: true,
        cadastradoCadUnico: opts.cadUnico,
        acessaPoliticasSociais: true,
        participaGrupoComunitario: true,
        participaAssociacao: false,
        participaCooperativa: false,
        participaGrupoInformalProdutivo: false,
        participaGrupoInformalSocial: false,
        acessaPoliticasProdutivas: opts.politicasProdutivas,
        motivoNaoAcessaPoliticasFaltaInfo: !opts.politicasProdutivas,
        motivoNaoAcessaPoliticasDificilAcesso: false,
        motivoNaoAcessaPoliticasSemInteresse: false,
        acessouPronaf: opts.pronaf,
        acessouPaa: false,
        acessouPnae: false,
        acessouPgpmBio: false,
        linhasPronaf: opts.linhasPronaf && opts.linhasPronaf.length > 0
          ? opts.linhasPronaf.reduce<Record<string, boolean>>((acc, l) => { acc[l] = true; return acc; }, {})
          : Prisma.JsonNull,
        valorBrutoProducaoUltimos12Meses: opts.vbp !== null ? new Prisma.Decimal(opts.vbp) : null,
        canalFeira: opts.canais.feira ?? false,
        canalMercadoLocal: opts.canais.mercadoLocal ?? false,
        canalVendaDiretaConsumidor: opts.canais.vendaDireta ?? false,
        canalPaa: opts.canais.paa ?? false,
        canalPnae: opts.canais.pnae ?? false,
        canalTrocaProdutoServico: false,
        canalVendaPropriedade: false,
        canalAtravessador: false,
        canalCooperativaEntreposto: false,
        possuiPraticasSustentaveis: true,
        praticaProtecaoNascentes: true,
        praticaPreservacaoApps: true,
        praticaIntegracaoAtividades: false,
        praticaDescarteCorretoEmbalagens: false,
        praticaControleQueimadas: false,
        praticaAdubacaoVerde: false,
        praticaRecuperacaoPastagens: false,
        praticaCoberturaSolo: false,
        praticaManejoIntegradoPragas: false,
        praticaCordoesVegetacao: false,
        praticaRotacaoCulturas: false,
        praticaPlantioDireto: false,
        praticaPousio: false,
        praticaManejoFlorestal: false,
        praticaRecomposicaoFlorestal: false,
        motivoSemPraticaFinanceiro: false,
        motivoSemPraticaFaltaInformacao: false,
        motivoSemPraticaTecnologico: false,
        motivoSemPraticaFaltaInteresse: false,
      },
    });

    console.log("  OK UFPA: " + opts.nome + " (" + opts.doc + ")");
    return familia;
  }

  await criarUfpa({
    doc: "TEST-001-VERDE",
    nome: "Familia Verde - Teste",
    aguaTratada: true, esgoto: true, internet: true,
    insegurancaAlimentar: false, cadUnico: true,
    politicasProdutivas: false, pronaf: false, linhasPronaf: [], vbp: null,
    canais: { mercadoLocal: true },
    codigoSGA: "SGA-TEST-001", dapCaf: "DAP-TEST-001",
  });

  await criarUfpa({
    doc: "TEST-002-ALERTA",
    nome: "Familia Alerta - Teste",
    aguaTratada: false, esgoto: false, internet: false,
    insegurancaAlimentar: true, cadUnico: false,
    politicasProdutivas: false, pronaf: false, linhasPronaf: [], vbp: null,
    canais: {},
    codigoSGA: undefined, dapCaf: undefined,
  });

  await criarUfpa({
    doc: "TEST-003-PRODUTIVA",
    nome: "Familia Produtiva - Teste",
    aguaTratada: true, esgoto: false, internet: true,
    insegurancaAlimentar: false, cadUnico: true,
    politicasProdutivas: true, pronaf: true,
    linhasPronaf: ["Pronaf Custeio", "Pronaf Mais Alimentos"],
    vbp: 18500,
    canais: { feira: true, vendaDireta: true, pnae: true },
    codigoSGA: "SGA-TEST-003", dapCaf: "DAP-TEST-003",
  });

  console.log("");
  console.log("Valores esperados no dashboard (apenas as 3 UFPAs de teste):");
  console.log("  agua tratada (sim)  : 2 (Verde + Produtiva)");
  console.log("  esgoto tratado (sim): 1 (Verde)");
  console.log("  inseg. alimentar    : 1 (Alerta)");
  console.log("  sem CadUnico        : 1 (Alerta)");
  console.log("  pol. produtivas     : 1 (Produtiva)");
  console.log("  PRONAF              : 1 (Produtiva)");
  console.log("  VBP informado       : 1 | VBP total >= R$ 18.500");
  console.log("  Prioritarias        : Alerta (score alto), Verde (sem SGA)");
  console.log("");
  console.log("Limpeza: DELETE FROM familias_ater WHERE nome_familia LIKE '%-Teste'");
  console.log("Seed de metricas finalizado!");
}

main()
  .catch(function(e) { console.error("Erro no seed:", e); process.exit(1); })
  .finally(async function() { await prisma.$disconnect(); });
