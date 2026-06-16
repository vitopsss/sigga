# Mudancas registradas por IAs

## 2026-06-16 - Ajustes no Logout e Next.js 15 searchParams

Resumo:
- Next.js 15 `searchParams`: corrigido erro de runtime "A tela falhou durante o carregamento" que ocorria ao navegar na tabela e apertar o botão "Voltar". O erro ocorria porque múltiplos parâmetros iguais na URL geravam um Array, quebrando a chamada do método `.trim()`. Todos os destructurings de páginas do SIGGATER foram ajustados para forçar tipo `string`.
- Logout: Alterado `/logout/route.ts` (Route Handler) para `/logout/page.tsx` (Server Component Page) e adicionado `force-dynamic` para garantir que o Next.js não faça cache estático da exclusão de cookies durante o build.

## 2026-06-13 - Deploy e homologacao SIGGATER

Fonte principal: `docs/relatorio_deploy.md`.
ADR gerada: `docs/adr/0006-limite-conexoes-supabase-nano.md`.

Resumo:
- Vercel: adicionado `postinstall` com `prisma generate` para evitar falha do Prisma Client em build com cache de `node_modules`.
- Next.js: tentativa de `proxy.ts` revertida para `middleware.ts` por erro fatal de export esperado; aviso de deprecacao tolerado temporariamente.
- Supabase: limite do plano Nano observado como 15 conexoes no Pooler; processos locais e builds da Vercel podem competir e causar `FATAL: (EMAXCONNSESSION) max clients reached`.
- Banco: erro 500/erro inesperado no dashboard foi causado por schema fisico desatualizado; corrigido com `npx prisma migrate deploy` contra producao.
- Seed/autenticacao: executados `create_test_user.js` e `seed-metricas-teste.ts`; criadas contas restritas sem registrar senha neste arquivo.
- Layout: sidebar recolhida passou a expandir o `<main>` usando `peer`, `data-collapsed` e margem dinamica.

Pendencias:
- Criar interface de troca de senha pelo usuario.
- Coletar feedbacks da equipe no teste manual.
- Evitar desenvolvimento direto contra producao para nao saturar sessoes do Supabase/Vercel.
