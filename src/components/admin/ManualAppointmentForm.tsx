"use client";

import { useActionState } from "react";
import { createManualAppointmentAction, type ManualAppointmentState } from "@/lib/actions/admin";
import { TR_MOBILE_HINT, TR_MOBILE_PLACEHOLDER } from "@/lib/phone";

type ServiceOption = { id: string; name: string; durationMin: number };

/** Admin takvim: telefon cep formatına zorlanır, hata formda görünür. */
export function ManualAppointmentForm({ ymd, services }: { ymd: string; services: ServiceOption[] }) {
  const [state, action, pending] = useActionState(
    createManualAppointmentAction,
    null as ManualAppointmentState | null,
  );

  return (
    <form action={action} className="mt-3 grid gap-3">
      <input type="hidden" name="ymd" value={ymd} />
      <select name="serviceId" className="rounded-xl border border-cream-dark bg-cream px-3 py-2" required>
        {services.map((service) => (
          <option key={service.id} value={service.id}>
            {service.name} ({service.durationMin} dk)
          </option>
        ))}
      </select>
      <input type="time" name="time" required className="rounded-xl border border-cream-dark bg-cream px-3 py-2" />
      <input
        name="patientName"
        placeholder="Ad soyad"
        required
        className="rounded-xl border border-cream-dark bg-cream px-3 py-2"
      />
      <label className="block text-sm text-ink-soft">
        Telefon
        <input
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder={TR_MOBILE_PLACEHOLDER}
          maxLength={18}
          required
          className="mt-1 w-full rounded-xl border border-cream-dark bg-cream px-3 py-2 text-ink"
        />
        <span className="mt-1 block text-xs">{TR_MOBILE_HINT}</span>
      </label>
      <input name="notes" placeholder="Not" className="rounded-xl border border-cream-dark bg-cream px-3 py-2" />
      {state && !state.ok ? <p className="text-sm text-red-800">{state.error}</p> : null}
      <button disabled={pending} className="rounded-full bg-sage py-2 text-white disabled:opacity-50">
        {pending ? "Kaydediliyor…" : "Ekle"}
      </button>
    </form>
  );
}
