# Backlog - Fase 1 SIGGATER Web

## Objetivo da Fase 1

Implantar o núcleo operacional do SIGGATER Web para uso nas atividades de ATER do Instituto Acariquara, começando pelo fluxo de UFPA, integrantes, organização coletiva, diagnóstico estruturado, indicadores essenciais, visitas técnicas, acompanhamento e geração de relatório individual.

A reunião de 25/05/2026 redefiniu a prioridade funcional: o sistema precisa capturar dados estruturados para métricas, não apenas guardar relatórios ou observações.

## Prioridade 0 - Condições de início

- contrato assinado;
- pagamento do marco inicial;
- pessoa jurídica e nota fiscal de serviço regularizadas;
- responsáveis do Instituto definidos;
- modelos oficiais entregues e versionados;
- campos obrigatórios da primeira homologação validados;
- cronograma de validações combinado.

## Prioridade 1 - Linguagem e estrutura principal

- renomear linguagem visível de "Família" para "UFPA" ou "Unidade Familiar";
- trocar "Nome da família" por "Denominação da UFPA";
- manter compatibilidade técnica com registros existentes quando necessário;
- revisar menus, títulos, botões, mensagens e PDFs para evitar linguagem antiga;
- documentar que UFPA significa Unidade Familiar de Produção Agrária.

## Prioridade 2 - Cadastro da UFPA

- cadastrar Denominação da UFPA;
- registrar responsável pela UFPA;
- registrar CPF do responsável;
- registrar telefone/WhatsApp;
- registrar município, comunidade/localidade, endereço e CEP;
- registrar DAP/CAF;
- registrar órgão emissor da DAP/CAF;
- registrar validade da DAP/CAF;
- registrar área do estabelecimento;
- registrar área do imóvel principal;
- registrar classificação da UFPA;
- registrar bioma;
- registrar coordenadas geográficas;
- registrar atividade produtiva principal;
- registrar programa de fomento;
- registrar situação e valor de fomento quando aplicável;
- registrar código SGA;
- registrar status SGA/gestor.

## Prioridade 3 - Integrantes da UFPA

- criar estrutura de membros/integrantes vinculados à UFPA;
- cadastrar CPF;
- cadastrar NIS/CadÚnico;
- cadastrar nome;
- cadastrar apelido;
- cadastrar sexo;
- cadastrar orientação sexual;
- cadastrar identidade de gênero;
- cadastrar data de nascimento;
- cadastrar escolaridade;
- cadastrar nome da mãe;
- cadastrar nome do pai;
- cadastrar classificação da pessoa;
- cadastrar e-mail;
- cadastrar telefones;
- marcar responsável pela UFPA;
- registrar parentesco.

Observação:

- o MVP pode simplificar a primeira interface, mas o modelo deve permitir múltiplos integrantes desde o início.

## Prioridade 4 - Organização Coletiva

- criar cadastro de Organização Coletiva;
- registrar denominação;
- registrar município;
- registrar agente de ATER;
- registrar data do cadastro;
- registrar número de famílias;
- registrar atividades produtivas, extrativismo ou serviços;
- vincular UFPAs à Organização Coletiva;
- diferenciar Organização Coletiva de Grupo de Interesse;
- manter Grupo de Interesse como classificação complementar se necessário.

## Prioridade 5 - Diagnóstico estruturado da UFPA

- criar seção de comunicação;
- criar seção de água e saneamento;
- criar seção de patrimônio produtivo;
- criar seção de plantel;
- criar seção de uso da área;
- criar seção de recursos de produção, beneficiamento e comercialização;
- criar seção de participação coletiva;
- criar seção de políticas públicas;
- criar seção de ações potenciais;
- criar seção de limitações;
- permitir campos sim/não, quantidade, múltipla escolha e texto complementar;
- evitar diagnóstico apenas em texto livre.

Campos essenciais para primeira métrica:

- água para consumo;
- água tratada;
- água para produção;
- esgoto tratado;
- internet;
- CadÚnico;
- políticas públicas sociais;
- políticas produtivas;
- insegurança alimentar;
- atividade produtiva principal;
- práticas ambientais;
- canais de comercialização.

