"use client";

import { useActionState } from "react";
import { sendTestNotify } from "@/lib/actions/admin";

/** Admin ayarlar: Resend env’ini randevu almadan doğrulamak için test maili + ham log. */
export function TestNotifyForm() {
  const [state, action, pending] = useActionState(sendTestNotify, null);

  return (
    <section className="mt-10 max-w-3xl rounded-2xl bg-paper p-4 ring-1 ring-cream-dark">
      <h2 className="font-serif text-xl text-sage-dark">Randevu e-postası</h2>
      <p className="mt-2 text-sm text-ink-soft">
        Gerekli env: <code className="text-ink">RESEND_API_KEY</code> ve{" "}
        <code className="text-ink">NOTIFY_EMAIL</code>. İkincisi Resend’e <strong>kayıt olduğunuz e-posta ile birebir
        aynı</strong> olmalı (Gmail/Outlook). Gönderen kodda sabit:{" "}
        <code className="text-ink">beth.t@example.com</code>. Resend logundaki “example.com” genel 403 metnidir;
        domain eklemeyin. Env değişince Redeploy. Ayrıntı aşağıda ve Vercel Logs <code className="text-ink">[notify]</code>.
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
        <p className="mt-3 text-sm text-sage-dark">
          Gönderildi: {state.to} (from: {state.from}
          {state.resendId ? `; id ${state.resendId}` : ""}). Gelen kutu ve spam’i kontrol edin.
        </p>
      ) : null}
      {state && !state.ok ? (
        <p className="mt-3 whitespace-pre-wrap text-sm text-red-800">{state.error}</p>
      ) : null}
      {state?.log ? (
        <pre className="mt-3 overflow-x-auto rounded-xl bg-cream p-3 text-xs text-ink whitespace-pre-wrap">
          {state.log}
        </pre>
      ) : null}
    </section>
  );
}
