# C4 - Contexto do Sistema

## Sistema

SIGGATER Web é a aplicação web usada pelo Instituto Acariquara para organizar atividades de Assistência Técnica e Extensão Rural (ATER), com foco inicial no cadastro de UFPAs, diagnóstico estruturado, indicadores, visitas técnicas, registros por eixo e relatório individual.

UFPA significa Unidade Familiar de Produção Agrária. No contexto do sistema, ela passa a ser a entidade operacional principal antes chamada genericamente de família/unidade atendida.

## Objetivo

Reduzir dispersão de informações operacionais, padronizar registros de campo e permitir acompanhamento institucional das atividades de ATER com base em dados consultáveis.

O sistema deve apoiar duas necessidades:

- registrar a operação de ATER, visitas e relatórios;
- transformar cadastro, diagnóstico e indicadores em métricas para apoiar plano de ação das UFPAs e organizações coletivas.

## Pessoas e grupos envolvidos

- Diretoria do Instituto Acariquara: acompanha avanço institucional, contratação, resultados e indicadores consolidados.
- Coordenação de projetos: define fluxos, valida campos, acompanha implantação, aprova/reprova registros e prioriza ações.
- Equipe de campo: coleta dados, registra visitas, diagnósticos, indicadores e orientações técnicas.
- Equipe administrativa: lança dados coletados em formulários escritos, consulta cadastros, organiza relatórios e apoia prestação de contas.
- Técnicos/Agentes de ATER: realizam atendimentos e assinam ou validam registros técnicos.
- UFPAs / Unidades Familiares de Produção Agrária: são o objeto principal de cadastro, diagnóstico, indicadores e plano de ação.
- Integrantes da UFPA: membros vinculados à unidade familiar, incluindo responsável pela UFPA.
- Organizações Coletivas: associações, cooperativas, grupos ou coletivos aos quais UFPAs podem estar vinculadas.
- Jurídico/gestão contratual: valida contrato, responsabilidades, propriedade intelectual, LGPD e documentação formal.

## Sistemas externos e dependências

- Modelos oficiais enviados pelo Instituto: fonte principal de campos e estrutura funcional.
- Formulários escritos de campo: fonte de coleta inicial antes do lançamento no sistema.
- Planilhas e fichas atuais: possíveis fontes de migração ou conferência.
- SGA/ANATER: referência operacional para status, envio e aprovação, sem integração automática prevista na Fase 1.
- PDFs de relatório: saída documental individual esperada para atendimentos/visitas.
- Serviços de hospedagem, banco de dados e armazenamento: infraestrutura do sistema.

## Limites do sistema

O SIGGATER Web organiza dados operacionais, diagnósticos, indicadores e relatórios previstos no escopo da Fase 1.

Ele não substitui a metodologia de ATER do Instituto, nem cria automaticamente regras oficiais, integrações, assinaturas digitais, importações em massa, dashboards avançados ou modelos legais que ainda não tenham sido homologados.

O sistema deve nascer preparado para métricas, mas dashboards sofisticados e reprodução completa de todos os modelos oficiais continuam como evolução, salvo nova validação de escopo.

## Fluxo de alto nível

1. Instituto fornece modelos oficiais, fichas e critérios de validação.
2. Equipe coleta dados em campo por formulário escrito ou fluxo validado.
3. Sistema cadastra Organização Coletiva quando aplicável.
4. Sistema cadastra UFPA e integrantes.
5. Sistema registra diagnóstico e indicadores estruturados.
6. Coordenação acompanha pendências, status SGA e aprovação do gestor.
7. Equipe registra visitas técnicas e orientações por eixo.
8. Sistema gera relatório individual por visita.
9. Sistema apresenta métricas operacionais básicas para apoiar plano de ação.

## Decisões relacionadas

- `docs/adr/0001-escopo-ater-instituto.md`
- `docs/adr/0002-cadastro-unico-como-base.md`
- `docs/adr/0003-pdf-individual-vs-mala-direta.md`
- `docs/adr/0004-prazo-condicionado-a-insumos.md`
- `docs/adr/0005-diagnostico-estruturado-e-metricas.md`
