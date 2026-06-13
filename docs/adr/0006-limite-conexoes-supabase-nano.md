# 6. Estratégia de Conexões Supabase (Plano Nano) e Deploys na Vercel

Data: 13 de junho de 2026

## Status
Aceito

## Contexto
O banco de dados de produção está hospedado no Supabase, no plano gratuito (Nano). Esse plano possui um limite de Pooler estrito de 15 conexões simultâneas. Durante o deploy do Next.js na Vercel, o processo de "Build" executa múltiplos workers para pré-renderizar as páginas estáticas, o que abre múltiplas conexões com o Prisma e facilmente satura esse limite de 15 conexões (`FATAL: EMAXCONNSESSION max clients reached`).

Devido a essa limitação, qualquer tentativa simultânea de acessar o site ou rodar scripts locais (`npm run dev` ou rotinas de `seed`) resultará em erros 500 ou indisponibilidade temporária enquanto o Vercel segura as portas do banco.

## Decisão
Decidimos **não** realizar upgrade imediato para um plano pago do Supabase para o ambiente atual de homologação (até 10 usuários simultâneos).
Em vez disso, adotamos as seguintes políticas operacionais:
1. **Janela de Manutenção de Deploy**: Sempre que um código novo for "pushado" para a `main`, aguarda-se o fim do build na Vercel + 2 a 3 minutos para que os workers liberem totalmente as conexões do pooler antes de testar a plataforma.
2. **Ambiente Local**: Scripts de migração (`prisma migrate deploy`) ou seeds pesados devem ser executados apenas com os servidores locais (`npm run dev`) desligados na máquina do desenvolvedor, para não competir pelas conexões com a Vercel.
3. **Emergency Reset**: Caso as conexões travem permanentemente devido a um script zumbi, a recuperação é feita via botão `Restart Database` no painel do Supabase.

## Consequências
- Economia de custos durante a fase de validação e homologação.
- Necessidade de disciplina ao realizar deploys: deploys não podem ser feitos indiscriminadamente enquanto usuários ativos estiverem operando o sistema, pois o site pode cair temporariamente para os usuários logados.
- Scripts de desenvolvimento devem ser interrompidos antes de rodar atualizações de infraestrutura.
