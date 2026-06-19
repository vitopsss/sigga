import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  try {
    await prisma.$executeRawUnsafe(`SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE pid <> pg_backend_pid() AND datname = current_database();`)
    console.log('Connections terminated to clear PgBouncer cache')
  } catch (e) {
    console.log('Error', e.message)
  }
}
main().finally(() => prisma.$disconnect())
