# Instruções para Agentes IA (Codex, Gemini, Cursor, etc)

**ATENÇÃO**: Antes de realizar qualquer modificação em:
- Arquitetura de Deploy (Vercel)
- Banco de Dados (Supabase / Prisma)
- Schemas do Prisma
- Layout e Estrutura Global
- Scripts Operacionais / Seeds

Você **DEVE OBRIGATORIAMENTE** ler os seguintes arquivos para entender o contexto do projeto:
- `docs/ia/README.md`
- `docs/ia/mudancas.md`
- `docs/ia/guia_de_arquitetura.md`
- `docs/relatorio_deploy.md`
- Qualquer ADR relevante na pasta `docs/adr/`

**REGRA DE OURO DA SEGURANÇA:**
Nunca crie, comite ou registre scripts que contenham senhas em texto claro, hashes, `DATABASE_URL` ou segredos. Credenciais só devem ser acessadas ou inseridas via Variáveis de Ambiente locais (`.env`) ou Painel da Vercel.

**APÓS QUALQUER MUDANÇA RELEVANTE:**
1. Registre o que foi feito no topo de `docs/ia/mudancas.md`.
2. Se houve mudança arquitetural, crie um novo documento ADR em `docs/adr/` e lincá-lo no registro de mudanças.
