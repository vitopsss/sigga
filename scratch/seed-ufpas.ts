process.env.DATABASE_URL = process.env.DIRECT_URL || process.env.DATABASE_URL;

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Criando UFPAs de teste...')

  for (let i = 1; i <= 5; i++) {
    const doc = `1112223334${i}`;
    
    // Check if exists
    let cadastro = await prisma.cadastroUnico.findUnique({ where: { documento: doc } });
    if (!cadastro) {
      cadastro = await prisma.cadastroUnico.create({
        data: {
          nome: `Responsável UFPA Teste ${i}`,
          documento: doc,
          tipo: 'PF',
        }
      });
    }

    // Check if familia exists
    let familia = await prisma.familiaAter.findFirst({ where: { cadastroId: cadastro.id } });
    if (!familia) {
      familia = await prisma.familiaAter.create({
        data: {
          nomeFamilia: `Família Teste Silva ${i}`,
          nomeResponsavel: `Responsável UFPA Teste ${i}`,
          documentoResponsavel: doc,
          municipio: i % 2 === 0 ? 'Iranduba' : 'Manacapuru',
          comunidade: `Comunidade Teste ${i}`,
          ufpa: `UFPA Sítio Teste ${i}`,
          projeto: 'Ater - Sociobiodiversidade',
          dataCadastro: new Date(),
          cadastroId: cadastro.id,
          patrimonios: ['Casa', 'Canoa'],
          atividadesProdutivas: ['SAF - Sistema Agroflorestal'],
          acoesPotenciaisProdutivo: ['Sistemas agroflorestais – SAF’s', 'Diversificação produtiva'],
          limitacoesProdutivo: ['Acesso a crédito'],
        }
      });
      console.log(`✅ UFPA criada: ${familia.nomeFamilia}`);
    } else {
      console.log(`⚠️ UFPA já existe: ${familia.nomeFamilia}`);
    }
  }

  console.log('🎉 Seed de UFPAs finalizado com sucesso!')
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
