"use client";

import { FormEvent, useState, useEffect } from "react";

import PilotLog, { emitPilotEvent } from "@/components/PilotLog";
import { supabase } from "@/lib/supabase-browser";

type Result = {
  saved?:boolean; demo?:boolean; saveError?:string; reportId?:string;
  total: number | null; reviewStatus?: string; numericalSubtotal?: number; outcome: string; accuracy: number; traceability: number;
  explanation: { score: number; feedback: string; evidence: string[]; simulated: boolean };
  checks: { label: string; earned: number; possible: number; evidence: string; address:string; formula?:string; expected:number; actual?:number; status:string }[];
  nextStep: string;
};

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [explanation, setExplanation] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [review, setReview] = useState(false);
  const [authError,setAuthError]=useState("");
  const [token,setToken]=useState("");
  const [ready,setReady]=useState(!supabase);
  useEffect(()=>{
    if(!supabase)return;
    const client=supabase;
    client.auth.getSession().then(({data})=>{setToken(data.session?.access_token||"");setReady(true);});
    const {data}=client.auth.onAuthStateChange((_event,session)=>{setToken(session?.access_token||"");if(!session){setResult(null);setExplanation("");setFile(null);}});
    return ()=>data.subscription.unsubscribe();
  },[]);
  async function login(){
    if(!supabase)return;
    setAuthError("");
    try {
      const response=await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/settings`,{headers:{apikey:process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY||""}});
      if(!response.ok)throw new Error("No se pudo comprobar el inicio de sesión. Intenta de nuevo.");
      const settings=await response.json();
      if(!settings.external?.google){setAuthError("El acceso con Google aún no está habilitado. No se envió tu archivo ni se creó una evaluación. Puedes revisar la tarea mientras se activa el acceso.");return;}
      const {error}=await supabase.auth.signInWithOAuth({provider:"google",options:{redirectTo:window.location.origin}});
      if(error)throw new Error("No se pudo iniciar sesión con Google. Intenta de nuevo.");
    }catch(caught){setAuthError(caught instanceof Error?caught.message:"No se pudo iniciar sesión con Google.");}
  }
  async function restore(){
    setError("");
    try{const response=await fetch("/api/reports",{headers:{Authorization:`Bearer ${token}`},cache:"no-store"});const data=await response.json();if(!response.ok)throw new Error(data.error);if(data.report){setResult({...data.report.payload,total:null,reviewStatus:"pending_human_review",outcome:"Resultado provisional · revisión humana pendiente",saved:true,reportId:data.report.id});emitPilotEvent("report_opened");}else setError("Aún no tienes un reporte guardado.");}
    catch(caught){setError(caught instanceof Error?caught.message:"No se pudo recuperar el reporte.");}
  }
  function download(){
    if(!result)return;
    const url=URL.createObjectURL(new Blob([JSON.stringify({venture:"SkillProof MX",fictionalData:true,...result,total:null,reviewStatus:"pending_human_review"},null,2)],{type:"application/json"}));
    const link=document.createElement("a");link.href=url;link.download="SkillProof_MX_reporte.json";link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }

  async function submit(event: FormEvent) {
    event.preventDefault(); setError(""); setResult(null);
    if(supabase && !token)return setError("Inicia sesión con Google antes de evaluar.");
    if (!file) return setError("Selecciona tu archivo Excel.");
    setLoading(true);
    const body = new FormData(); body.append("file", file); body.append("explanation", explanation);
    try {
      const response = await fetch("/api/evaluate", { method: "POST", body, headers:token?{Authorization:`Bearer ${token}`}:{}});
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "No pudimos evaluar tu evidencia.");
      setResult(data);
      emitPilotEvent("evaluation_completed");
      emitPilotEvent("report_opened");
    } catch (caught) { emitPilotEvent("submission_rejected"); setError(caught instanceof Error ? caught.message : "Ocurrió un error."); }
    finally { setLoading(false); }
  }

  return (
    <main>
      <aside>
        <div className="brand"><span>SP</span><div><b>SkillProof MX</b><small>Prueba, no promesas</small></div></div>
        <nav aria-label="Progreso">
          <div className="step done"><i>1</i><span>Conoce la prueba<small>Datos ficticios</small></span></div>
          <div className="step active"><i>2</i><span>Entrega evidencia<small>Excel + explicación</small></span></div>
          <div className="step"><i>3</i><span>Lee tu resultado<small>Puntaje trazable</small></span></div>
        </nav>
        <div className="privacy"><b>🔒 Tu archivo es temporal</b><p>El archivo no se guarda. Con sesión, tu reporte se guarda de forma privada en tu cuenta.</p></div>
      </aside>

      <section className="content">
        <header><div><p className="eyebrow">PRUEBA DE HABILIDAD · ANALISTA FINANCIERO JR.</p><h1>Demuestra cómo trabajas con Excel</h1><p className="lead">Completa una tarea breve con datos inventados. Verás qué comprobamos, la evidencia encontrada y tu siguiente paso.</p></div><span className="time">⏱ 20–30 min</span></header>

        <div className="authbar rounded-xl border border-slate-200 bg-white p-4">
         {!ready?<p>Comprobando sesión…</p>:!supabase?<p><b>DEMO · DATOS FICTICIOS.</b> Supabase no está configurado: sin inicio de sesión ni guardado.</p>:token?<><p>Sesión activa · reportes privados</p><button type="button" onClick={restore}>Recuperar mi último reporte</button><button type="button" className="secondary" onClick={()=>supabase?.auth.signOut()}>Cerrar sesión</button></>:<><p>Inicia sesión para guardar y recuperar tu evidencia.</p><button type="button" onClick={login}>Continuar con Google</button></>}
        </div>
        {authError && <p className="error" role="alert">{authError}</p>}
        <PilotLog />
        <section className="notice"><b>Esta no es una clase ni un examen escolar.</b><span> No te explicaremos finanzas: evaluaremos evidencia concreta de tu trabajo.</span></section>

        <div className="grid">
          <section className="card task">
            <p className="number">PASO 1</p><h2>Descarga y completa la tarea</h2>
            <p>Calcula crecimiento, utilidad bruta, EBITDA y márgenes en las celdas azules. Conserva tus fórmulas.</p>
            <a className="download" href="/SkillProof_MX_Assessment.xlsx" onClick={() => emitPilotEvent("template_downloaded")} download>↓ Descargar plantilla Excel</a>
            <details><summary>Ver instrucciones completas</summary><ol><li>No cambies el nombre de la hoja “Assessment”.</li><li>B11: crecimiento de ingresos de 2025 a 2026.</li><li>B12–B15: utilidad bruta y margen bruto de cada año.</li><li>B16–B19: EBITDA y margen EBITDA de cada año.</li><li>B20: cambio del margen EBITDA de 2025 a 2026.</li><li>Escribe fórmulas en B11:B20 y guarda el archivo como .xlsx.</li></ol><p><b>Aceptamos fórmulas equivalentes:</b> comprobamos operaciones con +, −, ×, ÷, paréntesis, porcentajes y referencias de esta hoja. Funciones como SUMA, referencias externas u otras fórmulas quedan pendientes de revisión; no se penalizan como error demostrado.</p></details>
          </section>

          <section className="card rubric">
            <p className="number">ANTES DE EMPEZAR</p><h2>Así se calcula tu resultado</h2>
            <div><span>Exactitud de resultados</span><b>35 pts</b></div><div><span>Fórmulas trazables</span><b>25 pts</b></div><div><span>Interpretación y recomendación</span><b>30 pts</b></div><div><span>Claridad y límites</span><b>10 pts</b></div>
            <p className="threshold"><b>70 puntos</b> = referencia de rúbrica; requiere revisión humana completa</p>
          </section>
        </div>

        <form className="card upload" onSubmit={submit}>
          <p className="number">PASO 2</p><h2>Entrega tu evidencia</h2>
          <label className="filebox"><input type="file" accept=".xlsx" onChange={(event) => setFile(event.target.files?.[0] || null)} /><span className="fileicon">X</span><span><b>{file ? file.name : "Selecciona tu archivo .xlsx"}</b><small>{file ? `${(file.size / 1024).toFixed(0)} KB · listo para evaluar` : "Máximo 2 MB. No aceptamos datos personales reales."}</small></span></label>
          <p className="uploadhelp">Puedes seleccionar otro archivo antes de evaluar y repetir la prueba después de ver tu resultado.</p>
          <label htmlFor="explanation"><b>Explica tu recomendación en 3–6 oraciones</b><small>¿Qué cambió entre 2025 y 2026? ¿Qué harías? Menciona una limitación de los datos, del periodo analizado o de algún supuesto.</small></label>
          <textarea id="explanation" minLength={50} maxLength={1000} required value={explanation} onChange={(event) => setExplanation(event.target.value)} placeholder="Ejemplo: Aunque los ingresos…, el margen… Por eso recomiendo… Esta conclusión está limitada por…" />
          <div className="formfoot"><span>{explanation.length}/1000 caracteres</span><button disabled={loading || !ready || Boolean(supabase && !token)}>{loading ? "Evaluando…" : "Evaluar mi evidencia →"}</button></div>
          {error && <p className="error" role="alert">{error}</p>}
        </form>

        {result && <section className="results" aria-live="polite">
          <p className="notice"><b>Resultado provisional: falta revisión humana del razonamiento y de las fórmulas pendientes.</b> Puedes corregir las celdas y volver a enviar tu Excel. Pendiente significa que falta comprobación; no hay una revisión solicitada automáticamente.</p><div className="resulthead"><div className="score"><b>{result.accuracy + result.traceability}</b><span>/60 · cálculo</span></div><div><p className="eyebrow">RESULTADO</p><h2>{result.outcome}</h2><p>{result.checks.every(check => check.status === "verificado") ? "Tus cálculos y referencias están verificados. Consulta abajo el alcance de la evaluación de tu explicación." : result.nextStep}</p></div></div>
          {result.explanation.simulated && <p className="simulated">🎭 Evaluación simulada: {result.accuracy + result.traceability}/60 puntos provienen de los cálculos y sus referencias; {result.explanation.score}/40 son simulados mediante palabras clave y longitud. Los puntos simulados no se suman a una calificación final. No se ha revisado tu razonamiento.</p>}
          <div className="breakdown"><div><span>Exactitud</span><b>{result.accuracy}/35</b></div><div><span>Trazabilidad</span><b>{result.traceability}/25</b></div><div><span>Explicación · orientativa</span><b>{result.explanation.score}/40</b></div></div>
          <p>Verificado = cálculo y referencias comprobados en esta plantilla. Pendiente = falta evidencia o la fórmula requiere revisión. Contradictorio = el cálculo no coincide.</p>
          {result.saved?<p className="saved">Reporte guardado de forma privada. Puedes recuperarlo después de recargar.</p>:<p className="simulated">{result.saveError || "Este reporte no está guardado. Descárgalo para conservarlo."}</p>}
          <div className="feedback"><b>Sobre tu explicación</b><p>{result.explanation.simulated ? "Demostración con palabras clave y longitud; no se ha evaluado la calidad de tu argumento. La revisión de cifras, recomendaciones y limitaciones corresponde a una persona." : result.explanation.feedback}</p></div>
          <p>Puedes corregir el Excel y la explicación del formulario. Cada evaluación guardada crea un reporte privado nuevo; recuperar tu último reporte muestra el más reciente. Los anteriores se conservan. Este prototipo no envía reportes automáticamente a empresas.</p>
          <h3>Evidencia que encontramos</h3>
          <ul className="checks">{result.checks.map((check) => <li key={check.label}><span>{check.earned === check.possible ? "✓" : "!"}</span><div><b>{check.label}</b><span className="evidence-state">{check.status}</span><small>{check.evidence}</small><code>{check.address} · {check.formula || "Sin fórmula"}</code><small>Esperado: {check.expected} · Recalculado/valor: {check.actual ?? "Pendiente"}</small></div><strong>{check.earned}/{check.possible}</strong></li>)}</ul>
          <div className="limits"><b>Lo que esta prueba NO mide</b><p>No mide tu potencial, personalidad, contexto familiar, velocidad ni valor profesional. Solo presenta evidencia sobre esta tarea delimitada.</p></div>
          <div className="actions"><button type="button" className="secondary" onClick={download}>Descargar reporte JSON</button><button className="secondary" onClick={() => setReview(true)}>Solicitar revisión humana</button><button onClick={() => { emitPilotEvent("retry_started"); setResult(null); scrollTo({ top: 0, behavior: "smooth" }); }}>Corregir Excel o explicación y reintentar</button></div>
        </section>}
      </section>

      {review && <div className="modal" role="dialog" aria-modal="true"><div><button className="close" onClick={() => setReview(false)}>×</button><p className="number">REVISIÓN GRATUITA</p><h2>Cómo pedir una revisión humana</h2><p>Este prototipo no envía solicitudes ni tiene una persona revisora asignada. No se ha solicitado ninguna revisión.</p><p>Descarga el reporte y compártelo con la persona responsable de la evaluación por el canal que acuerden. No hay plazo de respuesta garantizado.</p><button onClick={() => setReview(false)}>Entendido</button></div></div>}
    </main>
  );
}
