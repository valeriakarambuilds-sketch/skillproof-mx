import { NextResponse } from "next/server";
import { z } from "zod";
import { GoogleGenAI } from "@google/genai";
import { clampScore, gradeCells, parseWorkbook } from "@/lib/assessment";
import { authenticatedClient } from "@/lib/supabase-server";
import { simulatedExplanation } from "@/lib/explanation";

export const runtime = "nodejs";
const explanationSchema = z.string().trim().min(50).max(1000);

async function scoreExplanation(text: string) {
  if (!process.env.GEMINI_API_KEY) return simulatedExplanation(text);
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const response = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL || "gemini-3.8-flash",
    contents: `Evalúa esta explicación financiera ficticia. Criterios: interpretación 18, recomendación 12, claridad y límites 10. No evalúes estilo personal ni inventes datos. Texto: ${JSON.stringify(text)}`,
    config: {
      responseMimeType: "application/json",
      responseJsonSchema: {
        type: "object",
        properties: {
          score: { type: "number", minimum: 0, maximum: 40 },
          feedback: { type: "string" },
          evidence: { type: "array", items: { type: "string" } },
        },
        required: ["score", "feedback", "evidence"],
      },
    },
  });
  const raw = (response.text || "").trim();
  const parsed = JSON.parse(raw);
  return { score: clampScore(Number(parsed.score), 40), feedback: String(parsed.feedback || ""), evidence: Array.isArray(parsed.evidence) ? parsed.evidence.map(String).slice(0, 5) : [], simulated: false };
}

export async function POST(request: Request) {
  try {
    const auth=await authenticatedClient(request);
    const length=Number(request.headers.get("content-length") || 0);
    if(length>2*1024*1024+10000)return NextResponse.json({error:"La solicitud excede el límite."},{status:413});
    const form = await request.formData();
    const file = form.get("file");
    const explanation = explanationSchema.parse(form.get("explanation"));
    if (!(file instanceof File)) return NextResponse.json({ error: "Selecciona tu archivo Excel." }, { status: 400 });
    if (!file.name.toLowerCase().endsWith(".xlsx")) return NextResponse.json({ error: "Solo aceptamos archivos .xlsx." }, { status: 400 });
    if (file.size > 2 * 1024 * 1024) return NextResponse.json({ error: "El archivo debe pesar menos de 2 MB." }, { status: 400 });
    const deterministic = gradeCells(parseWorkbook(await file.arrayBuffer()));
    let explanationResult;
    try { explanationResult = await scoreExplanation(explanation); }
    catch (error) {
      console.error("Gemini scoring failed", error instanceof Error ? error.message : "Unknown error");
      explanationResult = { ...simulatedExplanation(explanation), feedback: "La IA no respondió; mostramos una evaluación simulada y conservamos la evidencia verificable del Excel." };
    }
    const total = clampScore(deterministic.accuracy + deterministic.traceability + explanationResult.score, 100);
    const payload = {
      total,
      outcome: "Reporte de evidencia de esta tarea",
      accuracy: deterministic.accuracy,
      traceability: deterministic.traceability,
      explanation: explanationResult,
      checks: deterministic.checks,
      nextStep: "Inspecciona los hallazgos pendientes o contradictorios. La interpretación y la decisión final son humanas.",
      limitations:"Verificado significa cálculo y referencias compatibles con esta plantilla; no acredita autoría, capacidad general ni contratación.",
      simulationOnly:explanationResult.simulated,
    };
    if(auth){
      const {data,error}=await auth.client.from("skillproof_reports").insert({user_id:auth.user.id,payload}).select("id").single();
      if(error)return NextResponse.json({...payload,saved:false,saveError:"El reporte se calculó, pero no se pudo guardar. Descárgalo y revisa la configuración de Supabase."});
      return NextResponse.json({...payload,saved:true,reportId:data.id},{headers:{"Cache-Control":"no-store"}});
    }
    return NextResponse.json({...payload,saved:false,demo:true},{headers:{"Cache-Control":"no-store"}});
  } catch (error) {
    const message = error instanceof z.ZodError ? "La explicación debe tener entre 50 y 1000 caracteres." : error instanceof Error ? error.message : "No pudimos evaluar el archivo.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
