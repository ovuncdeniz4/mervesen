import Link from "next/link";
import Image from "next/image";
import { getClinicSettings, getPublishedServices, getWorkingHours } from "@/lib/clinic";
import { PublicShell, Prose } from "@/components/public/PublicShell";
import { HomeHero } from "@/components/public/HomeHero";
import { LocalBusinessJsonLd } from "@/components/public/LocalBusinessJsonLd";
import { GoogleReviews } from "@/components/public/GoogleReviews";
import { InstagramSection } from "@/components/public/InstagramSection";
import { ClinicGallery } from "@/components/public/ClinicGallery";
import { weekdayLabel } from "@/lib/dates";
import { serviceImageSrc } from "@/lib/public-image";

export default async function HomePage() {
  const [clinic, services, hours] = await Promise.all([
    getClinicSettings(),
    getPublishedServices(),
    getWorkingHours(),
  ]);
  const featured = services.filter((item) => item.featured).slice(0, 6);

  return (
    <PublicShell clinic={clinic}>
      <LocalBusinessJsonLd clinic={clinic} />
      <HomeHero clinic={clinic} />

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
