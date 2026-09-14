import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";
import { formatTimeIstanbul, todayYmd, weekdayLabel, weekdayFromYmd } from "@/lib/dates";
import { createBlockedSlotForm, deleteBlockedSlot, updateAppointmentStatus } from "@/lib/actions/admin";
import { ManualAppointmentForm } from "@/components/admin/ManualAppointmentForm";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

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
      <AdminPageHeader
        title="Takvim"
        description={`${weekdayLabel(weekdayFromYmd(ymd))} · ${hours?.closed ? "Kapalı" : `${hours?.startTime}–${hours?.endTime}`}`}
      >
        <form className="flex gap-2">
          <Input type="date" name="gun" defaultValue={ymd} className="w-auto" />
          <Button type="submit">Göster</Button>
        </form>
      </AdminPageHeader>

      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-xl">Günün kayıtları</CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-border">
          {appointments.length === 0 && blocks.length === 0 ? (
            <p className="text-sm text-muted-foreground">Kayıt yok.</p>
          ) : null}
          {appointments.map((item) => (
            <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
              <div>
                <p className="font-medium">
                  {formatTimeIstanbul(item.startAt)}–{formatTimeIstanbul(item.endAt)} · {item.patientName}
                </p>
                <p className="text-sm text-muted-foreground">
                  {item.service.name} · {item.phone} · <StatusBadge status={item.status} />
                </p>
              </div>
              <div className="flex gap-2">
                {item.status !== "CANCELLED" ? (
                  <form
                    action={async () => {
                      "use server";
                      await updateAppointmentStatus(item.id, "CANCELLED");
                    }}
                  >
                    <Button type="submit" variant="destructive" size="sm">
                      İptal
                    </Button>
                  </form>
                ) : null}
                {item.status === "CONFIRMED" ? (
                  <form
                    action={async () => {
                      "use server";
                      await updateAppointmentStatus(item.id, "COMPLETED");
                    }}
                  >
                    <Button type="submit" variant="secondary" size="sm">
                      Tamamlandı
                    </Button>
                  </form>
                ) : null}
              </div>
            </div>
          ))}
          {blocks.map((item) => (
            <div key={item.id} className="flex items-center justify-between py-3 last:pb-0">
              <p className="text-sm">
                Blok {formatTimeIstanbul(item.startAt)}–{formatTimeIstanbul(item.endAt)} · {item.reason}
              </p>
              <form
                action={async () => {
                  "use server";
                  await deleteBlockedSlot(item.id);
                }}
              >
                <Button type="submit" variant="outline" size="sm">
                  Kaldır
                </Button>
              </form>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-xl">Manuel randevu</CardTitle>
          </CardHeader>
          <CardContent>
            <ManualAppointmentForm
              ymd={ymd}
              services={services.map((service) => ({
                id: service.id,
                name: service.name,
                durationMin: service.durationMin,
              }))}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-xl">Saat bloğu</CardTitle>
            <CardDescription>Öğle arası dışı tatil veya dolu aralık.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={createBlockedSlotForm} className="grid gap-3">
              <input type="hidden" name="ymd" value={ymd} />
              <Input type="time" name="startTime" required />
              <Input type="time" name="endTime" required />
              <Input name="reason" placeholder="Neden" />
              <Button type="submit" variant="outline">
                Bloğu kaydet
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      <p className="text-sm text-muted-foreground">
        Erteleme için{" "}
        <Button variant="link" asChild className="h-auto p-0">
          <Link href="/admin/randevular">randevu listesini</Link>
        </Button>{" "}
        kullanın.
      </p>
    </div>
  );
}
