import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  try {
    await prisma.$executeRawUnsafe('ALTER TABLE familias_ater ADD COLUMN projeto text;')
    console.log('Column added')
  } catch (e) {
    console.log('Error adding column', e)
  }
}
main().finally(() => prisma.$disconnect())
