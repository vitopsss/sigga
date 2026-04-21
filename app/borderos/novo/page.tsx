import { prisma } from "@/lib/prisma";
import { NovoBorderoForm } from "./form";
import { Sidebar } from "@/components/dashboard/sidebar";

export default async function NovoBorderoPage() {
  const [projetos, favorecidos] = await Promise.all([
    prisma.projeto.findMany({
      select: { id: true, centroCusto: true, titulo: true },
      orderBy: { centroCusto: "asc" },
    }),
    prisma.cadastroUnico.findMany({
      select: { id: true, nome: true, documento: true, tipo: true },
      orderBy: { nome: "asc" },
    }),
  ]);

  return (
    <div className="flex min-h-screen bg-zinc-50">
      <Sidebar />
      <NovoBorderoForm projetos={projetos} favorecidos={favorecidos} />
    </div>
  );
}
