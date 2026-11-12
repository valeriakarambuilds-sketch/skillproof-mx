export const OFFER = {
  price: 180, assessments: 20, validityDays: 30,
  manualHours: 10, assistedHours: 4, hourlyValue: 300,
  status: 'Precio en prueba · sin cobro activo',
} as const;
export const FIELDS = [
  { key: 'employers', label: 'Empresas potenciales al mes', unit: 'empresas', max: 1000000, integer: true, hint: 'Universo elegible, no clientes confirmados.' },
  { key: 'conversion', label: 'Conversión a pago', unit: '%', max: 100, integer: false, hint: 'Supuesto, no una tasa observada.' },
  { key: 'frequency', label: 'Vacantes por empresa pagadora al mes', unit: 'vacantes/mes', max: 1000, integer: false, hint: 'Usa 0.25 si contrata una vez cada cuatro meses.' },
  { key: 'price', label: 'Precio por vacante', unit: 'MXN', max: 1000000, integer: false, hint: 'Oferta de referencia: $180; cambiar aquí solo cambia el escenario.' },
  { key: 'processing', label: 'Procesamiento por vacante', unit: 'MXN', max: 1000000, integer: false, hint: 'Supuesto de costo, no tarifa de un proveedor.' },
  { key: 'infrastructure', label: 'Infraestructura por vacante', unit: 'MXN', max: 1000000, integer: false, hint: 'Incluye el costo variable que corresponda.' },
  { key: 'humanMinutes', label: 'Soporte y correcciones por vacante', unit: 'minutos', max: 10000, integer: false, hint: 'Modela tiempo humano futuro del servicio; no asigna un revisor.' },
  { key: 'hourlyCost', label: 'Costo de la hora humana', unit: 'MXN/hora', max: 1000000, integer: false, hint: 'Costo de atender el servicio; editable.' },
  { key: 'customization', label: 'Adaptación incluida por vacante', unit: 'MXN', max: 1000000, integer: false, hint: 'El piloto no incluye adaptaciones especiales.' },
  { key: 'fixed', label: 'Gastos fijos mensuales', unit: 'MXN/mes', max: 100000000, integer: false, hint: 'Cero no significa que no existan gastos fijos.' },
] as const;
export type InputKey = typeof FIELDS[number]['key'];
export type PricingInputs = Record<InputKey, number>;
export type PricingDraft = Record<InputKey, string>;
export const DEFAULTS: PricingInputs = { employers:100, conversion:10, frequency:1, price:OFFER.price, processing:5, infrastructure:5, humanMinutes:30, hourlyCost:300, customization:0, fixed:0 };
export function toDraft(input: PricingInputs): PricingDraft {
  return Object.fromEntries(FIELDS.map(f => [f.key, String(input[f.key])])) as PricingDraft;
}
export function validateInputs(raw: unknown): { inputs: PricingInputs | null; errors: Partial<Record<InputKey,string>> } {
  const errors: Partial<Record<InputKey,string>> = {};
  const inputs = {} as PricingInputs;
  const object = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw as Record<string,unknown> : {};
  for (const field of FIELDS) {
    const value = object[field.key];
    const n = typeof value === 'number' ? value : typeof value === 'string' && value.trim() !== '' ? Number(value) : NaN;
    if (!Number.isFinite(n) || n < 0 || n > field.max || (field.integer && !Number.isInteger(n))) {
      errors[field.key] = `Ingresa ${field.integer ? 'un entero' : 'un número'} entre 0 y ${field.max.toLocaleString('es-MX')}.`;
    } else inputs[field.key] = n;
  }
  return { inputs: Object.keys(errors).length ? null : inputs, errors };
}
export function calculateScenario(inputs: PricingInputs) {
  const validated = validateInputs(inputs);
  if (!validated.inputs) throw new Error('Supuestos inválidos.');
  const buyers = inputs.employers * inputs.conversion / 100;
  const vacancies = buyers * inputs.frequency;
  const monthly = vacancies * inputs.price;
  const unitCost = inputs.processing + inputs.infrastructure + inputs.humanMinutes / 60 * inputs.hourlyCost + inputs.customization;
  const variableCost = vacancies * unitCost;
  const contribution = monthly - variableCost;
  return { buyers, vacancies, monthly, annualized: monthly * 12, unitCost, variableCost, contribution, afterFixed:contribution-inputs.fixed, margin:monthly > 0 ? contribution/monthly*100 : null };
}
export function valueComparison() {
  const baseline = OFFER.manualHours * OFFER.hourlyValue;
  const assistedLabor = OFFER.assistedHours * OFFER.hourlyValue;
  const total = assistedLabor + OFFER.price;
  return { baseline, assistedLabor, total, grossValue:baseline-assistedLabor, netSaving:baseline-total, benefitPrice:(baseline-assistedLabor)/OFFER.price, costRatio:baseline/total };
}
export const SCENARIO_KEY = 'skillproof.pricing.v1';
export type SavedScenario = { id:string; createdAt:string; inputs:PricingInputs };
export function parseScenarios(raw: string | null): SavedScenario[] {
  if (raw === null) return [];
  if (raw.length > 40000) throw new Error('El archivo local de escenarios es demasiado grande.');
  const parsed: unknown = JSON.parse(raw);
  if (!parsed || typeof parsed !== 'object' || !('version' in parsed) || parsed.version !== 1 || !('items' in parsed) || !Array.isArray(parsed.items) || parsed.items.length > 10) throw new Error('Formato de escenarios no compatible.');
  const ids = new Set<string>();
  return parsed.items.map((item:unknown) => {
    if (!item || typeof item !== 'object' || !('id' in item) || typeof item.id !== 'string' || !/^[a-zA-Z0-9-]{1,80}$/.test(item.id) || ids.has(item.id) || !('createdAt' in item) || typeof item.createdAt !== 'string' || item.createdAt.length > 35 || !Number.isFinite(Date.parse(item.createdAt)) || !('inputs' in item)) throw new Error('Escenario local dañado.');
    const stored = item.inputs;
    if (!stored || typeof stored !== "object" || FIELDS.some(field => typeof (stored as Record<string,unknown>)[field.key] !== "number")) throw new Error("Los escenarios guardados deben contener solo números.");
    const { inputs } = validateInputs(stored);
    if (!inputs) throw new Error('Un escenario contiene supuestos inválidos.');
    ids.add(item.id);
    return { id:item.id, createdAt:item.createdAt, inputs };
  });
}
export function serializeScenarios(items:SavedScenario[]) {
  const text = JSON.stringify({version:1,items});
  parseScenarios(text);
  return text;
}
