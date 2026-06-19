import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const cols = [
    'projeto text',
    'tecnico text',
    'dataCadastro timestamp',
    'documentacaoPessoalQuais text',
    'cadUnicoQuais text',
    'entidadeExecutoraNome text',
    'entidadeExecutoraCnpj text',
    'unidadeServicos text',
    'numeroInstrumento text',
    'agenteAterNome1 text',
    'agenteAterCpf1 text',
    'agenteAterNome2 text',
    'agenteAterCpf2 text',
    'agenteAterNome3 text',
    'agenteAterCpf3 text',
    'localUf text',
    'localMunicipio text',
    'localOrganizacaoColetiva text',
    'praticasSustentaveisQuais text'
  ]
  for (const col of cols) {
    try {
      await prisma.$executeRawUnsafe(`ALTER TABLE indicadores_ufpa ADD COLUMN IF NOT EXISTS "${col.split(' ')[0]}" ${col.split(' ')[1]};`)
      console.log(`Added ${col} to indicadores_ufpa`)
    } catch (e) {
      console.log(`Error adding ${col}`, e.message)
    }
  }
}
main().finally(() => prisma.$disconnect())
