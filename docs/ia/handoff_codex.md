# Handoff para Codex / Cursor (19/06/2026)

Este documento resume o estado atual do sistema, as alterações mais recentes e o contexto de desenvolvimento do SIGGATER, para que a próxima IA consiga assumir o projeto sem perder tempo de contexto.

## Estado Atual da Aplicação
O SIGGATER (Sistema de Gestão de ATER Sociobio) está rodando com **Next.js 15 (Turbopack)**, **Prisma** e **Supabase (PostgreSQL)**, sendo hospedado na Vercel. 
Atualmente, estamos focados no Cadastro e Diagnóstico de UFPAs (Unidades Familiares de Produção Agrícola), onde recentemente fundimos abas em prol de uma usabilidade melhor solicitada pelos clientes (Orlanda/Anater).

## Alterações Recentes (Junho 2026)

### 1. Unificação e Reestruturação de Formulários (UFPAs e Indicadores)
- **O que foi feito:** O formulário principal (`UfpaForm`) agora abraça o "Cadastro Inicial" e os campos gerais de "Diagnóstico" na mesma tela (dados da família, LGPD, identificação).
- **Indicadores:** Foi criada uma aba à parte exclusiva (`/familias/[id]/indicadores`) dedicada à tabulação de Dados Sociais, Ambientais e Econômicos (as regras de preenchimento do formulário longo).

### 2. Tratamento de Objetos Complexos (Decimal e NEXT_REDIRECT)
- **Crash de Serialização (Prisma `Decimal`):** O Next.js Client Component estava crashando ao receber tipos `Decimal` originários do Prisma. 
  - **Solução:** Na action `salvarIndicadoresUfpa`, garantimos que números como `valorBrutoProducaoUltimos12Meses` são parseados. E antes de renderizar as Views, fazemos o cast de Decimal para Number nativo.
- **Falso Positivo de Erro (Next.js):** Ao usar `redirect()` dentro da server action engatada no `onSubmit`, o React disparava o bloco `catch (e)`. 
  - **Solução:** Adicionamos a checagem `if (isRedirectError(e)) { throw e; }` para que redirecionamentos ocorram sem disparar alertas vermelhos na tela.

### 3. Listas Dinâmicas vs. Campos Fixos ("Travados")
- Para listas como Atividades Coletivas, Recursos Disponíveis e Políticas Públicas Federais: as opções seguem uma modelagem dinâmica (arrays) gerenciada com `useFieldArray`.
- **Especial "Patrimônios" e "Áreas":** O cliente enviou um documento exigindo itens fixos (Ex: Bovinos, Ovinos, Máquinas Agrícolas, Pastagens).
  - **Solução no UI:** O formulário agora injeta por default um array com 23 itens imutáveis (com o label "read-only"). 
  - O Prisma continua salvando em seu Schema de `Json` original (`{ descricao, quantidade, unidade }[]`), permitindo que a estrutura não precise de migração de banco, mas o frontend trava a experiência para o técnico na ponta preencher exatamente a cartilha.
  - Para as Linhas do PRONAF: Transformado de input livre em checkboxes, que no submit são encodados num objeto JSON (`Record<string, boolean>`).

### 4. SearchParams Duplicados
- O Next.js 15 gera arrays de parâmetros quando há chaves repetidas na URL (ex: `?from=abc&from=xyz`). Isso quebrava funções `.trim()`. 
- **Solução:** Criamos o utilitário `lib/search-params.ts` que normaliza o input (pega sempre o primeiro valor ou `null`). Todas as páginas já foram refatoradas para usá-lo.

## Banco de Dados (Supabase - Plano Nano)
- **ATENÇÃO:** O Supabase do projeto está no plano Nano que tem limite rígido de conexões concorrentes.
- Já experimentamos erros de pool (`EMAXCONNSESSION`) quando rodam muitas instâncias ou quando não rodamos o `npx prisma generate` corretamente no deploy. A Vercel já foi parametrizada (`postinstall`) para rodar os comandos do Prisma em cache. **Evite dev contra a base de produção.**

## Próximos Passos
O usuário fará a demonstração destas telas (através do PDF já gerado na pasta `docs/acariquara/reunioes`) para os clientes (Orlanda). O deploy já está subido na main.
Qualquer dúvida da arquitetura global, leia a documentação `docs/ia/guia_de_arquitetura.md` antes de alterar schemas.
