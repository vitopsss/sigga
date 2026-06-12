# Mapa funcional pós-reunião - SIGGATER Web / Instituto Acariquara

Data da reunião: 25/05/2026
Participantes principais: Instituto Acariquara e João Victor Passos
Status: documento interno de alinhamento funcional para orientar implementação e controle de escopo.

Documentos relacionados:

- `docs/adr/0005-diagnostico-estruturado-e-metricas.md`
- `docs/acariquara/arquitetura/01-c4-contexto.md`
- `docs/acariquara/arquitetura/02-c4-containers.md`
- `docs/acariquara/planejamento/03-backlog-fase-1.md`

## 1. Premissa principal

Os documentos enviados pelo Instituto Acariquara na pasta `docs/acariquara/fontes-oficiais/siggater-base` passam a ser a fonte principal para definição dos campos do SIGGATER Web.

As anotações feitas na reunião complementam esses documentos. Elas não substituem os modelos enviados e não criam um diagnóstico paralelo. A leitura correta é:

- os modelos oficiais definem a estrutura base;
- os ajustes verbais da reunião definem linguagem, prioridades e campos faltantes;
- as anotações do João indicam onde o sistema precisa gerar métricas e apoiar plano de ação.

## 2. Documentos-base recebidos

Arquivos em `docs/acariquara/fontes-oficiais/siggater-base`:

- `2. CADASTRO DA ORGANIZAÇÃO SOCIAL - SBDV.docx`
- `3. DIAGNÓSTICO DA UFPA - SBDV.docx`
- `4. INDICADORES DA UFPA – SBDV.docx`
- `6. INDICADORES DA ORGANIZAÇÃO COLETIVA  - SBDV.docx`
- `11. RELATÓRIO TÉCNICO DE VISITA INDIVIDUAL  - SBDV.docx`

Esses documentos indicam que o sistema deve organizar quatro blocos funcionais:

- Organização Coletiva;
- UFPA / Unidade Familiar de Produção Agrária;
- Diagnóstico e indicadores;
- Visitas técnicas e relatório individual.

## 3. Mudanças solicitadas na reunião

Pontos registrados:

- trocar a linguagem de "família" para "UFPA" ou "Unidade Familiar";
- usar "Denominação da UFPA" no lugar de "Nome da família";
- cadastrar os membros/integrantes da UFPA;
- entender e registrar a Organização Coletiva vinculada à UFPA;
- tratar "Grupo de Interesse / Organização Coletiva" com mais clareza;
- incluir "Programa de Fomento" antes da situação/valor do fomento;
- dar prioridade a cadastro e diagnóstico;
- registrar diagnóstico das unidades familiares;
- incluir status operacionais: enviado SGA, aprovado gestor, reprovado gestor;
- incluir DAP/CAF, órgão emissor e validade;
- estruturar os dados para métricas e plano de ação.

Observação terminológica: usar "Unidade Familiar de Produção Agrária", conforme o modelo, e não "agrícola".

## 4. Entidades funcionais do SIGGATER

### 4.1 UFPA

Substitui a tela mental de "família". Representa a unidade familiar acompanhada pela ATER.

Campos centrais:

- Denominação da UFPA;
- responsável pela UFPA;
- CPF do responsável;
- telefone;
- município;
- comunidade/localidade;
- endereço;
- CEP;
- DAP/CAF;
- órgão emissor;
- validade da DAP/CAF;
- área do estabelecimento;
- área do imóvel principal;
- classificação da UFPA;
- bioma;
- coordenadas geográficas;
- atividade produtiva principal;
- programa de fomento;
- situação do fomento;
- código SGA;
- status SGA/gestor.

### 4.2 Integrantes da UFPA

O cadastro precisa permitir vários membros por UFPA.

Campos previstos pelo diagnóstico:

- CPF;
- NIS/CadÚnico;
- nome;
- apelido;
- sexo;
- orientação sexual;
- identidade de gênero;
- data de nascimento;
- escolaridade;
- nome da mãe;
- nome do pai;
- classificação da pessoa;
- e-mail;
- telefones;
- se é responsável pela UFPA;
- parentesco.

Para o MVP, pode ser necessário reduzir visualmente a primeira tela, mas o modelo de dados deve nascer preparado para lista de integrantes.

### 4.3 Organização Coletiva

