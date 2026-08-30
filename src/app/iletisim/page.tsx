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
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2">
        <div>
          <h1 className="font-serif text-4xl text-sage-dark sm:text-5xl">İletişim</h1>
          <p className="mt-4 text-ink-soft">{clinic.address}</p>
          {tel ? (
            <p className="mt-3">
              <a href={tel} className="text-sage-dark underline">
                {clinic.phone}
              </a>
            </p>
          ) : null}
          {clinic.instagramUrl ? (
            <p className="mt-2">
              <a href={clinic.instagramUrl} className="text-sage-dark underline" target="_blank" rel="noreferrer">
                Instagram · @dtmervesen
              </a>
            </p>
          ) : null}
          {clinic.email ? (
            <p className="mt-4">
              <a href={`mailto:${clinic.email}`} className="text-sage-dark underline">
                {clinic.email}
              </a>
            </p>
          ) : null}
          <a href={clinic.mapsUrl} className="mt-4 inline-block text-sage-dark underline" target="_blank" rel="noreferrer">
            Google Haritalar
          </a>
          <dl className="mt-8 max-w-sm space-y-1 text-sm">
            {hours.map((row) => (
              <div key={row.weekday} className="flex justify-between gap-6">
                <dt>{weekdayLabel(row.weekday)}</dt>
                <dd className="text-ink-soft">
                  {row.closed
                    ? "Kapalı"
                    : `${row.startTime}–${row.endTime}${row.breakStart ? ` (ara ${row.breakStart}–${row.breakEnd})` : ""}`}
                </dd>
              </div>
            ))}
          </dl>
          <div className="mt-8 overflow-hidden rounded-3xl ring-1 ring-cream-dark">
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
          <h2 className="font-serif text-3xl text-sage-dark">Yazın</h2>
          <p className="mt-2 mb-6 text-ink-soft">Randevu dışı sorularınız için formu doldurun.</p>
          <ContactForm />
        </div>
      </div>
      <GoogleReviews mapsUrl={clinic.mapsUrl} />
    </PublicShell>
  );
}
