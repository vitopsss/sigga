# Matriz de Rastreabilidade - Metricas SIGGATER

Data: 2026-06-13

## Numeracao oficial

- **Doc 2**: Cadastro de Organizacao Coletiva.
- **Doc 3**: Diagnostico UFPA.
- **Doc 4**: Indicadores UFPA.
- **Doc 6**: Indicadores da Organizacao Coletiva.
- **Doc Potencialidades**: substitui os campos de acoes potenciais e limitacoes do Doc 3.

## Regra

- Nao misturar UFPA com organizacao coletiva.
- Perfil da amostra nao e indicador de desempenho.
- Documento 6 sempre significa organizacao coletiva, nunca UFPA.

## Status rapido

| Bloco | Status | Leitura |
|---|---|---|
| Doc 3 - Comunicacao e saneamento | OK | Salva, consulta e aparece no painel de UFPAs. |
| Doc 3 - Patrimonio, areas, recursos e atividades coletivas | Parcial | Salva no formulario, mas ainda nao virou painel gerencial. |
| Doc Potencialidades | OK | Usa listas oficiais por eixo em JSON. Zero significa nao preenchido no recorte. |
| Doc 4 - Social | OK/Parcial | Campos booleanos aparecem; textos "quais" ficam como detalhe, nao metrica. |
| Doc 4 - Ambiental | OK | Praticas e motivos aparecem no painel de UFPAs. |
| Doc 4 - Economico | OK | VBP, politicas produtivas, motivos, PRONAF e canais aparecem no painel. |
| Doc 2 - Cadastro de organizacao | OK | Cadastro/base; nao e indicador de desempenho. |
| Doc 6 - Organizacao coletiva | OK/Parcial | Booleanos aparecem; textos "quais" ficam como detalhe. |
| Perfil da amostra | OK | Comunidade, organizacao, atividade e bioma so explicam composicao do recorte. |

## Doc 3 - Diagnostico UFPA

| Indicador | Campos principais | Dashboard | Status | Observacao |
|---|---|---|---|---|
| Comunicacao | `possuiRadio`, `possuiTelevisao`, `possuiCelular`, `possuiInternet`, `usaRedesSociais`, `possuiOutroMeioComunicacao` | Doc 3 e Doc 4: UFPAs | OK | Conta Sim/Nao/Sem informacao. |
| Saneamento rural | `aguaParaConsumo`, `aguaConsumoTratada`, `aguaParaProducao`, `captacaoAguaChuva`, `esgotoTratado`, `fontesProtegidas` | Doc 3 e Doc 4: UFPAs; UFPAs prioritarias | OK | Agua tratada e esgoto entram na prioridade. |
| Patrimonio e plantel | `qtdMaquinasAgricolas` ate `qtdPequenosAnimaisOutros` | Faltando | Parcial | Salva, mas falta decidir se vira metrica. |
| Areas da UFPA | `areaPastagens` ate `areaOutrosUsos` | Faltando | Parcial | Pode virar soma/percentual depois. |
| Recursos disponiveis | `recursosDisponiveis` | Faltando | Parcial | Salva JSON; falta agregacao por tipo. |
| Atividades coletivas | `atividadesColetivas` | Faltando/indireto | Parcial | Salva JSON; nao confundir com perfil da amostra. |
| Politicas publicas do diagnostico | `politicasPublicas` | Faltando/indireto | Parcial | Pode ser detalhe historico; Doc 4 cobre politicas sociais/produtivas. |

## Doc Potencialidades

| Indicador | Campos principais | Dashboard | Status | Observacao |
|---|---|---|---|---|
| Potencialidades | `acoesPotenciaisProdutivo`, `acoesPotenciaisSocial`, `acoesPotenciaisAmbiental` | Doc Potencialidades | OK | Lista oficial por eixo. |
| Limitacoes | `limitacoesProdutivo`, `limitacoesSocial`, `limitacoesAmbiental` | Doc Potencialidades | OK | Lista oficial por eixo. |

## Doc 4 - Indicadores UFPA

| Indicador | Campos principais | Dashboard | Status | Observacao |
|---|---|---|---|---|
| Seguranca alimentar | `alimentacaoVariadaComprometida`, `comidaAcabouSemCondicao`, `deixouRefeicaoSemCondicao`, `comeuMenosSemCondicao`, `qtdVezesComeuMenos`, `sentiuFomeENaoComeu` | Doc 3 e Doc 4: UFPAs; UFPAs prioritarias | OK | `qtdVezesComeuMenos` agora entra no resumo economico/SAN. |
| Servicos sociais basicos | `documentacaoPessoalCompleta`, `documentacaoPessoalQuais`, `cadastradoCadUnico`, `cadUnicoQuais`, `acessaPoliticasSociais`, `politicasSociaisQuais` | Doc 3 e Doc 4: UFPAs; UFPAs prioritarias | OK/Parcial | Booleanos no dashboard; "quais" ficam como detalhe. |
| Participacao comunitaria | `participaGrupoComunitario`, `qualGrupoComunitario`, `participaAssociacao`, `participaCooperativa`, `participaGrupoInformalProdutivo`, `participaGrupoInformalSocial` | Doc 3 e Doc 4: UFPAs | OK/Parcial | `qualGrupoComunitario` nao e agregado. |
| Praticas sustentaveis da UFPA | `possuiPraticasSustentaveis`, `praticaIntegracaoAtividades` ate `praticaRecomposicaoFlorestal` | Doc 3 e Doc 4: UFPAs | OK | Nao confundir com praticas ambientais do Doc 6. |
| Motivos sem pratica | `motivoSemPraticaFinanceiro`, `motivoSemPraticaFaltaInformacao`, `motivoSemPraticaTecnologico`, `motivoSemPraticaFaltaInteresse` | Doc 3 e Doc 4: UFPAs | OK | Cruzar depois com limitacoes ambientais. |
| Valor bruto da producao | `valorBrutoProducaoUltimos12Meses` | Doc 3 e Doc 4: UFPAs | OK | Exibe total, quantidade informada e media. |
| Politicas produtivas | `acessaPoliticasProdutivas`, motivos, `acessouPaa`, `acessouPnae`, `acessouPgpmBio`, `acessouPronaf`, `linhasPronaf` | Doc 3 e Doc 4: UFPAs | OK | Motivos e linhas PRONAF agora aparecem. |
| Canais de comercializacao da UFPA | `canalTrocaProdutoServico` ate `canalCooperativaEntreposto` | Doc 3 e Doc 4: UFPAs | OK | Nao confundir com canais do Doc 6. |

