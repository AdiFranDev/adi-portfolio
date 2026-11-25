// The ribbon logo (D-011): a pink loop, a green loop, a pearl knot and two notched tails.
// `id` keeps the gradient ids unique when the ribbon appears more than once on a page.
type RibbonProps = { id: string; className?: string }

export function Ribbon({ id, className }: RibbonProps) {
  const pink = `url(#ribbon-pink-${id})`
  const green = `url(#ribbon-green-${id})`
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true" className={className}>
      <defs>
        <linearGradient id={`ribbon-pink-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ff7ab8" />
          <stop offset="1" stopColor="#c32777" />
        </linearGradient>
        <linearGradient id={`ribbon-green-${id}`} x1="1" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3fae93" />
          <stop offset="1" stopColor="#012a23" />
        </linearGradient>
      </defs>
      <path d="M55 62 C50 76 44 90 37 104 Q36 107 39 106 L46 101 L50 109 Q52 111 53 108 C57 94 60 80 62 66 Z" fill={pink} stroke={pink} strokeWidth="3" strokeLinejoin="round" />
      <path d="M65 62 C70 76 76 90 83 104 Q84 107 81 106 L74 101 L70 109 Q68 111 67 108 C63 94 60 80 58 66 Z" fill={green} stroke={green} strokeWidth="3" strokeLinejoin="round" opacity="0.95" />
      <path d="M56 52 C46 42 28 24 17 30 C7 36 7 72 17 79 C28 86 46 70 56 63 Z" fill={pink} stroke={pink} strokeWidth="6" strokeLinejoin="round" />
      <path d="M64 52 C74 42 92 24 103 30 C113 36 113 72 103 79 C92 86 74 70 64 63 Z" fill={green} stroke={green} strokeWidth="6" strokeLinejoin="round" opacity="0.92" />
      <path d="M50 59 C42 63 32 66 22 64" stroke="#000" strokeOpacity="0.16" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M70 59 C78 63 88 66 98 64" stroke="#000" strokeOpacity="0.16" strokeWidth="3" strokeLinecap="round" fill="none" />
      <rect x="49" y="47" width="22" height="22" rx="9" fill="#f8f7f3" />
      <rect x="55" y="53" width="10" height="10" rx="4" fill="#c32777" />
    </svg>
  )
}
