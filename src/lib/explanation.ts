export type ExplanationResult = { score: number; feedback: string; evidence: string[]; simulated: boolean };

const terms = ["ingresos", "margen", "ebitda", "rentabilidad", "crecimiento", "costos", "utilidad"];

export function simulatedExplanation(text: string): ExplanationResult {
  const lower = text.toLowerCase();
  const found = terms.filter((term) => lower.includes(term));
  const score = Math.min(40, 10 + found.length * 4 + (text.length >= 180 ? 4 : 0));
  return {
    score,
    feedback: "Demostración: estos puntos se calculan con palabras clave y longitud del texto. No se ha evaluado la calidad de tu argumento ni si ya incluiste cifras y limitaciones. Una persona debe revisar tu explicación.",
    evidence: found.length ? found.map((term) => `Menciona “${term}”`) : ["No se detectaron indicadores financieros clave"],
    simulated: true,
  };
}
