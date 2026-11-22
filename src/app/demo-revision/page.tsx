import type { Metadata } from "next";
import styles from "./review.module.css";

export const metadata: Metadata = {
  title: "Comparar fórmulas de EBITDA | SkillProof MX",
  description: "Demo con tres archivos simulados para revisar cómo se calculó el mismo EBITDA.",
};

const cases = [
  {
    title: "Valor pegado",
    file: "01_valor_pegado.xlsx",
    status: "Revisar en Excel",
    steps: ["Resultados!B8 → 1600000"],
    explanation: "Abre Resultados!B8 en Excel y revisa la barra de fórmulas. La celda contiene un importe fijo y no muestra de dónde sale.",
  },
  {
    title: "Fórmula directa",
    file: "02_formula_directa.xlsx",
    status: "Fórmula trazable",
    steps: ["Resultados!B8 → =B4-B5-B6"],
    explanation: "En Resultados, B4 contiene ventas, B5 costo de ventas y B6 gastos de operación.",
  },
  {
    title: "Fórmula con hoja intermedia",
    file: "03_hoja_intermedia.xlsx",
    status: "Fórmula trazable",
    steps: [
      "Resultados!B8 → =Calculos!B4-B6",
      "Calculos!B4 → =Resultados!B4-Resultados!B5",
    ],
    explanation: "Calculos!B4 determina la utilidad bruta. Resultados!B8 resta los gastos de operación de Resultados!B6.",
  },
] as const;

export default function ReviewerDemo() {
  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.brand}>SkillProof MX</div>
        <p className={styles.tag}>Ejemplo simulado</p>
        <h1>Mismo EBITDA, tres métodos</h1>
        <p className={styles.lead}>
          Ya recibiste los casos de Excel para una vacante de analista. Abre el
          rastro de cada archivo para ver de dónde sale el mismo EBITDA.
        </p>

        <section className={styles.comparison} aria-label="Comparación de archivos">
          {cases.map((item) => (
            <article className={styles.card} key={item.file}>
              <p className={styles.filename}>{item.file}</p>
              <h2>{item.title}</h2>
              <p className={styles.amount}>$1,600,000 <small>MXN</small></p>
              <p className={item.status === "Revisar en Excel" ? styles.review : styles.valid}>
                {item.status}
              </p>
              <details>
                <summary>Ver evidencia de la celda</summary>
                <ul className={styles.trail}>
                  {item.steps.map((step) => <li key={step}><code>{step}</code></li>)}
                </ul>
                <p>{item.explanation}</p>
              </details>
            </article>
          ))}
        </section>

        <p className={styles.note}>
          Las dos fórmulas válidas reciben el mismo trato. El aviso de revisión
          deja el puntaje y la elegibilidad como estaban mientras el revisor
          comprueba la celda en Excel.
        </p>

        <section className={styles.practice} aria-labelledby="practice-title">
          <h2 id="practice-title">Practica la revisión</h2>
          <p>¿Qué celda abrirías para comprobar la utilidad bruta del tercer archivo?</p>
          <details>
            <summary>Comprobar mi respuesta</summary>
            <p><code>Calculos!B4</code>. Ahí puedes rastrear las ventas y el costo de ventas hasta la hoja <code>Resultados</code>.</p>
          </details>
          <p className={styles.followup}>
            Si recibiste esta demo por correo y quieres una prueba guiada,
            responde al mismo mensaje con «Me interesa». Evita adjuntar archivos de candidatos.
          </p>
        </section>
      </div>
    </main>
  );
}
