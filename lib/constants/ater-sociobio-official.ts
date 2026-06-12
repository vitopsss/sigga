export type OfficialOption = {
  field: string;
  label: string;
};

export const PRONAF_LINHAS_UFPA: OfficialOption[] = [
  { field: "pronafCusteio", label: "Pronaf Custeio" },
  { field: "pronafMulher", label: "Pronaf Mulher" },
  { field: "pronafAgroindustria", label: "Pronaf Agroindústria" },
  { field: "pronafAbcAgroecologia", label: "Pronaf ABC+ Agroecologia" },
  { field: "pronafAbcBioeconomia", label: "Pronaf ABC+ Bioeconomia" },
  { field: "pronafMaisAlimentos", label: "Pronaf Mais Alimentos" },
  { field: "pronafJovem", label: "Pronaf Jovem" },
  { field: "pronafMicrocreditoGrupoB", label: "Pronaf Microcrédito (Grupo \"B\")" },
  { field: "pronafCotasPartes", label: "Pronaf Cotas-Partes" },
];

export const ATENDIMENTO_PRODUTIVO_RESULTADOS = [
  "Aumento de renda",
  "Incremento na produção/serviço",
  "Melhoria da qualidade da produção/serviço",
  "Diversificação da produção/serviço",
  "Incremento na comercialização",
  "Reserva hídrica e/ou alimentar",
  "Diversificação dos canais de comercialização",
  "Acesso ao crédito",
  "Preservação da agrobiodiversidade",
  "Inclusão em cadeia de valor",
  "Redução custo de produção",
  "Agregação de valor",
] as const;

export const ATENDIMENTO_PRODUTIVO_INDICADORES = [
  "Valor bruto da produção",
  "Canais de comercialização",
  "Organização com Acesso à Políticas Públicas",
  "Organização com Canais de comercialização",
] as const;

export const ATENDIMENTO_SOCIAL_RESULTADOS = [
  "Acesso à Política Pública",
  "Processos encaminhados",
  "SAN",
  "Orientação/encaminhamento social",
  "Protagonismo juvenil",
  "Documentação",
  "Promoção da Segurança individual/familiar",
  "Melhoria da gestão",
  "Promoção da Autonomia / auto-organização",
  "Diminuição da desigualdade",
  "Associativismo/cooperativismo: promoção/estímulo",
  "Estímulo à participação social",
  "Saúde da Família",
  "Promoção de vida com qualidade",
  "Inclusão/estabelecimento de redes",
  "Fortalecimento laços culturais",
] as const;

export const ATENDIMENTO_SOCIAL_INDICADORES = [
  "Segurança Alimentar e Nutricional",
  "Identidade organizacional",
  "Organização Coletiva - Gênero e juventude",
] as const;

export const ATENDIMENTO_AMBIENTAL_RESULTADOS = [
  "Preservação/Conservação ambiental",
  "Documentação ambiental",
  "Adequação legal",
  "Restauração / recuperação ambiental",
  "Integração de atividades",
  "Saneamento rural",
  "Redução uso de agrotóxicos",
  "Uso de insumos agroecológico",
  "Destinação do lixo",
  "Promoção/estímulo à sociobiodiversidade",
  "adoção de processos agroecológicos",
] as const;

export const ATENDIMENTO_AMBIENTAL_INDICADORES = [
  "Propriedade com práticas sustentáveis",
  "Organização Coletiva com práticas sustentáveis",
] as const;
