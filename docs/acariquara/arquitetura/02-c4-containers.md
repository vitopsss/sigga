# C4 - Containers

## Web App

Interface principal acessada pela equipe do Instituto Acariquara.

Responsabilidades:

- autenticação e perfis de acesso;
- cadastro e consulta de UFPAs;
- cadastro de integrantes da UFPA;
- cadastro e consulta de Organizações Coletivas;
- registro de diagnóstico estruturado;
- registro de indicadores;
- registro de atendimentos e visitas;
- telas de acompanhamento operacional;
- filtros e listagens;
- visualização de métricas básicas;
- acionamento de relatórios e PDFs.

## Banco de dados

Camada persistente do SIGGATER.

Responsabilidades:

- manter `CadastroUnico` como base central de pessoas, contatos e registros reaproveitáveis;
- armazenar UFPAs e seus dados de identificação, localização, DAP/CAF, fomento e status;
- armazenar integrantes vinculados à UFPA;
- armazenar Organizações Coletivas e seus vínculos com UFPAs;
- armazenar diagnóstico e indicadores em campos estruturados;
- armazenar atendimentos, visitas e registros técnicos por eixo;
- guardar status SGA, aprovação/reprovação de gestor e histórico operacional;
- permitir evolução futura para outros módulos sem duplicar cadastro.

## Diagnóstico e Indicadores

Container lógico responsável por organizar os dados estruturados dos modelos enviados.

Responsabilidades:

- registrar diagnóstico da UFPA;
- registrar indicadores da UFPA;
- registrar indicadores da Organização Coletiva;
- separar informações por eixo social, produtivo/econômico e ambiental;
- permitir respostas do tipo sim/não, quantidade, múltipla escolha e texto complementar;
- alimentar métricas e plano de ação.

Observação:

- campos de diagnóstico não devem ficar apenas como observação livre;
- texto livre pode existir como complemento, mas não substitui campos estruturados.

## Métricas Operacionais

Camada de consulta e consolidação dos dados estruturados.

Responsabilidades:

- totalizar UFPAs por município, comunidade, organização coletiva e grupo de interesse;
- identificar UFPAs com/sem DAP/CAF, CadÚnico, água tratada, internet, saneamento e políticas públicas;
- consolidar indicadores de segurança alimentar, produção, práticas ambientais e comercialização;
- acompanhar atendimentos por técnico, eixo, município e status;
- apoiar coordenação na priorização de plano de ação.

Fora do MVP inicial, salvo validação específica:

- dashboards analíticos avançados;
- gráficos complexos;
- relatórios comparativos antes/depois;
- BI externo.

## Gerador de PDF

Componente responsável por gerar relatório individual de atendimento/visita.

Responsabilidades:

- receber dados validados do atendimento;
- reutilizar dados da UFPA, técnico, organização coletiva, local e eixos;
- montar documento PDF no modelo acordado;
- disponibilizar saída para visualização, download ou anexação.

Fora do escopo inicial:

- geração em lote;
- mala direta;
- múltiplos templates oficiais completos;
- automação massiva de documentos;
- assinatura digital avançada.

## Armazenamento de arquivos

Camada para documentos, anexos e evidências de campo, caso o uso seja confirmado e priorizado.

Responsabilidades possíveis:

- armazenar anexos de atendimento;
- guardar documentos de referência;
- permitir vínculo entre arquivo, UFPA, Organização Coletiva e visita;
- apoiar conferência posterior.

Observação:

- anexos obrigatórios e gestão documental avançada ficam como evolução se não forem priorizados formalmente na Fase 1.

## Relatórios operacionais

Camada de consulta e consolidação operacional.

Responsabilidades:

- acompanhar visitas realizadas;
- listar atendimentos por período, técnico, município, UFPA, organização coletiva ou projeto;
- listar pendências de cadastro, diagnóstico, indicador e relatório;
- apoiar coordenação e prestação de contas;
- exportar dados básicos quando necessário.
