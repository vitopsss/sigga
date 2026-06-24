import * as xlsx from "xlsx";
import path from "path";
import fs from "fs";

function generateExcelTemplate() {
  // Dados de exemplo para guiar o preenchimento
  const ufpasData = [
    {
      "Nome/Denominacao da UFPA": "Sitio Boa Vista",
      "Nome do Responsavel": "Maria Aparecida Souza",
      "CPF / Documento": "123.456.789-00",
      "Telefone": "(92) 99999-1234",
      "Municipio": "Apui",
      "Comunidade": "Comunidade Sao Joao",
      "Atividade Produtiva Principal": "Extrativismo de Acai",
      "Grupo de Interesse": "Mulheres Rurais",
      "Organizacao Coletiva (Vinculo)": "Associacao dos Produtores de Apui",
      "CAF/DAP?": "Sim",
      "Observacoes Adicionais": "Familia de teste para homologacao."
    },
    {
      "Nome/Denominacao da UFPA": "Fazenda Rio Novo",
      "Nome do Responsavel": "Jose Ribamar",
      "CPF / Documento": "987.654.321-11",
      "Telefone": "(92) 98888-5678",
      "Municipio": "Manicore",
      "Comunidade": "Comunidade Rio Doce",
      "Atividade Produtiva Principal": "Producao de Farinha",
      "Grupo de Interesse": "Agricultores Familiares",
      "Organizacao Coletiva (Vinculo)": "",
      "CAF/DAP?": "Nao",
      "Observacoes Adicionais": "Sem vinculo com associacao."
    }
  ];

  const tecnicosData = [
    {
      "Nome Completo": "Carlos Almeida",
      "CPF": "111.222.333-44",
      "Registro Profissional": "CREA 1234",
      "Situacao": "Ativo"
    },
    {
      "Nome Completo": "Fernanda Lima",
      "CPF": "555.666.777-88",
      "Registro Profissional": "",
      "Situacao": "Ativo"
    }
  ];

  // Cria as planilhas
  const wsUfpas = xlsx.utils.json_to_sheet(ufpasData);
  const wsTecnicos = xlsx.utils.json_to_sheet(tecnicosData);

  // Configura tamanho das colunas para melhor visualizacao
  wsUfpas['!cols'] = [
    { wch: 30 }, // Nome/Denominacao
    { wch: 25 }, // Responsavel
    { wch: 18 }, // CPF
    { wch: 18 }, // Telefone
    { wch: 20 }, // Municipio
    { wch: 25 }, // Comunidade
    { wch: 30 }, // Atividade
    { wch: 25 }, // Grupo
    { wch: 35 }, // Org. Coletiva
    { wch: 12 }, // CAF
    { wch: 40 }  // Obs
  ];

  wsTecnicos['!cols'] = [
    { wch: 30 }, // Nome
    { wch: 18 }, // CPF
    { wch: 20 }, // Registro
    { wch: 12 }  // Situacao
  ];

  // Cria o workbook e adiciona as sheets
  const wb = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(wb, wsUfpas, "1. UFPAs_Familias");
  xlsx.utils.book_append_sheet(wb, wsTecnicos, "2. Tecnicos");

  // Garante que o diretorio existe
  const dirPath = path.resolve(process.cwd(), "docs/acariquara/homologacao");
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  // Salva o arquivo
  const outPath = path.resolve(dirPath, "Modelo_Homologacao_SIGGATER.xlsx");
  xlsx.writeFile(wb, outPath);
  
  console.log("Planilha modelo de homologação gerada com sucesso em:", outPath);
}

generateExcelTemplate();
