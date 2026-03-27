import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando o seed do banco de dados SIGGA v5...')

  // ============================================================================
  // 1. CRIANDO USUÁRIO ADMIN (Sem vínculo com Cadastro Único)
  // ============================================================================
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@sigga.org' },
    update: {},
    create: {
      email: 'admin@sigga.org',
      name: 'Administrador Geral',
      role: 'ADMIN',
    },
  })
  console.log(`✅ User ADMIN criado: ${adminUser.name}`)

  // ============================================================================
  // 2. CADASTRO ÚNICO: COORDENADOR (Pessoa Física)
  // ============================================================================
  const coordCadastro = await prisma.cadastroUnico.upsert({
    where: { documento: '11122233344' },
    update: {},
    create: {
      tipoPessoa: 'PF',
      nome: 'Carlos Coordenador da Silva',
      documento: '11122233344',
      emailContato: 'carlos@sigga.org',
      telefone: '92999999999',
    },
  })
  console.log(`✅ Cadastro PF (Coordenador) criado: ${coordCadastro.nome}`)

  // 2.1 VINCULANDO USUÁRIO COORDENADOR AO CADASTRO PF
  const coordUser = await prisma.user.upsert({
    where: { email: 'carlos@sigga.org' },
    update: {},
    create: {
      email: 'carlos@sigga.org',
      name: coordCadastro.nome,
      role: 'COORDENADOR_PROJETO',
      cadastroId: coordCadastro.id,
    },
  })
  console.log(`✅ User COORDENADOR vinculado criado: ${coordUser.email}`)

  // ============================================================================
  // 3. CADASTRO ÚNICO: FORNECEDOR (Pessoa Jurídica)
  // ============================================================================
  const fornecedorCadastro = await prisma.cadastroUnico.upsert({
    where: { documento: '12345678000199' },
    update: {},
    create: {
      tipoPessoa: 'PJ',
      nome: 'AgroMáquinas e Ferramentas Ltda',
      nomeFantasia: 'AgroTudo',
      documento: '12345678000199',
      emailContato: 'vendas@agrotudo.com',
      telefone: '9233334444',
    },
  })
  console.log(`✅ Cadastro PJ (Fornecedor) criado: ${fornecedorCadastro.nomeFantasia}`)

  // ============================================================================
  // 4. CRIANDO PROJETO
  // ============================================================================
  const projeto = await prisma.projeto.upsert({
    where: { codigo: 'PROJ-QP-2026' },
    update: {},
    create: {
      nome: 'Quintais Produtivos',
      codigo: 'PROJ-QP-2026',
      descricao: 'Projeto de fomento à agricultura familiar e sistemas agroflorestais sustentáveis.',
      dataInicio: new Date('2026-01-01T00:00:00Z'),
      dataFim: new Date('2027-12-31T00:00:00Z'),
      status: 'ATIVO',
    },
  })
  console.log(`✅ Projeto criado: ${projeto.nome}`)

  // 4.1 VINCULANDO O COORDENADOR AO PROJETO (RBAC - Tabela Intermediária)
  await prisma.acessoProjeto.upsert({
    where: {
      userId_projetoId: {
        userId: coordUser.id,
        projetoId: projeto.id,
      },
    },
    update: {},
    create: {
      userId: coordUser.id,
      projetoId: projeto.id,
    },
  })
  console.log(`✅ Coordenador ${coordUser.name} recebeu acesso ao projeto ${projeto.codigo}`)

  // ============================================================================
  // 5. RECURSOS HUMANOS: COLABORADOR E ALOCAÇÃO
  // ============================================================================
  
  // 5.1 Criar o Cadastro Único do Colaborador
  const colabCadastro = await prisma.cadastroUnico.upsert({
    where: { documento: '99988877766' },
    update: {},
    create: {
      tipoPessoa: 'PF',
      nome: 'Mariana Souza Agrônoma',
      documento: '99988877766',
      emailContato: 'mariana@sigga.org',
    },
  })

  // 5.2 Criar o Colaborador
  const colaborador = await prisma.colaborador.upsert({
    where: { cadastroId: colabCadastro.id },
    update: {},
    create: {
      cargo: 'Engenheira Agrônoma',
      dataAdmissao: new Date('2026-02-01T00:00:00Z'),
      salarioBase: new Prisma.Decimal(5500.00),
      cadastroId: colabCadastro.id,
    },
  })
  console.log(`✅ Colaborador criado: ${colabCadastro.nome}`)

  // 5.3 Alocar o colaborador no projeto Quintais Produtivos (50%)
  const alocacaoExistente = await prisma.alocacaoProjeto.findFirst({
    where: { colaboradorId: colaborador.id, projetoId: projeto.id },
  })

  if (!alocacaoExistente) {
    await prisma.alocacaoProjeto.create({
      data: {
        colaboradorId: colaborador.id,
        projetoId: projeto.id,
        porcentagem: new Prisma.Decimal(50.00),
        dataInicio: new Date('2026-02-01T00:00:00Z'),
      },
    })
    console.log(`✅ Colaborador alocado em 50% no projeto ${projeto.codigo}`)
  }

  // ============================================================================
  // 6. FINANCEIRO: BORDERÔ DE DESPESA
  // ============================================================================
  const borderoExistente = await prisma.bordero.findFirst({
    where: { projetoId: projeto.id, favorecidoId: fornecedorCadastro.id },
  })

  if (!borderoExistente) {
    await prisma.bordero.create({
      data: {
        descricao: 'Compra de kits de ferramentas agrícolas, enxadas e adubo.',
        valorTotal: new Prisma.Decimal(12450.75),
        dataVencimento: new Date('2026-04-15T00:00:00Z'),
        status: 'PENDENTE',
        projetoId: projeto.id,
        favorecidoId: fornecedorCadastro.id, 
      },
    })
    console.log(`✅ Borderô criado para o fornecedor ${fornecedorCadastro.nomeFantasia}`)
  }

  console.log('🎉 Seed finalizado com sucesso!')
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })