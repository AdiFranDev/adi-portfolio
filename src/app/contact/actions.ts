"use server"

import { headers } from "next/headers"
import { Resend } from "resend"

export type ContactField = "name" | "email" | "message"

export type ContactState = {
  ok: boolean
  message: string
  fieldErrors?: Partial<Record<ContactField, string>>
}

// A simple per-IP limit: 5 messages an hour. It lives in memory, so it resets
// when a server instance restarts; enough to slow down a spammer, not a guarantee.
const LIMIT = 5
const WINDOW_MS = 60 * 60 * 1000
const recent = new Map<string, number[]>()

function rateLimited(ip: string): boolean {
  const now = Date.now()
  const times = (recent.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  if (times.length >= LIMIT) {
    recent.set(ip, times)
    return true
  }
  times.push(now)
  recent.set(ip, times)
  return false
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function sendContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  // Honeypot: real visitors never see or fill this field.
  if (formData.get("hp_field")) return { ok: true, message: "Thanks, message sent." }

  const name = String(formData.get("name") ?? "").replace(/[\r\n]+/g, " ").trim()
  const email = String(formData.get("email") ?? "").trim()
  const message = String(formData.get("message") ?? "").trim()

  const fieldErrors: ContactState["fieldErrors"] = {}
  if (!name || name.length > 100) fieldErrors.name = "Please enter your name (up to 100 characters)."
  if (!EMAIL_PATTERN.test(email) || email.length > 254) fieldErrors.email = "Please enter a valid email address."
  if (message.length < 10 || message.length > 5000) fieldErrors.message = "Messages need 10 to 5,000 characters."
  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, message: "Please check the highlighted fields.", fieldErrors }
  }

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
  if (rateLimited(ip)) {
    return { ok: false, message: "Too many messages from this connection. Please try again in an hour." }
  }

  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.CONTACT_TO_EMAIL
  if (!apiKey || !to) {
    console.error("Contact form: RESEND_API_KEY or CONTACT_TO_EMAIL is not set")
    return { ok: false, message: "The message could not be sent. Please try again later." }
  }

  const resend = new Resend(apiKey)
  const { error } = await resend.emails.send({
    from: "Portfolio <onboarding@resend.dev>",
    to: [to],
    replyTo: email,
    subject: `Portfolio message from ${name}`,
    text: `${message}\n\nFrom: ${name} <${email}>`,
  })

  if (error) {
    console.error("Contact form: Resend returned an error", error.name)
    return { ok: false, message: "The message could not be sent. Please try again later." }
  }
  return { ok: true, message: "Thanks, message sent." }
}
