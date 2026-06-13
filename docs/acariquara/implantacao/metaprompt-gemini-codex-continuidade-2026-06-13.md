# Metaprompt Gemini/Codex - Continuidade SIGGATER

Data: 2026-06-13
Projeto: `C:\sigga-v5`
App: SIGGA v5 / SIGGATER Web - Fase 1 Acariquara / ATERSOCIOBIO

## Regra principal

Economize tokens. Trabalhe com respostas curtas, objetivas e orientadas a execução.
Sempre leia o estado real do repositório antes de sugerir mudança.
Nunca imprima `.env`, `DATABASE_URL`, `DIRECT_URL`, `SIGGATER_SESSION_SECRET`, senhas reais ou hashes.

## O que o app é

O SIGGATER Web é o módulo ATER Sociobio dentro do SIGGA v5.
Ele organiza:

- UFPAs/famílias;
- organizações coletivas;
- técnicos/extensionistas;
- diagnósticos estruturados de UFPAs;
- indicadores de organizações;
- atendimentos/visitas técnicas;
- PDFs e métricas para homologação/relatórios.

Foco atual: implantação/homologação da Fase 1 com a Acariquara, sem liberar acesso ao cliente antes de teste interno.

## Como estamos trabalhando

- Numeração oficial dos instrumentos:
  - Doc 2: cadastro de organização coletiva.
  - Doc 3: diagnóstico UFPA.
  - Doc 4: indicadores UFPA.
  - Doc 6: indicadores da organização coletiva.
  - Doc Potencialidades: substitui ações potenciais e limitações no Doc 3.
- Mudanças pequenas, validadas e commitadas.
- Separar métricas por domínio: UFPAs, organizações e atendimentos.
- Evitar tela poluída: cards compactos, seções claras e dados secundários recolhíveis.
- Métrica operacional deve responder: "onde agir?", "qual problema?", "quantas UFPAs/organizações?".
- Perfil de amostra não é desempenho; serve só para entender composição do recorte.
- Não publicar produção paga nem assumir custo. Vercel, se citado, só como homologação provisória/gratuita.

## Estado recente do Git

Commits principais recentes:

- `794f09e` - alinhou diagnósticos e indicadores aos instrumentos oficiais.
- `893c64a` - separou dashboard em telas por domínio.
- `84e54db` - adicionou métricas compactas de UFPA.
- `3f87f93` - adicionou métricas de indicadores de organizações coletivas.
- `6241705` - fez potencialidades/limitações usarem a lista oficial completa.
- `263fcad` - reorganizou fluxo da tela de UFPA.
- `4eca498` - removeu atalhos confusos de distribuição.
- `1e0434d` - reintroduziu perfil da amostra como seção recolhível.

Arquivos temporários não devem ser commitados sem revisão:

- `scripts/check_users.js`
- `scripts/create_test_user.js`
- `scripts/extract_docx.py`

## Mudanças feitas por área

### Banco/Prisma

- `DiagnosticoUfpa` passou a guardar ações potenciais e limitações por eixo como `Json`.
- Indicadores de organização coletiva receberam campos detalhados para práticas ambientais, identidade comercial, representação política, políticas públicas e canais.
- Foi criada migration para converter campos de texto em JSONB e adicionar campos de detalhamento.

### Doc 3 - Diagnóstico UFPA

- Cobre diagnóstico da UFPA, incluindo comunicação, saneamento e outros dados estruturais.

### Doc 4 - Indicadores UFPA

- Cobre indicadores sociais, ambientais e econômicos da UFPA.

### Doc Potencialidades

- Substitui o antigo bloco de ações potenciais e limitações do Doc 3.
- No schema ainda aparece como `acoesPotenciais*` e `limitacoes*`.
- Se todos aparecem `0`, é porque ainda não foram marcados nas UFPAs do recorte.

### Doc 2 e Doc 6

- Doc 2 é cadastro de organização coletiva.
- Doc 6 é indicadores da organização coletiva.
- Não misturar Doc 6 com UFPA.

