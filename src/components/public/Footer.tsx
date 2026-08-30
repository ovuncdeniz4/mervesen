import Link from "next/link";
import type { ClinicSettings } from "@prisma/client";
import { telLink, whatsappLink } from "@/lib/clinic";
import { BrandLink } from "@/components/public/BrandLink";

export function Footer({ clinic }: { clinic: ClinicSettings }) {
  const tel = telLink(clinic.phone);
  const wa = whatsappLink(clinic.whatsapp, "Merhaba, randevu için yazıyorum.");
  return (
    <footer className="mt-auto border-t border-white/10 bg-espresso text-champagne">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-3 sm:px-6">
        <div>
          <BrandLink clinic={clinic} variant="footer" />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-champagne/80">{clinic.tagline}</p>
        </div>
        <div className="text-sm leading-relaxed">
          <p className="mb-3 text-xs uppercase tracking-[0.2em] text-taupe">Adres</p>
          <p>{clinic.address}</p>
          {tel ? (
            <p className="mt-2">
              <a href={tel} className="hover:text-ivory">
                {clinic.phone}
              </a>
            </p>
          ) : null}
          {wa ? (
            <p className="mt-1">
              <a href={wa} className="hover:text-ivory" target="_blank" rel="noreferrer">
                WhatsApp ile yazın
              </a>
            </p>
          ) : null}
          {clinic.instagramUrl ? (
            <p className="mt-1">
              <a href={clinic.instagramUrl} className="hover:text-ivory" target="_blank" rel="noreferrer">
                Instagram · @dtmervesen
              </a>
            </p>
          ) : null}
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <p className="mb-3 text-xs uppercase tracking-[0.2em] text-taupe">Sayfalar</p>
          <Link href="/hizmetler" className="hover:text-ivory">
            Tedaviler
          </Link>
          <Link href="/randevu" className="hover:text-ivory">
            Online randevu
          </Link>
          <Link href="/kvkk" className="hover:text-ivory">
            KVKK
          </Link>
          <Link href="/admin/login" className="hover:text-ivory">
            Yönetim
          </Link>
        </div>
      </div>
      <p className="border-t border-white/10 py-4 text-center text-xs text-champagne/70">
        © {new Date().getFullYear()} {clinic.clinicName}
      </p>
    </footer>
  );
}
