import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button, Card } from "@/components/ui";

type FornecedorOption = {
  id: string;
  nome: string;
  documento: string;
  tipo: string;
};

type ContratoFormValues = {
  idContrato?: string | null;
  fornecedorId?: string | null;
  objeto?: string | null;
  valorTotal?: number | string | null;
  status?: string | null;
};

type ContratoFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  fornecedores: FornecedorOption[];
  title: string;
  description: string;
  submitLabel: string;
  values?: ContratoFormValues;
  cancelHref?: string;
};

const inputClassName =
  "h-11 w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 text-sm focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/15";

export function ContratoForm({
  action,
  fornecedores,
  title,
  description,
  submitLabel,
  values,
  cancelHref = "/compras",
}: ContratoFormProps) {
  return (
    <div className="flex-1 ml-64">
      <div className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-zinc-200 bg-white/80 px-6 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Link href={cancelHref}>
            <Button variant="secondary" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-semibold text-zinc-950">{title}</h1>
            <p className="text-sm text-zinc-500">{description}</p>
          </div>
        </div>
      </div>

      <div className="space-y-6 p-6 lg:p-8">
        <form action={action} className="space-y-6">
          <Card>
            <div className="border-b border-zinc-200/60 p-6">
              <h2 className="text-lg font-semibold text-zinc-950">Dados do contrato</h2>
              <p className="text-sm text-zinc-500">Preencha identificacao, fornecedor, valor e situacao operacional.</p>
            </div>

            <div className="grid gap-4 p-6 md:grid-cols-2">
              <div className="space-y-1.5">
                <label htmlFor="idContrato" className="text-sm font-medium text-zinc-700">
                  ID do contrato
                </label>
                <input
                  id="idContrato"
                  name="idContrato"
                  required
                  defaultValue={values?.idContrato ?? ""}
                  placeholder="Ex: CTR-2026-001"
                  className={inputClassName}
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="fornecedorId" className="text-sm font-medium text-zinc-700">
                  Fornecedor
                </label>
                <select
                  id="fornecedorId"
                  name="fornecedorId"
                  required
                  defaultValue={values?.fornecedorId ?? ""}
                  className={inputClassName}
                >
                  <option value="">Selecione...</option>
                  {fornecedores.map((fornecedor) => (
                    <option key={fornecedor.id} value={fornecedor.id}>
                      {fornecedor.nome} | {fornecedor.documento} | {fornecedor.tipo}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label htmlFor="objeto" className="text-sm font-medium text-zinc-700">
                  Objeto
                </label>
                <textarea
                  id="objeto"
                  name="objeto"
                  rows={4}
                  defaultValue={values?.objeto ?? ""}
                  placeholder="Descreva o objeto do contrato."
                  className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/15"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="valorTotal" className="text-sm font-medium text-zinc-700">
                  Valor total
                </label>
                <input
                  id="valorTotal"
                  name="valorTotal"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  defaultValue={values?.valorTotal?.toString() ?? ""}
                  placeholder="0,00"
                  className={inputClassName}
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="status" className="text-sm font-medium text-zinc-700">
                  Status
                </label>
                <select id="status" name="status" defaultValue={values?.status ?? ""} className={inputClassName}>
                  <option value="">Selecione...</option>
                  <option value="Ativo">Ativo</option>
                  <option value="Vigente">Vigente</option>
                  <option value="Em negociacao">Em negociacao</option>
                  <option value="Suspenso">Suspenso</option>
                  <option value="Encerrado">Encerrado</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
              </div>
            </div>
          </Card>

          <div className="flex justify-end gap-4">
            <Link href={cancelHref}>
              <Button variant="secondary">Cancelar</Button>
            </Link>
            <Button type="submit" variant="primary">
              {submitLabel}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
