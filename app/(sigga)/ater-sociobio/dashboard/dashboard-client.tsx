"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import {
  AlertCircle,
  AlertTriangle,
  Building2,
  ClipboardCheck,
  ClipboardList,
  Droplets,
  Filter,
  Globe,
  LayoutDashboard,
  Leaf,
  MousePointer2,
  Search,
  Users,
  Wifi,
  X,
  Download,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { ExportExcelButton } from "@/components/system/export-excel-button";
import { mapUfpasToExcelData } from "@/lib/excel-export";
import {
  type SiggaterAtendimentoDashboardItem,
  type SiggaterDashboardData,
  type SiggaterDashboardItem,
  type SiggaterOrganizacaoDashboardItem,
} from "@/lib/services/ater-sociobio.service";
import {
  ATER_SOCIOBIO_LIMITACOES_AMBIENTAL,
  ATER_SOCIOBIO_LIMITACOES_PRODUTIVO,
  ATER_SOCIOBIO_LIMITACOES_SOCIAL,
  ATER_SOCIOBIO_POTENCIALIDADES_AMBIENTAL,
  ATER_SOCIOBIO_POTENCIALIDADES_PRODUTIVO,
  ATER_SOCIOBIO_POTENCIALIDADES_SOCIAL,
  getAterSociobioStatusRelatorioLabel,
} from "@/lib/constants/ater-sociobio";
import { PRONAF_LINHAS_UFPA } from "@/lib/constants/ater-sociobio-official";
import { exportUfpasToExcel, exportTableToExcel } from "@/lib/excel-export";

export type DashboardView = "ufpas" | "organizacoes" | "atendimentos";
type DashboardTab = DashboardView;
type FocusKey =
  | "comAlertas"
  | "semDiagnostico"
  | "semAgua"
  | "semCadUnico"
  | "inseguranca"
  | "semInternet"
  | "semSga"
  | "comDapCaf"
  | "comMulheresUfpa"
  | "comJovensUfpa"
  | "comVisitas"
  | "semPoliticasSociais"
  | "semPoliticasProdutivas"
  | "mulheres"
  | "jovens"
  | "emAnalise"
  | "reprovados"
  | "indicadoresPendentes"
  | "praticasAmbientais"
  | "semPraticasAmbientais"
  | "politicasPublicas"
  | "semPoliticasPublicas"
  | "identidadeComercial"
  | "semIdentidadeComercial"
  | "filiadaOrganizacao"
  | "semFiliadaOrganizacao"
  | "mulheresDiretoria"
  | "jovensDiretoria"
  | null;

function normalized(value?: string | null) {
  return String(value ?? "").trim();
}

function ratio(part: number, total: number) {
  return total > 0 ? Math.round((part / total) * 100) : 0;
}

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatDate(value?: string | null) {
  return value ? new Date(value).toLocaleDateString("pt-BR") : "-";
}

function isFocusKey(value: string | null): value is Exclude<FocusKey, null> {
  return [
    "comAlertas",
    "semDiagnostico",
    "semAgua",
    "semCadUnico",
    "inseguranca",
    "semInternet",
    "semSga",
    "comDapCaf",
    "comMulheresUfpa",
    "comJovensUfpa",
    "comVisitas",
    "semPoliticasSociais",
    "semPoliticasProdutivas",
    "mulheres",
    "jovens",
    "emAnalise",
    "reprovados",
    "indicadoresPendentes",
    "praticasAmbientais",
    "semPraticasAmbientais",
    "politicasPublicas",
    "semPoliticasPublicas",
    "identidadeComercial",
    "semIdentidadeComercial",
    "filiadaOrganizacao",
    "semFiliadaOrganizacao",
    "mulheresDiretoria",
    "jovensDiretoria",
  ].includes(String(value));
}

function isDashboardTab(value: string | null): value is DashboardTab {
  return value === "ufpas" || value === "organizacoes" || value === "atendimentos";
}

function focusFilter(keys: FocusKey[], item: SiggaterDashboardItem | SiggaterAtendimentoDashboardItem | SiggaterOrganizacaoDashboardItem, tab: DashboardView) {
  if (!keys || keys.length === 0) return true;

  // Usa AND: todos os filtros devem ser satisfeitos
  return keys.every((key) => {
    if (!key) return true;
    if (tab === "ufpas") {
      const ufpa = item as SiggaterDashboardItem;
      switch (key) {
        case "comAlertas": return getRisks(ufpa).length > 0;
        case "semDiagnostico": return !ufpa.diagnosticoRegistrado;
        case "semAgua": return ufpa.aguaTratada === false;
        case "semCadUnico": return ufpa.cadUnico === false;
        case "inseguranca": return ufpa.insegurancaAlimentar === true;
        case "semInternet": return ufpa.possuiInternet === false;
        case "semSga": return !ufpa.temSga;
        case "comDapCaf": return ufpa.temDapCaf;
        case "comMulheresUfpa": return ufpa.mulheres > 0;
        case "comJovensUfpa": return ufpa.jovens > 0;
        case "comVisitas": return ufpa.atendimentos > 0;
        case "semPoliticasSociais": return ufpa.politicasSociais === false;
        case "semPoliticasProdutivas": return ufpa.politicasProdutivas === false;
        default: return true;
      }
    }

    if (tab === "organizacoes") {
      const org = item as SiggaterOrganizacaoDashboardItem;
      switch (key) {
        case "indicadoresPendentes": return !org.indicadoresRegistrados;
        case "praticasAmbientais": return org.praticasAmbientais === true;
        case "semPraticasAmbientais": return org.praticasAmbientais === false;
        case "politicasPublicas": return org.politicasPublicas === true;
        case "semPoliticasPublicas": return org.politicasPublicas === false;
        case "identidadeComercial": return org.identidadeComercial === true;
        case "semIdentidadeComercial": return org.identidadeComercial === false;
        case "filiadaOrganizacao": return org.representacaoPolitica === true;
        case "semFiliadaOrganizacao": return org.representacaoPolitica === false;
        case "mulheresDiretoria": return org.mulheresDiretoria === true;
        case "jovensDiretoria": return org.jovensDiretoria === true;
        default: return true;
      }
    }

    if (tab === "atendimentos") {
      const aten = item as SiggaterAtendimentoDashboardItem;
      switch (key) {
        case "emAnalise": return aten.statusRelatorio === "AGUARDANDO_GESTOR";
        case "reprovados": return aten.statusRelatorio === "REPROVADO_GESTOR";
        default: return true;
      }
    }

    return true;
  });
}

/**
 * Regras de risco com pesos ponderados.
 * Pesos definidos em reunião 2026-06-13:
 *   diagnóstico ausente      : 3 (impede todas as outras análises)
 *   água sem tratamento      : 3 (saúde básica)
 *   esgoto sem tratamento    : 3 (saneamento básico)
 *   insegurança alimentar    : 4 (vulnerabilidade mais crítica)
 *   sem CadÚnico             : 2 (acesso a políticas sociais bloqueado)
 *   sem políticas produtivas : 2 (potencial econômico não aproveitado)
 *   SGA pendente             : 1 (pendência operacional)
 */
const RISK_WEIGHTS: Array<{
  label: string;
  weight: number;
  condition: (item: SiggaterDashboardItem) => boolean;
}> = [
  { label: "Diagnóstico pendente",      weight: 3, condition: (i) => !i.diagnosticoRegistrado },
  { label: "Água sem tratamento",       weight: 3, condition: (i) => i.aguaTratada === false },
  { label: "Sem esgoto tratado",        weight: 3, condition: (i) => i.esgotoTratado === false },
  { label: "Insegurança alimentar",     weight: 4, condition: (i) => i.insegurancaAlimentar === true },
  { label: "Sem CadÚnico",             weight: 2, condition: (i) => i.cadUnico === false },
  { label: "Sem políticas produtivas", weight: 2, condition: (i) => i.politicasProdutivas === false },
  { label: "SGA pendente",             weight: 1, condition: (i) => !i.temSga },
];

function getRisks(item: SiggaterDashboardItem) {
  return RISK_WEIGHTS.filter((r) => r.condition(item)).map((r) => r.label);
}

/** Soma dos pesos dos riscos ativos. Usada para ordenar as UFPAs prioritárias. */
function getRiskScore(item: SiggaterDashboardItem) {
  return RISK_WEIGHTS.filter((r) => r.condition(item)).reduce((sum, r) => sum + r.weight, 0);
}

function groupCount<T>(items: T[], getName: (item: T) => string | null | undefined) {
  const map = new Map<string, number>();
  items.forEach((item) => {
    const name = normalized(getName(item)) || "Não informado";
    map.set(name, (map.get(name) ?? 0) + 1);
  });

  return Array.from(map.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value || a.name.localeCompare(b.name, "pt-BR"));
}

function groupArrayValues<T>(items: T[], getValues: (item: T) => string[], officialValues: readonly string[] = []) {
  const officialOrder = new Map(officialValues.map((value, index) => [normalized(value), index]));
  const map = new Map<string, number>(officialValues.map((value) => [normalized(value), 0]));

  items.forEach((item) => {
    getValues(item).forEach((value) => {
      const name = normalized(value);
      if (name) map.set(name, (map.get(name) ?? 0) + 1);
    });
  });

  return Array.from(map.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => {
      const valueCompare = b.value - a.value;
      if (valueCompare !== 0) return valueCompare;

      const orderA = officialOrder.get(a.name) ?? Number.MAX_SAFE_INTEGER;
      const orderB = officialOrder.get(b.name) ?? Number.MAX_SAFE_INTEGER;
      return orderA - orderB || a.name.localeCompare(b.name, "pt-BR");
    });
}

