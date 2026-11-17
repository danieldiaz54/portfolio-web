import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Daniel | Portafolio de Arquitectura e Ingeniería de Software",
  description:
    "Ecosistema de repositorios públicos con distintas arquitecturas de software: Tiempo Real, IA/RAG, Sistemas Distribuidos, Cloud GitOps y Mobile Offline-First.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-surface-950 text-slate-100 antialiased">
        <Navbar />
        <main>{children}</main>
        <footer className="border-t border-slate-800/80 bg-surface-950 py-10">
          <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-4 text-xs text-slate-400 sm:flex-row sm:items-center sm:px-6">
            <p>
              <span className="font-semibold text-slate-200">portfolio-web</span>{" "}
              · Hub de Case Studies y Arquitecturas de Software
            </p>
            <p className="font-mono">
              Next.js 15 · TypeScript · Tailwind CSS · Multi-Stage Docker
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
