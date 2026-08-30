import Link from "next/link";
import Image from "next/image";
import type { ClinicSettings } from "@prisma/client";
import { publicImageExists } from "@/lib/public-image";

/** Anasayfa hero: web’de siyah zemin metnin altında, sağda işlenmemiş portre. */
export function HomeHero({ clinic }: { clinic: ClinicSettings }) {
  const portraitSrc = "/images/doctor/hero.jpg";
  const hasPortrait = publicImageExists(portraitSrc);
  const alt = `${clinic.doctorName}, dental lup ile tedavi sırasında`;

  return (
    <section>
      <div className="bg-cream lg:hidden">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <HeroCopy clinic={clinic} onDark={false} />
          {hasPortrait ? (
            <div className="mt-8 flex justify-center">
              <Image
                src={portraitSrc}
                alt={alt}
                width={900}
                height={1600}
                className="h-auto w-full max-h-[min(36rem,calc(100svh-6rem))] max-w-md object-contain"
                sizes="100vw"
                priority
              />
            </div>
          ) : (
            <HeroFallback clinic={clinic} />
          )}
        </div>
      </div>

      <div className="relative hidden overflow-hidden bg-[#020202] lg:block">
        {hasPortrait ? (
          <div className="pointer-events-none absolute inset-y-0 right-0 w-[min(46vw,38rem)]">
            <Image
              src={portraitSrc}
              alt={alt}
              fill
              className="object-contain object-center"
              sizes="46vw"
              priority
            />
          </div>
        ) : null}
        <div className="relative mx-auto flex min-h-[calc(100svh-4.75rem)] max-w-6xl items-center px-6 py-10">
          <div className="max-w-xl">
            <HeroCopy clinic={clinic} onDark />
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroCopy({ clinic, onDark }: { clinic: ClinicSettings; onDark: boolean }) {
  return (
    <div>
      <p className="text-sm uppercase tracking-[0.22em] text-gold">Bayraklı · Manavkuyu</p>
      <h1
        className={`mt-3 font-serif text-4xl leading-tight sm:text-6xl ${
          onDark ? "text-cream" : "text-sage-dark"
        }`}
      >
        Gülüşünüz için acele etmeyen bir muayenehane.
      </h1>
      <p className={`mt-5 max-w-xl text-lg leading-relaxed ${onDark ? "text-cream/75" : "text-ink-soft"}`}>
        {clinic.tagline}
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/randevu" className="rounded-full bg-sage px-6 py-3 text-white hover:bg-sage-dark">
          Randevu al
        </Link>
        <Link
          href="/iletisim"
          className={
            onDark
              ? "rounded-full border border-cream/35 px-6 py-3 text-cream hover:border-cream"
              : "rounded-full border border-sage/40 px-6 py-3 text-sage-dark"
          }
        >
          İletişim
        </Link>
      </div>
    </div>
  );
}

function HeroFallback({ clinic }: { clinic: ClinicSettings }) {
  return (
    <div className="mt-8 rounded-[2rem] bg-sage-dark p-8 text-sage-light">
      <p className="font-serif text-3xl text-white">{clinic.doctorName}</p>
      <p className="mt-4 text-sm leading-relaxed text-sage-light/80">{clinic.aboutShort}</p>
    </div>
  );
}
