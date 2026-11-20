"use client"

import { useSyncExternalStore } from "react"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { cn } from "@/lib/utils"
import { iconButtonStyles } from "@/components/site/ds"

const subscribe = () => () => {}

type ThemeToggleProps = { className?: string }

/**
 * The new theme always grows out of the button as a circle (View Transitions
 * API), so no snapshot of the old theme ever lingers on top. Without the API,
 * or with reduced motion, it switches instantly.
 */
let switching = false
export function ThemeToggle({ className }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme()
  const mounted = useSyncExternalStore(subscribe, () => true, () => false)
  const isDark = mounted && resolvedTheme === "dark"

  function onClick(event: React.MouseEvent<HTMLButtonElement>) {
    const next = isDark ? "light" : "dark"
    const root = document.documentElement
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (typeof document.startViewTransition !== "function" || reduced) {
      setTheme(next)
      return
    }

    if (switching) return
    switching = true
    const box = event.currentTarget.getBoundingClientRect()
    const x = box.left + box.width / 2
    const y = box.top + box.height / 2
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))

    const transition = document.startViewTransition(() => {
      // Apply the class now so the new snapshot is already themed; next-themes
      // sets the same class when its state updates.
      root.classList.remove("light", "dark")
      root.classList.add(next)
      root.style.colorScheme = next
      setTheme(next)
    })

    const small = `circle(0px at ${x}px ${y}px)`
    const large = `circle(${radius}px at ${x}px ${y}px)`
    transition.ready
      .then(() => {
        root.animate(
          { clipPath: [small, large] },
          { duration: 600, easing: "cubic-bezier(0.22, 1, 0.36, 1)", pseudoElement: "::view-transition-new(root)" },
        )
      })
      .catch((error: unknown) => console.error("Theme transition failed", error))
    transition.finished
      .finally(() => {
        switching = false
      })
      .catch((error: unknown) => console.error("Theme switch did not finish", error))
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className={cn(iconButtonStyles, className)}
    >
      <Moon aria-hidden="true" className="transition-transform duration-300 dark:hidden" />
      <Sun aria-hidden="true" className="hidden transition-transform duration-300 dark:block" />
    </button>
  )
}
