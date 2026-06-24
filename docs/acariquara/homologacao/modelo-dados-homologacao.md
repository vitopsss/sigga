# Estratégia de Homologação de Dados Reais - Fase 1

Este documento define o padrão esperado para a recepção de uma **pequena amostra de dados reais (5 a 10 cadastros)** do Instituto Acariquara, visando testar a aderência do SIGGATER Web (Fase 1) à realidade da operação de ATER Sociobio.

## 1. Por que pedir uma amostra pequena?
- Evita que a equipe do Instituto tenha um grande esforço de digitação agora.
- Garante que a gente teste o "encaixe" dos campos reais nas telas do sistema.
- Previne problemas clássicos de importação (como nomes de municípios escritos de 3 formas diferentes, ou CPFs formatados errados) antes de abrirmos as portas para a base inteira.

## 2. Formato Ideal: Excel (.xlsx) ou CSV
O formato estruturado permite importar de uma vez ou copiar e colar de forma rápida no formulário do sistema, agilizando os testes. Se o instituto fornecer apenas PDF ou foto, usaremos como base para preenchimento manual (simulando a vida do técnico).

## 3. Campos Mínimos a serem mapeados (Cadastro Base)

Para que a UFPA (Unidade Familiar de Produção Agrária) nasça corretamente no sistema, estes são os dados básicos que precisamos na amostra:

| Campo do Sistema | O que significa na prática | Exemplo Esperado |
| :--- | :--- | :--- |
| **Nome/Denominação da UFPA** | Como essa unidade familiar ou propriedade é chamada | "Sítio Boa Vista" ou "Família Silva" |
| **Responsável** | Nome da pessoa de referência | "Maria da Silva" |
| **CPF / Documento** | Documento do responsável | "123.456.789-00" |
| **Telefone** | Contato para eventual mensagem/ligação | "(92) 9XXXX-XXXX" |
| **Município** | O município onde fica a UFPA | "Apuí" |
| **Comunidade** | O nome da localidade específica | "Comunidade São João" |
| **Atividade Produtiva Principal** | O carro-chefe da produção deles | "Manejo de Açaí" |
| **Grupo de Interesse** | Perfil social/extrativista (se houver) | "Mulheres Extrativistas" |
| **Organização Coletiva (Vínculo)**| Se pertencem a alguma associação/cooperativa | "Associação dos Produtores Rurais de Apuí" |
| **CAF/DAP (Opcional)** | Registro da agricultura familiar | "Sim / Não" |

## 4. Aba de Técnicos (Opcional)
Se possível, seria útil receber o nome de 2 ou 3 técnicos da equipe que farão os testes de atendimento, com seus respectivos:
- Nome completo
- CPF
- Situação (Ativo)

## 5. E o Diagnóstico/Indicadores Completos?
O modelo de planilha principal **não pedirá todas as 80 perguntas do diagnóstico e indicadores** neste primeiro momento. O foco é garantir que o chassi do cadastro (A UFPA) se sustente. Se o Acariquara mandar as fichas inteiras preenchidas em PDF/Foto, nós mesmos transcreveremos o restante dos dados nas abas de Indicadores e Patrimônios para mostrar a eles como o sistema calcula as métricas.