Representa associação, cooperativa, grupo ou organização vinculada às UFPAs.

Campos do cadastro da organização:

- denominação;
- município;
- data do cadastro;
- agente de ATER;
- número de famílias;
- atividades produtivas, extrativismo ou serviços;
- unidade;
- número do instrumento/contrato;
- entidade executora.

Relação funcional:

- uma UFPA pode estar vinculada a uma Organização Coletiva;
- uma Organização Coletiva pode agrupar várias UFPAs;
- "Grupo de Interesse" pode ser mantido como classificação auxiliar, mas não deve substituir a Organização Coletiva.

### 4.4 Técnico / Agente de ATER

Representa o profissional que executa cadastro, diagnóstico, indicadores ou visita.

Campos mínimos:

- nome;
- CPF;
- registro profissional;
- UF do conselho;
- status ativo/inativo.

## 5. Diagnóstico da UFPA

O diagnóstico não deve ser armazenado apenas como texto livre. Ele precisa virar campos estruturados para permitir métricas.

Blocos do diagnóstico:

- dados cadastrais da UFPA;
- atividades produtivas;
- comunicação;
- saneamento;
- patrimônio produtivo;
- plantel;
- uso da área;
- recursos de produção, beneficiamento e comercialização;
- participação coletiva;
- ações potenciais;
- limitações;
- integrantes;
- políticas públicas;
- termo LGPD.

### 5.1 Comunicação

Campos com resposta sim/não:

- rádio;
- televisão;
- celular;
- internet;
- redes sociais;
- outros meios.

### 5.2 Água e saneamento rural

Campos com resposta sim/não:

- água para consumo;
- água para consumo tratada;
- água para produção;
- captação de água da chuva;
- esgoto tratado;
- fontes protegidas.

### 5.3 Patrimônio produtivo

Campos quantitativos:

- máquinas agrícolas;
- implementos agrícolas;
- veículos de passeio;
- construções rurais;
- motores elétricos;
- conjuntos de irrigação;
- animais de trabalho;
- veículos/maquinário de tração animal.

### 5.4 Plantel

Campos quantitativos:

- bovinos;
- ovinos;
- caprinos;
- suínos;
- aves;
- bubalinos;
- equinos, muares e asininos;
- colmeias;
- pequenos animais/outros.

### 5.5 Uso da área

Campos por área:

- pastagens;
- culturas temporárias;
- culturas permanentes;
- lâmina d'água;
- extrativismo;
- reserva legal;
- outros.

### 5.6 Ações potenciais e limitações

Campos por eixo:

- ações potenciais no eixo produtivo;
- ações potenciais no eixo social;
- ações potenciais no eixo ambiental;
- limitações no eixo produtivo;
- limitações no eixo social;
- limitações no eixo ambiental.

Esse bloco é estratégico para plano de ação da UFPA.

## 6. Indicadores da UFPA

Os indicadores da UFPA são a base das métricas familiares/unidade familiar.

### 6.1 Eixo social

Indicadores:

- segurança alimentar e nutricional;
- serviços sociais básicos;
- participação comunitária.

Métricas possíveis:

- UFPAs com insegurança alimentar;
- UFPAs onde faltou comida;
- UFPAs onde alguém comeu menos por falta de condição;
- UFPAs onde alguém sentiu fome e não comeu;
- quantidade de ocorrências de alimentação insuficiente;
- UFPAs com documentação pessoal completa;
- UFPAs cadastradas no CadÚnico;
- UFPAs que acessam políticas públicas sociais;
- UFPAs que participam de grupo comunitário.

### 6.2 Eixo ambiental

Indicador:

- propriedade com práticas sustentáveis.

Métricas possíveis:

- UFPAs com práticas sustentáveis;
- UFPAs com integração de atividades;
- UFPAs com descarte correto de embalagens;
- UFPAs com controle de queimadas;
- UFPAs com adubação verde;
- UFPAs com recuperação de pastagens;
- UFPAs com cobertura de solo/manejo de plantas;
- UFPAs com manejo integrado de pragas;
- UFPAs com proteção de nascentes;
- UFPAs com preservação de APPs;
- UFPAs com manejo florestal;
- UFPAs com recomposição florestal.

Também registrar motivos de não adoção:

- questão financeira;
- falta de informação;
- questão tecnológica;
- falta de interesse.

