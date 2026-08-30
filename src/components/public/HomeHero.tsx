import Link from "next/link";
import Image from "next/image";
import type { ClinicSettings } from "@prisma/client";
import { publicImageExists } from "@/lib/public-image";

/** Anasayfa hero: metin solda, portre sağda; siyah→espresso kayması fotoğrafın dışında. */
export function HomeHero({ clinic }: { clinic: ClinicSettings }) {
  const portraitSrc = "/images/doctor/hero.jpg";
  const hasPortrait = publicImageExists(portraitSrc);
  const alt = `${clinic.doctorName}, dental lup ile tedavi sırasında`;

  return (
    <section className="relative overflow-hidden bg-espresso text-ivory">
      <div className="grid lg:min-h-[calc(100svh-4.75rem)] lg:grid-cols-2">
        <div className="order-2 flex items-center px-4 py-8 sm:px-6 lg:order-1 lg:py-16 lg:pl-[max(1.5rem,calc((100vw-72rem)/2+1.5rem))] lg:pr-8">
          <div className="max-w-xl">
            <p className="text-sm uppercase tracking-[0.22em] text-champagne">Bayraklı · Manavkuyu</p>
            <h1 className="mt-4 font-serif text-4xl leading-[1.12] text-ivory sm:text-6xl">
              Gülüşünüz için acele etmeyen bir muayenehane.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-champagne sm:text-lg">{clinic.tagline}</p>
            <div className="mt-8 flex flex-wrap gap-3">
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

        <div className="order-1 flex flex-col lg:order-2 lg:min-h-full lg:flex-row">
          {hasPortrait ? (
            <>
              <div
                aria-hidden
                className="hidden w-16 shrink-0 bg-gradient-to-r from-espresso to-[#050505] sm:w-20 lg:block"
              />
              <div className="relative h-[min(46svh,22rem)] w-full bg-[#050505] lg:h-auto lg:min-h-full">
                <Image
                  src={portraitSrc}
                  alt={alt}
                  fill
                  className="object-contain object-center"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  priority
                />
              </div>
              <div aria-hidden className="h-12 shrink-0 bg-gradient-to-b from-[#050505] to-espresso lg:hidden" />
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
