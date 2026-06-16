export type SearchParamValue = string | string[] | undefined;

export function firstSearchParam(value: SearchParamValue) {
  const first = Array.isArray(value) ? value[0] : value;
  return typeof first === "string" ? first : "";
}

export function safeInternalPath(value: SearchParamValue, prefix: string) {
  const path = firstSearchParam(value).trim();
  if (!path.startsWith("/")) return null;
  if (path.startsWith("//")) return null;
  if (!path.startsWith(prefix)) return null;
  return path;
}
