import Link from "next/link";
import Image from "next/image";
import type { ClinicSettings } from "@prisma/client";
import { publicImageExists } from "@/lib/public-image";

/** Anasayfa hero: espresso zemin, solda metin, sağda yatay aynalanmış lup portresi. */
export function HomeHero({ clinic }: { clinic: ClinicSettings }) {
  const portraitSrc = "/images/doctor/hero.jpg";
  const hasPortrait = publicImageExists(portraitSrc);
  const alt = `${clinic.doctorName}, dental lup ile tedavi sırasında`;

  return (
    <section className="relative overflow-hidden bg-espresso text-ivory">
      <div className="grid lg:min-h-[calc(100svh-4.75rem)] lg:grid-cols-2">
        <div className="order-2 flex items-center px-4 py-12 sm:px-6 lg:order-1 lg:py-16 lg:pl-[max(1.5rem,calc((100vw-72rem)/2+1.5rem))] lg:pr-12">
          <div className="max-w-xl">
            <p className="text-sm uppercase tracking-[0.22em] text-champagne">Bayraklı · Manavkuyu</p>
            <h1 className="mt-4 font-serif text-4xl leading-[1.12] text-ivory sm:text-6xl">
              Gülüşünüz için acele etmeyen bir muayenehane.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-champagne">{clinic.tagline}</p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/randevu"
                className="rounded-md bg-burgundy px-6 py-3 text-ivory transition-colors hover:bg-champagne hover:text-espresso"
              >
                Randevu al
              </Link>
              <Link
                href="/iletisim"
                className="rounded-md border border-champagne/50 px-6 py-3 text-ivory transition-colors hover:border-ivory hover:bg-ivory/5"
              >
                İletişim
              </Link>
            </div>
          </div>
        </div>
        <div className="relative order-1 h-[min(62svh,36rem)] w-full lg:order-2 lg:h-auto lg:min-h-full">
          {hasPortrait ? (
            <>
              <Image
                src={portraitSrc}
                alt={alt}
                fill
                className="object-contain object-center"
                sizes="(min-width: 1024px) 50vw, 100vw"
                priority
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-y-0 left-0 hidden w-16 bg-gradient-to-r from-espresso to-transparent lg:block"
              />
            </>
          ) : (
            <div className="flex h-full min-h-[22rem] items-center p-8">
              <div>
                <p className="font-serif text-3xl text-ivory">{clinic.doctorName}</p>
                <p className="mt-4 text-sm leading-relaxed text-champagne">{clinic.aboutShort}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
