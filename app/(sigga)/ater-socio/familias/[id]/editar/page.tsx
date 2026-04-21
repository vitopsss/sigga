import { redirect } from "next/navigation";

export default async function AterSocioEditarFamiliaRedirectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/ater-sociobio/familias/${id}/editar`);
}
