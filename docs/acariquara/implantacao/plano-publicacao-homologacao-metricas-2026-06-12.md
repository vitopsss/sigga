# Plano interno - publicação, fluxo e métricas

Data: 12/06/2026

## Decisão de comunicação

O e-mail para a Acariquara não deve detalhar login, variáveis de ambiente, banco, papéis de usuário ou lista completa de métricas neste momento.

A resposta externa deve apenas:

- confirmar início da organização da implantação;
- informar que o ambiente e o fluxo inicial serão consolidados antes do envio dos acessos;
- pedir somente o ponto focal inicial;
- prometer retorno com orientações de acesso, agenda e roteiro de validação.

## O que precisa estar pronto antes de liberar acesso externo

1. Publicação do app em ambiente acessível por URL.
2. Configuração do ambiente SIGGATER isolado.
3. Teste de login com usuário administrador real.
4. Conferência das rotas restritas do SIGGATER.
5. Validação do fluxo operacional principal.
6. Revisão do painel de métricas para homologação.
7. Definição do roteiro de primeira validação com a Acariquara.

## Publicação do app

Pendências para homologação:

- enviar os commits locais para o repositório remoto;
- publicar o app em um provedor web;
- configurar variáveis de produção/homologação:
  - `DATABASE_URL`;
  - `DIRECT_URL`;
  - `SIGGA_APP_SCOPE=siggater`;
  - `NEXT_PUBLIC_SIGGA_APP_SCOPE=siggater`;
  - `SIGGATER_SESSION_SECRET` forte;
- rodar build no ambiente publicado;
- testar acesso pela URL final.

## Fluxo mínimo de homologação

O primeiro teste com a Acariquara deve validar um caminho completo, com poucos dados controlados:

1. Login.
2. Acesso ao módulo ATER Sociobio.
3. Cadastro ou conferência de uma organização coletiva.
4. Cadastro ou conferência de uma UFPA.
5. Diagnóstico da UFPA.
6. Registro de atendimento técnico.
7. Geração do relatório/PDF.
8. Reflexo dos dados no painel de métricas.

Esse roteiro evita abrir várias frentes ao mesmo tempo e mostra se o sistema entrega o fluxo contratado.

## Organização das métricas

As métricas não devem ser tratadas como uma única página com tudo misturado.

Estrutura recomendada para a homologação:

- visão executiva: totais gerais, alertas e pendências;
- visão UFPAs: diagnóstico, vulnerabilidades, CadÚnico, água, internet, políticas públicas e prioridades;
- visão organizações coletivas: UFPAs vinculadas, indicadores preenchidos, diretoria, jovens, mulheres, canais de venda, marca/selo e práticas ambientais;
- visão atendimentos: visitas, status, técnicos, eixo trabalhado, público alcançado e pendências de análise;
- visão documental: relatório/PDF do atendimento individual.

O painel atual já segue essa lógica por abas: UFPAs, Organizações e Atendimentos. A validação agora deve confirmar se os nomes, prioridades e indicadores fazem sentido para a operação da Acariquara.

## Ordem prática de ataque

1. Fechar a árvore Git e enviar para o remoto.
2. Subir o app em ambiente de homologação.
3. Configurar variáveis de ambiente e testar build publicado.
4. Entrar com usuário administrador e testar navegação.
5. Rodar o roteiro completo com dado controlado.
6. Ajustar métricas e textos do painel que parecerem confusos.
7. Só então enviar acessos e agenda para a Acariquara.

## Critério para enviar acesso

Enviar acesso externo apenas quando:

- login funcionar pela URL publicada;
- o módulo SIGGATER abrir sem expor áreas indevidas do SIGGA;
- pelo menos um fluxo organização -> UFPA -> diagnóstico -> atendimento -> PDF -> métricas tiver sido testado;
- houver clareza sobre qual tela a equipe deve validar primeiro;
- existir um texto simples de orientação para o usuário inicial.
