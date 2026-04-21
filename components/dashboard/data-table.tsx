import { MoreHorizontal, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Empty, EmptyIcon, EmptyTitle, EmptyDescription } from "@/components/ui/empty";
import { cn } from "@/lib/utils";
import { useState } from "react";

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

export interface DataTableProps<T> {
  title?: string;
  description?: string;
  data: T[];
  columns: Column<T>[];
  keyField: keyof T;
  actions?: Array<{
    label: string;
    href?: (item: T) => string;
    onClick?: (item: T) => void;
    icon?: React.ComponentType<{ className?: string }>;
    variant?: "default" | "destructive" | "ghost";
  }>;
  searchPlaceholder?: string;
  emptyIcon?: React.ComponentType<{ className?: string }>;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: {
    label: string;
    href?: string;
  };
  loading?: boolean;
}

export function DataTable<T extends Record<string, unknown>>({
  title,
  description,
  data,
  columns,
  keyField,
  actions = [],
  searchPlaceholder = "Buscar...",
  emptyIcon,
  emptyTitle = "Nenhum registro encontrado",
  emptyDescription,
  emptyAction,
  loading,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [actionMenu, setActionMenu] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _emptyAction = emptyAction;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _loading = loading;

  const filteredData = data.filter((item) =>
    columns.some((col) => {
      const value = item[col.key];
      return String(value).toLowerCase().includes(search.toLowerCase());
    })
  );

  return (
    <Card>
      {/* Header */}
      {(title || searchPlaceholder) && (
        <div className="flex flex-col gap-4 border-b border-zinc-200/60 p-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            {title && <h2 className="text-lg font-semibold text-zinc-950">{title}</h2>}
            {description && <p className="text-sm text-zinc-500">{description}</p>}
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={searchPlaceholder}
                className="h-10 w-full rounded-xl border border-zinc-300 bg-zinc-50 pl-4 pr-4 text-sm placeholder:text-zinc-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 lg:w-64"
              />
            </div>
            <Button variant="secondary" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      {filteredData.length === 0 ? (
        <Empty>
          {emptyIcon && (
            <EmptyIcon>
              {(() => {
                const IconComponent = emptyIcon;
                return <IconComponent className="h-10 w-10" />;
              })()}
            </EmptyIcon>
          )}
          <EmptyTitle>{emptyTitle}</EmptyTitle>
          {emptyDescription && <EmptyDescription>{emptyDescription}</EmptyDescription>}
        </Empty>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-200/60 bg-zinc-50/50">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={cn(
                      "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500",
                      col.className
                    )}
                  >
                    {col.header}
                  </th>
                ))}
                {actions.length > 0 && (
                  <th className="w-16 px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    Acoes
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredData.map((item) => (
                <tr
                  key={String(item[keyField])}
                  className="transition-colors hover:bg-zinc-50/70"
                >
                  {columns.map((col) => (
                    <td key={col.key} className={cn("px-4 py-4", col.className)}>
                      {col.render ? col.render(item) : String(item[col.key] ?? "-")}
                    </td>
                  ))}
                  {actions.length > 0 && (
                    <td className="px-4 py-4 text-right">
                      <div className="relative flex items-center justify-end gap-1">
                        <button
                          onClick={() => setActionMenu(actionMenu === String(item[keyField]) ? null : String(item[keyField]))}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                        {actionMenu === String(item[keyField]) && (
                          <div className="absolute right-0 top-full z-10 mt-1 w-40 rounded-xl border border-zinc-200 bg-white py-1 shadow-lg">
                            {actions.map((action, i) => (
                              <button
                                key={i}
                                onClick={() => {
                                  if (action.href) {
                                    window.location.href = action.href(item);
                                  } else if (action.onClick) {
                                    action.onClick(item);
                                  }
                                  setActionMenu(null);
                                }}
                                className={cn(
                                  "flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-zinc-50",
                                  action.variant === "destructive"
                                    ? "text-rose-600"
                                    : "text-zinc-700"
                                )}
                              >
                                {action.icon && <action.icon className="h-4 w-4" />}
                                {action.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-zinc-200/60 px-6 py-4">
        <p className="text-sm text-zinc-500">
          Mostrando {filteredData.length} de {data.length} registros
        </p>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" disabled>
            Anterior
          </Button>
          <Button variant="secondary" size="sm">
            Proximo
          </Button>
        </div>
      </div>
    </Card>
  );
}
