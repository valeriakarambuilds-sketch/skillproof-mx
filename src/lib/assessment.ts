import { unzipSync, strFromU8 } from "fflate";
import { XMLParser } from "fast-xml-parser";

export type Cell = { value?: number; formula?: string };
export type Check = { label: string; earned: number; possible: number; evidence: string; address: string; formula?: string; expected: number; actual?: number; status: "verificado" | "contradictorio" | "pendiente" };
export const sourceData: Record<string, number> = {B5:10000000,C5:12000000,B6:6500000,C6:8100000,B7:2000000,C7:2300000,B8:300000,C8:350000};
const requiredSources: Record<string,string[]> = {B11:["B5","C5"],B12:["B5","B6"],B13:["C5","C6"],B14:["B5","B6"],B15:["C5","C6"],B16:["B5","B6","B7"],B17:["C5","C6","C7"],B18:["B5","B6","B7"],B19:["C5","C6","C7"],B20:["B5","B6","B7","C5","C6","C7"]};

// Deliberately bounded Excel arithmetic. Never uses eval or executes a workbook.
function calculate(address: string, cells: Record<string,Cell>, seen = new Set<string>()): {value:number; refs:Set<string>} {
 if (seen.has(address) || seen.size > 30) throw new Error("Referencia circular");
 const cell=cells[address];
 if (!cell) throw new Error("Referencia ausente");
 if (!cell.formula) {
  if (typeof cell.value !== "number" || !Number.isFinite(cell.value)) throw new Error("Valor ausente");
  return {value:cell.value,refs:new Set([address])};
 }
 const next=new Set(seen); next.add(address);
 const source=cell.formula.slice(1).replace(/\$/g,"").replace(/\s/g,"").toUpperCase();
 if(source.length>500) throw new Error("Fórmula demasiado larga");
 const tokens=source.match(/(?:[A-Z]{1,3}[1-9][0-9]*|(?:[0-9]+(?:\.[0-9]*)?|\.[0-9]+)|[()+*/%\-])/g)||[];
 if(tokens.join("")!==source || !tokens.length) throw new Error("Fórmula no compatible");
 let pos=0; const refs=new Set<string>();
 function atom():number {
  const t=tokens[pos++]; let value:number;
  if(t==="+" || t==="-") value=(t==="-"?-1:1)*atom();
  else if(t==="("){value=expression();if(tokens[pos++]!==")")throw new Error("Paréntesis inválidos");}
  else if(/^[A-Z]/.test(t||"")){ const r=calculate(t,cells,next);r.refs.forEach(x=>refs.add(x)); value=r.value; }
  else if(t && /^(?:[0-9]|\.)/.test(t)) value=Number(t);
  else throw new Error("Expresión inválida");
  while(tokens[pos]==="%") {pos++;value/=100;}
  return value;
 }
 function product():number {let v=atom();while(tokens[pos]==="*"||tokens[pos]==="/"){const op=tokens[pos++],r=atom();v=op==="*"?v*r:v/r;}return v;}
 function expression():number {let v=product();while(tokens[pos]==="+"||tokens[pos]==="-"){const op=tokens[pos++],r=product();v=op==="+"?v+r:v-r;}return v;}
 const value=expression();if(pos!==tokens.length || !Number.isFinite(value))throw new Error("Resultado no verificable");
 return {value,refs};
}
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

export function gradeCells(cells: Record<string, Cell>): DeterministicResult {
 let accuracy=0, traceability=0; const checks:Check[]=[];
 for(const [address,expected,label] of key){
  const cell=cells[address]||{}; let actual=cell.value; let traced=false;
  let status:Check["status"]="pendiente", reason="Falta evidencia o una fórmula trazable.";
  const tolerance=Math.max(Math.abs(expected)*.005,.0005);
  if(cell.formula){
   try {
    const computed=calculate(address,cells); actual=computed.value;
    const correct=Math.abs(actual-expected)<=tolerance;
    const linked=requiredSources[address].every(x=>computed.refs.has(x));
    traced=correct&&linked;
    status=!correct?"contradictorio":traced?"verificado":"pendiente";
    reason=!correct?"La fórmula recalculada no coincide con el criterio.":!linked?"Resultado correcto, pero no se confirmó la conexión con todos los datos requeridos.":"Operación compatible, resultado y referencias a datos comprobados; no acredita autoría ni toda la lógica financiera.";
   }catch { actual=undefined; reason="Fórmula o referencia no compatible: requiere revisión humana, sin crédito automático."; }
  }else if(typeof actual==="number"&&Number.isFinite(actual)){
   status=Math.abs(actual-expected)<=tolerance?"pendiente":"contradictorio";
   reason=status==="pendiente"?"Número correcto escrito sin fórmula: solo se verifica exactitud.":"El número no coincide con el criterio.";
  }
  const correct=typeof actual==="number"&&Number.isFinite(actual)&&Math.abs(actual-expected)<=tolerance;
  if(correct)accuracy+=3.5;if(traced)traceability+=2.5;
  checks.push({label,address:`Assessment!${address}`,formula:cell.formula,expected,actual,status,earned:(correct?3.5:0)+(traced?2.5:0),possible:6,evidence:`Assessment!${address}: ${reason}`});
 }
 return {accuracy,traceability,checks};
}

export function parseWorkbook(buffer: ArrayBuffer): Record<string, { value?: number; formula?: string }> {
  const bytes=new Uint8Array(buffer);
  if(bytes.length<4 || bytes[0]!==80 || bytes[1]!==75) throw new Error("El archivo no es un XLSX válido.");
  let expanded=0, count=0;
  const zip = unzipSync(bytes,{filter(entry){
    expanded+=entry.originalSize;count++;
    if(expanded>10*1024*1024 || count>200 || entry.originalSize>5*1024*1024) throw new Error("El Excel expandido excede los límites de seguridad.");
    return /^(xl\/(workbook\.xml|_rels\/workbook\.xml\.rels|worksheets\/[^/]+\.xml))$/.test(entry.name);
  }});
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
      if (!address || !/^[A-Z]{1,3}[1-9][0-9]*$/.test(address)) continue;
      const value = cell?.v === undefined || cell?.v === "" || (cell?.["@_t"] && cell["@_t"] !== "n") ? NaN : Number(cell.v);
      cells[address] = {
        value: Number.isFinite(value) ? value : undefined,
        formula: cell?.f === undefined ? undefined : `=${typeof cell.f === "object" ? cell.f["#text"] || "" : cell.f}`,
      };
    }
  }
  for(const [address,expected] of Object.entries(sourceData)) {
    if(cells[address]?.formula || cells[address]?.value!==expected) throw new Error(`Los datos originales de ${address} fueron modificados o faltan. Usa la plantilla sin alterar.`);
  }
  return cells;
}

export function clampScore(value: number, max: number) { return Math.max(0, Math.min(max, Math.round(value * 10) / 10)); }
