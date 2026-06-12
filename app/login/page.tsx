import { Leaf, LockKeyhole } from "lucide-react";

import { loginAction } from "@/app/login/actions";
import { Button, Input } from "@/components/ui";

type SearchParams = Promise<{ next?: string; error?: string }>;

function getErrorMessage(error?: string) {
  if (error === "server") {
    return "Não foi possível validar o acesso agora. Tente novamente.";
  }

  if (error === "locked") {
    return "Muitas tentativas inválidas. Aguarde alguns minutos antes de tentar novamente.";
  }

  if (error) {
    return "E-mail ou senha inválidos, ou usuário inativo.";
  }

  return null;
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { next = "/ater-sociobio", error } = await searchParams;
  const errorMessage = getErrorMessage(error);

  return (
    <main className="min-h-screen bg-[#f6f7f2] px-6 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center justify-center">
        <section className="grid w-full overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-xl shadow-zinc-900/5 lg:grid-cols-[1fr_440px]">
          <div className="hidden bg-zinc-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600">
                <Leaf className="h-6 w-6" />
              </div>
              <h1 className="mt-8 max-w-xl text-4xl font-semibold tracking-tight">
                SIGGATER Web
              </h1>
              <p className="mt-4 max-w-lg text-sm leading-6 text-zinc-300">
                Acesso restrito ao ambiente de acompanhamento de UFPAs, organizações coletivas, diagnósticos e atendimentos de ATER.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-zinc-300">
              <p className="font-semibold text-white">Perfis previstos</p>
              <p className="mt-2">Administração, Coordenação/Gerência e Operação/Agente ATER.</p>
            </div>
          </div>

          <div className="p-8 sm:p-10">
            <div className="flex items-center gap-3 lg:hidden">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 text-white">
                <Leaf className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-700">SIGGATER</p>
                <h1 className="text-xl font-semibold text-zinc-950">Acesso ao sistema</h1>
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                <LockKeyhole className="h-6 w-6" />
              </div>
              <h2 className="mt-6 text-2xl font-semibold tracking-tight text-zinc-950">Entrar no SIGGATER</h2>
              <p className="mt-2 text-sm text-zinc-500">Use o acesso emitido para o seu perfil operacional.</p>
            </div>

            {errorMessage && (
              <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                {errorMessage}
              </div>
            )}

            <form action={loginAction} className="mt-8 space-y-5">
              <input type="hidden" name="next" value={next} />

              <label className="block">
                <span className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">E-mail</span>
                <Input name="email" type="email" autoComplete="email" required className="mt-2" />
              </label>

              <label className="block">
                <span className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">Senha</span>
                <Input name="password" type="password" autoComplete="current-password" required className="mt-2" />
              </label>

              <Button type="submit" variant="primary" className="h-12 w-full rounded-2xl">
                Entrar
              </Button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
