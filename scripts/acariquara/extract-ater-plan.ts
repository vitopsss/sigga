import path from "node:path";
import xlsx from "xlsx";

type ActivityRow = {
  atividade: string;
  inicioPlano?: string;
  duracaoPlano?: string;
  inicioReal?: string;
  duracaoReal?: string;
  porcentagemConcluida?: string;
};

function clean(value: unknown) {
  if (value === null || value === undefined) return "";
  return String(value).replace(/\s+/g, " ").trim();
}

function isHeaderRow(row: unknown[]) {
  return clean(row[0]).toUpperCase() === "ATIVIDADE";
}

function isMonthRow(row: unknown[]) {
  return clean(row[0]) === "" && /M\d+\s*-/.test(clean(row[2]));
}

function main() {
  const input = process.argv[2];
  const sheetName = process.argv[3] ?? "Planejador de Projetos";
  if (!input) {
    console.error(
      "Usage: npx tsx scripts/acariquara/extract-ater-plan.ts <file.xlsx> [sheetName]",
    );
    process.exit(2);
  }

  const filePath = path.resolve(process.cwd(), input);
  const workbook = xlsx.readFile(filePath, { cellDates: true });
  const sheet = workbook.Sheets[sheetName];
  if (!sheet) {
    console.error(
      `Sheet not found: ${sheetName}. Available: ${workbook.SheetNames.join(", ")}`,
    );
    process.exit(2);
  }

  const grid = xlsx.utils.sheet_to_json<unknown[]>(sheet, {
    header: 1,
    raw: false,
    defval: "",
  });

  const headerIndex = grid.findIndex(isHeaderRow);
  if (headerIndex === -1) {
    console.error("Header row not found (expected first cell = ATIVIDADE).");
    process.exit(2);
  }

  const activities: ActivityRow[] = [];
  for (let i = headerIndex + 1; i < grid.length; i++) {
    const row = grid[i] ?? [];
    if (isMonthRow(row)) break;

    const atividade = clean(row[0]);
    if (!atividade) continue;

    // Stop if we reached another header-like row.
    if (atividade.toUpperCase() === "ATIVIDADE") continue;

    const item: ActivityRow = {
      atividade,
      inicioPlano: clean(row[1]) || undefined,
      duracaoPlano: clean(row[2]) || undefined,
      inicioReal: clean(row[3]) || undefined,
      duracaoReal: clean(row[4]) || undefined,
      porcentagemConcluida: clean(row[5]) || undefined,
    };

    activities.push(item);
  }

  // Deduplicate by activity name (keep first occurrence).
  const seen = new Set<string>();
  const unique = activities.filter((a) => {
    const key = a.atividade.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const lines: string[] = [];
  lines.push("# Atividades Planejadas (Extraído do Excel)");
  lines.push("");
  lines.push(`Arquivo: ${path.basename(filePath)}`);
  lines.push(`Aba: ${sheetName}`);
  lines.push("");
  lines.push("## Lista");
  lines.push("");

  for (const a of unique) {
    const parts = [
      a.inicioPlano ? `início do plano: ${a.inicioPlano}` : null,
      a.duracaoPlano ? `duração do plano: ${a.duracaoPlano}` : null,
      a.porcentagemConcluida ? `% concluída: ${a.porcentagemConcluida}` : null,
    ].filter(Boolean);

    lines.push(`- ${a.atividade}${parts.length ? ` (${parts.join("; ")})` : ""}`);
  }

  process.stdout.write(lines.join("\n"));
}

main();
