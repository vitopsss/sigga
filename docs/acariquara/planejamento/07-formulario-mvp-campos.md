# Formulário MVP - Campos Mínimos do SIGGATER Web

## Posição para a reunião

Esta estrutura não deve ser apresentada como modelo definitivo e imutável. Ela deve ser apresentada como a base mínima proposta para iniciar a implantação do SIGGATER Web com segurança.

Frase recomendada:

> Para não começarmos de forma aberta demais, eu trouxe uma proposta de campos mínimos do MVP. A ideia é validarmos juntos o que é obrigatório, o que pode ficar opcional e o que deve entrar como evolução depois da primeira entrega.

## Princípio do MVP

O MVP deve permitir o fluxo completo:

1. cadastrar família, beneficiário ou unidade atendida;
2. registrar uma visita/atendimento técnico;
3. registrar informações técnicas essenciais;
4. gerar relatório individual em PDF;
5. permitir acompanhamento pela coordenação.

Tudo que não for necessário para esse fluxo deve ficar fora da primeira versão ou entrar como campo opcional.

## Bloco 1 - Identificação da família/unidade atendida

Campos obrigatórios:

- nome da família, beneficiário ou unidade atendida;
- nome do responsável;
- município;
- comunidade/localidade;
- telefone/WhatsApp, quando houver;
- projeto ou atividade ATER vinculada.

Campos recomendados, mas não bloqueantes:

- CPF do responsável;
- NIS;
- UFPA ou identificação da unidade produtiva;
- grupo de interesse;
- atividade produtiva principal;
- status do cadastro.

Campos para evolução:

- composição familiar completa;
- documentos anexos;
- georreferenciamento;
- histórico socioeconômico detalhado;
- múltiplos responsáveis por unidade.

## Bloco 2 - Dados da visita/atendimento

Campos obrigatórios:

- família/unidade atendida;
- data da visita;
- técnico responsável;
- houve atendimento: sim/não;
- tipo de atendimento: individual/coletivo;
- status do relatório: rascunho, pendente, concluído ou enviado;
- descrição do que foi realizado.

Campos recomendados, mas não bloqueantes:

- número da visita;
- projeto/centro de custo;
- local da visita;
- participantes;
- observações gerais;
- próxima ação recomendada.

Campos para evolução:

- assinatura do beneficiário;
- fotos e anexos;
- coordenadas GPS;
- check-in/check-out em campo;
- validação offline/mobile.

## Bloco 3 - Registro técnico por eixo

Para o MVP, manter três eixos simples:

- produtivo;
- social;
- ambiental.

Campos por eixo:

- tipo de ação;
- etapa;
- situação encontrada;
- orientação ou desenvolvimento realizado;
- recomendações;
- encaminhamentos.

Regra prática:

Não é obrigatório preencher os três eixos em toda visita. O técnico deve preencher apenas os eixos aplicáveis ao atendimento.

## Bloco 4 - Relatório individual em PDF

Campos mínimos que devem aparecer no PDF:

- identificação do Instituto/SIGGATER;
- família/unidade atendida;
- município e comunidade;
- data da visita;
- técnico responsável;
- tipo de atendimento;
- resumo técnico da visita;
- recomendações/encaminhamentos;
- status do relatório;
- espaço para validação/assinatura, se o Instituto exigir.

Decisão a validar:

- o PDF precisa ter assinatura?
- precisa de logotipo?
- precisa de campo para fotos?
- precisa seguir algum modelo oficial?
- será usado só por atendimento individual nesta fase?

## Bloco 5 - Acompanhamento pela coordenação

Campos ou filtros mínimos:

- período;
- município;
- comunidade;
- técnico;
- status do relatório;
- família/unidade;
- projeto/atividade ATER.

Indicadores mínimos:

- total de famílias cadastradas;
- total de atendimentos;
- atendimentos por município;
- atendimentos por técnico;
- relatórios pendentes/concluídos.

## O que não deve entrar como obrigatório no MVP

Evitar exigir na primeira versão:

- todos os formulários oficiais possíveis;
- geração em lote/mala direta;
- anexos obrigatórios;
- fotos obrigatórias;
- assinatura digital avançada;
- integração com sistemas externos;
- regras específicas de todos os projetos de ATER do Instituto;
- dashboards complexos.

Esses itens podem virar evolução ou aditivo depois que o fluxo básico estiver homologado.

## Como conduzir a validação na reunião

Perguntas objetivas:

1. Esta estrutura cobre a visita técnica que começa no dia 27/05?
2. Quais campos são realmente obrigatórios em campo?
3. Quais campos podem ser preenchidos depois pela equipe administrativa?
4. Quem homologa o modelo do PDF?
5. O primeiro uso será no celular durante a visita ou lançamento posterior?
6. Existe algum formulário atual que deve ser copiado como referência?
7. A mala direta continua como evolução posterior?

## Decisão recomendada

Para a Fase 1, defender esta base:

- cadastro enxuto;
- visita técnica simples;
- três eixos técnicos flexíveis;
- relatório individual em PDF;
- acompanhamento por filtros e indicadores básicos.

Essa é a menor estrutura que entrega valor real, reduz retrabalho e mantém o prazo de 45 dias plausível.
