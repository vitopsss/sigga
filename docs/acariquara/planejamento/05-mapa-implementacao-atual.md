# Mapa da Implementação Atual - SIGGATER / ATER

## Leitura geral

O projeto já tem uma base funcional relevante para a Fase 1. O módulo `ater-sociobio` não está começando do zero: existem modelos de dados, telas, serviços, ações de formulário e geração de PDF individual por atendimento.

O ponto principal para a próxima etapa não é criar tudo novamente, mas revisar, estabilizar e adaptar o que já existe para o uso institucional mais amplo do Instituto Acariquara.

## O que já existe

### Cadastro central

Existe `CadastroUnico` em `prisma/schema.prisma`, usado como base comum para diferentes perfis e módulos.

Relações relevantes já presentes:

- `Beneficiaria`;
- `FamiliaAter`;
- `User`;
- colaboradores, fornecedores e outros módulos do SIGGA.

Isso confirma a decisão de usar cadastro central como base compartilhada.

### Famílias / unidades atendidas

Existe o modelo `FamiliaAter` e telas em:

- `app/(sigga)/ater-sociobio/familias/page.tsx`;
- `app/(sigga)/ater-sociobio/familias/nova/page.tsx`;
- `app/(sigga)/ater-sociobio/familias/[id]/page.tsx`;
- `app/(sigga)/ater-sociobio/familias/[id]/editar/page.tsx`.

Campos já cobertos:

- nome da família;
- responsável;
- documento do responsável;
- telefone;
- município;
- comunidade;
- UFPA;
- grupo de interesse;
- NIS;
- código SGA;
- atividade produtiva;
- situação de fomento;
- valores ligados ao projeto/fomento.

### Atendimentos / visitas

Existe o modelo `Atendimento` e telas em:

- `app/(sigga)/ater-sociobio/atendimentos/page.tsx`;
- `app/(sigga)/ater-sociobio/atendimentos/nova/page.tsx`;
- `app/(sigga)/ater-sociobio/atendimentos/[atendimentoId]/page.tsx`;
- `app/(sigga)/ater-sociobio/atendimentos/[atendimentoId]/editar/page.tsx`.

Campos já cobertos:

- número da visita;
- data;
- técnico;
- projeto;
- status do relatório;
- houve atendimento;
- eixos produtivo, social e ambiental;
- impactos anteriores;
- desenvolvimento;
- recomendações.

### Técnicos / equipe de campo

Existe o modelo `Tecnico` e telas em:

- `app/(sigga)/ater-sociobio/tecnicos/page.tsx`;
- `app/(sigga)/ater-sociobio/tecnicos/novo/page.tsx`;
- `app/(sigga)/ater-sociobio/tecnicos/[tecnicoId]/editar/page.tsx`.

Também há rotas equivalentes chamadas `extensionistas`, apontando para a mesma ideia operacional.

### PDF individual

Existe geração de PDF individual por atendimento em:

- `app/(sigga)/ater-sociobio/atendimentos/[atendimentoId]/pdf/route.ts`;
- `components/ater/atendimento-report-pdf.tsx`.

Isso cobre o item contratual de PDF individual por visita/atendimento. Não cobre mala direta ou geração em lote.

### Serviços e actions

Serviço principal:

- `lib/services/ater-sociobio.service.ts`.

Actions principais:

- `lib/actions/familias.ts`;
- `lib/actions/atendimentos-familia.ts`;
- `lib/actions/atendimentos.ts`.

## Lacunas antes de virar entrega

### Texto e codificação

Há vários textos com mojibake, por exemplo `FamÃ­lia`, `TÃ©cnico`, `Relatorio`, `NÃ£o`. Antes de apresentar o sistema em reunião ou homologação, a camada visual e o PDF precisam ser revisados para português correto e acentuação limpa.

### Escopo ainda muito preso ao ATERSOCIOBIO

O módulo ainda usa constantes e rótulos como:

- `ATER_SOCIOBIO_TERRITORY_NAME`;
- `FLONA de Tefé`;
- municípios e grupos de interesse específicos;
- labels de `ATER Sociobio`.

Como o Instituto pediu uso mais amplo para ATER, o sistema precisa separar:

- núcleo genérico de ATER do Instituto;
- configurações específicas do projeto ATERSOCIOBIO;
- futuros projetos ou territórios.

### Modelo de projeto e território

Hoje parte das opções está hardcoded em constantes. Para uso institucional, deve ser avaliado se projeto, território, município e tipo de atividade serão:

- campos livres;
- listas configuráveis;
- entidades próprias no banco.

Para Fase 1, a decisão pragmática pode ser manter listas simples, mas não travar o sistema só na FLONA/ATERSOCIOBIO.

### Homologação do PDF

O PDF individual existe, mas precisa ser homologado com o Instituto:

- cabeçalho;
- logotipo;
- campos obrigatórios;
- linguagem institucional;
- assinatura;
- anexos/fotos;
- modelo final aceito.

### Controle de acesso

Existe modelo `User`, mas a análise inicial ainda não confirmou se o módulo ATER está aplicando perfis específicos na operação diária.

Para a Fase 1, é preciso confirmar pelo menos:

- administrador;
- coordenação;
- técnico de campo;
- consulta/leitura.

### Responsividade e uso em campo

A reunião precisa confirmar se a equipe usará o sistema no celular em campo ou se lançará os dados depois. Essa resposta muda prioridade de UX, campos obrigatórios, salvamento parcial e anexos.

## Conclusão técnica

A base atual é suficiente para uma Fase 1 realista, desde que o próximo ciclo foque em:

- corrigir textos e acentuação;
- adaptar rótulos de ATERSOCIOBIO para ATER institucional sem perder o projeto inicial;
- validar campos com a equipe;
- homologar PDF individual;
- evitar promessa de mala direta na primeira entrega;
- só iniciar desenvolvimento pesado após contrato e marco inicial.
