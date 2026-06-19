# Mudancas registradas por IAs

## 2026-06-19 - Unificação de Cadastro/Diagnóstico, Tela de Indicadores e Melhorias de UI

Resumo:
- Unificada a tela de Cadastro Inicial e Diagnóstico da UFPA em um único fluxo (`UfpaForm`).
- Separada e criada a tela de Indicadores da UFPA exclusiva para o preenchimento de Dados Sociais, Ambientais e Econômicos em `app/(sigga)/ater-sociobio/familias/[id]/indicadores`.
- Implementada a lógica de "Outros" em todos os eixos de Limitações e Ações Potenciais (textos livres concatenados nas strings arrays originais).
- Implementada lógica condicional do `watch` nas Políticas Públicas do eixo Econômico (ex: linha PRONAF só aparece se marcou SIM, e foi refatorado para uma grade de checkboxes mapeada para um JSON interno).
- Padronizadas as listas dinâmicas para Patrimônio e Atividades Produtivas (dividido em colunas de quantidade, unidade e descrição) mantendo a estrutura JSON do Schema do Prisma.
- Adicionadas listas dinâmicas faltantes em `UfpaForm`: Atividades Coletivas, Recursos Disponíveis e Políticas Públicas Federais (que existiam no Prisma mas não possuíam interface).
- Corrigido "Erro ao salvar" nos indicadores de Família: (1) Conversão de objetos `Decimal` do Prisma para `Number` nativo para resolver crash do Next.js Client Components. (2) Omitida a captura de erro `NEXT_REDIRECT` no catch, que acusava falso-positivo.
- Adicionados os novos campos nas exportações para o relatório do Excel na Dashboard (`excel-export.ts`).

## 2026-06-16 - Normalizacao centralizada de searchParams repetidos

Resumo:
- Criado `lib/search-params.ts` com helpers para obter o primeiro valor de parametros repetidos e validar caminhos internos de retorno.
- Aplicado em listagens e paginas de detalhe do SIGGATER para evitar novos crashes quando a URL vier com parametros duplicados (`from`, `busca`, `pagina`, `tab`, `focus`, `q`, `familiaId`).
- O handoff `docs/ia/handoff_codex.md` foi lido; ele esta correto no diagnostico geral, mas ainda havia pontos residuais em paginas de detalhe que foram fechados nesta rodada.

## 2026-06-16 - Ajustes no Logout e Next.js 15 searchParams

Resumo:
- Next.js 15 `searchParams`: corrigido erro de runtime "A tela falhou durante o carregamento" que ocorria ao navegar na tabela e apertar o botão "Voltar". O erro ocorria porque múltiplos parâmetros iguais na URL geravam um Array, quebrando a chamada do método `.trim()`. Todos os destructurings de páginas do SIGGATER foram ajustados para forçar tipo `string`.
- Logout: A alteração de `/logout/route.ts` para `page.tsx` causou um Erro de Sistema porque o Next.js não permite deletar cookies em Server Components. O arquivo foi revertido para `/logout/route.ts` (Route Handler) com `export const dynamic = "force-dynamic"` e deleção explícita do cookie `__Host-` com `secure` e `path=/` para garantir que a Vercel limpe a sessão corretamente.

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
