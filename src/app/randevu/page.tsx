import type { Metadata } from "next";
import { getClinicSettings } from "@/lib/clinic";
import { PublicShell } from "@/components/public/PublicShell";
import { BookingWizard } from "@/components/booking/BookingWizard";

export const metadata: Metadata = { title: "Randevu" };

export default async function BookingPage() {
  const clinic = await getClinicSettings();

  return (
    <PublicShell clinic={clinic}>
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
        <h1 className="font-serif text-4xl text-espresso sm:text-5xl">Online randevu</h1>
        <p className="mt-4 max-w-2xl text-muted">
          Ad soyad ve telefon bilgilerinizi yazın, takvimden uygun boş saati seçin. Hizmet seçimi gerekmez; tedavi
          planı muayenede birlikte belirlenir. Yazmak veya aramak için sağ alttaki düğmeleri kullanabilirsiniz.
        </p>
        <div className="mt-12">
          <BookingWizard />
        </div>
      </div>
    </PublicShell>
  );
}
