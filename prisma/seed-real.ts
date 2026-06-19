import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando Seed de Dados Reais...");

  // Limpar tabelas
  console.log("Limpando banco de dados...");
  await prisma.indicadoresUfpa.deleteMany();
  await prisma.atendimento.deleteMany();
  await prisma.familiaAter.deleteMany();
  // Não deletar CadastroUnico inteiro para não quebrar técnicos/gestores
  await prisma.cadastroUnico.deleteMany({ where: { origemCadastro: "SISTEMA" } });
  
  // Organizações Coletivas só podem ser deletadas se não tiverem UFPAs de outros origens
  try {
    await prisma.organizacaoColetiva.deleteMany();
  } catch (e) {
    console.log("Aviso: não foi possível apagar todas as organizações. (Constraint)");
  }

  // 1. Organizações Coletivas
  console.log("Criando Organizações...");
  const orgsData = [
    { id: "org-1", denominacao: "Associação Agroextrativista de Alvarães", municipio: "Alvarães", uf: "AM", praticasAmbientais: true, politicasPublicas: true, representacaoPolitica: true, mulheresDiretoria: true, jovensDiretoria: false },
    { id: "org-2", denominacao: "Cooperativa Mista da Flona de Tefé", municipio: "Tefé", uf: "AM", praticasAmbientais: true, politicasPublicas: false, representacaoPolitica: false, mulheresDiretoria: false, jovensDiretoria: true },
    { id: "org-3", denominacao: "Sindicato dos Produtores de Uarini", municipio: "Uarini", uf: "AM", praticasAmbientais: false, politicasPublicas: true, representacaoPolitica: true, mulheresDiretoria: true, jovensDiretoria: true },
  ];

  const orgs = [];
  for (const o of orgsData) {
    const org = await prisma.organizacaoColetiva.create({
      data: {
        id: o.id,
        denominacao: o.denominacao,
        municipio: o.municipio,
        uf: o.uf,
        indicadores: {
          create: {
            possuiPraticasAmbientais: o.praticasAmbientais,
            acessaPoliticasPublicas: o.politicasPublicas,
            filiadaOrganizacao: o.representacaoPolitica,
            possuiMulheresDiretoriaConselho: o.mulheresDiretoria,
            possuiJovensDiretoriaConselho: o.jovensDiretoria,
            usaIdentidadeComercial: true,
            dataReferencia: new Date("2026-02-10"),
          }
        }
      }
    });
    orgs.push(org);
  }

  // 2. Famílias (UFPAs)
  console.log("Criando 15 UFPAs com dados realistas...");
  const nomes = [
    "José Ribamar da Silva", "Maria de Fátima Alves", "Antônio Carlos Souza", "Raimunda Nonata Mendes",
    "Francisco das Chagas", "Luiza Helena Ferreira", "Sebastião Pereira", "Ana Lúcia Gomes",
    "João Pedro de Moraes", "Manoel Rodrigues", "Francisca das Neves", "Raimundo Nonato Silva",
    "Benedito Soares", "Antônia Maria Lima", "Pedro Henrique Costa"
  ];
  const comunidades = ["Comunidade São João", "Comunidade Bom Jesus", "Vila de Pescadores", "Assentamento Rural"];

  const familias = [];
  for (let i = 0; i < 15; i++) {
    const doc = `000000000${i.toString().padStart(2, '0')}`;
    const cadastro = await prisma.cadastroUnico.create({
      data: { documento: doc, nome: nomes[i], tipo: "PF", origemCadastro: "SISTEMA" }
    });

    const orgIndex = i % 3;
    const isAlerta = i % 5 === 0; // 3 famílias com alertas graves
    const isExcelente = i % 4 === 0;

    const ufpa = await prisma.familiaAter.create({
      data: {
        nomeFamilia: nomes[i],
        municipio: orgs[orgIndex].municipio,
        comunidade: comunidades[i % comunidades.length],
        cadastroId: cadastro.id,
        organizacaoColetivaId: orgs[orgIndex].id,
        codigoSGA: isAlerta ? null : `SGA-2026-${100 + i}`,
        dapCaf: isAlerta ? null : `CAF-8888${i}`,
        bioma: "Amazônia",
        statusCadastro: "ATIVO",
        statusGestor: "APROVADO",
        dataCadastro: new Date("2026-01-10"),
        
        // Diagnóstico Básico
        aguaParaConsumo: true,
        aguaConsumoTratada: isAlerta ? false : true,
        aguaParaProducao: isExcelente ? true : false,
        esgotoTratado: isAlerta ? false : (i % 2 === 0),
        possuiInternet: !isAlerta,
        possuiCelular: true,
        possuiRadio: true,
        possuiTelevisao: (i % 2 === 0),
        lgpdConsentimento: true,
        lgpdDataConsentimento: new Date("2026-01-10"),
      }
    });

    // 3. Indicadores (Dados de questionário completo)
    await prisma.indicadoresUfpa.create({
      data: {
        familiaId: ufpa.id,
        dataReferencia: new Date("2026-02-15"),
        
        // Eixo Social
        alimentacaoVariadaComprometida: isAlerta,
        comidaAcabouSemCondicao: isAlerta,
        comeuMenosSemCondicao: isAlerta,
        qtdVezesComeuMenos: isAlerta ? 2 : 0,
        deixouRefeicaoSemCondicao: false,
        sentiuFomeENaoComeu: false,
        
        documentacaoPessoalCompleta: !isAlerta,
        cadastradoCadUnico: !isAlerta,
        acessaPoliticasSociais: isExcelente,
        participaGrupoComunitario: true,

        // Eixo Produtivo
        acessaPoliticasProdutivas: isExcelente,
        motivoNaoAcessaPoliticasFaltaInfo: !isExcelente,
        acessouPronaf: isExcelente,
        valorBrutoProducaoUltimos12Meses: isExcelente ? new Prisma.Decimal(25000 + i * 1000) : new Prisma.Decimal(5000 + i * 500),
        
        canalFeira: true,
        canalMercadoLocal: true,
        canalVendaDiretaConsumidor: true,
        canalPaa: isExcelente,
        canalPnae: isExcelente,

        // Eixo Ambiental
        possuiPraticasSustentaveis: !isAlerta,
        praticaProtecaoNascentes: isExcelente,
        praticaPreservacaoApps: !isAlerta,
        praticaIntegracaoAtividades: isExcelente,
        praticaDescarteCorretoEmbalagens: true,
      }
    });
    familias.push(ufpa);
  }

  // 4. Atendimentos (Visitas Técnicas)
  console.log("Criando Atendimentos...");
  for (let i = 0; i < 8; i++) {
    const fam = familias[i];
    await prisma.atendimento.create({
      data: {
        familia: { connect: { id: fam.id } },
        data: new Date(`2026-03-0${i + 1}T10:00:00Z`),
        statusRelatorio: i % 4 === 0 ? "AGUARDANDO_GESTOR" : i % 5 === 0 ? "REPROVADO_GESTOR" : "APROVADO",
        tecnico: "tecnico-demo-123", // id falso pro seed
        numeroVisita: 1,
      }
    });
  }

  console.log("Seed concluído com sucesso!");
}

main()
  .catch((e) => {
    console.error("Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
