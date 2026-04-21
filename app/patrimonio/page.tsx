import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";

export default async function PatrimonioPage() {
  return (
    <div className="flex min-h-screen bg-zinc-50">
      <Sidebar />

      <main className="flex-1 ml-64">
        <Header
          title="Patrimonio"
          description="Controle de bens moveis e imoveis"
        />

        <div className="p-6 lg:p-8">
          <div className="bg-zinc-50 border-2 border-dashed border-zinc-300 rounded-xl p-12 text-center">
            <p className="text-zinc-500 text-lg">
              Funcionalidade em transicao.
            </p>
            <p className="text-zinc-400 mt-2">
              O modulo de patrimonio sera reformulado em etapa posterior.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
