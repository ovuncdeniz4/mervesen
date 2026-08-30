import Link from "next/link";
import type { ClinicSettings } from "@prisma/client";
import { BrandLink } from "@/components/public/BrandLink";

const nav = [
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/hizmetler", label: "Hizmetler" },
  { href: "/randevu", label: "Randevu" },
  { href: "/sss", label: "SSS" },
  { href: "/iletisim", label: "İletişim" },
];

export function Header({ clinic }: { clinic: ClinicSettings }) {
  const instagram = clinic.instagramUrl;

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-espresso/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <BrandLink clinic={clinic} />
        <nav className="hidden items-center gap-7 text-sm tracking-wide text-champagne lg:flex">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-ivory">
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/randevu"
          className="rounded-md bg-burgundy px-4 py-2 text-sm font-medium text-ivory transition-colors hover:bg-champagne hover:text-espresso"
        >
          Randevu al
        </Link>
      </div>
      <nav className="flex flex-wrap gap-x-4 gap-y-2 border-t border-white/10 px-4 py-2 text-sm text-champagne lg:hidden">
        {nav.map((item) => (
          <Link key={item.href} href={item.href} className="hover:text-ivory">
            {item.label}
          </Link>
        ))}
        {instagram ? (
          <a href={instagram} target="_blank" rel="noreferrer" className="hover:text-ivory">
            Instagram
          </a>
        ) : null}
      </nav>
    </header>
  );
}
