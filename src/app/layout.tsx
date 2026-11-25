import type { Metadata } from "next"
import { Bricolage_Grotesque, Caveat, Geist, Geist_Mono, Noto_Sans_JP } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SiteNav } from "@/components/site/site-nav"
import { SiteBackdrop } from "@/components/site/site-backdrop"
import { cn } from "@/lib/utils"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })
const geistMono = Geist_Mono({ subsets: ["latin"], weight: ["500"], variable: "--font-mono" })
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "700", "800"],
  variable: "--font-display",
})
// Only used for 日本語. Google serves Japanese in unicode-range slices, so the
// browser downloads just the slice that holds those three glyphs.
// Hand-written notes on the hero pins.
const caveat = Caveat({ subsets: ["latin"], weight: ["600"], variable: "--font-hand" })
const notoJp = Noto_Sans_JP({ weight: ["700"], preload: false, variable: "--font-jp" })

const description =
  "Francis Adrian Esteban, Computer Science at USTP Cagayan de Oro: algorithms, urban farms, and student institutions, built with the same care."

export const metadata: Metadata = {
  title: "Francis Adrian Esteban · Portfolio",
  description,
  // The site's own domain, so the preview image (src/app/opengraph-image.jpg) and og:url
  // resolve to francisadrian.dev instead of the vercel.app address.
  metadataBase: new URL("https://francisadrian.dev"),
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Francis Adrian Esteban",
    title: "Francis Adrian Esteban · Portfolio",
    description,
  },
  twitter: { card: "summary_large_image", title: "Francis Adrian Esteban · Portfolio", description },
}

// First visit in a session: mark the page before paint so the intro overlay shows.
const introScript = `try{if(!sessionStorage.getItem("intro-seen")&&!matchMedia("(prefers-reduced-motion: reduce)").matches){document.documentElement.dataset.intro="play"}}catch(e){}`

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={cn("font-sans", geist.variable, geistMono.variable, bricolage.variable, caveat.variable, notoJp.variable)}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
      </head>
      {/* Browser extensions (Grammarly and others) add attributes to <body> before React loads. */}
      <body suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <a
            href="#main"
            className="sr-only z-[80] rounded-full bg-primary px-5 py-3 font-semibold text-primary-foreground focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
          >
            Skip to content
          </a>
          <SiteBackdrop />
          <SiteNav />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