function MetricCard({
  label,
  value,
  description,
  tone,
  icon: Icon,
  active,
  onClick,
  onExport,
}: {
  label: string;
  value: string | number;
  description: string;
  tone: "blue" | "green" | "amber" | "rose" | "zinc";
  icon?: typeof Users;
  active?: boolean;
  onClick?: () => void;
  onExport?: (e: React.MouseEvent) => void;
}) {
  const colors = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    green: "bg-emerald-50 text-emerald-600 border-emerald-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    rose: "bg-rose-50 text-rose-600 border-rose-100",
    zinc: "bg-zinc-50 text-zinc-600 border-zinc-200",
  }[tone];

  return (
    <div className="relative group/metric">
      <button
        type="button"
        onClick={onClick}
        className={cn(
        "group block w-full text-left rounded-xl border p-3 transition-all outline-none",
        active
          ? "border-zinc-950 bg-zinc-950 shadow-xl shadow-zinc-950/20"
          : "border-zinc-200/60 bg-white hover:border-zinc-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] shadow-[0_2px_4px_rgba(0,0,0,0.02)]"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className={cn(
          "inline-flex rounded-lg border p-1.5",
          active ? "bg-white/10 border-white/20 text-white" : colors
        )}>
          {Icon ? <Icon className="h-4 w-4" /> : <div className="h-4 w-4" />}
        </div>
        <div className="text-right">
          <p className={cn("text-[11px] font-bold", active ? "text-zinc-400" : "text-zinc-500")}>{label}</p>
          <p className={cn("mt-0.5 text-xl font-bold tracking-tight", active ? "text-white" : "text-zinc-950")}>{value}</p>
        </div>
      </div>
      <div className={cn("mt-3 border-t pt-3", active ? "border-white/10" : "border-zinc-50")}>
        <p className={cn("text-[11px] leading-snug font-medium", active ? "text-zinc-500" : "text-zinc-500")}>{description}</p>
      </div>
      </button>
      {onExport && (
        <button
          type="button"
          onClick={onExport}
          title={`Baixar excel: ${label}`}
          className="absolute right-3 top-3 rounded-lg border border-transparent bg-white/50 p-1.5 text-zinc-400 opacity-0 transition-all hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600 focus:opacity-100 group-hover/metric:opacity-100"
        >
          <Download className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

function TabButton({
  active,
  icon: Icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: typeof Users;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all ${
        active
          ? "bg-zinc-950 text-white shadow-lg shadow-zinc-950/20"
          : "bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300"
      }`}
    >
      <Icon className={`h-4 w-4 ${active ? "text-white" : "text-zinc-400"}`} />
      {label}
    </button>
  );
}

function AlertButton({
  label,
  value,
  description,
  active,
  onClick,
  onExport,
  icon: Icon,
}: {
  label: string;
  value: number;
  description: string;
  active: boolean;
  onClick: () => void;
  onExport?: (e: React.MouseEvent) => void;
  icon: typeof AlertCircle;
}) {
  return (
    <div className="relative group/alert">
      <button
        type="button"
        onClick={onClick}
        className={`w-full group relative overflow-hidden rounded-xl border p-3 text-left transition-all ${
        active
          ? "border-zinc-900 bg-zinc-950 text-white shadow-xl shadow-zinc-950/20"
          : "border-zinc-200 bg-white text-zinc-900 hover:border-zinc-300 hover:bg-zinc-50/50"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className={`rounded-lg p-1.5 ${active ? "bg-white/10" : "bg-zinc-100 text-zinc-500 group-hover:bg-zinc-200/50"}`}>
          <Icon className="h-4 w-4" />
        </div>
        <span className={`text-xl font-bold ${active ? "text-white" : "text-zinc-950"}`}>{value}</span>
      </div>
      <div className="mt-3">
        <span className={`text-xs font-bold ${active ? "text-zinc-100" : "text-zinc-900"}`}>{label}</span>
        <p className={`mt-1 text-[11px] leading-snug ${active ? "text-zinc-400" : "text-zinc-500"}`}>{description}</p>
      </div>
      </button>
      {onExport && (
        <button
          type="button"
          onClick={onExport}
          title={`Baixar excel: ${label}`}
          className="absolute right-3 top-3 rounded-lg border border-transparent bg-white/50 p-1.5 text-zinc-400 opacity-0 transition-all hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600 focus:opacity-100 group-hover/alert:opacity-100"
        >
          <Download className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

function SimpleBarList({
  title,
  data,
  color = "bg-emerald-600",
  getHref,
}: {
  title: string;
  data: { name: string; value: number }[];
  color?: string;
  getHref?: (name: string) => string;
}) {
  const max = Math.max(...data.map((item) => item.value), 1);

  return (
    <div className="rounded-2xl border border-zinc-200/60 bg-white p-6 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
      <div className="mb-6 flex items-center gap-2">
        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        <h2 className="text-base font-bold text-zinc-900">{title}</h2>
      </div>
      <div className="space-y-4">
        {data.length ? (
          data.slice(0, 8).map((item) => {
            const Content = (
              <div key={item.name} className="group">
                <div className="mb-1.5 flex items-center justify-between gap-3 text-xs">
                  <span className={`font-bold transition-colors ${getHref ? "text-emerald-700 hover:text-emerald-600" : "text-zinc-700"}`}>
                    {item.name}
                  </span>
                  <span className="font-mono font-bold text-zinc-500">{item.value}</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ease-out ${color}`}
                    style={{ width: `${Math.max(4, (item.value / max) * 100)}%` }}
                  />
                </div>
              </div>
            );

            if (getHref) {
              return (
                <Link key={item.name} href={getHref(item.name)}>
                  {Content}
                </Link>
              );
            }

            return Content;
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="rounded-full bg-zinc-50 p-3">
              <Search className="h-6 w-6 text-zinc-300" />
            </div>
            <p className="mt-3 text-sm font-bold text-zinc-400">Sem dados no recorte atual.</p>
          </div>
        )}
      </div>
    </div>
  );
}

type BooleanMetric<T> = {
  label: string;
  getValue: (item: T) => boolean | null;
};

function countBooleanMetric<T>(items: T[], metric: BooleanMetric<T>) {
  return items.reduce(
    (acc, item) => {
      const value = metric.getValue(item);
      if (value === true) acc.sim += 1;
      else if (value === false) acc.nao += 1;
      else acc.semInfo += 1;
      return acc;
    },
    { sim: 0, nao: 0, semInfo: 0 },
  );
}

function BooleanMetricsTable<T>({
  title,
  metrics,
  items,
}: {
  title: string;
  metrics: BooleanMetric<T>[];
  items: T[];
}) {
  function handleExport() {
    const data = items.map((item: any) => {
      const row: any = {
        "ID": item.id,
        "Nome": item.nomeFamilia || item.denominacao || "N/A",
        "Município": item.municipio || "N/A",
      };
      metrics.forEach((metric) => {
        const val = metric.getValue(item);
        row[metric.label] = val === true ? "Sim" : val === false ? "Não" : "S/I";
      });
      return row;
    });
    exportTableToExcel(data, `Analise_${title.replace(/[^a-z0-9]/gi, "_")}.xlsx`, title.substring(0, 31));
  }

  return (
    <div className="relative group/table rounded-xl border border-zinc-200/70 bg-white p-4 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-sm font-bold text-zinc-900">{title}</h3>
        <div className="grid w-32 grid-cols-3 text-center text-[10px] font-bold uppercase tracking-wider text-zinc-400">
          <span>Sim</span>
          <span>Não</span>
          <span>S/I</span>
        </div>
      </div>
      <div className="divide-y divide-zinc-100">
        {metrics.map((metric) => {
          const count = countBooleanMetric(items, metric);

          return (
            <div key={metric.label} className="grid grid-cols-[minmax(0,1fr)_8rem] items-center gap-3 py-2">
              <span className="truncate text-xs font-semibold text-zinc-700">{metric.label}</span>
              <div className="grid grid-cols-3 text-center text-xs font-bold">
                <span className="text-emerald-700">{count.sim}</span>
                <span className="text-rose-700">{count.nao}</span>
                <span className="text-zinc-400">{count.semInfo}</span>
              </div>
            </div>
          );
        })}
      </div>
      <button
        type="button"
        onClick={handleExport}
        title={`Baixar tabela: ${title}`}
        className="absolute -top-3 -right-3 rounded-lg border border-zinc-200/50 bg-white shadow-sm p-1.5 text-zinc-400 opacity-0 transition-all hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600 focus:opacity-100 group-hover/table:opacity-100"
      >
        <Download className="h-4 w-4" />
      </button>
    </div>
  );
}

function CompactRankList({
  title,
  data,
  emptyLabel = "Sem dados no recorte atual.",
  items,
  extractFn,
}: {
  title: string;
  data: { name: string; value: number }[];
  emptyLabel?: string;
  items?: any[];
  extractFn?: (item: any) => string[];
}) {
  function handleExport() {
    if (items && extractFn) {
      // Map row by row showing which family has which item
      const exportData = items.flatMap(item => {
        const extracted = extractFn(item) || [];
        if (!extracted.length) return [];
        return extracted.map(val => ({
          "ID": item.id,
          "Nome": item.nomeFamilia || item.denominacao || "N/A",
          "Município": item.municipio || "N/A",
          "Item": val
        }));
      });
      if (exportData.length > 0) {
        exportTableToExcel(exportData, `Ranking_${title.replace(/[^a-z0-9]/gi, "_")}.xlsx`, title.substring(0, 31));
        return;
      }
    }
    const exportData = data.map(item => ({
      Item: item.name,
      Quantidade: item.value,
    }));
    exportTableToExcel(exportData, `Ranking_${title.replace(/[^a-z0-9]/gi, "_")}.xlsx`, title.substring(0, 31));
  }

  const max = Math.max(...data.map((item) => item.value), 1);

  return (
    <div className="relative group/table rounded-xl border border-zinc-200/70 bg-white p-4 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
      <h3 className="mb-3 text-sm font-bold text-zinc-900">{title}</h3>
      <div className="space-y-2">
        {data.length ? (
          data.map((item) => (
            <div key={item.name}>
              <div className="mb-1 flex items-center justify-between gap-3 text-xs">
                <span className="truncate font-semibold text-zinc-700">{item.name}</span>
                <span className="font-mono font-bold text-zinc-500">{item.value}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-zinc-100">
                <div className="h-full rounded-full bg-emerald-600" style={{ width: `${Math.max(5, (item.value / max) * 100)}%` }} />
              </div>
            </div>
          ))
        ) : (
          <p className="py-3 text-xs font-semibold text-zinc-400">{emptyLabel}</p>
        )}
      </div>
      {data.length > 0 && (
        <button
          type="button"
          onClick={handleExport}
          title={`Baixar ranking: ${title}`}
          className="absolute -top-3 -right-3 rounded-lg border border-zinc-200/50 bg-white shadow-sm p-1.5 text-zinc-400 opacity-0 transition-all hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600 focus:opacity-100 group-hover/table:opacity-100"
        >
          <Download className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

function CompactValueList({
  title,
  data,
}: {
  title: string;
  data: { label: string; value: string | number }[];
}) {
  return (
    <div className="rounded-xl border border-zinc-200/70 bg-white p-4 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
      <h3 className="mb-3 text-sm font-bold text-zinc-900">{title}</h3>
      <div className="divide-y divide-zinc-100">
        {data.map((item) => (
          <div key={item.label} className="flex items-center justify-between gap-4 py-2 text-xs">
            <span className="font-semibold text-zinc-700">{item.label}</span>
            <span className="text-right font-mono font-bold text-zinc-950">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function UfpaPrioritiesCard({
  priorities,
  appendReturnHref,
}: {
  priorities: Array<SiggaterDashboardItem & { risks: string[]; score: number }>;
  appendReturnHref: (href: string) => string;
}) {
  return (
    <section className="rounded-2xl border border-zinc-200/60 bg-white p-6 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-rose-500" />
            <h2 className="text-base font-bold text-zinc-900">UFPAs prioritárias</h2>
          </div>
          <p className="mt-1 text-xs font-bold uppercase tracking-wider text-zinc-500">
            Ranking ponderado por severidade das pendências.
          </p>
        </div>
        <Link href={appendReturnHref("/ater-sociobio/familias")} className="rounded-xl border border-zinc-200 px-4 py-2 text-xs font-bold text-zinc-700 transition hover:bg-zinc-50">
          Ver todas
        </Link>
      </div>

      <div className="mt-6 divide-y divide-zinc-100">
        {priorities.length ? (
          priorities.map((item) => (
            <div key={item.id} className="grid gap-4 py-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-zinc-950">{item.nomeFamilia}</p>
                  <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-700" title="Score ponderado de prioridade">
                    {item.score}pts
                  </span>
                </div>
                <p className="mt-1 text-xs font-bold text-zinc-400">{item.organizacaoColetiva || item.comunidade || "Sem vínculo informado"}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {item.risks.map((risk) => (
                    <span key={`${item.id}-${risk}`} className="rounded-full bg-zinc-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-600">
                      {risk}
                    </span>
                  ))}
                </div>
              </div>
              <Link href={appendReturnHref(`/ater-sociobio/familias/${item.id}`)} className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100">
                <MousePointer2 className="h-3.5 w-3.5" />
                Abrir UFPA
              </Link>
            </div>
          ))
        ) : (
          <div className="py-10 text-center">
            <p className="text-sm font-bold text-zinc-400">Nenhuma prioridade no recorte atual.</p>
          </div>
        )}
      </div>
    </section>
  );
}

function UfpaSampleProfile({
  total,
  communities,
  organizations,
  activities,
  biomes,
}: {
  total: number;
  communities: { name: string; value: number }[];
  organizations: { name: string; value: number }[];
  activities: { name: string; value: number }[];
  biomes: { name: string; value: number }[];
}) {
  const visibleBiomes = biomes.length > 1 ? biomes : [];
  const singleBiome = biomes.length === 1 ? biomes[0].name : null;

  return (
    <details className="group rounded-2xl border border-zinc-200/70 bg-zinc-50/80 p-4">
      <summary className="cursor-pointer list-none">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-zinc-900">Perfil da amostra</h2>
            <p className="mt-1 text-xs font-semibold text-zinc-500">
              Composição das {total} UFPAs do recorte. Não mede desempenho; ajuda a interpretar se a amostra está concentrada.
            </p>
          </div>
          <span className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-bold text-zinc-600">
            Ver composição
          </span>
        </div>
      </summary>
      <div className="mt-4 space-y-4">
        {singleBiome && (
          <p className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-xs font-semibold text-zinc-600">
            Bioma único no recorte: <span className="font-bold text-zinc-900">{singleBiome}</span>.
          </p>
        )}
        <div className="grid gap-4 xl:grid-cols-3">
          <CompactRankList title="Comunidades representadas" data={communities} />
          <CompactRankList title="Organizações vinculadas" data={organizations} />
          <CompactRankList title="Atividades produtivas informadas" data={activities} />
          {visibleBiomes.length > 0 && <CompactRankList title="Biomas representados" data={visibleBiomes} />}
        </div>
      </div>
    </details>
  );
}

function UfpaPanel({
  items,
  focus,
  setFocus,
  appendReturnHref,
}: {
  items: SiggaterDashboardItem[];
  focus: FocusKey[];
  setFocus: (value: FocusKey) => void;
  appendReturnHref: (href: string) => string;
}) {
  const metrics = useMemo(() => {
    const total = items.length;
    const diagnosticos = items.filter((item) => item.diagnosticoRegistrado).length;
    const semDiagnostico = items.filter((item) => !item.diagnosticoRegistrado).length;
    const semAgua = items.filter((item) => item.aguaTratada === false).length;
    const semEsgoto = items.filter((item) => item.esgotoTratado === false).length;
    const semInternet = items.filter((item) => item.possuiInternet === false).length;
    const semCadUnico = items.filter((item) => item.cadUnico === false).length;
    const inseguranca = items.filter((item) => item.insegurancaAlimentar === true).length;
    const semPoliticasSociais = items.filter((item) => item.politicasSociais === false).length;
    const semPoliticasProdutivas = items.filter((item) => item.politicasProdutivas === false).length;
    const mulheres = items.reduce((sum, item) => sum + item.mulheres, 0);
    const jovens = items.reduce((sum, item) => sum + item.jovens, 0);
    const visitas = items.reduce((sum, item) => sum + item.atendimentos, 0);
    const vbpItems = items.filter((item) => item.valorBrutoProducaoUltimos12Meses !== null);
    const vbpTotal = vbpItems.reduce((sum, item) => sum + (item.valorBrutoProducaoUltimos12Meses ?? 0), 0);
    const qtdVezesComeuMenos = items.reduce((sum, item) => sum + (item.qtdVezesComeuMenos ?? 0), 0);

    return {
      total,
      diagnosticos,
      semDiagnostico,
      semAgua,
      semEsgoto,
      semInternet,
      semCadUnico,
      inseguranca,
      semPoliticasSociais,
      semPoliticasProdutivas,
      mulheres,
      jovens,
      visitas,
      vbpTotal,
      vbpCount: vbpItems.length,
      qtdVezesComeuMenos,
    };
  }, [items]);

  const priorities = useMemo(
    () =>
      items
        .map((item) => ({ ...item, risks: getRisks(item), score: getRiskScore(item) }))
        .filter((item) => item.risks.length > 0)
        // Ordena pelo score ponderado (maior = mais crítica), desempate alfabético
        .sort((a, b) => b.score - a.score || a.nomeFamilia.localeCompare(b.nomeFamilia, "pt-BR"))
        .slice(0, 8),
    [items],
  );

  const communityData = useMemo(() => groupCount(items, (item) => item.comunidade), [items]);
  const orgData = useMemo(() => groupCount(items, (item) => item.organizacaoColetiva), [items]);
  const atividadeData = useMemo(() => groupArrayValues(items, (item) => item.atividades), [items]);
  const biomaData = useMemo(() => groupCount(items, (item) => item.bioma), [items]);

  const comunicacaoMetrics: BooleanMetric<SiggaterDashboardItem>[] = [
    { label: "Rádio", getValue: (item) => item.possuiRadio },
    { label: "Televisão", getValue: (item) => item.possuiTelevisao },
    { label: "Celular", getValue: (item) => item.possuiCelular },
    { label: "Internet", getValue: (item) => item.possuiInternet },
    { label: "Redes sociais", getValue: (item) => item.usaRedesSociais },
    { label: "Outros meios", getValue: (item) => item.possuiOutroMeioComunicacao },
  ];
  const saneamentoMetrics: BooleanMetric<SiggaterDashboardItem>[] = [
    { label: "Água para consumo", getValue: (item) => item.aguaParaConsumo },
    { label: "Água para consumo tratada", getValue: (item) => item.aguaTratada },
    { label: "Água para produção", getValue: (item) => item.aguaParaProducao },
    { label: "Captação de água da chuva", getValue: (item) => item.captacaoAguaChuva },
    { label: "Esgoto tratado", getValue: (item) => item.esgotoTratado },
    { label: "Fontes protegidas", getValue: (item) => item.fontesProtegidas },
  ];
  const segurancaAlimentarMetrics: BooleanMetric<SiggaterDashboardItem>[] = [
    { label: "Alimentação variada comprometida", getValue: (item) => item.alimentacaoVariadaComprometida },
    { label: "Comida terminou sem condição de comprar", getValue: (item) => item.comidaAcabouSemCondicao },
    { label: "Deixou refeição por falta de condição", getValue: (item) => item.deixouRefeicaoSemCondicao },
    { label: "Comeu menos do que deveria", getValue: (item) => item.comeuMenosSemCondicao },
    { label: "Sentiu fome e não comeu", getValue: (item) => item.sentiuFomeENaoComeu },
  ];
  const servicosSociaisMetrics: BooleanMetric<SiggaterDashboardItem>[] = [
    { label: "Documentação pessoal completa", getValue: (item) => item.documentacaoPessoalCompleta },
    { label: "Cadastrada no CadÚnico", getValue: (item) => item.cadUnico },
    { label: "Acessa políticas sociais", getValue: (item) => item.politicasSociais },
    { label: "Participa de grupo comunitário", getValue: (item) => item.grupoComunitario },
    { label: "Associação", getValue: (item) => item.participaAssociacao },
    { label: "Cooperativa", getValue: (item) => item.participaCooperativa },
    { label: "Grupo informal produtivo", getValue: (item) => item.participaGrupoInformalProdutivo },
    { label: "Grupo informal social/político/cultural", getValue: (item) => item.participaGrupoInformalSocial },
  ];
  const praticasSustentaveisMetrics: BooleanMetric<SiggaterDashboardItem>[] = [
    { label: "Usa práticas sustentáveis", getValue: (item) => item.praticasSustentaveis },
    { label: "Integração de atividades", getValue: (item) => item.praticaIntegracaoAtividades },
    { label: "Descarte correto de embalagens", getValue: (item) => item.praticaDescarteCorretoEmbalagens },
    { label: "Controle das queimadas", getValue: (item) => item.praticaControleQueimadas },
    { label: "Adubação verde", getValue: (item) => item.praticaAdubacaoVerde },
    { label: "Recuperação de pastagens", getValue: (item) => item.praticaRecuperacaoPastagens },
    { label: "Cobertura de solo/manejo de plantas", getValue: (item) => item.praticaCoberturaSolo },
    { label: "Manejo integrado de pragas", getValue: (item) => item.praticaManejoIntegradoPragas },
    { label: "Cordões de vegetação permanente", getValue: (item) => item.praticaCordoesVegetacao },
    { label: "Rotação de culturas", getValue: (item) => item.praticaRotacaoCulturas },
    { label: "Sistema plantio direto", getValue: (item) => item.praticaPlantioDireto },
    { label: "Pousio", getValue: (item) => item.praticaPousio },
    { label: "Proteção de nascentes", getValue: (item) => item.praticaProtecaoNascentes },
    { label: "Preservação das APPs", getValue: (item) => item.praticaPreservacaoApps },
    { label: "Manejo florestal", getValue: (item) => item.praticaManejoFlorestal },
    { label: "Recomposição florestal", getValue: (item) => item.praticaRecomposicaoFlorestal },
  ];
  const praticasMotivosMetrics: BooleanMetric<SiggaterDashboardItem>[] = [
    { label: "Motivo: questão financeira", getValue: (item) => item.motivoSemPraticaFinanceiro },
    { label: "Motivo: falta de informação", getValue: (item) => item.motivoSemPraticaFaltaInformacao },
    { label: "Motivo: questão tecnológica", getValue: (item) => item.motivoSemPraticaTecnologico },
    { label: "Motivo: falta de interesse", getValue: (item) => item.motivoSemPraticaFaltaInteresse },
  ];
  const politicasProdutivasMetrics: BooleanMetric<SiggaterDashboardItem>[] = [
    { label: "Acessa políticas produtivas", getValue: (item) => item.politicasProdutivas },
    { label: "Acessou PAA", getValue: (item) => item.acessouPaa },
    { label: "Acessou PNAE", getValue: (item) => item.acessouPnae },
    { label: "Acessou PGPM-Bio", getValue: (item) => item.acessouPgpmBio },
    { label: "Acessou PRONAF", getValue: (item) => item.acessouPronaf },
  ];
  const politicasProdutivasMotivosMetrics: BooleanMetric<SiggaterDashboardItem>[] = [
    { label: "Motivo: falta de informacao", getValue: (item) => item.motivoNaoAcessaPoliticasFaltaInfo },
    { label: "Motivo: dificil acesso", getValue: (item) => item.motivoNaoAcessaPoliticasDificilAcesso },
    { label: "Motivo: sem necessidade/interesse", getValue: (item) => item.motivoNaoAcessaPoliticasSemInteresse },
  ];
  const canaisMetrics: BooleanMetric<SiggaterDashboardItem>[] = [
    { label: "Troca por produto/serviço", getValue: (item) => item.canalTrocaProdutoServico },
    { label: "Venda na propriedade", getValue: (item) => item.canalVendaPropriedade },
    { label: "Venda direta ao consumidor", getValue: (item) => item.canalVendaDiretaConsumidor },
    { label: "Feira", getValue: (item) => item.canalFeira },
    { label: "Mercado local", getValue: (item) => item.canalMercadoLocal },
    { label: "Atravessador", getValue: (item) => item.canalAtravessador },
    { label: "PAA", getValue: (item) => item.canalPaa },
    { label: "PNAE", getValue: (item) => item.canalPnae },
    { label: "Cooperativa/entreposto", getValue: (item) => item.canalCooperativaEntreposto },
  ];
  const potencialidadesProdutivo = useMemo(
    () => groupArrayValues(items, (item) => item.acoesPotenciaisProdutivo, ATER_SOCIOBIO_POTENCIALIDADES_PRODUTIVO),
    [items],
  );
  const potencialidadesSocial = useMemo(
    () => groupArrayValues(items, (item) => item.acoesPotenciaisSocial, ATER_SOCIOBIO_POTENCIALIDADES_SOCIAL),
    [items],
  );
  const potencialidadesAmbiental = useMemo(
    () => groupArrayValues(items, (item) => item.acoesPotenciaisAmbiental, ATER_SOCIOBIO_POTENCIALIDADES_AMBIENTAL),
    [items],
  );
  const limitacoesProdutivo = useMemo(
    () => groupArrayValues(items, (item) => item.limitacoesProdutivo, ATER_SOCIOBIO_LIMITACOES_PRODUTIVO),
    [items],
  );
  const limitacoesSocial = useMemo(
    () => groupArrayValues(items, (item) => item.limitacoesSocial, ATER_SOCIOBIO_LIMITACOES_SOCIAL),
    [items],
  );
  const limitacoesAmbiental = useMemo(
    () => groupArrayValues(items, (item) => item.limitacoesAmbiental, ATER_SOCIOBIO_LIMITACOES_AMBIENTAL),
    [items],
  );
  const linhasPronafData = useMemo(
    () => groupArrayValues(items, (item) => item.linhasPronaf, PRONAF_LINHAS_UFPA.map((item) => item.label)),
    [items],
  );
  const politicasPublicasFederaisData = useMemo(
    () => groupArrayValues(items, (item) => item.politicasPublicasFederais),
    [items],
  );
  const atividadesColetivAsData = useMemo(
    () => groupArrayValues(items, (item) => item.atividadesColetivas),
    [items],
  );
  const areasAtividadesColetivAsData = useMemo(
    () => groupArrayValues(items, (item) => item.areasAtividadesColetivas),
    [items],
  );
  const economicSummary = [
    { label: "VBP total informado", value: formatCurrency(metrics.vbpTotal) },
    { label: "UFPAs com VBP informado", value: metrics.vbpCount },
    {
      label: "Media do VBP informado",
      value: metrics.vbpCount > 0 ? formatCurrency(metrics.vbpTotal / metrics.vbpCount) : formatCurrency(0),
    },
    { label: "Soma de vezes que comeram menos", value: metrics.qtdVezesComeuMenos },
  ];

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Cobertura de diagnóstico"
          value={`${ratio(metrics.diagnosticos, metrics.total)}%`}
          description={`${metrics.diagnosticos} de ${metrics.total} UFPAs com diagnóstico ou indicadores.`}
          tone="green"
          icon={ClipboardCheck}
        />
        <MetricCard
          label="Alertas socioambientais"
          value={metrics.semAgua + metrics.semEsgoto + metrics.inseguranca}
          description="Soma de UFPAs com água sem tratamento, sem esgoto tratado ou insegurança alimentar."
          tone="rose"
          icon={AlertTriangle}
        />
        <MetricCard
          label="Sem internet"
          value={metrics.semInternet}
          description="UFPAs que declararam não possuir internet no diagnóstico."
          tone="amber"
          icon={Wifi}
          active={focus.includes("semInternet")}
          onClick={() => setFocus("semInternet")}
        />
        <MetricCard
          label="Visitas (recorte)"
          value={metrics.visitas}
          description="Atendimentos válidos vinculados às UFPAs deste recorte."
          tone="blue"
          icon={ClipboardList}
          active={focus.includes("comVisitas")}
          onClick={() => setFocus("comVisitas")}
        />
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Mulheres nas UFPAs"
          value={metrics.mulheres}
          description="Integrantes com sexo feminino registrados nas unidades familiares."
          tone="rose"
          icon={Users}
          active={focus.includes("comMulheresUfpa")}
          onClick={() => setFocus("comMulheresUfpa")}
        />
        <MetricCard
          label="Jovens nas UFPAs"
          value={metrics.jovens}
          description="Integrantes de 15 a 29 anos identificados nos cadastros."
          tone="amber"
          icon={Users}
          active={focus.includes("comJovensUfpa")}
          onClick={() => setFocus("comJovensUfpa")}
        />
        <MetricCard
          label="Sem políticas sociais"
          value={metrics.semPoliticasSociais}
          description="UFPAs sem acesso informado a políticas públicas sociais."
          tone="zinc"
          icon={ClipboardList}
          active={focus.includes("semPoliticasSociais")}
          onClick={() => setFocus("semPoliticasSociais")}
        />
        <MetricCard
          label="Sem políticas produtivas"
          value={metrics.semPoliticasProdutivas}
          description="UFPAs sem acesso informado a políticas públicas produtivas."
          tone="zinc"
          icon={Leaf}
          active={focus.includes("semPoliticasProdutivas")}
          onClick={() => setFocus("semPoliticasProdutivas")}
        />
      </section>

      <UfpaPrioritiesCard priorities={priorities} appendReturnHref={appendReturnHref} />

      <section className="space-y-4">
        <div>
          <h2 className="text-base font-bold text-zinc-900">Doc 3 e Doc 4: UFPAs</h2>
          <p className="mt-1 text-xs font-semibold text-zinc-500">
            Diagnóstico da UFPA e indicadores da UFPA. S/I indica registros ainda sem informação.
          </p>
        </div>
        <div className="grid gap-4 xl:grid-cols-2">
          <BooleanMetricsTable title="Diversos: meios de comunicação" items={items} metrics={comunicacaoMetrics} />
          <BooleanMetricsTable title="Saneamento rural" items={items} metrics={saneamentoMetrics} />
          <BooleanMetricsTable title="Social: segurança alimentar" items={items} metrics={segurancaAlimentarMetrics} />
          <BooleanMetricsTable title="Social: serviços e participação" items={items} metrics={servicosSociaisMetrics} />
          <BooleanMetricsTable title="Ambiental: práticas sustentáveis" items={items} metrics={praticasSustentaveisMetrics} />
          <BooleanMetricsTable title="Ambiental: motivos para não usar práticas" items={items} metrics={praticasMotivosMetrics} />
          <BooleanMetricsTable title="Econômico: políticas produtivas" items={items} metrics={politicasProdutivasMetrics} />
          <BooleanMetricsTable title="Econômico: motivos para não acessar políticas" items={items} metrics={politicasProdutivasMotivosMetrics} />
          <CompactRankList title="Econômico: linhas PRONAF acessadas" data={linhasPronafData} items={items} extractFn={(f) => f.linhasPronaf} />
          <CompactValueList title="Econômico: VBP e SAN" data={economicSummary} />
          <BooleanMetricsTable title="Econômico: canais de comercialização" items={items} metrics={canaisMetrics} />
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-base font-bold text-zinc-900">Doc Potencialidades: potencialidades e limitações</h2>
          <p className="mt-1 text-xs font-semibold text-zinc-500">
            Frequência dos temas marcados no diagnóstico. Itens em 0 ainda não foram selecionados nas UFPAs do recorte.
          </p>
        </div>
        <div className="grid gap-4 xl:grid-cols-3">
          <CompactRankList title="Potencialidades: eixo produtivo" data={potencialidadesProdutivo} items={items} extractFn={(f) => f.acoesPotenciaisProdutivo} />
          <CompactRankList title="Potencialidades: eixo social" data={potencialidadesSocial} items={items} extractFn={(f) => f.acoesPotenciaisSocial} />
          <CompactRankList title="Potencialidades: eixo ambiental" data={potencialidadesAmbiental} items={items} extractFn={(f) => f.acoesPotenciaisAmbiental} />
          <CompactRankList title="Limitações: eixo produtivo" data={limitacoesProdutivo} items={items} extractFn={(f) => f.limitacoesProdutivo} />
          <CompactRankList title="Limitações: eixo social" data={limitacoesSocial} items={items} extractFn={(f) => f.limitacoesSocial} />
          <CompactRankList title="Limitações: eixo ambiental" data={limitacoesAmbiental} items={items} extractFn={(f) => f.limitacoesAmbiental} />
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-base font-bold text-zinc-900">Doc 3: Políticas públicas e atividades coletivas</h2>
          <p className="mt-1 text-xs font-semibold text-zinc-500">
            Dados da tabela de diagnóstico. Freqüência dos itens preenchidos nas UFPAs do recorte.
          </p>
        </div>
        <div className="grid gap-4 xl:grid-cols-3">
          <CompactRankList title="Políticas públicas federais acessadas" data={politicasPublicasFederaisData} items={items} extractFn={(f) => f.politicasPublicasFederais} />
          <CompactRankList title="Atividades coletivas" data={atividadesColetivAsData} items={items} extractFn={(f) => f.atividadesColetivas} />
          <CompactRankList title="Áreas das atividades coletivas" data={areasAtividadesColetivAsData} items={items} extractFn={(f) => f.areasAtividadesColetivas} />
        </div>
      </section>

      <UfpaSampleProfile
        total={metrics.total}
        communities={communityData}
        organizations={orgData}
        activities={atividadeData}
        biomes={biomaData}
      />

      <div className="hidden">
        <div className="mb-5 flex items-center gap-2">
          <Filter className="h-4 w-4 text-zinc-500" />
          <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Recortes rápidos de atenção (Clique para filtrar)</h3>
        </div>
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <AlertButton
            label="Diagnóstico pendente"
            value={metrics.semDiagnostico}
            description="Cadastro existe, mas ainda falta diagnóstico/indicadores."
            active={focus.includes("semDiagnostico")}
            onClick={() => setFocus("semDiagnostico")}
            icon={ClipboardList}
            onExport={(e) => {
              e.stopPropagation();
              exportUfpasToExcel(items.filter((i) => !i.diagnosticoRegistrado), "UFPAs_Sem_Diagnostico.xlsx");
            }}
          />
          <AlertButton
            label="Água sem tratamento"
            value={metrics.semAgua}
            description="UFPAs com água de consumo sem tratamento."
            active={focus.includes("semAgua")}
            onClick={() => setFocus("semAgua")}
            icon={Droplets}
            onExport={(e) => {
              e.stopPropagation();
              exportUfpasToExcel(items.filter((i) => i.aguaTratada === false), "UFPAs_Sem_Agua_Tratada.xlsx");
            }}
          />
          <AlertButton
            label="Sem CadÚnico"
            value={metrics.semCadUnico}
            description="Famílias que não possuem CadÚnico informado."
            active={focus.includes("semCadUnico")}
            onClick={() => setFocus("semCadUnico")}
            icon={Users}
            onExport={(e) => {
              e.stopPropagation();
              exportUfpasToExcel(items.filter((i) => i.cadUnico === false), "UFPAs_Sem_CadUnico.xlsx");
            }}
          />
          <AlertButton
            label="Insegurança alimentar"
            value={metrics.inseguranca}
            description="Falta de comida, refeição reduzida ou fome registrada."
            active={focus.includes("inseguranca")}
            onClick={() => setFocus("inseguranca")}
            icon={AlertCircle}
            onExport={(e) => {
              e.stopPropagation();
              exportUfpasToExcel(items.filter((i) => i.insegurancaAlimentar === true), "UFPAs_Com_Inseguranca_Alimentar.xlsx");
            }}
          />
        </section>
      </div>

    </div>
  );
}

function OrganizacoesPanel({
  items,
  focus,
  setFocus,
  appendReturnHref,
}: {
  items: SiggaterOrganizacaoDashboardItem[];
  focus: FocusKey[];
  setFocus: (v: FocusKey) => void;
  appendReturnHref: (href: string) => string;
}) {
  const metrics = useMemo(() => {
    const total = items.length;
    const comIndicadores = items.filter((item) => item.indicadoresRegistrados).length;
    const praticasAmbientais = items.filter((item) => item.praticasAmbientais === true).length;
    const identidadeComercial = items.filter((item) => item.identidadeComercial === true).length;
    const mulheresDiretoria = items.filter((item) => item.mulheresDiretoria === true).length;
    const jovensDiretoria = items.filter((item) => item.jovensDiretoria === true).length;
    const politicasPublicas = items.filter((item) => item.politicasPublicas === true).length;
    const filiadaOrganizacao = items.filter((item) => item.representacaoPolitica === true).length;
    const familiasVinculadas = items.reduce((sum, item) => sum + item.familiasVinculadas, 0);

    return {
      total,
      comIndicadores,
      praticasAmbientais,
      politicasPublicas,
      mulheresDiretoria,
      jovensDiretoria,
      identidadeComercial,
      filiadaOrganizacao,
      familiasVinculadas,
    };
  }, [items]);

  const orgsByFamilies = useMemo(
    () =>
      [...items]
        .map((item) => ({ name: item.denominacao, value: item.familiasVinculadas }))
        .sort((a, b) => b.value - a.value || a.name.localeCompare(b.name, "pt-BR")),
    [items],
  );

  const orgsByChannels = useMemo(
    () =>
      [...items]
        .map((item) => ({ name: item.denominacao, value: item.canaisComercializacao }))
        .filter((item) => item.value > 0)
        .sort((a, b) => b.value - a.value || a.name.localeCompare(b.name, "pt-BR")),
    [items],
  );
  const praticasAmbientaisMetrics: BooleanMetric<SiggaterOrganizacaoDashboardItem>[] = [
    { label: "Faz uso de práticas ambientais", getValue: (item) => item.praticasAmbientais },
    { label: "Separação de lixo", getValue: (item) => item.praticaSeparacaoLixo },
    { label: "Descarte correto de lixo", getValue: (item) => item.praticaDescarteCorretoLixo },
    { label: "Manutenção de acessos", getValue: (item) => item.praticaManutencaoAcessos },
    { label: "Tratamento de dejetos", getValue: (item) => item.praticaTratamentoDejetos },
    { label: "Captação de água das chuvas", getValue: (item) => item.praticaCaptacaoAguaChuva },
    { label: "Educação ambiental", getValue: (item) => item.praticaEducacaoAmbiental },
    { label: "Avaliação e prevenção de riscos", getValue: (item) => item.praticaAvaliacaoPrevencaoRiscos },
  ];
  const identidadeMetrics: BooleanMetric<SiggaterOrganizacaoDashboardItem>[] = [
    { label: "Usa identidade comercial", getValue: (item) => item.identidadeComercial },
    { label: "Marca própria", getValue: (item) => item.identidadeMarcaPropria },
    { label: "Selo Arte", getValue: (item) => item.identidadeSeloArte },
    { label: "Selo Nacional da Agricultura Familiar", getValue: (item) => item.identidadeSenaf },
    { label: "SENAF Sociobiodiversidade", getValue: (item) => item.identidadeSenafSociobiodiversidade },
    { label: "Selo Quilombos do Brasil", getValue: (item) => item.identidadeSeloQuilombos },
    { label: "Selo Indígenas do Brasil", getValue: (item) => item.identidadeSeloIndigenas },
    { label: "Selo Povos e Comunidades Tradicionais", getValue: (item) => item.identidadeSeloPovosTradicionais },
  ];
  const generoJuventudeMetrics: BooleanMetric<SiggaterOrganizacaoDashboardItem>[] = [
    { label: "Mulheres na diretoria/conselho", getValue: (item) => item.mulheresDiretoria },
    { label: "Jovens na diretoria/conselho", getValue: (item) => item.jovensDiretoria },
  ];
  const representacaoMetrics: BooleanMetric<SiggaterOrganizacaoDashboardItem>[] = [
    { label: "Filiada a uma organização", getValue: (item) => item.representacaoPolitica },
    { label: "UNICAFES", getValue: (item) => item.filiadaUnicafes },
    { label: "UNICOPAS", getValue: (item) => item.filiadaUnicopas },
    { label: "Sistema OCB", getValue: (item) => item.filiadaSistemaOcb },
  ];
  const politicasPublicasMetrics: BooleanMetric<SiggaterOrganizacaoDashboardItem>[] = [
    { label: "Acessa/acessou políticas públicas", getValue: (item) => item.politicasPublicas },
    { label: "CAF jurídica", getValue: (item) => item.possuiCafJuridica },
    { label: "Pronaf Custeio", getValue: (item) => item.acessouPronafCusteio },
    { label: "Pronaf Capital de Giro", getValue: (item) => item.acessouPronafCapitalGiro },
    { label: "Pronaf Mais Alimentos", getValue: (item) => item.acessouPronafMaisAlimentos },
    { label: "Pronaf Industrialização", getValue: (item) => item.acessouPronafIndustrializacao },
    { label: "Pronaf Agroindústria", getValue: (item) => item.acessouPronafAgroindustria },
    { label: "Pronaf Cotas Partes", getValue: (item) => item.acessouPronafCotasPartes },
    { label: "PAA", getValue: (item) => item.acessouPaa },
    { label: "PNAE", getValue: (item) => item.acessouPnae },
    { label: "PGPM", getValue: (item) => item.acessouPgpm },
    { label: "PGPM Sociobiodiversidade", getValue: (item) => item.acessouPgpmSociobiodiversidade },
    { label: "Coopera Mais Brasil", getValue: (item) => item.acessouCooperaMaisBrasil },
  ];
  const canaisComercializacaoMetrics: BooleanMetric<SiggaterOrganizacaoDashboardItem>[] = [
    { label: "Troca por produto/serviço", getValue: (item) => item.canalTrocaProdutoServico },
    { label: "Venda na organização coletiva", getValue: (item) => item.canalVendaOrganizacao },
    { label: "Venda direta ao consumidor", getValue: (item) => item.canalVendaDiretaConsumidor },
    { label: "Feira", getValue: (item) => item.canalFeira },
    { label: "Mercado local", getValue: (item) => item.canalMercadoLocal },
    { label: "Atravessador", getValue: (item) => item.canalAtravessador },
    { label: "PAA", getValue: (item) => item.canalPaa },
    { label: "PNAE", getValue: (item) => item.canalPnae },
    { label: "Mercado justo/solidário", getValue: (item) => item.canalMercadoJustoSolidario },
  ];

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <MetricCard
          label="Organizações com indicadores"
          value={`${ratio(metrics.comIndicadores, metrics.total)}%`}
          description={`${metrics.comIndicadores} de ${metrics.total} organizações já possuem indicadores.`}
          tone="green"
          icon={ClipboardCheck}
        />
        <MetricCard
          label="Sem indicadores"
          value={Math.max(0, metrics.total - metrics.comIndicadores)}
          description="Organizações ainda sem formulário preenchido."
          tone="zinc"
          icon={ClipboardList}
          active={focus.includes("indicadoresPendentes")}
          onClick={() => setFocus("indicadoresPendentes")}
        />
        <MetricCard
          label="Famílias vinculadas"
          value={metrics.familiasVinculadas}
          description="Total de UFPAs vinculadas às organizações do recorte."
          tone="blue"
          icon={Users}
        />
        <MetricCard
          label="Mulheres na direção"
          value={metrics.mulheresDiretoria}
          description="Organizações com mulheres na diretoria executiva ou conselho fiscal."
          tone="rose"
          icon={Users}
          active={focus.includes("mulheresDiretoria")}
          onClick={() => setFocus("mulheresDiretoria")}
        />
        <MetricCard
          label="Jovens na direção"
          value={metrics.jovensDiretoria}
          description="Organizações com jovens na diretoria executiva ou conselho fiscal."
          tone="amber"
          icon={Users}
          active={focus.includes("jovensDiretoria")}
          onClick={() => setFocus("jovensDiretoria")}
        />
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Práticas ambientais"
          value={metrics.praticasAmbientais}
          description="Fazem uso de práticas ambientais."
          tone="green"
          icon={Leaf}
          active={focus.includes("praticasAmbientais")}
          onClick={() => setFocus("praticasAmbientais")}
        />
        <MetricCard
          label="Sem Práticas amb."
          value={Math.max(0, metrics.comIndicadores - metrics.praticasAmbientais)}
          description="Não fazem uso de práticas ambientais."
          tone="rose"
          icon={AlertCircle}
          active={focus.includes("semPraticasAmbientais")}
          onClick={() => setFocus("semPraticasAmbientais")}
        />
        <MetricCard
          label="Identidade comercial"
          value={metrics.identidadeComercial}
          description="Utilizam estratégias de identidade."
          tone="blue"
          icon={Globe}
          active={focus.includes("identidadeComercial")}
          onClick={() => setFocus("identidadeComercial")}
        />
        <MetricCard
          label="Sem Identidade com."
          value={Math.max(0, metrics.comIndicadores - metrics.identidadeComercial)}
          description="Não utilizam estratégias de identidade."
          tone="zinc"
          icon={AlertCircle}
          active={focus.includes("semIdentidadeComercial")}
          onClick={() => setFocus("semIdentidadeComercial")}
        />
        <MetricCard
          label="Filiadas"
          value={metrics.filiadaOrganizacao}
          description="Filiadas a outras organizações (Representação)."
          tone="blue"
          icon={Globe}
          active={focus.includes("filiadaOrganizacao")}
          onClick={() => setFocus("filiadaOrganizacao")}
        />
        <MetricCard
          label="Não filiadas"
          value={Math.max(0, metrics.comIndicadores - metrics.filiadaOrganizacao)}
          description="Não possuem filiação a outras organizações."
          tone="zinc"
          icon={AlertCircle}
          active={focus.includes("semFiliadaOrganizacao")}
          onClick={() => setFocus("semFiliadaOrganizacao")}
        />
        <MetricCard
          label="Políticas públicas"
          value={metrics.politicasPublicas}
          description="Acessaram políticas públicas no último ano."
          tone="green"
          icon={ClipboardCheck}
          active={focus.includes("politicasPublicas")}
          onClick={() => setFocus("politicasPublicas")}
        />
        <MetricCard
          label="Sem Políticas púb."
          value={Math.max(0, metrics.comIndicadores - metrics.politicasPublicas)}
          description="Não acessaram políticas públicas no último ano."
          tone="amber"
          icon={AlertCircle}
          active={focus.includes("semPoliticasPublicas")}
          onClick={() => setFocus("semPoliticasPublicas")}
        />
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-base font-bold text-zinc-900">Doc 6: indicadores das organizações coletivas</h2>
          <p className="mt-1 text-xs font-semibold text-zinc-500">
            Contagem por organização coletiva. S/I indica registros ainda sem informação ou não aplicável.
          </p>
        </div>
        <div className="grid gap-4 xl:grid-cols-2">
          <BooleanMetricsTable title="Ambiental: práticas ambientais" items={items} metrics={praticasAmbientaisMetrics} />
          <BooleanMetricsTable title="Social: identidade comercial" items={items} metrics={identidadeMetrics} />
          <BooleanMetricsTable title="Social: gênero e juventude" items={items} metrics={generoJuventudeMetrics} />
          <BooleanMetricsTable title="Social: representação política" items={items} metrics={representacaoMetrics} />
          <BooleanMetricsTable title="Econômico: políticas públicas" items={items} metrics={politicasPublicasMetrics} />
          <BooleanMetricsTable title="Econômico: canais de comercialização" items={items} metrics={canaisComercializacaoMetrics} />
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex flex-col">
          <SimpleBarList
            title="Organizações por UFPAs vinculadas"
            data={orgsByFamilies}
            color="bg-blue-600"
            getHref={(name) => appendReturnHref(`/ater-sociobio/organizacoes?busca=${encodeURIComponent(name)}`)}
          />
          <p className="mt-2 px-2 text-xs font-medium leading-relaxed text-zinc-500">
            Mostra o volume real de UFPAs cadastradas no sistema que foram associadas a cada organização, medindo a força e alcance da entidade.
          </p>
        </div>
        <div className="flex flex-col">
          <SimpleBarList
            title="Canais de comercialização por organização"
            data={orgsByChannels}
            color="bg-amber-500"
            getHref={(name) => appendReturnHref(`/ater-sociobio/organizacoes?busca=${encodeURIComponent(name)}`)}
          />
          <p className="mt-2 px-2 text-xs font-medium leading-relaxed text-zinc-500">
            Soma a quantidade de canais de escoamento (Feira, PAA, PNAE, Mercado Local, etc.) que a organização declarou ter acesso nos indicadores.
          </p>
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-200/60 bg-white p-6 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-zinc-400" />
            <h2 className="text-base font-bold text-zinc-900">Listagem das organizações</h2>
          </div>
          <span className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-bold text-zinc-500">
            {items.length} {items.length === 1 ? "organização" : "organizações"}
          </span>
        </div>
        <div className="divide-y divide-zinc-100">
          {items.length === 0 ? (
            <p className="py-10 text-center text-sm font-bold text-zinc-400">Nenhuma organização no recorte atual.</p>
          ) : (
            items.map((item) => (
              <div key={item.id} className="grid gap-4 py-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
                <div>
                  <p className="text-sm font-bold text-zinc-950">{item.denominacao}</p>
                  <p className="mt-1 text-xs font-bold text-zinc-400">{item.municipio || "Município não informado"}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {/* Indicadores Doc 6 */}
                    {!item.indicadoresRegistrados && (
                      <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-600">Indicadores pendentes</span>
                    )}
                    {item.praticasAmbientais === true && (
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700">Práticas ambientais</span>
                    )}
                    {item.praticasAmbientais === false && (
                      <span className="rounded-full bg-rose-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-rose-700">Sem práticas ambientais</span>
                    )}
                    {item.politicasPublicas === true && (
                      <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-700">Políticas públicas</span>
                    )}
                    {item.politicasPublicas === false && (
                      <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-700">Sem políticas públicas</span>
                    )}
                    {item.identidadeComercial === true && (
                      <span className="rounded-full bg-violet-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-violet-700">Identidade comercial</span>
                    )}
                    {item.mulheresDiretoria === true && (
                      <span className="rounded-full bg-pink-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-pink-700">Mulheres na direção</span>
                    )}
                    {item.jovensDiretoria === true && (
                      <span className="rounded-full bg-orange-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-orange-700">Jovens na direção</span>
                    )}
                    {item.familiasVinculadas > 0 && (
                      <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-[10px] font-semibold text-zinc-500">
                        {item.familiasVinculadas} {item.familiasVinculadas === 1 ? "UFPA" : "UFPAs"}
                      </span>
                    )}
                  </div>
                </div>
                <Link href={appendReturnHref(`/ater-sociobio/organizacoes/${item.id}`)} className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-bold text-zinc-700 transition hover:bg-zinc-50">
                  <MousePointer2 className="h-3.5 w-3.5" />
                  Abrir detalhes
                </Link>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

function AtendimentosPanel({
  items,
  focus,
  setFocus,
  appendReturnHref,
}: {
  items: SiggaterAtendimentoDashboardItem[];
  focus: FocusKey[];
  setFocus: (v: FocusKey) => void;
  appendReturnHref: (href: string) => string;
}) {
  const metrics = useMemo(() => {
    const total = items.length;
    const mulheres = items.reduce((sum, item) => sum + item.numeroMulheres, 0);
    const jovens = items.reduce((sum, item) => sum + item.numeroJovens, 0);
    const comIndicadores = items.filter((item) => item.indicadoresTrabalhados.length > 0).length;
    const emAnalise = items.filter((item) => item.statusRelatorio === "EM_ANALISE").length;
    const reprovados = items.filter((item) => item.statusRelatorio === "REPROVADO_GESTOR").length;

    return { total, mulheres, jovens, comIndicadores, emAnalise, reprovados };
  }, [items]);

  const monthlyTrend = useMemo(() => {
    const months: Record<string, number> = {};
    items.forEach((item) => {
      if (!item.data) return;
      const date = new Date(item.data);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      months[key] = (months[key] || 0) + 1;
    });
    return Object.entries(months)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([name, value]) => ({ name, value }));
  }, [items]);

  const statusData = useMemo(
    () =>
      groupCount(items, (item) => getAterSociobioStatusRelatorioLabel(item.statusRelatorio)),
    [items],
  );
  const eixosData = useMemo(() => groupArrayValues(items, (item) => item.eixosTrabalhados), [items]);
  const indicadoresData = useMemo(() => groupArrayValues(items, (item) => item.indicadoresTrabalhados), [items]);
  const atendimentosPorTecnico = useMemo(() => groupCount(items, (item) => item.tecnico), [items]);

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Visitas válidas"
          value={metrics.total}
          description="Atendimentos que já entraram no fluxo operacional, sem contar rascunhos."
          tone="blue"
          icon={ClipboardList}
        />
        <MetricCard
          label="Mulheres atendidas"
          value={metrics.mulheres}
          description="Soma do campo número de mulheres nos atendimentos."
          tone="rose"
          icon={Users}
          active={focus.includes("mulheres")}
          onClick={() => setFocus("mulheres")}
        />
        <MetricCard
          label="Jovens atendidos"
          value={metrics.jovens}
          description="Soma do campo número de jovens nos atendimentos."
          tone="amber"
          icon={Users}
          active={focus.includes("jovens")}
          onClick={() => setFocus("jovens")}
        />
        <MetricCard
          label="Com indicadores trabalhados"
          value={`${ratio(metrics.comIndicadores, metrics.total)}%`}
          description={`${metrics.comIndicadores} visitas têm indicadores marcados no Documento 11.`}
          tone="green"
          icon={ClipboardCheck}
        />
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <MetricCard
          label="Em análise"
          value={metrics.emAnalise}
          description="Relatórios aguardando análise da coordenação/gestão."
          tone="blue"
          icon={LayoutDashboard}
          active={focus.includes("emAnalise")}
          onClick={() => setFocus("emAnalise")}
        />
        <MetricCard
          label="Reprovado gestor"
          value={metrics.reprovados}
          description="Relatórios que precisam de correção antes de avançar."
          tone="rose"
          icon={AlertCircle}
          active={focus.includes("reprovados")}
          onClick={() => setFocus("reprovados")}
        />
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SimpleBarList title="Tendência mensal de visitas" data={monthlyTrend} color="bg-emerald-500" />
        <div className="rounded-2xl border border-zinc-200/60 bg-white p-6 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
          <div className="mb-4 flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4 text-emerald-500" />
            <h2 className="text-base font-bold text-zinc-900">Métricas de impacto</h2>
          </div>
          <p className="text-sm leading-relaxed text-zinc-500 font-medium">
            O acompanhamento do público feminino e jovem é prioridade transversal na Fase 1.
          </p>
          <div className="mt-6 space-y-4">
            <div className="flex gap-4 rounded-xl bg-zinc-50 p-4">
              <Users className="h-5 w-5 shrink-0 text-rose-500" />
              <div>
                <p className="text-xs font-bold text-zinc-900 uppercase">Foco em Gênero</p>
                <p className="mt-1 text-xs leading-relaxed text-zinc-500 font-medium">
                  {metrics.mulheres} mulheres foram alcançadas nas visitas técnicas registradas até agora.
                </p>
              </div>
            </div>
            <div className="flex gap-4 rounded-xl bg-zinc-50 p-4">
              <Users className="h-5 w-5 shrink-0 text-amber-500" />
              <div>
                <p className="text-xs font-bold text-zinc-900 uppercase">Protagonismo Juvenil</p>
                <p className="mt-1 text-xs leading-relaxed text-zinc-500 font-medium">
                  {metrics.jovens} jovens participaram ativamente das atividades de extensão rural.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <SimpleBarList
            title="Atendimentos por status"
            data={statusData}
            color="bg-zinc-600"
            getHref={(name) => appendReturnHref(`/ater-sociobio/atendimentos?busca=${encodeURIComponent(name)}`)}
          />
          <p className="mt-2 px-2 text-xs font-medium leading-relaxed text-zinc-500">
            Mostra o volume de visitas em cada etapa de validação (Rascunho, Em Análise, Validado, etc.).
          </p>
        </div>
        <div className="flex flex-col">
          <SimpleBarList
            title="Atendimentos por eixo trabalhado"
            data={eixosData}
            color="bg-emerald-600"
            getHref={(name) => appendReturnHref(`/ater-sociobio/atendimentos?busca=${encodeURIComponent(name)}`)}
          />
          <p className="mt-2 px-2 text-xs font-medium leading-relaxed text-zinc-500">
            Frequência em que os Eixos Produtivo, Ambiental e Social foram abordados nos Documentos 11.
          </p>
        </div>
        <div className="flex flex-col">
          <SimpleBarList
            title="Atendimentos por técnico"
            data={atendimentosPorTecnico}
            color="bg-blue-600"
            getHref={(name) => appendReturnHref(`/ater-sociobio/atendimentos?busca=${encodeURIComponent(name)}`)}
          />
          <p className="mt-2 px-2 text-xs font-medium leading-relaxed text-zinc-500">
            Ranking de produtividade: número de relatórios de visitas preenchidos por cada técnico.
          </p>
        </div>
        <div className="flex flex-col">
          <SimpleBarList
            title="Indicadores mais trabalhados nas visitas"
            data={indicadoresData}
            color="bg-amber-500"
            getHref={(name) => appendReturnHref(`/ater-sociobio/atendimentos?busca=${encodeURIComponent(name)}`)}
          />
          <p className="mt-2 px-2 text-xs font-medium leading-relaxed text-zinc-500">
            Quais temas específicos (ex: Sementes, Quintais) estão sendo mais aplicados na prática de ATER.
          </p>
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-200/60 bg-white p-6 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
        <div className="mb-6 flex items-center gap-2">
          <ClipboardList className="h-4 w-4 text-zinc-400" />
          <h2 className="text-base font-bold text-zinc-900">Últimos atendimentos válidos</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-zinc-100 text-left text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                <th className="px-4 py-4">Visita</th>
                <th className="px-4 py-4">Data</th>
                <th className="px-4 py-4">UFPA</th>
                <th className="px-4 py-4">Técnico</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4">Público</th>
                <th className="px-4 py-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {items.slice(0, 10).map((item) => (
                <tr key={item.id} className="group hover:bg-zinc-50/50">
                  <td className="px-4 py-4 font-bold text-zinc-950">#{item.numeroVisita}</td>
                  <td className="px-4 py-4 text-zinc-500 font-bold">{formatDate(item.data)}</td>
                  <td className="px-4 py-4 font-bold text-zinc-700">{item.ufpa || "-"}</td>
                  <td className="px-4 py-4 text-zinc-500 font-bold">{item.tecnico || "-"}</td>
                  <td className="px-4 py-4">
                    <span className="rounded-full bg-zinc-100 px-2 py-1 text-[10px] font-bold text-zinc-600 uppercase">
                      {getAterSociobioStatusRelatorioLabel(item.statusRelatorio)}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-zinc-500">
                    <div className="flex gap-2">
                      <span className="flex items-center gap-1 rounded bg-rose-50 px-1.5 py-0.5 text-[10px] font-bold text-rose-700">
                        {item.numeroMulheres} M
                      </span>
                      <span className="flex items-center gap-1 rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-bold text-amber-700">
                        {item.numeroJovens} J
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <Link href={appendReturnHref(`/ater-sociobio/atendimentos/${item.id}`)} className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700">
                      Abrir
                      <MousePointer2 className="h-3 w-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

const dashboardViewMeta: Record<DashboardView, {
  title: string;
  description: string;
  searchPlaceholder: string;
  exportLabel: string;
  exportName: string;
  icon: typeof Users;
}> = {
  ufpas: {
    title: "Métricas de UFPAs",
    description: "Diagnóstico familiar, vulnerabilidades, infraestrutura, comunidades e cadeias produtivas.",
    searchPlaceholder: "Buscar por UFPA, comunidade, organização ou município...",
    exportLabel: "Exportar UFPAs",
    exportName: "ufpas",
    icon: Users,
  },
  organizacoes: {
    title: "Métricas de Organizações",
    description: "Capacidade coletiva, indicadores institucionais, diretoria, práticas ambientais e políticas públicas.",
    searchPlaceholder: "Buscar por organização ou município...",
    exportLabel: "Exportar organizações",
    exportName: "organizacoes",
    icon: Building2,
  },
  atendimentos: {
    title: "Métricas de Atendimentos",
    description: "Visitas válidas, status dos relatórios, equipe técnica, eixos trabalhados e público alcançado.",
    searchPlaceholder: "Buscar por UFPA, organização, técnico ou status...",
    exportLabel: "Exportar atendimentos",
    exportName: "atendimentos",
    icon: ClipboardList,
  },
};

export function SiggaterDashboardClient({
  data,
  view,
}: {
  data: SiggaterDashboardData;
  view: DashboardView;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const focusParamStr = searchParams.get("focus");
  const initialTab = isDashboardTab(tabParam) ? tabParam : view;
  const initialFocusArray = focusParamStr ? focusParamStr.split(",").filter(isFocusKey) : [];
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [activeTab, setActiveTab] = useState<DashboardTab>(initialTab);
  const [focus, setFocus] = useState<Exclude<FocusKey, null>[]>(initialFocusArray as any);

  const queryNorm = query.trim().toLowerCase();
  const meta = dashboardViewMeta[activeTab];
  const ViewIcon = meta.icon;

  const buildDashboardHref = (tab: DashboardTab, nextFocus: FocusKey[], nextQuery: string) => {
    const params = new URLSearchParams();
    if (nextFocus.length > 0) params.set("focus", nextFocus.join(","));
    if (nextQuery.trim()) params.set("q", nextQuery.trim());

    const search = params.toString();
    return `/ater-sociobio/dashboard/${tab}${search ? `?${search}` : ""}`;
  };
  const syncDashboardUrl = (tab: DashboardTab, nextFocus: FocusKey[], nextQuery = query) => {
    router.replace(buildDashboardHref(tab, nextFocus, nextQuery), { scroll: false });
  };
  const activateFocus = (tab: DashboardTab, key: FocusKey) => {
    if (!key) return;
    let nextFocus = [...focus];
    if (activeTab !== tab) {
      nextFocus = [key];
    } else {
      if (nextFocus.includes(key as Exclude<FocusKey, null>)) {
        nextFocus = nextFocus.filter((k) => k !== key);
      } else {
        nextFocus.push(key as Exclude<FocusKey, null>);
      }
    }
    setActiveTab(tab);
    setFocus(nextFocus);
    syncDashboardUrl(tab, nextFocus);
  };
  const currentDashboardHref = pathname.startsWith("/ater-sociobio/dashboard/")
    ? `${pathname}${focus.length > 0 || query ? `?${new URLSearchParams([
        ...(focus.length > 0 ? [["focus", focus.join(",")] as [string, string]] : []),
        ...(query.trim() ? [["q", query.trim()] as [string, string]] : []),
      ]).toString()}` : ""}`
    : buildDashboardHref(activeTab, focus, query);
  const appendReturnHref = (href: string) => {
    const connector = href.includes("?") ? "&" : "?";
    return `${href}${connector}from=${encodeURIComponent(currentDashboardHref)}`;
  };
  const setPanelFocus = (key: FocusKey) => {
    if (!key) {
      setFocus([]);
      syncDashboardUrl(activeTab, []);
      return;
    }
    let nextFocus = [...focus];
    if (nextFocus.includes(key as Exclude<FocusKey, null>)) {
      nextFocus = nextFocus.filter((k) => k !== key);
    } else {
      nextFocus.push(key as Exclude<FocusKey, null>);
    }
    setFocus(nextFocus);
    syncDashboardUrl(activeTab, nextFocus);
  };

  const familias = useMemo(
    () =>
      data.familias.filter((item) => {
        const matchQuery =
          !queryNorm ||
          [item.nomeFamilia, item.comunidade, item.organizacaoColetiva, item.grupoInteresse, item.municipio]
            .filter(Boolean)
            .some((value) => String(value).toLowerCase().includes(queryNorm));

        return matchQuery && focusFilter(focus, item, "ufpas");
      }),
    [data.familias, focus, queryNorm],
  );

  const organizacoes = useMemo(
    () =>
      data.organizacoes.filter((item) => {
        const matchQuery =
          !queryNorm ||
          [item.denominacao, item.municipio]
            .filter(Boolean)
            .some((value) => String(value).toLowerCase().includes(queryNorm));

        return matchQuery && focusFilter(focus, item, "organizacoes");
      }),
    [data.organizacoes, focus, queryNorm],
  );

  const atendimentos = useMemo(
    () =>
      data.atendimentos.filter((item) => {
        const matchQuery = !queryNorm ||
          [item.ufpa, item.organizacaoColetiva, item.tecnico, item.statusRelatorio]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(queryNorm));

        return matchQuery && focusFilter(focus, item, "atendimentos");
      }),
    [data.atendimentos, focus, queryNorm],
  );

  const activeData = activeTab === "ufpas" ? familias : activeTab === "organizacoes" ? organizacoes : atendimentos;

  const executiveMetrics = useMemo(() => {
    const ufpasComAlertas = data.familias.filter((item) => getRisks(item).length > 0).length;
    const semAguaTratada = data.familias.filter((item) => item.aguaTratada === false).length;
    const semCadUnico = data.familias.filter((item) => item.cadUnico === false).length;
    const insegurancaAlimentar = data.familias.filter((item) => item.insegurancaAlimentar === true).length;
    const organizacoesSemIndicadores = data.organizacoes.filter((item) => !item.indicadoresRegistrados).length;
    const organizacoesSemPraticas = data.organizacoes.filter((item) => item.praticasAmbientais === false).length;
    const relatoriosEmAnalise = data.atendimentos.filter((item) => item.statusRelatorio === "EM_ANALISE").length;
    const relatoriosReprovados = data.atendimentos.filter((item) => item.statusRelatorio === "REPROVADO_GESTOR").length;
    const mulheresAtendidas = data.atendimentos.reduce((sum, item) => sum + item.numeroMulheres, 0);
    const jovensAtendidos = data.atendimentos.reduce((sum, item) => sum + item.numeroJovens, 0);

    return {
      ufpasComAlertas,
      semAguaTratada,
      semCadUnico,
      insegurancaAlimentar,
      organizacoesSemIndicadores,
      organizacoesSemPraticas,
      relatoriosEmAnalise,
      relatoriosReprovados,
      totalPessoasAtendidas: mulheresAtendidas + jovensAtendidos,
    };
  }, [data]);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-zinc-200/60 bg-white p-6 shadow-[0_2px_4px_rgba(0,0,0,0.02)] sm:p-8">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_400px] xl:items-center">
          <div>
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-emerald-600 p-2 shadow-lg shadow-emerald-600/20">
                <ViewIcon className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-bold tracking-tight text-zinc-900">{meta.title}</h2>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-zinc-500 font-bold">
              {meta.description}
            </p>
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                syncDashboardUrl(activeTab, focus, event.target.value);
              }}
              placeholder={meta.searchPlaceholder}
              className="h-12 w-full rounded-2xl border border-zinc-200 bg-zinc-50/50 pl-11 pr-4 text-sm font-bold text-zinc-900 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
            />
          </div>
        </div>

        <div className="hidden">
          <MetricCard label="UFPAs" value={data.familias.length} description="Unidades familiares cadastradas." tone="zinc" icon={Users} />
          <MetricCard label="Organizações" value={data.organizacoes.length} description="Organizações coletivas cadastradas." tone="zinc" icon={Building2} />
          <MetricCard label="Visitas" value={data.atendimentos.length} description="Atendimentos sem rascunhos." tone="zinc" icon={ClipboardList} />
          <MetricCard label="Público Alcançado" value={executiveMetrics.totalPessoasAtendidas} description="Mulheres e jovens registrados." tone="zinc" icon={Users} />
        </div>

        <div className="hidden">
          <div className="mb-4 flex items-center gap-2">
            <Filter className="h-4 w-4 text-zinc-500" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Indicadores de decisão</h3>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <AlertButton
              label="UFPAs com alerta"
              value={executiveMetrics.ufpasComAlertas}
              description="Famílias com uma ou mais pendências sociais, ambientais ou operacionais."
              active={activeTab === "ufpas" && focus.includes("comAlertas")}
              onClick={() => activateFocus("ufpas", "comAlertas")}
              icon={AlertTriangle}
            />
            <AlertButton
              label="Água sem tratamento"
              value={executiveMetrics.semAguaTratada}
              description="UFPAs com problema direto em água de consumo tratada."
              active={activeTab === "ufpas" && focus.includes("semAgua")}
              onClick={() => activateFocus("ufpas", "semAgua")}
              icon={Droplets}
            />
            <AlertButton
              label="Sem CadÚnico"
              value={executiveMetrics.semCadUnico}
              description="Famílias sem CadÚnico registrado nos indicadores."
              active={activeTab === "ufpas" && focus.includes("semCadUnico")}
              onClick={() => activateFocus("ufpas", "semCadUnico")}
              icon={Users}
            />
            <AlertButton
              label="Insegurança alimentar"
              value={executiveMetrics.insegurancaAlimentar}
              description="Famílias com alerta alimentar registrado no diagnóstico."
              active={activeTab === "ufpas" && focus.includes("inseguranca")}
              onClick={() => activateFocus("ufpas", "inseguranca")}
              icon={AlertCircle}
            />
            <AlertButton
              label="Org. sem indicadores"
              value={executiveMetrics.organizacoesSemIndicadores}
              description="Organizações coletivas sem indicadores preenchidos."
              active={activeTab === "organizacoes" && focus.includes("indicadoresPendentes")}
              onClick={() => activateFocus("organizacoes", "indicadoresPendentes")}
              icon={Building2}
            />
            <AlertButton
              label="Org. sem práticas ambientais"
              value={executiveMetrics.organizacoesSemPraticas}
              description="Organizações que declararam não usar práticas ambientais."
              active={activeTab === "organizacoes" && focus.includes("semPraticasAmbientais")}
              onClick={() => activateFocus("organizacoes", "semPraticasAmbientais")}
              icon={Leaf}
            />
            <AlertButton
              label="Relatórios em análise"
              value={executiveMetrics.relatoriosEmAnalise}
              description="Atendimentos aguardando avaliação da coordenação."
              active={activeTab === "atendimentos" && focus.includes("emAnalise")}
              onClick={() => activateFocus("atendimentos", "emAnalise")}
              icon={LayoutDashboard}
            />
            <AlertButton
              label="Relatórios reprovados"
              value={executiveMetrics.relatoriosReprovados}
              description="Atendimentos que precisam voltar para correção."
              active={activeTab === "atendimentos" && focus.includes("reprovados")}
              onClick={() => activateFocus("atendimentos", "reprovados")}
              icon={AlertCircle}
            />
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-zinc-100 pt-8">
          <div className="flex flex-wrap items-center gap-3">
            <TabButton active={activeTab === "ufpas"} icon={Users} label="UFPAs" onClick={() => { setActiveTab("ufpas"); setFocus(null); syncDashboardUrl("ufpas", null); }} />
            <TabButton active={activeTab === "organizacoes"} icon={Building2} label="Organizações" onClick={() => { setActiveTab("organizacoes"); setFocus(null); syncDashboardUrl("organizacoes", null); }} />
            <TabButton active={activeTab === "atendimentos"} icon={ClipboardList} label="Atendimentos" onClick={() => { setActiveTab("atendimentos"); setFocus(null); syncDashboardUrl("atendimentos", null); }} />

            {(query || focus) && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setFocus(null);
                  syncDashboardUrl(activeTab, null, "");
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-100 px-4 py-2.5 text-sm font-bold text-zinc-600 transition hover:bg-zinc-200"
              >
                <X className="h-4 w-4" />
                Limpar filtros
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <ExportExcelButton
              data={activeTab === "ufpas" ? mapUfpasToExcelData(activeData as any) : activeData}
              fileName={`Exportacao_${meta.exportName}_SIGGATER_${new Date().toISOString().slice(0,10)}`}
              label={meta.exportLabel}
            />
          </div>
        </div>
      </section>

      <div className="relative">
        <div className="absolute inset-0 -top-4 rounded-[3rem] bg-zinc-100/30 shadow-inner" aria-hidden="true" />
        <div className="relative space-y-6">
          {activeTab === "ufpas" && <UfpaPanel items={familias} focus={focus} setFocus={setPanelFocus} appendReturnHref={appendReturnHref} />}
          {activeTab === "organizacoes" && <OrganizacoesPanel items={organizacoes} focus={focus} setFocus={setPanelFocus} appendReturnHref={appendReturnHref} />}
          {activeTab === "atendimentos" && <AtendimentosPanel items={atendimentos} focus={focus} setFocus={setPanelFocus} appendReturnHref={appendReturnHref} />}
        </div>
      </div>

      <section className="hidden">
        <div className="mb-6 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-emerald-500" />
          <h2 className="text-base font-bold text-zinc-900">Guia de Apoio à Reunião</h2>
        </div>
        <div className="grid gap-6 text-sm md:grid-cols-3">
          <div className="rounded-xl bg-zinc-50 p-5">
            <div className="flex items-center gap-2 text-blue-600">
              <Users className="h-4 w-4" />
              <span className="font-bold uppercase tracking-wider text-[10px]">Visão UFPAs</span>
            </div>
            <p className="mt-3 leading-relaxed text-zinc-600 font-bold">
              Utilize para identificar vulnerabilidades e definir o plano de ação familiar individual.
            </p>
          </div>
          <div className="rounded-xl bg-zinc-50 p-5">
            <div className="flex items-center gap-2 text-emerald-600">
              <Building2 className="h-4 w-4" />
              <span className="font-bold uppercase tracking-wider text-[10px]">Visão Organizações</span>
            </div>
            <p className="mt-3 leading-relaxed text-zinc-600 font-bold">
              Foque na capacidade coletiva, representação política e abertura de novos canais de mercado.
            </p>
          </div>
          <div className="rounded-xl bg-zinc-50 p-5">
            <div className="flex items-center gap-2 text-amber-600">
              <Leaf className="h-4 w-4" />
              <span className="font-bold uppercase tracking-wider text-[10px]">Visão Atendimentos</span>
            </div>
            <p className="mt-3 leading-relaxed text-zinc-600 font-bold">
              Avalie a produtividade da equipe e o alcance real das metas de visitas e eixos trabalhados.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
