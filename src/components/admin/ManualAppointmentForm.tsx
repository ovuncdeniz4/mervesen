"use client";

import { useActionState } from "react";
import { createManualAppointmentAction, type ManualAppointmentState } from "@/lib/actions/admin";
import { TR_MOBILE_HINT, TR_MOBILE_PLACEHOLDER } from "@/lib/phone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
      <label className="grid gap-1.5 text-sm font-medium">
        Hizmet
        <NativeSelect id="manual-service" name="serviceId" required>
          {services.map((service) => (
            <option key={service.id} value={service.id}>
              {service.name} ({service.durationMin} dk)
            </option>
          ))}
        </NativeSelect>
      </label>
      <label className="grid gap-1.5 text-sm font-medium">
        Saat
        <Input id="manual-time" type="time" name="time" required />
      </label>
      <label className="grid gap-1.5 text-sm font-medium">
        Ad soyad
        <Input id="manual-name" name="patientName" autoComplete="name" required />
      </label>
      <label className="grid gap-1.5 text-sm font-medium">
        Telefon
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
        <span className="font-normal text-muted-foreground">{TR_MOBILE_HINT}</span>
      </label>
      <label className="grid gap-1.5 text-sm font-medium">
        Not
        <Input id="manual-notes" name="notes" />
      </label>
      {state && !state.ok ? <p className="text-sm text-destructive">{state.error}</p> : null}
      <Button type="submit" disabled={pending} className="h-11 md:h-8">
        {pending ? "Kaydediliyor…" : "Ekle"}
      </Button>
    </form>
  );
}
