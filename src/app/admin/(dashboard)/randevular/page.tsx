import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";
import { formatDateTime, ymdInIstanbul, hmFromDate } from "@/lib/dates";
import { rescheduleAppointmentForm, updateAppointmentStatus } from "@/lib/actions/admin";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default async function AppointmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  await requireAdmin();
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const appointments = await prisma.appointment.findMany({
    where: query
      ? {
          OR: [
            { patientName: { contains: query } },
            { phone: { contains: query } },
            { email: { contains: query } },
          ],
        }
      : undefined,
    include: { service: true },
    orderBy: { startAt: "desc" },
    take: 80,
  });

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Randevular" />
      <form className="flex max-w-md gap-2">
        <Input name="q" defaultValue={query} placeholder="Ad, telefon, e-posta" />
        <Button type="submit">Ara</Button>
      </form>
      <Card>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hasta</TableHead>
                <TableHead>Hizmet</TableHead>
                <TableHead>Zaman</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead>İşlem</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-muted-foreground">
                    Kayıt yok.
                  </TableCell>
                </TableRow>
              ) : null}
              {appointments.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="whitespace-normal">
                    <p className="font-medium">{item.patientName}</p>
                    <p className="text-muted-foreground">{item.phone}</p>
                  </TableCell>
                  <TableCell>{item.service.name}</TableCell>
                  <TableCell>{formatDateTime(item.startAt)}</TableCell>
                  <TableCell>
                    <StatusBadge status={item.status} />
                  </TableCell>
                  <TableCell className="space-y-2 whitespace-normal">
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
                    <form action={rescheduleAppointmentForm} className="flex flex-wrap items-center gap-1">
                      <input type="hidden" name="id" value={item.id} />
                      <Input type="date" name="ymd" defaultValue={ymdInIstanbul(item.startAt)} className="h-8 w-auto" />
                      <Input type="time" name="time" defaultValue={hmFromDate(item.startAt)} className="h-8 w-auto" />
                      <Button type="submit" variant="outline" size="sm">
                        Ertele
                      </Button>
                    </form>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
