import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSiggaterSessionCookieName } from "@/lib/auth/siggater-session";

export const dynamic = "force-dynamic";

export default async function LogoutPage() {
  const cookieStore = await cookies();
  cookieStore.delete(getSiggaterSessionCookieName());

  redirect("/login");
}
