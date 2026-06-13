# Matriz de Rastreabilidade - Métricas SIGGATER

Data: 2026-06-13

## Numeração oficial

- **Doc 2**: Cadastro de Organização Coletiva.
- **Doc 3**: Diagnóstico UFPA.
- **Doc 4**: Indicadores UFPA.
- **Doc 6**: Indicadores da Organização Coletiva.
- **Doc Potencialidades**: substitui os campos de ações potenciais e limitações do Doc 3.

## Regra

- Não misturar UFPA com organização coletiva.
- Perfil da amostra não é indicador de desempenho.
- Quando falar de Documento 6, falar apenas de organização coletiva.

## Doc 3 - Diagnóstico UFPA

| Eixo | Indicador | Campos principais | Dashboard | Status | Observação |
|---|---|---|---|---|---|
| Infraestrutura | Comunicação | `possuiRadio`, `possuiTelevisao`, `possuiCelular`, `possuiInternet`, `usaRedesSociais`, `possuiOutroMeioComunicacao` | Doc 3 e Doc 4: UFPAs | A auditar | Métrica de diagnóstico da UFPA. |
| Infraestrutura | Saneamento rural | `aguaParaConsumo`, `aguaConsumoTratada`, `aguaParaProducao`, `captacaoAguaChuva`, `esgotoTratado`, `fontesProtegidas` | Doc 3 e Doc 4: UFPAs; UFPAs prioritárias | A auditar | Água tratada e esgoto entram na prioridade. |
| Geral | Recursos disponíveis | `recursosDisponiveis` | Faltando/indireto | A auditar | Ver se precisa virar métrica ou só detalhe da UFPA. |
| Geral | Atividades coletivas | `atividadesColetivas` | Perfil da amostra/indireto | A auditar | Confirmar uso real no service. |
| Geral | Políticas públicas | `politicasPublicas` | Faltando/indireto | A auditar | Pode ter sido substituído por campos do Doc 4. |

## Doc Potencialidades

| Eixo | Indicador | Campos principais | Dashboard | Status | Observação |
|---|---|---|---|---|---|
| Produtivo/Social/Ambiental | Potencialidades | `acoesPotenciaisProdutivo`, `acoesPotenciaisSocial`, `acoesPotenciaisAmbiental` | Doc Potencialidades: potencialidades e limitações | A auditar | Mantido no schema com nome antigo, mas conceito vem do Doc Potencialidades. |
| Produtivo/Social/Ambiental | Limitações | `limitacoesProdutivo`, `limitacoesSocial`, `limitacoesAmbiental` | Doc Potencialidades: potencialidades e limitações | A auditar | Zero indica que ainda não foi marcado no recorte. |

## Doc 4 - Indicadores UFPA

| Eixo | Indicador | Campos principais | Dashboard | Status | Observação |
|---|---|---|---|---|---|
| Social | Segurança alimentar | `alimentacaoVariadaComprometida`, `comidaAcabouSemCondicao`, `deixouRefeicaoSemCondicao`, `comeuMenosSemCondicao`, `qtdVezesComeuMenos`, `sentiuFomeENaoComeu` | Doc 3 e Doc 4: UFPAs; UFPAs prioritárias | A auditar | Critério forte de urgência. |
| Social | Serviços sociais básicos | `documentacaoPessoalCompleta`, `documentacaoPessoalQuais`, `cadastradoCadUnico`, `cadUnicoQuais`, `acessaPoliticasSociais`, `politicasSociaisQuais` | Doc 3 e Doc 4: UFPAs; UFPAs prioritárias | A auditar | CadÚnico entra na prioridade. |
| Social | Participação comunitária | `participaGrupoComunitario`, `qualGrupoComunitario`, `participaAssociacao`, `participaCooperativa`, `participaGrupoInformalProdutivo`, `participaGrupoInformalSocial` | Doc 3 e Doc 4: UFPAs | A auditar | Indicador social da UFPA. |
| Ambiental | Práticas sustentáveis da UFPA | `possuiPraticasSustentaveis`, `praticasSustentaveisQuais`, `praticaIntegracaoAtividades`, `praticaDescarteCorretoEmbalagens`, `praticaControleQueimadas`, `praticaAdubacaoVerde`, `praticaRecuperacaoPastagens`, `praticaCoberturaSolo`, `praticaManejoIntegradoPragas`, `praticaCordoesVegetacao`, `praticaRotacaoCulturas`, `praticaPlantioDireto`, `praticaPousio`, `praticaProtecaoNascentes`, `praticaPreservacaoApps`, `praticaManejoFlorestal`, `praticaRecomposicaoFlorestal` | Doc 3 e Doc 4: UFPAs | A auditar | Não confundir com práticas ambientais do Doc 6. |
| Ambiental | Motivos para não usar práticas | `motivoSemPraticaFinanceiro`, `motivoSemPraticaFaltaInformacao`, `motivoSemPraticaTecnologico`, `motivoSemPraticaFaltaInteresse` | Doc 3 e Doc 4: UFPAs | A auditar | Cruzar depois com limitações. |
| Econômico | Valor bruto da produção | `valorBrutoProducaoUltimos12Meses` | Faltando | Faltando | Definir soma, média ou mediana. |
| Econômico | Políticas produtivas | `acessaPoliticasProdutivas`, `motivoNaoAcessaPoliticasFaltaInfo`, `motivoNaoAcessaPoliticasDificilAcesso`, `motivoNaoAcessaPoliticasSemInteresse`, `acessouPaa`, `acessouPnae`, `acessouPgpmBio`, `acessouPronaf`, `linhasPronaf` | Doc 3 e Doc 4: UFPAs; UFPAs prioritárias | A auditar | Sem políticas produtivas entra como alerta. |
| Econômico | Canais de comercialização da UFPA | `canalTrocaProdutoServico`, `canalVendaPropriedade`, `canalVendaDiretaConsumidor`, `canalFeira`, `canalMercadoLocal`, `canalAtravessador`, `canalPaa`, `canalPnae`, `canalCooperativaEntreposto` | Doc 3 e Doc 4: UFPAs | A auditar | Não confundir com canais do Doc 6. |

