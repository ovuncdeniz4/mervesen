import Link from "next/link";
import Image from "next/image";
import type { ClinicSettings } from "@prisma/client";
import { publicImageExists } from "@/lib/public-image";

/** Anasayfa hero: metin her genişlikte siyah zeminin üstünde, sağda işlenmemiş portre. */
export function HomeHero({ clinic }: { clinic: ClinicSettings }) {
  const portraitSrc = "/images/doctor/hero.jpg";
  const hasPortrait = publicImageExists(portraitSrc);
  const alt = `${clinic.doctorName}, dental lup ile tedavi sırasında`;

  return (
    <section className="relative overflow-hidden bg-[#020202] text-cream">
      <div className="grid min-h-[calc(100svh-5rem)] lg:grid-cols-2">
        <div className="order-2 flex items-center px-4 py-10 sm:px-6 lg:order-1 lg:pl-[max(1.5rem,calc((100vw-72rem)/2+1.5rem))] lg:pr-10">
          <div className="max-w-xl">
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
        <div className="relative order-1 min-h-[22rem] lg:order-2 lg:min-h-full">
          {hasPortrait ? (
            <Image
              src={portraitSrc}
              alt={alt}
              fill
              className="object-contain object-center"
              sizes="(min-width: 1024px) 50vw, 100vw"
              priority
            />
          ) : (
            <div className="flex h-full min-h-[22rem] items-center p-8">
              <div>
                <p className="font-serif text-3xl text-white">{clinic.doctorName}</p>
                <p className="mt-4 text-sm leading-relaxed text-cream/70">{clinic.aboutShort}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
