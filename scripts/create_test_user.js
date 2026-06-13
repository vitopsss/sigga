
const { PrismaClient } = require('@prisma/client');
const { scryptSync, randomBytes } = require('node:crypto');
const prisma = new PrismaClient();

function hashPassword(password) {
  const salt = randomBytes(16).toString("base64url");
  const hash = scryptSync(password, salt, 64).toString("base64url");
  return `scrypt$${salt}$${hash}`;
}

async function main() {
  const email = process.env.TEST_USER_EMAIL || 'test@sigga.org';
  const password = process.env.TEST_USER_PASSWORD;
  
  if (!password) {
    throw new Error("SEGURANÇA: A variável de ambiente TEST_USER_PASSWORD é obrigatória. Não utilize senhas hardcoded.");
  }
  
  const passwordHash = hashPassword(password);

  const persona = await prisma.cadastroUnico.create({
    data: {
      tipo: 'PF',
      documento: '11111111111',
      nome: 'Usuário de Teste',
      email: email,
    }
  });

  const user = await prisma.user.upsert({
    where: { email },
    update: { passwordHash, status: 'ATIVO', role: 'ADMINISTRADOR_DIRETOR', cadastroId: persona.id },
    create: {
      email,
      name: 'Usuário de Teste',
      role: 'ADMINISTRADOR_DIRETOR',
      status: 'ATIVO',
      passwordHash,
      cadastroId: persona.id
    }
  });

  console.log(`✅ Usuário de teste criado: ${user.email} / ${password}`);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
