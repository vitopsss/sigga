export const ATER_SOCIOBIO_TERRITORY_NAME = "FLONA de Tefe";

export const ATER_SOCIOBIO_MUNICIPIOS = ["Alvaraes", "Carauari", "Jurua", "Tefe"] as const;

export const ATER_SOCIOBIO_ATIVIDADES_PRODUTIVAS = [
  "SAF - Sist. Agroflorestal",
  "Avicultura Outras",
  "Empreendimento - Artesanato (costura)",
  "Mandala/PAIS/Similares",
  "Empreendimento - Alimentacao (Churrasco)",
  "Empreendimento - Servicos (Salao de beleza)",
  "Empreendimento - Alimentacao (Padaria)",
  "Empreendimento - Comercio (Minimercado)",
  "Empreendimento - Acougue",
  "Meliponicultura",
  "Empreendimento - Agroindustria de leite",
] as const;

export const ATER_SOCIOBIO_GRUPOS_INTERESSE = [
  "Distrito de Freguesia do Andira",
  "Quilombo de Santa Tereza do Matupiri",
  "Comunidade Sao Tome",
  "Comunidade Santa Luzia",
  "Comunidade Sao Domingos",
  "Comunidade Sao Sebastiao",
  "Grupo de Interesse Sao Raimundo do Mutuca",
  "Comunidade Indigena Sao Pedro",
] as const;

export const ATER_SOCIOBIO_PROJETOS_REFERENCIA = [
  "Ater - Sociobiodiversidade",
  "Rede de Quintais Agroecologicos e Produtivos Amazonicos - Da Terra a Mesa",
  "Mulheres Rurais, Autonomia, Alimentacao e Vidas Saudaveis",
  "Quintais Produtivos para Mulheres Rurais",
  "Capacitacao e formacao em ATER",
  "Capacitacao e formacao em ATER II",
] as const;

export const ATER_SOCIOBIO_TIPOS_ACAO = {
  produtivo: [
    "Producao e produtividade/ Diversificacao Produtiva",
    "Comercializacao",
    "Beneficiamento",
    "Praticas agricolas/manejo",
    "Boas praticas agricolas / Manejo",
  ],
  social: [
    "Documentacao familiar e da propriedade",
    "Gestao",
  ],
  ambiental: [
    "Saneamento Rural",
    "Manejo/Tratamento de Dejetos",
  ],
} as const;

export const ATER_SOCIOBIO_ETAPAS = {
  produtivo: [
    "Manejo",
    "Comercializacao",
    "Sanidade Animal",
    "Beneficiamento",
    "Equipamentos e instalacoes",
    "Gestao",
  ],
  social: [
    "Documentos emitidos",
    "Gestao",
  ],
  ambiental: [
    "Manejo/Tratamento de Dejetos",
  ],
} as const;

export function getAterSociobioMunicipios(extraValues: Array<string | null | undefined> = []) {
  const values = [...ATER_SOCIOBIO_MUNICIPIOS, ...extraValues]
    .map((value) => String(value ?? "").trim())
    .filter(Boolean);

  return [...new Set(values)].sort((a, b) => a.localeCompare(b, "pt-BR"));
}
