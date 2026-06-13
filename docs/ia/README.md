# Documentacao compartilhada entre IAs

Esta pasta e o ponto comum para registrar mudancas feitas no projeto por Codex, OpenCode, Gemini CLI ou outra IA.

## Regra de uso

1. Antes de mexer em deploy, banco, schema, layout global ou scripts operacionais, leia esta pasta e os documentos citados aqui.
2. Depois de uma mudanca relevante, registre em `mudancas.md`:
   - data e hora aproximada;
   - IA/ferramenta usada;
   - arquivos alterados;
   - comandos executados;
   - validacoes feitas;
   - pendencias e riscos.
3. Decisoes de Arquitetura (ADR): Sempre que houver uma mudanca estrutural de infraestrutura, escolha de tecnologia, limite de banco de dados, ou alteracao de fluxo arquitetural, crie um documento em `docs/adr/` documentando o Contexto, a Decisao e as Consequencias, alem de linka-lo no arquivo `mudancas.md`.
4. Nao registrar senhas em texto claro. Para credenciais, documentar apenas onde estao configuradas e qual fluxo depende delas.
5. Quando houver um relatorio maior, salvar em `docs/` ou subpasta apropriada e linkar em `mudancas.md`.

## Documentos importantes

- `../relatorio_deploy.md`: deploy/homologacao SIGGATER de 2026-06-13, com Prisma, Vercel, Supabase, sidebar e scripts de seed/autenticacao.
