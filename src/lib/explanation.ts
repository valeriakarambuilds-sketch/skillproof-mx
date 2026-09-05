export type ExplanationResult = { score: number; feedback: string; evidence: string[]; simulated: boolean };

const terms = ["ingresos", "margen", "ebitda", "rentabilidad", "crecimiento", "costos", "utilidad"];

export function simulatedExplanation(text: string): ExplanationResult {
  const lower = text.toLowerCase();
  const found = terms.filter((term) => lower.includes(term));
  const score = Math.min(30, 8 + found.length * 3 + (text.length >= 180 ? 4 : 0));
  return {
    score,
    feedback: found.length >= 3
      ? "Relacionas varios indicadores con una recomendación. Agrega una cifra concreta y una limitación para fortalecer tu argumento."
      : "Nombra los indicadores que sostienen tu recomendación y explica qué riesgo o límite observas.",
    evidence: found.length ? found.map((term) => `Menciona “${term}”`) : ["No se detectaron indicadores financieros clave"],
    simulated: true,
  };
}
