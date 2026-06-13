# Matriz de Rastreabilidade - Métricas SIGGATER

Data: 2026-06-13

Objetivo: separar claramente métricas de UFPA/família, métricas de organização coletiva e perfil da amostra.

## Regra de leitura

- **UFPA/família**: dados do cadastro familiar, diagnóstico da UFPA e indicadores da UFPA.
- **Organização coletiva**: dados e indicadores próprios da organização.
- **Perfil da amostra**: composição do recorte; não mede desempenho.
- Não chamar toda métrica de "Documento 6" sem especificar o bloco.

## Bloco UFPA/família

| Eixo | Indicador | Campos principais | Origem | Dashboard | Status | Observação |
|---|---|---|---|---|---|---|
| Infraestrutura | Comunicação | `possuiRadio`, `possuiTelevisao`, `possuiCelular`, `possuiInternet`, `usaRedesSociais`, `possuiOutroMeioComunicacao` | `DiagnosticoUfpa` | Diagnóstico e indicadores das UFPAs | A auditar | Métrica de diagnóstico, não perfil da amostra. |
| Infraestrutura | Saneamento rural | `aguaParaConsumo`, `aguaConsumoTratada`, `aguaParaProducao`, `captacaoAguaChuva`, `esgotoTratado`, `fontesProtegidas` | `DiagnosticoUfpa` | Diagnóstico e indicadores das UFPAs; UFPAs prioritárias | A auditar | Água tratada e esgoto entram na prioridade. |
| Geral | Ações potenciais | `acoesPotenciaisProdutivo`, `acoesPotenciaisSocial`, `acoesPotenciaisAmbiental` | `DiagnosticoUfpa` | Potencialidades e limitações | A auditar | JSON array. Zero indica não marcado no recorte. |
| Geral | Limitações | `limitacoesProdutivo`, `limitacoesSocial`, `limitacoesAmbiental` | `DiagnosticoUfpa` | Potencialidades e limitações | A auditar | JSON array. Base para plano de ação. |
| Social | Segurança alimentar | `alimentacaoVariadaComprometida`, `comidaAcabouSemCondicao`, `deixouRefeicaoSemCondicao`, `comeuMenosSemCondicao`, `qtdVezesComeuMenos`, `sentiuFomeENaoComeu` | `IndicadoresUfpa` | Diagnóstico e indicadores das UFPAs; UFPAs prioritárias | A auditar | Critério forte de urgência. |
| Social | Serviços sociais básicos | `documentacaoPessoalCompleta`, `cadastradoCadUnico`, `acessaPoliticasSociais` | `IndicadoresUfpa` | Diagnóstico e indicadores das UFPAs; UFPAs prioritárias | A auditar | CadÚnico entra na prioridade. |
| Social | Participação comunitária | `participaGrupoComunitario`, `participaAssociacao`, `participaCooperativa`, `participaGrupoInformalProdutivo`, `participaGrupoInformalSocial` | `IndicadoresUfpa` | Diagnóstico e indicadores das UFPAs | A auditar | Indicador social. |
| Ambiental | Práticas sustentáveis da UFPA | `possuiPraticasSustentaveis`, `praticaIntegracaoAtividades`, `praticaDescarteCorretoEmbalagens`, `praticaControleQueimadas`, `praticaAdubacaoVerde`, `praticaRecuperacaoPastagens`, `praticaCoberturaSolo`, `praticaManejoIntegradoPragas`, `praticaCordoesVegetacao`, `praticaRotacaoCulturas`, `praticaPlantioDireto`, `praticaPousio`, `praticaProtecaoNascentes`, `praticaPreservacaoApps`, `praticaManejoFlorestal`, `praticaRecomposicaoFlorestal` | `IndicadoresUfpa` | Diagnóstico e indicadores das UFPAs | A auditar | Não confundir com práticas ambientais da organização coletiva. |
| Ambiental | Motivos para não usar práticas | `motivoSemPraticaFinanceiro`, `motivoSemPraticaFaltaInformacao`, `motivoSemPraticaTecnologico`, `motivoSemPraticaFaltaInteresse` | `IndicadoresUfpa` | Diagnóstico e indicadores das UFPAs | A auditar | Pode cruzar com limitações ambientais. |
| Econômico | Valor bruto da produção | `valorBrutoProducaoUltimos12Meses` | `IndicadoresUfpa` | Faltando | Faltando | Definir soma, média ou mediana. |
| Econômico | Políticas produtivas | `acessaPoliticasProdutivas`, `acessouPaa`, `acessouPnae`, `acessouPgpmBio`, `acessouPronaf`, `linhasPronaf` | `IndicadoresUfpa` | Diagnóstico e indicadores das UFPAs; UFPAs prioritárias | A auditar | Sem políticas produtivas hoje entra como alerta. |
| Econômico | Motivos para não acessar políticas | `motivoNaoAcessaPoliticasFaltaInfo`, `motivoNaoAcessaPoliticasDificilAcesso`, `motivoNaoAcessaPoliticasSemInteresse` | `IndicadoresUfpa` | Diagnóstico e indicadores das UFPAs | A auditar | Deve aparecer junto de políticas produtivas. |
| Econômico | Canais de comercialização da UFPA | `canalTrocaProdutoServico`, `canalVendaPropriedade`, `canalVendaDiretaConsumidor`, `canalFeira`, `canalMercadoLocal`, `canalAtravessador`, `canalPaa`, `canalPnae`, `canalCooperativaEntreposto` | `IndicadoresUfpa` | Diagnóstico e indicadores das UFPAs | A auditar | Não confundir com canais da organização coletiva. |

