import Link from "next/link";
import { GitBranch, Layers } from "lucide-react";

const GITHUB_USERNAME =
  process.env.NEXT_PUBLIC_GITHUB_USERNAME?.trim() || "daniel-dev";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-surface-950/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-sm font-semibold tracking-tight text-slate-100 hover:text-accent-cyan transition-colors"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-accent-cyan">
            <Layers className="h-4 w-4" />
          </span>
          <span>Daniel · Systems &amp; Architecture</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
          <Link href="/#architectures" className="hover:text-white transition-colors">
            Arquitecturas
          </Link>
          <Link href="/#projects" className="hover:text-white transition-colors">
            Case Studies
          </Link>
          <Link href="/#standards" className="hover:text-white transition-colors">
            Estándares &amp; ADRs
          </Link>
        </nav>

        <a
          href={`https://github.com/${GITHUB_USERNAME}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-surface-900 px-3.5 py-1.5 text-xs font-medium text-slate-200 hover:border-cyan-500/50 hover:text-accent-cyan transition-colors"
        >
          <GitBranch className="h-3.5 w-3.5" />
          <span>GitHub Repos</span>
        </a>
      </div>
    </header>
  );
}
