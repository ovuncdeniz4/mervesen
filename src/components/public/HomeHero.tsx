import Link from "next/link";
import Image from "next/image";
import type { ClinicSettings } from "@prisma/client";
import { publicImageExists } from "@/lib/public-image";

/** Anasayfa hero: krem/sage palet, orijinal lup portresi (kırpılmaz, solma yok). */
export function HomeHero({ clinic }: { clinic: ClinicSettings }) {
  const portraitSrc = "/images/doctor/hero.jpg";
  const hasPortrait = publicImageExists(portraitSrc);

  return (
    <section className="bg-cream">
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-8 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:py-10">
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
        {hasPortrait ? (
          <div className="flex justify-center lg:justify-end">
            <Image
              src={portraitSrc}
              alt={`${clinic.doctorName}, dental lup ile tedavi sırasında`}
              width={900}
              height={1600}
              className="h-auto w-full max-h-[min(36rem,calc(100svh-6rem))] max-w-md object-contain object-center lg:max-w-none"
              sizes="(min-width: 1024px) 40vw, 100vw"
              priority
            />
          </div>
        ) : (
          <div className="rounded-[2rem] bg-sage-dark p-8 text-sage-light">
            <p className="font-serif text-3xl text-white">{clinic.doctorName}</p>
            <p className="mt-4 text-sm leading-relaxed text-sage-light/80">{clinic.aboutShort}</p>
          </div>
        )}
      </div>
    </section>
  );
}
