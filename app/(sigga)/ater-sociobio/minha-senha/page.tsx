import { KeyRound, ShieldCheck } from "lucide-react";

import { Header } from "@/components/dashboard/header";
import { Card } from "@/components/ui";
import { getCurrentSiggaterUser } from "@/lib/auth/current-user";
import { getSiggaterRoleLabel } from "@/lib/auth/siggater-session";

import { PasswordForm } from "./password-form";

export const dynamic = "force-dynamic";

export default async function MinhaSenhaPage() {
  const user = await getCurrentSiggaterUser();

  return (
    <div className="min-h-screen bg-zinc-50/50">
      <Header
        title="Minha senha"
        description="Atualização segura da senha de acesso ao SIGGATER Web"
      />

      <div className="p-6 lg:p-8">
        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1fr_420px]">
          <section className="rounded-[2rem] border border-emerald-100 bg-white p-6 shadow-sm lg:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 flex-none items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
                  Segurança da conta
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                  Troque a senha provisória no primeiro acesso
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">
                  A senha deve ter pelo menos 12 caracteres e combinar letras maiúsculas, minúsculas e números.
                  Evite usar nome, telefone, data de nascimento ou senhas já usadas em outros sistemas.
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {["Mínimo 12 caracteres", "Letras e números", "Diferente da atual"].map((item) => (
                <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
                  {item}
                </div>
              ))}
            </div>
          </section>

          <Card className="p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                <KeyRound className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-950">Alterar senha</h2>
                {user ? (
                  <p className="text-sm text-slate-500">
                    {user.email} · {getSiggaterRoleLabel(user.role)}
                  </p>
                ) : null}
              </div>
            </div>

            <PasswordForm />
          </Card>
        </div>
      </div>
    </div>
  );
}
