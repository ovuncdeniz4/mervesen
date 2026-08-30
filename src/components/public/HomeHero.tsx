import Link from "next/link";
import Image from "next/image";
import type { ClinicSettings } from "@prisma/client";
import { publicImageExists } from "@/lib/public-image";

/**
 * Anasayfa hero: lup portresi sağda durur, sol siyah tonlarda uzar;
 * metin uzatılan alana oturur. Üst padding kısadır; yüz kırpılmaz.
 */
export function HomeHero({ clinic }: { clinic: ClinicSettings }) {
  const portraitSrc = "/images/doctor/hero.jpg";
  const wideSrc = "/images/doctor/hero-wide.jpg";
  const hasPortrait = publicImageExists(portraitSrc);
  const hasWide = publicImageExists(wideSrc);
  const desktopSrc = hasWide ? wideSrc : portraitSrc;

  return (
    <section className="relative overflow-hidden bg-[#050505] text-cream">
      {hasPortrait ? (
        <>
          <div className="relative md:hidden">
            <Image
              src={portraitSrc}
              alt={`${clinic.doctorName}, dental lup ile tedavi sırasında`}
              width={900}
              height={1600}
              className="h-auto w-full"
              sizes="100vw"
              priority
            />
          </div>
          <div className="pointer-events-none absolute inset-0 hidden md:block">
            <Image
              src={desktopSrc}
              alt={`${clinic.doctorName}, dental lup ile tedavi sırasında`}
              fill
              className="object-contain object-right"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-y-0 left-0 w-[62%] bg-gradient-to-r from-black via-black/60 to-transparent" />
          </div>
        </>
      ) : null}

      <div
        className={`relative mx-auto flex max-w-6xl items-center px-4 py-8 sm:px-6 md:min-h-[calc(100svh-4.75rem)] md:py-10 ${
          hasPortrait ? "" : "min-h-[28rem]"
        }`}
      >
        <div className="max-w-md lg:max-w-xl">
          <p className="text-sm uppercase tracking-[0.22em] text-gold">Bayraklı · Manavkuyu</p>
          <h1 className="mt-3 font-serif text-4xl leading-tight text-cream sm:text-6xl">
            Gülüşünüz için acele etmeyen bir muayenehane.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-cream/75">{clinic.tagline}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/randevu" className="rounded-full bg-sage px-6 py-3 text-white hover:bg-sage-dark">
              Randevu al
            </Link>
            <Link
              href="/iletisim"
              className="rounded-full border border-cream/35 px-6 py-3 text-cream hover:border-cream"
            >
              İletişim
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
