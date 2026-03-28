import { FormProjeto } from "../form-projeto";
import { salvarProjeto } from "../actions";

export default function NovoProjetoPage() {
  return (
    <div className="bg-[radial-gradient(circle_at_top_right,_rgba(20,184,166,0.16),_transparent_34%)]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-8 lg:px-10 lg:py-10">
        <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-[0_20px_80px_-30px_rgba(15,23,42,0.35)] backdrop-blur xl:p-10">
          <div>
            <span className="inline-flex items-center rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-teal-700">
              Novo Projeto
            </span>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              Tela de cadastro de projeto
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-600 sm:text-lg">
              Preencha os dados principais do projeto para iniciar seu acompanhamento no sistema.
            </p>
          </div>
        </section>

        <FormProjeto action={salvarProjeto} />
      </div>
    </div>
  );
}
