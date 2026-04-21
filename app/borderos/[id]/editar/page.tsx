import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Trash2 } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Button, Card } from "@/components/ui";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { adicionarLancamento, atualizarBordero, removerLancamento } from "@/app/borderos/actions";

const inputClassName =
  "h-11 w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 text-sm focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/15";

function formatDate(value: Date | null) {
  return value ? value.toLocaleDateString("pt-BR") : "-";
}

export default async function EditarBorderoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [bordero, projetos, favorecidos] = await Promise.all([
    prisma.bordero.findUnique({
      where: { id },
      include: {
        projeto: { select: { titulo: true, centroCusto: true } },
        lancamentos: {
          include: { favorecido: true },
          orderBy: { dataVencimento: "asc" },
        },
      },
    }),
    prisma.projeto.findMany({
      select: { id: true, centroCusto: true, titulo: true },
      orderBy: { centroCusto: "asc" },
    }),
    prisma.cadastroUnico.findMany({
      select: { id: true, nome: true, documento: true, tipo: true },
      orderBy: { nome: "asc" },
    }),
  ]);

  if (!bordero) {
    notFound();
  }

  const updateAction = atualizarBordero.bind(null, bordero.id);

  return (
    <div className="flex min-h-screen bg-zinc-50">
      <Sidebar />

      <main className="ml-64 flex-1">
        <div className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-zinc-200 bg-white/80 px-6 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <Link href={`/borderos/${bordero.id}`}>
              <Button variant="secondary" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-semibold text-zinc-950">Editar {bordero.idBordero}</h1>
              <p className="text-sm text-zinc-500">Atualize os dados do bordero e mantenha os lancamentos.</p>
            </div>
          </div>
        </div>

        <div className="space-y-6 p-6 lg:p-8">
          <form action={updateAction} className="space-y-6">
            <Card>
              <div className="border-b border-zinc-200/60 p-6">
                <h2 className="text-lg font-semibold text-zinc-950">Dados do bordero</h2>
              </div>

              <div className="grid gap-4 p-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-700">ID do bordero</label>
                  <input name="idBordero" defaultValue={bordero.idBordero} required className={inputClassName} />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-700">Projeto</label>
                  <select name="projetoId" defaultValue={bordero.projetoId} required className={inputClassName}>
                    {projetos.map((projeto) => (
                      <option key={projeto.id} value={projeto.id}>
                        {projeto.centroCusto} | {projeto.titulo}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-700">Data</label>
                  <input
                    name="data"
                    type="date"
                    defaultValue={bordero.data ? bordero.data.toISOString().split("T")[0] : ""}
                    className={inputClassName}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-700">Tipo</label>
                  <select name="tipoBordero" defaultValue={bordero.tipoBordero ?? ""} className={inputClassName}>
                    <option value="">Selecione...</option>
                    <option value="2.225.Bordero - Pagar">2.225.Bordero - Pagar</option>
                    <option value="2.224.Bordero - Receber">2.224.Bordero - Receber</option>
                  </select>
                </div>
              </div>
            </Card>

            <div className="flex justify-end">
              <Button type="submit" variant="primary">
                Salvar bordero
              </Button>
            </div>
          </form>

          <Card>
            <div className="border-b border-zinc-200/60 p-6">
              <h2 className="text-lg font-semibold text-zinc-950">Adicionar lancamento</h2>
            </div>

            <form action={adicionarLancamento.bind(null, bordero.id)} className="grid gap-4 p-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-700">NSU</label>
                <input name="nsu" required className={inputClassName} />
              </div>

              <div className="space-y-1.5 lg:col-span-2">
                <label className="text-sm font-medium text-zinc-700">Favorecido</label>
                <select name="favorecidoId" required className={inputClassName}>
                  <option value="">Selecione...</option>
                  {favorecidos.map((favorecido) => (
                    <option key={favorecido.id} value={favorecido.id}>
                      {favorecido.nome} | {favorecido.documento} | {favorecido.tipo}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-700">Valor</label>
                <input name="valor" type="number" step="0.01" min="0" required className={inputClassName} />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-700">Vencimento</label>
                <input name="dataVencimento" type="date" required className={inputClassName} />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-700">Forma</label>
                <select name="formaPagamento" className={inputClassName}>
                  <option value="">Selecione...</option>
                  <option value="TED">TED</option>
                  <option value="DOC">DOC</option>
                  <option value="PIX">PIX</option>
                  <option value="BOLETO">Boleto</option>
                  <option value="DINHEIRO">Dinheiro</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-700">Fase</label>
                <input name="fase" className={inputClassName} />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-700">Etapa</label>
                <input name="etapa" className={inputClassName} />
              </div>

              <div className="flex items-end">
                <Button type="submit" variant="secondary">
                  Adicionar
                </Button>
              </div>
            </form>
          </Card>

          <Card>
            <div className="border-b border-zinc-200/60 p-6">
              <h2 className="text-lg font-semibold text-zinc-950">Lancamentos atuais</h2>
            </div>

            {bordero.lancamentos.length === 0 ? (
              <div className="p-6 text-sm text-zinc-500">Nenhum lancamento cadastrado.</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>NSU</TableHead>
                    <TableHead>Favorecido</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Vencimento</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Acoes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bordero.lancamentos.map((lancamento) => (
                    <TableRow key={lancamento.id}>
                      <TableCell className="font-mono text-sm">{lancamento.nsu}</TableCell>
                      <TableCell>{lancamento.favorecido.nome}</TableCell>
                      <TableCell>
                        {Number(lancamento.valor).toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </TableCell>
                      <TableCell>{formatDate(lancamento.dataVencimento)}</TableCell>
                      <TableCell>{lancamento.conciliado ? "Conciliado" : lancamento.autorizado ? "Autorizado" : "Pendente"}</TableCell>
                      <TableCell className="text-right">
                        <form action={removerLancamento.bind(null, bordero.id, lancamento.id)}>
                          <Button type="submit" variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-rose-600" />
                          </Button>
                        </form>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
}
