import fs from "node:fs"
import path from "node:path"
import type { MDXContent } from "mdx/types"

export type ProjectMeta = {
  title: string
  summary: string
  date: string
  tags?: string[]
}

const projectsDir = path.join(process.cwd(), "content", "projects")

export function getProjectSlugs(): string[] {
  return fs
    .readdirSync(projectsDir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""))
}

export async function getProject(slug: string) {
  const mod = (await import(`@content/projects/${slug}.mdx`)) as {
    default: MDXContent
    metadata: ProjectMeta
  }
  return { slug, Content: mod.default, metadata: mod.metadata }
}

export async function getAllProjects() {
  const projects = await Promise.all(getProjectSlugs().map(getProject))
  return projects.sort((a, b) => b.metadata.date.localeCompare(a.metadata.date))
}
