import { redirect } from "next/navigation";

export default async function EditarExtensionistaRedirectPage({
  params,
}: {
  params: Promise<{ tecnicoId: string }>;
}) {
  const { tecnicoId } = await params;
  redirect(`/ater-sociobio/tecnicos/${tecnicoId}/editar`);
}
