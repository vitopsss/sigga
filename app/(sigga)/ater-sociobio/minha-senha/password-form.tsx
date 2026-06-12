"use client";

import { useActionState } from "react";
import { KeyRound, ShieldCheck } from "lucide-react";

import { Button, Input } from "@/components/ui";

import { changePasswordAction, type ChangePasswordState } from "./actions";

const initialState: ChangePasswordState = {
  ok: false,
  message: "",
};

export function PasswordForm() {
  const [state, formAction, pending] = useActionState(changePasswordAction, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <label className="block">
        <span className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">Senha atual</span>
        <Input name="currentPassword" type="password" autoComplete="current-password" required className="mt-2" />
      </label>

      <label className="block">
        <span className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">Nova senha</span>
        <Input name="newPassword" type="password" autoComplete="new-password" required className="mt-2" />
      </label>

      <label className="block">
        <span className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">Confirmar nova senha</span>
        <Input name="confirmPassword" type="password" autoComplete="new-password" required className="mt-2" />
      </label>

      {state.message && (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm font-medium ${
            state.ok
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-rose-200 bg-rose-50 text-rose-700"
          }`}
        >
          {state.message}
        </div>
      )}

      <Button type="submit" variant="primary" className="h-12 w-full rounded-2xl" disabled={pending}>
        {pending ? (
          <>
            <ShieldCheck className="h-4 w-4" />
            Salvando...
          </>
        ) : (
          <>
            <KeyRound className="h-4 w-4" />
            Atualizar senha
          </>
        )}
      </Button>
    </form>
  );
}
