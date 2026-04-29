import { BorderoService } from "@/lib/services/bordero.service";
import { NovoBorderoForm } from "./form";
import { Sidebar } from "@/components/dashboard/sidebar";

export default async function NovoBorderoPage() {
  const [projetos, favorecidos] = await Promise.all([
    BorderoService.listProjetos(),
    BorderoService.listFavorecidos(),
  ]);

  return (
    <div className="flex min-h-screen bg-zinc-50">
      <Sidebar />
      <NovoBorderoForm projetos={projetos} favorecidos={favorecidos} />
    </div>
  );
}
