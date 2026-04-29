import { notFound } from "next/navigation";
import { Sidebar } from "@/components/dashboard/sidebar";
import { CompraService } from "@/lib/services/compra.service";
import { atualizarContrato } from "../../actions";
import { ContratoForm } from "../../form";

export default async function EditarContratoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [contrato, fornecedores] = await Promise.all([
    CompraService.getById(id),
    CompraService.listFornecedores(),
  ]);

  if (!contrato) {
    notFound();
  }

  const updateAction = atualizarContrato.bind(null, id);

  return (
    <div className="flex min-h-screen bg-zinc-50">
      <Sidebar />
      <ContratoForm
        action={updateAction}
        fornecedores={fornecedores}
        title="Editar contrato"
        description="Atualize identificacao, fornecedor, valor e status do contrato."
        submitLabel="Salvar alteracoes"
        cancelHref={`/compras/${id}`}
        values={{
          idContrato: contrato.idContrato,
          fornecedorId: contrato.fornecedorId,
          objeto: contrato.objeto,
          valorTotal: contrato.valorTotal.toString(),
          status: contrato.status,
        }}
      />
    </div>
  );
}
