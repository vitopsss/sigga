import { prisma } from "@/lib/prisma";

import { salvarAtendimento } from "../actions";

type EixoConfig = {
  id: "produtivo" | "social" | "ambiental";
  titulo: string;
  descricao: string;
  classes: {
    card: string;
    badge: string;
    accent: string;
    ring: string;
  };
};

const eixos: EixoConfig[] = [
  {
    id: "produtivo",
    titulo: "Eixo Produtivo",
    descricao: "Registre orientacoes tecnicas, etapa da atividade e resultados observados na producao.",
    classes: {
      card: "border-l-4 border-l-amber-500 bg-amber-50/60",
      badge: "bg-amber-100 text-amber-800",
      accent: "text-amber-900",
      ring: "focus:border-amber-400 focus:ring-amber-100",
    },
  },
  {
    id: "social",
    titulo: "Eixo Social",
    descricao: "Documente evolucao organizativa, participacao social e encaminhamentos relacionados ao nucleo familiar.",
    classes: {
      card: "border-l-4 border-l-sky-500 bg-sky-50/60",
      badge: "bg-sky-100 text-sky-800",
      accent: "text-sky-900",
      ring: "focus:border-sky-400 focus:ring-sky-100",
    },
  },
  {
    id: "ambiental",
    titulo: "Eixo Agroambiental",
    descricao: "Consolide observacoes sobre manejo ambiental, adequacoes e recomendacoes para o territorio.",
    classes: {
      card: "border-l-4 border-l-emerald-500 bg-emerald-50/60",
      badge: "bg-emerald-100 text-emerald-800",
      accent: "text-emerald-900",
      ring: "focus:border-emerald-400 focus:ring-emerald-100",
    },
  },
];

const baseInputClassName =
  "mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100";

function EixoCard({ eixo }: { eixo: EixoConfig }) {
  return (
    <section className={`rounded-3xl border border-slate-200 p-6 shadow-sm ${eixo.classes.card}`}>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <span
            className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${eixo.classes.badge}`}
          >
            Relatorio Tecnico
          </span>
          <h2 className={`mt-3 text-xl font-semibold ${eixo.classes.accent}`}>{eixo.titulo}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{eixo.descricao}</p>
        </div>
      </div>

      <div className="grid gap-5">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Tipo de Acao</span>
          <input
            name={`${eixo.id}_tipoAcao`}
            type="text"
            required
            className={`${baseInputClassName} ${eixo.classes.ring}`}
            placeholder="Ex.: Orientacao tecnica, visita de acompanhamento, oficina"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Etapa da Atividade</span>
          <input
            name={`${eixo.id}_etapa`}
            type="text"
            required
            className={`${baseInputClassName} ${eixo.classes.ring}`}
            placeholder="Ex.: Diagnostico, implantacao, monitoramento, avaliacao"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Impactos das orientacoes anteriores</span>
          <textarea
            name={`${eixo.id}_impactosAnt`}
            required
            rows={4}
            className={`${baseInputClassName} ${eixo.classes.ring} resize-y`}
            placeholder="Descreva os avancos, dificuldades e mudancas percebidas desde a ultima orientacao."
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Desenvolvimento / Situacoes observadas</span>
          <textarea
            name={`${eixo.id}_desenvolvimento`}
            required
            rows={5}
            className={`${baseInputClassName} ${eixo.classes.ring} resize-y`}
            placeholder="Registre o contexto atual da atividade, evidencias verificadas e pontos criticos observados."
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Recomendacoes / Encaminhamentos</span>
          <textarea
            name={`${eixo.id}_recomendacoes`}
            required
            rows={4}
            className={`${baseInputClassName} ${eixo.classes.ring} resize-y`}
            placeholder="Informe as orientacoes repassadas, prazos e proximos passos acordados."
          />
        </label>
      </div>
    </section>
  );
}

export default async function NovoRelatorioAterSociobioPage() {
  const [beneficiarias, projetos] = await Promise.all([
    prisma.beneficiaria.findMany({
      include: { cadastro: true },
      orderBy: { cadastro: { nome: "asc" } },
    }),
    prisma.projeto.findMany({
      orderBy: { titulo: "asc" },
    }),
  ]);

  const hoje = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.10),_transparent_32%),linear-gradient(180deg,_#f8fafc_0%,_#eef6f2_100%)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-[2rem] border border-slate-200 bg-white/90 p-6 shadow-[0_24px_80px_-32px_rgba(15,23,42,0.35)] backdrop-blur sm:p-8 lg:p-10">
          <div className="mb-8 flex flex-col gap-4 border-b border-slate-200 pb-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">
                Monitoramento ATER Sociobio
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                Novo Relatorio ATER Sociobio
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
                Preencha os dados base do atendimento e detalhe os tres eixos exigidos no relatorio tecnico.
                O sistema consolida automaticamente cada eixo em um registro estruturado para o monitoramento.
              </p>
            </div>

            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
              Campos obrigatorios para envio do atendimento tecnico.
            </div>
          </div>

          <form action={salvarAtendimento} className="space-y-8">
            <section className="rounded-3xl border border-slate-200 bg-slate-50/80 p-6 shadow-sm">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-slate-900">Dados do atendimento</h2>
                <p className="mt-1 text-sm text-slate-600">
                  Vincule a beneficiaria, o projeto e o responsavel tecnico antes de detalhar os eixos.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Beneficiaria</span>
                  <select
                    name="beneficiariaId"
                    required
                    className={baseInputClassName}
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Selecione a beneficiaria
                    </option>
                    {beneficiarias.map((beneficiaria) => (
                      <option key={beneficiaria.id} value={beneficiaria.id}>
                        {beneficiaria.cadastro.nome}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Projeto</span>
                  <select
                    name="projetoId"
                    required
                    className={baseInputClassName}
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Selecione o projeto
                    </option>
                    {projetos.map((projeto) => (
                      <option key={projeto.id} value={projeto.id}>
                        {projeto.titulo}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Tecnico Responsavel</span>
                  <input
                    name="tecnico"
                    type="text"
                    required
                    className={baseInputClassName}
                    placeholder="Nome completo do tecnico"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Data</span>
                  <input
                    name="data"
                    type="date"
                    required
                    defaultValue={hoje}
                    className={baseInputClassName}
                  />
                </label>
              </div>
            </section>

            <div className="grid gap-6 xl:grid-cols-3">
              {eixos.map((eixo) => (
                <EixoCard key={eixo.id} eixo={eixo} />
              ))}
            </div>

            <div className="flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-2xl text-sm leading-6 text-slate-500">
                Ao salvar, cada eixo sera consolidado em uma unica descricao estruturada e armazenado no
                atendimento tecnico para consulta no modulo de monitoramento.
              </p>

              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/15 transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-100"
              >
                Salvar relatorio
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