### 6.3 Eixo econômico

Indicadores:

- valor bruto da produção;
- acesso a políticas públicas produtivas;
- canais de comercialização.

Métricas possíveis:

- valor bruto da produção nos últimos 12 meses;
- UFPAs que acessam políticas públicas produtivas;
- motivos de não acesso;
- UFPAs que acessaram PAA;
- UFPAs que acessaram PNAE;
- UFPAs que acessaram PGPM-Bio;
- UFPAs que acessaram PRONAF;
- linhas de PRONAF acessadas;
- canais de comercialização por UFPA.

## 7. Indicadores da Organização Coletiva

Esses indicadores devem ser vinculados à Organização Coletiva, não diretamente a uma única UFPA.

### 7.1 Eixo ambiental

Indicador:

- Organização Coletiva com práticas sustentáveis.

Métricas:

- separação de lixo;
- descarte correto de lixo;
- manutenção de acessos;
- tratamento de dejetos;
- captação de água da chuva;
- educação ambiental;
- avaliação e prevenção de riscos.

### 7.2 Eixo social

Indicadores:

- identidade organizacional;
- gênero e juventude;
- representação política.

Métricas:

- uso de marca própria;
- Selo Arte;
- Selo Nacional da Agricultura Familiar;
- SENAF Sociobiodiversidade;
- Selo Quilombos do Brasil;
- Selo Indígenas do Brasil;
- Selo Povos e Comunidades Tradicionais;
- mulheres na diretoria/conselho;
- jovens na diretoria/conselho;
- filiação a UNICAFES, UNICOPAS ou Sistema OCB.

### 7.3 Eixo econômico

Indicadores:

- acesso a políticas públicas;
- canais de comercialização.

Métricas:

- CAF jurídica;
- Pronaf Custeio;
- Pronaf Capital de Giro;
- Pronaf Mais Alimentos;
- Pronaf Industrialização;
- Pronaf Agroindústria;
- Pronaf Cotas Partes;
- PAA;
- PNAE;
- PGPM;
- PGPM Sociobiodiversidade;
- Coopera Mais Brasil;
- canais de comercialização da organização.

## 8. Relatório técnico de visita individual

O relatório de visita individual continua sendo entrega central da Fase 1.

Ele deve puxar informações de:

- entidade executora;
- técnico/agente de ATER;
- UFPA;
- integrante responsável;
- local de realização;
- organização coletiva;
- data;
- atividade/meta;
- número da atividade/total planejado;
- código e descrição da meta;
- eixo produtivo;
- eixo social;
- eixo ambiental;
- resultados parciais/finais;
- indicadores trabalhados;
- número de mulheres no atendimento;
- número de jovens no atendimento;
- assinatura do responsável pela UFPA;
- assinatura do profissional responsável.

Observação de escopo: a geração individual por visita permanece dentro do núcleo. Geração em lote/mala direta deve continuar tratada como evolução ou aditivo se exigida.

## 9. Métricas essenciais do MVP

Como elas deixaram claro que métricas são importantes, o MVP deve capturar dados estruturados o suficiente para gerar uma visão resumida.

Métricas iniciais recomendadas:

- total de UFPAs cadastradas;
- UFPAs por município;
- UFPAs por comunidade;
- UFPAs por Organização Coletiva;
- UFPAs por Grupo de Interesse;
- UFPAs com/sem DAP/CAF;
- UFPAs com DAP/CAF vencida;
- UFPAs com/sem CadÚnico;
- UFPAs com/sem água para consumo;
- UFPAs com/sem água tratada;
- UFPAs com/sem água para produção;
- UFPAs com/sem internet;
- UFPAs com/sem esgoto tratado;
- UFPAs com insegurança alimentar;
- UFPAs que acessam políticas públicas sociais;
- UFPAs que acessam políticas produtivas;
- UFPAs por atividade produtiva principal;
- UFPAs por prática ambiental adotada;
- UFPAs por canal de comercialização;
- UFPAs por status SGA;
- UFPAs por aprovação do gestor;
- atendimentos por técnico;
- atendimentos por eixo;
- atendimentos por município;
- relatórios pendentes, concluídos e enviados ao SGA.

## 10. Plano de ação

O diagnóstico deve alimentar plano de ação da UFPA.

Regra funcional:

