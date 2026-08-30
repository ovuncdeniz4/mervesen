import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getClinicSettings, getPublishedServices } from "@/lib/clinic";
import { PublicShell } from "@/components/public/PublicShell";

export const metadata: Metadata = { title: "Hizmetler" };

export default async function ServicesPage() {
  const [clinic, services] = await Promise.all([getClinicSettings(), getPublishedServices()]);
  return (
    <PublicShell clinic={clinic}>
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h1 className="font-serif text-4xl text-sage-dark sm:text-5xl">Hizmetler</h1>
        <p className="mt-3 max-w-2xl text-ink-soft">
          Koruyucu bakımdan estetik ve cerrahi tedavilere kadar, tek hekimle planlanan uygulamalar. Tedavi süresi kişiden
          kişiye değiştiği için sitede süre belirtilmez; planlama muayenede birlikte yapılır.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Link
              key={service.id}
              href={`/hizmetler/${service.slug}`}
              className="overflow-hidden rounded-3xl bg-paper ring-1 ring-cream-dark hover:ring-sage/40"
            >
              {service.imagePath ? (
                <span className="relative block aspect-[16/10]">
                  <Image
                    src={service.imagePath}
                    alt={service.name}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 30vw, 100vw"
                  />
                </span>
              ) : null}
              <span className="block p-6">
                <h2 className="font-serif text-2xl text-sage-dark">{service.name}</h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{service.summary}</p>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </PublicShell>
  );
}
