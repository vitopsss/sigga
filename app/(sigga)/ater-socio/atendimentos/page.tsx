import { redirect } from "next/navigation";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function getRedirectSuffix(searchParams: Record<string, string | string[] | undefined>) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(searchParams)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        if (item) params.append(key, item);
      }
      continue;
    }

    if (value) {
      params.set(key, value);
    }
  }

  const query = params.toString();
  return query ? `?${query}` : "";
}

export default async function AterSocioAtendimentosRedirectPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  redirect(`/ater-sociobio/atendimentos${getRedirectSuffix(await searchParams)}`);
}
