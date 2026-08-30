import Link from "next/link";
import Image from "next/image";
import type { ClinicSettings } from "@prisma/client";
import { publicImageExists } from "@/lib/public-image";

const LOGO = "/images/brand/logo.png";

/** Klinik logosu; tıklanınca anasayfaya gider. */
export function BrandLink({
  clinic,
  variant = "header",
}: {
  clinic: ClinicSettings;
  variant?: "header" | "footer";
}) {
  const hasLogo = publicImageExists(LOGO);
  const inverted = variant === "footer";

  if (!hasLogo) {
    return (
      <Link href="/" className="min-w-0">
        <span className={`font-serif text-xl leading-none sm:text-2xl ${inverted ? "text-white" : "text-sage-dark"}`}>
          {clinic.doctorName}
        </span>
        <span className={`mt-0.5 block text-[11px] uppercase tracking-[0.18em] ${inverted ? "text-sage-light/80" : "text-ink-soft"}`}>
          Diş hekimi · Bayraklı
        </span>
      </Link>
    );
  }

  return (
    <Link href="/" className="flex shrink-0 items-center">
      <Image
        src={LOGO}
        alt={clinic.clinicName}
        width={1160}
        height={1133}
        className={`h-14 w-auto sm:h-16 ${inverted ? "brightness-0 invert" : ""}`}
        sizes="160px"
        priority={variant === "header"}
      />
    </Link>
  );
}
