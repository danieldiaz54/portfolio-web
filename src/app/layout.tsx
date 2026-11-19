import type { Metadata } from "next";
import type { ReactNode } from "react";
import {
  Albert_Sans,
  Archivo,
  Bitter,
  Bodoni_Moda,
  Bricolage_Grotesque,
  Hanken_Grotesk,
  JetBrains_Mono,
  Sora,
  Source_Serif_4,
} from "next/font/google";
import "./globals.css";

const archivo = Archivo({ subsets: ["latin"], variable: "--font-archivo", display: "swap" });
const hanken = Hanken_Grotesk({ subsets: ["latin"], variable: "--font-hanken", display: "swap" });
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});
const bodoni = Bodoni_Moda({ subsets: ["latin"], variable: "--font-bodoni", display: "swap" });
const sora = Sora({ subsets: ["latin"], variable: "--font-sora", display: "swap" });
const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif",
  display: "swap",
});
const albert = Albert_Sans({ subsets: ["latin"], variable: "--font-albert", display: "swap" });
const bitter = Bitter({ subsets: ["latin"], variable: "--font-bitter", display: "swap" });

const fontVariables = [
  archivo,
  hanken,
  jetbrains,
  bricolage,
  bodoni,
  sora,
  sourceSerif,
  albert,
  bitter,
]
  .map((font) => font.variable)
  .join(" ");

export const metadata: Metadata = {
  title: "Daniel Díaz — Exposición de ingeniería: seis productos, seis arquitecturas",
  description:
    "Portafolio de ingeniería de software: seis productos en vivo, cada uno con su propia arquitectura, identidad visual y ficha de decisiones técnicas.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className={fontVariables}>
      <body>{children}</body>
    </html>
  );
}
