import { defineConfig } from "@playwright/test"

const breakpoints = [
  { scheme: "light", width: 360 },
  { scheme: "light", width: 768 },
  { scheme: "light", width: 1024 },
  { scheme: "light", width: 1440 },
  { scheme: "dark", width: 360 },
  { scheme: "dark", width: 1440 },
] as const

export default defineConfig({
  testDir: "tests/e2e",
  use: { baseURL: "http://localhost:3000" },
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    // First Turbopack compile can be slow.
    timeout: 120_000,
  },
  projects: breakpoints.map(({ scheme, width }) => ({
    name: `${scheme}-${width}`,
    use: { browserName: "chromium", viewport: { width, height: 900 }, colorScheme: scheme },
  })),
})
