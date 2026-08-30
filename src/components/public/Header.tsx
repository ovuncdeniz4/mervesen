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
    <header className="sticky top-0 z-40 border-b border-cream-dark/80 bg-cream/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <BrandLink clinic={clinic} />
        <nav className="hidden items-center gap-6 text-sm text-ink-soft lg:flex">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-sage-dark">
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/randevu"
          className="rounded-full bg-sage px-4 py-2 text-sm font-medium text-white hover:bg-sage-dark"
        >
          Randevu al
        </Link>
      </div>
      <nav className="flex flex-wrap gap-x-4 gap-y-2 border-t border-cream-dark/60 px-4 py-2 text-sm text-ink-soft lg:hidden">
        {nav.map((item) => (
          <Link key={item.href} href={item.href} className="hover:text-sage-dark">
            {item.label}
          </Link>
        ))}
        {instagram ? (
          <a href={instagram} target="_blank" rel="noreferrer" className="hover:text-sage-dark">
            Instagram
          </a>
        ) : null}
      </nav>
    </header>
  );
}
