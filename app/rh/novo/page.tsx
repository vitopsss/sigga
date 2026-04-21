import { prisma } from "@/lib/prisma";
import { salvarColaborador } from "../actions";

export const dynamic = "force-dynamic";

export default async function NovoColaborador() {
  const pessoas = await prisma.pessoa.findMany({
    orderBy: { nome: 'asc' }
  });

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Cadastrar Colaborador</h1>
      <form action={salvarColaborador} className="space-y-4 bg-white p-6 rounded-xl shadow">
        <div>
          <label className="block text-sm font-medium mb-1">ID RH (Matrícula)</label>
          <input name="idRH" type="text" placeholder="Ex: RH2026-01" required className="w-full p-2 border rounded-md" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Pessoa do Cadastro Único</label>
          <select name="cadastroId" required className="w-full p-2 border rounded-md">
            <option value="">Selecione...</option>
            {pessoas.map(p => (
              <option key={p.id} value={p.id}>{p.nome} ({p.documento})</option>
            ))}
          </select>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Cargo</label>
            <input name="cargo" type="text" required className="w-full p-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Vínculo</label>
            <input name="vinculo" type="text" placeholder="Bolsista/CLT" className="w-full p-2 border rounded-md" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Salário Base / Bolsa (R$)</label>
          <input name="salarioBase" type="number" step="0.01" required className="w-full p-2 border rounded-md" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select name="status" className="w-full p-2 border rounded-md">
            <option value="Ativo">Ativo</option>
            <option value="Inativo">Inativo</option>
          </select>
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold">
          Salvar Colaborador
        </button>
      </form>
    </div>
  );
}