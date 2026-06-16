import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSiggaterSessionCookieName } from "@/lib/auth/siggater-session";

export const dynamic = "force-dynamic";

export async function GET() {
  const cookieStore = await cookies();
  const cookieName = getSiggaterSessionCookieName();
  
  if (cookieName.startsWith("__Host-")) {
    cookieStore.delete({
      name: cookieName,
      secure: true,
      path: "/",
    });
  } else {
    cookieStore.delete(cookieName);
  }

  redirect("/login");
}
