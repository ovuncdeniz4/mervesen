import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";
import { weekdayLabel } from "@/lib/dates";
import { updateWorkingHours } from "@/lib/actions/admin";
import { getClinicSettings } from "@/lib/clinic";

export default async function HoursPage() {
  await requireAdmin();
  const [hours, settings] = await Promise.all([
    prisma.workingHours.findMany({ orderBy: { weekday: "asc" } }),
    getClinicSettings(),
  ]);

  return (
    <div>
      <h1 className="font-serif text-3xl text-sage-dark">Çalışma saatleri</h1>
      <form action={updateWorkingHours} className="mt-6 space-y-6">
        <div className="overflow-x-auto rounded-2xl bg-paper p-4 ring-1 ring-cream-dark">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="text-left text-ink-soft">
                <th className="p-2">Gün</th>
                <th className="p-2">Kapalı</th>
                <th className="p-2">Başlangıç</th>
                <th className="p-2">Bitiş</th>
                <th className="p-2">Ara başı</th>
                <th className="p-2">Ara sonu</th>
              </tr>
            </thead>
            <tbody>
              {hours.map((row) => (
                <tr key={row.id}>
                  <td className="p-2">{weekdayLabel(row.weekday)}</td>
                  <td className="p-2">
                    <input type="checkbox" name={`closed-${row.weekday}`} defaultChecked={row.closed} />
                  </td>
                  <td className="p-2">
                    <input type="time" name={`start-${row.weekday}`} defaultValue={row.startTime} className="rounded border border-cream-dark px-2 py-1" />
                  </td>
                  <td className="p-2">
                    <input type="time" name={`end-${row.weekday}`} defaultValue={row.endTime} className="rounded border border-cream-dark px-2 py-1" />
                  </td>
                  <td className="p-2">
                    <input type="time" name={`breakStart-${row.weekday}`} defaultValue={row.breakStart ?? ""} className="rounded border border-cream-dark px-2 py-1" />
                  </td>
                  <td className="p-2">
                    <input type="time" name={`breakEnd-${row.weekday}`} defaultValue={row.breakEnd ?? ""} className="rounded border border-cream-dark px-2 py-1" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="grid gap-3 rounded-2xl bg-paper p-4 ring-1 ring-cream-dark sm:grid-cols-3">
          <label className="text-sm">
            Min. ön süre (saat)
            <input
              type="number"
              name="minNoticeHours"
              defaultValue={settings.minNoticeHours}
              className="mt-1 w-full rounded-xl border border-cream-dark px-3 py-2"
            />
          </label>
          <label className="text-sm">
            Max. ilerisi (gün)
            <input
              type="number"
              name="maxAdvanceDays"
              defaultValue={settings.maxAdvanceDays}
              className="mt-1 w-full rounded-xl border border-cream-dark px-3 py-2"
            />
          </label>
          <label className="text-sm">
            Slot aralığı (dk)
            <input
              type="number"
              name="slotIntervalMin"
              defaultValue={settings.slotIntervalMin}
              className="mt-1 w-full rounded-xl border border-cream-dark px-3 py-2"
            />
          </label>
        </div>
        <button className="rounded-full bg-sage px-6 py-2 text-white">Kaydet</button>
      </form>
    </div>
  );
}
