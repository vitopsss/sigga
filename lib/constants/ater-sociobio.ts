export const ATER_SOCIOBIO_MODULE_NAME = "SIGGATER Web";

export const ATER_SOCIOBIO_STATUS_RASCUNHO = "RASCUNHO";

export const ATER_SOCIOBIO_STATUS_RELATORIO = [
  { value: "PENDENTE", label: "Pendente" },
  { value: ATER_SOCIOBIO_STATUS_RASCUNHO, label: "Rascunho" },
  { value: "EM_ANALISE", label: "Em análise" },
  { value: "REPROVADO_GESTOR", label: "Reprovado pelo gestor" },
  { value: "CONCLUIDO", label: "Concluído" },
  { value: "ENVIADO_SGA", label: "Enviado SGA" },
] as const;

export const ATER_SOCIOBIO_STATUS_RELATORIO_COLORS: Record<string, string> = {
  PENDENTE: "bg-amber-100 text-amber-700",
  RASCUNHO: "bg-slate-100 text-slate-600",
  EM_ANALISE: "bg-sky-100 text-sky-700",
  REPROVADO_GESTOR: "bg-rose-100 text-rose-700",
  CONCLUIDO: "bg-emerald-100 text-emerald-700",
  ENVIADO_SGA: "bg-purple-100 text-purple-700",
};

export function getAterSociobioStatusRelatorioLabel(value?: string | null) {
  const normalized = String(value ?? "").trim().toUpperCase();
  return ATER_SOCIOBIO_STATUS_RELATORIO.find((status) => status.value === normalized)?.label ?? value ?? "-";
}

export function isAterSociobioAtendimentoValido(status?: string | null) {
  return String(status ?? "").trim().toUpperCase() !== ATER_SOCIOBIO_STATUS_RASCUNHO;
}

export const ATER_SOCIOBIO_TERRITORY_NAME = "FLONA de Tefé - ATERSOCIOBIO";

export const ATER_SOCIOBIO_MUNICIPIOS = [
  "Alvarães",
  "Amaturá",
  "Anamã",
  "Anori",
  "Apuí",
  "Atalaia do Norte",
  "Autazes",
  "Barcelos",
  "Barreirinha",
  "Benjamin Constant",
  "Beruri",
  "Boa Vista do Ramos",
  "Boca do Acre",
  "Borba",
  "Caapiranga",
  "Canutama",
  "Carauari",
  "Careiro",
  "Careiro da Várzea",
  "Coari",
  "Codajás",
  "Eirunepé",
  "Envira",
  "Fonte Boa",
  "Guajará",
  "Humaitá",
  "Ipixuna",
  "Iranduba",
  "Itacoatiara",
  "Itamarati",
  "Itapiranga",
  "Japurá",
  "Juruá",
  "Jutaí",
  "Lábrea",
  "Manacapuru",
  "Manaquiri",
  "Manaus",
  "Manicoré",
  "Maraã",
  "Maués",
  "Nhamundá",
  "Nova Olinda do Norte",
  "Novo Airão",
  "Novo Aripuanã",
  "Parintins",
  "Pauini",
  "Presidente Figueiredo",
  "Rio Preto da Eva",
  "Santa Isabel do Rio Negro",
  "Santo Antônio do Içá",
  "São Gabriel da Cachoeira",
  "São Paulo de Olivença",
  "São Sebastião do Uatumã",
  "Silves",
  "Tabatinga",
  "Tapauá",
  "Tefé",
  "Tonantins",
  "Uarini",
  "Urucará",
  "Urucurituba",
] as const;

export const ATER_SOCIOBIO_ATIVIDADES_PRODUTIVAS = [
  "SAF - Sistema Agroflorestal",
  "Quintais agroecológicos",
  "Extrativismo da castanha",
  "Manejo de açaí",
  "Meliponicultura",
  "Pesca artesanal",
  "Beneficiamento artesanal",
  "Turismo de base comunitária",
] as const;

export const ATER_SOCIOBIO_GRUPOS_INTERESSE = [
  "Extrativismo da castanha",
  "Manejo de açaí",
  "Meliponicultura",
  "Pesca artesanal",
  "Quintais agroecológicos",
  "Manejo florestal comunitário",
  "Beneficiamento artesanal",
  "Turismo de base comunitária",
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
    "Produção e produtividade",
    "Diversificação produtiva",
    "Comercialização",
    "Beneficiamento",
    "Boas práticas agrícolas e manejo",
  ],
  social: [
    "Documentação familiar e da propriedade",
    "Acesso a políticas públicas",
    "Gestão comunitária",
  ],
  ambiental: [
    "Saneamento rural",
    "Manejo e tratamento de dejetos",
    "Conservação de recursos naturais",
  ],
} as const;

export const ATER_SOCIOBIO_ETAPAS = {
  produtivo: [
    "Diagnóstico",
    "Manejo",
    "Comercialização",
    "Beneficiamento",
    "Equipamentos e instalações",
    "Gestão",
  ],
  social: [
    "Documentos emitidos",
    "Acesso a políticas",
    "Organização comunitária",
  ],
  ambiental: [
    "Saneamento rural",
    "Tratamento de dejetos",
    "Manejo florestal",
  ],
} as const;

export function getAterSociobioMunicipios(extraValues: Array<string | null | undefined> = []) {
  const values = [...ATER_SOCIOBIO_MUNICIPIOS, ...extraValues]
    .map((value) => String(value ?? "").trim())
    .filter(Boolean);

  return [...new Set(values)].sort((a, b) => a.localeCompare(b, "pt-BR"));
}