## Doc 2 - Cadastro de Organizacao Coletiva

| Bloco | Campos | Dashboard | Status | Observacao |
|---|---|---|---|---|
| Cadastro da organizacao | `OrganizacaoColetiva` e campos cadastrais | Lista/perfil de organizacoes | OK | Base cadastral, nao desempenho. |
| Vinculo com UFPAs | `FamiliaAter.organizacaoColetivaId` | Perfil da amostra/organizacoes | OK | Mede composicao e alcance cadastral. |

## Doc 6 - Indicadores da Organizacao Coletiva

| Indicador | Campos principais | Dashboard | Status | Observacao |
|---|---|---|---|---|
| Praticas ambientais da organizacao | `possuiPraticasAmbientais`, `praticaSeparacaoLixo` ate `praticaAvaliacaoPrevencaoRiscos` | Doc 6: organizacoes coletivas | OK | Bloco proprio da organizacao. |
| Identidade comercial | `usaIdentidadeComercial`, `identidadeMarcaPropria` ate `identidadeSeloPovosTradicionais` | Doc 6: organizacoes coletivas | OK | Booleanos cobertos. |
| Genero e juventude | `possuiMulheresDiretoriaConselho`, `possuiJovensDiretoriaConselho` | Doc 6: organizacoes coletivas | OK | Diretoria/conselho, nao integrantes de UFPA. |
| Representacao politica | `filiadaOrganizacao`, `filiadaUnicafes`, `filiadaUnicopas`, `filiadaSistemaOcb` | Doc 6: organizacoes coletivas | OK | Filiacao institucional. |
| Politicas publicas da organizacao | `acessaPoliticasPublicas`, `possuiCafJuridica`, PRONAF, PAA, PNAE, PGPM, Coopera Mais Brasil | Doc 6: organizacoes coletivas | OK | Nao confundir com politicas produtivas da UFPA. |
| Canais da organizacao | `canalTrocaProdutoServico` ate `canalMercadoJustoSolidario` | Doc 6: organizacoes coletivas | OK | Canais coletivos/institucionais. |
| Campos "quais" | `praticasAmbientaisQuais`, `identidadeComercialQuais`, `representacaoPoliticaQuais`, `politicasPublicasQuais` | Detalhe | Parcial | Guardado como texto; nao agregado. |

## Historico de execucao

### 2026-06-13 — commit a06ba28

**Implementado:**

1. **Seed de metricas controlado** (`prisma/seed-metricas-teste.ts`)
   - 3 UFPAs com combinacoes conhecidas: Verde (infra OK), Alerta (vulneravel), Produtiva (economica)
   - Valores esperados documentados no proprio arquivo
   - Uso: `npx.cmd tsx prisma/seed-metricas-teste.ts`
   - Limpeza: `DELETE FROM familias_ater WHERE nome_familia LIKE '%-Teste'`

2. **Pesos de prioridade implementados** (`dashboard-client.tsx`)
   - `RISK_WEIGHTS` const com 7 regras ponderadas:
     | Risco                  | Peso |
     |------------------------|------|
     | Diagnostico ausente    | 3    |
     | Agua sem tratamento    | 3    |
     | Sem esgoto tratado     | 3    |
     | Inseguranca alimentar  | 4    |
     | Sem CadUnico           | 2    |
     | Sem politicas produtivas | 2  |
     | SGA pendente           | 1    |
   - Novo risco adicionado: **"Sem politicas produtivas"** (peso 2)
   - `getRisks()` derivado da tabela de pesos
   - `getRiskScore()` soma os pesos dos riscos ativos
   - Ordenacao por score ponderado (nao mais por contagem simples)
   - Badge `Xpts` visivel no card UFPAs prioritarias
   - Subtitulo: "Ranking ponderado por severidade das pendencias"

3. **Validacoes:**
   - `npx.cmd tsc --noEmit` — OK
   - `npm.cmd run lint` — OK

## Proximo ataque

1. Rodar seed de teste e comparar contagens no dashboard com os valores esperados.
2. Decidir se Doc 3 patrimonio/areas/recursos viram metricas gerenciais:
   - area total por uso (pastagem, culturas, extrativismo etc.)
   - total de plantel (bovinos, aves, suinos...)
   - recursos disponiveis por tipo
   - atividades coletivas por area
3. Avaliar se score de prioridade precisa de ajuste fino apos validacao com equipe.
