let dbUrl = process.env.DATABASE_URL || process.env.DIRECT_URL;
if (dbUrl) {
  // Replace 6543 with 5432 and remove pgbouncer=true to bypass PgBouncer
  dbUrl = dbUrl.replace(':6543', ':5432').replace('pgbouncer=true&', '');
  process.env.DATABASE_URL = dbUrl;
}

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🧹 Limpando dados antigos...')
  console.log('Usando DB:', process.env.DATABASE_URL.split('@')[1])

  try {
    await prisma.$executeRawUnsafe('DEALLOCATE ALL; DISCARD ALL;');
  } catch(e) {}

  // Apagar todas as UFPAs e cadastros (o onDelete: Cascade deve limpar tabelas filhas)
  await prisma.familiaAter.deleteMany({});
  await prisma.cadastroUnico.deleteMany({
    where: { nome: { contains: 'Responsável' } } // Limpar os de teste anteriores, se ficarem
  });

  console.log('🌱 Criando novas UFPAs com dados realistas...')

  const ufpasRealistas = [
    {
      resp: 'Raimundo Nonato da Silva',
      doc: '12345678901',
      familia: 'Família Silva (Seu Raimundo)',
      mun: 'Manacapuru',
      comunidade: 'Comunidade Nossa Sra. do Perpétuo Socorro',
      ufpa: 'Sítio Boa Esperança',
      patrimonios: ['Casa de madeira', 'Canoa a motor (rabeta)', 'Roçadeira', 'Kit de pesca'],
      atividadesProdutivas: ['Mandioca (Farinha)', 'Pesca Artesanal', 'Açaí Extrativista'],
      acoesProdutivo: ['Sistemas agroflorestais – SAF’s', 'Banco de sementes crioulas', 'Faz consorciação'],
      limitesProdutivo: ['Acesso a crédito', 'Assistência Técnica Constante'],
      acoesSocial: ['Cadastro da Agricultura Familiar - CAF', 'Documentação familiar (CPF, RG, Título de eleitor e CadÚnico)'],
      limitesSocial: ['Acesso à previdência social', 'Saúde / saneamento'],
      acoesAmbiental: ['Gestão da propriedade integrando os aspectos produtivos, ambientais, sociais, culturais e econô'],
      limitesAmbiental: ['Falta água encanada'],
      outrasAcoes: 'Construir um pequeno galinheiro para aumentar a renda.',
      outrasLimites: 'Dificuldade de escoamento no período da cheia.'
    },
    {
      resp: 'Maria de Nazaré Souza',
      doc: '09876543210',
      familia: 'Família Souza',
      mun: 'Iranduba',
      comunidade: 'Ramal do Caldeirão',
      ufpa: 'Chácara Fé em Deus',
      patrimonios: ['Casa de alvenaria', 'Motocicleta', "Bomba d'água", 'Pulverizador costal'],
      atividadesProdutivas: ['Hortaliças (Cheiro-verde, Couve)', 'Criação de Galinha Caipira', 'Fruticultura (Cupuaçu, Limão)'],
      acoesProdutivo: ['Quintal produtivo (galinha caipira e horta)', 'Faz venda direta'],
      limitesProdutivo: ['Acesso a mercado / comercialização', 'Acesso a insumos (sementes, mudas, adubos, etc)'],
      acoesSocial: ['Segurança Alimentar', 'Acesso às políticas públicas - PAA e PNAE'],
      limitesSocial: ['Acesso ao PAA e PNAE', 'Educação do campo'],
      acoesAmbiental: ['Saneamento rural', 'Adequação ambiental da propriedade - CAR'],
      limitesAmbiental: ['Dificuldade para obter licenciamento da área de plantio'],
      outrasAcoes: 'Implementar irrigação por gotejamento na horta',
      outrasLimites: 'Custo alto do adubo orgânico na região'
    },
    {
      resp: 'Francisco das Chagas Oliveira',
      doc: '45612378900',
      familia: 'Família Chagas',
      mun: 'Presidente Figueiredo',
      comunidade: 'Ramal do Urubuí',
      ufpa: 'Sítio Novo Horizonte',
      patrimonios: ['Casa mista', 'Tratorito', 'Casa de farinha comunitária', 'Motosserra'],
      atividadesProdutivas: ['Mandioca (Farinha e Tucupi)', 'Banana Pacovã', 'Criação de Suínos'],
      acoesProdutivo: ['Apoio a Comercialização', 'Produção e produtividade', 'Diversificação produtiva'],
      limitesProdutivo: ['Mão de obra', 'Acesso à terra'],
      acoesSocial: ['Cadastro Ambiental Rural - CAR', 'Cidadania de acesso às políticas de crédito e de habitação rural'],
      limitesSocial: ['Habitação rural', 'Acesso às políticas públicas (Luz para todos, água para todos, Minha Casa Minha Vida)'],
      acoesAmbiental: ['Adequação ambiental da propriedade - CAR'],
      limitesAmbiental: ['Uso de agrotóxicos'],
      outrasAcoes: 'Desejo de trabalhar com SAF para cacau e cupuaçu.',
      outrasLimites: 'Estrada do ramal é muito ruim no inverno para levar a farinha.'
    }
  ]

  for (const item of ufpasRealistas) {
    let cadastro = await prisma.cadastroUnico.findUnique({ where: { documento: item.doc } });
    if (!cadastro) {
      cadastro = await prisma.cadastroUnico.create({
        data: {
          nome: item.resp,
          documento: item.doc,
          tipo: 'PF',
        }
      });
    }

    let familia = await prisma.familiaAter.findFirst({ where: { cadastroId: cadastro.id } });
    if (!familia) {
      familia = await prisma.familiaAter.create({
        data: {
          nomeFamilia: item.familia,
          nomeResponsavel: item.resp,
          documentoResponsavel: item.doc,
          municipio: item.mun,
          comunidade: item.comunidade,
          ufpa: item.ufpa,
          projeto: 'Ater - Sociobiodiversidade',
          dataCadastro: new Date(),
          tecnico: 'João Extensionista (ID: 101)',
          cadastroId: cadastro.id,
          patrimonios: item.patrimonios,
          atividadesProdutivas: item.atividadesProdutivas,
          acoesPotenciaisProdutivo: item.acoesProdutivo,
          limitacoesProdutivo: item.limitesProdutivo,
          acoesPotenciaisSocial: item.acoesSocial,
          limitacoesSocial: item.limitesSocial,
          acoesPotenciaisAmbiental: item.acoesAmbiental,
          limitacoesAmbiental: item.limitesAmbiental,
          outrasAcoesPotenciais: item.outrasAcoes,
          outrasLimitacoes: item.outrasLimites,
          lgpdConsentimento: true,
          lgpdDataConsentimento: new Date()
        }
      });
      console.log(`✅ UFPA criada: ${familia.nomeFamilia} - ${familia.municipio}`);
    }
  }

  console.log('🎉 Dados realistas criados com sucesso!')
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
