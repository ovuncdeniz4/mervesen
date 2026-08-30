import Link from "next/link";
import Image from "next/image";
import { getClinicSettings, getPublishedServices, getWorkingHours } from "@/lib/clinic";
import { PublicShell, Prose } from "@/components/public/PublicShell";
import { LocalBusinessJsonLd } from "@/components/public/LocalBusinessJsonLd";
import { GoogleReviews } from "@/components/public/GoogleReviews";
import { InstagramSection } from "@/components/public/InstagramSection";
import { ClinicGallery } from "@/components/public/ClinicGallery";
import { weekdayLabel } from "@/lib/dates";
import { publicImageExists, serviceImageSrc } from "@/lib/public-image";

export default async function HomePage() {
  const [clinic, services, hours] = await Promise.all([
    getClinicSettings(),
    getPublishedServices(),
    getWorkingHours(),
  ]);
  const featured = services.filter((item) => item.featured).slice(0, 6);
  const heroPortrait = publicImageExists("/images/doctor/portrait-1.jpg");

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
              <Link href="/iletisim" className="rounded-full border border-sage/40 px-6 py-3 text-sage-dark">
                İletişim
              </Link>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-[2rem] bg-sage-dark shadow-xl">
            {heroPortrait ? (
              <div className="relative aspect-[4/5] min-h-[22rem]">
                <Image
                  src="/images/doctor/portrait-1.jpg"
                  alt={clinic.doctorName}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  priority
                />
              </div>
            ) : (
              <div className="p-8 text-sage-light">
                <p className="font-serif text-3xl text-white">{clinic.doctorName}</p>
                <p className="mt-4 text-sm leading-relaxed text-sage-light/80">{clinic.aboutShort}</p>
              </div>
            )}
            {heroPortrait ? (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-sage-dark/90 to-transparent p-6 text-white">
                <p className="font-serif text-3xl">{clinic.doctorName}</p>
                <p className="mt-2 text-sm leading-relaxed text-sage-light/90">{clinic.aboutShort}</p>
              </div>
            ) : null}
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
            {featured.map((service) => {
              const imageSrc = serviceImageSrc(service.slug, service.imagePath);
              return (
              <Link
                key={service.id}
                href={`/hizmetler/${service.slug}`}
                className="overflow-hidden rounded-3xl border border-cream-dark bg-cream hover:border-sage/40"
              >
                {imageSrc ? (
                  <span className="relative block aspect-[16/10]">
                    <Image
                      src={imageSrc}
                      alt={service.name}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 30vw, 100vw"
                    />
                  </span>
                ) : null}
                <span className="block p-6">
                  <h3 className="font-serif text-2xl text-sage-dark">{service.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{service.summary}</p>
                </span>
              </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2">
        <div>
          <h2 className="font-serif text-3xl text-sage-dark">Hekim</h2>
          <Prose text={clinic.aboutShort} className="mt-4" />
          <Link href="/hakkimizda" className="mt-6 inline-block text-sage-dark underline">
            Kliniği tanı
          </Link>
        </div>
        <div className="rounded-3xl bg-sage-light/40 p-8">
          <h2 className="font-serif text-3xl text-sage-dark">Çalışma saatleri</h2>
          <dl className="mt-5 space-y-2 text-sm">
            {hours.map((row) => (
              <div key={row.weekday} className="flex justify-between gap-4 border-b border-sage/15 py-1">
                <dt>{weekdayLabel(row.weekday)}</dt>
                <dd>{row.closed ? "Kapalı" : `${row.startTime}–${row.endTime}`}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-8 sm:px-6">
        <h2 className="font-serif text-3xl text-sage-dark">Klinik</h2>
        <p className="mt-2 max-w-2xl text-ink-soft">{clinic.address}</p>
        <div className="mt-6">
          <ClinicGallery />
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href={clinic.mapsUrl} target="_blank" rel="noreferrer" className="rounded-full bg-sage px-5 py-2 text-white">
            Haritada aç
          </a>
          <Link href="/iletisim" className="rounded-full border border-sage px-5 py-2 text-sage-dark">
            İletişim
          </Link>
        </div>
      </section>

      <GoogleReviews mapsUrl={clinic.mapsUrl} />
      <InstagramSection instagramUrl={clinic.instagramUrl} />
    </PublicShell>
  );
}
