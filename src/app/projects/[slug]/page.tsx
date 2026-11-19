import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import CaseStudy from "@/components/CaseStudy";
import PreviewPlate from "@/components/PreviewPlate";
import { PROJECTS, getProjectBySlug } from "@/data/projects";

interface CasePageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams(): { slug: string }[] {
  return PROJECTS.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: CasePageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) {
    return { title: "Proyecto no encontrado" };
  }
  return {
    title: `${project.name} — ${project.everydayName} · Ficha de caso`,
    description: project.oneLiner,
  };
}

export default async function CasePage({ params }: CasePageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main className="shell case-page">
        <p className="mono">
          <Link href="/#exposicion" className="link-case">
            ← Volver a la exposición
          </Link>
        </p>
        <div className="exhibit-mount">
          <PreviewPlate project={project} />
        </div>
        <CaseStudy project={project} />
      </main>
    </>
  );
}