## Prioridade 6 - Indicadores da UFPA

- estruturar indicadores sociais;
- estruturar indicadores ambientais;
- estruturar indicadores econômicos/produtivos;
- registrar segurança alimentar e nutricional;
- registrar serviços sociais básicos;
- registrar participação comunitária;
- registrar práticas sustentáveis;
- registrar valor bruto da produção;
- registrar acesso a políticas públicas produtivas;
- registrar canais de comercialização.

## Prioridade 7 - Indicadores da Organização Coletiva

- registrar práticas ambientais da organização;
- registrar identidade comercial;
- registrar presença de mulheres e jovens na direção/conselho;
- registrar representação política;
- registrar acesso a políticas públicas;
- registrar canais de comercialização da organização.

Esta prioridade pode entrar após o cadastro básico da Organização Coletiva se a primeira homologação precisar ser reduzida.

## Prioridade 8 - Status SGA e aprovação de gestor

- criar status "Enviado SGA";
- criar status "Aprovado gestor";
- criar status "Reprovado gestor";
- permitir motivo de reprovação;
- identificar se o status se aplica ao cadastro, diagnóstico ou relatório;
- exibir pendências para coordenação.

## Prioridade 9 - Atendimentos e visitas

- registrar atendimento ou visita técnica;
- vincular UFPA;
- vincular técnico/responsável;
- informar data, local, público atendido e tipo de atividade;
- registrar número da atividade/total planejado quando aplicável;
- registrar código e descrição da meta;
- registrar número de mulheres no atendimento;
- registrar número de jovens no atendimento;
- registrar eixo produtivo;
- registrar eixo social;
- registrar eixo ambiental;
- registrar orientações, resultados, encaminhamentos e indicadores trabalhados;
- listar histórico de atendimentos por UFPA.

## Prioridade 10 - Relatório individual

- gerar PDF individual por atendimento/visita;
- incluir dados da entidade executora quando definidos;
- incluir dados da UFPA;
- incluir integrante responsável;
- incluir técnico/agente de ATER;
- incluir local, data, atividade/meta e eixos;
- incluir indicadores trabalhados;
- incluir campos de assinatura conforme validação;
- manter geração individual no núcleo da Fase 1.

## Prioridade 11 - Métricas básicas

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
- UFPAs com/sem internet;
- UFPAs com/sem esgoto tratado;
- UFPAs com insegurança alimentar;
- UFPAs que acessam políticas públicas sociais;
- UFPAs que acessam políticas produtivas;
- UFPAs por atividade produtiva principal;
- UFPAs por prática ambiental;
- UFPAs por canal de comercialização;
- UFPAs por status SGA/gestor;
- atendimentos por técnico;
- atendimentos por eixo;
- relatórios pendentes, concluídos e enviados.

## Prioridade 12 - Perfis de acesso

- acesso administrativo;
- acesso de coordenação;
- acesso de técnico de campo;
- acesso de consulta/diretoria;
- restrição por perfil conforme necessidade validada.

## Fora da Fase 1, salvo nova validação

- dashboard analítico avançado;
- geração em lote/mala direta;
- reprodução pixel-perfect completa dos modelos oficiais;
- integração direta com SGA/ANATER;
- importação em massa de formulários escritos;
- aplicativo offline de campo;
- anexos obrigatórios;
- assinatura digital avançada;
- auditoria avançada;
- permissões complexas por projeto, município ou equipe;
- relatórios comparativos antes/depois.

## Pendências para próxima validação

- confirmar quais campos do diagnóstico são obrigatórios na primeira homologação;
- confirmar se Organização Coletiva será cadastrada antes das UFPAs ou junto delas;
- confirmar quem será o gestor responsável por aprovação/reprovação;
- confirmar se "reprovado gestor" precisa guardar motivo e histórico;
- confirmar se o lançamento será feito exatamente a partir do formulário escrito;
- confirmar se haverá planilha de transcrição para os dados coletados em campo;
- confirmar quais métricas precisam aparecer na primeira tela de homologação;
- confirmar se o PDF individual precisa seguir layout oficial já na Fase 1 ou apenas conter os dados essenciais;
- confirmar se mala direta continua fora da Fase 1.
