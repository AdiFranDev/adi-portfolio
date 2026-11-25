"use client"

import { motion, useReducedMotion } from "motion/react"

/**
 * One fixed layer behind the page (D-012): pearl ground with a faint facet
 * texture that bursts outward once on load. Reduced motion: it is simply there.
 */
export function SiteBackdrop() {
  const reduced = useReducedMotion()
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" style={{ opacity: "var(--texture-opacity)" }}>
      <motion.div
        className="site-texture absolute inset-0"
        style={{ transformOrigin: "50% 40%" }}
        initial={reduced ? false : { scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  )
}
