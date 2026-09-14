import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";
import { formatDateTime } from "@/lib/dates";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
    <div className="space-y-8">
      <AdminPageHeader title="Özet" />
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Bugün (onaylı)" value={todayCount} />
        <Stat label="7 gün içinde" value={weekCount} />
        <Stat label="Okunmamış mesaj" value={unread} />
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-2xl">Sıradaki randevular</CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-border">
          {upcoming.length === 0 ? (
            <p className="text-sm text-muted-foreground">Yaklaşan randevu yok.</p>
          ) : (
            upcoming.map((item) => (
              <div key={item.id} className="flex flex-wrap items-center justify-between gap-2 py-3 first:pt-0 last:pb-0">
                <div>
                  <p className="font-medium">{item.patientName}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.service.name} · {formatDateTime(item.startAt)}
                  </p>
                </div>
                <Button variant="link" asChild className="px-0">
                  <Link href="/admin/takvim">Takvim</Link>
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="font-sans text-4xl font-semibold tabular-nums tracking-tight">{value}</CardTitle>
      </CardHeader>
    </Card>
  );
}
