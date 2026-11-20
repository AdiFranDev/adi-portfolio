import { getProject, getProjectSlugs } from "@/lib/content"

export const dynamicParams = false

export function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }))
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const { Content, metadata } = await getProject(slug)

  return (
    <article className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-4xl font-bold tracking-tight">{metadata.title}</h1>
      <p className="mt-2 text-muted-foreground">{metadata.summary}</p>
      <Content />
    </article>
  )
}
