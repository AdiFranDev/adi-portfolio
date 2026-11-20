"use client"

import { useActionState } from "react"
import { sendContact, type ContactState } from "./actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const initialState: ContactState = { ok: false, message: "" }

export function ContactForm() {
  const [state, formAction, pending] = useActionState(sendContact, initialState)

  return (
    <form action={formAction} className="mt-8 space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" name="message" rows={6} required />
      </div>
      <input type="text" name="hp_field" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <Button type="submit" disabled={pending}>
        {pending ? "Sending..." : "Send"}
      </Button>
      {state.message && (
        <p role="status" className={state.ok ? "text-sm" : "text-sm text-destructive"}>
          {state.message}
        </p>
      )}
    </form>
  )
}
