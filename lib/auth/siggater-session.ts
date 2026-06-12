export const SIGGATER_SESSION_MAX_AGE_SECONDS = 60 * 60 * 10;
const SIGGATER_SESSION_SECRET_MIN_LENGTH = 32;
const SIGGATER_DEV_SESSION_SECRET = "siggater-dev-session-secret-change-me";

export const SIGGATER_ROLES = [
  "ADMINISTRADOR_DIRETOR",
  "GERENTE",
  "COORDENADOR_PROJETO",
  "OPERADOR",
] as const;

export type SiggaterRole = (typeof SIGGATER_ROLES)[number];

export type SiggaterSessionPayload = {
  sub: string;
  email: string;
  name: string | null;
  role: SiggaterRole;
  iat: number;
  exp: number;
};

export function getSiggaterSessionCookieName(env: NodeJS.ProcessEnv = process.env) {
  return env.NODE_ENV === "production" ? "__Host-siggater_session" : "siggater_session";
}

export function hasProductionGradeSiggaterSessionSecret(env: NodeJS.ProcessEnv = process.env) {
  const secret = env.SIGGATER_SESSION_SECRET || env.NEXTAUTH_SECRET || env.AUTH_SECRET || "";
  return secret.length >= SIGGATER_SESSION_SECRET_MIN_LENGTH;
}

function getSessionSecret() {
  const configuredSecret = process.env.SIGGATER_SESSION_SECRET || process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || "";

  if (configuredSecret.length >= SIGGATER_SESSION_SECRET_MIN_LENGTH) {
    return configuredSecret;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("SIGGATER_SESSION_SECRET deve ter pelo menos 32 caracteres em producao.");
  }

  return SIGGATER_DEV_SESSION_SECRET;
}

function base64UrlEncodeBytes(bytes: Uint8Array) {
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlEncodeString(value: string) {
  return base64UrlEncodeBytes(new TextEncoder().encode(value));
}

function base64UrlDecodeToBytes(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index++) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
}

function base64UrlDecodeString(value: string) {
  return new TextDecoder().decode(base64UrlDecodeToBytes(value));
}

async function getSigningKey() {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSessionSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

async function sign(value: string) {
  const key = await getSigningKey();
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return base64UrlEncodeBytes(new Uint8Array(signature));
}

function constantTimeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;

  let mismatch = 0;
  for (let index = 0; index < a.length; index++) {
    mismatch |= a.charCodeAt(index) ^ b.charCodeAt(index);
  }

  return mismatch === 0;
}

export function isSiggaterRole(value: unknown): value is SiggaterRole {
  return typeof value === "string" && SIGGATER_ROLES.includes(value as SiggaterRole);
}

export function getSiggaterRoleLabel(role: string | null | undefined) {
  switch (role) {
    case "ADMINISTRADOR_DIRETOR":
      return "Administração";
    case "GERENTE":
      return "Gerência";
    case "COORDENADOR_PROJETO":
      return "Coordenação";
    case "OPERADOR":
      return "Operação";
    default:
      return "Sem perfil";
  }
}

export async function createSiggaterSessionToken(
  payload: Pick<SiggaterSessionPayload, "sub" | "email" | "name" | "role">,
) {
  const now = Math.floor(Date.now() / 1000);
  const sessionPayload: SiggaterSessionPayload = {
    ...payload,
    iat: now,
    exp: now + SIGGATER_SESSION_MAX_AGE_SECONDS,
  };
  const encodedPayload = base64UrlEncodeString(JSON.stringify(sessionPayload));
  const signature = await sign(encodedPayload);

  return `${encodedPayload}.${signature}`;
}

export async function verifySiggaterSessionToken(token: string | undefined | null) {
  if (!token) return null;

  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) return null;

  const expectedSignature = await sign(encodedPayload);
  if (!constantTimeEqual(signature, expectedSignature)) return null;

  try {
    const payload = JSON.parse(base64UrlDecodeString(encodedPayload)) as Partial<SiggaterSessionPayload>;
    const now = Math.floor(Date.now() / 1000);

    if (!payload.sub || !payload.email || !isSiggaterRole(payload.role)) return null;
    if (!payload.exp || payload.exp <= now) return null;

    return payload as SiggaterSessionPayload;
  } catch {
    return null;
  }
}
