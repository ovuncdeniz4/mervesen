"use client";

import { useActionState, useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import type { Service } from "@prisma/client";
import { bookAppointment, getDaySlots, getMonthAvailability, type BookingState } from "@/lib/actions/booking";
import { formatDateLong, monthGrid, splitYmd, todayYmd } from "@/lib/dates";
import type { SlotDto } from "@/lib/availability";

const WEEKDAYS = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];

export function BookingWizard({
  services,
  whatsappHref,
}: {
  services: Pick<Service, "id" | "name" | "durationMin" | "summary">[];
  whatsappHref: string | null;
}) {
  const today = todayYmd();
  const initial = splitYmd(today);
  const [serviceId, setServiceId] = useState(services[0]?.id ?? "");
  const [year, setYear] = useState(initial.year);
  const [monthIndex, setMonthIndex] = useState(initial.monthIndex);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [slots, setSlots] = useState<SlotDto[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<SlotDto | null>(null);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [pending, startTransition] = useTransition();
  const [state, formAction, bookingPending] = useActionState(bookAppointment, null as BookingState | null);

  const service = services.find((item) => item.id === serviceId);

  useEffect(() => {
    if (!serviceId) return;
    startTransition(async () => {
      const result = await getMonthAvailability(serviceId, year, monthIndex);
      setCounts(result.days);
    });
  }, [serviceId, year, monthIndex]);

  useEffect(() => {
    if (!serviceId || !selectedDay) return;
    let cancelled = false;
    startTransition(async () => {
      const result = await getDaySlots(serviceId, selectedDay);
      if (!cancelled) setSlots(result.slots);
    });
    return () => {
      cancelled = true;
    };
  }, [serviceId, selectedDay]);

  const cells = useMemo(() => monthGrid(year, monthIndex), [year, monthIndex]);
  const monthLabel = new Intl.DateTimeFormat("tr-TR", { month: "long", year: "numeric" }).format(
    new Date(year, monthIndex, 1),
  );

  function shiftMonth(delta: number) {
    const date = new Date(year, monthIndex + delta, 1);
    setYear(date.getFullYear());
    setMonthIndex(date.getMonth());
    setSelectedDay(null);
    setSelectedSlot(null);
    setSlots([]);
  }

  if (state?.ok) {
    return (
      <div className="rounded-3xl bg-paper p-8 shadow-sm ring-1 ring-cream-dark">
        <p className="text-sm uppercase tracking-widest text-gold">Randevu alındı</p>
        <h2 className="mt-2 font-serif text-3xl text-sage-dark">Sizi takvime yazdık.</h2>
        <p className="mt-4 text-ink-soft">
          {service?.name} için seçtiğiniz saat kaydedildi. Kliniğe gelirken kimliğinizi yanınızda bulundurun.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/" className="rounded-full bg-sage px-5 py-2 text-white hover:bg-sage-dark">
            Anasayfa
          </Link>
          {whatsappHref ? (
            <a
              href={whatsappHref}
              className="rounded-full border border-sage px-5 py-2 text-sage-dark"
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp ile yaz
            </a>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
      <section className="space-y-3">
        <h2 className="font-serif text-2xl">1. Hizmet</h2>
        <div className="grid gap-3">
          {services.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setServiceId(item.id);
                setSelectedSlot(null);
                setSlots([]);
              }}
              className={`rounded-2xl border px-4 py-3 text-left transition ${
                item.id === serviceId
                  ? "border-sage bg-sage-light/60"
                  : "border-cream-dark bg-paper hover:border-sage/40"
              }`}
            >
              <span className="block font-medium">{item.name}</span>
              <span className="text-sm text-ink-soft">
                {item.durationMin} dk · {item.summary}
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-serif text-2xl">2. Gün</h2>
            <div className="flex gap-2">
              <button type="button" className="rounded-full border border-cream-dark px-3 py-1" onClick={() => shiftMonth(-1)}>
                ‹
              </button>
              <span className="min-w-40 text-center capitalize">{monthLabel}</span>
              <button type="button" className="rounded-full border border-cream-dark px-3 py-1" onClick={() => shiftMonth(1)}>
                ›
              </button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-xs text-ink-soft">
            {WEEKDAYS.map((label) => (
              <div key={label} className="py-1">
                {label}
              </div>
            ))}
            {cells.map((ymd, index) => {
              if (!ymd) return <div key={`e-${index}`} />;
              const available = (counts[ymd] ?? 0) > 0;
              const selected = selectedDay === ymd;
              return (
                <button
                  key={ymd}
                  type="button"
                  disabled={!available}
                  onClick={() => {
                    setSelectedDay(ymd);
                    setSelectedSlot(null);
                    setSlots([]);
                  }}
                  className={`rounded-xl py-2 text-sm ${
                    selected
                      ? "bg-sage text-white"
                      : available
                        ? "bg-paper hover:bg-sage-light"
                        : "cursor-not-allowed text-ink-soft/30"
                  }`}
                >
                  {Number(ymd.slice(-2))}
                </button>
              );
            })}
          </div>
          {pending ? <p className="mt-2 text-sm text-ink-soft">Müsait günler yükleniyor…</p> : null}
        </div>

        <div>
          <h2 className="font-serif text-2xl">3. Saat</h2>
          {!selectedDay ? (
            <p className="mt-2 text-sm text-ink-soft">Önce bir gün seçin.</p>
          ) : slots.length === 0 && !pending ? (
            <p className="mt-2 text-sm text-ink-soft">{formatDateLong(selectedDay)} için müsait saat yok.</p>
          ) : (
            <div className="mt-3 flex flex-wrap gap-2">
              {slots.map((slot) => (
                <button
                  key={slot.startAt}
                  type="button"
                  onClick={() => setSelectedSlot(slot)}
                  className={`rounded-full px-4 py-2 text-sm ${
                    selectedSlot?.startAt === slot.startAt
                      ? "bg-sage text-white"
                      : "bg-paper ring-1 ring-cream-dark hover:ring-sage"
                  }`}
                >
                  {slot.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <form action={formAction} className="space-y-3 rounded-3xl bg-paper p-5 ring-1 ring-cream-dark">
          <h2 className="font-serif text-2xl">4. Bilgileriniz</h2>
          <input type="hidden" name="serviceId" value={serviceId} />
          <input type="hidden" name="startAt" value={selectedSlot?.startAt ?? ""} />
          <label className="block text-sm">
            Ad soyad
            <input
              required
              name="patientName"
              className="mt-1 w-full rounded-xl border border-cream-dark bg-cream px-3 py-2"
            />
          </label>
          <label className="block text-sm">
            Telefon
            <input
              required
              name="phone"
              inputMode="tel"
              className="mt-1 w-full rounded-xl border border-cream-dark bg-cream px-3 py-2"
            />
          </label>
          <label className="block text-sm">
            E-posta (isteğe bağlı)
            <input
              name="email"
              type="email"
              className="mt-1 w-full rounded-xl border border-cream-dark bg-cream px-3 py-2"
            />
          </label>
          <label className="block text-sm">
            Not
            <textarea name="notes" rows={3} className="mt-1 w-full rounded-xl border border-cream-dark bg-cream px-3 py-2" />
          </label>
          <label className="flex items-start gap-2 text-sm text-ink-soft">
            <input type="checkbox" name="kvkk" className="mt-1" required />
            <span>
              <Link href="/kvkk" className="underline">
                KVKK aydınlatma metnini
              </Link>{" "}
              okudum, kişisel verilerimin randevu için işlenmesini kabul ediyorum.
            </span>
          </label>
          {state && !state.ok ? <p className="text-sm text-red-800">{state.error}</p> : null}
          {!selectedSlot ? (
            <p className="text-sm text-ink-soft">Randevuyu tamamlamak için bir saat seçin.</p>
          ) : null}
          <button
            type="submit"
            disabled={!selectedSlot || bookingPending}
            className="w-full rounded-full bg-sage py-3 font-medium text-white hover:bg-sage-dark disabled:opacity-50"
          >
            {bookingPending ? "Kaydediliyor…" : "Randevuyu onayla"}
          </button>
        </form>
      </section>
    </div>
  );
}
