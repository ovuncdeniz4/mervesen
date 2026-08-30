import Link from "next/link";
import { getClinicSettings, getPublishedServices, getWorkingHours, telLink } from "@/lib/clinic";
import { PublicShell, Prose } from "@/components/public/PublicShell";
import { LocalBusinessJsonLd } from "@/components/public/LocalBusinessJsonLd";
import { weekdayLabel } from "@/lib/dates";

export default async function HomePage() {
  const [clinic, services, hours] = await Promise.all([
    getClinicSettings(),
    getPublishedServices(),
    getWorkingHours(),
  ]);
  const featured = services.filter((item) => item.featured).slice(0, 6);
  const tel = telLink(clinic.phone);

  return (
    <PublicShell clinic={clinic}>
      <LocalBusinessJsonLd clinic={clinic} />
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-gold">Bayraklı · Manavkuyu</p>
            <h1 className="mt-3 font-serif text-4xl leading-tight text-sage-dark sm:text-6xl">
              Gülüşünüz için acele etmeyen bir muayenehane.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-soft">{clinic.tagline}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/randevu" className="rounded-full bg-sage px-6 py-3 text-white hover:bg-sage-dark">
                Randevu al
              </Link>
              <Link href="/hizmetler" className="rounded-full border border-sage/40 px-6 py-3 text-sage-dark">
                Tedavilere bak
              </Link>
            </div>
          </div>
          <div className="relative rounded-[2rem] bg-sage-dark p-8 text-sage-light shadow-xl">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gold/20" />
            <p className="font-serif text-3xl text-white">{clinic.doctorName}</p>
            <p className="mt-4 text-sm leading-relaxed text-sage-light/80">{clinic.aboutShort}</p>
            <dl className="mt-8 space-y-2 text-sm">
              {hours.map((row) => (
                <div key={row.weekday} className="flex justify-between gap-4 border-b border-white/10 py-1">
                  <dt>{weekdayLabel(row.weekday)}</dt>
                  <dd>{row.closed ? "Kapalı" : `${row.startTime}–${row.endTime}`}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="bg-paper">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-serif text-3xl text-sage-dark sm:text-4xl">Tedaviler</h2>
            <Link href="/hizmetler" className="text-sm text-sage-dark underline">
              Tümünü gör
            </Link>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((service) => (
              <Link
                key={service.id}
                href={`/hizmetler/${service.slug}`}
                className="rounded-3xl border border-cream-dark bg-cream p-6 hover:border-sage/40"
              >
                <h3 className="font-serif text-2xl text-sage-dark">{service.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{service.summary}</p>
                <p className="mt-4 text-xs uppercase tracking-widest text-gold">{service.durationMin} dk</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2">
        <div>
          <h2 className="font-serif text-3xl text-sage-dark">Hekim</h2>
          <Prose text={clinic.doctorBio} className="mt-4" />
          <Link href="/hakkimizda" className="mt-6 inline-block text-sage-dark underline">
            Kliniği tanı
          </Link>
        </div>
        <div className="rounded-3xl bg-sage-light/40 p-8">
          <h2 className="font-serif text-3xl text-sage-dark">Konum</h2>
          <p className="mt-3 text-ink-soft">{clinic.address}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href={clinic.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-sage px-5 py-2 text-white"
            >
              Haritada aç
            </a>
            {tel ? (
              <a href={tel} className="rounded-full border border-sage px-5 py-2 text-sage-dark">
                {clinic.phone}
              </a>
            ) : (
              <Link href="/iletisim" className="rounded-full border border-sage px-5 py-2 text-sage-dark">
                İletişim
              </Link>
            )}
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
