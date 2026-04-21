import { redirect } from "next/navigation";
import { notFound } from "next/navigation";

type Params = Promise<{ id: string }>;

export default async function BeneficiariaDetailPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;
  if (id) {
    redirect(`/ater-sociobio/familias/${id}`);
  }
  notFound();
}
