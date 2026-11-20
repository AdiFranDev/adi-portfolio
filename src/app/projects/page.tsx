import Link from "next/link"
import { getAllProjects } from "@/lib/content"

export default async function ProjectsPage() {
  const projects = await getAllProjects()
  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-4xl font-bold tracking-tight">Projects</h1>
      <ul className="mt-8 space-y-6">
        {projects.map(({ slug, metadata }) => (
          <li key={slug}>
            <Link href={`/projects/${slug}`} className="text-xl font-semibold hover:underline">
              {metadata.title}
            </Link>
            <p className="text-muted-foreground">{metadata.summary}</p>
          </li>
        ))}
      </ul>
    </main>
  )
}
