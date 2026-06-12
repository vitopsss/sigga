import { cookies } from "next/headers";

import { getSiggaterSessionCookieName, verifySiggaterSessionToken } from "@/lib/auth/siggater-session";

export async function getCurrentSiggaterUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(getSiggaterSessionCookieName())?.value;

  return verifySiggaterSessionToken(token);
}