## Bloco Organização Coletiva

| Eixo | Indicador | Campos principais | Origem | Dashboard | Status | Observação |
|---|---|---|---|---|---|---|
| Ambiental | Práticas ambientais da organização | `possuiPraticasAmbientais`, `praticaSeparacaoLixo`, `praticaDescarteCorretoLixo`, `praticaManutencaoAcessos`, `praticaTratamentoDejetos`, `praticaCaptacaoAguaChuva`, `praticaEducacaoAmbiental`, `praticaAvaliacaoPrevencaoRiscos` | `IndicadoresOrganizacaoColetiva` | Indicadores das organizações coletivas | A auditar | Bloco próprio da organização. |
| Social | Identidade comercial | `usaIdentidadeComercial`, `identidadeMarcaPropria`, `identidadeSeloArte`, `identidadeSenaf`, `identidadeSenafSociobiodiversidade`, `identidadeSeloQuilombos`, `identidadeSeloIndigenas`, `identidadeSeloPovosTradicionais` | `IndicadoresOrganizacaoColetiva` | Indicadores das organizações coletivas | A auditar | Bloco próprio da organização. |
| Social | Gênero e juventude | `possuiMulheresDiretoriaConselho`, `possuiJovensDiretoriaConselho` | `IndicadoresOrganizacaoColetiva` | Indicadores das organizações coletivas | A auditar | Diretoria/conselho, não integrantes das UFPAs. |
| Social | Representação política | `filiadaOrganizacao`, `filiadaUnicafes`, `filiadaUnicopas`, `filiadaSistemaOcb` | `IndicadoresOrganizacaoColetiva` | Indicadores das organizações coletivas | A auditar | Filiação institucional. |
| Econômico | Políticas públicas da organização | `acessaPoliticasPublicas`, `possuiCafJuridica`, `acessouPronafCusteio`, `acessouPronafCapitalGiro`, `acessouPronafMaisAlimentos`, `acessouPronafIndustrializacao`, `acessouPronafAgroindustria`, `acessouPronafCotasPartes`, `acessouPaa`, `acessouPnae`, `acessouPgpm`, `acessouPgpmSociobiodiversidade`, `acessouCooperaMaisBrasil` | `IndicadoresOrganizacaoColetiva` | Indicadores das organizações coletivas | A auditar | Não confundir com políticas produtivas da UFPA. |
| Econômico | Canais de comercialização da organização | `canalTrocaProdutoServico`, `canalVendaOrganizacao`, `canalVendaDiretaConsumidor`, `canalFeira`, `canalMercadoLocal`, `canalAtravessador`, `canalPaa`, `canalPnae`, `canalMercadoJustoSolidario` | `IndicadoresOrganizacaoColetiva` | Indicadores das organizações coletivas | A auditar | Canais institucionais/coletivos. |

## Perfil da amostra

| Tipo | Campos | Origem | Dashboard | Status | Observação |
|---|---|---|---|---|---|
| Comunidade | `comunidade` | `FamiliaAter` | Perfil da amostra | OK | Não mede desempenho. |
| Organização vinculada | `organizacaoColetiva` | `FamiliaAter` + relação | Perfil da amostra | OK | Não é indicador da organização. |
| Atividade produtiva | `atividades` / dados de atividade | UFPA/diagnóstico/service | Perfil da amostra | A auditar | Confirmar origem exata. |
| Bioma | `bioma` | `FamiliaAter` | Perfil da amostra | OK | Se só houver um bioma, aparece como nota. |

## Próximos checks

1. Conferir cada campo no formulário.
2. Conferir cada campo no service do dashboard.
3. Conferir cada campo renderizado no dashboard correto.
4. Criar dados controlados para validar contagens.
5. Definir pesos da lista de UFPAs prioritárias.