### Dashboard

Dashboard central:

- `/ater-sociobio/dashboard`
- funciona como hub para três telas:
  - `/ater-sociobio/dashboard/ufpas`
  - `/ater-sociobio/dashboard/organizacoes`
  - `/ater-sociobio/dashboard/atendimentos`

Tela de UFPAs:

- cards-resumo compactos;
- UFPAs prioritárias no topo;
- Doc 3 e Doc 4 das UFPAs;
- potencialidades e limitações;
- perfil da amostra recolhível.

Tela de organizações:

- métricas próprias das organizações coletivas;
- práticas ambientais;
- identidade comercial;
- gênero e juventude;
- representação política;
- políticas públicas;
- canais de comercialização.

Tela de atendimentos:

- métricas de visitas, técnicos, status, eixos e produção de relatórios.

### UX

- Cards grandes foram reduzidos.
- Métricas foram divididas por tela para diminuir poluição.
- Blocos de distribuição que confundiam o usuário foram transformados em "Perfil da amostra", recolhível e sem clique automático.
- O botão voltar preserva origem via `from`.
- PDF de diagnóstico usa wrapper client-side para evitar renderização SSR do motor PDF.

## Validações usadas

Após mudanças relevantes:

```powershell
npx.cmd tsc --noEmit
npm.cmd run lint
npm.cmd run build
```

O build pode precisar de rede por causa de `next/font`/Google Fonts.

## Login local de teste

Se o script temporário de teste tiver sido rodado:

- email: `test@sigga.org`
- senha: `password123`

Não enviar esse acesso ao cliente.

## Fluxo interno antes de liberar cliente

Testar:

1. login;
2. módulo ATER Sociobio;
3. organizações;
4. UFPAs;
5. diagnóstico estruturado;
6. atendimento;
7. PDF;
8. métricas de UFPAs, organizações e atendimentos.

## Prompt pronto para Gemini CLI

Você está no projeto `C:\sigga-v5`, app Next.js/SIGGATER Web.

Contexto:

- O app é o SIGGA v5 com módulo SIGGATER Web / ATER Sociobio.
- O contrato da Acariquara Fase 1 já foi assinado.
- Estamos em implantação/homologação.
- Não enviar acesso ao cliente ainda.
- Não publicar em produção paga.
- Não imprimir segredos reais de `.env`, URLs de banco, session secret, senhas ou hashes.
- Economize tokens e responda de forma objetiva.

Estado recente:

- Dashboard foi dividido em UFPAs, organizações e atendimentos.
- UFPAs têm métricas próprias do Doc 3, Doc 4, prioridades, Doc Potencialidades e perfil da amostra recolhível.
- Organizações têm cadastro no Doc 2 e indicadores no Doc 6.
- Potencialidades/limitações aparecem com `0` quando ainda não foram marcadas.
- `scripts/check_users.js`, `scripts/create_test_user.js` e `scripts/extract_docx.py` são temporários; não commitar sem revisão.

Sua missão:

1. Entrar em `C:\sigga-v5`.
2. Rodar `git status -sb`.
3. Ler este arquivo: `docs/acariquara/implantacao/metaprompt-gemini-codex-continuidade-2026-06-13.md`.
4. Antes de alterar código, localizar a área exata com `rg`.
5. Fazer mudanças pequenas e focadas.
6. Validar com:
   - `npx.cmd tsc --noEmit`
   - `npm.cmd run lint`
   - `npm.cmd run build` quando mexer em UI/build.
7. Não alterar nem expor `.env`.
8. Ao final, informar:
   - arquivos alterados;
   - validações feitas;
   - commit, se houver;
   - próximo passo prático.

Comandos úteis:

```powershell
cd C:\sigga-v5
git status -sb
rg -n "Dashboard|UfpaPanel|OrganizacoesPanel|Potencialidades|Diagnóstico e indicadores|Indicadores de organizações" app lib components
npx.cmd tsc --noEmit
npm.cmd run lint
```
