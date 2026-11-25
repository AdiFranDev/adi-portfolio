import { ArrowUpRight } from "lucide-react"
import { contact } from "@content/site"
import { ContactForm } from "@/app/contact/contact-form"
import { Reveal } from "@/components/site/reveal"

// D-019: the three main links get large cards; the rest stay in the footer.
const MAIN = ["LinkedIn", "GitHub", "Google Scholar"]

export function Contact() {
  const links = contact.links.filter((l) => MAIN.includes(l.name) && l.href)
  return (
    <section id="contact" data-section="contact" aria-labelledby="contact-title" className="relative scroll-mt-24">
      <div className="mx-auto grid max-w-[1280px] items-start gap-12 px-5 py-24 md:grid-cols-2 md:px-8 md:py-28">
        <Reveal className="flex flex-col gap-5">
          <div className="type-label text-muted-foreground">Contact</div>
          <h2 id="contact-title" className="type-h2 m-0">
            Let us build something for the lab, the field, or <span className="text-accent-pink">the room.</span>
          </h2>
          <p className="type-lead m-0 text-muted-foreground">
            Research collaborations, community programs, internships, or a hello. I read every message.
          </p>
          <ul className="m-0 mt-2 grid list-none gap-2.5 p-0">
            {links.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href ?? undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex min-h-16 items-center gap-3.5 rounded-[20px] border border-border bg-card/90 px-4 py-2.5 text-foreground no-underline transition-[border-color,background-color] duration-150 hover:border-foreground"
                >
                  <span
                    aria-hidden="true"
                    className="size-7 shrink-0 bg-(--brand)"
                    style={
                      {
                        "--brand": link.color,
                        mask: `url(${link.icon}) center / contain no-repeat`,
                        WebkitMask: `url(${link.icon}) center / contain no-repeat`,
                      } as React.CSSProperties
                    }
                  />
                  <span className="flex flex-col">
                    <span className="font-bold">{link.name}</span>
                    <span className="text-[13.5px] text-muted-foreground">{link.handle}</span>
                  </span>
                  <ArrowUpRight aria-hidden="true" className="ml-auto size-[18px] text-primary" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={80}>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  )
}
