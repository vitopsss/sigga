# ADR 0002 - CadastroUnico como base compartilhada

## Status

Aceita

## Contexto

O SIGGA v5 já possui o modelo `CadastroUnico` no schema Prisma. A negociação do SIGGATER abriu a possibilidade de uso futuro por outros módulos, como financeiro, compras, favorecidos, fornecedores ou novos projetos do Instituto.

Duplicar cadastros por módulo aumentaria retrabalho, inconsistência e dificuldade de evolução.

## Decisão

O SIGGATER deve usar `CadastroUnico` como base de cadastro compartilhada sempre que fizer sentido, criando entidades específicas de ATER ligadas a esse cadastro por `cadastroId`.

A regra prática para entrada de dados será:

- procurar cadastro existente por CPF/CNPJ quando disponível;
- criar novo cadastro quando não houver correspondência;
- vincular o registro específico de ATER ao cadastro central;
- evitar replicar os mesmos dados pessoais em tabelas específicas do módulo.

## Consequências

- Beneficiários, famílias, técnicos, fornecedores ou outros perfis podem compartilhar a mesma base cadastral.
- Um futuro SIGGAFIN ou módulo financeiro poderá reaproveitar dados sem migração traumática.
- A tela de cadastro deve separar dados centrais de dados específicos da atividade de ATER.
