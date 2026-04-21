import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando o seed do banco de dados (Modelo Beto)...')

  // 1. Cria o Cadastro Único do Administrador
  const adminCadastro = await prisma.pessoa.upsert({
    where: { documento: '00000000000' },
    update: {},
    create: {
      tipo: 'PF',
      documento: '00000000000',
      nome: 'Ademar Vasconcelos',
      email: 'admin@sigga.org',
    },
  })

  // 2. Cria o Usuário com o novo perfil ADMINISTRADOR_DIRETOR
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@sigga.org' },
    update: {},
    create: {
      email: 'admin@sigga.org',
      name: 'Ademar Vasconcelos',
      role: 'ADMINISTRADOR_DIRETOR',
      cadastroId: adminCadastro.id,
    },
  })
  console.log(`✅ User Admin criado: ${adminUser.name}`)

  // 3. Cria um Projeto Base (Centro de Custo 1084 da Planilha)
  const projeto = await prisma.projeto.upsert({
    where: { centroCusto: '1084' },
    update: {},
    create: {
      centroCusto: '1084',
      titulo: 'Rede de Quintais Agroecologicos e Produtivos Amazônicos',
      status: 'ATIVO',
      valorTotal: new Prisma.Decimal(3916368.01),
      vigenciaInicial: new Date('2024-01-01T00:00:00Z'),
    }
  })
  console.log(`✅ Projeto Base criado: C. Custo ${projeto.centroCusto}`)

  console.log('🎉 Seed finalizado com sucesso!')
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })