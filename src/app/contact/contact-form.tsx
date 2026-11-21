"use client"

import { useActionState } from "react"
import { CheckCircle2, Loader2, Send } from "lucide-react"
import { sendContact, type ContactField, type ContactState } from "./actions"
import { cn } from "@/lib/utils"
import { buttonStyles } from "@/components/site/ds"

const initialState: ContactState = { ok: false, message: "" }

const fieldClass =
  "rounded-md border border-input bg-background px-3.5 text-base font-normal text-foreground outline-none focus-visible:border-ring aria-invalid:border-destructive"

export function ContactForm() {
  const [state, formAction, pending] = useActionState(sendContact, initialState)
  const err = (field: ContactField) => state.fieldErrors?.[field]

  return (
    <form
      action={formAction}
      noValidate
      className="flex flex-col gap-3.5 md:rounded-[26px] md:border md:border-input md:bg-background md:p-[18px]"
    >
      <Field id="name" label="Name" error={err("name")}>
        <input
          suppressHydrationWarning
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
          aria-invalid={err("name") ? true : undefined}
          aria-describedby={err("name") ? "name-error" : undefined}
          className={cn(fieldClass, "min-h-12 md:min-h-11")}
        />
      </Field>
      <Field id="email" label="Email" error={err("email")}>
        <input
          suppressHydrationWarning
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          aria-invalid={err("email") ? true : undefined}
          aria-describedby={err("email") ? "email-error" : undefined}
          className={cn(fieldClass, "min-h-12 md:min-h-11")}
        />
      </Field>
      <Field id="message" label="Message" error={err("message")}>
        <textarea
          suppressHydrationWarning
          id="message"
          name="message"
          rows={5}
          required
          aria-invalid={err("message") ? true : undefined}
          aria-describedby={err("message") ? "message-error" : undefined}
          className={cn(fieldClass, "min-h-[110px] resize-y py-3")}
        />
      </Field>
      <input suppressHydrationWarning type="text" name="hp_field" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <button
        suppressHydrationWarning
        type="submit"
        disabled={pending}
        className={cn(buttonStyles({ variant: "primary", size: "lg" }), "w-full disabled:cursor-wait disabled:opacity-80")}
      >
        {pending ? (
          <Loader2 aria-hidden="true" className="animate-spin motion-reduce:animate-none" />
        ) : (
          <Send aria-hidden="true" />
        )}
        {pending ? "Sending..." : "Send message"}
      </button>
      <p role="status" className={cn("m-0 text-sm", !state.message && "sr-only", !state.ok && "text-destructive")}>
        {state.message && (
          <span
            key={state.message + String(state.ok)}
            className={cn(
              "inline-flex animate-in items-center gap-2 duration-300 fade-in slide-in-from-bottom-1 motion-reduce:animate-none",
              state.ok && "font-semibold text-brand-green",
            )}
          >
            {state.ok && <CheckCircle2 aria-hidden="true" className="size-[18px]" />}
            {state.message}
          </span>
        )}
      </p>
    </form>
  )
}

type FieldProps = { id: string; label: string; error?: string; children: React.ReactNode }

function Field({ id, label, error, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold">
        {label}
      </label>
      {children}
      {error && (
        <span id={`${id}-error`} className="animate-in text-[13px] text-destructive duration-200 fade-in slide-in-from-top-1 motion-reduce:animate-none">
          {error}
        </span>
      )}
    </div>
  )
}
