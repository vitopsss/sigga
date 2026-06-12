import path from "node:path";

import * as XLSX from "xlsx";

export type SheetRow = Record<string, string>;

export function readWorkbook(filePath: string) {
  return XLSX.readFile(path.resolve(filePath), { cellDates: true });
}

export function getRowsFromSheet(
  workbook: XLSX.WorkBook,
  sheetName: string,
  headerRowIndex: number,
  dataStartRowIndex: number,
) {
  const sheet = workbook.Sheets[sheetName];
  if (!sheet) {
    throw new Error(`Aba não encontrada: ${sheetName}`);
  }

  const matrix = XLSX.utils.sheet_to_json<(string | number | Date | null)[]>(sheet, {
    header: 1,
    raw: false,
    defval: "",
  });

  const headers = (matrix[headerRowIndex] ?? []).map((cell) =>
    String(cell ?? "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, ""),
  );

  return matrix.slice(dataStartRowIndex).map((row) => {
    const record: SheetRow = {};
    headers.forEach((header, index) => {
      if (!header) {
        return;
      }

      record[header] = String(row[index] ?? "").trim();
    });

    return record;
  });
}

export function pick(row: SheetRow, ...candidates: string[]) {
  const keys = Object.keys(row);
  for (const candidate of candidates) {
    const normalized = candidate
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    const key = keys.find((item) => item.includes(normalized));
    if (key && row[key]) {
      return row[key];
    }
  }

  return "";
}

export function parseBooleanFlag(value: string) {
  const normalized = value.trim().toLowerCase();
  return normalized === "sim" || normalized === "s" || normalized === "true" || normalized === "1";
}

export function parseDecimal(value: string) {
  if (!value) {
    return undefined;
  }

  const normalized = value.replace(/\./g, "").replace(",", ".");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function parseDate(value: string) {
  if (!value) {
    return undefined;
  }

  const iso = value.includes("/") ? value.split("/").reverse().join("-") : value;
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? undefined : date;
}