## Doc 2 - Cadastro de Organização Coletiva

| Bloco | Campos | Dashboard | Status | Observação |
|---|---|---|---|---|
| Cadastro da organização | `OrganizacaoColetiva` e campos cadastrais | Perfil/listas de organizações | A auditar | Não é Doc 6. Serve como base cadastral. |
| Vínculo com UFPAs | relação `FamiliaAter.organizacaoColetivaId` | Perfil da amostra/organizações | A auditar | Mede composição, não desempenho. |

## Doc 6 - Indicadores da Organização Coletiva

| Eixo | Indicador | Campos principais | Dashboard | Status | Observação |
|---|---|---|---|---|---|
| Ambiental | Práticas ambientais da organização | `possuiPraticasAmbientais`, `praticaSeparacaoLixo`, `praticaDescarteCorretoLixo`, `praticaManutencaoAcessos`, `praticaTratamentoDejetos`, `praticaCaptacaoAguaChuva`, `praticaEducacaoAmbiental`, `praticaAvaliacaoPrevencaoRiscos` | Doc 6: indicadores das organizações coletivas | A auditar | Bloco próprio da organização. |
| Social | Identidade comercial | `usaIdentidadeComercial`, `identidadeMarcaPropria`, `identidadeSeloArte`, `identidadeSenaf`, `identidadeSenafSociobiodiversidade`, `identidadeSeloQuilombos`, `identidadeSeloIndigenas`, `identidadeSeloPovosTradicionais` | Doc 6: indicadores das organizações coletivas | A auditar | Bloco próprio da organização. |
| Social | Gênero e juventude | `possuiMulheresDiretoriaConselho`, `possuiJovensDiretoriaConselho` | Doc 6: indicadores das organizações coletivas | A auditar | Diretoria/conselho; não é integrante de UFPA. |
| Social | Representação política | `filiadaOrganizacao`, `filiadaUnicafes`, `filiadaUnicopas`, `filiadaSistemaOcb` | Doc 6: indicadores das organizações coletivas | A auditar | Filiação institucional. |
| Econômico | Políticas públicas da organização | `acessaPoliticasPublicas`, `possuiCafJuridica`, `acessouPronafCusteio`, `acessouPronafCapitalGiro`, `acessouPronafMaisAlimentos`, `acessouPronafIndustrializacao`, `acessouPronafAgroindustria`, `acessouPronafCotasPartes`, `acessouPaa`, `acessouPnae`, `acessouPgpm`, `acessouPgpmSociobiodiversidade`, `acessouCooperaMaisBrasil` | Doc 6: indicadores das organizações coletivas | A auditar | Não confundir com políticas produtivas da UFPA. |
| Econômico | Canais de comercialização da organização | `canalTrocaProdutoServico`, `canalVendaOrganizacao`, `canalVendaDiretaConsumidor`, `canalFeira`, `canalMercadoLocal`, `canalAtravessador`, `canalPaa`, `canalPnae`, `canalMercadoJustoSolidario` | Doc 6: indicadores das organizações coletivas | A auditar | Canais institucionais/coletivos. |

## Perfil da amostra

| Tipo | Campos | Dashboard | Status | Observação |
|---|---|---|---|---|
| Comunidade | `FamiliaAter.comunidade` | Perfil da amostra | OK | Não mede desempenho. |
| Organização vinculada | `FamiliaAter.organizacaoColetivaId` | Perfil da amostra | OK | Não é indicador da organização. |
| Atividade produtiva | `atividades` no service/dashboard | Perfil da amostra | A auditar | Confirmar origem exata. |
| Bioma | `FamiliaAter.bioma` | Perfil da amostra | OK | Se só houver um bioma, aparece como nota. |

## Próximos checks

1. Conferir cada campo do Doc 3 no formulário e dashboard.
2. Conferir cada campo do Doc 4 no formulário e dashboard.
3. Conferir o Doc Potencialidades contra campos JSON atuais.
4. Conferir Doc 2 separado do Doc 6.
5. Conferir Doc 6 somente nas telas de organizações coletivas.
6. Criar dados controlados para validar contagens.
7. Definir pesos da lista de UFPAs prioritárias.
