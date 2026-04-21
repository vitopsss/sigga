import { z } from "zod";
import {
  NIVEIS_EFETIVIDADE,
  SITUACOES_PROJETO,
  STATUS_CADASTRO,
  STATUS_RELATORIO,
  TIPOS_ATENDIMENTO,
  SITUACOES_FOMENTO,
} from "@/lib/constants/ater";

const optionalString = z.string().trim().optional().transform((v) => v || undefined);
const nullableDate = z.coerce.date().optional();
const decimalLike = z.coerce.number().finite().optional();

export const composicaoFamiliarSchema = z.object({
  nome: optionalString,
  parentesco: optionalString,
  dataNascimento: optionalString,
});

export const criarFamiliaSchema = z.object({
  nomeFamilia: z.string().trim().min(1, "Nome da familia obrigatorio"),
  nomeResponsavel: optionalString,
  documentoResponsavel: optionalString,
  telefone: optionalString,
  quantidadeMembros: z.coerce.number().int().min(1).optional(),
  composicaoFamiliar: z.array(composicaoFamiliarSchema).optional(),
  municipio: optionalString,
  comunidade: optionalString,
  ufpa: optionalString,
  grupoInteresse: optionalString,
  statusCadastro: z.enum(STATUS_CADASTRO).optional(),
  situacaoProjeto: z.enum(SITUACOES_PROJETO).optional(),
  tipoAtendimento: z.enum(TIPOS_ATENDIMENTO).optional(),
  atividadeProdutiva: optionalString,
  projetoColetivoPrincipal: optionalString,
  nis: optionalString,
  codigoSGA: optionalString,
  situacaoFomento: z.enum(SITUACOES_FOMENTO).optional(),
  valorProjetoATER: decimalLike,
  valorInvestidoUFPA: decimalLike,
  valorFomento: decimalLike,
  efetividade: z.enum(NIVEIS_EFETIVIDADE).optional(),
  houveAvanco: z.coerce.boolean().optional(),
  sgaCadastro: z.coerce.boolean().optional(),
  sgaRevisao: z.coerce.boolean().optional(),
  sgaIndicador: z.coerce.boolean().optional(),
  sgaFotos: z.coerce.boolean().optional(),
  statusSGA: optionalString,
  ajusteProjeto: optionalString,
  informacaoSGA: optionalString,
  sgaStatusAnalise: optionalString,
  sgaParcela1: optionalString,
  sgaParcela2: optionalString,
});

export const atualizarFamiliaSchema = criarFamiliaSchema.partial();

export const filtrosFamiliaSchema = z.object({
  municipio: optionalString,
  grupoInteresse: optionalString,
  statusCadastro: z.enum(STATUS_CADASTRO).optional(),
  situacaoFomento: optionalString,
  atividadeProdutiva: optionalString,
  sgaIncompleto: z.coerce.boolean().optional(),
  busca: optionalString,
});

const eixoSchema = z.object({
  tipoAcao: optionalString,
  etapa: optionalString,
  impactosAnteriores: optionalString,
  desenvolvimento: optionalString,
  recomendacoes: optionalString,
});

export const criarAtendimentoSchema = z.object({
  familiaId: z.string().trim().min(1, "Familia obrigatoria"),
  numeroVisita: z.coerce.number().int().min(1).max(16),
  data: nullableDate,
  tecnico: z.string().trim().min(1),
  tecnicoId: optionalString,
  projetoId: optionalString,
  projetoTitulo: optionalString,
  houveAtendimento: z.coerce.boolean().optional(),
  statusRelatorio: z.enum(STATUS_RELATORIO).optional(),
  enviadoSGA: z.coerce.boolean().optional(),
  dataEnvioSGA: nullableDate,
  eixoProdutivo: eixoSchema,
  eixoSocial: eixoSchema,
  eixoAmbiental: eixoSchema,
});

export type CriarFamiliaInput = z.infer<typeof criarFamiliaSchema>;
export type AtualizarFamiliaInput = z.infer<typeof atualizarFamiliaSchema>;
export type FiltrosFamilia = z.infer<typeof filtrosFamiliaSchema>;
export type ComposicaoMembro = z.infer<typeof composicaoFamiliarSchema>;
export type CriarAtendimentoInput = z.infer<typeof criarAtendimentoSchema>;
