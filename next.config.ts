import type { NextConfig } from "next"
import createMDX from "@next/mdx"

const nextConfig: NextConfig = {
  // Lets a page.mdx file act as a route. Imported .mdx files work without it.
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
}

const withMDX = createMDX({
  // Under Turbopack, give remark and rehype plugins as strings, for example
  // options: { remarkPlugins: ["remark-gfm"] }
})

export default withMDX(nextConfig)
