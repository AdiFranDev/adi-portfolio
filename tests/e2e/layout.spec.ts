import { expect, test } from "@playwright/test"

const routes = ["/", "/projects", "/projects/example", "/contact"]

const MIN_TARGET = 24

for (const route of routes) {
  test(`layout ${route}`, async ({ page }, testInfo) => {
    const res = await page.goto(route)
    expect(res?.status(), "status").toBe(200)

    const overflow = await page.evaluate(() => {
      const { scrollWidth, clientWidth } = document.documentElement
      return { scrollWidth, clientWidth }
    })
    expect.soft(overflow.scrollWidth, "horizontal overflow").toBeLessThanOrEqual(overflow.clientWidth)

    // WCAG 2.5.8: links inside p or li are inline text and exempt.
    const smallTargets = await page.evaluate((min) => {
      const offenders: string[] = []
      for (const el of document.querySelectorAll("a, button")) {
        if (!(el instanceof HTMLElement) || !el.checkVisibility()) continue
        if (el instanceof HTMLAnchorElement && el.closest("p, li")) continue
        const { width, height } = el.getBoundingClientRect()
        if (width === 0 || height === 0) continue
        if (width < min || height < min) {
          const label = el.getAttribute("aria-label") || el.textContent?.trim() || el.tagName
          offenders.push(`${label} (${Math.round(width)}x${Math.round(height)})`)
        }
      }
      return offenders
    }, MIN_TARGET)
    expect.soft(smallTargets, `targets under ${MIN_TARGET}px`).toEqual([])

    const slug = route === "/" ? "home" : route.slice(1).replaceAll("/", "-")
    await page.screenshot({
      path: testInfo.outputPath(`${slug}-${testInfo.project.name}.png`),
      fullPage: true,
    })
  })
}
