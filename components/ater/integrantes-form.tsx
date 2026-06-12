"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Plus, Trash2, User, Users } from "lucide-react";

import { Button } from "@/components/ui";

export type IntegranteSnap = {
  nome: string;
  cpf?: string | null;
  nisCadUnico?: string | null;
  apelido?: string | null;
  sexo?: string | null;
  orientacaoSexual?: string | null;
  identidadeGenero?: string | null;
  dataNascimento?: string | Date | null;
  escolaridade?: string | null;
  nomeMae?: string | null;
  nomePai?: string | null;
  classificacao?: string | null;
  email?: string | null;
  telefones?: string | null;
  responsavelUfpa?: boolean | null;
  parentesco?: string | null;
};

interface IntegrantesFormProps {
  initialData?: IntegranteSnap[];
  max?: number;
}

const inputClassName =
  "mt-2 w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15";
const labelClassName = "block";

interface FieldProps {
  label: string;
  value?: string | null;
  onChange: (val: string) => void;
  type?: string;
  placeholder?: string;
}

function Field({ label, value, onChange, type = "text", placeholder }: FieldProps) {
  return (
    <label className={labelClassName}>
      <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">{label}</span>
      <input
        type={type}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputClassName}
      />
    </label>
  );
}

interface SelectFieldProps {
  label: string;
  value?: string | null;
  onChange: (val: string) => void;
  options: string[];
}

