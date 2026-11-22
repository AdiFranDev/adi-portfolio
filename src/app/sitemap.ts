import type { MetadataRoute } from "next"

// The site is one page. Add project pages here once they have real case studies.
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: "https://francisadrian.dev/", changeFrequency: "monthly", priority: 1 }]
}
