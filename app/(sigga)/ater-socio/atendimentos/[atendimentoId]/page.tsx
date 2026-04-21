import { redirect } from "next/navigation";

export default async function AterSocioAtendimentoRedirectPage({
  params,
}: {
  params: Promise<{ atendimentoId: string }>;
}) {
  const { atendimentoId } = await params;
  redirect(`/ater-sociobio/atendimentos/${atendimentoId}`);
}
