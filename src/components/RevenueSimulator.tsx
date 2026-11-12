'use client';
import { useEffect, useState } from 'react';
import { calculateScenario, DEFAULTS, FIELDS, parseScenarios, SCENARIO_KEY, serializeScenarios, toDraft, validateInputs, type PricingDraft, type SavedScenario } from '@/lib/pricing';
const money = (n:number) => new Intl.NumberFormat('es-MX',{style:'currency',currency:'MXN',maximumFractionDigits:2}).format(n);
const count = (n:number) => new Intl.NumberFormat('es-MX',{maximumFractionDigits:2}).format(n);
export default function RevenueSimulator() {
 const [draft,setDraft]=useState<PricingDraft>(()=>toDraft(DEFAULTS));
 const [saved,setSaved]=useState<SavedScenario[]>([]);
 const [message,setMessage]=useState('');
 const [storageError,setStorageError]=useState('');
 const [ready,setReady]=useState(false);
 useEffect(()=>{
  try { setSaved(parseScenarios(window.localStorage.getItem(SCENARIO_KEY))); }
  catch { setStorageError('No pudimos leer los escenarios de este navegador. Puedes borrar solo estos escenarios para empezar de nuevo.'); }
  setReady(true);
 },[]);
 const {inputs,errors}=validateInputs(draft);
 const result=inputs?calculateScenario(inputs):null;
 function save() {
  if(!inputs)return;
  try {
   const previous=parseScenarios(window.localStorage.getItem(SCENARIO_KEY));
   if(previous.length>=10){setMessage('Ya tienes 10 escenarios. Elimina uno antes de guardar otro.');return;}
   const next=[...previous,{id:crypto.randomUUID(),createdAt:new Date().toISOString(),inputs}];
   window.localStorage.setItem(SCENARIO_KEY,serializeScenarios(next));
   setSaved(next);setStorageError('');setMessage('Escenario guardado solo en este navegador. Puedes recargar y cargarlo de nuevo.');
  } catch {setStorageError('No se guardó el escenario. El almacenamiento puede estar bloqueado, lleno o contener datos dañados.');setMessage('');}
 }
 function remove(id:string) {
  try {
   const next=parseScenarios(window.localStorage.getItem(SCENARIO_KEY)).filter(item=>item.id!==id);
   window.localStorage.setItem(SCENARIO_KEY,serializeScenarios(next));setSaved(next);setMessage('Escenario eliminado de este navegador.');
  }catch{setStorageError('No se pudo eliminar el escenario.');}
 }
 function resetStorage() {
  try {window.localStorage.removeItem(SCENARIO_KEY);setSaved([]);setStorageError('');setMessage('Se borraron los escenarios locales. Tus reportes privados no se modificaron.');}
  catch{setStorageError('Tu navegador no permite modificar el almacenamiento local.');}
 }
 return <section id="simulador" className="pricing-section" aria-labelledby="sim-title">
  <div className="pricing-section-title"><div><p className="eyebrow">EXPLORA LOS SUPUESTOS</p><h2 id="sim-title">Simulador de ingresos</h2></div><span className="pricing-tag warning">Escenario, no pronóstico</span></div>
  <p>La unidad de venta es una <b>vacante</b>. No hay suscripción automática. Todos los valores iniciales son supuestos ilustrativos; no representan ventas, tarifas verificadas ni ahorro medido.</p>
  <div className="sim-layout"><div>
   <div className="sim-inputs">{FIELDS.map(field=><div className="sim-field" key={field.key}>
    <label htmlFor={`sim-${field.key}`}>{field.label} <span>({field.unit})</span></label>
    <input id={`sim-${field.key}`} type="number" inputMode="decimal" min={0} max={field.max} step={field.integer?1:'any'} value={draft[field.key]} onChange={event=>{setDraft({...draft,[field.key]:event.target.value});setMessage('');}} aria-invalid={!!errors[field.key]} aria-describedby={`hint-${field.key}${errors[field.key]?` error-${field.key}`:''}`} />
    <small id={`hint-${field.key}`}>{field.hint}</small>
    {errors[field.key]&&<small className="sim-error" id={`error-${field.key}`}>{errors[field.key]}</small>}
   </div>)}</div>
   <div className="pricing-actions"><button type="button" onClick={save} disabled={!inputs||!ready||!!storageError}>Guardar escenario</button><button type="button" className="secondary" onClick={()=>{setDraft(toDraft(DEFAULTS));setMessage('Supuestos iniciales restaurados.');}}>Restablecer supuestos</button></div>
   <p className="pricing-caption">Guardamos únicamente números y fecha, sin nombres ni datos de candidatos. Solo en este navegador y dispositivo; no se sincroniza con tu cuenta. Borrar los datos del navegador elimina estos escenarios.</p>
  </div><div className="sim-results" aria-live="polite" aria-atomic="true">
   {result?<>
    <div className="sim-total"><span>Ingreso bruto mensual</span><strong>{money(result.monthly)}</strong><small>Antes de costos e impuestos aplicables.</small></div>
    <div className="sim-stat"><span>Ingreso bruto anualizado</span><b>{money(result.annualized)}</b></div>
    <p className="pricing-caption">Mensual × 12, suponiendo el mismo mes todo el año. No es un pronóstico de retención ni un ingreso observado.</p>
    <dl className="sim-details"><div><dt>Empresas pagadoras esperadas</dt><dd>{count(result.buyers)}</dd></div><div><dt>Vacantes esperadas al mes</dt><dd>{count(result.vacancies)}</dd></div><div><dt>Costo variable por vacante</dt><dd>{money(result.unitCost)}</dd></div><div><dt>Costo variable mensual</dt><dd>{money(result.variableCost)}</dd></div><div><dt>Contribución antes de gastos fijos</dt><dd>{money(result.contribution)}</dd></div><div><dt>Margen de contribución</dt><dd>{result.margin===null?'No aplica (sin ingreso)':`${count(result.margin)}%`}</dd></div><div><dt>Saldo después de gastos fijos</dt><dd>{money(result.afterFixed)}</dd></div></dl>
    {result.afterFixed<0&&<p className="pricing-alert">Con estos supuestos, el servicio no cubre los costos incluidos. Revisa alcance, esfuerzo humano y precio.</p>}
    <p className="pricing-caption">Contribución no equivale a utilidad neta. Impuestos, tarifas reales y otros gastos no están validados. Los volúmenes fraccionarios son valores esperados de un escenario, no ventas parciales.</p>
   </>:<p className="pricing-alert" role="status">Corrige los campos señalados para calcular. No mostramos resultados ni permitimos guardar con datos inválidos.</p>}
  </div></div>
  <details className="sim-formula"><summary>Ver fórmulas y límites</summary><p>Empresas pagadoras = empresas potenciales × conversión / 100.<br/>Vacantes mensuales = empresas pagadoras × vacantes por empresa al mes.<br/>Ingreso bruto = vacantes mensuales × precio por vacante.<br/>Costo variable unitario = procesamiento + infraestructura + minutos humanos / 60 × costo por hora + adaptación.<br/>Contribución mensual = ingreso bruto − vacantes mensuales × costo variable unitario.<br/>Saldo tras gastos fijos = contribución − gastos fijos.</p><p>Esta calculadora estima ingresos del servicio. El memo compara costos para el empleador: son cálculos distintos.</p></details>
  <div className="saved-scenarios"><h3>Escenarios guardados en este navegador</h3>
   {!ready?<p>Cargando escenarios locales…</p>:!saved.length?<p>No hay escenarios guardados.</p>:<ul>{saved.map((item,index)=><li key={item.id}><div><b>Escenario {index+1}</b><small>{new Date(item.createdAt).toLocaleString('es-MX')} · precio {money(item.inputs.price)} por vacante · {count(item.inputs.conversion)}% conversión</small></div><div className="pricing-actions"><button type="button" className="secondary" onClick={()=>{setDraft(toDraft(item.inputs));setMessage(`Escenario ${index+1} cargado.`);}}>Cargar escenario {index+1}</button><button type="button" className="secondary" onClick={()=>remove(item.id)}>Eliminar escenario {index+1}</button></div></li>)}</ul>}
   {storageError&&<div className="pricing-alert" role="alert"><p>{storageError}</p><button type="button" className="secondary" onClick={resetStorage}>Borrar solo escenarios locales</button></div>}
   {message&&<p className="sim-message" role="status">{message}</p>}
  </div>
 </section>;
}
