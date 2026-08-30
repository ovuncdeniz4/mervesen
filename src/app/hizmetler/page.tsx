import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getClinicSettings, getPublishedServices } from "@/lib/clinic";
import { PublicShell } from "@/components/public/PublicShell";
import { serviceImageSrc } from "@/lib/public-image";

export const metadata: Metadata = { title: "Hizmetler" };

export default async function ServicesPage() {
  const [clinic, services] = await Promise.all([getClinicSettings(), getPublishedServices()]);
  return (
    <PublicShell clinic={clinic}>
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
        <h1 className="font-serif text-4xl text-espresso sm:text-5xl">Hizmetler</h1>
        <p className="mt-4 max-w-2xl text-muted">
          Koruyucu bakımdan estetik ve cerrahi tedavilere kadar, tek hekimle planlanan uygulamalar. Tedavi süresi kişiden
          kişiye değiştiği için sitede süre belirtilmez; planlama muayenede birlikte yapılır.
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const imageSrc = serviceImageSrc(service.slug, service.imagePath);
            return (
            <Link
              key={service.id}
              href={`/hizmetler/${service.slug}`}
              className="overflow-hidden rounded-lg border border-champagne bg-paper transition-colors hover:border-taupe"
            >
              {imageSrc ? (
                <span className="relative block aspect-[16/10]">
                  <Image
                    src={imageSrc}
                    alt={service.name}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 30vw, 100vw"
                  />
                </span>
              ) : null}
              <span className="block p-6">
                <h2 className="font-serif text-2xl text-espresso">{service.name}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">{service.summary}</p>
              </span>
            </Link>
            );
          })}
        </div>
      </div>
    </PublicShell>
  );
}
