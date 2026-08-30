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

      <section className="bg-ivory">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-serif text-3xl text-espresso sm:text-4xl">Tedaviler</h2>
            <Link href="/hizmetler" className="text-sm text-espresso underline decoration-champagne underline-offset-4">
              Tümünü gör
            </Link>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((service) => {
              const imageSrc = serviceImageSrc(service.slug, service.imagePath);
              return (
              <Link
                key={service.id}
                href={`/hizmetler/${service.slug}`}
                className="overflow-hidden rounded-lg border border-champagne bg-paper transition-colors hover:border-taupe"
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
                  <h3 className="font-serif text-2xl text-espresso">{service.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{service.summary}</p>
                </span>
              </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 sm:py-24 lg:grid-cols-2">
        <div>
          <h2 className="font-serif text-3xl text-espresso">Hekim</h2>
          <Prose text={clinic.aboutShort} className="mt-5" />
          <Link href="/hakkimizda" className="mt-8 inline-block text-espresso underline decoration-champagne underline-offset-4">
            Kliniği tanı
          </Link>
        </div>
        <div className="rounded-lg border border-champagne bg-paper p-8">
          <h2 className="font-serif text-3xl text-espresso">Çalışma saatleri</h2>
          <dl className="mt-6 space-y-2 text-sm">
            {hours.map((row) => (
              <div key={row.weekday} className="flex justify-between gap-4 border-b border-champagne/70 py-1.5">
                <dt>{weekdayLabel(row.weekday)}</dt>
                <dd className="text-muted">{row.closed ? "Kapalı" : `${row.startTime}–${row.endTime}`}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
        <h2 className="font-serif text-3xl text-espresso">Klinik</h2>
        <p className="mt-3 max-w-2xl text-muted">{clinic.address}</p>
        <div className="mt-8">
          <ClinicGallery />
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={clinic.mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-md bg-burgundy px-5 py-2.5 text-ivory transition-colors hover:bg-champagne hover:text-espresso"
          >
            Haritada aç
          </a>
          <Link
            href="/iletisim"
            className="rounded-md border border-champagne px-5 py-2.5 text-espresso transition-colors hover:border-taupe hover:bg-champagne/40"
          >
            İletişim
          </Link>
        </div>
      </section>

      <GoogleReviews mapsUrl={clinic.mapsUrl} />
      <InstagramSection instagramUrl={clinic.instagramUrl} />
    </PublicShell>
  );
}
