import path from "node:path";
import xlsx from "xlsx";

function asString(value: unknown) {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value);
  if (typeof value === "boolean") return value ? "true" : "false";
  return String(value).trim();
}

function main() {
  const input = process.argv[2];
  if (!input) {
    console.error("Usage: npx tsx scripts/acariquara/inspect-xlsx.ts <file.xlsx>");
    process.exit(2);
  }

  const filePath = path.resolve(process.cwd(), input);
  const workbook = xlsx.readFile(filePath, { cellDates: true });

  const result: Record<
    string,
    {
      sheetName: string;
      rows: number;
      cols: number;
      headerPreview: string[];
      sample: Record<string, string>[];
    }
  > = {};

  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    const rows = xlsx.utils.sheet_to_json<Record<string, unknown>>(sheet, {
      defval: "",
      raw: false,
    });

    const headerSet = new Set<string>();
    for (const row of rows.slice(0, 25)) {
      for (const key of Object.keys(row)) headerSet.add(key);
    }
    const headerPreview = Array.from(headerSet).filter(Boolean).slice(0, 40);

    const sample: Record<string, string>[] = rows.slice(0, 8).map((row) => {
      const out: Record<string, string> = {};
      for (const key of headerPreview) out[key] = asString(row[key]);
      return out;
    });

    result[sheetName] = {
      sheetName,
      rows: rows.length,
      cols: headerPreview.length,
      headerPreview,
      sample,
    };
  }

  process.stdout.write(JSON.stringify(result, null, 2));
}

main();
