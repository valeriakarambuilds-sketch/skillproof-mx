import { NextResponse } from "next/server";
import { z } from "zod";
import { GoogleGenAI } from "@google/genai";
import { clampScore, gradeCells, parseWorkbook } from "@/lib/assessment";
import { simulatedExplanation } from "@/lib/explanation";

export const runtime = "nodejs";
const explanationSchema = z.string().trim().min(50).max(1000);

async function scoreExplanation(text: string) {
  if (!process.env.GEMINI_API_KEY) return simulatedExplanation(text);
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const response = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
    contents: `Evalúa esta explicación financiera ficticia. Devuelve SOLO JSON con score (0-30), feedback breve y evidence (arreglo de frases). Criterios: interpretación 12, recomendación 10, claridad y límites 8. No evalúes estilo personal ni inventes datos. Texto: ${JSON.stringify(text)}`,
  });
  const raw = (response.text || "").replace(/```json|```/g, "").trim();
  const parsed = JSON.parse(raw);
  return { score: clampScore(Number(parsed.score), 30), feedback: String(parsed.feedback || ""), evidence: Array.isArray(parsed.evidence) ? parsed.evidence.map(String).slice(0, 5) : [], simulated: false };
}

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const file = form.get("file");
    const explanation = explanationSchema.parse(form.get("explanation"));
    if (!(file instanceof File)) return NextResponse.json({ error: "Selecciona tu archivo Excel." }, { status: 400 });
    if (!file.name.toLowerCase().endsWith(".xlsx")) return NextResponse.json({ error: "Solo aceptamos archivos .xlsx." }, { status: 400 });
    if (file.size > 2 * 1024 * 1024) return NextResponse.json({ error: "El archivo debe pesar menos de 2 MB." }, { status: 400 });
    const deterministic = gradeCells(parseWorkbook(await file.arrayBuffer()));
    let explanationResult;
    try { explanationResult = await scoreExplanation(explanation); }
    catch { explanationResult = { ...simulatedExplanation(explanation), feedback: "La IA no respondió; mostramos una evaluación simulada y conservamos la evidencia verificable del Excel." }; }
    const total = clampScore(deterministic.accuracy + deterministic.traceability + explanationResult.score, 100);
    return NextResponse.json({
      total,
      outcome: total >= 70 ? "Evidencia suficiente para avanzar" : "Todavía no hay evidencia suficiente",
      accuracy: deterministic.accuracy,
      traceability: deterministic.traceability,
      explanation: explanationResult,
      checks: deterministic.checks,
      nextStep: total >= 70 ? "Comparte este reporte con la persona reclutadora." : "Corrige las celdas señaladas y vuelve a intentarlo.",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No pudimos evaluar el archivo.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
