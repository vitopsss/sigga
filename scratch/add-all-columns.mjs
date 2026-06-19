import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const columns = [
    'dataCadastro timestamp',
    'tecnico text',
    'possuiRadio boolean',
    'possuiTelevisao boolean',
    'possuiCelular boolean',
    'possuiInternet boolean',
    'usaRedesSociais boolean',
    'outroMeioComunicacao text',
    'possuiOutroMeioComunicacao boolean',
    'aguaParaConsumo boolean',
    'aguaConsumoTratada boolean',
    'aguaParaProducao boolean',
    'captacaoAguaChuva boolean',
    'esgotoTratado boolean',
    'fontesProtegidas boolean',
    'recursosDisponiveis jsonb',
    'atividadesColetivas jsonb',
    'politicasPublicas jsonb',
    'acoesPotenciaisProdutivo jsonb',
    'acoesPotenciaisSocial jsonb',
    'acoesPotenciaisAmbiental jsonb',
    'limitacoesProdutivo jsonb',
    'limitacoesSocial jsonb',
    'limitacoesAmbiental jsonb',
    'outrasAcoesPotenciais text',
    'outrasLimitacoes text',
    'lgpdConsentimento boolean',
    'lgpdDataConsentimento timestamp',
    'representanteNome text',
    'representanteCpf text',
    'referenciaAnexoLgpd text',
    'anexoLgpdKey text',
    'anexoLgpdUrl text',
    'observacoes text',
    'patrimonios jsonb',
    'atividadesProdutivas jsonb'
  ]

  for (const col of columns) {
    try {
      await prisma.$executeRawUnsafe(`ALTER TABLE familias_ater ADD COLUMN IF NOT EXISTS "${col.split(' ')[0]}" ${col.split(' ')[1]};`)
      console.log(`Added ${col}`)
    } catch (e) {
      console.log(`Error adding ${col}`, e.message)
    }
  }
}
main().finally(() => prisma.$disconnect())
