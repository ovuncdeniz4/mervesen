"use client";

import { useActionState } from "react";
import { sendTestNotify } from "@/lib/actions/admin";

/** Admin ayarlar: Resend env’ini randevu almadan doğrulamak için test maili. */
export function TestNotifyForm() {
  const [state, action, pending] = useActionState(sendTestNotify, null);

  return (
    <section className="mt-10 max-w-3xl rounded-2xl bg-paper p-4 ring-1 ring-cream-dark">
      <h2 className="font-serif text-xl text-sage-dark">Randevu e-postası</h2>
      <p className="mt-2 text-sm text-ink-soft">
        Yalnızca API anahtarı yetmez. Vercel’de <code className="text-ink">RESEND_API_KEY</code> ve gerçek bir{" "}
        <code className="text-ink">NOTIFY_EMAIL</code> (Resend hesap e-postanız) olmalı.{" "}
        <code className="text-ink">NOTIFY_FROM</code> şimdilik koymayın — <code className="text-ink">example.com</code>{" "}
        gönderen çalışmaz; kod <code className="text-ink">beth.t@example.com</code> kullanır. Env değişince Redeploy
        şart.
      </p>
      <form action={action} className="mt-4">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full border border-sage px-6 py-2 text-sage-dark disabled:opacity-50"
        >
          {pending ? "Gönderiliyor…" : "Test maili gönder"}
        </button>
      </form>
      {state?.ok ? (
        <p className="mt-3 text-sm text-sage-dark">Gönderildi: {state.to}. Gelen kutu ve spam’i kontrol edin.</p>
      ) : null}
      {state && !state.ok ? <p className="mt-3 text-sm text-red-800">{state.error}</p> : null}
    </section>
  );
}
