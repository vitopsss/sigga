# ADR 0005 - Diagnóstico estruturado e métricas

## Status

Aceita

## Contexto

Na reunião de 25/05/2026, o Instituto Acariquara confirmou que os modelos oficiais de cadastro, diagnóstico, indicadores e relatório técnico serão a base funcional do SIGGATER Web.

Também ficou claro que o sistema não deve apenas armazenar fichas ou gerar relatórios. O Instituto precisa usar os dados coletados para entender a realidade das UFPAs, acompanhar vulnerabilidades, identificar gargalos produtivos, sociais e ambientais, e apoiar a definição de plano de ação para as famílias/unidades atendidas.

Os documentos enviados incluem:

- Cadastro da Organização Social;
- Diagnóstico da UFPA;
- Indicadores da UFPA;
- Indicadores da Organização Coletiva;
- Relatório Técnico de Visita Individual.

Esses modelos possuem muitos campos que podem virar métricas, como acesso à água tratada, saneamento, CadÚnico, segurança alimentar, práticas ambientais, políticas públicas, produção, comercialização e situação perante SGA/gestão.

Se esses dados forem armazenados apenas como texto livre, anexos ou PDF, o sistema não conseguirá gerar métricas confiáveis nem apoiar decisões operacionais.

## Decisão

O SIGGATER Web deve armazenar cadastro, diagnóstico e indicadores em campos estruturados, e não apenas como texto livre ou documento final.

A Fase 1 deve priorizar a estruturação dos dados essenciais para:

- cadastro da UFPA / Unidade Familiar de Produção Agrária;
- cadastro de integrantes da UFPA;
- vínculo com Organização Coletiva ou Grupo de Interesse;
- diagnóstico social, produtivo/econômico e ambiental;
- indicadores da UFPA;
- indicadores da Organização Coletiva quando aplicável;
- status operacionais de SGA e validação do gestor;
- relatório técnico individual por visita;
- métricas operacionais básicas.

Os campos estruturados devem permitir consultas por:

- UFPA;
- Organização Coletiva;
- município;
- comunidade;
- eixo;
- técnico;
- status SGA/gestor;
- situação identificada no diagnóstico;
- período de atendimento.

## Consequências

- A linguagem do módulo deve evoluir de "família" para "UFPA / Unidade Familiar" onde fizer sentido.
- "Nome da família" deve ser tratado como "Denominação da UFPA".
- O diagnóstico deve ser modelado como dados consultáveis, não apenas observação textual.
- As métricas básicas passam a ser requisito central do MVP.
- O relatório individual por visita deve consumir os dados estruturados sempre que possível.
- Dashboards avançados, integrações, importações em massa, mala direta e reprodução completa dos modelos oficiais continuam como evolução, salvo aditivo ou nova validação de escopo.

## Limite de escopo

Esta decisão não significa implementar integralmente todos os campos, relatórios e dashboards dos cinco documentos na primeira homologação.

A decisão significa que a base deve nascer correta: os campos essenciais do diagnóstico e dos indicadores precisam ser estruturados desde o início para que o sistema consiga gerar métricas e orientar plano de ação.

## Referências

- `docs/acariquara/planejamento/08-mapa-funcional-pos-reuniao-25-05.md`
- `docs/adr/0001-escopo-ater-instituto.md`
- `docs/adr/0002-cadastro-unico-como-base.md`
- `docs/adr/0003-pdf-individual-vs-mala-direta.md`
- `docs/acariquara/fontes-oficiais/siggater-base/3. DIAGNÓSTICO DA UFPA - SBDV.docx`
- `docs/acariquara/fontes-oficiais/siggater-base/4. INDICADORES DA UFPA – SBDV.docx`
- `docs/acariquara/fontes-oficiais/siggater-base/6. INDICADORES DA ORGANIZAÇÃO COLETIVA  - SBDV.docx`
