"use client";

import { Download } from "lucide-react";
import { exportTableToExcel } from "@/lib/excel-export";

import { Button } from "@/components/ui";

interface ExportButtonProps {
  data: Record<string, unknown>[];
  fileName: string;
  sheetName?: string;
  label?: string;
}

export function ExportExcelButton({
  data,
  fileName,
  sheetName = "Dados",
  label = "Exportar para Excel",
}: ExportButtonProps) {
  function handleExport() {
    if (!data || data.length === 0) {
      alert("Não há dados para exportar.");
      return;
    }

    // Gerar arquivo usando nossa função com auto-ajuste de colunas
    exportTableToExcel(data, fileName.endsWith(".xlsx") ? fileName : `${fileName}.xlsx`, sheetName);
  }

  return (
    <Button variant="secondary" size="sm" onClick={handleExport} className="gap-2">
      <Download className="h-4 w-4" />
      {label}
    </Button>
  );
}
