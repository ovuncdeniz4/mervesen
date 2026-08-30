import type { Metadata } from "next";
import { getClinicSettings, getPublishedServices, whatsappLink } from "@/lib/clinic";
import { PublicShell } from "@/components/public/PublicShell";
import { BookingWizard } from "@/components/booking/BookingWizard";

export const metadata: Metadata = { title: "Randevu" };

export default async function BookingPage() {
  const [clinic, services] = await Promise.all([getClinicSettings(), getPublishedServices()]);
  return (
    <PublicShell clinic={clinic}>
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h1 className="font-serif text-4xl text-sage-dark sm:text-5xl">Online randevu</h1>
        <p className="mt-3 max-w-2xl text-ink-soft">
          Müsait saati seçtiğiniz anda randevunuz oluşur. En az {clinic.minNoticeHours} saat sonrası ve en fazla{" "}
          {clinic.maxAdvanceDays} gün ilerisi için slot açılır.
        </p>
        <div className="mt-10">
          <BookingWizard
            services={services}
            whatsappHref={whatsappLink(clinic.whatsapp, "Randevum hakkında yazıyorum.")}
          />
        </div>
      </div>
    </PublicShell>
  );
}
