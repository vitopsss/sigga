import Link from "next/link";
import { notFound } from "next/navigation";
import { Pencil, Calendar, Target, Plus, Building2 } from "lucide-react";

import { ProjetoService } from "@/lib/services/projeto.service";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { Card, Badge, Button } from "@/components/ui";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { adicionarOrcamento } from "../acoes-itens";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

function getStatusBadge(status: string) {
  const s = status.toLowerCase();
  if (s === "ativo" || s === "em execução") return <Badge variant="success">Ativo</Badge>;
  if (s === "planejamento") return <Badge variant="warning">Planejamento</Badge>;
  if (s === "concluído") return <Badge variant="info">Concluído</Badge>;
  return <Badge variant="outline">{status}</Badge>;
}

export default async function ProjetoDetalhePage({
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
          title={projeto.centroCusto}
          description={projeto.titulo}
          actions={
            <Link href={`/projetos/${projeto.id}/editar`}>
              <Button variant="primary">
                <Pencil className="h-4 w-4" /> Editar Projeto
              </Button>
            </Link>
          }
        />

        <div className="p-6 lg:p-8 space-y-8">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="p-6 space-y-4">
              <div className="flex items-center gap-3 text-zinc-500">
                <Calendar className="h-5 w-5" />
                <span className="text-sm font-medium uppercase tracking-wider">Vigência</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-zinc-950">
                  {projeto.vigenciaInicial.toLocaleDateString("pt-BR")} — 
                  {projeto.vigenciaFinal?.toLocaleDateString("pt-BR") ?? "Indefinida"}
                </p>
                <p className="text-sm text-zinc-500 mt-1">Prazo contratual</p>
              </div>
            </Card>

            <Card className="p-6 space-y-4">
              <div className="flex items-center gap-3 text-zinc-500">
                <Building2 className="h-5 w-5" />
                <span className="text-sm font-medium uppercase tracking-wider">Investimento</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-zinc-950">
                  {currencyFormatter.format(Number(projeto.valorTotal))}
                </p>
                <p className="text-sm text-zinc-500 mt-1">Valor total do contrato</p>
              </div>
            </Card>

            <Card className="p-6 space-y-4">
              <div className="flex items-center gap-3 text-zinc-500">
                <Target className="h-5 w-5" />
                <span className="text-sm font-medium uppercase tracking-wider">Status Atual</span>
              </div>
              <div className="flex flex-col gap-2">
                <div>{getStatusBadge(projeto.status)}</div>
                <p className="text-sm text-zinc-500">Fase do ciclo de vida</p>
              </div>
            </Card>
          </div>

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-zinc-950">Itens de Orçamento</h2>
            </div>
            
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cód. Orc</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Ref. Unitária</TableHead>
                    <TableHead>Total Previsto</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projeto.orcamentoItens.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-zinc-500">
                        Nenhum item de orçamento cadastrado.
                      </TableCell>
                    </TableRow>
                  ) : (
                    projeto.orcamentoItens.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-mono text-xs">{item.idOrc}</TableCell>
                        <TableCell className="text-zinc-700">{item.descricao ?? "—"}</TableCell>
                        <TableCell>{currencyFormatter.format(Number(item.valorReferencia))}</TableCell>
                        <TableCell className="font-semibold text-zinc-950">
                          {currencyFormatter.format(Number(item.valorTotal))}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                  <TableRow className="bg-zinc-50/50">
                    <form action={adicionarOrcamento.bind(null, projeto.id)}>
                      <TableCell><input name="idOrc" placeholder="Cód." required className="w-full bg-transparent border-none focus:ring-0 text-xs font-mono" /></TableCell>
                      <TableCell><input name="descricao" placeholder="Nova descrição do item..." className="w-full bg-transparent border-none focus:ring-0 text-sm" /></TableCell>
                      <TableCell><input name="valorReferencia" type="number" step="0.01" placeholder="0,00" className="w-full bg-transparent border-none focus:ring-0 text-sm" /></TableCell>
                      <TableCell className="flex items-center gap-2">
                        <input name="valorTotal" type="number" step="0.01" placeholder="0,00" className="w-full bg-transparent border-none focus:ring-0 text-sm font-semibold" />
                        <Button type="submit" variant="ghost" size="icon" className="h-8 w-8 text-teal-600">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </form>
                  </TableRow>
                </TableBody>
              </Table>
            </Card>
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-zinc-950">Metas e Indicadores</h2>
              <Link href={`/monitoramento/novo?projetoId=${projeto.id}`}>
                <Button variant="secondary" size="sm">Configurar Metas</Button>
              </Link>
            </div>
            
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Meta</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Unidade</TableHead>
                    <TableHead>Previsto</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projeto.metas.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-zinc-500">
                        Nenhuma meta configurada para este projeto.
                      </TableCell>
                    </TableRow>
                  ) : (
                    projeto.metas.map((meta) => (
                      <TableRow key={meta.id}>
                        <TableCell className="font-medium text-zinc-950">{meta.titulo}</TableCell>
                        <TableCell className="text-zinc-600 text-sm">{meta.descricao ?? "—"}</TableCell>
                        <TableCell className="text-zinc-500 text-xs uppercase tracking-wider">{meta.unidade ?? "un"}</TableCell>
                        <TableCell className="font-bold text-zinc-950">{meta.valorPrevisto}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Card>
          </section>
        </div>
      </main>
    </div>
  );
}
