import Link from "next/link";
import Image from "next/image";
import type { ClinicSettings } from "@prisma/client";
import { publicImageExists } from "@/lib/public-image";

const LOGO = "/images/brand/logo.png";

/** Diş ikonu + mevcut marka yazısı; tıklanınca anasayfaya gider. */
export function BrandLink({
  clinic,
  variant = "header",
}: {
  clinic: ClinicSettings;
  variant?: "header" | "footer";
}) {
  const hasLogo = publicImageExists(LOGO);
  const inverted = variant === "footer";

  return (
    <Link href="/" className="flex min-w-0 items-center gap-3">
      {hasLogo ? (
        <Image
          src={LOGO}
          alt=""
          width={286}
          height={271}
          className={`h-10 w-auto shrink-0 sm:h-11 ${inverted ? "brightness-0 invert" : ""}`}
          sizes="44px"
          priority={variant === "header"}
        />
      ) : null}
      <span className="min-w-0">
        {variant === "footer" ? (
          <span className="block font-serif text-2xl leading-none text-white">{clinic.clinicName}</span>
        ) : (
          <>
            <span className="block font-serif text-xl leading-none text-sage-dark sm:text-2xl">
              {clinic.doctorName}
            </span>
            <span className="mt-0.5 block text-[11px] uppercase tracking-[0.18em] text-ink-soft">
              Diş hekimi · Bayraklı
            </span>
          </>
        )}
      </span>
    </Link>
  );
}
