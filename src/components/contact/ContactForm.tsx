"use client";

import { useActionState } from "react";
import Link from "next/link";
import { sendContactMessage, type ContactState } from "@/lib/actions/contact";
import { TR_MOBILE_HINT, TR_MOBILE_PLACEHOLDER } from "@/lib/phone";

export function ContactForm() {
  const [state, action, pending] = useActionState(sendContactMessage, null as ContactState | null);

  if (state?.ok) {
    return (
      <div className="rounded-lg border border-champagne bg-paper p-6">
        <h2 className="font-serif text-2xl text-espresso">Mesajınız ulaştı</h2>
        <p className="mt-2 text-muted">En kısa sürede sizinle iletişime geçeceğiz.</p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-3">
      <label className="block text-sm">
        Ad soyad
        <input required name="name" className="mt-1 w-full rounded-md border border-champagne bg-paper px-3 py-2" />
      </label>
      <label className="block text-sm">
        Telefon
        <input
          required
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder={TR_MOBILE_PLACEHOLDER}
          maxLength={18}
          className="mt-1 w-full rounded-md border border-champagne bg-paper px-3 py-2"
        />
        <span className="mt-1 block text-xs text-muted">{TR_MOBILE_HINT}</span>
      </label>
      <label className="block text-sm">
        E-posta (isteğe bağlı)
        <input name="email" type="email" className="mt-1 w-full rounded-md border border-champagne bg-paper px-3 py-2" />
      </label>
      <label className="block text-sm">
        Mesajınız
        <textarea required name="message" rows={5} className="mt-1 w-full rounded-md border border-champagne bg-paper px-3 py-2" />
      </label>
      <label className="flex items-start gap-2 text-sm text-muted">
        <input type="checkbox" name="kvkk" required className="mt-1" />
        <span>
          <Link href="/kvkk" className="underline decoration-champagne underline-offset-4">
            KVKK metnini
          </Link>{" "}
          okudum, iletişim talebim için verilerimin işlenmesini kabul ediyorum.
        </span>
      </label>
      {state && !state.ok ? <p className="text-sm text-burgundy">{state.error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-burgundy px-6 py-3 text-ivory transition-colors hover:bg-champagne hover:text-espresso disabled:opacity-50"
      >
        {pending ? "Gönderiliyor…" : "Gönder"}
      </button>
    </form>
  );
}
