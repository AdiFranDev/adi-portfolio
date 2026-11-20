import type { MDXComponents } from "mdx/types"

const components: MDXComponents = {
  h1: (props) => <h1 className="mt-10 text-3xl font-bold tracking-tight" {...props} />,
  h2: (props) => <h2 className="mt-8 text-2xl font-semibold tracking-tight" {...props} />,
  p: (props) => <p className="mt-4 leading-7" {...props} />,
  a: (props) => <a className="font-medium underline underline-offset-4" {...props} />,
  ul: (props) => <ul className="mt-4 ml-6 list-disc" {...props} />,
  code: (props) => <code className="rounded bg-muted px-1 py-0.5 font-mono text-sm" {...props} />,
}

export function useMDXComponents(): MDXComponents {
  return components
}
