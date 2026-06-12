"use client";

import { Download } from "lucide-react";
import * as XLSX from "xlsx";

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

    // Criar planilha a partir dos dados (formato flat)
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    // Gerar arquivo e disparar download
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  }

  return (
    <Button variant="secondary" size="sm" onClick={handleExport} className="gap-2">
      <Download className="h-4 w-4" />
      {label}
    </Button>
  );
}
