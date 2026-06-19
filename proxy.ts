import { NextResponse, type NextRequest } from "next/server";

import { getSiggaterSessionCookieName, verifySiggaterSessionToken } from "@/lib/auth/siggater-session";
import {
  getSiggaterBlockedTarget,
  isSiggaterAllowedApi,
  isSiggaterAllowedPage,
  isSiggaterInternalPath,
  isSiggaterOnlyMode,
  isSiggaterPathAllowedForRole,
  isSiggaterPublicPage,
} from "@/lib/siggater-access-scope";

function withSecurityHeaders(response: NextResponse) {
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "same-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

  return response;
}

function buildLoginRedirect(request: NextRequest) {
  const loginUrl = new URL("/login", request.url);
  const { pathname, search } = request.nextUrl;

  if (pathname !== "/ater-sociobio") {
    loginUrl.searchParams.set("next", `${pathname}${search}`);
  }

  return withSecurityHeaders(NextResponse.redirect(loginUrl));
}

export async function proxy(request: NextRequest) {
  if (!isSiggaterOnlyMode()) {
    return withSecurityHeaders(NextResponse.next());
  }

  const { pathname } = request.nextUrl;
  const session = await verifySiggaterSessionToken(request.cookies.get(getSiggaterSessionCookieName())?.value);

  if (pathname === "/") {
    return withSecurityHeaders(NextResponse.redirect(new URL("/ater-sociobio", request.url)));
  }

  if (isSiggaterInternalPath(pathname)) {
    return withSecurityHeaders(NextResponse.next());
  }

  if (pathname.startsWith("/api") && !isSiggaterAllowedApi(pathname)) {
    return withSecurityHeaders(NextResponse.json(
      { error: "Modulo indisponivel no ambiente SIGGATER." },
      { status: 403 },
    ));
  }

  if (pathname.startsWith("/api")) {
    return withSecurityHeaders(NextResponse.next());
  }

  if (isSiggaterPublicPage(pathname)) {
    if (pathname === "/login" && session) {
      return withSecurityHeaders(NextResponse.redirect(new URL("/ater-sociobio", request.url)));
    }

    return withSecurityHeaders(NextResponse.next());
  }

  if (!isSiggaterAllowedPage(pathname)) {
    if (getSiggaterBlockedTarget(pathname) === "api") {
      return withSecurityHeaders(NextResponse.json(
          { error: "Modulo indisponivel no ambiente SIGGATER." },
          { status: 403 },
      ));
    }

    return withSecurityHeaders(NextResponse.redirect(new URL("/ater-sociobio", request.url)));
  }

  if (!session) {
    return buildLoginRedirect(request);
  }

  if (!isSiggaterPathAllowedForRole(pathname, session.role)) {
    const redirectUrl = new URL("/ater-sociobio", request.url);
    redirectUrl.searchParams.set("access", "denied");

    return withSecurityHeaders(NextResponse.redirect(redirectUrl));
  }

  return withSecurityHeaders(NextResponse.next());
}

export const config = {
  matcher: ["/((?!.*\\..*).*)", "/favicon.ico", "/manifest.webmanifest", "/sw.js", "/icon-192.png", "/icon-512.png"],
};
