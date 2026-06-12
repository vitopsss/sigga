import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const SCRYPT_KEY_LENGTH = 64;

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("base64url");
  const hash = scryptSync(password, salt, SCRYPT_KEY_LENGTH).toString("base64url");

  return `scrypt$${salt}$${hash}`;
}

export function verifyPassword(password: string, storedHash: string | null | undefined) {
  if (!storedHash) return false;

  const [algorithm, salt, hash] = storedHash.split("$");
  if (algorithm !== "scrypt" || !salt || !hash) return false;

  const expected = Buffer.from(hash, "base64url");
  const actual = scryptSync(password, salt, expected.length);

  return expected.length === actual.length && timingSafeEqual(expected, actual);
}
