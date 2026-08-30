import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";
import { formatTimeIstanbul, todayYmd, weekdayLabel, weekdayFromYmd } from "@/lib/dates";
import { createBlockedSlotForm, deleteBlockedSlot, updateAppointmentStatus } from "@/lib/actions/admin";
import { ManualAppointmentForm } from "@/components/admin/ManualAppointmentForm";

export default async function AdminCalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ gun?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;
  const ymd = params.gun && /^\d{4}-\d{2}-\d{2}$/.test(params.gun) ? params.gun : todayYmd();
  const start = new Date(`${ymd}T00:00:00+03:00`);
  const end = new Date(`${ymd}T23:59:59+03:00`);

  const [appointments, blocks, services, hours] = await Promise.all([
    prisma.appointment.findMany({
      where: { startAt: { lte: end }, endAt: { gte: start } },
      include: { service: true },
      orderBy: { startAt: "asc" },
    }),
    prisma.blockedSlot.findMany({
      where: { startAt: { lte: end }, endAt: { gte: start } },
      orderBy: { startAt: "asc" },
    }),
    prisma.service.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.workingHours.findUnique({ where: { weekday: weekdayFromYmd(ymd) } }),
  ]);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-sage-dark">Takvim</h1>
          <p className="text-sm text-ink-soft">
            {weekdayLabel(weekdayFromYmd(ymd))} · {hours?.closed ? "Kapalı" : `${hours?.startTime}–${hours?.endTime}`}
          </p>
        </div>
        <form className="flex gap-2">
          <input
            type="date"
            name="gun"
            defaultValue={ymd}
            className="rounded-xl border border-cream-dark bg-paper px-3 py-2"
          />
          <button className="rounded-full bg-sage px-4 py-2 text-white">Göster</button>
        </form>
      </div>

      <section className="rounded-2xl bg-paper p-4 ring-1 ring-cream-dark">
        <h2 className="font-serif text-xl">Günün kayıtları</h2>
        <ul className="mt-3 divide-y divide-cream-dark">
          {appointments.length === 0 && blocks.length === 0 ? (
            <li className="py-3 text-ink-soft">Kayıt yok.</li>
          ) : null}
          {appointments.map((item) => (
            <li key={item.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <div>
                <p className="font-medium">
                  {formatTimeIstanbul(item.startAt)}–{formatTimeIstanbul(item.endAt)} · {item.patientName}
                </p>
                <p className="text-sm text-ink-soft">
                  {item.service.name} · {item.phone} · {item.status}
                </p>
              </div>
              {item.status !== "CANCELLED" ? (
                <form
                  action={async () => {
                    "use server";
                    await updateAppointmentStatus(item.id, "CANCELLED");
                  }}
                >
                  <button className="text-sm text-red-800 underline">İptal</button>
                </form>
              ) : null}
              {item.status === "CONFIRMED" ? (
                <form
                  action={async () => {
                    "use server";
                    await updateAppointmentStatus(item.id, "COMPLETED");
                  }}
                >
                  <button className="text-sm text-sage-dark underline">Tamamlandı</button>
                </form>
              ) : null}
            </li>
          ))}
          {blocks.map((item) => (
            <li key={item.id} className="flex items-center justify-between py-3">
              <p className="text-sm">
                Blok {formatTimeIstanbul(item.startAt)}–{formatTimeIstanbul(item.endAt)} · {item.reason}
              </p>
              <form
                action={async () => {
                  "use server";
                  await deleteBlockedSlot(item.id);
                }}
              >
                <button className="text-sm underline">Kaldır</button>
              </form>
            </li>
          ))}
        </ul>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl bg-paper p-4 ring-1 ring-cream-dark">
          <h2 className="font-serif text-xl">Manuel randevu</h2>
          <ManualAppointmentForm
            ymd={ymd}
            services={services.map((service) => ({
              id: service.id,
              name: service.name,
              durationMin: service.durationMin,
            }))}
          />
        </section>

        <section className="rounded-2xl bg-paper p-4 ring-1 ring-cream-dark">
          <h2 className="font-serif text-xl">Saat bloğu</h2>
          <p className="text-sm text-ink-soft">Öğle arası dışı tatil veya dolu aralık.</p>
          <form action={createBlockedSlotForm} className="mt-3 grid gap-3">
            <input type="hidden" name="ymd" value={ymd} />
            <input type="time" name="startTime" required className="rounded-xl border border-cream-dark bg-cream px-3 py-2" />
            <input type="time" name="endTime" required className="rounded-xl border border-cream-dark bg-cream px-3 py-2" />
            <input name="reason" placeholder="Neden" className="rounded-xl border border-cream-dark bg-cream px-3 py-2" />
            <button className="rounded-full border border-sage py-2 text-sage-dark">Bloğu kaydet</button>
          </form>
        </section>
      </div>
      <p className="text-sm">
        Erteleme için <Link href="/admin/randevular" className="underline">randevu listesini</Link> kullanın.
      </p>
    </div>
  );
}
