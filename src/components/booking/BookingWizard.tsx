"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { bookAppointment, getDaySlots, getMonthAvailability, type BookingState } from "@/lib/actions/booking";
import { formatDateLong, monthGrid, splitYmd, todayYmd } from "@/lib/dates";
import type { SlotDto } from "@/lib/availability";

const WEEKDAYS = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];

export function BookingWizard() {
  const today = todayYmd();
  const initial = splitYmd(today);
  const [year, setYear] = useState(initial.year);
  const [monthIndex, setMonthIndex] = useState(initial.monthIndex);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [slots, setSlots] = useState<SlotDto[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<SlotDto | null>(null);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [patientName, setPatientName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [kvkk, setKvkk] = useState(false);
  const [loadingCalendar, setLoadingCalendar] = useState(false);
  const [state, formAction, bookingPending] = useActionState(bookAppointment, null as BookingState | null);

  useEffect(() => {
    let cancelled = false;
    setLoadingCalendar(true);
    void getMonthAvailability(year, monthIndex).then((result) => {
      if (!cancelled) {
        setCounts(result.days);
        setLoadingCalendar(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [year, monthIndex]);

  useEffect(() => {
    if (!selectedDay) return;
    let cancelled = false;
    setLoadingCalendar(true);
    void getDaySlots(selectedDay).then((result) => {
      if (!cancelled) {
        setSlots(result.slots);
        setLoadingCalendar(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [selectedDay]);

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
          Seçtiğiniz saat kaydedildi. Kliniğe gelirken kimliğinizi yanınızda bulundurun. Yazmak veya aramak için sağ
          alttaki düğmeleri kullanabilirsiniz.
        </p>
        <div className="mt-6">
          <Link href="/" className="rounded-full bg-sage px-5 py-2 text-white hover:bg-sage-dark">
            Anasayfa
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <form action={formAction} className="space-y-3 rounded-3xl bg-paper p-5 ring-1 ring-cream-dark">
          <h2 className="font-serif text-2xl">1. Bilgileriniz</h2>
          <input type="hidden" name="startAt" value={selectedSlot?.startAt ?? ""} />
          <label className="block text-sm">
            Ad soyad
            <input
              required
              name="patientName"
              autoComplete="name"
              value={patientName}
              onChange={(event) => setPatientName(event.target.value)}
              className="mt-1 w-full rounded-xl border border-cream-dark bg-cream px-3 py-2"
            />
          </label>
          <label className="block text-sm">
            Telefon
            <input
              required
              name="phone"
              inputMode="tel"
              autoComplete="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className="mt-1 w-full rounded-xl border border-cream-dark bg-cream px-3 py-2"
            />
          </label>
          <label className="block text-sm">
            E-posta (isteğe bağlı)
            <input
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-1 w-full rounded-xl border border-cream-dark bg-cream px-3 py-2"
            />
          </label>
          <label className="block text-sm">
            Not (isteğe bağlı)
            <textarea
              name="notes"
              rows={3}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              className="mt-1 w-full rounded-xl border border-cream-dark bg-cream px-3 py-2"
            />
          </label>
          <label className="flex items-start gap-2 text-sm text-ink-soft">
            <input
              type="checkbox"
              name="kvkk"
              className="mt-1"
              required
              checked={kvkk}
              onChange={(event) => setKvkk(event.target.checked)}
            />
            <span>
              <Link href="/kvkk" className="underline">
                KVKK aydınlatma metnini
              </Link>{" "}
              okudum, kişisel verilerimin randevu için işlenmesini kabul ediyorum.
            </span>
          </label>
          {state && !state.ok ? <p className="text-sm text-red-800">{state.error}</p> : null}
          {!selectedSlot ? (
            <p className="text-sm text-ink-soft">Randevuyu tamamlamak için takvimden bir saat seçin.</p>
          ) : (
            <p className="text-sm text-sage-dark">
              Seçilen saat: {selectedDay ? formatDateLong(selectedDay) : ""} {selectedSlot.label}
            </p>
          )}
          <button
            type="submit"
            disabled={!selectedSlot || bookingPending}
            className="w-full rounded-full bg-sage py-3 font-medium text-white hover:bg-sage-dark disabled:opacity-50"
          >
            {bookingPending ? "Kaydediliyor…" : "Randevuyu onayla"}
          </button>
        </form>

        <section className="space-y-6">
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-serif text-2xl">2. Uygun saat</h2>
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
            {loadingCalendar ? <p className="mt-2 text-sm text-ink-soft">Müsait günler yükleniyor…</p> : null}
          </div>

          <div>
            <h3 className="font-serif text-xl">Saat seçin</h3>
            {!selectedDay ? (
              <p className="mt-2 text-sm text-ink-soft">Önce bir gün seçin.</p>
            ) : slots.length === 0 && !loadingCalendar ? (
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
        </section>
    </div>
  );
}
