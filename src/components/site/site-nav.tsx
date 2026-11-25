"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useReducedMotion } from "motion/react"
import Link from "next/link"
import { Menu } from "@base-ui/react/menu"
import { Dialog } from "@base-ui/react/dialog"
import { Menu as MenuIcon, MoreHorizontal, X } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"
import { iconButtonStyles } from "@/components/site/ds"
import { Ribbon } from "@/components/site/ribbon"

type NavKey = "home" | "about" | "portfolio" | "contact"
type SectionKey = "home" | "about" | "experiences" | "certificates" | "projects" | "moments" | "skills" | "contact"

const mainItems: { key: NavKey; label: string; href: string }[] = [
  { key: "home", label: "Home", href: "/#home" },
  { key: "about", label: "About", href: "/#about" },
  { key: "portfolio", label: "Portfolio", href: "/#portfolio" },
  { key: "contact", label: "Contact", href: "/#contact" },
]

// The ⋯ menu: Portfolio's sections. New Portfolio sections go here, so the bar never grows.
const portfolioItems: { key: SectionKey; label: string; href: string }[] = [
  { key: "experiences", label: "Experiences", href: "/#experiences" },
  { key: "certificates", label: "Certificates", href: "/#certificates" },
  { key: "projects", label: "Selected work", href: "/#projects" },
  { key: "skills", label: "Skills", href: "/#skills" },
  { key: "moments", label: "Moments", href: "/#moments" },
]

const phoneItems: { key: SectionKey; label: string; href: string }[] = [
  { key: "home", label: "Home", href: "/#home" },
  { key: "about", label: "About", href: "/#about" },
  ...portfolioItems,
  { key: "contact", label: "Contact", href: "/#contact" },
]

const navOf: Record<SectionKey, NavKey> = {
  home: "home",
  about: "about",
  experiences: "portfolio",
  certificates: "portfolio",
  projects: "portfolio",
  moments: "portfolio",
  skills: "portfolio",
  contact: "contact",
}

function isSectionKey(value: string | undefined): value is SectionKey {
  return value !== undefined && value in navOf
}

// Tracks which [data-section] element crosses the middle of the viewport.
function useActiveSection(): SectionKey {
  const [active, setActive] = useState<SectionKey>("home")
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-section]"))
    if (els.length === 0) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const key = entry.target instanceof HTMLElement ? entry.target.dataset.section : undefined
          if (entry.isIntersecting && isSectionKey(key)) setActive(key)
        }
      },
      { rootMargin: "-50% 0px -50% 0px" },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
  return active
}

export function SiteNav() {
  const section = useActiveSection()
  const activeNav = navOf[section]

  return (
    <>
      <DesktopNav activeNav={activeNav} section={section} />
      <PhoneNav section={section} />
    </>
  )
}

type DesktopNavProps = { activeNav: NavKey; section: SectionKey }
type NavPhase = "hidden" | "drop" | "open" | "settled"

