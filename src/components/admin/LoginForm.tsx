"use client";

import { useActionState } from "react";
import { loginAdmin, type LoginState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAdmin, {} as LoginState);
  return (
    <form action={action} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">E-posta</Label>
        <Input id="email" required name="email" type="email" autoComplete="username" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Şifre</Label>
        <Input id="password" required name="password" type="password" autoComplete="current-password" />
      </div>
      {state?.error ? <p className="text-sm text-destructive">{state.error}</p> : null}
      <Button type="submit" disabled={pending} className="w-full" size="lg">
        {pending ? "Giriş…" : "Giriş yap"}
      </Button>
    </form>
  );
}
