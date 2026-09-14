"use client";

import { useActionState } from "react";
import { sendTestNotify } from "@/lib/actions/admin";
import { Button } from "@/components/ui/button";

/** Admin ayarlar: Resend env’ini randevu almadan doğrulamak için test maili + ham log. */
export function TestNotifyForm() {
  const [state, action, pending] = useActionState(sendTestNotify, null);

  return (
    <div className="max-w-3xl space-y-4">
      <p className="text-sm text-muted-foreground">
        Gerekli env: <code className="text-foreground">RESEND_API_KEY</code> ve{" "}
        <code className="text-foreground">NOTIFY_EMAIL</code> (Resend kayıt e-postanız, örn. Gmail). Gönderen Resend
        test adresidir. Logda <code className="text-foreground">from gönderildi</code> satırı example.com olmamalı. Env
        değişince Redeploy.
      </p>
      <form action={action}>
        <Button type="submit" disabled={pending} variant="outline">
          {pending ? "Gönderiliyor…" : "Test maili gönder"}
        </Button>
      </form>
      {state?.ok ? (
        <p className="text-sm text-foreground">
          Gönderildi: {state.to} (from: {state.from}
          {state.resendId ? `; id ${state.resendId}` : ""}). Gelen kutu ve spam’i kontrol edin.
        </p>
      ) : null}
      {state && !state.ok ? <p className="whitespace-pre-wrap text-sm text-destructive">{state.error}</p> : null}
      {state?.log ? (
        <pre className="overflow-x-auto rounded-lg bg-ivory p-3 text-xs whitespace-pre-wrap text-espresso">
          {state.log}
        </pre>
      ) : null}
    </div>
  );
}
