"use server";

import { revalidatePath } from "next/cache";

import { getCurrentSiggaterUser } from "@/lib/auth/current-user";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { prisma } from "@/lib/prisma";

export type ChangePasswordState = {
  ok: boolean;
  message: string;
};

const initialState: ChangePasswordState = {
  ok: false,
  message: "",
};

function getText(value: FormDataEntryValue | null) {
  return String(value ?? "");
}

function validateNewPassword(password: string) {
  if (password.length < 12) {
    return "A nova senha deve ter pelo menos 12 caracteres.";
  }

  if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
    return "A nova senha deve conter letras maiúsculas, minúsculas e números.";
  }

  return null;
}

export async function changePasswordAction(
  prevState: ChangePasswordState = initialState,
  formData: FormData,
): Promise<ChangePasswordState> {
  void prevState;

  const session = await getCurrentSiggaterUser();
  if (!session) {
    return { ok: false, message: "Sessão expirada. Entre novamente para alterar a senha." };
  }

  const currentPassword = getText(formData.get("currentPassword"));
  const newPassword = getText(formData.get("newPassword"));
  const confirmPassword = getText(formData.get("confirmPassword"));

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { ok: false, message: "Preencha todos os campos." };
  }

  if (newPassword !== confirmPassword) {
    return { ok: false, message: "A confirmação da nova senha não confere." };
  }

  const passwordError = validateNewPassword(newPassword);
  if (passwordError) {
    return { ok: false, message: passwordError };
  }

  if (newPassword === currentPassword) {
    return { ok: false, message: "A nova senha deve ser diferente da senha atual." };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.sub },
    select: {
      id: true,
      passwordHash: true,
      status: true,
    },
  });

  if (!user || user.status !== "ATIVO" || !verifyPassword(currentPassword, user.passwordHash)) {
    return { ok: false, message: "Senha atual inválida." };
  }

  await prisma.user.update({
    where: { id: session.sub },
    data: {
      passwordHash: hashPassword(newPassword),
    },
  });

  revalidatePath("/ater-sociobio/minha-senha");

  return { ok: true, message: "Senha atualizada com sucesso." };
}
