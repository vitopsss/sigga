# Entrega do MVP SIGGA v5

## Visao geral

Esta entrega corresponde ao estado atual do MVP do SIGGA v5, com foco em operacao real e substituicao gradual do uso de planilhas por uma aplicacao web integrada.

## Destaque da entrega

O principal foco desta etapa foi o modulo `ATER Sociobio`, com os seguintes fluxos:

- painel inicial do modulo;
- cadastro, listagem, edicao e detalhamento de familias;
- integracao do cadastro de familias com o Cadastro Unico;
- cadastro e gestao de tecnicos;
- registro, edicao, historico e detalhamento de atendimentos;
- geracao de PDF do relatorio de atendimento;
- paineis de controle SGA, fomento e indices por municipio.

## Validacao realizada

No ambiente local, a aplicacao foi validada com:

- `npm run lint`
- `npx tsc --noEmit`
- `npm run build`

## Observacao sobre disponibilizacao

O projeto esta pronto como entrega tecnica de codigo e banco, mas para uso compartilhado pela equipe ainda e necessario publicar a aplicacao em um ambiente hospedado com as variaveis de ambiente configuradas.
