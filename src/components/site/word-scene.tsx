type WordSceneProps = {
  word: string
  section: string
}

/**
 * D-018: a big still word that opens a Portfolio section (Experiences,
 * Certificates, Selected work). No zoom or fade (revised 2026-11-24).
 */
export function WordScene({ word, section }: WordSceneProps) {
  return (
    <div data-section={section} aria-hidden="true" className="pt-20 pb-10 md:pt-28 md:pb-14">
      <span className="block px-5 text-center font-display text-[clamp(44px,10vw,170px)] leading-none font-extrabold tracking-[-0.03em] text-foreground md:whitespace-nowrap">
        {word}
      </span>
    </div>
  )
}
