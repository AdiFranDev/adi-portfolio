import { streak } from "@content/site"

const DAY_MS = 86_400_000

// Days since the start date, counting the start date as day 1, in Asia/Manila time.
export function streakDays(now: Date = new Date()): number {
  if (streak.override !== null) return streak.override
  // en-CA formats as YYYY-MM-DD.
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: streak.timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now)
  const days = Math.floor((Date.parse(`${today}T00:00:00Z`) - Date.parse(`${streak.start}T00:00:00Z`)) / DAY_MS) + 1
  return Math.max(0, days)
}
