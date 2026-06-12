const LOGIN_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_RATE_LIMIT_LOCK_MS = 15 * 60 * 1000;
const LOGIN_RATE_LIMIT_MAX_FAILURES = 5;

type LoginAttemptEntry = {
  failures: number;
  firstFailureAt: number;
  lockedUntil: number;
};

const globalForLoginRateLimit = globalThis as typeof globalThis & {
  __siggaterLoginAttempts?: Map<string, LoginAttemptEntry>;
};

const attempts = globalForLoginRateLimit.__siggaterLoginAttempts ?? new Map<string, LoginAttemptEntry>();
globalForLoginRateLimit.__siggaterLoginAttempts = attempts;

function getClientIp(headersList: Headers) {
  const forwardedFor = headersList.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwardedFor || headersList.get("x-real-ip") || "local";
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase() || "unknown";
}

function getFreshEntry(key: string, now = Date.now()) {
  const entry = attempts.get(key);
  if (!entry) return null;

  const windowExpired = now - entry.firstFailureAt > LOGIN_RATE_LIMIT_WINDOW_MS;
  if (windowExpired && entry.lockedUntil <= now) {
    attempts.delete(key);
    return null;
  }

  return entry;
}

export function getLoginRateLimitKey(email: string, headersList: Headers) {
  return `${getClientIp(headersList)}:${normalizeEmail(email)}`;
}

export function getLoginRateLimitStatus(key: string, now = Date.now()) {
  const entry = getFreshEntry(key, now);
  if (!entry || entry.lockedUntil <= now) {
    return { allowed: true, retryAfterSeconds: 0 };
  }

  return {
    allowed: false,
    retryAfterSeconds: Math.ceil((entry.lockedUntil - now) / 1000),
  };
}

export function registerFailedLogin(key: string, now = Date.now()) {
  const entry = getFreshEntry(key, now) ?? {
    failures: 0,
    firstFailureAt: now,
    lockedUntil: 0,
  };

  entry.failures += 1;

  if (entry.failures >= LOGIN_RATE_LIMIT_MAX_FAILURES) {
    entry.lockedUntil = now + LOGIN_RATE_LIMIT_LOCK_MS;
  }

  attempts.set(key, entry);
}

export function registerSuccessfulLogin(key: string) {
  attempts.delete(key);
}
