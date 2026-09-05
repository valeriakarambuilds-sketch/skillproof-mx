import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "SkillProof MX", description: "Evidencia transparente de habilidades de Excel" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}
