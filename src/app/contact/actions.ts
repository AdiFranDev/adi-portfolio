"use server"

import { Resend } from "resend"

export type ContactState = { ok: boolean; message: string }

export async function sendContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  // Honeypot: real visitors never see or fill this field.
  if (formData.get("hp_field")) return { ok: true, message: "Thanks, message sent." }

  const name = String(formData.get("name") ?? "").replace(/[\r\n]+/g, " ").trim()
  const email = String(formData.get("email") ?? "").trim()
  const message = String(formData.get("message") ?? "").trim()

  if (
    !name || name.length > 100 ||
    !email.includes("@") || email.length > 254 ||
    message.length < 10 || message.length > 5000
  ) {
    return { ok: false, message: "Please fill in every field. Messages need at least 10 characters." }
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

  if (error) return { ok: false, message: "The message could not be sent. Please try again later." }
  return { ok: true, message: "Thanks, message sent." }
}
