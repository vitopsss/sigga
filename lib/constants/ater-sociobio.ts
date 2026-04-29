export const ATER_SOCIOBIO_TERRITORY_NAME = "FLONA de Tefé";

export const ATER_SOCIOBIO_MUNICIPIOS = ["Alvarães", "Carauari", "Juruá", "Tefé"] as const;

export const ATER_SOCIOBIO_ATIVIDADES_PRODUTIVAS = [
  "SAF - Sist. Agroflorestal",
  "Avicultura Outras",
  "Empreendimento - Artesanato (costura)",
  "Mandala/PAIS/Similares",
  "Empreendimento - Alimentação (Churrasco)",
  "Empreendimento - Serviços (Salão de beleza)",
  "Empreendimento - Alimentação (Padaria)",
  "Empreendimento - Comércio (Minimercado)",
  "Empreendimento - Açougue",
  "Meliponicultura",
  "Empreendimento - Agroindústria de leite",
] as const;

export const ATER_SOCIOBIO_GRUPOS_INTERESSE = [
  "Distrito de Freguesia do Andirá",
  "Quilombo de Santa Tereza do Matupiri",
  "Comunidade São Tomé",
  "Comunidade Santa Luzia",
  "Comunidade São Domingos",
  "Comunidade São Sebastião",
  "Grupo de Interesse São Raimundo do Mutuca",
  "Comunidade Indígena São Pedro",
] as const;

export const ATER_SOCIOBIO_PROJETOS_REFERENCIA = [
  "Ater - Sociobiodiversidade",
  "Rede de Quintais Agroecológicos e Produtivos Amazônicos - Da Terra à Mesa",
  "Mulheres Rurais, Autonomia, Alimentação e Vidas Saudáveis",
  "Quintais Produtivos para Mulheres Rurais",
  "Capacitação e formação em ATER",
  "Capacitação e formação em ATER II",
] as const;

export const ATER_SOCIOBIO_TIPOS_ACAO = {
  produtivo: [
    "Produção e produtividade/ Diversificação Produtiva",
    "Comercialização",
    "Beneficiamento",
    "Práticas agrícolas/manejo",
    "Boas práticas agrícolas / Manejo",
  ],
  social: [
    "Documentação familiar e da propriedade",
    "Gestão",
  ],
  ambiental: [
    "Saneamento Rural",
    "Manejo/Tratamento de Dejetos",
  ],
} as const;

export const ATER_SOCIOBIO_ETAPAS = {
  produtivo: [
    "Manejo",
    "Comercialização",
    "Sanidade Animal",
    "Beneficiamento",
    "Equipamentos e instalações",
    "Gestão",
  ],
  social: [
    "Documentos emitidos",
    "Gestão",
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
