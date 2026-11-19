import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import ProjectStudio from "@/components/ProjectStudio";
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
    title: `${project.name} — ${project.everydayName}`,
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
      <main>
        <ProjectStudio project={project} allProjects={PROJECTS} mode="page" />
      </main>
    </>
  );
}