function SelectField({ label, value, onChange, options }: SelectFieldProps) {
  return (
    <label className={labelClassName}>
      <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">{label}</span>
      <select value={value ?? ""} onChange={(e) => onChange(e.target.value)} className={inputClassName}>
        <option value="">Selecione...</option>
        {options.map((opt: string) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  );
}

export function IntegrantesForm({ initialData = [], max = 12 }: IntegrantesFormProps) {
  const [items, setItems] = useState<IntegranteSnap[]>(
    initialData.length > 0 ? initialData : [{ nome: "", responsavelUfpa: true }]
  );
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  function addItem() {
    if (items.length < max) {
      setItems([...items, { nome: "", responsavelUfpa: false }]);
      setExpandedIndex(items.length);
    }
  }

  function removeItem(index: number) {
    const next = [...items];
    next.splice(index, 1);
    setItems(next.length > 0 ? next : [{ nome: "", responsavelUfpa: true }]);
    if (expandedIndex === index) setExpandedIndex(null);
  }

  function updateItem(index: number, data: Partial<IntegranteSnap>) {
    const next = [...items];
    next[index] = { ...next[index], ...data };
    setItems(next);
  }

  function toggleExpand(index: number) {
    setExpandedIndex(expandedIndex === index ? null : index);
  }

  function formatDateValue(date: string | Date | null | undefined) {
    if (!date) return "";
    if (date instanceof Date) return date.toISOString().split("T")[0];
    return String(date).split("T")[0];
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-emerald-600" />
          <h3 className="text-lg font-bold text-zinc-900">Composição Familiar</h3>
        </div>
        <p className="text-xs font-medium text-zinc-500">{items.length} de {max} integrantes</p>
      </div>

      <div className="grid gap-4">
        {items.map((item, index) => {
          const isExpanded = expandedIndex === index;
          const isResponsavel = item.responsavelUfpa === true;

          return (
            <div
              key={index}
              className={`overflow-hidden rounded-2xl border transition-all ${
                isExpanded
                  ? "border-emerald-200 bg-white shadow-md ring-4 ring-emerald-500/5"
                  : "border-zinc-200 bg-zinc-50/50 hover:border-zinc-300"
              }`}
            >
              {/* Header do Card */}
              <div
                className="flex cursor-pointer items-center justify-between p-4"
                onClick={() => toggleExpand(index)}
              >
                <div className="flex items-center gap-3">
                  <div className={`rounded-full p-2 ${isResponsavel ? "bg-emerald-100 text-emerald-700" : "bg-zinc-100 text-zinc-500"}`}>
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <p className={`text-sm font-bold ${item.nome ? "text-zinc-950" : "text-zinc-400 italic"}`}>
                      {item.nome || "Novo integrante..."}
                    </p>
                    <div className="flex gap-2">
                      {isResponsavel && (
                        <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">Responsável</span>
                      )}
                      {item.parentesco && (
                        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{item.parentesco}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); removeItem(index); }}
                    className="rounded-lg p-2 text-zinc-400 transition hover:bg-rose-50 hover:text-rose-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  {isExpanded ? <ChevronUp className="h-5 w-5 text-zinc-400" /> : <ChevronDown className="h-5 w-5 text-zinc-400" />}
                </div>
              </div>

              {/* Corpo do Card (Campos) */}
              {isExpanded && (
                <div className="border-t border-zinc-100 p-6">
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
                    <Field label="Nome Completo *" value={item.nome} onChange={(v: string) => updateItem(index, { nome: v })} />
                    <Field label="CPF" value={item.cpf} onChange={(v: string) => updateItem(index, { cpf: v })} />
                    <Field label="NIS / CadÚnico" value={item.nisCadUnico} onChange={(v: string) => updateItem(index, { nisCadUnico: v })} />
                    <Field label="Apelido" value={item.apelido} onChange={(v: string) => updateItem(index, { apelido: v })} />

                    <SelectField
                      label="Sexo"
                      value={item.sexo}
                      onChange={(v: string) => updateItem(index, { sexo: v })}
                      options={["Masculino", "Feminino"]}
                    />
                    <Field label="Orientação Sexual" value={item.orientacaoSexual} onChange={(v: string) => updateItem(index, { orientacaoSexual: v })} />
                    <Field label="Identidade de Gênero" value={item.identidadeGenero} onChange={(v: string) => updateItem(index, { identidadeGenero: v })} />
                    <Field label="Data de Nascimento" type="date" value={formatDateValue(item.dataNascimento)} onChange={(v: string) => updateItem(index, { dataNascimento: v })} />

                    <Field label="Parentesco" value={item.parentesco} onChange={(v: string) => updateItem(index, { parentesco: v })} placeholder="Ex: Cônjuge, Filho..." />
                    <Field label="Escolaridade" value={item.escolaridade} onChange={(v: string) => updateItem(index, { escolaridade: v })} />
                    <Field label="Nome da Mãe" value={item.nomeMae} onChange={(v: string) => updateItem(index, { nomeMae: v })} />
                    <Field label="Nome do Pai" value={item.nomePai} onChange={(v: string) => updateItem(index, { nomePai: v })} />

                    <Field label="Telefones" value={item.telefones} onChange={(v: string) => updateItem(index, { telefones: v })} />
                    <Field label="E-mail" type="email" value={item.email} onChange={(v: string) => updateItem(index, { email: v })} />
                    <Field label="Classificação" value={item.classificacao} onChange={(v: string) => updateItem(index, { classificacao: v })} />

                    <label className="flex items-center gap-3 self-end py-3">
                      <input
                        type="checkbox"
                        checked={isResponsavel}
                        onChange={(e) => updateItem(index, { responsavelUfpa: e.target.checked })}
                        className="h-5 w-5 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="text-sm font-bold text-zinc-700">Responsável pela UFPA</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Hidden Inputs for Form Submission */}
              <div className="hidden">
                <input type="hidden" name={`integrante_${index}_nome`} value={item.nome || ""} />
                <input type="hidden" name={`integrante_${index}_cpf`} value={item.cpf || ""} />
                <input type="hidden" name={`integrante_${index}_nisCadUnico`} value={item.nisCadUnico || ""} />
                <input type="hidden" name={`integrante_${index}_apelido`} value={item.apelido || ""} />
                <input type="hidden" name={`integrante_${index}_sexo`} value={item.sexo || ""} />
                <input type="hidden" name={`integrante_${index}_orientacaoSexual`} value={item.orientacaoSexual || ""} />
                <input type="hidden" name={`integrante_${index}_identidadeGenero`} value={item.identidadeGenero || ""} />
                <input type="hidden" name={`integrante_${index}_dataNascimento`} value={formatDateValue(item.dataNascimento)} />
                <input type="hidden" name={`integrante_${index}_escolaridade`} value={item.escolaridade || ""} />
                <input type="hidden" name={`integrante_${index}_nomeMae`} value={item.nomeMae || ""} />
                <input type="hidden" name={`integrante_${index}_nomePai`} value={item.nomePai || ""} />
                <input type="hidden" name={`integrante_${index}_classificacao`} value={item.classificacao || ""} />
                <input type="hidden" name={`integrante_${index}_email`} value={item.email || ""} />
                <input type="hidden" name={`integrante_${index}_telefones`} value={item.telefones || ""} />
                <input type="hidden" name={`integrante_${index}_parentesco`} value={item.parentesco || ""} />
                <input type="hidden" name={`integrante_${index}_responsavelUfpa`} value={item.responsavelUfpa ? "true" : "false"} />
              </div>
            </div>
          );
        })}
      </div>

      {items.length < max && (
        <Button
          type="button"
          variant="outline"
          onClick={addItem}
          className="w-full border-dashed border-zinc-300 py-8 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700"
        >
          <Plus className="h-5 w-5" />
          Adicionar novo integrante à família
        </Button>
      )}
    </div>
  );
}
