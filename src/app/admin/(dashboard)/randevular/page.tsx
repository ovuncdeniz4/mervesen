import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";
import { formatDateTime, ymdInIstanbul, hmFromDate } from "@/lib/dates";
import { rescheduleAppointmentForm, updateAppointmentStatus } from "@/lib/actions/admin";

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
    <div>
      <h1 className="font-serif text-3xl text-sage-dark">Randevular</h1>
      <form className="mt-4 flex gap-2">
        <input
          name="q"
          defaultValue={query}
          placeholder="Ad, telefon, e-posta"
          className="w-full max-w-sm rounded-xl border border-cream-dark bg-paper px-3 py-2"
        />
        <button className="rounded-full bg-sage px-4 py-2 text-white">Ara</button>
      </form>
      <div className="mt-6 overflow-x-auto rounded-2xl bg-paper ring-1 ring-cream-dark">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-cream-dark text-ink-soft">
            <tr>
              <th className="p-3">Hasta</th>
              <th className="p-3">Hizmet</th>
              <th className="p-3">Zaman</th>
              <th className="p-3">Durum</th>
              <th className="p-3">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((item) => (
              <tr key={item.id} className="border-b border-cream-dark/70 align-top">
                <td className="p-3">
                  <p className="font-medium">{item.patientName}</p>
                  <p className="text-ink-soft">{item.phone}</p>
                </td>
                <td className="p-3">{item.service.name}</td>
                <td className="p-3">{formatDateTime(item.startAt)}</td>
                <td className="p-3">{item.status}</td>
                <td className="space-y-2 p-3">
                  {item.status !== "CANCELLED" ? (
                    <form
                      action={async () => {
                        "use server";
                        await updateAppointmentStatus(item.id, "CANCELLED");
                      }}
                    >
                      <button className="text-red-800 underline">İptal</button>
                    </form>
                  ) : null}
                  {item.status === "CONFIRMED" ? (
                    <form
                      action={async () => {
                        "use server";
                        await updateAppointmentStatus(item.id, "COMPLETED");
                      }}
                    >
                      <button className="text-sage-dark underline">Tamamlandı</button>
                    </form>
                  ) : null}
                  <form action={rescheduleAppointmentForm} className="flex flex-wrap gap-1">
                    <input type="hidden" name="id" value={item.id} />
                    <input
                      type="date"
                      name="ymd"
                      defaultValue={ymdInIstanbul(item.startAt)}
                      className="rounded border border-cream-dark px-1"
                    />
                    <input
                      type="time"
                      name="time"
                      defaultValue={hmFromDate(item.startAt)}
                      className="rounded border border-cream-dark px-1"
                    />
                    <button className="underline">Ertele</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
