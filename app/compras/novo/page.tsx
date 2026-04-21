import { prisma } from "@/lib/prisma";
import { Sidebar } from "@/components/dashboard/sidebar";

import { criarContrato } from "../actions";
import { ContratoForm } from "../form";

export default async function NovoContratoPage() {
  const fornecedores = await prisma.cadastroUnico.findMany({
    select: { id: true, nome: true, documento: true, tipo: true },
    orderBy: { nome: "asc" },
  });

  return (
    <div className="flex min-h-screen bg-zinc-50">
      <Sidebar />
      <ContratoForm
        action={criarContrato}
        fornecedores={fornecedores}
        title="Novo contrato"
        description="Cadastro minimo de contratos de fornecedores do modulo de compras."
        submitLabel="Salvar contrato"
      />
    </div>
  );
}
