"use client";

import { useActionState } from "react";
import { loginAdmin, type LoginState } from "@/lib/actions/auth";

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAdmin, {} as LoginState);
  return (
    <form action={action} className="space-y-4">
      <label className="block text-sm">
        E-posta
        <input
          required
          name="email"
          type="email"
          autoComplete="username"
          className="mt-1 w-full rounded-xl border border-cream-dark bg-cream px-3 py-2"
        />
      </label>
      <label className="block text-sm">
        Şifre
        <input
          required
          name="password"
          type="password"
          autoComplete="current-password"
          className="mt-1 w-full rounded-xl border border-cream-dark bg-cream px-3 py-2"
        />
      </label>
      {state?.error ? <p className="text-sm text-red-800">{state.error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-sage py-3 text-white hover:bg-sage-dark disabled:opacity-50"
      >
        {pending ? "Giriş…" : "Giriş yap"}
      </button>
    </form>
  );
}
