const SIGGATER_SCOPE_VALUES = new Set(["siggater", "ater-sociobio", "ater"]);

export const SIGGATER_APP_PREFIXES = ["/ater-sociobio", "/ater-socio"];
export const SIGGATER_PUBLIC_PAGES = ["/login", "/logout"];

export const SIGGATER_INTERNAL_PREFIXES = ["/_next"];

export const SIGGATER_ALLOWED_API_PREFIXES = [
  "/api/siggater",
];

export const SIGGATER_ALLOWED_FILES = [
  "/favicon.ico",
  "/manifest.webmanifest",
  "/sw.js",
  "/icon-192.png",
  "/icon-512.png",
  "/apple-icon",
  "/icon",
];

function matchesPrefix(pathname: string, prefixes: string[]) {
  return prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function isSiggaterOnlyMode(env: NodeJS.ProcessEnv = process.env) {
  return SIGGATER_SCOPE_VALUES.has(String(env.SIGGA_APP_SCOPE ?? "").toLowerCase())
    || SIGGATER_SCOPE_VALUES.has(String(env.NEXT_PUBLIC_SIGGA_APP_SCOPE ?? "").toLowerCase());
}

export function isSiggaterAllowedFile(pathname: string) {
  return SIGGATER_ALLOWED_FILES.includes(pathname);
}

export function isSiggaterAllowedApi(pathname: string) {
  return matchesPrefix(pathname, SIGGATER_ALLOWED_API_PREFIXES);
}

export function isSiggaterAllowedPage(pathname: string) {
  if (pathname === "/") return true;
  if (SIGGATER_PUBLIC_PAGES.includes(pathname)) return true;
  if (isSiggaterAllowedFile(pathname)) return true;
  if (matchesPrefix(pathname, SIGGATER_INTERNAL_PREFIXES)) return true;
  return matchesPrefix(pathname, SIGGATER_APP_PREFIXES);
}

export function isSiggaterPublicPage(pathname: string) {
  return SIGGATER_PUBLIC_PAGES.includes(pathname);
}

export function isSiggaterInternalPath(pathname: string) {
  return isSiggaterAllowedFile(pathname) || matchesPrefix(pathname, SIGGATER_INTERNAL_PREFIXES);
}

export function isSiggaterPathAllowedForRole(pathname: string, role: string) {
  if (role === "ADMINISTRADOR_DIRETOR") return true;

  if (pathname === "/ater-sociobio" || pathname === "/ater-socio") return true;

  if (pathname === "/ater-sociobio/minha-senha" || pathname.startsWith("/ater-sociobio/minha-senha/")) {
    return true;
  }

  if (pathname.startsWith("/ater-sociobio/acessos")) {
    return false;
  }

  if (role === "GERENTE" || role === "COORDENADOR_PROJETO") {
    return true;
  }

  if (role === "OPERADOR") {
    return [
      "/ater-sociobio/familias",
      "/ater-sociobio/organizacoes",
      "/ater-sociobio/atendimentos",
    ].some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
  }

  return false;
}

export function getSiggaterBlockedTarget(pathname: string) {
  if (pathname.startsWith("/api")) {
    return "api";
  }

  return "page";
}
