import type { Metadata } from "next";
import { getClinicSettings, getWorkingHours, telLink } from "@/lib/clinic";
import { PublicShell } from "@/components/public/PublicShell";
import { ContactForm } from "@/components/contact/ContactForm";
import { GoogleReviews } from "@/components/public/GoogleReviews";
import { weekdayLabel } from "@/lib/dates";

export const metadata: Metadata = { title: "İletişim" };

export default async function ContactPage() {
  const [clinic, hours] = await Promise.all([getClinicSettings(), getWorkingHours()]);
  const tel = telLink(clinic.phone);

  return (
    <PublicShell clinic={clinic}>
      <div className="mx-auto grid max-w-6xl gap-14 px-4 py-20 sm:px-6 sm:py-24 lg:grid-cols-2">
        <div>
          <h1 className="font-serif text-4xl text-espresso sm:text-5xl">İletişim</h1>
          <p className="mt-5 text-muted">{clinic.address}</p>
          {tel ? (
            <p className="mt-3">
              <a href={tel} className="text-espresso underline decoration-champagne underline-offset-4">
                {clinic.phone}
              </a>
            </p>
          ) : null}
          {clinic.instagramUrl ? (
            <p className="mt-2">
              <a href={clinic.instagramUrl} className="text-espresso underline decoration-champagne underline-offset-4" target="_blank" rel="noreferrer">
                Instagram · @dtmervesen
              </a>
            </p>
          ) : null}
          {clinic.email ? (
            <p className="mt-4">
              <a href={`mailto:${clinic.email}`} className="text-espresso underline decoration-champagne underline-offset-4">
                {clinic.email}
              </a>
            </p>
          ) : null}
          <a href={clinic.mapsUrl} className="mt-4 inline-block text-espresso underline decoration-champagne underline-offset-4" target="_blank" rel="noreferrer">
            Google Haritalar
          </a>
          <dl className="mt-10 max-w-sm space-y-1.5 text-sm">
            {hours.map((row) => (
              <div key={row.weekday} className="flex justify-between gap-6">
                <dt>{weekdayLabel(row.weekday)}</dt>
                <dd className="text-muted">
                  {row.closed
                    ? "Kapalı"
                    : `${row.startTime}–${row.endTime}${row.breakStart ? ` (ara ${row.breakStart}–${row.breakEnd})` : ""}`}
                </dd>
              </div>
            ))}
          </dl>
          <div className="mt-10 overflow-hidden rounded-lg border border-champagne">
            <iframe
              title="Klinik konumu"
              src={clinic.mapsEmbedUrl}
              className="h-72 w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
        <div>
          <h2 className="font-serif text-3xl text-espresso">Yazın</h2>
          <p className="mt-3 mb-8 text-muted">Randevu dışı sorularınız için formu doldurun.</p>
          <ContactForm />
        </div>
      </div>
      <GoogleReviews mapsUrl={clinic.mapsUrl} />
    </PublicShell>
  );
}
