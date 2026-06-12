import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getSiggaterSessionCookieName } from "@/lib/auth/siggater-session";

export async function GET() {
  const cookieStore = await cookies();
  cookieStore.delete(getSiggaterSessionCookieName());

  redirect("/login");
}