- cada problema identificado deve poder ser relacionado a um eixo;
- cada eixo pode gerar recomendação, encaminhamento ou próxima visita;
- limitações e ações potenciais devem aparecer no planejamento da assistência;
- indicadores críticos devem ajudar a priorizar famílias mais vulneráveis.

Exemplos:

- UFPA sem água tratada -> ação no eixo social/saneamento;
- UFPA com insegurança alimentar -> ação social e produtiva;
- UFPA sem acesso a PAA/PNAE -> ação econômica/comercialização;
- UFPA sem práticas sustentáveis -> ação ambiental;
- UFPA sem DAP/CAF válida -> ação documental/política pública.

## 11. MVP revisado após reunião

Entram como prioridade:

- renomear telas e campos para UFPA;
- cadastro da UFPA;
- cadastro de integrantes;
- vínculo com Organização Coletiva;
- programa de fomento;
- DAP/CAF;
- diagnóstico estruturado;
- indicadores essenciais da UFPA;
- status SGA/gestor;
- relatório individual de visita;
- visão resumida de métricas essenciais.

Não tentar resolver tudo como dashboard sofisticado na primeira entrega. A prioridade é capturar dados corretamente e mostrar métricas operacionais básicas.

## 12. Evoluções posteriores

Ficam como evolução ou aditivo, se exigidas em detalhe:

- dashboard analítico avançado;
- mala direta/geração em lote;
- reprodução completa e pixel-perfect dos modelos oficiais;
- anexos obrigatórios;
- assinatura digital avançada;
- integração direta com SGA/ANATER;
- permissões complexas por projeto, município ou equipe;
- auditoria avançada;
- aplicativo offline de campo;
- importação em massa de formulários escritos;
- relatórios comparativos antes/depois.

## 13. Impacto no contrato e no escopo

O contrato original já previa:

- cadastro de beneficiários;
- organização de atendimentos/visitas;
- registros técnicos;
- acompanhamento operacional;
- relatórios-base;
- PDF individual por visita.

O ajuste pós-reunião não deve ser tratado como um sistema totalmente novo. Ele refina o significado de "cadastro de beneficiários" para "cadastro da UFPA" e reforça que o diagnóstico precisa ser estruturado para gerar métricas.

Ponto de atenção:

- se o Instituto exigir implementação integral de todos os campos dos cinco documentos, dashboards avançados, relatórios oficiais complexos e mala direta, isso pode ultrapassar a Fase 1;
- se a entrega for cadastro da UFPA + diagnóstico estruturado essencial + métricas básicas + relatório individual, ainda é defensável como evolução natural do núcleo já contratado.

Formulação recomendada:

> "Os modelos enviados serão usados como referência para estruturar o cadastro, diagnóstico e relatório individual do SIGGATER. Na Fase 1, priorizaremos os campos necessários para operação, diagnóstico e métricas essenciais. Campos complementares, reproduções oficiais completas, integrações e dashboards avançados poderão ser tratados como evolução."

## 14. Ordem técnica recomendada

1. Ajustar linguagem: Família -> UFPA / Unidade Familiar.
2. Ajustar cadastro da UFPA com DAP/CAF, organização coletiva e programa de fomento.
3. Criar estrutura de integrantes da UFPA.
4. Criar estrutura de Organização Coletiva.
5. Criar diagnóstico estruturado da UFPA.
6. Criar indicadores essenciais da UFPA.
7. Criar status SGA/gestor.
8. Ajustar relatório individual de visita.
9. Criar visão resumida de métricas.
10. Revisar PDF e relatórios após validação dos campos.

## 15. Perguntas pendentes para próxima validação

- Eles querem cadastrar Organização Coletiva antes das UFPAs ou junto da UFPA?
- Quais campos do diagnóstico são obrigatórios na primeira versão?
- A equipe lançará no sistema exatamente o formulário escrito ou haverá triagem antes?
- Quem aprova: gestor interno do Instituto, coordenação do projeto ou outro perfil?
- O status "reprovado gestor" precisa guardar motivo da reprovação?
- O relatório individual precisa seguir layout oficial já na Fase 1 ou apenas conter os dados essenciais?
- As métricas precisam aparecer em tela já na primeira homologação ou podem vir após o cadastro/diagnóstico?
- Há necessidade de importar dados coletados em papel/planilha depois do campo?
