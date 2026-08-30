import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";
import { formatDateTime } from "@/lib/dates";

export default async function AdminHomePage() {
  await requireAdmin();
  const now = new Date();
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);
  const weekAhead = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const [todayCount, weekCount, unread, upcoming] = await Promise.all([
    prisma.appointment.count({
      where: { status: "CONFIRMED", startAt: { gte: startOfDay, lte: new Date(startOfDay.getTime() + 86400000) } },
    }),
    prisma.appointment.count({
      where: { status: { not: "CANCELLED" }, startAt: { gte: new Date(), lte: weekAhead } },
    }),
    prisma.contactMessage.count({ where: { read: false } }),
    prisma.appointment.findMany({
      where: { status: "CONFIRMED", startAt: { gte: new Date() } },
      include: { service: true },
      orderBy: { startAt: "asc" },
      take: 8,
    }),
  ]);

  return (
    <div>
      <h1 className="font-serif text-3xl text-sage-dark">Özet</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Stat label="Bugün (onaylı)" value={todayCount} />
        <Stat label="7 gün içinde" value={weekCount} />
        <Stat label="Okunmamış mesaj" value={unread} />
      </div>
      <h2 className="mt-10 font-serif text-2xl text-sage-dark">Sıradaki randevular</h2>
      <ul className="mt-4 divide-y divide-cream-dark rounded-2xl bg-paper">
        {upcoming.length === 0 ? (
          <li className="p-4 text-ink-soft">Yaklaşan randevu yok.</li>
        ) : (
          upcoming.map((item) => (
            <li key={item.id} className="flex flex-wrap items-center justify-between gap-2 p-4">
              <div>
                <p className="font-medium">{item.patientName}</p>
                <p className="text-sm text-ink-soft">
                  {item.service.name} · {formatDateTime(item.startAt)}
                </p>
              </div>
              <Link href="/admin/takvim" className="text-sm text-sage-dark underline">
                Takvim
              </Link>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-paper p-5 ring-1 ring-cream-dark">
      <p className="text-sm text-ink-soft">{label}</p>
      <p className="mt-1 font-serif text-4xl text-sage-dark">{value}</p>
    </div>
  );
}
