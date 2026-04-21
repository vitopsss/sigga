"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { salvarBordero, getProximoIdBordero } from "../actions";
import { Card, Button } from "@/components/ui";
import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="primary" disabled={pending}>
      {pending ? "Salvando..." : "Salvar Bordero"}
    </Button>
  );
}

type Projeto = {
  id: string;
  centroCusto: string;
  titulo: string;
};

type Favorecido = {
  id: string;
  nome: string;
  documento: string;
  tipo: string;
};

export function NovoBorderoForm({
  projetos,
  favorecidos,
}: {
  projetos: Projeto[];
  favorecidos: Favorecido[];
}) {
  const [numLancamentos, setNumLancamentos] = useState(1);
  const [proximoId, setProximoId] = useState<string>("");

  useEffect(() => {
    getProximoIdBordero().then(setProximoId).catch(() => {});
  }, []);

  return (
    <div className="flex min-h-screen bg-zinc-50">
      <div className="flex-1 ml-64">
        <div className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-zinc-200 bg-white/80 px-6 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <Link href="/borderos">
              <Button variant="secondary" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-semibold text-zinc-950">Novo Bordero</h1>
              <p className="text-sm text-zinc-500">Cadastro de borderô e lançamentos</p>
            </div>
          </div>
        </div>

        <div className="p-6 lg:p-8">
          <form action={salvarBordero} className="space-y-6">
            <Card>
              <div className="border-b border-zinc-200/60 p-6">
                <h2 className="text-lg font-semibold text-zinc-950">Dados do Bordero</h2>
                <p className="text-sm text-zinc-500">Informações principais do borderô</p>
              </div>

              <div className="grid gap-4 p-6 md:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-700">
                    ID do Bordero <span className="text-rose-500">*</span>
                  </label>
                  <input
                    name="idBordero"
                    defaultValue={proximoId}
                    placeholder="Ex: BOR000001"
                    className="h-11 w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 text-sm font-mono placeholder:text-zinc-400 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/15"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-700">
                    Projeto <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="projetoId"
                    required
                    className="h-11 w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 text-sm focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/15"
                  >
                    <option value="">Selecione...</option>
                    {projetos.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.centroCusto} — {p.titulo.slice(0, 50)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-700">Data</label>
                  <input
                    name="data"
                    type="date"
                    defaultValue={new Date().toISOString().split("T")[0]}
                    className="h-11 w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 text-sm focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/15"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-700">Tipo de Bordero</label>
                  <select
                    name="tipoBordero"
                    className="h-11 w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 text-sm focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/15"
                  >
                    <option value="">Selecione...</option>
                    <option value="2.225.Borderô - Pagar">2.225.Borderô - Pagar</option>
                    <option value="2.224.Borderô - Receber">2.224.Borderô - Receber</option>
                  </select>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between border-b border-zinc-200/60 p-6">
                <div>
                  <h2 className="text-lg font-semibold text-zinc-950">Lançamentos</h2>
                  <p className="text-sm text-zinc-500">Despesas e receitas do borderô</p>
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={numLancamentos}
                    onChange={(e) => setNumLancamentos(Number(e.target.value))}
                    className="h-10 rounded-xl border border-zinc-300 bg-zinc-50 px-3 text-sm"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((n) => (
                      <option key={n} value={n}>{n} lançamento{n > 1 ? "s" : ""}</option>
                    ))}
                  </select>
                </div>
              </div>

              <input type="hidden" name="numLancamentos" value={numLancamentos} />

              <div className="space-y-4 p-6">
                {Array.from({ length: numLancamentos }).map((_, index) => (
                  <div key={index} className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-4">
                    <h3 className="mb-4 text-sm font-semibold text-zinc-700">
                      Lançamento #{index + 1}
                    </h3>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-zinc-600">
                          NSU <span className="text-rose-500">*</span>
                        </label>
                        <input
                          name={`lancamento_${index}_nsu`}
                          required
                          placeholder="NSU único"
                          className="h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm placeholder:text-zinc-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/10"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-zinc-600">
                          Favorecido <span className="text-rose-500">*</span>
                        </label>
                        <select
                          name={`lancamento_${index}_favorecido`}
                          required
                          className="h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/10"
                        >
                          <option value="">Selecione...</option>
                          {favorecidos.map((favorecido) => (
                            <option key={favorecido.id} value={favorecido.id}>
                              {favorecido.nome} | {favorecido.documento} | {favorecido.tipo}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-zinc-600">
                          Valor (R$) <span className="text-rose-500">*</span>
                        </label>
                        <input
                          name={`lancamento_${index}_valor`}
                          required
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0,00"
                          className="h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm placeholder:text-zinc-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/10"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-zinc-600">
                          Data Vencimento <span className="text-rose-500">*</span>
                        </label>
                        <input
                          name={`lancamento_${index}_dataVencimento`}
                          required
                          type="date"
                          className="h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/10"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-zinc-600">Forma de Pagamento</label>
                        <select
                          name={`lancamento_${index}_formaPagamento`}
                          className="h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/10"
                        >
                          <option value="">Selecione...</option>
                          <option value="TED">TED</option>
                          <option value="DOC">DOC</option>
                          <option value="PIX">PIX</option>
                          <option value="BOLETO">Boleto</option>
                          <option value="DINHEIRO">Dinheiro</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-zinc-600">Fase</label>
                        <input
                          name={`lancamento_${index}_fase`}
                          placeholder="Fase do projeto"
                          className="h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm placeholder:text-zinc-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/10"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-zinc-600">Etapa</label>
                        <input
                          name={`lancamento_${index}_etapa`}
                          placeholder="Etapa do projeto"
                          className="h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm placeholder:text-zinc-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/10"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <div className="flex justify-end gap-4">
              <Link href="/borderos">
                <Button variant="secondary">Cancelar</Button>
              </Link>
              <SubmitButton />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
