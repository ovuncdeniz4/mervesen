"use client";

import { useActionState } from "react";
import { createManualAppointmentAction, type ManualAppointmentState } from "@/lib/actions/admin";
import { TR_MOBILE_HINT, TR_MOBILE_PLACEHOLDER } from "@/lib/phone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";

type ServiceOption = { id: string; name: string; durationMin: number };

/** Admin takvim: telefon cep formatına zorlanır, hata formda görünür. */
export function ManualAppointmentForm({ ymd, services }: { ymd: string; services: ServiceOption[] }) {
  const [state, action, pending] = useActionState(
    createManualAppointmentAction,
    null as ManualAppointmentState | null,
  );

  return (
    <form action={action} className="grid gap-3">
      <input type="hidden" name="ymd" value={ymd} />
      <div className="grid gap-2">
        <Label htmlFor="manual-service">Hizmet</Label>
        <NativeSelect id="manual-service" name="serviceId" required>
          {services.map((service) => (
            <option key={service.id} value={service.id}>
              {service.name} ({service.durationMin} dk)
            </option>
          ))}
        </NativeSelect>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="manual-time">Saat</Label>
        <Input id="manual-time" type="time" name="time" required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="manual-name">Ad soyad</Label>
        <Input id="manual-name" name="patientName" placeholder="Ad soyad" required />
      </div>
      <div className="space-y-1">
        <Label htmlFor="manual-phone">Telefon</Label>
        <Input
          id="manual-phone"
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder={TR_MOBILE_PLACEHOLDER}
          maxLength={18}
          required
        />
        <p className="text-xs text-muted-foreground">{TR_MOBILE_HINT}</p>
      </div>
      <Input name="notes" placeholder="Not" />
      {state && !state.ok ? <p className="text-sm text-destructive">{state.error}</p> : null}
      <Button type="submit" disabled={pending}>
        {pending ? "Kaydediliyor…" : "Ekle"}
      </Button>
    </form>
  );
}
