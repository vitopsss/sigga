export const EIXO_PRODUTIVO_TIPOS = [
  "Produção e produtividade",
  "Produção e produtividade/ Diversificação Produtiva",
  "Atividade Rural Não Agrícola",
] as const;

export const EIXO_PRODUTIVO_ETAPAS: Record<string, string[]> = {
  "Produção e produtividade": [
    "Sanidade Animal",
    "Gestão",
    "Comercialização",
    "Beneficiamento",
    "Manejo",
    "Plano de adequação",
  ],
  "Produção e produtividade/ Diversificação Produtiva": [
    "Preparo do solo",
    "Plantio e Semeadura",
    "Manejo",
    "Beneficiamento",
    "Práticas agrícolas/manejo",
  ],
  "Atividade Rural Não Agrícola": ["Gestão", "Manejo"],
};

export const ATIVIDADES_PRODUTIVAS = [
  "SAF - Sist. Agroflorestal",
  "Avicultura Outras",
  "Mandala/PAIS/Similares",
  "Meliponicultura",
  "Empreendimento - Alimentação (Churrasco)",
  "Atividade Rural não Agrícola / Padaria",
] as const;

export const EIXO_SOCIAL_TIPOS = [
  "Documentação familiar e da propriedade",
] as const;

export const EIXO_SOCIAL_ETAPAS = [
  "Documentos emitidos",
  "Documentos pendentes",
] as const;

export const EIXO_AMBIENTAL_TIPOS = [
  "Saneamento Rural",
] as const;

export const EIXO_AMBIENTAL_ETAPAS = [
  "Manejo/Tratamento de Dejetos",
  "Círculo da Bananeira",
] as const;

export const PROJETOS_COLETIVOS = [
  "Projeto de Fortalecimento das Mulheres Quilombolas e Ribeirinhas do Rio Andirá",
  "Projeto de Fortalecimento das Mulheres do Alto Urupadí",
  "Projeto de Fortalecimento das Mulheres da Comunidade São Tomé",
  "Projeto de Fortalecimento das Mulheres da Comunidade de Santa Maria",
] as const;

export const STATUS_RELATORIO = [
  "PENDENTE",
  "RASCUNHO",
  "CONCLUIDO",
  "ENVIADO_SGA",
] as const;

export const STATUS_CADASTRO = ["ATIVO", "INATIVO", "RESERVA"] as const;
export const SITUACOES_PROJETO = ["APROVADO", "NAO_APROVADO", "EM_ELABORACAO"] as const;
export const TIPOS_ATENDIMENTO = ["INDIVIDUAL", "COLETIVO"] as const;
export const NIVEIS_EFETIVIDADE = ["BAIXA", "MEDIA", "ALTA"] as const;
export const SITUACOES_FOMENTO = ["Aprovado", "Não aprovado", "Em análise"] as const;
export const STATUS_ATIVIDADE_CONTROLE = ["CONCLUIDO", "PENDENTE", "NA"] as const;
export const ATIVIDADES_SGA = Array.from({ length: 16 }, (_, index) => `AT${index + 1}`) as string[];
export const ATIVIDADES_CONTROLE = Array.from(
  { length: 13 },
  (_, index) => `AT${index + 4}`,
) as string[];
