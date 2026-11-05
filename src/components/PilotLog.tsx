"use client";

import { FormEvent, useEffect, useState } from "react";
import { cleanFeedback, eventNames, PilotEvent, PilotEventName, pilotEvent } from "@/lib/pilot-log";

export function emitPilotEvent(event: PilotEventName) {
  window.dispatchEvent(new CustomEvent("skillproof-pilot", { detail: event }));
}

export default function PilotLog() {
  const [enabled, setEnabled] = useState(false);
  const [events, setEvents] = useState<PilotEvent[]>([]);
  const [feedback, setFeedback] = useState("");
  const [savedFeedback, setSavedFeedback] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!enabled) return;
    const listener = (event: Event) => {
      const name = (event as CustomEvent).detail;
      if (!eventNames.includes(name)) return;
      setEvents(current => [...current.slice(-198), pilotEvent(name)]);
    };
    window.addEventListener("skillproof-pilot", listener);
    return () => window.removeEventListener("skillproof-pilot", listener);
  }, [enabled]);

  function submit(event: FormEvent) {
    event.preventDefault();
    try {
      setSavedFeedback(cleanFeedback(feedback));
      emitPilotEvent("feedback_submitted");
      setMessage("Comentario incluido en esta sesión. No se ha enviado a nadie: descarga el registro para conservarlo.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Revisa el comentario."); }
  }

  function download() {
    const data = { version: "week13-v1", build: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || "local", storage: "browser-memory-only", events, feedback: savedFeedback, limitations: "No prueba sesiones reales, identidad, éxito de tareas ni regreso. Compartir es una acción separada." };
    const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));
    const link = document.createElement("a"); link.href = url; link.download = "SkillProof_sesion_piloto.json"; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return <section className="card" aria-labelledby="pilot-title">
    <p className="number">PILOTO OPCIONAL</p><h2 id="pilot-title">Ayúdanos a mejorar la prueba</h2>
    <p>Si aceptas, registramos los pasos que hagas a partir de ahora en esta pestaña. El registro no incluye tu cuenta, archivo ni explicación financiera. Se pierde al recargar y no se envía a un servidor.</p>
    <label><input type="checkbox" checked={enabled} onChange={event => {
      setEnabled(event.target.checked); setMessage("");
      setEvents(event.target.checked ? [pilotEvent("task_started")] : []);
      setFeedback(""); setSavedFeedback("");
    }} /> Acepto activar el registro temporal de esta sesión</label>
    {enabled && <>
      <form onSubmit={submit}>
        <label htmlFor="pilot-feedback"><b>¿Qué te confundió o te impidió continuar?</b><small>No escribas nombres, contactos ni otros datos personales. Revisa el texto antes de compartirlo.</small></label>
        <textarea id="pilot-feedback" value={feedback} onChange={event => setFeedback(event.target.value)} minLength={5} maxLength={500} required />
        <button type="submit" className="secondary">Incluir comentario en el registro</button>
      </form>
      <p role="status">{message || `${events.length} eventos en esta sesión; no se han enviado.`}</p>
      <button type="button" onClick={download}>Descargar registro de sesión</button>
      <p>Si participas en la prueba observada, puedes compartir el archivo con Valeria por el canal que acuerden. Descargarlo no lo envía. Una descarga o un clic no demuestra que hayas completado la tarea ni que hayas regresado.</p>
    </>}
  </section>;
}
