"use client";

import { useActionState } from "react";
import Link from "next/link";
import { sendContactMessage, type ContactState } from "@/lib/actions/contact";

export function ContactForm() {
  const [state, action, pending] = useActionState(sendContactMessage, null as ContactState | null);

  if (state?.ok) {
    return (
      <div className="rounded-3xl bg-sage-light/50 p-6">
        <h2 className="font-serif text-2xl text-sage-dark">Mesajınız ulaştı</h2>
        <p className="mt-2 text-ink-soft">En kısa sürede sizinle iletişime geçeceğiz.</p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-3">
      <label className="block text-sm">
        Ad soyad
        <input required name="name" className="mt-1 w-full rounded-xl border border-cream-dark bg-paper px-3 py-2" />
      </label>
      <label className="block text-sm">
        Telefon
        <input required name="phone" inputMode="tel" className="mt-1 w-full rounded-xl border border-cream-dark bg-paper px-3 py-2" />
      </label>
      <label className="block text-sm">
        E-posta (isteğe bağlı)
        <input name="email" type="email" className="mt-1 w-full rounded-xl border border-cream-dark bg-paper px-3 py-2" />
      </label>
      <label className="block text-sm">
        Mesajınız
        <textarea required name="message" rows={5} className="mt-1 w-full rounded-xl border border-cream-dark bg-paper px-3 py-2" />
      </label>
      <label className="flex items-start gap-2 text-sm text-ink-soft">
        <input type="checkbox" name="kvkk" required className="mt-1" />
        <span>
          <Link href="/kvkk" className="underline">
            KVKK metnini
          </Link>{" "}
          okudum, iletişim talebim için verilerimin işlenmesini kabul ediyorum.
        </span>
      </label>
      {state && !state.ok ? <p className="text-sm text-red-800">{state.error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-sage px-6 py-3 text-white hover:bg-sage-dark disabled:opacity-50"
      >
        {pending ? "Gönderiliyor…" : "Gönder"}
      </button>
    </form>
  );
}
