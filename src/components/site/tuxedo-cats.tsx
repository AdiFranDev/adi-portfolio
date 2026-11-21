// Six tuxedo cats peeking out of a basket. Hover or focus: they bob and say who they are.

type Face = "open" | "sleepy" | "wink"
type CatHead = { x: number; y: number; tilt: number; face: Face }

// Faces sit fully above the rim (y 70) so every cat is visible.
const CATS: CatHead[] = [
  { x: 36, y: 56, tilt: -10, face: "open" },
  { x: 67, y: 48, tilt: 6, face: "sleepy" },
  { x: 99, y: 44, tilt: -4, face: "open" },
  { x: 131, y: 47, tilt: 8, face: "wink" },
  { x: 162, y: 45, tilt: -6, face: "open" },
  { x: 190, y: 55, tilt: 10, face: "sleepy" },
]

const INK = "var(--tux-ink)"
const WHITE = "var(--tux-white)"
const EYE = "#d9c34a"
const NOSE = "#e88aa8"

export function CatBasket() {
  return (
    <button
      suppressHydrationWarning
      type="button"
      aria-label="These are my six cats"
      className="cat-basket group relative block w-[200px] cursor-default rounded-2xl border-none bg-transparent p-0"
    >
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 mb-1 -translate-x-1/2 translate-y-1 rounded-full bg-foreground px-3.5 py-1.5 text-[13px] font-semibold whitespace-nowrap text-background opacity-0 transition-[opacity,translate] duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
      >
        These are my six cats
        <span className="absolute top-full left-1/2 -ml-1.5 size-0 border-x-[6px] border-t-[6px] border-x-transparent border-t-foreground" />
      </span>
      <svg viewBox="0 16 220 144" aria-hidden="true" className="block w-full">
        <defs>
          <clipPath id="basket-front">
            <path d="M14 78 L206 78 L188 146 Q186 154 177 154 L43 154 Q34 154 32 146 Z" />
          </clipPath>
        </defs>
        {/* Handle, behind the cats */}
        <path d="M28 76 Q110 -24 192 76" stroke="var(--basket-rim)" strokeWidth="7" fill="none" strokeLinecap="round" />

        {CATS.map((cat, i) => (
          <g key={cat.x} className="cat-head" style={{ animationDelay: `${i * 70}ms` }}>
            <g transform={`rotate(${cat.tilt} ${cat.x} ${cat.y})`}>
              <polygon points={`${cat.x - 13},${cat.y - 6} ${cat.x - 11},${cat.y - 22} ${cat.x - 2},${cat.y - 13}`} fill={INK} stroke="var(--tux-outline)" strokeWidth="1.2" strokeLinejoin="round" />
              <polygon points={`${cat.x + 13},${cat.y - 6} ${cat.x + 11},${cat.y - 22} ${cat.x + 2},${cat.y - 13}`} fill={INK} stroke="var(--tux-outline)" strokeWidth="1.2" strokeLinejoin="round" />
              <circle cx={cat.x} cy={cat.y} r="15" fill={INK} stroke="var(--tux-outline)" strokeWidth="1.2" />
              <path
                d={`M${cat.x} ${cat.y - 14} C${cat.x - 3} ${cat.y - 6} ${cat.x - 4} ${cat.y + 2} ${cat.x} ${cat.y + 4} C${cat.x + 4} ${cat.y + 2} ${cat.x + 3} ${cat.y - 6} ${cat.x} ${cat.y - 14} Z`}
                fill={WHITE}
              />
              <ellipse cx={cat.x} cy={cat.y + 6} rx="7" ry="5" fill={WHITE} />
              <path d={`M${cat.x - 1.4} ${cat.y + 3.5} L${cat.x + 1.4} ${cat.y + 3.5} L${cat.x} ${cat.y + 5.2} Z`} fill={NOSE} />
              <Eyes cat={cat} />
            </g>
          </g>
        ))}

        {/* Basket front, woven */}
        <path d="M14 78 L206 78 L188 146 Q186 154 177 154 L43 154 Q34 154 32 146 Z" fill="var(--basket)" />
        <g clipPath="url(#basket-front)" stroke="var(--basket-dark)" strokeWidth="2.2" strokeLinecap="round" opacity="0.55">
          {[94, 110, 126, 142].map((y) => (
            <path key={y} d={`M10 ${y} Q110 ${y + 5} 210 ${y}`} fill="none" />
          ))}
          {Array.from({ length: 13 }, (_, i) => 22 + i * 15).map((x, i) => (
            <path key={x} d={`M${x} ${80 + (i % 2) * 8} L${x + (x - 110) * -0.08} 156`} fill="none" />
          ))}
        </g>
        <rect x="8" y="70" width="204" height="14" rx="7" fill="var(--basket-rim)" />
        {/* Paws over the rim */}
        <ellipse cx="58" cy="72" rx="5" ry="3" fill={WHITE} />
        <ellipse cx="68" cy="73" rx="5" ry="3" fill={WHITE} />
        <ellipse cx="148" cy="72" rx="5" ry="3" fill={WHITE} />
        {/* A tail hanging over the side */}
        <path d="M204 84 C218 92 214 112 204 118" stroke={INK} strokeWidth="6" fill="none" strokeLinecap="round" />
      </svg>
    </button>
  )
}

function Eyes({ cat }: { cat: CatHead }) {
  const l = cat.x - 5.5
  const r = cat.x + 5.5
  const y = cat.y - 2
  if (cat.face === "sleepy") {
    return (
      <path d={`M${l - 2.5} ${y} Q${l} ${y + 2.5} ${l + 2.5} ${y} M${r - 2.5} ${y} Q${r} ${y + 2.5} ${r + 2.5} ${y}`} stroke={WHITE} strokeWidth="1.4" fill="none" strokeLinecap="round" />
    )
  }
  return (
    <>
      <ellipse cx={l} cy={y} rx="2.4" ry="2.6" fill={EYE} />
      <ellipse cx={l} cy={y} rx="0.9" ry="2" fill={INK} />
      {cat.face === "wink" ? (
        <path d={`M${r - 2.5} ${y} Q${r} ${y + 2.5} ${r + 2.5} ${y}`} stroke={WHITE} strokeWidth="1.4" fill="none" strokeLinecap="round" />
      ) : (
        <>
          <ellipse cx={r} cy={y} rx="2.4" ry="2.6" fill={EYE} />
          <ellipse cx={r} cy={y} rx="0.9" ry="2" fill={INK} />
        </>
      )}
    </>
  )
}
