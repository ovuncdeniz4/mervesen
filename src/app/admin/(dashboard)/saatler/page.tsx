import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";
import { weekdayLabel } from "@/lib/dates";
import { updateWorkingHours } from "@/lib/actions/admin";
import { getClinicSettings } from "@/lib/clinic";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default async function HoursPage() {
  await requireAdmin();
  const [hours, settings] = await Promise.all([
    prisma.workingHours.findMany({ orderBy: { weekday: "asc" } }),
    getClinicSettings(),
  ]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Çalışma saatleri"
        description="Haftalık pencereler, öğle arası ve randevu ufku. Kapalı günleri işaretleyin."
      />

      <form action={updateWorkingHours} className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Haftalık tablo</CardTitle>
            <CardDescription>Açık günler için başlangıç, bitiş ve isteğe bağlı ara saatleri.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Gün</TableHead>
                  <TableHead>Kapalı</TableHead>
                  <TableHead>Başlangıç</TableHead>
                  <TableHead>Bitiş</TableHead>
                  <TableHead>Ara başı</TableHead>
                  <TableHead>Ara sonu</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hours.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium">{weekdayLabel(row.weekday)}</TableCell>
                    <TableCell>
                      {/* Native checkbox: Radix Checkbox form name göndermez */}
                      <input
                        type="checkbox"
                        name={`closed-${row.weekday}`}
                        defaultChecked={row.closed}
                        className="size-4 accent-burgundy"
                      />
                    </TableCell>
                    <TableCell>
                      <Input type="time" name={`start-${row.weekday}`} defaultValue={row.startTime} className="w-32" />
                    </TableCell>
                    <TableCell>
                      <Input type="time" name={`end-${row.weekday}`} defaultValue={row.endTime} className="w-32" />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="time"
                        name={`breakStart-${row.weekday}`}
                        defaultValue={row.breakStart ?? ""}
                        className="w-32"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="time"
                        name={`breakEnd-${row.weekday}`}
                        defaultValue={row.breakEnd ?? ""}
                        className="w-32"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Randevu kuralları</CardTitle>
            <CardDescription>Hasta takviminde görünen slot aralığı ve rezervasyon ufku.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-3">
            <div className="grid gap-2">
              <Label htmlFor="minNoticeHours">Min. ön süre (saat)</Label>
              <Input
                id="minNoticeHours"
                type="number"
                name="minNoticeHours"
                defaultValue={settings.minNoticeHours}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="maxAdvanceDays">Max. ilerisi (gün)</Label>
              <Input
                id="maxAdvanceDays"
                type="number"
                name="maxAdvanceDays"
                defaultValue={settings.maxAdvanceDays}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="slotIntervalMin">Slot aralığı (dk)</Label>
              <Input
                id="slotIntervalMin"
                type="number"
                name="slotIntervalMin"
                defaultValue={settings.slotIntervalMin}
              />
            </div>
          </CardContent>
        </Card>

        <Button type="submit">Kaydet</Button>
      </form>
    </div>
  );
}
