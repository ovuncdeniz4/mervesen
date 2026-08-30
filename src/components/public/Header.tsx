import Link from "next/link";
import type { ClinicSettings } from "@prisma/client";
import { telLink, whatsappLink } from "@/lib/clinic";

const nav = [
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/hizmetler", label: "Hizmetler" },
  { href: "/randevu", label: "Randevu" },
  { href: "/sss", label: "SSS" },
  { href: "/iletisim", label: "İletişim" },
];

export function Header({ clinic }: { clinic: ClinicSettings }) {
  const tel = telLink(clinic.phone);
  const wa = whatsappLink(clinic.whatsapp, "Merhaba, randevu için yazıyorum.");
  const instagram = clinic.instagramUrl;

  return (
    <header className="sticky top-0 z-40 border-b border-cream-dark/80 bg-cream/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="min-w-0">
          <span className="font-serif text-xl leading-none text-sage-dark sm:text-2xl">
            {clinic.doctorName}
          </span>
          <span className="mt-0.5 block text-[11px] uppercase tracking-[0.18em] text-ink-soft">
            Diş hekimi · Bayraklı
          </span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-ink-soft lg:flex">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-sage-dark">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          {wa ? (
            <a
              href={wa}
              target="_blank"
              rel="noreferrer"
              className="hidden rounded-full bg-[#25D366] px-3 py-2 text-xs font-medium text-white sm:inline-flex"
            >
              WhatsApp
            </a>
          ) : null}
          {tel ? (
            <a href={tel} className="hidden rounded-full border border-sage px-3 py-2 text-xs font-medium text-sage-dark sm:inline-flex">
              Ara
            </a>
          ) : null}
          <Link
            href="/randevu"
            className="rounded-full bg-sage px-4 py-2 text-sm font-medium text-white hover:bg-sage-dark"
          >
            Randevu al
          </Link>
        </div>
      </div>
      <nav className="flex gap-4 overflow-x-auto border-t border-cream-dark/60 px-4 py-2 text-sm text-ink-soft lg:hidden">
        {nav.map((item) => (
          <Link key={item.href} href={item.href} className="whitespace-nowrap hover:text-sage-dark">
            {item.label}
          </Link>
        ))}
        {instagram ? (
          <a href={instagram} target="_blank" rel="noreferrer" className="whitespace-nowrap hover:text-sage-dark">
            Instagram
          </a>
        ) : null}
      </nav>
    </header>
  );
}
