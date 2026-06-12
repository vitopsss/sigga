# Plano de Próximos Passos

## Objetivo

Organizar a execução imediata do SIGGATER Web sem misturar três frentes diferentes: reunião técnica, formalização contratual e desenvolvimento do sistema.

## Trilha 1 - Reunião de 25/05/2026

Objetivo da reunião: levantar dados, validar o fluxo real e transformar a ida a campo de 27/05 a 05/06 em insumo de implantação.

Levar para a reunião:

- roteiro em `docs/acariquara/reunioes/04-roteiro-reuniao-25-05.md`;
- backlog em `docs/acariquara/planejamento/03-backlog-fase-1.md`;
- explicação de que o sistema já possui base para cadastro, visitas e PDF individual;
- postura de que a implantação começa formalmente após assinatura e marco inicial.

Resultado esperado da reunião:

- lista de campos obrigatórios;
- modelo atual de ficha/relatório;
- confirmação de usuários-chave;
- decisão sobre uso em campo ou lançamento posterior;
- confirmação de que mala direta fica fora da Fase 1 ou será tratada como aditivo;
- responsáveis pela homologação.

## Trilha 2 - Formalização e contrato

Objetivo: assinar com pessoa jurídica adequada ao serviço de implantação de sistema e emissão de NFS-e.

Próximas ações:

- procurar contador imediatamente;
- avaliar transformação/desenquadramento do MEI;
- priorizar LTDA Unipessoal / SLU, porte ME, com Simples Nacional se viável;
- incluir CNAEs compatíveis com TI e manter atividade de comércio/marketplace se o contador validar;
- confirmar inscrição municipal e emissão de NFS-e;
- enviar dados finais da pessoa jurídica para assinatura.

Mensagem padrão para o Instituto, se perguntarem:

```text
Estou ajustando os dados cadastrais da pessoa jurídica responsável pela prestação do serviço, para que contrato e nota fiscal fiquem formalizados corretamente. Isso não altera valor, escopo ou condições comerciais já alinhadas.
```

## Trilha 3 - Preparação técnica antes do contrato

Permitido antes de contrato:

- mapear arquitetura;
- revisar código existente;
- preparar backlog;
- revisar campos e fluxos;
- organizar ADRs;
- corrigir documentação interna.

Evitar antes de contrato:

- desenvolvimento pesado;
- entrega de funcionalidade produtiva;
- customizações extensas;
- migrações de banco irreversíveis;
- promessa de prazo operacional sem insumos.

## Trilha 4 - Primeiro ciclo de desenvolvimento após assinatura

Ordem recomendada:

1. Corrigir textos, acentuação e rótulos visíveis do módulo ATER.
2. Separar rótulos/configurações de ATERSOCIOBIO do núcleo institucional de ATER.
3. Ajustar cadastro de família/beneficiário conforme campos homologados.
4. Ajustar atendimento/visita conforme ficha real.
5. Revisar PDF individual com modelo institucional.
6. Validar fluxo completo: cadastro -> visita -> relatório -> PDF.
7. Definir usuários e perfis mínimos.
8. Preparar primeira homologação com dados reais controlados.

## Decisão senior

O próximo melhor trabalho técnico não é criar uma feature nova. É estabilizar e institucionalizar o que já existe:

- tirar o sistema de um protótipo específico do ATERSOCIOBIO;
- deixar pronto para ATER do Instituto;
- manter a Fase 1 dentro do núcleo contratado;
- preservar possibilidade de evolução sem abrir escopo agora.
