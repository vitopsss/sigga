"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

import {
  getLoginRateLimitKey,
  getLoginRateLimitStatus,
  registerFailedLogin,
  registerSuccessfulLogin,
} from "@/lib/auth/login-rate-limit";
import { verifyPassword } from "@/lib/auth/password";
import {
  createSiggaterSessionToken,
  getSiggaterSessionCookieName,
  isSiggaterRole,
  SIGGATER_SESSION_MAX_AGE_SECONDS,
} from "@/lib/auth/siggater-session";
import { SIGGATER_APP_PREFIXES } from "@/lib/siggater-access-scope";
import { prisma } from "@/lib/prisma";

function safeNextPath(value: FormDataEntryValue | null) {
  const next = String(value ?? "").trim();
  if (!next || !next.startsWith("/") || next.startsWith("//")) return "/ater-sociobio";

  const allowed = SIGGATER_APP_PREFIXES.some((prefix) => next === prefix || next.startsWith(`${prefix}/`));
  return allowed ? next : "/ater-sociobio";
}

function buildLoginErrorUrl(next: string, error = "invalid") {
  const search = new URLSearchParams({ error });
  if (next !== "/ater-sociobio") search.set("next", next);
  return `/login?${search.toString()}`;
}

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const next = safeNextPath(formData.get("next"));
  const headersList = await headers();
  const rateLimitKey = getLoginRateLimitKey(email, headersList);
  const rateLimit = getLoginRateLimitStatus(rateLimitKey);

  if (!email || !password) {
    redirect(buildLoginErrorUrl(next));
  }

  if (!rateLimit.allowed) {
    redirect(buildLoginErrorUrl(next, "locked"));
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        passwordHash: true,
        role: true,
        status: true,
      },
    });

    if (
      !user
      || user.status !== "ATIVO"
      || !user.email
      || !isSiggaterRole(user.role)
      || !verifyPassword(password, user.passwordHash)
    ) {
      registerFailedLogin(rateLimitKey);
      redirect(buildLoginErrorUrl(next));
    }

    registerSuccessfulLogin(rateLimitKey);

    const token = await createSiggaterSessionToken({
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    const cookieStore = await cookies();
    cookieStore.set(getSiggaterSessionCookieName(), token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: SIGGATER_SESSION_MAX_AGE_SECONDS,
    });
  } catch (error) {
    if (String(error).includes("NEXT_REDIRECT")) throw error;
    console.error(error);
    redirect(buildLoginErrorUrl(next, "server"));
  }

  redirect(next);
}
