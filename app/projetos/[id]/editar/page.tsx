import { notFound } from "next/navigation";
import { ProjetoService } from "@/lib/services/projeto.service";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { FormProjeto } from "../../form-projeto";

export default async function EditarProjetoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const projeto = await ProjetoService.getById(id);

  if (!projeto) {
    notFound();
  }

  return (
    <div className="flex min-h-screen bg-zinc-50">
      <Sidebar />

      <main className="flex-1 ml-64">
        <Header
          title={`Editar: ${projeto.centroCusto}`}
          description="Atualize as informações do projeto"
        />

        <div className="p-6 lg:p-8 max-w-4xl">
          <FormProjeto projeto={projeto} />
        </div>
      </main>
    </div>
  );
}
