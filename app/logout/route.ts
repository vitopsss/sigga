import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSiggaterSessionCookieName } from "@/lib/auth/siggater-session";

export const dynamic = "force-dynamic";

export async function GET() {
  const cookieStore = await cookies();
  const cookieName = getSiggaterSessionCookieName();
  
  // Try to delete standard way
  cookieStore.delete(cookieName);
  
  // Also force delete by setting it in the response explicitly if needed, but Next.js handle it
  // For production with __Host- prefix, secure and path=/ are required.
  if (cookieName.startsWith("__Host-")) {
    cookieStore.delete({
      name: cookieName,
      secure: true,
      path: "/",
    });
  }

  redirect("/login");
}
