import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = { title: "SkillProof MX", description: "Evidencia transparente de habilidades de Excel" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body><div className="site-bar"><Link className="site-brand" href="/">SP <span>SkillProof MX</span></Link><nav className="site-links" aria-label="Navegación principal"><Link href="/">Evaluación</Link><Link href="/pricing">Precios</Link><Link href="/about">Acerca de</Link></nav></div>{children}</body></html>;
}
