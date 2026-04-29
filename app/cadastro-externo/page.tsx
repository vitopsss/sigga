"use client";

import { useActionState } from "react";
import { CheckCircle } from "lucide-react";

import { bancoOptions, estadoOptions } from "@/app/cadastros/form-options";
import { salvarCadastroExterno } from "./actions";

const initialState = {
  message: "",
};

const inputClassName =
  "mt-2 h-14 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 text-base text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10";

export default function CadastroExternoPage() {
  const [state, formAction, pending] = useActionState(
    salvarCadastroExterno,
    initialState,
  );

  const sucesso = state?.message === "Cadastro realizado com sucesso!";

  return (
    <main className="min-h-screen bg-zinc-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-3xl items-center justify-center">
        <section className="w-full rounded-[2rem] border border-white/70 bg-white p-6 shadow-[0_24px_80px_-32px_rgba(15,23,42,0.35)] sm:p-8 lg:p-10">
          <div className="mx-auto max-w-2xl">
            <header className="text-center">
              <div className="inline-flex rounded-full border border-teal-200 bg-teal-50 px-4 py-1.5 text-sm font-semibold text-teal-700">
                Instituto Acariquara
              </div>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
                Portal de Cadastro
              </h1>
              <p className="mt-3 text-sm leading-6 text-zinc-600 sm:text-base">
                Preencha seus dados para realizar o autocadastro de forma simples e segura.
              </p>
            </header>

            {sucesso ? (
              <div className="mt-8 rounded-[2rem] border border-emerald-200 bg-emerald-50 px-6 py-12 text-center">
                <CheckCircle className="mx-auto h-16 w-16 text-emerald-600" />
                <h2 className="mt-5 text-2xl font-semibold text-emerald-900">
                  Cadastro concluído
                </h2>
                <p className="mt-3 text-base leading-7 text-emerald-800">
                  Seus dados foram enviados com sucesso para a base do Instituto Acariquara.
                  Você já pode fechar esta página.
                </p>
              </div>
            ) : (
              <form action={formAction} className="mt-8 grid gap-8">
                {state?.error && (
                  <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-800">
                    {state.error}
                  </div>
                )}
                <section className="grid gap-5">
                  <div>
                    <h2 className="text-lg font-semibold text-zinc-950">Dados principais</h2>
                    <p className="mt-1 text-sm text-zinc-500">
                      Informe os dados de identificação e contato.
                    </p>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <label className="block">
                      <span className="text-sm font-medium text-zinc-700">Tipo</span>
                      <select name="tipo" defaultValue="PF" className={inputClassName}>
                        <option value="PF">Pessoa Física</option>
                        <option value="PJ">Pessoa Jurídica</option>
                      </select>
                    </label>

                    <label className="block">
                      <span className="text-sm font-medium text-zinc-700">Estado</span>
                      <select name="estado" defaultValue="AM" className={inputClassName}>
                        {estadoOptions.map((estado) => (
                          <option key={estado} value={estado}>
                            {estado}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="block md:col-span-2">
                      <span className="text-sm font-medium text-zinc-700">
                        Nome Completo / Razão Social
                      </span>
                      <input
                        type="text"
                        name="nome"
                        required
                        className={inputClassName}
                        placeholder="Digite seu nome completo ou razão social"
                      />
                    </label>

                    <label className="block md:col-span-2">
                      <span className="text-sm font-medium text-zinc-700">CPF / CNPJ</span>
                      <input
                        type="text"
                        name="documento"
                        required
                        className={inputClassName}
                        placeholder="Somente números ou formato completo"
                      />
                    </label>

                    <label className="block">
                      <span className="text-sm font-medium text-zinc-700">Email</span>
                      <input
                        type="email"
                        name="email"
                        className={inputClassName}
                        placeholder="voce@exemplo.com"
                      />
                    </label>

                    <label className="block">
                      <span className="text-sm font-medium text-zinc-700">Telefone</span>
                      <input
                        type="text"
                        name="telefone"
                        className={inputClassName}
                        placeholder="(92) 99999-9999"
                      />
                    </label>
                  </div>
                </section>

                <section className="grid gap-5 border-t border-zinc-200 pt-8">
                  <div>
                    <h2 className="text-lg font-semibold text-zinc-950">Dados bancários</h2>
                    <p className="mt-1 text-sm text-zinc-500">
                      Preencha os dados para futuros repasses ou validações cadastrais.
                    </p>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <label className="block md:col-span-2">
                      <span className="text-sm font-medium text-zinc-700">Banco</span>
                      <select
                        name="banco"
                        defaultValue="001 - BCO DO BRASIL S.A."
                        className={inputClassName}
                      >
                        {bancoOptions.map((banco) => (
                          <option key={banco} value={banco}>
                            {banco}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="block">
                      <span className="text-sm font-medium text-zinc-700">Agência</span>
                      <input
                        type="text"
                        name="agencia"
                        className={inputClassName}
                        placeholder="Ex.: 1234-5"
                      />
                    </label>

                    <label className="block">
                      <span className="text-sm font-medium text-zinc-700">Conta</span>
                      <input
                        type="text"
                        name="conta"
                        className={inputClassName}
                        placeholder="Ex.: 98765-4"
                      />
                    </label>

                    <label className="block md:col-span-2">
                      <span className="text-sm font-medium text-zinc-700">PIX</span>
                      <input
                        type="text"
                        name="pix"
                        className={inputClassName}
                        placeholder="Informe sua chave PIX"
                      />
                    </label>
                  </div>
                </section>

                <div className="border-t border-zinc-200 pt-6">
                  <button
                    type="submit"
                    disabled={pending}
                    className="inline-flex h-14 w-full items-center justify-center rounded-2xl bg-zinc-950 px-6 text-base font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
                  >
                    {pending ? "Enviando cadastro..." : "Enviar Cadastro"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
