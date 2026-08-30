import Link from "next/link";
import type { ClinicSettings } from "@prisma/client";
import { telLink, whatsappLink } from "@/lib/clinic";

export function Footer({ clinic }: { clinic: ClinicSettings }) {
  const tel = telLink(clinic.phone);
  const wa = whatsappLink(clinic.whatsapp, "Merhaba, randevu için yazıyorum.");
  return (
    <footer className="mt-auto border-t border-cream-dark bg-sage-dark text-sage-light">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3 sm:px-6">
        <div>
          <p className="font-serif text-2xl text-white">{clinic.clinicName}</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-sage-light/80">{clinic.tagline}</p>
        </div>
        <div className="text-sm leading-relaxed">
          <p className="mb-2 uppercase tracking-widest text-gold">Adres</p>
          <p>{clinic.address}</p>
          {tel ? (
            <p className="mt-2">
              <a href={tel} className="hover:text-white">
                {clinic.phone}
              </a>
            </p>
          ) : null}
          {wa ? (
            <p className="mt-1">
              <a href={wa} className="hover:text-white" target="_blank" rel="noreferrer">
                WhatsApp ile yazın
              </a>
            </p>
          ) : null}
          {clinic.instagramUrl ? (
            <p className="mt-1">
              <a href={clinic.instagramUrl} className="hover:text-white" target="_blank" rel="noreferrer">
                Instagram · @dtmervesen
              </a>
            </p>
          ) : null}
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <p className="mb-2 uppercase tracking-widest text-gold">Sayfalar</p>
          <Link href="/hizmetler" className="hover:text-white">
            Tedaviler
          </Link>
          <Link href="/randevu" className="hover:text-white">
            Online randevu
          </Link>
          <Link href="/kvkk" className="hover:text-white">
            KVKK
          </Link>
          <Link href="/admin/login" className="hover:text-white">
            Yönetim
          </Link>
        </div>
      </div>
      <p className="border-t border-white/10 py-4 text-center text-xs text-sage-light/70">
        © {new Date().getFullYear()} {clinic.clinicName}
      </p>
    </footer>
  );
}
