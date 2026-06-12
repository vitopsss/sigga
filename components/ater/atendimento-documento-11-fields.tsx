import {
  ATENDIMENTO_AMBIENTAL_INDICADORES,
  ATENDIMENTO_AMBIENTAL_RESULTADOS,
  ATENDIMENTO_PRODUTIVO_INDICADORES,
  ATENDIMENTO_PRODUTIVO_RESULTADOS,
  ATENDIMENTO_SOCIAL_INDICADORES,
  ATENDIMENTO_SOCIAL_RESULTADOS,
} from "@/lib/constants/ater-sociobio-official";

export type AtendimentoEixoDocumento11 = {
  tecnologiaProducao?: string;
  atividadeProdutiva?: string;
  orientacoes?: string;
  outrasAtividadesUfpa?: string;
  orientacoesEncaminhamentos?: string;
  atividadeSocial?: string;
  tecnologiaAmbiental?: string;
  atividadeAmbiental?: string;
  resultadosParciaisFinais?: string[];
  indicadoresTrabalhados?: string[];
};

type AtendimentoDocumento11FieldsProps = {
  produtivo?: AtendimentoEixoDocumento11;
  social?: AtendimentoEixoDocumento11;
  ambiental?: AtendimentoEixoDocumento11;
};

const inputClassName =
  "mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100";

const checkboxClassName =
  "h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500";

function isChecked(values: string[] | undefined, option: string) {
  return Array.isArray(values) && values.includes(option);
}

function CheckboxList({
  name,
  options,
  selectedValues,
}: {
  name: string;
  options: readonly string[];
  selectedValues?: string[];
}) {
  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
      {options.map((option) => (
        <label key={option} className="flex items-start gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
          <input
            name={name}
            type="checkbox"
            value={option}
            defaultChecked={isChecked(selectedValues, option)}
            className={checkboxClassName}
          />
          <span>{option}</span>
        </label>
      ))}
    </div>
  );
}

export function AtendimentoDocumento11Fields({
  produtivo = {},
  social = {},
  ambiental = {},
}: AtendimentoDocumento11FieldsProps) {
  return (
    <>
      <section className="rounded-3xl border border-slate-200 bg-slate-50/80 p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-slate-900">7. Eixo produtivo</h2>
          <p className="mt-1 text-sm text-slate-600">Tecnologia de produção e orientações produtivas trabalhadas na visita.</p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Tecnologia de produção</span>
            <input name="eixo_produtivo_tecnologiaProducao" type="text" defaultValue={produtivo.tecnologiaProducao ?? ""} className={inputClassName} />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Atividade produtiva</span>
            <input name="eixo_produtivo_atividadeProdutiva" type="text" defaultValue={produtivo.atividadeProdutiva ?? ""} className={inputClassName} />
          </label>

          <label className="block md:col-span-2">
            <span className="text-sm font-medium text-slate-700">Orientações</span>
            <textarea name="eixo_produtivo_orientacoes" rows={3} defaultValue={produtivo.orientacoes ?? ""} className={inputClassName} />
          </label>

          <label className="block md:col-span-2">
            <span className="text-sm font-medium text-slate-700">Outras atividades da UFPA</span>
            <textarea
              name="eixo_produtivo_outrasAtividadesUfpa"
              rows={2}
              defaultValue={produtivo.outrasAtividadesUfpa ?? ""}
              className={inputClassName}
            />
          </label>

          <div className="md:col-span-2">
            <h3 className="mb-3 text-sm font-semibold text-slate-900">Resultados parciais/finais</h3>
            <CheckboxList
              name="eixo_produtivo_resultados"
              options={ATENDIMENTO_PRODUTIVO_RESULTADOS}
              selectedValues={produtivo.resultadosParciaisFinais}
            />
          </div>

          <div className="md:col-span-2">
            <h3 className="mb-3 text-sm font-semibold text-slate-900">Indicadores trabalhados</h3>
            <CheckboxList
              name="eixo_produtivo_indicadores"
              options={ATENDIMENTO_PRODUTIVO_INDICADORES}
              selectedValues={produtivo.indicadoresTrabalhados}
            />
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-slate-900">8. Eixo social</h2>
          <p className="mt-1 text-sm text-slate-600">Orientações, encaminhamentos e resultados sociais do atendimento.</p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <label className="block md:col-span-2">
            <span className="text-sm font-medium text-slate-700">Orientações / encaminhamentos</span>
            <textarea
              name="eixo_social_orientacoesEncaminhamentos"
              rows={3}
              defaultValue={social.orientacoesEncaminhamentos ?? ""}
              className={inputClassName}
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Atividade social</span>
            <input name="eixo_social_atividadeSocial" type="text" defaultValue={social.atividadeSocial ?? ""} className={inputClassName} />
          </label>

          <label className="block md:col-span-2">
            <span className="text-sm font-medium text-slate-700">Orientações</span>
            <textarea name="eixo_social_orientacoes" rows={3} defaultValue={social.orientacoes ?? ""} className={inputClassName} />
          </label>

          <div className="md:col-span-2">
            <h3 className="mb-3 text-sm font-semibold text-slate-900">Resultados parciais/finais</h3>
            <CheckboxList
              name="eixo_social_resultados"
              options={ATENDIMENTO_SOCIAL_RESULTADOS}
              selectedValues={social.resultadosParciaisFinais}
            />
          </div>

          <div className="md:col-span-2">
            <h3 className="mb-3 text-sm font-semibold text-slate-900">Indicadores trabalhados</h3>
            <CheckboxList
              name="eixo_social_indicadores"
              options={ATENDIMENTO_SOCIAL_INDICADORES}
              selectedValues={social.indicadoresTrabalhados}
            />
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-slate-50/80 p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-slate-900">9. Eixo ambiental</h2>
          <p className="mt-1 text-sm text-slate-600">Tecnologia ambiental, orientações e resultados ambientais da visita.</p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Tecnologia ambiental</span>
            <input name="eixo_ambiental_tecnologiaAmbiental" type="text" defaultValue={ambiental.tecnologiaAmbiental ?? ""} className={inputClassName} />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Atividade ambiental</span>
            <input name="eixo_ambiental_atividadeAmbiental" type="text" defaultValue={ambiental.atividadeAmbiental ?? ""} className={inputClassName} />
          </label>

          <label className="block md:col-span-2">
            <span className="text-sm font-medium text-slate-700">Orientações</span>
            <textarea name="eixo_ambiental_orientacoes" rows={3} defaultValue={ambiental.orientacoes ?? ""} className={inputClassName} />
          </label>

          <div className="md:col-span-2">
            <h3 className="mb-3 text-sm font-semibold text-slate-900">Resultados parciais/finais</h3>
            <CheckboxList
              name="eixo_ambiental_resultados"
              options={ATENDIMENTO_AMBIENTAL_RESULTADOS}
              selectedValues={ambiental.resultadosParciaisFinais}
            />
          </div>

          <div className="md:col-span-2">
            <h3 className="mb-3 text-sm font-semibold text-slate-900">Indicadores trabalhados</h3>
            <CheckboxList
              name="eixo_ambiental_indicadores"
              options={ATENDIMENTO_AMBIENTAL_INDICADORES}
              selectedValues={ambiental.indicadoresTrabalhados}
            />
          </div>
        </div>
      </section>
    </>
  );
}
