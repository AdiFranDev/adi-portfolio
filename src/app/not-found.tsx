import Link from "next/link"

export default function NotFound() {
  return (
    <main id="main" className="mx-auto flex min-h-svh max-w-xl flex-col justify-center gap-5 px-5 py-24">
      <div className="font-mono text-[13px] tracking-[0.12em] text-muted-foreground uppercase">404</div>
      <h1 className="m-0 font-display text-4xl font-extrabold tracking-[-0.02em]">This page is not here.</h1>
      <p className="m-0 text-base text-muted-foreground">Try one of these instead.</p>
      <ul className="m-0 flex list-none flex-wrap gap-3 p-0">
        {[
          ["Home", "/#home"],
          ["About", "/#about"],
          ["Selected work", "/#projects"],
          ["Contact", "/#contact"],
        ].map(([label, href]) => (
          <li key={href}>
            <Link
              href={href ?? "/"}
              className="flex min-h-11 items-center rounded-full border border-input px-5 text-[15px] font-semibold text-foreground no-underline hover:bg-muted"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
