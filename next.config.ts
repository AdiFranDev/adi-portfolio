import type { NextConfig } from "next"
import createMDX from "@next/mdx"

// Every asset is served from this site, so the policy only allows 'self'.
// 'unsafe-inline' scripts are needed for the intro and theme scripts in <head> and
// Next's inline page data; a nonce would force every page to render per request.
// Dev also needs eval and the hot-reload websocket.
const isDev = process.env.NODE_ENV === "development"
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  `connect-src 'self'${isDev ? " ws:" : ""}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ")

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
]

const nextConfig: NextConfig = {
  // Lets a page.mdx file act as a route. Imported .mdx files work without it.
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }]
  },
}

const withMDX = createMDX({
  // Under Turbopack, give remark and rehype plugins as strings, for example
  // options: { remarkPlugins: ["remark-gfm"] }
})

export default withMDX(nextConfig)
