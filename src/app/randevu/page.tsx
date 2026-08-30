import type { Metadata } from "next";
import { getClinicSettings } from "@/lib/clinic";
import { PublicShell } from "@/components/public/PublicShell";
import { BookingWizard } from "@/components/booking/BookingWizard";

export const metadata: Metadata = { title: "Randevu" };

export default async function BookingPage() {
  const clinic = await getClinicSettings();

  return (
    <PublicShell clinic={clinic}>
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h1 className="font-serif text-4xl text-sage-dark sm:text-5xl">Online randevu</h1>
        <p className="mt-3 max-w-2xl text-ink-soft">
          Ad soyad ve telefon bilgilerinizi yazın, takvimden uygun boş saati seçin. Hizmet seçimi gerekmez; tedavi
          planı muayenede birlikte belirlenir. Yazmak veya aramak için sağ alttaki düğmeleri kullanabilirsiniz.
        </p>
        <div className="mt-10">
          <BookingWizard />
        </div>
      </div>
    </PublicShell>
  );
}
