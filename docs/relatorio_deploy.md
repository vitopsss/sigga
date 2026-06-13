# Relatório Técnico de Deploy e Homologação - SIGGATER
**Data:** 13/06/2026

Este documento resume as atividades realizadas para estabilizar a aplicação em produção (Vercel) e banco de dados (Supabase) visando a liberação do ambiente de testes para a equipe.

## 1. Infraestrutura e Deploy (Vercel)
- **Correção do Prisma Client:** O build do Next.js na Vercel estava falhando porque o Vercel realiza cache do `node_modules` e não gerava o binário do Prisma. 
  - **Solução:** Adicionado `"postinstall": "prisma generate"` no `package.json`.
- **Aviso de Middleware (Next.js 16.2):** O Next.js acusou aviso de depreciação do arquivo `middleware.ts`. Uma tentativa de renomear para `proxy.ts` causou erro fatal na renderização (`Proxy is missing expected function export name`).
  - **Solução:** O arquivo foi revertido para `middleware.ts` e o aviso de build foi tolerado, garantindo o funcionamento imediato do cache de rotas.

## 2. Banco de Dados (Supabase)
- **Limite de Conexões:** O banco de dados no plano gratuito do Supabase (Nano) tem um limite rígido de **15 conexões no Pooler**.
  - **Desafio:** Servidores locais rodando `npm run dev` e os workers de build do Next.js na Vercel competiam pelas portas do banco, causando o erro `FATAL: (EMAXCONNSESSION) max clients reached`.
  - **Solução:** Processos fantasmas de Node.js foram mortos na máquina do desenvolvedor e determinamos o método de "Aguardar o timeout" ou "Restart Database" após novos deploys na Vercel para execução de rotinas manuais.
- **Sincronização de Schema:** O Dashboard da Vercel retornou o erro `Ocorreu um erro inesperado` pois o Client tentou consultar os novos indicadores (`mulheresDiretoria`, `praticasAmbientais`, etc.) e eles não existiam fisicamente na tabela.
  - **Solução:** Executado `npx prisma migrate deploy` conectando-se remotamente ao Supabase de produção para refletir o `.prisma` mais atualizado na nuvem.

## 3. Scripts de Seed e Autenticação
- Os scripts locais `create_test_user.js` e `seed-metricas-teste.ts` foram executados na base de produção para popular o Dashboard.
- Criadas as contas de acesso restrito (scrypt hash gerado manualmente):
  - `joao@sigga.org` (Admin Pessoal)
  - `test@sigga.org` (Equipe Compartilhada)

## 4. Frontend e Layout (Tailwind)
- **Correção da Sidebar Fluida:** Ao recolher o menu lateral, o container `<main>` continuava com margem fixa (`ml-64`), impedindo a expansão da tela.
  - **Solução:** Utilizada a diretiva `peer` do Tailwind. A `<aside>` recebeu o atributo `data-collapsed` e o `<main>` recebeu classes dinâmicas condicionais: `transition-[margin] duration-300 ml-64 peer-data-[collapsed=true]:ml-20`. O layout agora se expande fluidamente acompanhando a animação da barra lateral.

## Próximos Passos Sugeridos
- Criar a interface de troca de senhas pelo próprio usuário.
- Analisar os feedbacks da equipe após o teste manual.
- Continuar o desenvolvimento utilizando ambiente isolado (local) para não sobrecarregar as sessões de DB da Vercel durante homologação.
