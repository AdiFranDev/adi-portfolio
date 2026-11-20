import { ArrowUpRight, Link2 } from "lucide-react"
import { contact } from "@content/site"
import { ContactForm } from "@/app/contact/contact-form"
import { Reveal } from "@/components/site/reveal"
import { Traits } from "@/components/site/traits"

export function Contact() {
  return (
    <section id="contact" data-section="contact" aria-labelledby="contact-title" className="relative overflow-hidden">

      <div className="relative mx-auto flex max-w-[1440px] flex-col gap-10 px-5 pt-[84px] pb-20 md:min-h-[900px] md:pb-24 md:px-16 md:pt-[120px] xl:px-[120px]">
        <div className="flex flex-col gap-8 md:grid md:grid-cols-[minmax(0,560px)_minmax(0,520px)] md:grid-rows-[auto_1fr] md:justify-between md:gap-x-12 md:gap-y-7">
          <Reveal className="flex flex-col gap-[22px] md:col-start-1 md:row-start-1">
            <h2 id="contact-title" className="type-h2 optical-left m-0">
              Let us build something for the lab, the field, or <span className="text-primary">the room.</span>
            </h2>
            <p className="type-lead m-0 text-muted-foreground">
              Research collaborations, community programs, internships, or a hello. I read every message.
            </p>
          </Reveal>

          <Reveal delay={80} className="flex flex-col gap-5 md:col-start-2 md:row-span-2 md:row-start-1 md:mt-[30px]">
            <ContactForm />
            <ul className="m-0 grid list-none grid-cols-1 gap-0 p-0 md:grid-cols-2 md:gap-3">
              {contact.links.map((link) => (
                <li key={link.name} className="border-b border-border md:border-none">
                  {link.href ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex min-h-12 items-center gap-2.5 text-foreground no-underline transition-[background-color,border-color] duration-150 md:min-h-[52px] md:rounded-xl md:border md:border-input md:px-3.5 md:hover:border-foreground md:hover:bg-muted"
                    >
                      <Link2 aria-hidden="true" className="size-5 text-muted-foreground" />
                      <span className="flex flex-col">
                        <span className="text-sm font-semibold">{link.name}</span>
                        <span className="text-[13px] text-muted-foreground">{link.handle}</span>
                      </span>
                      <ArrowUpRight aria-hidden="true" className="ml-auto size-[18px] text-muted-foreground" />
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  ) : (
                    <div
                      data-link-needed={link.name}
                      className="flex min-h-12 items-center gap-2.5 md:min-h-[52px] md:rounded-xl md:border-2 md:border-dashed md:border-primary md:px-3.5"
                    >
                      <Link2 aria-hidden="true" className="size-5 text-primary" />
                      <span className="flex flex-col">
                        <span className="text-sm font-semibold">{link.name}</span>
                        <span className="text-[13px] text-primary">Add link · {link.handle}</span>
                      </span>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={40} className="md:col-start-1 md:row-start-2">
            <Traits traits={contact.traits} />
          </Reveal>
        </div>

      </div>
    </section>
  )
}
