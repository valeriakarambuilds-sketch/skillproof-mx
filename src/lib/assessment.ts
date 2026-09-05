import { unzipSync, strFromU8 } from "fflate";
import { XMLParser } from "fast-xml-parser";

export type Check = { label: string; earned: number; possible: number; evidence: string };
export type DeterministicResult = { accuracy: number; traceability: number; checks: Check[] };

const key = [
  ["B11", 0.2, "Crecimiento de ingresos"],
  ["B12", 3_500_000, "Utilidad bruta 2025"],
  ["B13", 3_900_000, "Utilidad bruta 2026"],
  ["B14", 0.35, "Margen bruto 2025"],
  ["B15", 0.325, "Margen bruto 2026"],
  ["B16", 1_500_000, "EBITDA 2025"],
  ["B17", 1_600_000, "EBITDA 2026"],
  ["B18", 0.15, "Margen EBITDA 2025"],
  ["B19", 1_600_000 / 12_000_000, "Margen EBITDA 2026"],
  ["B20", 1_600_000 / 12_000_000 - 0.15, "Cambio de margen EBITDA"],
] as const;

function list<T>(value: T | T[] | undefined): T[] { return value === undefined ? [] : Array.isArray(value) ? value : [value]; }

export function gradeCells(cells: Record<string, { value?: number; formula?: string }>): DeterministicResult {
  let accuracy = 0;
  let traceability = 0;
  const checks: Check[] = [];
  for (const [address, expected, label] of key) {
    const cell = cells[address] || {};
    const actual = Number(cell.value);
    const tolerance = Math.max(Math.abs(expected) * 0.005, 0.0005);
    const correct = Number.isFinite(actual) && Math.abs(actual - expected) <= tolerance;
    const formula = Boolean(cell.formula?.trim().startsWith("="));
    if (correct) accuracy += 3.5;
    if (formula) traceability += 2.5;
    checks.push({
      label,
      earned: (correct ? 3.5 : 0) + (formula ? 2.5 : 0),
      possible: 6,
      evidence: `${address}: ${correct ? "resultado correcto" : "revisar resultado"}; ${formula ? "fórmula visible" : "sin fórmula trazable"}`,
    });
  }
  return { accuracy, traceability, checks };
}

export function parseWorkbook(buffer: ArrayBuffer): Record<string, { value?: number; formula?: string }> {
  const zip = unzipSync(new Uint8Array(buffer));
  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_", parseTagValue: false, removeNSPrefix: true });
  const workbookFile = zip["xl/workbook.xml"];
  const relationsFile = zip["xl/_rels/workbook.xml.rels"];
  if (!workbookFile || !relationsFile) throw new Error("El archivo no parece ser un Excel válido.");
  const workbook = parser.parse(strFromU8(workbookFile));
  const relations = parser.parse(strFromU8(relationsFile));
  const sheets = list(workbook?.workbook?.sheets?.sheet);
  const assessment = sheets.find((sheet: any) => sheet?.["@_name"] === "Assessment");
  if (!assessment) throw new Error("No encontramos la hoja llamada Assessment.");
  const relationshipId = assessment["@_id"] || assessment["@_r:id"];
  const rels = list(relations?.Relationships?.Relationship);
  const rel = rels.find((item: any) => item?.["@_Id"] === relationshipId);
  let target = rel?.["@_Target"] as string | undefined;
  if (!target) throw new Error("No pudimos leer la hoja Assessment.");
  target = target.replace(/^\//, "");
  if (!target.startsWith("xl/")) target = `xl/${target.replace(/^\.\//, "")}`;
  const sheetFile = zip[target];
  if (!sheetFile) throw new Error("La hoja Assessment está dañada o incompleta.");
  const sheet = parser.parse(strFromU8(sheetFile));
  const cells: Record<string, { value?: number; formula?: string }> = {};
  for (const row of list(sheet?.worksheet?.sheetData?.row)) {
    for (const cell of list((row as any)?.c)) {
      const address = cell?.["@_r"];
      if (!address || !/^B(1[1-9]|20)$/.test(address)) continue;
      const value = Number(cell?.v);
      cells[address] = {
        value: Number.isFinite(value) ? value : undefined,
        formula: cell?.f === undefined ? undefined : `=${typeof cell.f === "object" ? cell.f["#text"] || "" : cell.f}`,
      };
    }
  }
  return cells;
}

export function clampScore(value: number, max: number) { return Math.max(0, Math.min(max, Math.round(value * 10) / 10)); }
