import Image from "next/image"
import { ArrowUpRight } from "lucide-react"
import type { Certificate } from "@content/certificates"
import { buttonStyles } from "@/components/site/ds"
import { cn } from "@/lib/utils"

/** D-020: certificates and badges, one card each, every card linking to the issuer to verify. */
export function Certificates({ items }: { items: Certificate[] }) {
  return (
    <section id="certificates" data-section="certificates" aria-labelledby="certificates-h" className="scroll-mt-24 pt-24 pb-20 md:pt-28">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-5 px-5 md:px-8">
        <div className="flex flex-col gap-3">
          <div className="type-label text-muted-foreground">Certificates</div>
          <h2 id="certificates-h" className="type-h2 m-0">Certificates and badges</h2>
        </div>
        <p className="type-lead m-0 text-muted-foreground">Each one links to the issuer, so anyone can check it is real.</p>
        <ul className="m-0 grid list-none grid-cols-1 gap-[18px] p-0 md:grid-cols-2 lg:grid-cols-3">
          {items.map((c) => (
            <li key={c.id} className="flex flex-col gap-5 rounded-[20px] border border-border bg-card p-6">
              <div className="flex items-start gap-4">
                <Image src={c.badge.file} alt={c.badge.alt} width={96} height={96} className="size-24 shrink-0 rounded-[18px]" />
                <div className="flex min-w-0 flex-col gap-1.5">
                  <div className="font-mono text-[12.5px] tracking-[0.08em] text-accent-pink-text uppercase">{c.issuer}</div>
                  <h3 className="m-0 font-display text-[22px] leading-tight font-bold tracking-[-0.01em]">{c.title}</h3>
                </div>
              </div>
              <p className="m-0 text-[15px] leading-relaxed text-muted-foreground">{c.note}</p>
              <dl className="m-0 grid grid-cols-2 gap-4 border-t border-border pt-4">
                <div className="flex flex-col gap-0.5">
                  <dt className="text-[13px] text-muted-foreground">Issued</dt>
                  <dd className="m-0 text-[15px] font-semibold">{c.issued}</dd>
                </div>
                {c.hours !== undefined && (
                  <div className="flex flex-col gap-0.5">
                    <dt className="text-[13px] text-muted-foreground">Total hours</dt>
                    <dd className="m-0 text-[15px] font-semibold">{c.hours}</dd>
                  </div>
                )}
              </dl>
              <a href={c.verify.href} target="_blank" rel="noopener noreferrer" className={cn(buttonStyles(), "mt-auto self-start")}>
                {c.verify.label}
                <ArrowUpRight aria-hidden="true" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