// D-015: no nav over the hero. Past it, the ribbon drops on a short string, then
// vanishes in place as the bar opens outward from it, with Home as its first link.
function useNavPhase(reduced: boolean | null): NavPhase {
  const [phase, setPhase] = useState<NavPhase>("hidden")
  const shown = useRef(false)
  useEffect(() => {
    const timers: number[] = []
    const clear = () => timers.splice(0).forEach((t) => window.clearTimeout(t))
    const update = () => {
      const hero = document.getElementById("home")
      const past = hero ? hero.getBoundingClientRect().bottom < window.innerHeight * 0.35 : true
      if (past === shown.current) return
      shown.current = past
      clear()
      if (reduced) {
        setPhase(past ? "settled" : "hidden")
        return
      }
      if (past) {
        setPhase("drop")
        timers.push(window.setTimeout(() => setPhase("open"), 600))
        timers.push(window.setTimeout(() => setPhase("settled"), 950))
      } else {
        setPhase("drop")
        timers.push(window.setTimeout(() => setPhase("hidden"), 450))
      }
    }
    update()
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    return () => {
      clear()
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [reduced])
  return phase
}

function DesktopNav({ activeNav, section }: DesktopNavProps) {
  const reduced = useReducedMotion()
  const phase = useNavPhase(reduced)
  const open = phase === "open" || phase === "settled"

  return (
    <>
      <motion.span
        aria-hidden="true"
        className="site-nav-desktop pointer-events-none fixed top-0 left-1/2 z-[61] hidden h-5 w-0.5 -translate-x-1/2 origin-top bg-accent-pink md:block"
        initial={false}
        animate={{ scaleY: phase === "drop" ? 1 : 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      />
      <motion.span
        aria-hidden="true"
        className="site-nav-desktop pointer-events-none fixed top-[22px] left-1/2 z-[62] -ml-[22px] hidden size-11 items-center justify-center md:flex"
        initial={false}
        animate={{
          y: phase === "hidden" ? -110 : phase === "drop" ? -4 : 0,
          scale: open ? 0.5 : 1.35,
          opacity: phase === "drop" ? 1 : 0,
          rotate: phase === "hidden" ? -14 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 18,
          opacity: { duration: phase === "drop" ? 0.15 : 0.3 },
        }}
      >
        <Ribbon id="nav" className="size-10" />
      </motion.span>
      <motion.nav
        aria-label="Main"
        aria-hidden={!open}
        className="site-nav-desktop fixed top-5 left-1/2 z-50 hidden -translate-x-1/2 items-center gap-1 rounded-full border border-input bg-(--glass) p-1.5 shadow-[0_4px_16px_rgb(0_0_0/0.08)] backdrop-blur-md md:flex"
        initial={false}
        animate={{
          clipPath: open ? "inset(-24px -24px -24px -24px round 9999px)" : "inset(0 calc(50% - 28px) 0 calc(50% - 28px) round 9999px)",
          opacity: open ? 1 : 0,
        }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{ visibility: phase === "hidden" ? "hidden" : "visible" }}
      >
      {mainItems.map((item, i) => {
        const active = item.key === activeNav
        return (
          <motion.a
            key={item.key}
            href={item.href}
            tabIndex={open ? 0 : -1}
            aria-current={active ? "page" : undefined}
            initial={false}
            animate={{ opacity: phase === "settled" ? 1 : 0 }}
            transition={{ duration: 0.24, delay: phase === "settled" ? i * 0.06 : 0 }}
            className={cn(
              "flex min-h-11 items-center rounded-full px-5 text-[15px] font-medium text-foreground no-underline transition-colors duration-150",
              active && "bg-primary px-[22px] font-semibold text-primary-foreground",
              !active && item.key === "contact" && "border-[1.5px] border-primary font-semibold text-primary hover:bg-green-soft",
              !active && item.key !== "contact" && "hover:bg-muted",
            )}
          >
            {item.label}
          </motion.a>
        )
      })}
      <Menu.Root>
        <Menu.Trigger
          suppressHydrationWarning
          aria-label="More sections"
          className="flex size-11 cursor-pointer items-center justify-center rounded-full border-none bg-transparent text-foreground transition-colors duration-150 hover:bg-muted data-[popup-open]:bg-muted"
        >
          <MoreHorizontal aria-hidden="true" className="size-5" />
        </Menu.Trigger>
        <Menu.Portal>
          <Menu.Positioner sideOffset={12} align="center" className="z-50">
            <Menu.Popup
              id="more-sections"
              className="w-[260px] origin-(--transform-origin) rounded-[14px] border border-input bg-popover p-2 text-popover-foreground shadow-[0_8px_24px_rgb(0_0_0/0.09)] outline-none transition-[opacity,scale] duration-150 data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0"
            >
              <div className="px-3 pt-2 pb-1.5 font-mono text-[13px] tracking-[0.08em] text-muted-foreground uppercase">
                Portfolio
              </div>
              {portfolioItems.map((item, i) => (
                <Menu.LinkItem
                  key={item.key}
                  href={item.href}
                  closeOnClick
                  aria-current={section === item.key ? "location" : undefined}
                  className={cn(
                    "flex min-h-11 items-center justify-between rounded-sm px-3 text-[15px] font-medium text-foreground no-underline outline-none data-highlighted:bg-muted",
                    section === item.key && "bg-muted",
                  )}
                >
                  {item.label}
                  <span className="font-mono text-[13px] text-muted-foreground">0{i + 1}</span>
                </Menu.LinkItem>
              ))}
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>
      <ThemeToggle />
      </motion.nav>
    </>
  )
}

type PhoneNavProps = { section: SectionKey }

function PhoneNav({ section }: PhoneNavProps) {
  const [open, setOpen] = useState(false)
  const current = phoneItems.find((item) => item.key === section)?.label ?? "Menu"

  return (
    <header className="site-nav fixed top-3.5 right-3.5 left-3.5 z-50 flex items-center justify-between rounded-full border border-input bg-(--glass) py-1.5 pr-1.5 pl-4 shadow-[0_4px_16px_rgb(0_0_0/0.08)] backdrop-blur-md md:hidden">
      <Link href="/#home" className="font-display text-lg font-extrabold text-foreground no-underline">
        Adrian
      </Link>
      <span className="flex gap-1.5">
        <ThemeToggle />
        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Trigger suppressHydrationWarning className="flex h-11 cursor-pointer items-center gap-1.5 rounded-full border-none bg-foreground px-4 text-sm font-semibold text-background transition-transform duration-150 active:scale-[0.97]">
            <MenuIcon aria-hidden="true" className="size-[18px]" />
            {current}
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Backdrop className="fixed inset-0 z-50 bg-foreground/30 backdrop-blur-sm" />
            <Dialog.Popup className="fixed inset-x-3.5 top-3.5 z-50 rounded-[20px] border border-input bg-popover p-3 text-popover-foreground shadow-[0_8px_24px_rgb(0_0_0/0.12)] outline-none transition-[opacity,translate] duration-200 data-[ending-style]:-translate-y-2 data-[ending-style]:opacity-0 data-[starting-style]:-translate-y-2 data-[starting-style]:opacity-0">
              <div className="flex items-center justify-between pb-2 pl-3">
                <Dialog.Title className="font-mono text-[13px] font-medium tracking-[0.08em] text-muted-foreground uppercase">
                  Sections
                </Dialog.Title>
                <Dialog.Close
                  aria-label="Close menu"
                  className={iconButtonStyles}
                >
                  <X aria-hidden="true" />
                </Dialog.Close>
              </div>
              <nav aria-label="Sections">
                <ul className="m-0 list-none p-0">
                  {phoneItems.map((item) => (
                    <li key={item.key}>
                      <a
                        href={item.href}
                        onClick={() => setOpen(false)}
                        aria-current={section === item.key ? "location" : undefined}
                        className={cn(
                          "flex min-h-12 items-center rounded-md px-3 text-base font-semibold text-foreground no-underline transition-colors duration-150 active:bg-muted",
                          section === item.key && "bg-primary text-primary-foreground",
                        )}
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </Dialog.Popup>
          </Dialog.Portal>
        </Dialog.Root>
      </span>
    </header>
  )
}
